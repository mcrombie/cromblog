"""Build photograph-to-engraving GIF and WebP transitions for Cromblog."""

from __future__ import annotations

import argparse
import math
import random
import shutil
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps, ImageStat


@dataclass(frozen=True)
class Asset:
    slug: str
    original_name: str
    engraved_name: str


ASSETS = (
    Asset(
        "01-boxed-chassis-side",
        "01-boxed-chassis-side-original.jpg",
        "01-boxed-chassis-side-engraved.png",
    ),
    Asset(
        "02-plain-chassis-side",
        "02-plain-chassis-side-original.jpg",
        "02-plain-chassis-side-engraved.png",
    ),
    Asset(
        "03-front-assembly",
        "03-front-assembly-original.jpg",
        "03-front-assembly-engraved.png",
    ),
    Asset(
        "04-closed-chassis-overhead",
        "04-closed-chassis-overhead-original.jpg",
        "04-closed-chassis-overhead-engraved.png",
    ),
    Asset(
        "05-led-matrix-detail",
        "05-led-matrix-detail-original.jpg",
        "05-led-matrix-detail-engraved.png",
    ),
    Asset(
        "06-electronics-overhead",
        "06-electronics-overhead-original.jpg",
        "06-electronics-overhead-engraved.png",
    ),
    Asset(
        "07-ultrasonic-sensor-front",
        "07-ultrasonic-sensor-front-original.jpg",
        "07-ultrasonic-sensor-front-engraved.png",
    ),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--source-dir",
        type=Path,
        default=Path("art-source/robot-car-transformations"),
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("public/cromblog/robot-car-transformations"),
    )
    parser.add_argument("--max-edge", type=int, default=768)
    parser.add_argument("--colors", type=int, default=192)
    parser.add_argument("--webp-quality", type=int, default=88)
    parser.add_argument(
        "--only",
        action="append",
        choices=[asset.slug for asset in ASSETS],
        help="Build only the named asset; repeat for multiple assets.",
    )
    return parser.parse_args()


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - (2.0 * value))


def open_rgb(path: Path) -> Image.Image:
    with Image.open(path) as source:
        return ImageOps.exif_transpose(source).convert("RGB")


def canvas_size(image: Image.Image, max_edge: int) -> tuple[int, int]:
    width, height = image.size
    scale = max_edge / max(width, height)
    scaled_width = max(2, round((width * scale) / 2) * 2)
    scaled_height = max(2, round((height * scale) / 2) * 2)
    return scaled_width, scaled_height


def fit_pair(
    original_path: Path,
    engraved_path: Path,
    max_edge: int,
) -> tuple[Image.Image, Image.Image]:
    original = open_rgb(original_path)
    engraved = open_rgb(engraved_path)
    size = canvas_size(original, max_edge)
    fitted_original = ImageOps.fit(
        original,
        size,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
    fitted_engraved = ImageOps.fit(
        engraved,
        size,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
    return fitted_original, fitted_engraved


def seeded_noise(size: tuple[int, int], seed: int) -> Image.Image:
    width, height = size
    small_width = max(48, width // 8)
    small_height = max(48, height // 8)
    randomizer = random.Random(seed)
    noise = Image.new("L", (small_width, small_height))
    noise.putdata(
        [
            randomizer.randrange(256)
            for _ in range(small_width * small_height)
        ]
    )
    return noise.resize(size, Image.Resampling.BICUBIC).filter(
        ImageFilter.GaussianBlur(max(1, round(max(size) * 0.004)))
    )


def make_paper(size: tuple[int, int], seed: int) -> Image.Image:
    noise = seeded_noise(size, seed)
    warm = Image.new("RGB", size, (231, 211, 166))
    light = Image.new("RGB", size, (247, 233, 198))
    return Image.composite(light, warm, noise)


def ink_reveal_mask(
    size: tuple[int, int],
    progress: float,
    noise: Image.Image,
) -> Image.Image:
    width, height = size
    feather = max(28, round(width * 0.075))
    boundary = (-0.08 + (1.16 * smoothstep(progress))) * width
    row = Image.new("L", (width, 1))
    row.putdata(
        [
            max(
                0,
                min(
                    255,
                    round(((boundary - x) + (feather / 2)) * 255 / feather),
                ),
            )
            for x in range(width)
        ]
    )
    linear = row.resize((width, height), Image.Resampling.NEAREST)
    quiet_noise = Image.blend(Image.new("L", size, 128), noise, 0.2)
    mask = ImageChops.add(linear, quiet_noise, scale=1.0, offset=-128)
    return mask.filter(ImageFilter.GaussianBlur(max(1, round(width * 0.003))))


def build_frames(
    original: Image.Image,
    engraved: Image.Image,
    seed: int,
) -> tuple[list[Image.Image], list[int]]:
    if original.size != engraved.size:
        raise ValueError((original.size, engraved.size))

    frames = [original.copy()]
    durations = [500]
    noise = seeded_noise(original.size, seed)
    reveal_steps = 14

    for step in range(1, reveal_steps + 1):
        progress = step / reveal_steps
        if step == reveal_steps:
            frame = engraved.copy()
        else:
            mask = ink_reveal_mask(original.size, progress, noise)
            frame = Image.composite(engraved, original, mask)
        frames.append(frame)
        durations.append(800 if step == reveal_steps else 80)

    paper = make_paper(original.size, seed + 7000)
    for amount in (0.45, 0.78, 1.0):
        frames.append(Image.blend(engraved, paper, amount))
        durations.append(100)
    for amount in (0.45, 0.78, 1.0):
        frames.append(Image.blend(paper, original, amount))
        durations.append(100)

    frames[-1] = frames[0].copy()
    return frames, durations


def shared_palette(frames: list[Image.Image], colors: int) -> Image.Image:
    thumb_size = 96
    columns = 5
    rows = math.ceil(len(frames) / columns)
    montage = Image.new("RGB", (columns * thumb_size, rows * thumb_size))
    for index, frame in enumerate(frames):
        thumb = ImageOps.fit(
            frame,
            (thumb_size, thumb_size),
            method=Image.Resampling.LANCZOS,
        )
        x = (index % columns) * thumb_size
        y = (index // columns) * thumb_size
        montage.paste(thumb, (x, y))
    return montage.quantize(colors=colors, method=Image.Quantize.MEDIANCUT)


def save_gif(
    frames: list[Image.Image],
    durations: list[int],
    path: Path,
    colors: int,
) -> None:
    palette = shared_palette(frames, colors)
    quantized = [
        frame.quantize(palette=palette, dither=Image.Dither.NONE)
        for frame in frames
    ]
    quantized[0].save(
        path,
        format="GIF",
        save_all=True,
        append_images=quantized[1:],
        duration=durations,
        loop=0,
        disposal=1,
        optimize=False,
    )


def save_animated_webp(
    frames: list[Image.Image],
    durations: list[int],
    path: Path,
    quality: int,
) -> None:
    frames[0].save(
        path,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=quality,
        method=6,
    )


def save_static_webp(image: Image.Image, path: Path) -> None:
    image.save(path, format="WEBP", quality=92, method=6)


def validate_animation(
    path: Path,
    expected_size: tuple[int, int],
    expected_frames: int,
    require_identical_seam: bool,
) -> dict[str, int | tuple[int, int]]:
    with Image.open(path) as animation:
        if animation.size != expected_size:
            raise AssertionError((path, animation.size, expected_size))
        if animation.n_frames != expected_frames:
            raise AssertionError((path, animation.n_frames, expected_frames))
        if animation.info.get("loop") != 0:
            raise AssertionError((path, animation.info.get("loop")))
        animation.seek(0)
        first = animation.convert("RGB")
        animation.seek(animation.n_frames - 1)
        last = animation.convert("RGB")
        difference = ImageChops.difference(first, last)
        if require_identical_seam:
            if difference.getbbox():
                raise AssertionError(f"Loop seam differs: {path}")
        else:
            rms = ImageStat.Stat(difference).rms
            if max(rms) > 3.0:
                raise AssertionError(f"Lossy loop seam differs: {path} {rms}")
    return {
        "bytes": path.stat().st_size,
        "frames": expected_frames,
        "size": expected_size,
    }


def make_style_contact_sheet(
    pairs: list[tuple[Asset, Image.Image, Image.Image]],
    path: Path,
) -> None:
    columns = 2
    cell_width = 592
    cell_height = 246
    gap = 12
    rows = math.ceil(len(pairs) / columns)
    sheet = Image.new(
        "RGB",
        (
            (columns * cell_width) + ((columns - 1) * gap),
            (rows * cell_height) + ((rows - 1) * gap),
        ),
        (32, 35, 29),
    )
    draw = ImageDraw.Draw(sheet)
    for index, (asset, original, engraved) in enumerate(pairs):
        x = (index % columns) * (cell_width + gap)
        y = (index // columns) * (cell_height + gap)
        left = ImageOps.fit(
            original,
            (286, 210),
            method=Image.Resampling.LANCZOS,
        )
        right = ImageOps.fit(
            engraved,
            (286, 210),
            method=Image.Resampling.LANCZOS,
        )
        sheet.paste(left, (x, y))
        sheet.paste(right, (x + 294, y))
        draw.text((x + 6, y + 217), asset.slug, fill=(235, 226, 202))
        draw.text((x + 210, y + 217), "PHOTO", fill=(173, 179, 164))
        draw.text((x + 492, y + 217), "PLATE", fill=(205, 178, 113))
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path, format="PNG", optimize=True)


def make_transition_review_sheet(
    reviews: list[tuple[Asset, list[Image.Image]]],
    path: Path,
) -> None:
    thumb_size = (192, 144)
    columns = 4
    gap = 8
    label_height = 22
    rows = len(reviews)
    sheet = Image.new(
        "RGB",
        (
            (columns * thumb_size[0]) + ((columns - 1) * gap),
            (rows * (thumb_size[1] + label_height)) + ((rows - 1) * gap),
        ),
        (32, 35, 29),
    )
    draw = ImageDraw.Draw(sheet)
    for row, (asset, frames) in enumerate(reviews):
        indices = (0, 5, 10, 14)
        y = row * (thumb_size[1] + label_height + gap)
        for column, frame_index in enumerate(indices):
            thumb = ImageOps.fit(
                frames[frame_index],
                thumb_size,
                method=Image.Resampling.LANCZOS,
            )
            x = column * (thumb_size[0] + gap)
            sheet.paste(thumb, (x, y))
        draw.text((5, y + thumb_size[1] + 4), asset.slug, fill=(235, 226, 202))
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path, format="PNG", optimize=True)


def main() -> None:
    args = parse_args()
    if args.max_edge < 320:
        raise ValueError("Maximum edge must be at least 320 pixels")
    if not 2 <= args.colors <= 256:
        raise ValueError("GIF colors must be between 2 and 256")
    if not 1 <= args.webp_quality <= 100:
        raise ValueError("WebP quality must be between 1 and 100")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    pairs: list[tuple[Asset, Image.Image, Image.Image]] = []
    reviews: list[tuple[Asset, list[Image.Image]]] = []
    results: list[dict[str, object]] = []

    selected_assets = tuple(
        asset for asset in ASSETS if not args.only or asset.slug in args.only
    )
    for index, asset in enumerate(selected_assets, start=1):
        original_path = args.source_dir / asset.original_name
        engraved_path = args.source_dir / asset.engraved_name
        if not original_path.exists() or not engraved_path.exists():
            raise FileNotFoundError((original_path, engraved_path))

        original, engraved = fit_pair(
            original_path,
            engraved_path,
            args.max_edge,
        )
        frames, durations = build_frames(original, engraved, 9000 + index)
        gif_path = args.output_dir / f"{asset.slug}-transformation.gif"
        animation_webp_path = (
            args.output_dir / f"{asset.slug}-transformation.webp"
        )
        endpoint_path = args.output_dir / f"{asset.slug}-engraved.webp"

        save_gif(frames, durations, gif_path, args.colors)
        save_animated_webp(
            frames,
            durations,
            animation_webp_path,
            args.webp_quality,
        )
        save_static_webp(engraved, endpoint_path)

        expected_frames = len(frames)
        gif_validation = validate_animation(
            gif_path,
            original.size,
            expected_frames,
            True,
        )
        webp_validation = validate_animation(
            animation_webp_path,
            original.size,
            expected_frames,
            False,
        )
        pairs.append((asset, original, engraved))
        reviews.append((asset, frames))
        results.append(
            {
                "slug": asset.slug,
                "gif": gif_validation,
                "webp": webp_validation,
                "endpoint_bytes": endpoint_path.stat().st_size,
            }
        )

    make_style_contact_sheet(
        pairs,
        args.source_dir / "style-contact-sheet.png",
    )
    make_transition_review_sheet(
        reviews,
        args.source_dir / "transformation-review.png",
    )

    # Keep the prompt/source record beside the generated endpoints when present.
    prompt_record = args.source_dir / "prompts.md"
    if prompt_record.exists():
        shutil.copy2(prompt_record, args.output_dir / "prompts.md")

    print({"assets": len(results), "results": results})


if __name__ == "__main__":
    main()
