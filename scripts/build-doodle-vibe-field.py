"""Build the Doodle Lab vibe's background field: a few dozen hand-picked notebook drawings, each shown once.

content/doodle-vibe-field.json names the drawings, best first. `main` is scattered behind the page's
paper panels and `sidebar` behind the navigation column. Each drawing gets one small alpha-only mask
(trimmed to its visible strokes, shrunk but never enlarged, its greyscale carrier zero) and a seeded
place on a viewport-sized sheet: larger drawings are placed first, each at the best-spaced of many
random candidates, so the field is scattered rather than tiled and a rebuild reproduces it exactly.
Phones and tablets get their own portrait layout of the first NARROW_COUNT main drawings.

Usage (repository root):
  py -3.14 scripts/build-doodle-vibe-field.py
  py -3.14 scripts/build-doodle-vibe-field.py --check
  py -3.14 scripts/build-doodle-vibe-field.py --preview preview.png   # also draw the three sheets on paper
"""
import argparse
import io
import json
import math
import random
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPEC = ROOT / "content/doodle-vibe-field.json"
GENERATED = ROOT / "content/doodle-vibe-field.generated.json"
OUTPUT = ROOT / "public/cromblog/doodle-vibe/field"
PUBLIC_PATH = "/cromblog/doodle-vibe/field"
SEED = 20260917
MASK_LONG_EDGE = 320  # pixels; nearly twice the largest drawn size, so strokes stay sharp on 2x screens
ALPHA_LEVELS = 8  # enough pencil softness at background strength, and a third smaller than 16
VISIBLE = 12  # alpha below this cannot be seen at background strength; only used to find the trim box
NARROW_COUNT = 14
CANDIDATES = 600

# Reference sheets in CSS pixels. A drawing's size range is the side of a square of equal area, capped
# on the long edge. Widths are written in rem and positions as percentages of the sheet; the CSS scales
# the narrow layout by NARROW_SCALE.
MAIN_SIZE, MAIN_LONGEST, MAIN_TURN = (92, 132), 176, 9
SIDEBAR_SIZE, SIDEBAR_LONGEST, SIDEBAR_TURN = (72, 96), 150, 7
SHEETS = {"wide": (1120, 860), "narrow": (420, 820), "sidebar": (288, 860)}
NARROW_SCALE = 0.72


def canonical_catalog():
    result = subprocess.run(
        ["node", str(ROOT / "scripts/export-doodle-vibe-catalog.cjs")],
        cwd=ROOT, check=True, capture_output=True, encoding="utf-8"
    )
    return {entry["id"]: entry for entry in json.loads(result.stdout)["catalog"]}


def derive(asset_id, catalog):
    entry = catalog.get(asset_id)
    if entry is None:
        raise ValueError(f"Unknown drawing: {asset_id}")
    if entry["status"] != "curated":
        raise ValueError(f"Only curated drawings can feature in the field: {asset_id} ({entry['status']})")
    source = ROOT / "public" / entry["src"].lstrip("/")
    if not source.resolve().is_relative_to((ROOT / "public/cromblog/doodles").resolve()):
        raise ValueError(f"Drawing source outside the original catalog: {asset_id}")
    with Image.open(source) as original:
        if "A" not in original.getbands():
            raise ValueError(f"Source has no original alpha channel: {asset_id} ({original.mode})")
        alpha = original.getchannel("A")
    box = alpha.point(lambda value: 255 if value >= VISIBLE else 0).getbbox()
    if box is None:
        raise ValueError(f"Empty drawing: {asset_id}")
    alpha = alpha.crop(box)
    scale = min(1.0, MASK_LONG_EDGE / max(alpha.size))
    size = (max(1, round(alpha.width * scale)), max(1, round(alpha.height * scale)))
    if size != alpha.size:
        alpha = alpha.resize(size, Image.Resampling.LANCZOS)
    step = 255 / (ALPHA_LEVELS - 1)
    alpha = Image.fromarray((np.round(np.asarray(alpha) / step) * step).astype(np.uint8))
    zero = Image.new("L", size, 0)
    buffer = io.BytesIO()
    Image.merge("RGBA", (zero, zero, zero, alpha)).save(buffer, "WEBP", lossless=True, quality=100, method=5)
    return {"width": size[0], "height": size[1]}, buffer.getvalue(), alpha


def footprint(rng, record, size_range, longest):
    """A drawn size in CSS pixels: equal-area side drawn at random, then capped on the long edge."""
    side = rng.uniform(*size_range)
    ratio = record["width"] / record["height"]
    width, height = side * math.sqrt(ratio), side / math.sqrt(ratio)
    shrink = min(1.0, longest / max(width, height))
    return width * shrink, height * shrink


def scatter(rng, items, sheet, scale=1.0):
    """Best-candidate placement: each drawing, largest first, takes the candidate spot with the most room.
    Sheet edges count as neighbours standing a little outside, so drawings may tuck under the panel edge."""
    sheet_width, sheet_height = sheet
    placed, spots = [], {}
    for item in sorted(items, key=lambda entry: -(entry["w"] * entry["h"])):
        radius = max(item["w"], item["h"]) * scale * 0.42 + 8
        best, best_room = None, -math.inf
        for _ in range(CANDIDATES):
            x, y = rng.uniform(0, sheet_width), rng.uniform(0, sheet_height)
            room = min(x, sheet_width - x, sheet_height - y, y) - radius * 0.4
            for other_x, other_y, other_radius in placed:
                room = min(room, math.hypot(x - other_x, y - other_y) - radius - other_radius)
            if room > best_room:
                best, best_room = (x, y), room
        placed.append((*best, radius))
        spots[item["id"]] = best
    return spots


def build(catalog):
    spec = json.loads(SPEC.read_text(encoding="utf-8"))
    ids = spec["main"] + spec["sidebar"]
    if len(set(ids)) != len(ids):
        raise ValueError("A drawing is listed twice; the field shows each drawing once")
    rng = random.Random(SEED)
    records, images, masks = {}, {}, {}
    for asset_id in ids:
        record, encoded, alpha = derive(asset_id, catalog)
        records[asset_id], images[asset_id], masks[asset_id] = record, encoded, alpha

    def sized(group, size_range, longest, turn):
        items = []
        for asset_id in group:
            width, height = footprint(rng, records[asset_id], size_range, longest)
            items.append({"id": asset_id, "w": width, "h": height, "rotate": round(rng.uniform(-turn, turn) * 2) / 2})
        return items

    main = sized(spec["main"], MAIN_SIZE, MAIN_LONGEST, MAIN_TURN)
    sidebar = sized(spec["sidebar"], SIDEBAR_SIZE, SIDEBAR_LONGEST, SIDEBAR_TURN)
    wide = scatter(rng, main, SHEETS["wide"])
    narrow = scatter(rng, main[:NARROW_COUNT], SHEETS["narrow"], NARROW_SCALE)
    side = scatter(rng, sidebar, SHEETS["sidebar"])

    def entry(item, spot, sheet, narrow_spot=None):
        record = records[item["id"]]
        result = {
            "id": item["id"],
            "src": f"{PUBLIC_PATH}/{item['id']}.webp",
            "maskWidth": record["width"],
            "maskHeight": record["height"],
            "width": round(item["w"] / 16, 2),
            "x": round(spot[0] / sheet[0] * 100, 2),
            "y": round(spot[1] / sheet[1] * 100, 2),
            "rotate": item["rotate"],
        }
        if narrow_spot is not None:
            result["narrow"] = {
                "x": round(narrow_spot[0] / SHEETS["narrow"][0] * 100, 2),
                "y": round(narrow_spot[1] / SHEETS["narrow"][1] * 100, 2),
            }
        return result

    generated = {
        "narrowScale": NARROW_SCALE,
        "main": [entry(item, wide[item["id"]], SHEETS["wide"], narrow.get(item["id"])) for item in main],
        "sidebar": [entry(item, side[item["id"]], SHEETS["sidebar"]) for item in sidebar],
    }
    metadata = (json.dumps(generated, indent=2, ensure_ascii=False) + "\n").encode("utf-8")
    return generated, metadata, images, masks


def preview(generated, masks, destination):
    paper, ink = np.array([246, 240, 227], dtype=np.float32), np.array([58, 54, 47], dtype=np.float32)
    gap = 40
    boards = []
    for name, group, scale, strength in (("wide", "main", 1.0, 0.22), ("narrow", "main", NARROW_SCALE, 0.22),
                                         ("sidebar", "sidebar", 1.0, 0.18)):
        width, height = SHEETS[name]
        coverage = np.zeros((height, width), dtype=np.float32)
        for item in generated[group]:
            spot = item if name != "narrow" else item.get("narrow")
            if spot is None:
                continue
            drawn_width = item["width"] * 16 * scale
            drawn_height = drawn_width * item["maskHeight"] / item["maskWidth"]
            mark = masks[item["id"]].resize((max(1, round(drawn_width)), max(1, round(drawn_height))), Image.Resampling.LANCZOS)
            mark = mark.rotate(-item["rotate"], resample=Image.Resampling.BICUBIC, expand=True)
            canvas = Image.new("L", (width, height), 0)
            canvas.paste(mark, (round(spot["x"] / 100 * width - mark.width / 2), round(spot["y"] / 100 * height - mark.height / 2)))
            coverage = np.maximum(coverage, np.asarray(canvas, dtype=np.float32) / 255)
        alpha = (coverage * strength)[..., None]
        boards.append(Image.fromarray((paper * (1 - alpha) + ink * alpha).astype(np.uint8)))
    sheet = Image.new("RGB", (sum(board.width for board in boards) + gap * (len(boards) + 1), max(board.height for board in boards) + 2 * gap), (214, 203, 184))
    left = gap
    for board in boards:
        sheet.paste(board, (left, gap))
        left += board.width + gap
    sheet.save(destination)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--check", action="store_true", help="verify the generated layout and masks without writing")
    parser.add_argument("--preview", type=Path, help="draw the wide, narrow and sidebar sheets on paper for review")
    args = parser.parse_args()

    generated, metadata, images, masks = build(canonical_catalog())
    if args.check:
        if GENERATED.read_bytes() != metadata:
            raise ValueError("Doodle field layout is stale; run the builder")
        for asset_id, expected in images.items():
            if (OUTPUT / f"{asset_id}.webp").read_bytes() != expected:
                raise ValueError(f"Doodle field mask is stale: {asset_id}")
        existing = {file.name for file in OUTPUT.iterdir()}
        expected_names = {f"{asset_id}.webp" for asset_id in images}
        if existing != expected_names:
            raise ValueError(f"Unregistered doodle field files: {sorted(existing - expected_names)}")
        print(f"Verified the doodle field: {len(generated['main'])} main and {len(generated['sidebar'])} sidebar drawings.")
    else:
        OUTPUT.mkdir(parents=True, exist_ok=True)
        for file in OUTPUT.glob("*.webp"):
            if file.stem not in images:
                file.unlink()
        for asset_id, encoded in images.items():
            (OUTPUT / f"{asset_id}.webp").write_bytes(encoded)
        GENERATED.write_bytes(metadata)
        print(f"Built the doodle field: {len(generated['main'])} main and {len(generated['sidebar'])} sidebar drawings, "
              f"{sum(map(len, images.values())):,} bytes of masks.")
    if args.preview:
        preview(generated, masks, args.preview.resolve())
        print(f"preview: {args.preview}")


if __name__ == "__main__":
    main()
