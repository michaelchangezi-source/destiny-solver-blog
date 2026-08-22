"""
check_seo_titles.py — 驗證本週新文 SEO title 合規
用法: python scripts/check_seo_titles.py --date YYYYMMDD

規則（任一中招輸出 WARN）：
  title_too_long   總長 > 30 全形字
  no_bazi_term     前 12 字冇命理術語
  social_hook      社交 hook 句式開頭
"""

import argparse
import re
import sys
from pathlib import Path

ARTICLES_DIR = Path(__file__).parent.parent / "content" / "articles"

BAZI_TERMS = [
    # 通用
    "八字","命盤","五行","天干","地支","日元","日主","格局","用神","喜神","忌神",
    "命理","算命","排盤","子平","八字基礎","八字分析",
    # 十神
    "正官","偏官","七殺","正印","偏印","食神","傷官","正財","偏財","比肩","劫財",
    "官殺","印星","財星","食傷",
    # 天干（十天干單字及常見帶元素詞組）
    "甲木","乙木","丙火","丁火","戊土","己土","庚金","辛金","壬水","癸水",
    "甲","乙","丙","丁","戊","己","庚","辛","壬","癸",
    # 地支（十二地支單字）
    "子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥",
    # 宮位
    "日支","月支","時支","年支","日干","月干","時干","年干",
    "夫妻宮","妻宮","夫宮","命宮","月令",
    # 十二長生
    "長生","沐浴","冠帶","臨官","帝旺","衰","病","死","墓","絕","胎","養",
    # 合沖刑
    "合","沖","刑","害","破","會","拱","暗合","明合","化氣","合而不化","合化",
    "天剋地沖","相沖","三合","六合","三會",
    # 神煞
    "桃花","驛馬","空亡","入墓","祿","刃","羊刃","魁罡","文昌","祿神","暗祿",
    # 技法
    "藏干","透干","通根","根","做功","去向","賓主","賓位","主位",
    "大運","流年","流月",
]

SOCIAL_HOOK_PATTERNS = [
    r"^你是不是", r"^有沒有", r"^好多人", r"^越.{1,4}越",
    r"^你有冇", r"^係咪", r"^點解你", r"^為什麼你",
]

def extract_title(md_path: Path) -> str | None:
    text = md_path.read_text(encoding="utf-8-sig")
    in_fm = False
    for line in text.splitlines():
        if line.strip() == "---":
            if not in_fm:
                in_fm = True
                continue
            else:
                break
        if in_fm and line.startswith("title:"):
            val = line[6:].strip().strip('"').strip("'")
            return val
    return None

def full_width_len(s: str) -> int:
    """每個全形/CJK字算 1，ASCII 算 0.5，四捨五入。"""
    count = 0
    for ch in s:
        if ord(ch) > 0x2E7F:
            count += 2
        else:
            count += 1
    return (count + 1) // 2

def check_title(title: str) -> list[str]:
    issues = []
    if full_width_len(title) > 30:
        issues.append("title_too_long")
    prefix = title[:12]
    if not any(t in prefix for t in BAZI_TERMS):
        issues.append("no_bazi_term")
    for pat in SOCIAL_HOOK_PATTERNS:
        if re.match(pat, title):
            issues.append("social_hook")
            break
    return issues

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", required=True, help="YYYYMMDD")
    args = parser.parse_args()

    pattern = f"post-{args.date}-*.md"
    files = sorted(ARTICLES_DIR.glob(pattern))
    if not files:
        print(f"[INFO] 找不到 {pattern}，跳過驗證。")
        sys.exit(0)

    warn_count = 0
    for f in files:
        slug = f.stem.rsplit("-", 1)[0] if "-" in f.stem else f.stem
        title = extract_title(f)
        if title is None:
            print(f"[WARN] {f.name}  →  無法讀取 title frontmatter")
            warn_count += 1
            continue
        issues = check_title(title)
        if issues:
            print(f"[WARN] {f.name}  「{title}」  →  {', '.join(issues)}")
            warn_count += 1
        else:
            print(f"[OK]  {f.name}  「{title}」")

    print(f"\n結果：{len(files) - warn_count} 篇 OK，{warn_count} 篇 WARN")
    sys.exit(1 if warn_count else 0)

if __name__ == "__main__":
    main()
