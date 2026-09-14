"""Build small CSS-mask derivatives from canonical original notebook alpha.

No source artwork is redrawn, thresholded, cleaned or overwritten. Only the alpha
channel is resized, never enlarged; its greyscale carrier is zero. The generated
metadata contains a deliberately small selection, safe for client components.
"""
import argparse
import hashlib
import io
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SPEC = ROOT / "content/doodle-vibe-assets.json"
GENERATED = ROOT / "content/doodle-vibe-assets.generated.json"
OUTPUT = ROOT / "public/cromblog/doodle-vibe"
ROLES = {"hero", "specimen", "mark", "meadow", "ornament"}


def digest(value):
    return hashlib.sha256(value).hexdigest()


def read(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def canonical_catalog():
    result = subprocess.run(
        ["node", str(ROOT / "scripts/export-doodle-vibe-catalog.cjs")],
        cwd=ROOT, check=True, capture_output=True, encoding="utf-8"
    )
    public = json.loads(result.stdout)
    return ({entry["id"]: entry for entry in public["catalog"]},
            {batch["id"]: batch["title"] for batch in public["batches"]})


def derive(config, catalog, batches):
    asset_id = config["id"]
    if not re.fullmatch(r"[a-z0-9-]+", asset_id):
        raise ValueError(f"Unsafe asset ID: {asset_id}")
    if config["role"] not in ROLES or config["longEdge"] not in (128, 256, 512, 768):
        raise ValueError(f"Invalid role or size for {asset_id}")
    if asset_id not in catalog:
        raise ValueError(f"Unknown drawing: {asset_id}")
    entry = catalog[asset_id]
    if entry["status"] not in ("curated", "texture"):
        raise ValueError(f"Archived drawing cannot decorate the site: {asset_id}")
    source = ROOT / "public" / entry["src"].lstrip("/")
    if not source.resolve().is_relative_to((ROOT / "public/cromblog/doodles").resolve()):
        raise ValueError(f"Drawing source outside the original catalog: {asset_id}")
    source_bytes = source.read_bytes()
    with Image.open(io.BytesIO(source_bytes)) as original:
        original.load()
        if "A" not in original.getbands():
            raise ValueError(f"Source has no original alpha channel: {asset_id} ({original.mode})")
        alpha = original.getchannel("A")
        if alpha.getextrema()[0] == 255:
            raise ValueError(f"Source is completely opaque: {asset_id}")
        values = np.asarray(alpha)
        visible = values >= 12
        haze = float(((values >= 12) & (values < 64)).sum() / max(int(visible.sum()), 1))
        cover = float(visible.mean())
        source_size = original.size
        scale = min(1, config["longEdge"] / max(source_size))
        dimensions = tuple(max(1, round(edge * scale)) for edge in source_size)
        if dimensions != source_size:
            alpha = alpha.resize(dimensions, Image.Resampling.LANCZOS)
        image = Image.merge("LA", (Image.new("L", dimensions, 0), alpha))
        buffer = io.BytesIO()
        image.save(buffer, format="PNG", optimize=True)
    encoded = buffer.getvalue()
    assert digest(source.read_bytes()) == digest(source_bytes), "Source changed during asset generation"
    record = {
        "id": asset_id, "role": config["role"], "src": f"/cromblog/doodle-vibe/{asset_id}.png",
        "width": dimensions[0], "height": dimensions[1], "title": entry["title"],
        "collection": batches[entry["batchId"]], "batchId": entry["batchId"],
        "status": entry["status"], "sourceSrc": entry["src"],
        "sourceSha256": digest(source_bytes), "sha256": digest(encoded),
        "bytes": len(encoded), "sourceWidth": source_size[0], "sourceHeight": source_size[1],
        "haze": round(haze, 4), "cover": round(cover, 4),
        "cleanlinessException": haze >= 0.25 or cover >= 0.45
    }
    return record, encoded


def review_sheet(records, images, destination):
    destination.mkdir(parents=True, exist_ok=True)
    font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 17)
    for start in range(0, len(records), 12):
        subset = list(records.items())[start:start + 12]
        board = Image.new("RGB", (1440, 1140), "#f6f0e3")
        draw = ImageDraw.Draw(board)
        for index, (asset_id, record) in enumerate(subset):
            x, y = index % 4 * 360, index // 4 * 380
            with Image.open(io.BytesIO(images[asset_id])) as image:
                alpha = image.getchannel("A")
                alpha.thumbnail((324, 304), Image.Resampling.LANCZOS)
                ink = Image.new("RGB", alpha.size, "#3a362f")
                board.paste(ink, (x + (360 - alpha.width) // 2, y + 6 + (308 - alpha.height) // 2), alpha)
            draw.text((x + 12, y + 322), asset_id, font=font, fill="#3a362f")
            draw.text((x + 12, y + 346), f'{record["role"]} | haze {record["haze"]:.2f}, cover {record["cover"]:.2f}', font=font, fill="#6b655a")
        board.save(destination / f"mask-review-{start // 12 + 1}.png")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify metadata, bytes, sources and CSS URLs without writing")
    parser.add_argument("--review", type=Path, help="Write private technical mask review boards")
    args = parser.parse_args()
    configs = read(SPEC)
    if len({item["id"] for item in configs}) != len(configs):
        raise ValueError("Doodle vibe IDs must be unique")
    catalog, batches = canonical_catalog()
    records, images = {}, {}
    for config in configs:
        record, encoded = derive(config, catalog, batches)
        records[record["id"]] = record
        images[record["id"]] = encoded
    metadata = (json.dumps(records, indent=2, ensure_ascii=False) + "\n").encode("utf-8")
    if args.check:
        if GENERATED.read_bytes() != metadata:
            raise ValueError("Doodle vibe generated metadata is stale; run the builder")
        for asset_id, expected in images.items():
            file = OUTPUT / f"{asset_id}.png"
            if file.read_bytes() != expected:
                raise ValueError(f"Doodle vibe derivative is stale: {asset_id}")
            with Image.open(file) as image:
                image.load()
                assert image.mode == "LA" and image.getchannel("L").getextrema() == (0, 0)
        existing = {file.stem for file in OUTPUT.glob("*.png")}
        if existing != set(records):
            raise ValueError(f"Unregistered doodle vibe files: {sorted(existing - set(records))}")
        css = ROOT / "app/vibe-doodle.css"
        if css.exists():
            for url_id in re.findall(r"/cromblog/doodle-vibe/([a-z0-9-]+)\.png", css.read_text(encoding="utf-8")):
                if url_id not in records:
                    raise ValueError(f"CSS references unregistered doodle: {url_id}")
        print(f"Verified {len(records)} original-stroke mask derivatives and canonical metadata.")
    else:
        OUTPUT.mkdir(parents=True, exist_ok=True)
        for asset_id, encoded in images.items():
            (OUTPUT / f"{asset_id}.png").write_bytes(encoded)
        GENERATED.write_bytes(metadata)
        print(f"Built {len(records)} original-stroke mask derivatives ({sum(map(len, images.values())):,} bytes total).")
    for record in records.values():
        if record["cleanlinessException"]:
            print(f'Visual-review exception: {record["id"]} haze={record["haze"]:.3f} cover={record["cover"]:.3f}')
    if args.review:
        if args.check:
            raise ValueError("--check cannot write review boards")
        review_sheet(records, images, args.review.resolve())


if __name__ == "__main__":
    main()
