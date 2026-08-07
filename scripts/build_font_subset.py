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


def main() -> None:
    print("1. 收集字表")
    core = collect_core()
    ext = collect_ext() - core
    print(f"  core（實際 serif 算繪）: {len(core)} 字")
    print(f"  ext （安全網）        : {len(ext)} 字")

    core_text = "".join(sorted(core)) + LATIN
    ext_text = "".join(sorted(ext))

    print("2. 準備來源字型")
    ensure_source()

    os.makedirs(OUT_FONTS, exist_ok=True)
    for fn in os.listdir(OUT_FONTS):
        if fn.startswith("serif-tc-") and fn.endswith(".woff2"):
            os.remove(os.path.join(OUT_FONTS, fn))

    print("3. 切字型")
    core_faces = make_faces(core_text, "core")
    ext_faces = make_faces(ext_text, "ext")
    for w in WEIGHTS:
        print(f"  core {w}: {core_faces[w][1] / 1024:6.1f} KB   ext {w}: {ext_faces[w][1] / 1024:7.1f} KB")

    core_range = to_ranges(set(core_text))
    # ext 用闊 range 圈住整個 CJK 區：檔案入面冇嘅字，瀏覽器會自動跌落系統宋體，
    # 唔會出現豆腐方格。core 排喺後面，重疊字元由 core 勝出（CSS 後定義者優先）。
    ext_range = "U+2E80-2FFF,U+3000-303F,U+3100-312F,U+3200-33FF,U+3400-4DBF,U+4E00-9FFF,U+F900-FAFF,U+FE30-FE4F,U+FF00-FFEF"

    lines = [
        "/* 由 scripts/build_font_subset.py 自動生成，唔好人手改。",
        f"   core {len(core)} 字 / ext {len(ext)} 字；改完標題文案要重跑 script 再 commit。 */",
        "",
    ]
    for w in WEIGHTS:
        lines += [
            "@font-face {",
            f"  font-family: '{FAMILY}';",
            "  font-style: normal;",
            f"  font-weight: {w};",
            "  font-display: swap;",
            f"  src: url('/fonts/{ext_faces[w][0]}') format('woff2');",
            f"  unicode-range: {ext_range};",
            "}",
        ]
    for w in WEIGHTS:
        lines += [
            "@font-face {",
            f"  font-family: '{FAMILY}';",
            "  font-style: normal;",
            f"  font-weight: {w};",
            "  font-display: swap;",
            f"  src: url('/fonts/{core_faces[w][0]}') format('woff2');",
            f"  unicode-range: {core_range};",
            "}",
        ]
    open(OUT_CSS, "w", encoding="utf-8", newline="\n").write("\n".join(lines) + "\n")

    # 首頁 LCP 元素係 hero H1（font-serif font-black＝900），preload 佢一個就夠；
    # 檔名帶內容雜湊，所以由 script 一齊生成，避免人手同 CSS 脫節。
    open(OUT_PRELOAD, "w", encoding="utf-8", newline="\n").write(
        "// 由 scripts/build_font_subset.py 自動生成，唔好人手改。\n"
        "// 首屏 LCP（首頁 hero H1）用嘅字重，layout 會 <link rel=preload> 佢。\n"
        f"export const CRITICAL_FONT = '/fonts/{core_faces[900][0]}'\n"
    )

    total = sum(core_faces[w][1] for w in WEIGHTS)
    print(f"4. 完成 — 常態下載總量 {total / 1024:.0f} KB（core ×3 字重）")
    print(f"   preload 目標：/fonts/{core_faces[900][0]}")
    print("   記得再跑一次 npm run build，然後 commit public/fonts 同 src/app/fonts.css")


if __name__ == "__main__":
    main()
