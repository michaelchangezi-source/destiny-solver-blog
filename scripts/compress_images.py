"""Compress cover images: PNG -> JPEG at 85% quality, max 1200px wide"""
import os
from PIL import Image

covers = r"C:\Users\micha\Documents\destiny-solver-blog\public\images\covers"
MAX_WIDTH = 1200
QUALITY = 85

converted = []
for fname in sorted(os.listdir(covers)):
    if not fname.lower().endswith(".png"):
        continue
    src = os.path.join(covers, fname)
    dst = os.path.join(covers, fname.replace(".png", ".jpg"))

    img = Image.open(src).convert("RGB")
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        img = img.resize((MAX_WIDTH, int(img.height * ratio)), Image.LANCZOS)

    orig_kb = os.path.getsize(src) // 1024
    img.save(dst, "JPEG", quality=QUALITY, optimize=True)
    new_kb = os.path.getsize(dst) // 1024
    os.remove(src)
    print(f"[OK] {fname} -> {fname.replace('.png','.jpg')}  {orig_kb}KB -> {new_kb}KB")
    converted.append(fname.replace(".png", ""))

print(f"\n[DONE] Converted {len(converted)} images")
