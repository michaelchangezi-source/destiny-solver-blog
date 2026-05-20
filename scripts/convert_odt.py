#!/usr/bin/env python3
"""
ODT to Markdown batch conversion script.
Converts all articles from the blog source folder
to Markdown files with frontmatter for the Next.js blog.

Usage:
  python scripts/convert_odt.py
"""

import re
import sys
import shutil
import zipfile
from pathlib import Path
from datetime import datetime, timedelta

# ── Path configuration ─────────────────────────────────────
SOURCE_DIR = Path(r"C:\Users\micha\Documents\Blog\Blog\初階教材文章\免費版")
OUTPUT_DIR = Path(__file__).parent.parent / "content" / "articles"
IMAGES_DIR = Path(__file__).parent.parent / "public" / "images" / "covers"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# ── Category mapping (by topic number) ────────────────────
CATEGORY_MAP = [
    (range(1, 4),   "八字基礎"),
    (range(4, 8),   "干支詳解"),
    (range(8, 13),  "十神應用"),
    (range(13, 20), "干支詳解"),
    (range(20, 28), "十神應用"),
    (range(28, 30), "感情格局"),
    (range(29, 32), "事業財運"),
    (range(32, 36), "健康命理"),
    (range(35, 38), "風水地理"),
    (range(37, 39), "實戰斷命"),
]

def get_category(order: int) -> str:
    for r, cat in CATEGORY_MAP:
        if order in r:
            return cat
    return "八字基礎"


def extract_topic_number(folder_name: str):
    m = re.search(r"主題\s*(\d+)", folder_name)
    return int(m.group(1)) if m else None


def extract_title(folder_name: str) -> str:
    m = re.search(r"[：:](.+)$", folder_name)
    if m:
        return m.group(1).strip()
    return re.sub(r"^主題\s*\d+[_\s：:]*", "", folder_name).strip()


def odt_to_markdown(odt_path: Path) -> str:
    """
    Extract text from ODT file using regex-based XML parsing.
    ODT files are ZIP archives containing content.xml.
    We use regex to find text:p and text:h elements and extract their content.
    This avoids namespace handling issues with ElementTree.
    """
    try:
        with zipfile.ZipFile(odt_path, 'r') as z:
            with z.open('content.xml') as f:
                xml = f.read().decode('utf-8')
    except Exception as e:
        print(f"  [WARN] Cannot read {odt_path.name}: {e}")
        return ""

    def clean_inner(raw: str) -> str:
        """Strip XML tags from inner content and unescape entities."""
        # Expand text:s (spaces)
        text = re.sub(r'<text:s[^/]*/>', ' ', raw)
        text = re.sub(r'<text:s\s*/>', ' ', text)
        # Expand text:tab
        text = re.sub(r'<text:tab[^/]*/>', '  ', text)
        # Expand text:line-break
        text = re.sub(r'<text:line-break[^/]*/>', '\n', text)
        # Remove all remaining tags
        text = re.sub(r'<[^>]+>', '', text)
        # Unescape HTML entities
        text = (text
                .replace('&amp;', '&')
                .replace('&lt;', '<')
                .replace('&gt;', '>')
                .replace('&quot;', '"')
                .replace('&apos;', "'")
                .replace('&#160;', ' '))
        # Collapse multiple spaces (but not newlines)
        text = re.sub(r' {2,}', ' ', text)
        return text.strip()

    blocks = []

    # Find headings: <text:h text:outline-level="N" ...>...</text:h>
    heading_pat = re.compile(
        r'<text:h\b([^>]*)>(.*?)</text:h>',
        re.DOTALL
    )
    # Find paragraphs: <text:p ...>...</text:p>
    para_pat = re.compile(
        r'<text:p\b([^>]*)>(.*?)</text:p>',
        re.DOTALL
    )

    # Merge and sort all matches by position
    all_matches = []

    for m in heading_pat.finditer(xml):
        attrs = m.group(1)
        level_m = re.search(r'text:outline-level="(\d+)"', attrs)
        level = int(level_m.group(1)) if level_m else 1
        text = clean_inner(m.group(2))
        if text:
            hashes = '#' * (level + 1)  # h1->##, h2->###
            all_matches.append((m.start(), f"{hashes} {text}"))

    for m in para_pat.finditer(xml):
        text = clean_inner(m.group(2))
        if text:
            all_matches.append((m.start(), text))

    # Sort by position in original XML to preserve document order
    all_matches.sort(key=lambda x: x[0])
    blocks = [text for _, text in all_matches]

    if not blocks:
        # Fallback: strip all tags
        fallback = re.sub(r'<[^>]+>', ' ', xml)
        fallback = re.sub(r'\s+', ' ', fallback)
        return fallback.strip()

    return '\n\n'.join(blocks)


def slugify(text: str) -> str:
    text = re.sub(r'[^\w一-鿿]+', '-', text)
    return text.strip('-').lower()[:50]


def convert_all():
    if not SOURCE_DIR.exists():
        print(f"[ERROR] Source directory not found: {SOURCE_DIR}")
        sys.exit(1)

    folders = sorted(SOURCE_DIR.iterdir())
    converted = 0
    skipped = 0
    base_date = datetime(2024, 1, 1)

    for folder in folders:
        if not folder.is_dir():
            continue

        order = extract_topic_number(folder.name)
        if order is None:
            print(f"[SKIP] no topic number: {folder.name}")
            skipped += 1
            continue

        title = extract_title(folder.name)
        odt_file = folder / "网站.odt"
        if not odt_file.exists():
            odt_file = folder / "網站.odt"  # "網站"
        if not odt_file.exists():
            # try any .odt starting with 網
            candidates = [f for f in folder.iterdir()
                          if f.suffix == '.odt' and '網' in f.name]
            odt_file = candidates[0] if candidates else None

        if not odt_file or not odt_file.exists():
            print(f"[SKIP] no odt found in: {folder.name}")
            skipped += 1
            continue

        print(f"[CONVERT] topic {order}: {odt_file.name}")

        body_text = odt_to_markdown(odt_file)

        # Cover image
        cover_dest_path = f"/images/covers/topic-{order:02d}.png"
        for f in folder.iterdir():
            if f.suffix.lower() in ('.png', '.jpg', '.jpeg') and 'Gemini' in f.name:
                ext = f.suffix
                dest = IMAGES_DIR / f"topic-{order:02d}{ext}"
                shutil.copy2(f, dest)
                cover_dest_path = f"/images/covers/topic-{order:02d}{ext}"
                break

        slug = f"topic-{order:02d}-{slugify(title)}"
        pub_date = base_date + timedelta(days=(order - 1) * 7)
        pub_str = pub_date.strftime("%Y-%m-%dT00:00:00Z")

        # Excerpt: first 120 chars of clean body
        clean_body = re.sub(r'[#\n]+', ' ', body_text)
        clean_body = re.sub(r'\s+', ' ', clean_body).strip()
        excerpt = (clean_body[:120] + '...') if len(clean_body) > 120 else clean_body
        # Escape quotes in frontmatter
        excerpt = excerpt.replace('"', '\\"')
        title_safe = title.replace('"', '\\"')

        category = get_category(order)
        tags_list = '["八字", "命理", "' + category + '"]'

        md = f"""---
title: "{title_safe}"
slug: "{slug}"
excerpt: "{excerpt}"
category: "{category}"
tags: {tags_list}
coverImage: "{cover_dest_path}"
publishedAt: "{pub_str}"
order: {order}
isPaid: false
---

{body_text}
"""
        out_file = OUTPUT_DIR / f"{slug}.md"
        out_file.write_text(md, encoding='utf-8')
        print(f"  [OK] {out_file.name}")
        converted += 1

    print(f"\n{'='*50}")
    print(f"[DONE] Converted: {converted}, Skipped: {skipped}")
    print(f"[OUTPUT] {OUTPUT_DIR}")


if __name__ == "__main__":
    convert_all()
