#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
publish_love_to_web.py — 把 ds-weekly-love-threads 生成的感情格局帖文同步到網站。

與 publish_to_web.py 的差異：
  1. slug 前綴：love-YYYYMMDD-NN（唔撞 regular batch 的 post-YYYYMMDD-NN）
  2. 發布時間：T12:00:00+08:00（正午），regular batch 係 T00:00:00+08:00（深夜）
  3. manifest：預設讀最新的 manifest_love_*.json，封存為 manifest_love_done_*.json
  4. 只讀 love manifest，唔覆蓋 regular manifest

用法：
  python publish_love_to_web.py                         # 自動找最新 manifest_love，push
  python publish_love_to_web.py --manifest PATH         # 指定 manifest 路徑
  python publish_love_to_web.py --no-push               # 只生成檔案，不 push
"""
import argparse
import glob
import hashlib
import json
import re
import shutil
import subprocess
import sys
import urllib.request
from collections import Counter
from datetime import datetime
from pathlib import Path

WEBSITE_ROOT = Path(__file__).resolve().parent.parent
ARTICLES_DIR = WEBSITE_ROOT / "content" / "articles"
COVERS_DIR   = WEBSITE_ROOT / "public" / "images" / "covers"
DEFAULT_STAGING = Path("C:/Users/micha/destiny-solver-web-staging")

SITE_URL      = "https://www.destinysolver.com"
INDEXNOW_KEY  = "89a823e9a77b875b3fea063c5a24ff64"

INVALID_FILENAME = re.compile(r'[\\/:*?"<>|\r\n]+')

CANONICAL_CATEGORIES = {
    "八字基礎", "干支詳解", "十神應用", "命盤格局", "實戰斷命",
    "大運流年", "感情格局", "事業財運", "健康命理", "風水地理",
}
CATEGORY_ALIASES = {
    "基礎知識": "八字基礎",
    "職場現象": "事業財運",
    "兩性關係": "感情格局",
}


# ── 工具函式（與 publish_to_web.py 相同，獨立複製避免互相依賴）─────────────

def safe_title(title: str) -> str:
    t = INVALID_FILENAME.sub("", title).strip()
    t = re.sub(r"\s+", "-", t)
    return t[:40] or "untitled"


def strip_md(text: str) -> str:
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*",     r"\1", text)
    text = re.sub(r"`(.*?)`",       r"\1", text)
    text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)
    return text.strip()


def _norm(s: str) -> str:
    return re.sub(r"[，。：、？！「」『』\s,.:?!\"'…]", "", s)


def strip_frontmatter(raw: str) -> str:
    stripped = raw.lstrip()
    if stripped.startswith("---"):
        after = stripped[3:]
        idx = after.find("\n---")
        if idx != -1:
            return after[idx + 4:].lstrip("\n")
    return raw


def parse_body(raw: str, title: str = ""):
    paras = [strip_md(ln.strip()) for ln in raw.splitlines() if ln.strip() and ln.strip() != "---"]
    hook = paras[0] if paras else ""
    nt, nh = _norm(title), _norm(hook)
    title_is_hook = bool(title and nt) and (nt == nh or nt in nh or nh in nt)
    if title_is_hook:
        excerpt = paras[1] if len(paras) > 1 else hook
        drop = 2
    else:
        excerpt = hook
        drop = 1
    out, dropped, started = [], 0, False
    for ln in raw.splitlines():
        s = ln.strip()
        if not started:
            if s and s != "---":
                dropped += 1
                if dropped >= drop:
                    started = True
                continue
            continue
        out.append(ln)
    body = "\n".join(out).strip()
    body = re.sub(r"^(?:-{3,}\s*)+", "", body).strip()
    return excerpt, body


def make_excerpt(hook: str, limit: int = 96) -> str:
    e = hook.replace('"', "'")
    return (e[:limit] + "…") if len(e) > limit else e


_SEO_KW = ["八字", "命理", "十神", "大運", "流年", "五行", "格局", "命盤", "干支", "命局"]


def make_seo_description(body: str, title: str, category: str,
                          min_len: int = 80, max_len: int = 150) -> str:
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
    if desc and not any(k in desc for k in _SEO_KW):
        tail = f"從八字命理角度，解析{category}。"
        if len(desc) + len(tail) <= max_len + 12:
            desc += tail
    return desc.strip().replace('"', "'")


def yaml_escape(s: str) -> str:
    return s.replace('"', '\\"')


def normalize_category(raw: str, title: str = "") -> str:
    name = (raw or "").strip()
    if name in CANONICAL_CATEGORIES:
        return name
    mapped = CATEGORY_ALIASES.get(name)
    if mapped:
        print(f"  [!] 分類「{name}」→「{mapped}」")
        return mapped
    where = f"（文章：{title}）" if title else ""
    raise SystemExit(
        f"[中止] 分類「{name}」未登記{where}。\n"
        f"       可選：{'、'.join(sorted(CANONICAL_CATEGORIES))}"
    )


def _md5(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def clean_stale_for_slug(slug: str) -> None:
    """清理同一 love slug 的舊殘留。"""
    if ARTICLES_DIR.exists():
        for old in ARTICLES_DIR.glob(f"{slug}-*.md"):
            old.unlink()
            print(f"  [clean] 刪舊殘留：{old.name}")
        exact = ARTICLES_DIR / f"{slug}.md"
        if exact.exists():
            raw = exact.read_text(encoding="utf-8", errors="replace")
            if f'slug: "{slug}"' in raw:
                exact.unlink()
                print(f"  [clean] 刪舊殘留（無後綴）：{exact.name}")
            else:
                raise SystemExit(
                    f"[中止] slug 衝突：{exact.name} 已存在且屬於其他流程，請檢查。"
                )
    old_cover = COVERS_DIR / f"{slug}.jpg"
    if old_cover.exists():
        old_cover.unlink()
        print(f"  [clean] 刪舊封面：{old_cover.name}")


# ── 核心：建立文章檔案 ──────────────────────────────────────────────────────

def build_article(entry: dict, seq: int, date_str: str) -> tuple:
    title    = entry["title"].strip()
    category = normalize_category(entry.get("category", ""), title)
    body_file  = Path(entry["body_file"])
    cover_file = Path(entry["cover_file"])

    raw = body_file.read_text(encoding="utf-8")
    raw = strip_frontmatter(raw)
    excerpt, body = parse_body(raw, title)
    body    = re.sub(r'\*\*(.*?)\*\*', r'\1', body,    flags=re.DOTALL)
    excerpt = re.sub(r'\*\*(.*?)\*\*', r'\1', excerpt, flags=re.DOTALL)
    description = make_seo_description(body, title, category)
    excerpt = make_excerpt(excerpt)

    date_compact = date_str.replace("-", "")
    # love 前綴，唔撞 regular batch 的 post- slug
    slug = f"love-{date_compact}-{seq:02d}"
    clean_stale_for_slug(slug)

    # 發布時間：正午 12:00（regular batch 用深夜 00:00，兩者分開）
    base      = datetime.strptime(date_str, "%Y-%m-%d").replace(hour=12, minute=0, second=0)
    published = base.strftime("%Y-%m-%dT%H:%M:%S+08:00")

    # 複製封面圖（支援本機路徑或 URL）
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    cover_dest = COVERS_DIR / f"{slug}.jpg"
    cover_src  = str(entry["cover_file"])
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
    print(f"  [{seq:02d}] {slug}  {title[:30]}  ({category})  @{published[:16]}")
    return out_path, slug


# ── Git & IndexNow ───────────────────────────────────────────────────────────

def git(args, check=True):
    return subprocess.run(["git", "-C", str(WEBSITE_ROOT), *args],
                          check=check, capture_output=True, text=True)


def ping_indexnow(slugs):
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


# ── 主程式 ───────────────────────────────────────────────────────────────────

def find_latest_love_manifest(staging: Path) -> Path:
    """自動找最新的 manifest_love_*.json（唔包括 manifest_love_done_*）。"""
    candidates = sorted(staging.glob("manifest_love_[0-9]*.json"), reverse=True)
    if not candidates:
        raise SystemExit(
            f"[中止] 在 {staging} 找不到 manifest_love_*.json。\n"
            f"       請先跑 ds-weekly-love-threads 批次，或用 --manifest 指定路徑。"
        )
    return candidates[0]


def main():
    ap = argparse.ArgumentParser(description="把感情格局帖文同步到個人網站")
    ap.add_argument("--staging",  default=str(DEFAULT_STAGING), help="staging 目錄")
    ap.add_argument("--manifest", default=None,                 help="指定 manifest 路徑（可選）")
    ap.add_argument("--no-push",  action="store_true",          help="只生成文件，不 git push")
    args = ap.parse_args()

    staging = Path(args.staging)
    if args.manifest:
        manifest_path = Path(args.manifest)
    else:
        manifest_path = find_latest_love_manifest(staging)

    if not manifest_path.exists():
        print(f"找不到 manifest：{manifest_path}")
        sys.exit(1)

    print(f"讀取：{manifest_path.name}")
    entries = json.loads(manifest_path.read_text(encoding="utf-8"))
    if not entries:
        print("manifest 為空，無事可做。")
        return

    today = datetime.now().strftime("%Y-%m-%d")

    # 前置檢查 1：分類全過先繼續
    for i, entry in enumerate(entries, start=1):
        normalize_category(entry.get("category", ""), entry.get("title", f"第 {i} 篇"))
    print(f"分類檢查通過：{len(entries)} 篇全部有合法分類。")

    # 前置檢查 2：日期多元性（3 篇同日期即報警）
    date_counts = Counter(entry.get("date", today) for entry in entries)
    if len(entries) >= 3:
        for d, cnt in date_counts.items():
            if cnt >= 3:
                raise SystemExit(
                    f"[中止] {cnt} 篇共用同一日期「{d}」。\n"
                    f"       Love batch 每篇應填各自 Threads 發布日（Sep 07–13 各一篇）。"
                )

    print(f"同步 {len(entries)} 篇感情格局文章至網站…")
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

    if failed:
        print(f"\n[中止] {len(entries)} 篇之中有 {len(failed)} 篇失敗，唔會 commit／push：")
        for i, title, err in failed:
            print(f"       第 {i} 篇「{title}」：{err}")
        sys.exit(1)

    # Checker 1：文章檔案 + 封面圖存在
    missing = []
    for p, slug in zip(written, slugs):
        if not p.exists():
            missing.append(f"文章檔案不存在：{p}")
        cover_chk = COVERS_DIR / f"{slug}.jpg"
        if not cover_chk.exists():
            missing.append(f"封面圖不存在：{cover_chk}")
    if missing:
        print("[中止] Checker 發現以下問題：")
        for m in missing:
            print(f"       {m}")
        sys.exit(1)
    print(f"Checker 通過：{len(written)} 篇文章及封面圖全部到位。")

    # Checker 2：批次內封面唯一
    cover_hashes: dict = {}
    dup_covers = []
    for slug in slugs:
        h = _md5(COVERS_DIR / f"{slug}.jpg")
        if h in cover_hashes:
            dup_covers.append((cover_hashes[h], slug, h[:8]))
        else:
            cover_hashes[h] = slug
    if dup_covers:
        print("\n[中止] 批次內封面圖重複：")
        for s1, s2, h in dup_covers:
            print(f"       {s1}.jpg 同 {s2}.jpg 完全相同（MD5 {h}）")
        sys.exit(1)
    print(f"封面重複偵測通過：{len(slugs)} 張封面全部唯一。")

    # Checker 3：封面來源吻合
    cover_mismatch = []
    for entry, slug in zip(entries, slugs):
        src = str(entry.get("cover_file", ""))
        if not src or src.startswith("http"):
            continue
        src_path = Path(src)
        dest_path = COVERS_DIR / f"{slug}.jpg"
        if src_path.exists() and dest_path.exists():
            if _md5(src_path) != _md5(dest_path):
                cover_mismatch.append((slug, src))
    if cover_mismatch:
        print("\n[中止] 封面來源吻合驗證失敗：")
        for slug, src in cover_mismatch:
            print(f"       {slug}.jpg 與來源 {src} 唔吻合")
        sys.exit(1)
    print(f"封面來源吻合通過：{len(slugs)} 張封面與 manifest 來源一致。")

    # Checker 4：跨批次封面唯一
    existing_covers: dict = {}
    if COVERS_DIR.exists():
        for f in COVERS_DIR.glob("*.jpg"):
            if f.stem not in slugs:
                existing_covers[_md5(f)] = f.name
    cross_dups = []
    for slug in slugs:
        h = _md5(COVERS_DIR / f"{slug}.jpg")
        if h in existing_covers:
            cross_dups.append((slug, existing_covers[h]))
    if cross_dups:
        print("\n[中止] 本批次封面與現有封面重複：")
        for new_slug, old_file in cross_dups:
            print(f"       {new_slug}.jpg 與舊封面 {old_file} 完全相同")
        sys.exit(1)
    print(f"跨批次封面唯一性通過：{len(slugs)} 張封面與全站封面均不重複。")

    if args.no_push:
        print(f"\n完成（--no-push）：已生成 {len(written)} 篇，未 push。")
        return

    git(["add", "-A"])
    status = git(["status", "--porcelain"]).stdout.strip()
    if not status:
        print("無變更可提交。")
        return
    msg = f"feat: 同步 {len(written)} 篇感情格局文章 ({today})"
    git(["commit", "-m", msg])
    push = git(["push", "origin", "main"], check=False)
    if push.returncode != 0:
        print("git push 失敗：")
        print(push.stderr)
        sys.exit(1)
    print(f"已 push origin main，Vercel 自動部署。commit：{msg}")

    ping_indexnow(slugs)

    # 封存 manifest
    archive = manifest_path.parent / f"manifest_love_done_{today}.json"
    manifest_path.rename(archive)
    print(f"manifest 已封存：{archive.name}")


if __name__ == "__main__":
    main()
