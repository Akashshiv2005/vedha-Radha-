import os
from PIL import Image

images_to_check = [
    "diamond_waterfall_chandelier_earrings.jpg",
    "diamond_v_collar_wedding_necklace.jpg",
    "diamond_oval_statement_bangle.jpg",
    "diamond_bypass_open_kada.jpg",
    "diamond_teardrop_halo_pendant.jpg",
    "diamond_bezel_tennis_bracelet.jpg",
    "diamond_solitaire_stud_earrings.jpg",
    "diamond_infinity_heart_pendant.jpg",
    "diamond_emerald_cut_solitaire_ring.jpg",
    "diamond_radiant_cut_cocktail_ring.jpg",
    "mens_royal_gold_kada.jpg",
    "royal_silver_pooja_thali_set.jpg",
    "collections_pooja_bell_aarti_set.jpg"
]

base_dir = "frontend/public/images/generated"

print("=" * 60)
print("VERIFYING GENERATED IMAGES INTEGRITY")
print("=" * 60)

for filename in images_to_check:
    full_path = os.path.join(base_dir, filename)
    if not os.path.exists(full_path):
        print(f"MISSING: {filename}")
        continue
    try:
        im = Image.open(full_path)
        w, h = im.size
        print(f"OK: {filename:<45} | Size: {w}x{h} | Mode: {im.mode}")
    except Exception as e:
        print(f"CORRUPT: {filename} -> {e}")
