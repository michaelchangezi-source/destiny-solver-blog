#!/usr/bin/env python3
"""
自建 Noto Serif TC 精簡字型（取代 next/font/google）。

背景（2026-08-07）：
next/font 對 Noto CJK 冇實際收窄作用，兩個字族合共產生 536 條 @font-face、
渲染阻塞 CSS 89 KB（壓縮後），手機首次下載 2.4 MB，PSI 手機效能長期卡喺 55。
內文改用系統 CJK 字（PingFang TC／微軟正黑／Noto Sans CJK，等於零下載），
標題保留 Noto Serif TC，但改成自行 subset 嘅自託管 woff2。

輸出兩層：
  core — 全站實際用 font-serif 算繪出嚟嘅字（掃 .next 產生嘅 HTML 得出），約 200 字，
         每個字重 ~53 KB，係唯一會被下載嘅檔。
  ext  — 安全網：所有文章標題／Markdown 標題／.tsx UI 字串。用 unicode-range 圈住整個
         CJK 區並排喺 core 之前，所以只有當出現 core 冇涵蓋嘅字時先會下載，
         平時零位元組。作用係防止日後加新標題時出現「一句入面兩隻字型」。

用法：
    npm run build          # 先出 .next HTML，core 字表由此掃出
    py -3 scripts\\build_font_subset.py
    npm run build          # 再 build 一次，令新 fonts.css 入到 bundle

改完會覆寫 public/fonts/*.woff2 同 src/app/fonts.css（兩者都要 commit）。
需要：py -3 -m pip install fonttools brotli
"""

from __future__ import annotations

import hashlib
import os
import re
import shutil
import sys
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "scripts", ".fontcache")
OUT_FONTS = os.path.join(ROOT, "public", "fonts")
OUT_CSS = os.path.join(ROOT, "src", "app", "fonts.css")
OUT_PRELOAD = os.path.join(ROOT, "src", "lib", "font-preload.ts")
NEXT_APP = os.path.join(ROOT, ".next", "server", "app")

SERIF_SRC_URL = (
    "https://github.com/notofonts/noto-cjk/raw/main/Serif/Variable/OTF/Subset/NotoSerifTC-VF.otf"
)
SERIF_SRC = os.path.join(CACHE, "NotoSerifTC-VF.otf")

WEIGHTS = [400, 700, 900]
FAMILY = "Noto Serif TC Subset"
# ext 安全網切幾多塊：塊數越多，漏字時付出嘅代價越細，但 CSS 嘅 unicode-range 越長。
# 10 塊＝每塊約 140 字／30 KB，CSS 只多約 3 KB（壓縮後）。
EXT_CHUNKS = 10

# 拉丁字母、數字、常用標點：Serif 標題會夾雜英文同數字，必須一齊入 core
LATIN = (
    "".join(chr(c) for c in range(0x20, 0x7F))
    + "".join(chr(c) for c in range(0xA0, 0x100))
    + "–—‘’“”…•·×→←▸▾★☆"
)

VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}


def is_cjk(ch: str) -> bool:
    o = ord(ch)
    return (
        0x2E80 <= o <= 0x2FFF
        or 0x3000 <= o <= 0x303F
        or 0x3100 <= o <= 0x312F
        or 0x3200 <= o <= 0x33FF
        or 0x3400 <= o <= 0x4DBF
        or 0x4E00 <= o <= 0x9FFF
        or 0xF900 <= o <= 0xFAFF
        or 0xFE30 <= o <= 0xFE4F
        or 0xFF00 <= o <= 0xFFEF
    )


# ── 1. core 字表：掃 .next 產生嘅 HTML，抽 font-serif 範圍內嘅文字 ──────────────

TAG_RE = re.compile(r"""<(/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>""")
ENTITY_RE = re.compile(r"&#x([0-9a-fA-F]+);|&#(\d+);|&(amp|lt|gt|quot|nbsp);")
CLASS_RE = re.compile(r"""class=["']([^"']*)["']""")
SERIF_CLASS_RE = re.compile(r"(^|\s)font-serif(\s|$)")
PROSE_CLASS_RE = re.compile(r"(^|\s)prose(\s|$)")

_ENT = {"amp": "&", "lt": "<", "gt": ">", "quot": '"', "nbsp": " "}


def unescape(t: str) -> str:
    def rep(m):
        if m.group(1):
            return chr(int(m.group(1), 16))
        if m.group(2):
            return chr(int(m.group(2)))
        return _ENT[m.group(3)]

    return ENTITY_RE.sub(rep, t)


def scan_html(path: str, serif: set[str]) -> None:
    """抽出所有 font-serif 祖先範圍內嘅文字，另加 .prose 首段首字（首字大寫朱批用 serif 900）。"""
    html = open(path, encoding="utf-8", errors="ignore").read()
    stack: list[tuple[str, bool]] = []
    serif_depth = 0
    skip_depth = 0
    prose_depth = 0
    want_dropcap = False   # 喺 prose 內遇到第一個 <p> 時，收第一個字
    dropcap_done = False
    last = 0

    for m in TAG_RE.finditer(html):
        text = html[last:m.start()]
        if text and skip_depth == 0:
            if serif_depth > 0:
                serif.update(unescape(text))
            if want_dropcap:
                clean = unescape(text).strip()
                if clean:
                    serif.add(clean[0])
                    want_dropcap = False
                    dropcap_done = True
        last = m.end()

        closing = m.group(1) == "/"
        tag = m.group(2).lower()
        attrs = m.group(3) or ""
        self_close = attrs.rstrip().endswith("/") or tag in VOID_TAGS

        if tag in ("script", "style"):
            if closing:
                skip_depth = max(0, skip_depth - 1)
            elif not self_close:
                skip_depth += 1
            continue

        if closing:
            for i in range(len(stack) - 1, -1, -1):
                if stack[i][0] == tag:
                    for j in range(len(stack) - 1, i - 1, -1):
                        if stack[j][1]:
                            serif_depth -= 1
                    del stack[i:]
                    break
            continue

        if self_close:
            continue

        cm = CLASS_RE.search(attrs)
        cls = cm.group(1) if cm else ""
        is_serif = bool(cls) and bool(SERIF_CLASS_RE.search(cls))
        if cls and PROSE_CLASS_RE.search(cls):
            prose_depth += 1
        if prose_depth > 0 and tag == "p" and not dropcap_done:
            want_dropcap = True
        if is_serif:
            serif_depth += 1
        stack.append((tag, is_serif))

    tail = html[last:]
    if tail and skip_depth == 0 and serif_depth > 0:
        serif.update(unescape(tail))


def collect_core() -> set[str]:
    if not os.path.isdir(NEXT_APP):
        sys.exit(
            "找唔到 .next/server/app —— core 字表要由 build 出嚟嘅 HTML 掃。\n"
            "請先跑 `npm run build`，再跑呢個 script。"
        )
    serif: set[str] = set()
    n = 0
    for dirpath, _dirnames, filenames in os.walk(NEXT_APP):
        for fn in filenames:
            if fn.endswith(".html"):
                scan_html(os.path.join(dirpath, fn), serif)
                n += 1
    print(f"  掃咗 {n} 個 prerender HTML")
    return {c for c in serif if is_cjk(c)}


# ── 1b. 動態字表：每日／每次輸入都會變，build HTML 快照捉唔到 ──────────────────
#
# 2026-08-08 踩過嘅坑：core 字表只掃 build 當日嘅 HTML，但首頁 hero 有三格係每日變嘅
# serif 內容 —— 今日天干（900）、地支（700）、今日能量標題（900）。嗰日 build 出嚟啱好
# 係「金木相剋」，第二日變咗「木火相生，擴張之日」，「擴」「張」兩隻字唔喺 core，
# 結果瀏覽器為咗兩隻字拉咗成個 299 KB 嘅 ext-900，卡死 LCP，PSI 手機由 90+ 跌返落 72。
#
# 呢批字係可以窮舉嘅（干支固定 22 個、五行 5 個、energyTitle 得 15 個組合），
# 所以一律硬性收入 core，唔靠 HTML 快照。
# 對應嘅 serif 位置：InkFlowHero 天干/地支/energyTitle、daily 頁 stem/branch/五行條/h2、
# BaziCalculator 同 CompatCalculator 嘅四柱天干地支藏干。

STEMS_BRANCHES = "甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥木火土金水"


def collect_dynamic() -> set[str]:
    chars = set(STEMS_BRANCHES)
    daily = os.path.join(ROOT, "src", "lib", "bazi-daily.ts")
    if os.path.exists(daily):
        t = open(daily, encoding="utf-8", errors="ignore").read()
        titles = re.findall(r"^\s*title:\s*'([^']*)'", t, re.M)
        if not titles:
            sys.exit("collect_dynamic：喺 bazi-daily.ts 搵唔到任何 title:，格式可能改咗，唔好靜靜哋放行")
        for s in titles:
            chars.update(c for c in s if is_cjk(c))
    return chars


# ── 2. ext 字表：所有可能日後行到 serif 嘅字（安全網，平時唔下載）──────────────

def collect_ext() -> set[str]:
    chars: set[str] = set()

    adir = os.path.join(ROOT, "content", "articles")
    if os.path.isdir(adir):
        for fn in sorted(os.listdir(adir)):
            if not fn.endswith(".md"):
                continue
            t = open(os.path.join(adir, fn), encoding="utf-8", errors="ignore").read()
            m = re.match(r"^---\n(.*?)\n---\n(.*)$", t, re.S)
            fm, body = (m.group(1), m.group(2)) if m else ("", t)
            for line in fm.splitlines():
                key = line.split(":")[0].strip()
                if key in ("title", "category", "tags", "excerpt", "description"):
                    chars.update(c for c in line if is_cjk(c))
            for line in body.splitlines():
                if line.startswith("#"):
                    chars.update(c for c in line if is_cjk(c))
            for line in body.splitlines():
                s = line.strip()
                if s and s[0] not in "#>-*|!`":
                    if is_cjk(s[0]):
                        chars.add(s[0])
                    break

    for dirpath, dirnames, filenames in os.walk(os.path.join(ROOT, "src")):
        dirnames[:] = [d for d in dirnames if d not in {"node_modules", ".next"}]
        for fn in filenames:
            if fn.endswith(".tsx"):
                t = open(os.path.join(dirpath, fn), encoding="utf-8", errors="ignore").read()
                chars.update(c for c in t if is_cjk(c))

    return chars


# ── 3. subset ────────────────────────────────────────────────────────────────

def ensure_source() -> None:
    os.makedirs(CACHE, exist_ok=True)
    if os.path.exists(SERIF_SRC) and os.path.getsize(SERIF_SRC) > 1_000_000:
        return
    print("  下載 NotoSerifTC-VF.otf（約 15 MB，只需一次）…")
    urllib.request.urlretrieve(SERIF_SRC_URL, SERIF_SRC)


def make_faces(text: str, tag: str) -> dict[int, tuple[str, int]]:
    """回傳 {weight: (檔名, 位元組)}。先 subset 再 instance，快好多。"""
    opts = subset.Options()
    opts.layout_features = ["ccmp", "locl", "kern", "liga", "clig", "mark", "mkmk"]
    opts.hinting = False
    opts.desubroutinize = False
    opts.notdef_outline = False
    opts.name_IDs = ["*"]
    opts.drop_tables += ["VORG"]

    font = TTFont(SERIF_SRC)
    sub = subset.Subsetter(options=opts)
    sub.populate(text=text)
    sub.subset(font)
    tmp = os.path.join(CACHE, f"_{tag}.otf")
    font.save(tmp)

    out: dict[int, tuple[str, int]] = {}
    for w in WEIGHTS:
        f = TTFont(tmp)
        instancer.instantiateVariableFont(f, {"wght": w}, inplace=True, updateFontNames=False)
        f.flavor = "woff2"
        raw = os.path.join(CACHE, f"_{tag}-{w}.woff2")
        f.save(raw)
        digest = hashlib.sha1(open(raw, "rb").read()).hexdigest()[:8]
        name = f"serif-tc-{tag}-{w}.{digest}.woff2"
        shutil.copyfile(raw, os.path.join(OUT_FONTS, name))
        out[w] = (name, os.path.getsize(raw))
        os.remove(raw)
    os.remove(tmp)
    return out


def to_ranges(chars: set[str]) -> str:
    pts = sorted(ord(c) for c in chars)
    parts, start, prev = [], pts[0], pts[0]
    for p in pts[1:]:
        if p == prev + 1:
            prev = p
            continue
        parts.append(f"U+{start:X}" if start == prev else f"U+{start:X}-{prev:X}")
        start = prev = p
    parts.append(f"U+{start:X}" if start == prev else f"U+{start:X}-{prev:X}")
    return ",".join(parts)


def face_rule(family: str, weight: int, filename: str, urange: str) -> list[str]:
    return [
        "@font-face {",
        f"  font-family: '{family}';",
        "  font-style: normal;",
        f"  font-weight: {weight};",
        "  font-display: swap;",
        f"  src: url('/fonts/{filename}') format('woff2');",
        f"  unicode-range: {urange};",
        "}",
    ]


def main() -> None:
    print("1. 收集字表")
    html_core = collect_core()
    dynamic = collect_dynamic()
    core = html_core | dynamic
    ext = collect_ext() - core
    print(f"  core = HTML 快照 {len(html_core)} 字 ＋ 動態詞彙 {len(dynamic)} 字 = {len(core)} 字")
    print(f"  ext （安全網）: {len(ext)} 字，切 {EXT_CHUNKS} 塊")

    core_text = "".join(sorted(core)) + LATIN

    print("2. 準備來源字型")
    ensure_source()

    os.makedirs(OUT_FONTS, exist_ok=True)
    for fn in os.listdir(OUT_FONTS):
        if fn.startswith("serif-tc-") and fn.endswith(".woff2"):
            os.remove(os.path.join(OUT_FONTS, fn))

    print("3. 切字型")
    core_faces = make_faces(core_text, "core")
    for w in WEIGHTS:
        print(f"  core {w}: {core_faces[w][1] / 1024:6.1f} KB")

    # ext 切細：原本一整塊 299 KB，只要有一隻字唔喺 core 就要全塊落嚟，代價太重
    # （2026-08-08 就係咁跌返落 72 分）。切細之後同樣情況只付一塊約 30 KB。
    ext_sorted = sorted(ext)
    size = -(-len(ext_sorted) // EXT_CHUNKS) if ext_sorted else 0
    chunks = [ext_sorted[i:i + size] for i in range(0, len(ext_sorted), size)] if size else []
    chunk_faces = []
    for idx, chunk in enumerate(chunks):
        faces = make_faces("".join(chunk), f"ext{idx}")
        chunk_faces.append((faces, to_ranges(set(chunk))))
        print(f"  ext{idx} ({len(chunk)} 字): " + "／".join(f"{faces[w][1] / 1024:.0f} KB" for w in WEIGHTS))

    core_range = to_ranges(set(core_text))

    lines = [
        "/* 由 scripts/build_font_subset.py 自動生成，唔好人手改。",
        f"   core {len(core)} 字（HTML 快照＋動態詞彙）/ ext {len(ext)} 字切 {len(chunks)} 塊。",
        "   改完 font-serif 標題文案要重跑 script 再 commit。 */",
        "",
    ]
    # ext 排前、core 排後：重疊時 CSS 後定義者優先，確保 core 有嘅字唔會去攞 ext
    for faces, urange in chunk_faces:
        for w in WEIGHTS:
            lines += face_rule(FAMILY, w, faces[w][0], urange)
    for w in WEIGHTS:
        lines += face_rule(FAMILY, w, core_faces[w][0], core_range)
    open(OUT_CSS, "w", encoding="utf-8", newline="\n").write("\n".join(lines) + "\n")

    # 首頁首屏 serif：hero H1／天干／能量標題係 900，地支係 700，兩個都喺 above-the-fold，
    # 唔 preload 就要等 CSS 解析完先發現要攞（PSI 量到 core-700 排喺關鍵鏈 725ms）。
    # 檔名帶內容雜湊，所以由 script 一齊生成，避免人手同 CSS 脫節。
    open(OUT_PRELOAD, "w", encoding="utf-8", newline="\n").write(
        "// 由 scripts/build_font_subset.py 自動生成，唔好人手改。\n"
        "// 首頁 above-the-fold 用到嘅字重，page.tsx 會 preload 佢哋。\n"
        f"export const CRITICAL_FONTS = [\n"
        f"  '/fonts/{core_faces[900][0]}',\n"
        f"  '/fonts/{core_faces[700][0]}',\n"
        f"] as const\n"
    )

    total = sum(core_faces[w][1] for w in WEIGHTS)
    print(f"4. 完成 — 常態下載總量 {total / 1024:.0f} KB（core ×3 字重）")
    print(f"   preload：core-900 ＋ core-700")
    print("   記得再跑一次 npm run build，然後 commit public/fonts 同 src/app/fonts.css")


if __name__ == "__main__":
    main()
