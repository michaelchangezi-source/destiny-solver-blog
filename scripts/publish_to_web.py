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
from datetime import datetime, timedelta
from pathlib import Path

WEBSITE_ROOT = Path(__file__).resolve().parent.parent
ARTICLES_DIR = WEBSITE_ROOT / "content" / "articles"
COVERS_DIR = WEBSITE_ROOT / "public" / "images" / "covers"
DEFAULT_STAGING = Path("C:/Users/micha/destiny-solver-web-staging")

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


def parse_body(raw: str):
    """回傳 (hook 首句, 去掉首句後的正文)。"""
    lines = raw.splitlines()
    hook = ""
    rest_start = 0
    for i, ln in enumerate(lines):
        if ln.strip():
            hook = strip_md(ln.strip())
            rest_start = i + 1
            break
    rest = "\n".join(lines[rest_start:]).strip()
    return hook, rest


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
    hook, body = parse_body(raw)
    excerpt = make_excerpt(hook)

    date_compact = date_str.replace("-", "")
    slug = f"post-{date_compact}-{seq:02d}"
    # 發佈時間：同日內依序遞減，確保 seq=1 排最前
    base = datetime.strptime(date_str, "%Y-%m-%d").replace(hour=15, minute=0)
    published = (base - timedelta(minutes=seq - 1)).strftime("%Y-%m-%dT%H:%M:%S+08:00")

    # 複製封面圖
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    cover_dest = COVERS_DIR / f"{slug}.jpg"
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
    return out_path


def git(args, check=True):
    return subprocess.run(["git", "-C", str(WEBSITE_ROOT), *args],
                          check=check, capture_output=True, text=True)


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
    written = []
    for i, entry in enumerate(entries, start=1):
        date_str = entry.get("date", today)
        try:
            written.append(build_article(entry, i, date_str))
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

    # 封存已處理的 manifest，避免下週重複
    archive = staging / f"manifest_done_{today}.json"
    manifest_path.rename(archive)
    print(f"manifest 已封存：{archive.name}")


if __name__ == "__main__":
    main()
