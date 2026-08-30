#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
publish_to_web.py — 把每週生成的命理帖文同步到個人網站「最新文章」欄目。

由 ds-weekly-batch 每週任務在生成 7 篇帖文後呼叫。
讀取 staging 目錄的 manifest.json，為每篇帖文：
  1. 在 content/articles/ 寫入帶 frontmatter 的 markdown
  2. 把第一張 IG 圖複製到 public/images/covers/ 作封面
最後 git commit + push origin main，Vercel 自動部署。

manifest.json 格式（陣列，每篇一個物件）：
[
  {
    "title": "短標題（≤30字，必填）",
    "category": "感情格局",          // 網站分類：感情格局／事業財運／八字基礎…
    "body_file": "C:/.../backup.md", // 帖文正文 .md（第一行為 hook）
    "cover_file": "C:/.../slide_01.jpg",
    "date": "2026-08-17"             // ⚠️ 必填 Threads 發布日（非批次當日！）
                                     // 週批次第 N 篇 = next_monday + N-1 天
                                     // 此日期決定文章在網站的 publishedAt，
                                     // 填錯（如填批次當日）會令 7 篇同日全部上線。
  }
]

用法：
  python publish_to_web.py                         # 用預設 staging，並 push
  python publish_to_web.py --staging DIR --no-push # 測試用，不 push
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
import urllib.request
from datetime import datetime, timedelta
from pathlib import Path

WEBSITE_ROOT = Path(__file__).resolve().parent.parent
ARTICLES_DIR = WEBSITE_ROOT / "content" / "articles"
COVERS_DIR = WEBSITE_ROOT / "public" / "images" / "covers"
DEFAULT_STAGING = Path("C:/Users/micha/destiny-solver-web-staging")

# IndexNow：出文後即時通知搜尋引擎（Bing/Yandex 等，間接惠及部分 AI 搜尋）。
# 金鑰驗證檔須長期存在於 public/{KEY}.txt 並已部署上線。
SITE_URL = "https://www.destinysolver.com"
INDEXNOW_KEY = "89a823e9a77b875b3fea063c5a24ff64"

INVALID_FILENAME = re.compile(r'[\\/:*?"<>|\r\n]+')


def safe_title(title: str) -> str:
    """標題轉成安全檔名後綴（保留中文，去掉非法字元）。"""
    t = INVALID_FILENAME.sub("", title).strip()
    t = re.sub(r"\s+", "-", t)
    return t[:40] or "untitled"


def strip_md(text: str) -> str:
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"`(.*?)`", r"\1", text)
    text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)
    return text.strip()


def _norm(s: str) -> str:
    return re.sub(r"[，。：、？！「」『』\s,.:?!\"'…]", "", s)


def strip_frontmatter(raw: str) -> str:
    """Strip YAML frontmatter (--- ... ---) if present."""
    stripped = raw.lstrip()
    if stripped.startswith("---"):
        after_open = stripped[3:]
        close_idx = after_open.find("\n---")
        if close_idx != -1:
            return after_open[close_idx + 4:].lstrip("\n")
    return raw


def parse_body(raw: str, title: str = ""):
    """回傳 (摘要, 正文)。摘要取首段；若首段與標題幾乎相同（標題本身就是 hook），
    改用第二段做摘要。正文一律去掉已用作標題/摘要的開頭段落，避免重複。"""
    paras = [strip_md(ln.strip()) for ln in raw.splitlines() if ln.strip() and ln.strip() != "---"]
    hook = paras[0] if paras else ""
    nt, nh = _norm(title), _norm(hook)
    title_is_hook = bool(title and nt) and (nt == nh or nt in nh or nh in nt)
    if title_is_hook:
        excerpt = paras[1] if len(paras) > 1 else hook
        drop = 2  # 去掉 hook + 已用作摘要的第二段
    else:
        excerpt = hook
        drop = 1  # 去掉 hook（已用作摘要）
    # 正文：跳過開頭 drop 個內容段落，再略過緊接的空行/分隔線
    out, dropped, started = [], 0, False
    for ln in raw.splitlines():
        s = ln.strip()
        if not started:
            if s and s != "---":
                dropped += 1
                if dropped >= drop:
                    started = True
                continue
            continue  # 跳過開頭的空行與 ---
        out.append(ln)
    # 去除正文最前殘留的空行與分隔線
    body = "\n".join(out).strip()
    body = re.sub(r"^(?:-{3,}\s*)+", "", body).strip()
    return excerpt, body


def make_excerpt(hook: str, limit: int = 96) -> str:
    e = hook.replace('"', "'")
    return (e[:limit] + "…") if len(e) > limit else e


_SEO_KEYWORDS = ["八字", "命理", "十神", "大運", "流年", "五行", "格局", "命盤", "干支", "命局"]


def make_seo_description(body: str, title: str, category: str,
                         min_len: int = 80, max_len: int = 150) -> str:
    """從正文煉出 80-150 字 SEO 摘要：完整句、去破折號、含關鍵詞、不留省略號。
    與 backfill_descriptions.py 同一套規則，確保新舊帖一致。"""
    lines = []
    for ln in body.split("\n"):
        s = ln.strip()
        if not s or s == "---" or s.startswith("#") or s.startswith("|") or s.startswith(">"):
            continue
        s = re.sub(r"^[-*+]\s+", "", s)
        s = re.sub(r"^\d+[\.\)]\s+", "", s)
        s = strip_md(s)
        if s:
            lines.append(s)
    text = " ".join(lines).replace("——", "，").replace("—", "，").replace("--", "，")
    text = re.sub(r"，{2,}", "，", text)
    sentences = [x.strip() for x in re.findall(r"[^。！？]*[。！？]", text) if x.strip()]
    if not sentences:
        return ""

    nt = _norm(title)
    desc = ""
    for sent in sentences:
        ns = _norm(sent)
        if not desc and nt and (ns == nt or ns in nt or nt in ns):
            continue
        if not desc:
            desc = sent
        elif len(desc) + len(sent) > max_len:
            break
        else:
            desc += sent
        if len(desc) >= min_len:
            break

    if len(desc) > max_len:
        cut = max(desc.rfind("。", 0, max_len), desc.rfind("！", 0, max_len), desc.rfind("？", 0, max_len))
        desc = desc[: cut + 1] if cut > min_len else desc[:max_len]

    if desc and not any(k in desc for k in _SEO_KEYWORDS):
        tail = f"從八字命理角度，解析{category}。"
        if len(desc) + len(tail) <= max_len + 12:
            desc += tail
    return desc.strip().replace('"', "'")


def yaml_escape(s: str) -> str:
    return s.replace('"', '\\"')


# 網站只認得 src/types/index.ts 的 CATEGORY_SLUGS 十個分類；
# 寫入未登記的分類，分類頁會直接爆錯，而且該網址會混入 sitemap 變成壞連結。
# 這裡把常見同義寫法收斂回正式名稱，未知的一律退回預設並警告。
CANONICAL_CATEGORIES = {
    "八字基礎", "干支詳解", "十神應用", "命盤格局", "實戰斷命",
    "大運流年", "感情格局", "事業財運", "健康命理", "風水地理",
}
# 週六批次嘅內部三分類（兩性／職場／基礎）有機會原封不動寫入 manifest，
# 呢度要三條齊全。2026-08-05 之前漏咗「兩性關係」一條，導致所有漏轉嘅感情題
# 文章（三分類入面最多產嗰類）跌落未登記分支，再被靜默退回「八字基礎」。
CATEGORY_ALIASES = {
    "基礎知識": "八字基礎",
    "職場現象": "事業財運",
    "兩性關係": "感情格局",
}


def normalize_category(raw: str, title: str = "") -> str:
    """把分類收斂回十個正式名稱。收斂唔到就直接中止，唔准靜靜退回預設值。

    歷史教訓（2026-08-05）：舊版喺收唔到分類時會靜靜退回「八字基礎」，
    只印一行警告。因為週六批次係自動跑、冇人望 console，結果一批感情題
    文章被錯標成八字基礎，過咗幾個星期先發現。靜默 fallback 係呢個 bug
    嘅根源，所以而家一律 fail fast：寧願出文中止，都好過分類靜靜錯。
    """
    name = (raw or "").strip()
    if name in CANONICAL_CATEGORIES:
        return name
    mapped = CATEGORY_ALIASES.get(name)
    if mapped:
        print(f"  [!] 分類「{name}」未登記，已自動歸入「{mapped}」")
        return mapped

    where = f"（文章：{title}）" if title else ""
    if not name:
        raise SystemExit(
            f"[中止] manifest 有一篇冇填 category{where}。\n"
            f"       category 係必填欄，唔可以留空。\n"
            f"       可選分類：{'、'.join(sorted(CANONICAL_CATEGORIES))}"
        )
    raise SystemExit(
        f"[中止] 分類「{name}」未登記{where}。\n"
        f"       可選分類：{'、'.join(sorted(CANONICAL_CATEGORIES))}\n"
        f"       如果呢個係新同義寫法，去 CATEGORY_ALIASES 補一條對應再跑。"
    )


def clean_stale_for_slug(slug: str) -> None:
    """寫入新文章前，清理同一 slug 前綴的舊殘留檔案。

    問題根源（2026-08-15 教訓）：每次跑此 script 都根據 manifest 內容生成檔名。
    若 manifest 中途改過（如修分類、改標題），再跑會生成不同檔名，但舊檔案不會
    自動刪除，結果同一 slug（如 post-20260815-05）在 content/articles 和
    public/images/covers 同時存在多個版本，網站顯示時出現重複文章。
    此函式於每篇寫入前先刪舊，確保一個 slug 只對應一個檔案。
    """
    if ARTICLES_DIR.exists():
        for old in ARTICLES_DIR.glob(f"{slug}-*.md"):
            old.unlink()
            print(f"  [clean] 刪舊殘留：{old.name}")
    old_cover = COVERS_DIR / f"{slug}.jpg"
    if old_cover.exists():
        old_cover.unlink()
        print(f"  [clean] 刪舊封面：{old_cover.name}")


def build_article(entry: dict, seq: int, date_str: str) -> Path:
    title = entry["title"].strip()
    category = normalize_category(entry.get("category", ""), title)
    body_file = Path(entry["body_file"])
    cover_file = Path(entry["cover_file"])

    raw = body_file.read_text(encoding="utf-8")
    raw = strip_frontmatter(raw)
    excerpt, body = parse_body(raw, title)
    # CommonMark 不渲染緊鄰 CJK 的 **...**，原字輸出；在入庫前統一剝除
    body   = re.sub(r'\*\*(.*?)\*\*', r'\1', body,   flags=re.DOTALL)
    excerpt = re.sub(r'\*\*(.*?)\*\*', r'\1', excerpt, flags=re.DOTALL)
    description = make_seo_description(body, title, category)
    excerpt = make_excerpt(excerpt)

    date_compact = date_str.replace("-", "")
    slug = f"post-{date_compact}-{seq:02d}"
    clean_stale_for_slug(slug)  # 先清同 slug 的舊殘留，防多版本並存
    # 發佈時間：同日內依序遞減，確保 seq=1 排最前
    base = datetime.strptime(date_str, "%Y-%m-%d").replace(hour=0, minute=0, second=0)
    published = base.strftime("%Y-%m-%dT%H:%M:%S+08:00")

    # 複製封面圖（支援本機路徑或 http(s) URL）
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    cover_dest = COVERS_DIR / f"{slug}.jpg"
    cover_src = str(entry["cover_file"])
    if cover_src.startswith("http://") or cover_src.startswith("https://"):
        req = urllib.request.Request(cover_src, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as r, open(cover_dest, "wb") as f:
            f.write(r.read())
    else:
        shutil.copyfile(cover_file, cover_dest)

    tags = [t for t in ["八字", "命理", category] if t]
    frontmatter = (
        "---\n"
        f'title: "{yaml_escape(title)}"\n'
        f'slug: "{slug}"\n'
        f'excerpt: "{yaml_escape(excerpt)}"\n'
        f'description: "{yaml_escape(description)}"\n'
        f'category: "{category}"\n'
        f'tags: [{", ".join(chr(34) + t + chr(34) for t in tags)}]\n'
        f'coverImage: "/images/covers/{slug}.jpg"\n'
        f'publishedAt: "{published}"\n'
        "isPaid: false\n"
        "---\n\n"
    )

    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)
    out_path = ARTICLES_DIR / f"{slug}-{safe_title(title)}.md"
    out_path.write_text(frontmatter + body + "\n", encoding="utf-8")
    print(f"  [{seq:02d}] {slug}  {title}  ({category})")
    return out_path, slug


def git(args, check=True):
    return subprocess.run(["git", "-C", str(WEBSITE_ROOT), *args],
                          check=check, capture_output=True, text=True)


def ping_indexnow(slugs):
    """提交新文章網址至 IndexNow，即時通知搜尋引擎收錄。失敗只警告不中斷。"""
    if not slugs:
        return
    url_list = [f"{SITE_URL}/articles/{s}" for s in slugs]
    payload = {
        "host": SITE_URL.replace("https://", ""),
        "key": INDEXNOW_KEY,
        "keyLocation": f"{SITE_URL}/{INDEXNOW_KEY}.txt",
        "urlList": url_list,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        "https://api.indexnow.org/IndexNow",
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"IndexNow 已通知 {len(url_list)} 條網址（HTTP {r.status}）。")
    except Exception as e:
        print(f"[!] IndexNow 通知失敗（不影響發佈）：{e}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--staging", default=str(DEFAULT_STAGING))
    ap.add_argument("--no-push", action="store_true", help="只生成文件，不 git push")
    args = ap.parse_args()

    staging = Path(args.staging)
    manifest_path = staging / "manifest.json"
    if not manifest_path.exists():
        print(f"找不到 manifest：{manifest_path}")
        sys.exit(1)

    entries = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not entries:
        print("manifest 為空，無事可做。")
        return

    # 前置檢查 1：驗分類，全部過先開始寫檔。
    # 唔做呢步嘅話，第 5 篇分類出錯中止時，頭 4 篇已經落咗檔，要人手清理。
    for i, entry in enumerate(entries, start=1):
        normalize_category(entry.get("category", ""), entry.get("title", f"第 {i} 篇"))
    print(f"分類檢查通過：{len(entries)} 篇全部有合法分類。")

    # 前置檢查 2：日期多元性。週批次 7 篇應各有不同日期（Threads 發布日）。
    # 若 3 篇以上共用同一日期，通常意味 manifest 的 date 欄填了批次當日，
    # 而非每篇各自的 Threads 發布日——此情況會令多篇同日同時在網站出現，
    # 違反「發布當日才上線」原則（2026-08-15 教訓）。
    today = datetime.now().strftime("%Y-%m-%d")
    from collections import Counter
    date_counts = Counter(entry.get("date", today) for entry in entries)
    if len(entries) >= 3:
        for d, cnt in date_counts.items():
            if cnt >= 3:
                raise SystemExit(
                    f"[中止] {cnt} 篇共用同一日期「{d}」。\n"
                    f"       週批次每篇應填 Threads 發布日（next_monday + N-1 天），\n"
                    f"       而非批次當日。請更新 manifest.json 各篇的 date 欄再重跑。\n"
                    f"       範例：第 1 篇=週一日期、第 2 篇=週二日期……第 7 篇=週日日期。"
                )

    print(f"同步 {len(entries)} 篇最新文章至網站…")
    written, slugs, failed = [], [], []
    for i, entry in enumerate(entries, start=1):
        date_str = entry.get("date", today)
        try:
            path, slug = build_article(entry, i, date_str)
            written.append(path)
            slugs.append(slug)
        except Exception as e:
            title = entry.get("title", "")
            failed.append((i, title, str(e)))
            print(f"  [!] 第 {i} 篇失敗：{e}")

    if not written:
        print("沒有成功生成任何文章。")
        sys.exit(1)

    # 有任何一篇失敗就中止，唔好靜靜出半批上線。
    # 舊版只印一行警告然後照 commit + push，7 篇死咗 3 篇都會照出 4 篇，
    # 而週六批次係自動跑冇人望 console，等於靜默漏文。同 2026-08-05 嗰個
    # 分類靜默 fallback 係同一類病，一併收拾。
    if failed:
        print(f"\n[中止] {len(entries)} 篇之中有 {len(failed)} 篇生成失敗，唔會 commit／push：")
        for i, title, err in failed:
            print(f"       第 {i} 篇「{title}」：{err}")
        print(f"\n       已寫入 {len(written)} 個檔案，需要人手決定保留定刪除：")
        for p in written:
            print(f"       - {p}")
        print("\n       修好 manifest 之後重跑；已寫入嘅檔案會被覆蓋，唔會重複。")
        sys.exit(1)

    # 出文前 checker：確認每篇 article 檔案＋封面圖都存在，唔存在即中止
    missing = []
    for p, slug in zip(written, slugs):
        if not p.exists():
            missing.append(f"文章檔案不存在：{p}")
        cover_chk = COVERS_DIR / f"{slug}.jpg"
        if not cover_chk.exists():
            missing.append(f"封面圖不存在：{cover_chk}")
    if missing:
        print("[中止] Checker 發現以下問題，唔會 push：")
        for m in missing:
            print(f"       {m}")
        sys.exit(1)
    print(f"Checker 通過：{len(written)} 篇文章及封面圖全部到位。")

    # 出文前 checker 2：批次內封面圖重複偵測（2026-08-20 加）
    # 病因：gen_html 批量生成時若某篇 cover_file 路徑重複，複數篇會拿到同一張圖，
    # 導致網站上多篇文章共用同一封面，視覺上完全看不出來，只有 hash 比對才能察覺。
    # 此 checker 只比對本次批次的封面，不影響跨批次同款模板（屬正常設計）。
    import hashlib
    def _md5(path: Path) -> str:
        return hashlib.md5(path.read_bytes()).hexdigest()

    cover_hashes: dict[str, str] = {}  # hash → slug
    dup_covers = []
    for slug in slugs:
        cover_path = COVERS_DIR / f"{slug}.jpg"
        if cover_path.exists():
            h = _md5(cover_path)
            if h in cover_hashes:
                dup_covers.append((cover_hashes[h], slug, h[:8]))
            else:
                cover_hashes[h] = slug
    if dup_covers:
        print("\n[中止] 批次內發現重複封面圖，唔會 push：")
        for s1, s2, h in dup_covers:
            print(f"       {s1}.jpg 同 {s2}.jpg 內容完全相同（MD5 前綴 {h}）")
        print("\n       根本原因通常係 manifest 內有兩篇 cover_file 指向同一個檔案。")
        print("       修好 manifest 重新生成封面後重跑。")
        sys.exit(1)
    print(f"封面重複偵測通過：本批次 {len(slugs)} 張封面全部唯一。")

    # 出文前 checker 3：封面圖來源吻合驗證（2026-08-26 加）
    # 病因：manifest 的 cover_file 若填咗舊批次的 slide_01 路徑，shutil.copyfile
    # 照複製，checker 1/2 睇唔出（存在且唔重複），但圖文不符。
    # 此 checker 比對 COVERS_DIR/{slug}.jpg 與 manifest 原始 cover_file 的 MD5。
    cover_mismatch = []
    for entry, slug in zip(entries, slugs):
        cover_src = str(entry.get("cover_file", ""))
        if not cover_src or cover_src.startswith("http://") or cover_src.startswith("https://"):
            continue  # URL 來源跳過（無本機檔可比）
        src_path = Path(cover_src)
        dest_path = COVERS_DIR / f"{slug}.jpg"
        if src_path.exists() and dest_path.exists():
            if _md5(src_path) != _md5(dest_path):
                cover_mismatch.append((slug, cover_src))
    if cover_mismatch:
        print("\n[中止] 封面圖來源吻合驗證失敗，唔會 push：")
        for slug, src in cover_mismatch:
            print(f"       {slug}.jpg 與來源 {src} 內容唔吻合")
            print(f"       （複製出錯，或 manifest 的 cover_file 填咗舊批次圖）")
        sys.exit(1)
    print(f"封面來源吻合驗證通過：本批次 {len(slugs)} 張封面與 manifest 來源一致。")

    # 出文前 checker 4：跨批次封面圖重複掃描（2026-08-26 加）
    # 病因（2026-08-26 真實案例）：post-20260826-03.jpg 被複製咗 post-20260815-03 的圖，
    # 導致網站上兩篇文章共用同一封面，checker 2 對批次內唔重複，但跨批次睇唔到。
    # 此 checker 把本批次所有封面 hash 逐一與 COVERS_DIR 全部現有封面比對。
    existing_covers: dict[str, str] = {}  # hash → existing filename
    if COVERS_DIR.exists():
        for f in COVERS_DIR.glob("*.jpg"):
            if f.stem not in slugs:  # 排除本批次自己（已由 checker 2 處理）
                existing_covers[_md5(f)] = f.name
    cross_dups = []
    for slug in slugs:
        cover_path = COVERS_DIR / f"{slug}.jpg"
        if cover_path.exists():
            h = _md5(cover_path)
            if h in existing_covers:
                cross_dups.append((slug, existing_covers[h]))
    if cross_dups:
        print("\n[中止] 本批次封面與現有封面重複，唔會 push：")
        for new_slug, old_file in cross_dups:
            print(f"       {new_slug}.jpg 內容與舊封面 {old_file} 完全相同")
        print("\n       請確認 manifest 的 cover_file 路徑正確指向今週的 slide_01.jpg。")
        sys.exit(1)
    print(f"跨批次封面唯一性通過：本批次 {len(slugs)} 張封面與全站現有封面均不重複。")

    if args.no_push:
        print(f"完成（--no-push）：已生成 {len(written)} 篇，未 push。")
        return

    git(["add", "-A"])
    status = git(["status", "--porcelain"]).stdout.strip()
    if not status:
        print("無變更可提交。")
        return
    msg = f"feat: 同步 {len(written)} 篇最新文章至網站 ({today})"
    git(["commit", "-m", msg])
    push = git(["push", "origin", "main"], check=False)
    if push.returncode != 0:
        print("git push 失敗：")
        print(push.stderr)
        sys.exit(1)
    print(f"已 push origin main，Vercel 將自動部署。commit：{msg}")

    # 通知 IndexNow（即時收錄；URL 短暫未部署完不影響，搜尋引擎稍後才實際爬取）
    ping_indexnow(slugs)

    # 封存已處理的 manifest，避免下週重複
    archive = staging / f"manifest_done_{today}.json"
    manifest_path.rename(archive)
    print(f"manifest 已封存：{archive.name}")


if __name__ == "__main__":
    main()
