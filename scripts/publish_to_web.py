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
SITE_URL = "https://destiny-solver-blog.vercel.app"
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


def yaml_escape(s: str) -> str:
    return s.replace('"', '\\"')


def build_article(entry: dict, seq: int, date_str: str) -> Path:
    title = entry["title"].strip()
    category = entry.get("category", "八字基礎").strip()
    body_file = Path(entry["body_file"])
    cover_file = Path(entry["cover_file"])

    raw = body_file.read_text(encoding="utf-8")
    excerpt, body = parse_body(raw, title)
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

    today = datetime.now().strftime("%Y-%m-%d")
    print(f"同步 {len(entries)} 篇最新文章至網站…")
    written, slugs = [], []
    for i, entry in enumerate(entries, start=1):
        date_str = entry.get("date", today)
        try:
            path, slug = build_article(entry, i, date_str)
            written.append(path)
            slugs.append(slug)
        except Exception as e:
            print(f"  [!] 第 {i} 篇失敗：{e}")

    if not written:
        print("沒有成功生成任何文章。")
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
