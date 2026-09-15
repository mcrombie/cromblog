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
import re
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/cromblog/doodle-vibe/pattern-tile.webp"
MANIFEST = ROOT / "content/doodle-vibe-pattern.generated.json"
TILE = 1800  # pixels; CSS draws the tile at half size (56.25rem) so strokes stay sharp on 2x screens
SEED = 20260915
SIZE_RANGE = (116, 188)  # longest edge in tile pixels for the unique pass
FILL_SIZE_RANGE = (80, 124)  # smaller repeats that fill the gaps
GAP = 14  # clear space between drawings, in tile pixels
MAX_TURN = 14  # degrees
FILL_PATIENCE = 1600  # consecutive failed placements before the fill pass stops
ALPHA_LEVELS = 16  # keeps pencil softness at background strength while compressing well

# Curated drawings with finished, legible line work (clean cutouts: haze < 0.3, cover < 0.42 in
# measure-cutouts.py), chosen by eye, plus the canonical June–August 2026 drawings from content/doodles.ts.
DRAWINGS = [
    # Canonical summer drawings
    "raven-01", "carolina-wren-01", "owl-on-branch-01", "scissor-tailed-flycatcher-01", "red-eyed-vireo-01",
    "common-flicker-tree-01", "eye-flower-sentinel-01", "one-eyed-gentleman-01", "bow-tied-crocodile-01",
    "caped-rabbit-01", "feathered-eye-01", "orb-balancing-slug-01",
    # Trees and plants
    "fn22-p034-a", "fn22-p092-a", "fn22-p097-a", "um22-p020-a", "um22-p022-a", "um22-p024-b", "um22-p079-a",
    "aa23-p001-a", "aa23-p013-a", "sm2324-p033-a", "jj25-p011-a", "jj25-p037-a", "jj25-p058-a",
    "jj2526-p172-a", "jj2526-p226-a", "jm26-p059-a", "jm26-p085-a", "jm26-p145-a", "jj25-p097-a",
    # Leaves, flowers and fruit
    "fn22-p074-a", "fn22-p099-a", "aj2425-p083-a", "aj2425-p145-a", "jj2526-p003-a", "jj2526-p061-a",
    "jj2526-p140-a", "jm26-p030-a", "jm26-p074-a", "jm26-p093-a", "jm26-p114-a", "jm26-p125-a",
    # Birds and animals
    "fn22-p021-a", "ma24-p146-a", "jj25-p027-b", "jj25-p036-a", "jj25-p134-a", "jj2526-p124-a",
    "jj2526-p093-a", "jj2526-p178-a", "jm26-p032-a", "jm26-p063-a", "na2223-p005-a", "na2223-p006-a",
    "aj2425-p089-a", "aj2425-p138-a", "jj25-p022-a", "aj2425-p166-a",
    # Characters and curiosities
    "um22-p015-a", "aa23-p011-a", "ma24-p075-a", "ma24-p187-a", "ma24-p177-a", "aj2425-p030-a",
    "aj2425-p031-a", "aj2425-p090-a", "aj2425-p177-a", "jj25-p095-a", "jj25-p178-a", "jj2526-p098-a",
    "jj2526-p163-a", "jm26-p106-a",
]


def catalog():
    entries = {}
    for file in sorted((ROOT / "content/doodle-batches").glob("*.json")):
        for entry in json.loads(file.read_text(encoding="utf-8")):
            entries[entry["id"]] = entry
    # The original June–August 2026 drawings live in content/doodles.ts rather than a batch file.
    legacy = (ROOT / "content/doodles.ts").read_text(encoding="utf-8")
    for asset_id, src in re.findall(r'"([a-z0-9-]+)": \{\s*id: "\1",\s*src: "([^"]+)"', legacy):
        status = "texture" if asset_id == "leaf-vine-01" else "curated"
        entries.setdefault(asset_id, {"id": asset_id, "src": src, "status": status})
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
    return max(mark.size) / 2 * 0.76 + GAP / 2


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--preview", help="write a 2x2 composite on paper for visual review")
    args = parser.parse_args()

    if len(set(DRAWINGS)) != len(DRAWINGS):
        raise SystemExit("DRAWINGS lists a drawing twice")
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

    for asset_id in sorted(DRAWINGS, key=lambda _: rng.random()):
        if not place(asset_id, SIZE_RANGE, 8000, False):
            raise SystemExit(f"No room for {asset_id}; shrink SIZE_RANGE or remove drawings")

    failures = 0
    while failures < FILL_PATIENCE:
        if place(rng.choice(DRAWINGS), FILL_SIZE_RANGE, 1, True):
            failures = 0
        else:
            failures += 1

    step = 255 / (ALPHA_LEVELS - 1)
    canvas = (np.round(canvas / step) * step).astype(np.uint8)
    # A black RGB carrier with the drawings in alpha: CSS masks read only the alpha channel.
    zero = Image.new("L", (TILE, TILE), 0)
    tile = Image.merge("RGBA", (zero, zero, zero, Image.fromarray(canvas)))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    tile.save(OUTPUT, "WEBP", lossless=True, method=6)
    output_sha = hashlib.sha256(OUTPUT.read_bytes()).hexdigest()

    manifest = {
        "tile": {"src": "/cromblog/doodle-vibe/pattern-tile.webp", "pixels": TILE, "sha256": output_sha},
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
