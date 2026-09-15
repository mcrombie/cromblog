"""Prepare stable, full-canvas references for the six-stage sunflower rebuild."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps


STAGES = (0, 20, 40, 60, 80, 100)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sheet", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--size", type=int, default=1536)
    return parser.parse_args()


def prepare_cell(cell: Image.Image, size: int) -> Image.Image:
    cell = ImageOps.exif_transpose(cell).convert("RGB")
    cell = ImageEnhance.Contrast(cell).enhance(1.02)
    return cell.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(args.sheet) as source:
        sheet = ImageOps.exif_transpose(source).convert("RGB")

    if sheet.width % 3 or sheet.height % 2:
        raise ValueError(f"Expected an exact 3x2 sheet, got {sheet.size}")
    cell_width = sheet.width // 3
    cell_height = sheet.height // 2
    if cell_width != cell_height:
        raise ValueError(f"Expected square cells, got {cell_width}x{cell_height}")

    prepared: list[Image.Image] = []
    for index, stage in enumerate(STAGES):
        column = index % 3
        row = index // 3
        box = (
            column * cell_width,
            row * cell_height,
            (column + 1) * cell_width,
            (row + 1) * cell_height,
        )
        cell = prepare_cell(sheet.crop(box), args.size)
        destination = args.output_dir / f"stage-{stage:03d}-reference.png"
        cell.save(destination, format="PNG", optimize=True)
        prepared.append(cell)

    canonical = prepared[0]
    canonical.save(
        args.output_dir / "canonical-composition.png",
        format="PNG",
        optimize=True,
    )

    preview_size = 384
    gap = 12
    preview = Image.new(
        "RGB",
        ((preview_size * 3) + (gap * 2), (preview_size * 2) + gap),
        (42, 40, 32),
    )
    for index, cell in enumerate(prepared):
        thumb = cell.resize((preview_size, preview_size), Image.Resampling.LANCZOS)
        preview.paste(
            thumb,
            (
                (index % 3) * (preview_size + gap),
                (index // 3) * (preview_size + gap),
            ),
        )
    preview.save(args.output_dir / "reference-review.png", format="PNG", optimize=True)

    print(
        {
            "output_dir": str(args.output_dir.resolve()),
            "stages": len(prepared),
            "size": (args.size, args.size),
        }
    )


if __name__ == "__main__":
    main()
