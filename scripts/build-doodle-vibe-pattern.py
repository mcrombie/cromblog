"""Build the Doodle Lab vibe's background: a seamless alpha-mask tile of original notebook drawings.

Only catalog alpha is used. Each drawing is trimmed, shrunk (never enlarged), turned slightly and
placed on a wrap-around tile without crowding its neighbours; a second pass fills the remaining
space with smaller repeats. The layout is seeded, so a rebuild reproduces the same tile.

Usage (repository root):
  py -3.14 scripts/build-doodle-vibe-pattern.py
  py -3.14 scripts/build-doodle-vibe-pattern.py --preview preview.png   # also composite a 2x2 review sheet
"""
import argparse
import hashlib
import json
import math
import random
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/cromblog/doodle-vibe/pattern-tile.png"
MANIFEST = ROOT / "content/doodle-vibe-pattern.generated.json"
TILE = 1500  # pixels; CSS draws the tile at half size so strokes stay sharp on 2x screens
SEED = 20260915
SIZE_RANGE = (104, 176)  # longest edge in tile pixels for the unique pass
FILL_SIZE_RANGE = (72, 118)  # smaller repeats that fill the gaps
GAP = 22  # clear space between drawings, in tile pixels
MAX_TURN = 16  # degrees
FILL_PATIENCE = 900  # consecutive failed placements before the fill pass stops

# Clean cutouts (haze < 0.2, cover < 0.35 in measure-cutouts.py), chosen by eye for variety.
DRAWINGS = [
    "um22-p083-e", "um22-p129-a", "um22-p081-a", "um22-p107-b", "fn22-p068-a", "um22-p100-a",
    "um22-p061-a", "um22-p096-a", "fn22-p003-a", "um22-p085-a", "um22-p038-a", "um22-p015-a",
    "jm26-p038-b", "fn22-p048-a", "um22-p138-a", "fn22-p025-a", "um22-p083-b", "na2223-p006-a",
    "aa23-p023-a", "na2223-p023-a", "jm26-p124-b", "um22-p079-a", "um22-p022-a", "um22-p025-a",
    "fn22-p004-a", "fn22-p051-a", "fn22-p099-a", "um22-p055-a", "jm26-p085-a", "um22-p009-a",
    "fn22-p021-a", "na2223-p080-a", "jm26-p043-a", "um22-p139-a", "um22-p128-a", "jj25-p065-a",
    "um22-p141-a", "jj2526-p163-a", "fn22-p026-a", "um22-p013-a", "jj2526-p261-a", "jj2526-p003-a",
    "fn22-p053-b", "um22-p157-a", "jj25-p058-a", "um22-p035-d", "jj25-p028-a", "na2223-p002-a",
    "jm26-p074-a", "um22-p018-c", "jm26-p038-e", "jm26-p082-b", "jm26-p027-b", "um22-p185-a",
    "aj2425-p103-a", "ma24-p189-b", "jm26-p038-d", "fn22-p097-a", "aj2425-p190-c", "fn22-p080-f",
    "jj2526-p079-b", "fn22-p013-a", "fn22-p073-a", "jm26-p188-a", "jm26-p038-f", "jm26-p175-a",
    "jm26-p032-b",
]


def catalog():
    entries = {}
    for file in sorted((ROOT / "content/doodle-batches").glob("*.json")):
        for entry in json.loads(file.read_text(encoding="utf-8")):
            entries[entry["id"]] = entry
    return entries


def load_alpha(entry):
    source = ROOT / "public" / entry["src"].lstrip("/")
    data = source.read_bytes()
    with Image.open(source) as image:
        alpha = image.convert("RGBA").getchannel("A")
    box = alpha.getbbox()
    if box is None:
        raise SystemExit(f"Empty drawing: {entry['id']}")
    return alpha.crop(box), hashlib.sha256(data).hexdigest()


def prepare(alpha, long_edge, turn):
    scale = min(1.0, long_edge / max(alpha.size))
    size = (max(1, round(alpha.width * scale)), max(1, round(alpha.height * scale)))
    mark = alpha.resize(size, Image.Resampling.LANCZOS)
    return mark.rotate(turn, resample=Image.Resampling.BICUBIC, expand=True)


def wrapped_distance(ax, ay, bx, by):
    dx, dy = abs(ax - bx), abs(ay - by)
    return math.hypot(min(dx, TILE - dx), min(dy, TILE - dy))


def find_spot(rng, placed, radius, attempts):
    for _ in range(attempts):
        x, y = rng.uniform(0, TILE), rng.uniform(0, TILE)
        if all(wrapped_distance(x, y, px, py) >= radius + pr for px, py, pr in placed):
            return x, y
    return None


def stamp(canvas, mark, x, y):
    pixels = np.asarray(mark)
    height, width = pixels.shape
    left, top = round(x - width / 2), round(y - height / 2)
    for offset_x in (-TILE, 0, TILE):
        for offset_y in (-TILE, 0, TILE):
            x0, y0 = left + offset_x, top + offset_y
            cx0, cy0 = max(x0, 0), max(y0, 0)
            cx1, cy1 = min(x0 + width, TILE), min(y0 + height, TILE)
            if cx0 >= cx1 or cy0 >= cy1:
                continue
            region = canvas[cy0:cy1, cx0:cx1]
            np.maximum(region, pixels[cy0 - y0:cy1 - y0, cx0 - x0:cx1 - x0], out=region)


def radius_of(mark):
    return max(mark.size) / 2 * 0.8 + GAP / 2


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--preview", help="write a 2x2 composite on paper for visual review")
    args = parser.parse_args()

    entries = catalog()
    rng = random.Random(SEED)
    sources = {}
    for asset_id in DRAWINGS:
        entry = entries.get(asset_id)
        if entry is None:
            raise SystemExit(f"Unknown drawing: {asset_id}")
        if entry["status"] not in ("curated", "texture"):
            raise SystemExit(f"Archived drawing cannot decorate the site: {asset_id}")
        sources[asset_id] = load_alpha(entry)

    canvas = np.zeros((TILE, TILE), dtype=np.uint8)
    placed, records = [], []

    def place(asset_id, size_range, attempts, repeat):
        alpha, sha = sources[asset_id]
        long_edge = rng.randint(*size_range)
        turn = round(rng.uniform(-MAX_TURN, MAX_TURN), 1)
        mark = prepare(alpha, long_edge, turn)
        radius = radius_of(mark)
        spot = find_spot(rng, placed, radius, attempts)
        if spot is None:
            return False
        placed.append((*spot, radius))
        stamp(canvas, mark, *spot)
        records.append({
            "id": asset_id, "sourceSha256": sha, "x": round(spot[0]), "y": round(spot[1]),
            "longEdge": long_edge, "rotation": turn, "repeat": repeat,
        })
        return True

    # Largest first, so the unique pass never runs out of room.
    unique = sorted(DRAWINGS, key=lambda _: rng.random())
    for asset_id in unique:
        if not place(asset_id, SIZE_RANGE, 6000, False):
            raise SystemExit(f"No room for {asset_id}; shrink SIZE_RANGE or remove drawings")

    failures = 0
    while failures < FILL_PATIENCE:
        if place(rng.choice(DRAWINGS), FILL_SIZE_RANGE, 1, True):
            failures = 0
        else:
            failures += 1

    # Sixteen alpha levels keep the pencil softness at background strength and roughly halve the file.
    step = 255 / 15
    canvas = (np.round(canvas / step) * step).astype(np.uint8)
    tile = Image.merge("LA", (Image.new("L", (TILE, TILE), 0), Image.fromarray(canvas)))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    tile.save(OUTPUT, optimize=True)
    output_sha = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()

    manifest = {
        "tile": {"src": "/cromblog/doodle-vibe/pattern-tile.png", "pixels": TILE, "sha256": output_sha},
        "seed": SEED,
        "drawings": len(DRAWINGS),
        "placements": records,
    }
    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    coverage = float((canvas > 24).mean())
    print(f"{OUTPUT.relative_to(ROOT)}: {len(records)} placements ({len(DRAWINGS)} unique), "
          f"{OUTPUT.stat().st_size} bytes, ink coverage {coverage:.1%}")

    if args.preview:
        ink = np.array([58, 54, 47], dtype=np.float32)
        paper = np.array([241, 238, 229], dtype=np.float32)
        strength = (canvas.astype(np.float32) / 255.0 * 0.2)[..., None]
        sheet = (paper * (1 - strength) + ink * strength).astype(np.uint8)
        Image.fromarray(np.tile(sheet, (2, 2, 1))).resize((TILE, TILE)).save(args.preview)
        print(f"preview: {args.preview}")


if __name__ == "__main__":
    main()
