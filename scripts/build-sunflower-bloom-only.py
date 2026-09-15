"""Build the square, flower-only sunflower bloom loop for Auspicious August.

The six source plates are the already-approved full-resolution botanical
stages.  This script stabilizes their common paper/leaf plate, reveals each
successive bloom from the flower's center outward, and then eases the same
motion backward so the repeating loop has no visible cut.  No bird or robot
art is loaded or composited.
"""

from __future__ import annotations

import argparse
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps, ImageStat


STAGES = (0, 20, 40, 60, 80, 100)
DEFAULT_SIZE = 1024
DEFAULT_COLORS = 128
STEPS_PER_TRANSITION = 8


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--flower-dir", type=Path, required=True)
    parser.add_argument("--gif", type=Path, required=True)
    parser.add_argument("--webp", type=Path, required=True)
    parser.add_argument("--poster", type=Path, required=True)
    parser.add_argument("--review-sheet", type=Path, required=True)
    parser.add_argument("--size", type=int, default=DEFAULT_SIZE)
    parser.add_argument("--colors", type=int, default=DEFAULT_COLORS)
    parser.add_argument("--webp-quality", type=int, default=92)
    return parser.parse_args()


def load_square(path: Path, size: int) -> Image.Image:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
    if image.width != image.height:
        edge = min(image.size)
        image = ImageOps.fit(
            image,
            (edge, edge),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
    return image.resize((size, size), Image.Resampling.LANCZOS)


def make_head_mask(size: int, feather: int = 8) -> Image.Image:
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse(
        (
            round(size * 0.015),
            round(size * 0.025),
            round(size * 0.925),
            round(size * 0.815),
        ),
        fill=255,
    )
    return mask.filter(ImageFilter.GaussianBlur(feather)) if feather else mask


def transform_shift(
    image: Image.Image,
    dx: float,
    dy: float,
    fill: tuple[int, int, int] = (238, 221, 181),
) -> Image.Image:
    return image.transform(
        image.size,
        Image.Transform.AFFINE,
        (1, 0, -dx, 0, 1, -dy),
        resample=Image.Resampling.BICUBIC,
        fillcolor=fill,
    )


def estimate_shift(reference: Image.Image, moving: Image.Image) -> tuple[int, int]:
    """Register the stable leaves and paper with a small translation search."""
    work_size = 256
    reference_small = reference.resize(
        (work_size, work_size), Image.Resampling.LANCZOS
    ).convert("L")
    moving_small = moving.resize(
        (work_size, work_size), Image.Resampling.LANCZOS
    ).convert("L")
    score_mask = ImageOps.invert(make_head_mask(work_size, feather=2))
    border = Image.new("L", (work_size, work_size), 0)
    ImageDraw.Draw(border).rectangle((12, 12, 243, 243), fill=255)
    score_mask = ImageChops.multiply(score_mask, border)

    best = (float("inf"), 0, 0)
    for dy in range(-7, 8):
        for dx in range(-7, 8):
            shifted = transform_shift(moving_small.convert("RGB"), dx, dy).convert(
                "L"
            )
            score = ImageStat.Stat(
                ImageChops.difference(reference_small, shifted), mask=score_mask
            ).mean[0]
            if score < best[0]:
                best = (score, dx, dy)
    scale = reference.width / work_size
    return round(best[1] * scale), round(best[2] * scale)


def match_paper_tone(reference: Image.Image, image: Image.Image) -> Image.Image:
    size = reference.width
    sample_box = (
        round(size * 0.025),
        round(size * 0.025),
        round(size * 0.30),
        round(size * 0.22),
    )
    reference_mean = ImageStat.Stat(reference.crop(sample_box)).mean
    image_mean = ImageStat.Stat(image.crop(sample_box)).mean
    offsets = [
        max(-20, min(20, round(target - current)))
        for target, current in zip(reference_mean, image_mean)
    ]
    adjusted = [
        channel.point(
            lambda value, offset=offset: max(0, min(255, value + offset))
        )
        for channel, offset in zip(image.split(), offsets)
    ]
    return Image.merge("RGB", adjusted)


def make_head_subject_mask(image: Image.Image) -> Image.Image:
    """Select botanical ink while excluding the common warm paper field."""
    _, _, blue = image.split()
    subject = blue.point(lambda value: 255 if value < 150 else 0)
    subject = subject.filter(ImageFilter.MaxFilter(7))
    subject = ImageChops.multiply(subject, make_head_mask(image.width, feather=0))
    interior = Image.new("L", image.size, 0)
    ImageDraw.Draw(interior).rectangle(
        (
            round(image.width * 0.035),
            round(image.height * 0.035),
            round(image.width * 0.965),
            round(image.height * 0.805),
        ),
        fill=255,
    )
    return ImageChops.multiply(subject, interior).filter(
        ImageFilter.GaussianBlur(1.4)
    )


def load_and_stabilize_keys(
    directory: Path, size: int
) -> tuple[list[Image.Image], list[tuple[int, int]]]:
    raw = [
        load_square(directory / f"stage-{stage:03d}-full.png", size)
        for stage in STAGES
    ]
    base = raw[0]
    base_subject = make_head_subject_mask(base)
    keys = [base]
    shifts = [(0, 0)]
    for image in raw[1:]:
        dx, dy = estimate_shift(base, image)
        aligned = match_paper_tone(base, transform_shift(image, dx, dy))
        replacement = ImageChops.lighter(
            base_subject, make_head_subject_mask(aligned)
        )
        replacement = replacement.filter(ImageFilter.MaxFilter(5)).filter(
            ImageFilter.GaussianBlur(1.2)
        )
        keys.append(Image.composite(aligned, base, replacement))
        shifts.append((dx, dy))
    return keys, shifts


def make_reveal_order(size: int) -> Image.Image:
    """Create a deterministic center-out field with a soft etched variation."""
    field_size = 256
    center_x = field_size * 0.515
    center_y = field_size * 0.335
    radius_x = field_size * 0.42
    radius_y = field_size * 0.39
    radial = Image.new("L", (field_size, field_size))
    radial.putdata(
        [
            round(
                min(
                    1.0,
                    math.sqrt(
                        (((x - center_x) / radius_x) ** 2)
                        + (((y - center_y) / radius_y) ** 2)
                    ),
                )
                * 255
            )
            for y in range(field_size)
            for x in range(field_size)
        ]
    )
    rng = random.Random(8312026)
    noise = Image.new("L", (field_size, field_size))
    noise.putdata([rng.randrange(256) for _ in range(field_size * field_size)])
    noise = ImageOps.autocontrast(noise.filter(ImageFilter.GaussianBlur(8)))
    return Image.blend(radial, noise, 0.16).resize(
        (size, size), Image.Resampling.BICUBIC
    )


def reveal_between(
    current: Image.Image,
    following: Image.Image,
    amount: float,
    order: Image.Image,
    hard_head: Image.Image,
) -> Image.Image:
    if amount >= 1:
        return following.copy()
    # Smoothstep prevents a mechanical-looking start and finish at each key.
    eased = amount * amount * (3 - (2 * amount))
    threshold = round(eased * 255)
    reveal = order.point(lambda value: 255 if value <= threshold else 0)
    reveal = ImageChops.multiply(reveal, hard_head).filter(
        ImageFilter.GaussianBlur(0.9)
    )
    return Image.composite(following, current, reveal)


def build_frames(keys: list[Image.Image]) -> tuple[list[Image.Image], list[int]]:
    size = keys[0].width
    order = make_reveal_order(size)
    hard_head = make_head_mask(size, feather=1).point(
        lambda value: 255 if value >= 128 else 0
    )
    opening = [keys[0].copy()]
    for current, following in zip(keys, keys[1:]):
        for step in range(1, STEPS_PER_TRANSITION + 1):
            opening.append(
                reveal_between(
                    current,
                    following,
                    step / STEPS_PER_TRANSITION,
                    order,
                    hard_head,
                )
            )

    # Reverse through every non-apex frame. The final frame is therefore an
    # exact copy of the first, yielding a pixel-identical infinite-loop seam.
    frames = opening + [frame.copy() for frame in reversed(opening[:-1])]
    durations = [50] * len(frames)
    durations[0] = 350
    durations[len(opening) - 1] = 700
    if len(frames) != 81 or sum(durations) != 5000:
        raise AssertionError((len(frames), sum(durations)))
    return frames, durations


def shared_palette(frames: list[Image.Image], colors: int) -> Image.Image:
    thumb = 144
    columns = 9
    rows = math.ceil(len(frames) / columns)
    montage = Image.new("RGB", (columns * thumb, rows * thumb))
    for index, frame in enumerate(frames):
        montage.paste(
            frame.resize((thumb, thumb), Image.Resampling.LANCZOS),
            ((index % columns) * thumb, (index // columns) * thumb),
        )
    return montage.quantize(colors=colors, method=Image.Quantize.MEDIANCUT)


def save_gif(
    frames: list[Image.Image], durations: list[int], path: Path, colors: int
) -> None:
    palette = shared_palette(frames, colors)
    quantized = [
        frame.quantize(palette=palette, dither=Image.Dither.NONE) for frame in frames
    ]
    path.parent.mkdir(parents=True, exist_ok=True)
    quantized[0].save(
        path,
        save_all=True,
        append_images=quantized[1:],
        duration=durations,
        loop=0,
        disposal=1,
        optimize=True,
    )


def save_webp(
    frames: list[Image.Image], durations: list[int], path: Path, quality: int
) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        path,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=quality,
        method=6,
        minimize_size=True,
    )


def save_review_sheet(
    opening: list[Image.Image], keys: list[Image.Image], path: Path
) -> None:
    thumb = 220
    gap = 10
    selected = [opening[index] for index in (0, 5, 10, 15, 20, 25, 30, 35, 40)]
    selected.extend(keys)
    columns = 5
    rows = math.ceil(len(selected) / columns)
    sheet = Image.new(
        "RGB",
        (
            columns * thumb + (columns - 1) * gap,
            rows * thumb + (rows - 1) * gap,
        ),
        (35, 36, 30),
    )
    for index, frame in enumerate(selected):
        sheet.paste(
            frame.resize((thumb, thumb), Image.Resampling.LANCZOS),
            (
                (index % columns) * (thumb + gap),
                (index // columns) * (thumb + gap),
            ),
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path, format="PNG", optimize=True)


def validate_animation(
    path: Path, expected_format: str, size: int, durations: list[int]
) -> dict[str, int | float | str]:
    with Image.open(path) as animation:
        if animation.format != expected_format:
            raise AssertionError(animation.format)
        if animation.size != (size, size):
            raise AssertionError(animation.size)
        encoded_frame_count = animation.n_frames
        # Pillow combines adjacent visually identical frames in both formats
        # and carries their time forward. That is lossless temporal
        # optimization, not dropped motion.
        if encoded_frame_count < 60:
            raise AssertionError(
                ("Excessive frame consolidation", encoded_frame_count)
            )
        actual_durations = []
        first = last = None
        for index in range(animation.n_frames):
            animation.seek(index)
            animation.load()
            actual_durations.append(animation.info.get("duration", 0))
            rgb = animation.convert("RGB")
            if index == 0:
                first = rgb.copy()
            if index == animation.n_frames - 1:
                last = rgb.copy()
    if sum(actual_durations) != sum(durations):
        raise AssertionError((sum(actual_durations), sum(durations)))
    if first is None or last is None:
        raise AssertionError("Animation exposed no frames")
    seam = ImageChops.difference(first, last)
    seam_stats = ImageStat.Stat(seam)
    seam_mean = max(seam_stats.mean)
    seam_peak = max(maximum for _, maximum in seam_stats.extrema)
    if expected_format == "GIF" and seam.getbbox():
        raise AssertionError("GIF loop seam is not pixel-identical")
    # The two source seam frames are pixel-identical. Independent lossy WebP
    # keyframes may decode a few levels apart, so constrain that codec noise
    # to an imperceptible range instead of requiring decoded byte identity.
    if expected_format == "WEBP" and (seam_mean > 2.0 or seam_peak > 24):
        raise AssertionError(("Visible WebP seam", seam_mean, seam_peak))
    return {
        "format": expected_format,
        "frames": encoded_frame_count,
        "source_frames": len(durations),
        "seconds": sum(actual_durations) / 1000,
        "bytes": path.stat().st_size,
        "seam_mean": round(seam_mean, 4),
        "seam_peak": seam_peak,
    }


def main() -> None:
    args = parse_args()
    if args.size < 512:
        raise ValueError("Animation master must be at least 512 pixels square")
    if not 2 <= args.colors <= 256:
        raise ValueError("GIF colors must be between 2 and 256")
    if not 1 <= args.webp_quality <= 100:
        raise ValueError("WebP quality must be between 1 and 100")

    keys, shifts = load_and_stabilize_keys(args.flower_dir, args.size)
    frames, durations = build_frames(keys)
    opening = frames[: 1 + (len(STAGES) - 1) * STEPS_PER_TRANSITION]

    save_gif(frames, durations, args.gif, args.colors)
    save_webp(frames, durations, args.webp, args.webp_quality)
    args.poster.parent.mkdir(parents=True, exist_ok=True)
    keys[-1].save(args.poster, format="PNG", optimize=True)
    save_review_sheet(opening, keys, args.review_sheet)

    gif_validation = validate_animation(args.gif, "GIF", args.size, durations)
    webp_validation = validate_animation(args.webp, "WEBP", args.size, durations)
    if args.gif.stat().st_size > 24 * 1024 * 1024:
        raise AssertionError(f"GIF exceeds 24 MiB: {args.gif.stat().st_size}")
    print(
        {
            "gif": str(args.gif.resolve()),
            "webp": str(args.webp.resolve()),
            "poster": str(args.poster.resolve()),
            "review_sheet": str(args.review_sheet.resolve()),
            "source_size": (args.size, args.size),
            "stage_count": len(keys),
            "shifts": shifts,
            "gif_validation": gif_validation,
            "webp_validation": webp_validation,
        }
    )


if __name__ == "__main__":
    main()
