"""Inventory a new Doodle Lab ZIP without altering its original photographs.

Requires Pillow. This prepares private review thumbnails only; extraction and
public catalog publication require visually reviewed annotations.
"""
import argparse
import hashlib
import io
import json
import re
import zipfile
from datetime import date
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PHOTO_TYPES = {".jpg", ".jpeg", ".png", ".webp"}


def save_json(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--zip", required=True, type=Path, dest="archive")
    parser.add_argument("--batch", required=True, help="Unique intake slug, e.g. 2026-09-notebook-03")
    parser.add_argument("--title", required=True)
    parser.add_argument("--id-prefix", required=True, help="Unique prefix for this intake's drawing IDs")
    parser.add_argument("--dry-run", action="store_true", help="Inspect the archive without creating files")
    args = parser.parse_args()
    for slug in (args.batch, args.id_prefix):
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
            parser.error("Batch and ID prefix must be lowercase alphanumeric slugs")
    batch = ROOT / "art-source" / args.batch
    if batch.exists() and not args.dry_run:
        parser.error("This batch directory already exists; use a new intake ID to protect its page references")
    if not args.dry_run:
        for previous in (ROOT / "art-source").glob("*/batch.json"):
            metadata = json.loads(previous.read_text(encoding="utf-8-sig"))
            if metadata.get("assetIdPrefix") == args.id_prefix:
                parser.error(f"Asset prefix already belongs to intake {metadata['id']}; choose a new prefix")
    with zipfile.ZipFile(args.archive) as archive:
        entries = sorted((entry for entry in archive.infolist()
                          if not entry.is_dir() and Path(entry.filename).suffix.lower() in PHOTO_TYPES
                          and "__MACOSX" not in entry.filename.split("/")), key=lambda e: e.filename.casefold())
        if not entries:
            parser.error("No supported photographs found (JPG, JPEG, PNG or WebP)")
        names = [Path(entry.filename.replace("\\", "/")).name for entry in entries]
        if len(names) != len({name.casefold() for name in names}):
            parser.error("The ZIP has colliding photograph filenames; resolve them before intake")
        if any(name.startswith(".") or any(c in name for c in '<>:"/\\|?*') for name in names):
            parser.error("Unsafe photograph filename in ZIP")
        total = sum(entry.file_size for entry in entries)
        if args.dry_run:
            print(json.dumps({"sourcePhotos": len(entries), "uncompressedBytes": total,
                              "batch": args.batch, "writes": False}, indent=2))
            return
        # Decode every image before creating the batch; corrupt inputs cannot
        # silently disappear from the source inventory.
        for entry in entries:
            with Image.open(io.BytesIO(archive.read(entry))) as im:
                im.verify()
        originals, review = batch / "originals", batch / "review"
        originals.mkdir(parents=True)
        review.mkdir()
        records = []
        for page, (entry, filename) in enumerate(zip(entries, names), 1):
            data = archive.read(entry)
            (originals / filename).write_bytes(data)
            with Image.open(io.BytesIO(data)) as im:
                oriented = ImageOps.exif_transpose(im).convert("RGB")
                records.append({"page": page, "file": filename, "archiveMember": entry.filename,
                                "width": oriented.width, "height": oriented.height,
                                "sha256": hashlib.sha256(data).hexdigest()})
                oriented.thumbnail((900, 1200), Image.Resampling.LANCZOS)
                oriented.save(review / f"page-{page:03d}.jpg", quality=88)
        save_json(batch / "sources.json", records)
        with args.archive.open("rb") as source_zip:
            archive_hash = hashlib.file_digest(source_zip, "sha256").hexdigest()
        save_json(batch / "batch.json", {
            "id": args.batch, "title": args.title, "artist": "Michael Crombie",
            "ingestedOn": date.today().isoformat(), "sourceArchive": args.archive.name,
            "sourceArchiveSha256": archive_hash,
            "sourcePhotoCount": len(records), "assetIdPrefix": args.id_prefix,
            "coordinateSystem": "EXIF-oriented source, normalized x/y in 0..1000"
        })
        save_json(batch / f"annotations-001-{len(records):03d}.json", [
            {"page": record["page"], "reviewed": False, "assets": []} for record in records
        ])
        for start in range(0, len(records), 12):
            sheet = Image.new("RGB", (1500, 2120), "#e6e6e6")
            draw = ImageDraw.Draw(sheet)
            for index, record in enumerate(records[start:start + 12]):
                x, y = (index % 3) * 500, (index // 3) * 530
                with Image.open(review / f"page-{record['page']:03d}.jpg") as im:
                    im.thumbnail((488, 495), Image.Resampling.LANCZOS)
                    sheet.paste(im, (x + (500 - im.width) // 2, y + 28))
                draw.text((x + 10, y + 8), f"{record['page']:03d}  {record['file']}", fill="black")
            sheet.save(review / f"contact-{start // 12 + 1:02d}.jpg", quality=88)
    print(f"Inventoried {len(records)} originals in {batch}; review each page before extraction.")


if __name__ == "__main__":
    main()
