#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
validate_manifest.py — 出文前預檢，publish_to_web.py 之前必跑。

檢查三項：
  1. cover_file 路徑全部唯一（重複即中止）
  2. cover_file 指向的檔案實際存在
  3. cover_file 指向的檔案內容唯一（MD5 比對，防路徑唯一但內容相同）

用法：
  python scripts/validate_manifest.py                         # 預設 staging 目錄
  python scripts/validate_manifest.py --staging DIR
"""
import argparse, hashlib, json, sys
from pathlib import Path

DEFAULT_STAGING = Path("C:/Users/micha/destiny-solver-web-staging")


def md5(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--staging", default=str(DEFAULT_STAGING))
    args = ap.parse_args()

    manifest_path = Path(args.staging) / "manifest.json"
    if not manifest_path.exists():
        print(f"[中止] 找不到 manifest：{manifest_path}")
        sys.exit(1)

    entries = json.loads(manifest_path.read_text(encoding="utf-8"))
    errors = []

    paths_seen: dict[str, int] = {}
    hashes_seen: dict[str, tuple[int, str]] = {}

    for i, entry in enumerate(entries, start=1):
        cover = entry.get("cover_file", "").strip()
        title = entry.get("title", f"第 {i} 篇")

        if not cover:
            errors.append(f"第 {i} 篇「{title}」cover_file 為空")
            continue

        # 路徑唯一性
        if cover in paths_seen:
            errors.append(
                f"第 {i} 篇「{title}」cover_file 路徑同第 {paths_seen[cover]} 篇重複：{cover}"
            )
        else:
            paths_seen[cover] = i

        # 檔案存在
        p = Path(cover)
        if not p.exists():
            errors.append(f"第 {i} 篇「{title}」cover_file 檔案不存在：{cover}")
            continue

        # 內容唯一（MD5）
        h = md5(p)
        if h in hashes_seen:
            prev_i, prev_path = hashes_seen[h]
            errors.append(
                f"第 {i} 篇「{title}」封面圖內容同第 {prev_i} 篇完全相同\n"
                f"       路徑：{cover}\n"
                f"       重複：{prev_path}\n"
                f"       根本原因通常係上篇 slide_01.jpg 未備份就被下篇覆蓋"
            )
        else:
            hashes_seen[h] = (i, cover)

    if errors:
        print(f"[中止] manifest 預檢發現 {len(errors)} 個問題，唔可以出文：\n")
        for e in errors:
            print(f"  ✗ {e}\n")
        print("修好之後重跑此腳本，全部通過先可以跑 publish_to_web.py。")
        sys.exit(1)

    print(f"[通過] manifest 預檢全部通過：{len(entries)} 篇，封面路徑唯一、檔案存在、內容唯一。")
    print("可以跑 publish_to_web.py。")


if __name__ == "__main__":
    main()
