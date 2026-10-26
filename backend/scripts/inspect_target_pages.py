import os
import re
from pathlib import Path

frontend_src = Path(r"c:\Users\baira\Documents\Company Projects\Projects\jwell_application\vedharadha-website\frontend\src")
targets = [
    "pages/GoldPage.jsx",
    "pages/SilverPage.jsx",
    "pages/CoinsBarsPage.jsx",
    "pages/BridalPage.jsx",
    "pages/NewArrivalsPage.jsx",
    "pages/CollectionsCatalogPage.jsx",
    "pages/CollectionsPage.jsx",
    "pages/JewelleryPage.jsx",
    "components/ShopByCollection.jsx"
]

for t in targets:
    p = frontend_src / t
    if p.exists():
        with open(p, "r", encoding="utf-8") as file:
            lines = file.readlines()
        print(f"\n=== {t} ===")
        for i, line in enumerate(lines, 1):
            if re.search(r"\bproducts\b", line):
                print(f"  {i}: {line.strip()}")
