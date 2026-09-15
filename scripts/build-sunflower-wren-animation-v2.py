"""Build the full-resolution six-stage sunflower-and-wren opening animation."""

from __future__ import annotations

import argparse
import math
import random
from pathlib import Path

from PIL import (
    Image,
    ImageChops,
    ImageDraw,
    ImageFilter,
    ImageOps,
    ImageStat,
)


STAGES = (0, 20, 40, 60, 80, 100)
WREN_POSE_COUNT = 4
DEFAULT_SIZE = 1024
DEFAULT_COLORS = 112
FRAME_COUNT = 56
TRANSITION_STEP_COUNT = 9
TRANSITION_STEPS = tuple(
    step / TRANSITION_STEP_COUNT
    for step in range(1, TRANSITION_STEP_COUNT + 1)
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--flower-dir", type=Path, required=True)
    parser.add_argument("--wren-sheet", type=Path, required=True)
    parser.add_argument("--gif", type=Path, required=True)
    parser.add_argument("--webp", type=Path, required=True)
    parser.add_argument("--poster", type=Path, required=True)
    parser.add_argument("--review-sheet", type=Path)
    parser.add_argument("--key-sheet", type=Path)
    parser.add_argument("--size", type=int, default=DEFAULT_SIZE)
    parser.add_argument("--colors", type=int, default=DEFAULT_COLORS)
    parser.add_argument("--webp-quality", type=int, default=92)
    return parser.parse_args()


def load_square(path: Path, size: int) -> Image.Image:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
    if image.width != image.height:
        image = ImageOps.fit(
            image,
            (min(image.size), min(image.size)),
            method=Image.Resampling.LANCZOS,
            centering=(0.5, 0.5),
        )
    return image.resize((size, size), Image.Resampling.LANCZOS)


def make_head_mask(size: int, feather: int = 8) -> Image.Image:
    """Cover the largest open bloom while leaving the shared plate stable."""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse(
        (
            round(size * 0.015),
            round(size * 0.025),
            round(size * 0.925),
            round(size * 0.815),
        ),
        fill=255,
    )
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    return mask


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
    """Register stable leaves and paper with a small translation-only search."""
    work_size = 256
    reference_small = reference.resize(
        (work_size, work_size), Image.Resampling.LANCZOS
    ).convert("L")
    moving_small = moving.resize(
        (work_size, work_size), Image.Resampling.LANCZOS
    ).convert("L")
    score_mask = ImageOps.invert(make_head_mask(work_size, feather=2))
    # Ignore the outermost edge where affine fill would otherwise dominate.
    border = Image.new("L", (work_size, work_size), 0)
    ImageDraw.Draw(border).rectangle((12, 12, 243, 243), fill=255)
    score_mask = ImageChops.multiply(score_mask, border)

    best = (float("inf"), 0, 0)
    for dy in range(-7, 8):
        for dx in range(-7, 8):
            shifted = transform_shift(
                moving_small.convert("RGB"), dx, dy
            ).convert("L")
            difference = ImageChops.difference(reference_small, shifted)
            score = ImageStat.Stat(difference, mask=score_mask).mean[0]
            if score < best[0]:
                best = (score, dx, dy)

    scale = reference.width / work_size
    return round(best[1] * scale), round(best[2] * scale)


def match_paper_tone(reference: Image.Image, image: Image.Image) -> Image.Image:
    """Match the open paper field without flattening engraved line detail."""
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
    channels = image.split()
    adjusted = [
        channel.point(
            lambda value, offset=offset: max(0, min(255, value + offset))
        )
        for channel, offset in zip(channels, offsets)
    ]
    return Image.merge("RGB", adjusted)


def make_head_subject_mask(image: Image.Image) -> Image.Image:
    """Isolate inked botanical forms inside the changing flower-head region."""
    _, _, blue = image.convert("RGB").split()
    # The rag paper remains warm and blue-rich; olive ink and ochre petals
    # both have a distinctly lower blue channel. Dilation restores their
    # antialiased engraved edges without importing a broad paper-colored halo.
    subject = blue.point(lambda value: 255 if value < 150 else 0)
    subject = subject.filter(ImageFilter.MaxFilter(7))
    subject = ImageChops.multiply(
        subject,
        make_head_mask(image.width, feather=0),
    )
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
    # Generated plates sometimes carry a dark scanned-page vignette at the
    # outermost edge. It is not part of the plant and must not enter the mask.
    subject = ImageChops.multiply(subject, interior)
    return subject.filter(ImageFilter.GaussianBlur(1.4))


def load_and_stabilize_keys(
    directory: Path,
    size: int,
) -> tuple[list[Image.Image], list[tuple[int, int]]]:
    raw = [
        load_square(directory / f"stage-{stage:03d}-full.png", size)
        for stage in STAGES
    ]
    base = raw[0]
    base_subject = make_head_subject_mask(base)
    keys: list[Image.Image] = [base]
    shifts: list[tuple[int, int]] = [(0, 0)]
    for image in raw[1:]:
        dx, dy = estimate_shift(base, image)
        aligned = match_paper_tone(base, transform_shift(image, dx, dy))
        stage_subject = make_head_subject_mask(aligned)
        replacement = ImageChops.lighter(base_subject, stage_subject)
        replacement = replacement.filter(ImageFilter.MaxFilter(5)).filter(
            ImageFilter.GaussianBlur(1.2)
        )
        # Reuse one common full-resolution plate outside the changing bloom;
        # inside it, replace only the union of the old and new botanical ink.
        # That erases the previous bud while avoiding a paper-colored ellipse.
        keys.append(Image.composite(aligned, base, replacement))
        shifts.append((dx, dy))
    return keys, shifts


def make_reveal_order(size: int) -> Image.Image:
    """Create a deterministic, center-out etched reveal field."""
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
    noise = noise.filter(ImageFilter.GaussianBlur(8))
    noise = ImageOps.autocontrast(noise)
    order = Image.blend(radial, noise, 0.16)
    return order.resize((size, size), Image.Resampling.BICUBIC)


def reveal_between(
    current: Image.Image,
    following: Image.Image,
    amount: float,
    order: Image.Image,
    hard_head: Image.Image,
) -> Image.Image:
    if amount >= 1:
        return following.copy()
    threshold = round(amount * 255)
    reveal = order.point(lambda value: 255 if value <= threshold else 0)
    reveal = ImageChops.multiply(reveal, hard_head).filter(
        ImageFilter.GaussianBlur(0.8)
    )
    return Image.composite(following, current, reveal)


def white_to_alpha(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    red, green, blue = rgb.split()
    darkness = ImageChops.lighter(ImageChops.invert(red), ImageChops.invert(green))
    darkness = ImageChops.lighter(darkness, ImageChops.invert(blue))

    def matte(value: int) -> int:
        if value <= 4:
            return 0
        if value >= 42:
            return 255
        return round((value - 4) * 255 / 38)

    rgba = rgb.convert("RGBA")
    rgba.putalpha(darkness.point(matte))
    return rgba


def split_wren_poses(sheet_path: Path, canvas_size: int) -> list[Image.Image]:
    with Image.open(sheet_path) as source:
        sheet = ImageOps.exif_transpose(source).convert("RGB")
    if sheet.width % 2 or sheet.height % 2:
        raise ValueError(f"Wren sheet must divide into a 2x2 grid: {sheet.size}")
    cell_width = sheet.width // 2
    cell_height = sheet.height // 2
    if cell_width != cell_height:
        raise ValueError(f"Wren cells must be square: {cell_width}x{cell_height}")

    poses: list[Image.Image] = []
    for row in range(2):
        for column in range(2):
            cell = sheet.crop(
                (
                    column * cell_width,
                    row * cell_height,
                    (column + 1) * cell_width,
                    (row + 1) * cell_height,
                )
            )
            cell = cell.resize(
                (canvas_size, canvas_size), Image.Resampling.LANCZOS
            )
            poses.append(white_to_alpha(cell))
    if len(poses) != WREN_POSE_COUNT:
        raise AssertionError(len(poses))
    return poses


def add_wren(
    background: Image.Image,
    pose: Image.Image,
    progress: float,
) -> Image.Image:
    frame = background.convert("RGBA")
    size = frame.width
    center_x = (-0.065 + (1.13 * progress)) * size
    center_y = (
        0.245
        - (0.075 * math.sin(math.pi * progress))
        + (0.012 * math.sin(4 * math.pi * progress))
    ) * size
    left = round(center_x - (pose.width / 2))
    top = round(center_y - (pose.height / 2))
    frame.alpha_composite(pose, (left, top))
    return frame.convert("RGB")


def make_paper_frame(reference: Image.Image) -> Image.Image:
    size = reference.width
    rng = random.Random(319831)
    noise_size = max(128, size // 4)
    noise = Image.new("L", (noise_size, noise_size))
    noise.putdata([rng.randrange(256) for _ in range(noise_size * noise_size)])
    noise = noise.resize((size, size), Image.Resampling.BICUBIC).filter(
        ImageFilter.GaussianBlur(max(5, round(size * 0.018)))
    )
    warm = Image.new("RGB", (size, size), (230, 208, 162))
    light = Image.new("RGB", (size, size), (247, 233, 198))
    return Image.composite(light, warm, noise)


def build_frames(
    keys: list[Image.Image],
    wren_poses: list[Image.Image],
) -> tuple[list[Image.Image], list[int]]:
    size = keys[0].width
    reveal_order = make_reveal_order(size)
    hard_head = make_head_mask(size, feather=1).point(
        lambda value: 255 if value >= 128 else 0
    )

    bloom_frames: list[Image.Image] = [keys[0].copy()]
    current = keys[0]
    for following in keys[1:]:
        for amount in TRANSITION_STEPS:
            bloom_frames.append(
                reveal_between(current, following, amount, reveal_order, hard_head)
            )
        current = following

    pose_cycle = (0, 1, 0, 2, 3, 2)
    frames = [bloom_frames[0]]
    flight_count = len(bloom_frames) - 1
    for index, bloom in enumerate(bloom_frames[1:]):
        progress = index / max(1, flight_count - 1)
        pose = wren_poses[pose_cycle[index % len(pose_cycle)]]
        frames.append(add_wren(bloom, pose, progress))

    frames.append(keys[-1].copy())
    paper = make_paper_frame(keys[0])
    frames.extend(
        [
            Image.blend(keys[-1], paper, 0.20),
            Image.blend(keys[-1], paper, 0.40),
            Image.blend(keys[-1], paper, 0.60),
            Image.blend(keys[-1], paper, 0.80),
            paper,
            Image.blend(paper, keys[0], 0.25),
            Image.blend(paper, keys[0], 0.50),
            Image.blend(paper, keys[0], 0.75),
            keys[0].copy(),
        ]
    )
    frames[-1] = frames[0].copy()

    # Preserve the original 2.44-second rhythm while doubling its encoded
    # frame count. GIF timing is stored in 10 ms units, so the flight uses
    # forty 30 ms frames plus five 40 ms frames; the reset uses six 50 ms
    # frames plus three 60 ms frames.
    flight_durations = [
        40 if index % 9 == 0 else 30 for index in range(flight_count)
    ]
    reset_durations = [
        60 if index % 3 == 0 else 50 for index in range(9)
    ]
    durations = [240] + flight_durations + [320] + reset_durations
    if len(frames) != FRAME_COUNT or len(durations) != len(frames):
        raise AssertionError((len(frames), len(durations)))
    if sum(durations) != 2440:
        raise AssertionError(sum(durations))
    return frames, durations


def shared_palette(frames: list[Image.Image], colors: int) -> Image.Image:
    thumb_size = 160
    columns = 7
    rows = math.ceil(len(frames) / columns)
    montage = Image.new("RGB", (columns * thumb_size, rows * thumb_size))
    for index, frame in enumerate(frames):
        montage.paste(
            frame.resize((thumb_size, thumb_size), Image.Resampling.LANCZOS),
            ((index % columns) * thumb_size, (index // columns) * thumb_size),
        )
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
    for index in range(1, len(quantized)):
        if quantized[index - 1].tobytes() == quantized[index].tobytes():
            raise AssertionError(
                f"Adjacent source frames {index - 1} and {index} are identical"
            )
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
    frames: list[Image.Image],
    durations: list[int],
    path: Path,
    quality: int,
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


def save_sheet(
    frames: list[Image.Image],
    path: Path,
    columns: int,
    thumb_size: int,
) -> None:
    rows = math.ceil(len(frames) / columns)
    gap = 8
    sheet = Image.new(
        "RGB",
        (
            (columns * thumb_size) + ((columns - 1) * gap),
            (rows * thumb_size) + ((rows - 1) * gap),
        ),
        (35, 36, 30),
    )
    for index, frame in enumerate(frames):
        sheet.paste(
            frame.resize((thumb_size, thumb_size), Image.Resampling.LANCZOS),
            (
                (index % columns) * (thumb_size + gap),
                (index // columns) * (thumb_size + gap),
            ),
        )
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path, format="PNG", optimize=True)


def validate_animation(
    path: Path,
    expected_format: str,
    size: int,
    durations: list[int],
) -> dict[str, int | float | str]:
    with Image.open(path) as animation:
        if animation.format != expected_format:
            raise AssertionError(animation.format)
        if animation.size != (size, size):
            raise AssertionError(animation.size)
        if animation.n_frames != len(durations):
            raise AssertionError(animation.n_frames)
        actual_durations: list[int] = []
        first: Image.Image | None = None
        last: Image.Image | None = None
        for index in range(animation.n_frames):
            animation.seek(index)
            animation.load()
            actual_durations.append(animation.info.get("duration", 0))
            rgb = animation.convert("RGB")
            if index == 0:
                first = rgb.copy()
            if index == animation.n_frames - 1:
                last = rgb.copy()
    if actual_durations != durations:
        raise AssertionError((actual_durations, durations))
    if first is None or last is None:
        raise AssertionError("Animation did not expose first and last frames")
    seam = ImageChops.difference(first, last)
    seam_stats = ImageStat.Stat(seam)
    seam_mean = max(seam_stats.mean)
    seam_peak = max(maximum for _, maximum in seam_stats.extrema)
    if expected_format == "GIF" and seam.getbbox():
        raise AssertionError("GIF loop seam is not pixel-identical")
    # Lossy WebP may encode two identical source frames a few values apart.
    # Keep that variance far below a visible threshold instead of demanding
    # byte-identical decoded pixels.
    if expected_format == "WEBP" and (seam_mean > 0.25 or seam_peak > 10):
        raise AssertionError(("Visible WebP loop seam", seam_mean, seam_peak))
    return {
        "format": expected_format,
        "frames": len(durations),
        "seconds": sum(durations) / 1000,
        "bytes": path.stat().st_size,
        "seam_mean": round(seam_mean, 4),
        "seam_peak": seam_peak,
    }


def main() -> None:
    args = parse_args()
    if args.size < 512:
        raise ValueError("The v2 master must be at least 512 pixels square")
    if not 2 <= args.colors <= 256:
        raise ValueError("GIF colors must be between 2 and 256")
    if not 1 <= args.webp_quality <= 100:
        raise ValueError("WebP quality must be between 1 and 100")

    keys, shifts = load_and_stabilize_keys(args.flower_dir, args.size)
    wren_poses = split_wren_poses(args.wren_sheet, round(args.size * 0.31))
    frames, durations = build_frames(keys, wren_poses)

    save_gif(frames, durations, args.gif, args.colors)
    save_webp(frames, durations, args.webp, args.webp_quality)

    args.poster.parent.mkdir(parents=True, exist_ok=True)
    poster = add_wren(keys[-1], wren_poses[1], 0.62)
    poster.save(args.poster, format="PNG", optimize=True)
    if args.review_sheet:
        save_sheet(frames, args.review_sheet, columns=7, thumb_size=176)
    if args.key_sheet:
        save_sheet(keys, args.key_sheet, columns=3, thumb_size=320)

    gif_validation = validate_animation(
        args.gif, "GIF", args.size, durations
    )
    webp_validation = validate_animation(
        args.webp, "WEBP", args.size, durations
    )
    if args.gif.stat().st_size > 24 * 1024 * 1024:
        raise AssertionError(f"GIF exceeds 24 MiB: {args.gif.stat().st_size}")

    print(
        {
            "gif": str(args.gif.resolve()),
            "webp": str(args.webp.resolve()),
            "poster": str(args.poster.resolve()),
            "source_size": (args.size, args.size),
            "stage_count": len(keys),
            "shifts": shifts,
            "gif_validation": gif_validation,
            "webp_validation": webp_validation,
        }
    )


if __name__ == "__main__":
    main()
