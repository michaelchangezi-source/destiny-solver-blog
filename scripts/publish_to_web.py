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
    "date": "2026-06-20"             // 選填，預設今日
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


def build_article(entry: dict, seq: int, date_str: str) -> Path:
    title = entry["title"].strip()
    category = normalize_category(entry.get("category", ""), title)
    body_file = Path(entry["body_file"])
    cover_file = Path(entry["cover_file"])

    raw = body_file.read_text(encoding="utf-8")
    raw = strip_frontmatter(raw)
    excerpt, body = parse_body(raw, title)
    description = make_seo_description(body, title, category)
    excerpt = make_excerpt(excerpt)

    date_compact = date_str.replace("-", "")
    slug = f"post-{date_compact}-{seq:02d}"
    # 發佈時間：同日內依序遞減，確保 seq=1 排最前
    base = datetime.strptime(date_str, "%Y-%m-%d").replace(hour=15, minute=0)
    published = (base - timedelta(minutes=seq - 1)).strftime("%Y-%m-%dT%H:%M:%S+08:00")

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

    # 前置檢查：先驗晒全部分類，全部過先開始寫檔。
    # 唔做呢步嘅話，第 5 篇分類出錯中止時，頭 4 篇已經落咗檔，要人手清理。
    for i, entry in enumerate(entries, start=1):
        normalize_category(entry.get("category", ""), entry.get("title", f"第 {i} 篇"))
    print(f"分類檢查通過：{len(entries)} 篇全部有合法分類。")

    today = datetime.now().strftime("%Y-%m-%d")
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
