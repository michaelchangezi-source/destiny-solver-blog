#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
backfill_descriptions.py — 為 content/articles 內每篇文章補一個獨立的 SEO `description`。

動機：原本 metadata 直接拿 excerpt（卡片用的短 hook 或正文第一句）充當搜尋摘要，
SERP 上不夠完整、缺關鍵詞。這支腳本從正文煉出 80-150 字的完整摘要：
  - 去除 markdown、標題、表格、清單符號
  - 破折號（——／—）一律改逗號（Mic 鐵律：禁破折號）
  - 以句號／問號／驚嘆號為界，永不截斷半句、不留「…」
  - 與標題重複的首句自動跳過
  - 確保至少含一個關鍵詞（八字／命理／類別）

把 `description:` 寫進 frontmatter（緊接 excerpt 之後）。已有 description 預設略過。

用法：
  python backfill_descriptions.py --dry-run          # 只印結果，不改檔
  python backfill_descriptions.py --dry-run --limit 8
  python backfill_descriptions.py                    # 實際寫入（跳過已有 description）
  python backfill_descriptions.py --force            # 連已有的都重算覆蓋
"""
import argparse
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_DIR = ROOT / "content" / "articles"

MIN_LEN = 80
MAX_LEN = 150
KEYWORDS = ["八字", "命理", "十神", "大運", "流年", "五行", "格局", "命盤", "干支", "命局"]


def strip_md_inline(text: str) -> str:
    text = re.sub(r"\*\*(.*?)\*\*", r"\1", text)
    text = re.sub(r"\*(.*?)\*", r"\1", text)
    text = re.sub(r"`(.*?)`", r"\1", text)
    text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)
    text = re.sub(r"~~(.*?)~~", r"\1", text)
    return text.strip()


def split_frontmatter(raw: str):
    """回傳 (frontmatter_lines, body)。frontmatter_lines 不含首尾 '---'。"""
    if not raw.startswith("---"):
        return None, raw
    parts = raw.split("\n")
    # 找第二個 '---'
    end = None
    for i in range(1, len(parts)):
        if parts[i].strip() == "---":
            end = i
            break
    if end is None:
        return None, raw
    fm = parts[1:end]
    body = "\n".join(parts[end + 1 :])
    return fm, body


def fm_get(fm_lines, key):
    pat = re.compile(rf"^{re.escape(key)}:\s*(.*)$")
    for ln in fm_lines:
        m = pat.match(ln)
        if m:
            return m.group(1).strip().strip('"').strip("'")
    return ""


def norm(s: str) -> str:
    return re.sub(r"[，。：、？！「」『』\s,.:?!\"'…\-—]", "", s)


def body_to_sentences(body: str):
    """正文 → 乾淨句子序列。"""
    out = []
    for ln in body.split("\n"):
        s = ln.strip()
        if not s or s == "---":
            continue
        if s.startswith("#") or s.startswith("|") or s.startswith(">"):
            continue
        s = re.sub(r"^[-*+]\s+", "", s)        # 清單符號
        s = re.sub(r"^\d+[\.\)]\s+", "", s)    # 數字清單
        s = strip_md_inline(s)
        if not s:
            continue
        out.append(s)
    text = " ".join(out)
    # 破折號 → 逗號
    text = text.replace("——", "，").replace("—", "，").replace("--", "，")
    text = re.sub(r"，{2,}", "，", text)
    # 以句末標點切句（保留標點）
    sentences = re.findall(r"[^。！？]*[。！？]", text)
    return [x.strip() for x in sentences if x.strip()]


def make_description(title: str, body: str, category: str) -> str:
    sentences = body_to_sentences(body)
    if not sentences:
        return ""

    nt = norm(title)
    desc = ""
    for sent in sentences:
        ns = norm(sent)
        # 跳過與標題幾乎相同的首句
        if not desc and nt and (ns == nt or ns in nt or nt in ns):
            continue
        if not desc:
            desc = sent
        else:
            if len(desc) + len(sent) > MAX_LEN:
                break
            desc += sent
        if len(desc) >= MIN_LEN:
            # 已達下限且下一句會超上限就停
            break

    desc = desc.strip()
    # 仍超上限（單句太長）→ 在最後一個句末標點切，保證完整句
    if len(desc) > MAX_LEN:
        cut = max(desc.rfind("。", 0, MAX_LEN), desc.rfind("！", 0, MAX_LEN), desc.rfind("？", 0, MAX_LEN))
        if cut > MIN_LEN:
            desc = desc[: cut + 1]
        else:
            # 無句末標點可切，退而求其次在逗號切並補句號
            cut = desc.rfind("，", 0, MAX_LEN)
            desc = (desc[:cut] + "。") if cut > MIN_LEN else (desc[:MAX_LEN])

    # 確保含關鍵詞；沒有且有空間就補一個自然的尾
    if not any(k in desc for k in KEYWORDS):
        tail = f"從八字命理角度，解析{category}。"
        if len(desc) + len(tail) <= MAX_LEN + 12:
            desc = desc + tail
    return desc.strip()


def yaml_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def process_file(path: Path, force: bool):
    raw = path.read_text(encoding="utf-8-sig")  # 容忍 BOM 開頭
    fm, body = split_frontmatter(raw)
    if fm is None:
        return None, "無 frontmatter"

    existing = fm_get(fm, "description")
    if existing and not force:
        return None, "已有 description"

    title = fm_get(fm, "title")
    category = fm_get(fm, "category") or "命理"
    desc = make_description(title, body, category)
    if not desc:
        return None, "無法生成"

    # 重建 frontmatter：移除舊 description，於 excerpt 後插入新行
    new_fm = [ln for ln in fm if not ln.lstrip().startswith("description:")]
    desc_line = f'description: "{yaml_escape(desc)}"'
    inserted = False
    rebuilt = []
    for ln in new_fm:
        rebuilt.append(ln)
        if not inserted and ln.lstrip().startswith("excerpt:"):
            rebuilt.append(desc_line)
            inserted = True
    if not inserted:  # 沒有 excerpt 行 → 放 title 後，否則放開頭
        rebuilt = []
        placed = False
        for ln in new_fm:
            rebuilt.append(ln)
            if not placed and ln.lstrip().startswith("title:"):
                rebuilt.append(desc_line)
                placed = True
        if not placed:
            rebuilt = [desc_line] + new_fm

    new_raw = "---\n" + "\n".join(rebuilt) + "\n---\n" + body
    return (new_raw, desc), "ok"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--limit", type=int, default=0)
    args = ap.parse_args()

    files = sorted(ARTICLES_DIR.glob("*.md"))
    if args.limit:
        files = files[: args.limit]

    changed = skipped = 0
    for path in files:
        result, status = process_file(path, args.force)
        if result is None:
            skipped += 1
            if args.dry_run:
                print(f"[skip] {path.name}  ({status})")
            continue
        new_raw, desc = result
        changed += 1
        if args.dry_run:
            print(f"\n[{path.name}]\n  → {desc}  ({len(desc)}字)")
        else:
            path.write_text(new_raw, encoding="utf-8")

    print(f"\n完成：{changed} 篇生成 description，{skipped} 篇略過。")


if __name__ == "__main__":
    main()
