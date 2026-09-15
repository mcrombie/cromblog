"""Reproducible, non-generative notebook extraction and catalog validation.

Requires Pillow and NumPy. Polygons use 0..1000 coordinates on the EXIF-oriented
source. Originals are never overwritten. Private sources, recipes and full-size
alpha masters remain outside public; only reviewed image assets and descriptive
catalog fields are published. See art-source/DOODLE-LAB.md for the workflow.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps, __version__ as PILLOW_VERSION

ROOT = Path(__file__).resolve().parents[1]
BATCH_ID = "2026-01-may"


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def path_inside(root, relative):
    candidate = (root / relative).resolve()
    if not candidate.is_relative_to(root.resolve()):
        raise ValueError(f"Path escapes its batch directory: {relative}")
    return candidate


def indexed_records(records, key, label):
    result = {record[key]: record for record in records}
    if len(result) != len(records):
        raise ValueError(f"Duplicate {label}")
    return result


def public_entry(asset, batch_id, size):
    return {
        "id": asset["id"], "title": asset["title"],
        "src": f"/cromblog/doodles/{batch_id}/{asset['id']}.png",
        "alt": asset.get("alt", f"Notebook drawing: {asset['title'].lower()}."),
        "batchId": batch_id, "status": asset["status"],
        "category": asset["category"], "tags": [tag for tag in asset["tags"] if tag],
        "image": {"width": size[0], "height": size[1]}
    }


def recipes(batch):
    result = []
    for path in sorted(batch.glob("annotations-*.json")):
        result.extend(read_json(path))
    ids = [a["id"] for page in result for a in page["assets"]]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate asset IDs in annotations")
    page_ids = [page["page"] for page in result]
    if len(page_ids) != len(set(page_ids)):
        raise ValueError("A source page has multiple annotation records")
    for page in result:
        if not page.get("reviewed"):
            raise ValueError(f"Page {page['page']} is not reviewed")
        for asset in page["assets"]:
            if not re.fullmatch(r"[a-z0-9-]+", asset["id"]):
                raise ValueError("Unsafe asset ID")
            if asset["status"] not in {"curated", "texture", "archive"}:
                raise ValueError("Invalid selection status")
            if any(not isinstance(asset.get(key), str) or not asset[key].strip()
                   for key in ("title", "category")):
                raise ValueError(f"Missing descriptive metadata for {asset['id']}")
            if not isinstance(asset.get("tags"), list) or not asset["tags"] or any(
                not isinstance(tag, str) or not tag.strip() for tag in asset["tags"]
            ):
                raise ValueError(f"Invalid tags for {asset['id']}")
            for polygon in [asset["polygon"], *asset.get("exclude", [])]:
                if len(polygon) < 3 or any(len(p) != 2 or not all(0 <= c <= 1000 for c in p) for p in polygon):
                    raise ValueError(f"Invalid polygon for {asset['id']}")
    return sorted(result, key=lambda page: page["page"])


def remove_specks(alpha, min_area=4):
    """Remove only tiny disconnected components; never smooth or redraw a line."""
    if min_area <= 1:
        return alpha
    occupied = alpha > 0
    seen = set()
    h, w = occupied.shape
    # Most pixels belong to long runs. Inspect short horizontal runs only; an
    # attached component reaching min_area is retained immediately.
    padded = np.pad(occupied, ((0, 0), (1, 1))).astype(np.int8)
    edges = np.diff(padded, axis=1)
    starts = np.argwhere(edges == 1)
    ends = np.argwhere(edges == -1)
    for (y, x), (_, end) in zip(starts, ends):
        y, x = int(y), int(x)
        if end - x >= min_area or (y, x) in seen:
            continue
        todo, component = [(y, x)], set()
        while todo and len(component) < min_area:
            py, px = todo.pop()
            if (py, px) in component or not (0 <= py < h and 0 <= px < w) or not occupied[py, px]:
                continue
            component.add((py, px))
            todo.extend((py + dy, px + dx) for dy in (-1, 0, 1) for dx in (-1, 0, 1) if dx or dy)
        seen.update(component)
        if len(component) < min_area:
            for py, px in component:
                alpha[py, px] = 0
    return alpha


def extract(source, asset):
    w, h = source.size
    def scale(poly):
        return [(round(x * w / 1000), round(y * h / 1000)) for x, y in poly]
    selection = Image.new("L", source.size, 0)
    draw = ImageDraw.Draw(selection)
    draw.polygon(scale(asset["polygon"]), fill=255)
    for polygon in asset.get("exclude", []):
        draw.polygon(scale(polygon), fill=0)
    bounds = selection.getbbox()
    if bounds is None:
        raise ValueError(f"Empty selection: {asset['id']}")
    gray = source.convert("L")
    # Estimate paper illumination on a reduced page, filling pencil marks before
    # smoothing. This preserves broad shading while removing camera shadows.
    small = gray.resize((max(1, w // 12), max(1, h // 12)), Image.Resampling.BILINEAR)
    background = small.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(5))
    background = background.resize(source.size, Image.Resampling.BILINEAR).crop(bounds)
    paper = np.asarray(background, dtype=np.float32)
    graphite = np.asarray(gray.crop(bounds), dtype=np.float32)
    cutoff = float(asset.get("paperCutoff", 12))
    contrast = np.maximum(paper - graphite - cutoff, 0)
    strength = np.maximum(paper * float(asset.get("inkRange", 0.59)), 1)
    alpha = (np.clip(contrast / strength, 0, 1) ** 0.85 * 255).astype(np.uint8)
    alpha[np.asarray(selection.crop(bounds)) == 0] = 0
    alpha[alpha < 12] = 0
    visible_ink = alpha[alpha > 24]
    if visible_ink.size:
        # Lift faint camera captures into a readable pencil range without
        # smoothing, changing contours, or forcing every mark to solid black.
        gain = min(1.7, max(1.0, 205 / float(np.percentile(visible_ink, 99))))
        alpha = np.clip(alpha.astype(np.float32) * gain, 0, 255).astype(np.uint8)
    rgba = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    rgba[:, :, :3] = [36, 33, 29]
    rgba[:, :, 3] = alpha
    master = Image.fromarray(rgba)
    if asset.get("rotation"):
        master = master.rotate(asset["rotation"], expand=True, resample=Image.Resampling.BICUBIC)
    trim = master.getbbox()
    if trim is None:
        raise ValueError(f"No drawing ink extracted: {asset['id']}")
    master = master.crop(trim)
    border = max(20, round(max(master.size) * 0.025))
    return ImageOps.expand(master, border, fill=(36, 33, 29, 0))


def build(batch, args):
    sources = indexed_records(read_json(batch / "sources.json"), "page", "source page numbers")
    pages = recipes(batch)
    if not args.pages and set(sources) != {p["page"] for p in pages}:
        raise ValueError("Every source photo must have a review record before a full build")
    selected_pages = set(map(int, args.pages.split(","))) if args.pages else None
    if selected_pages and not selected_pages.issubset({p["page"] for p in pages}):
        raise ValueError("A requested page has no review record")
    if args.max_edge < 1:
        raise ValueError("Maximum image edge must be positive")
    current = ROOT / "content" / "doodle-batches" / f"{args.batch}.json"
    existing, old_provenance = [], []
    if selected_pages:
        existing = read_json(current) if current.exists() else []
        old_provenance = read_json(batch / "provenance.json") if (batch / "provenance.json").exists() else []
        existing_ids = indexed_records(existing, "id", "existing catalog IDs")
        old_ids = indexed_records(old_provenance, "id", "existing provenance IDs")
        if set(existing_ids) != set(old_ids):
            raise ValueError("Partial rebuild requires matching catalog and provenance; use a full build to recover")
    output = path_inside(ROOT / "public" / "cromblog" / "doodles", args.batch)
    masters = batch / "masters"
    output.mkdir(parents=True, exist_ok=True)
    masters.mkdir(exist_ok=True)
    manifest, provenance = [], []
    for page in pages:
        if selected_pages and page["page"] not in selected_pages:
            continue
        record = sources[page["page"]]
        source_path = path_inside(batch / "originals", record["file"])
        digest = hashlib.sha256(source_path.read_bytes()).hexdigest()
        if digest != record["sha256"]:
            raise ValueError(f"Source hash mismatch for page {page['page']}")
        with Image.open(source_path) as raw:
            source = ImageOps.exif_transpose(raw).convert("RGB")
        for asset in page["assets"]:
            master = extract(source, asset)
            master.save(masters / f"{asset['id']}.png", optimize=True)
            sample = master.copy()
            sample.thumbnail((args.max_edge, args.max_edge), Image.Resampling.LANCZOS)
            pixels = np.array(sample)
            pixels[:, :, 3] = remove_specks(pixels[:, :, 3], asset.get("minComponent", 4))
            sample = Image.fromarray(pixels)
            sample.save(output / f"{asset['id']}.png", optimize=True)
            manifest.append(public_entry(asset, args.batch, sample.size))
            provenance.append({
                "id": asset["id"], "sourcePage": page["page"], "sourceFile": record["file"],
                "sourceSha256": digest, "treatment": "original-stroke-extraction",
                "master": f"masters/{asset['id']}.png", "masterSize": list(master.size),
                "masterSha256": hashlib.sha256((masters / f"{asset['id']}.png").read_bytes()).hexdigest(),
                "sampleMaxEdge": args.max_edge,
                "software": {"extractorVersion": 1, "pillow": PILLOW_VERSION, "numpy": np.__version__},
                "recipe": asset, "outputSha256": hashlib.sha256((output / f"{asset['id']}.png").read_bytes()).hexdigest()
            })
        print(f"Page {page['page']:03d}: {len(page['assets'])} drawings", flush=True)
    if selected_pages:
        replaces = {item["id"] for item in manifest}
        replaces.update(item["id"] for item in old_provenance if item["sourcePage"] in selected_pages)
        manifest += [item for item in existing if item["id"] not in replaces]
        provenance += [item for item in old_provenance if item["sourcePage"] not in selected_pages]
    # Deliberate lead selections; stable order stays predictable between visits.
    lead = read_json(batch / "batch.json").get("leadAssetIds", [
        "jm26-p196-a", "jm26-p197-a", "jm26-p170-a", "jm26-p203-a", "jm26-p189-a", "jm26-p172-a"
    ])
    manifest.sort(key=lambda a: (lead.index(a["id"]) if a["id"] in lead else len(lead), a["id"]))
    write_json(ROOT / "content" / "doodle-batches" / f"{args.batch}.json", manifest)
    write_json(batch / "provenance.json", sorted(provenance, key=lambda a: a["id"]))
    # A held-back or renamed drawing must not leave an orphan reachable through
    # the public web server. Only remove this extractor's named PNG outputs.
    published_ids = {entry["id"] for entry in manifest}
    for old_sample in output.glob("*.png"):
        if old_sample.stem not in published_ids:
            path_inside(output, old_sample.name).unlink()
    print(json.dumps({"drawings": len(manifest), "selections": Counter(a['status'] for a in manifest)}))


def review(batch, args):
    catalog = read_json(ROOT / "content" / "doodle-batches" / f"{args.batch}.json")
    target = batch / "review" / "extracted"
    target.mkdir(parents=True, exist_ok=True)
    page_size = 24
    for start in range(0, len(catalog), page_size):
        items = catalog[start:start + page_size]
        sheet = Image.new("RGB", (1800, 1680), "#e8e2d8")
        draw = ImageDraw.Draw(sheet)
        for i, entry in enumerate(items):
            x, y = (i % 6) * 300, (i // 6) * 420
            draw.rectangle((x + 4, y + 4, x + 296, y + 415), fill="#faf7f0")
            with Image.open(path_inside(ROOT / "public", entry["src"].lstrip("/"))) as im:
                im.thumbnail((275, 348), Image.Resampling.LANCZOS)
                sheet.paste(im, (x + (300 - im.width) // 2, y + 12 + (348 - im.height) // 2), im)
            draw.text((x + 10, y + 365), entry["id"] + " / " + entry["status"], fill="#24211d")
            title = entry["title"]
            draw.text((x + 10, y + 385), title[:39], fill="#24211d")
        sheet.save(target / f"sheet-{start // page_size + 1:02d}.jpg", quality=90)
    sheet_names = {f"sheet-{i + 1:02d}.jpg" for i in range((len(catalog) + page_size - 1) // page_size)}
    for old_sheet in target.glob("sheet-*.jpg"):
        if re.fullmatch(r"sheet-\d+\.jpg", old_sheet.name) and old_sheet.name not in sheet_names:
            path_inside(target, old_sheet.name).unlink()
    print(f"Created {(len(catalog) + page_size - 1) // page_size} extraction contact sheets")


def validate(batch, args):
    catalog = read_json(ROOT / "content" / "doodle-batches" / f"{args.batch}.json")
    pages = recipes(batch)
    sources = indexed_records(read_json(batch / "sources.json"), "page", "source page numbers")
    if {p["page"] for p in pages} != set(sources):
        raise ValueError("Missing source review coverage")
    expected = {a["id"] for p in pages for a in p["assets"]}
    if {a["id"] for a in catalog} != expected or len(catalog) != len(expected):
        raise ValueError("Catalog/recipe mismatch or duplicate IDs")
    provenance = indexed_records(read_json(batch / "provenance.json"), "id", "provenance IDs")
    if set(provenance) != expected:
        raise ValueError("Provenance/catalog mismatch")
    recipe_by_id = {asset["id"]: (page["page"], asset) for page in pages for asset in page["assets"]}
    output = path_inside(ROOT / "public" / "cromblog" / "doodles", args.batch)
    if {path.name for path in output.iterdir()} != {f"{asset_id}.png" for asset_id in expected}:
        raise ValueError("Public batch directory contains missing or unlisted files")
    for source in sources.values():
        source_path = path_inside(batch / "originals", source["file"])
        if hashlib.sha256(source_path.read_bytes()).hexdigest() != source["sha256"]:
            raise ValueError(f"Source hash mismatch for page {source['page']}")
    allowed = {"id", "title", "src", "alt", "batchId", "status", "category", "tags", "image"}
    total = 0
    for entry in catalog:
        if set(entry) != allowed or not entry["alt"] or not entry["tags"]:
            raise ValueError(f"Invalid public metadata: {entry['id']}")
        page_number, recipe = recipe_by_id[entry["id"]]
        if entry != public_entry(recipe, args.batch, (entry["image"]["width"], entry["image"]["height"])):
            raise ValueError(f"Public metadata differs from reviewed recipe: {entry['id']}")
        origin = provenance[entry["id"]]
        source = sources[page_number]
        if (origin["sourcePage"] != page_number or origin["sourceFile"] != source["file"]
                or origin["sourceSha256"] != source["sha256"]
                or origin["treatment"] != "original-stroke-extraction"):
            raise ValueError(f"Incorrect source provenance for {entry['id']}")
        # Private editorial notes may change without altering extracted pixels.
        if ({key: value for key, value in origin["recipe"].items() if key != "notes"}
                != {key: value for key, value in recipe.items() if key != "notes"}):
            raise ValueError(f"Drawing must be rebuilt after recipe changes: {entry['id']}")
        if origin["master"] != f"masters/{entry['id']}.png":
            raise ValueError(f"Incorrect master path for {entry['id']}")
        master_path = path_inside(batch / "masters", f"{entry['id']}.png")
        with Image.open(master_path) as master:
            if master.mode != "RGBA" or list(master.size) != origin["masterSize"]:
                raise ValueError(f"Incorrect master dimensions/alpha for {entry['id']}")
        if origin.get("masterSha256") and hashlib.sha256(master_path.read_bytes()).hexdigest() != origin["masterSha256"]:
            raise ValueError(f"Master hash mismatch for {entry['id']}")
        path = path_inside(ROOT / "public", entry["src"].lstrip("/"))
        if hashlib.sha256(path.read_bytes()).hexdigest() != origin["outputSha256"]:
            raise ValueError(f"Public output hash mismatch for {entry['id']}")
        with Image.open(path) as im:
            if im.mode != "RGBA" or im.size != (entry["image"]["width"], entry["image"]["height"]):
                raise ValueError(f"Incorrect dimensions/alpha for {entry['id']}")
            alpha = np.asarray(im.getchannel("A"))
            if not alpha.max() or any(border.max() for border in (alpha[0], alpha[-1], alpha[:, 0], alpha[:, -1])):
                raise ValueError(f"Empty art or ink touches border: {entry['id']}")
        total += path.stat().st_size
    report = {"sourcePhotos": len(sources), "reviewedPhotos": len(pages), "publicDrawings": len(catalog),
              "statusCounts": dict(Counter(a["status"] for a in catalog)), "publicImageBytes": total,
              "sourceOnlyPages": sum(not p["assets"] for p in pages),
              "structuredPendingDrawings": sum(len(p.get("pendingAssets", [])) for p in pages)}
    write_json(batch / "validation.json", report)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=["build", "review", "validate"])
    parser.add_argument("--batch", default=BATCH_ID)
    parser.add_argument("--pages", help="Comma-separated pages for a focused rebuild")
    parser.add_argument("--max-edge", type=int, default=1600)
    args = parser.parse_args()
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", args.batch):
        parser.error("--batch must be a lowercase letters/digits/hyphens identifier")
    batch = path_inside(ROOT / "art-source", args.batch)
    {"build": build, "review": review, "validate": validate}[args.command](batch, args)
