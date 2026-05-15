from PIL import Image, ImageChops
from pathlib import Path

SRC = Path(r"C:\Users\anjan\OneDrive - SLIK Consulting Ltd\Documents\Logo\LinkedIn\base\icon\coverphoto\base_icon_white_background.png")
OUT_DIR = Path(__file__).parent
SIZES = [16, 32, 48, 128]

img = Image.open(SRC).convert("RGBA")

bg = Image.new("RGB", img.size, (255, 255, 255))
diff = ImageChops.difference(img.convert("RGB"), bg)
bbox = diff.getbbox()
if not bbox:
    raise SystemExit("logo area not found")

left, top, right, bottom = bbox
w, h = right - left, bottom - top
side = max(w, h)
pad = int(side * 0.10)
side += pad * 2
cx, cy = (left + right) // 2, (top + bottom) // 2
half = side // 2

sq_left = max(cx - half, 0)
sq_top = max(cy - half, 0)
sq_right = sq_left + side
sq_bottom = sq_top + side

cropped = Image.new("RGBA", (side, side), (255, 255, 255, 0))
src_crop = img.crop((sq_left, sq_top, sq_right, sq_bottom))
cropped.paste(src_crop, (0, 0))

bg_white = Image.new("RGBA", cropped.size, (255, 255, 255, 255))
bg_white.alpha_composite(cropped)
master = bg_white

for size in SIZES:
    out = master.resize((size, size), Image.LANCZOS)
    out.save(OUT_DIR / f"icon{size}.png", optimize=True)
    print(f"wrote icon{size}.png")
