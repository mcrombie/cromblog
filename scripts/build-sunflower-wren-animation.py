"""Build Cromblog's engraved sunflower-and-wren loop from generated sprite sheets."""

from __future__ import annotations

import argparse
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


FRAME_COUNT = 24
FLOWER_KEY_COUNT = 6
WREN_POSE_COUNT = 4
DEFAULT_SIZE = 768
DEFAULT_COLORS = 128


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--flower-sheet", type=Path, required=True)
    parser.add_argument("--wren-sheet", type=Path, required=True)
    parser.add_argument("--gif", type=Path, required=True)
    parser.add_argument("--webp", type=Path)
    parser.add_argument("--poster", type=Path, required=True)
    parser.add_argument("--review-sheet", type=Path)
    parser.add_argument("--size", type=int, default=DEFAULT_SIZE)
    parser.add_argument("--colors", type=int, default=DEFAULT_COLORS)
    parser.add_argument("--webp-quality", type=int, default=90)
    return parser.parse_args()


def smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3.0 - 2.0 * value)


def split_flower_keys(sheet_path: Path, size: int) -> list[Image.Image]:
    with Image.open(sheet_path) as source:
        sheet = source.convert("RGB")

    if sheet.width % 3 or sheet.height % 2:
        raise ValueError(f"Flower sheet must divide into a 3x2 grid: {sheet.size}")

    cell_width = sheet.width // 3
    cell_height = sheet.height // 2
    if cell_width != cell_height:
        raise ValueError(f"Flower-sheet cells must be square: {cell_width}x{cell_height}")

    keys: list[Image.Image] = []
    for row in range(2):
        for column in range(3):
            left = column * cell_width
            top = row * cell_height
            cell = sheet.crop((left, top, left + cell_width, top + cell_height))
            keys.append(cell.resize((size, size), Image.Resampling.LANCZOS))

    if len(keys) != FLOWER_KEY_COUNT:
        raise AssertionError(f"Expected {FLOWER_KEY_COUNT} flower keys, got {len(keys)}")
    return keys


def white_to_alpha(image: Image.Image) -> Image.Image:
    rgb = image.convert("RGB")
    red, green, blue = rgb.split()
    darkness = ImageChops.lighter(ImageChops.invert(red), ImageChops.invert(green))
    darkness = ImageChops.lighter(darkness, ImageChops.invert(blue))

    def matte(value: int) -> int:
        if value <= 5:
            return 0
        if value >= 38:
            return 255
        return round((value - 5) * 255 / 33)

    rgba = rgb.convert("RGBA")
    rgba.putalpha(darkness.point(matte))
    return rgba


def split_wren_poses(sheet_path: Path, canvas_size: int) -> list[Image.Image]:
    with Image.open(sheet_path) as source:
        sheet = source.convert("RGB")

    if sheet.width % 2 or sheet.height % 2:
        raise ValueError(f"Wren sheet must divide into a 2x2 grid: {sheet.size}")

    cell_width = sheet.width // 2
    cell_height = sheet.height // 2
    if cell_width != cell_height:
        raise ValueError(f"Wren-sheet cells must be square: {cell_width}x{cell_height}")

    poses: list[Image.Image] = []
    for row in range(2):
        for column in range(2):
            left = column * cell_width
            top = row * cell_height
            cell = sheet.crop((left, top, left + cell_width, top + cell_height))
            cell = cell.resize((canvas_size, canvas_size), Image.Resampling.LANCZOS)
            poses.append(white_to_alpha(cell))

    if len(poses) != WREN_POSE_COUNT:
        raise AssertionError(f"Expected {WREN_POSE_COUNT} wren poses, got {len(poses)}")
    return poses


def interpolate_keys(keys: list[Image.Image], progress: float) -> Image.Image:
    position = max(0.0, min(1.0, progress)) * (len(keys) - 1)
    lower = min(int(math.floor(position)), len(keys) - 1)
    upper = min(lower + 1, len(keys) - 1)
    amount = position - lower
    if lower == upper or amount <= 0:
        return keys[lower].copy()
    return Image.blend(keys[lower], keys[upper], amount)


def add_wren(
    background: Image.Image,
    pose: Image.Image,
    progress: float,
) -> Image.Image:
    frame = background.convert("RGBA")
    size = frame.width
    bird_size = pose.width

    center_x = (-0.06 + (1.12 * progress)) * size
    center_y = (0.245 - (0.065 * math.sin(math.pi * progress))) * size
    left = round(center_x - (bird_size / 2))
    top = round(center_y - (bird_size / 2))
    frame.alpha_composite(pose, (left, top))
    return frame.convert("RGB")


def make_paper_frame(reference: Image.Image) -> Image.Image:
    """Create a quiet antique-paper interstitial for the loop reset."""
    size = reference.width
    noise_size = max(96, size // 4)
    randomizer = random.Random(8312026)
    noise = Image.new("L", (noise_size, noise_size))
    noise.putdata(
        [randomizer.randrange(256) for _ in range(noise_size * noise_size)]
    )
    noise = noise.resize((size, size), Image.Resampling.BICUBIC).filter(
        ImageFilter.GaussianBlur(max(4, round(size * 0.023)))
    )
    warm = Image.new("RGB", (size, size), (235, 216, 172))
    light = Image.new("RGB", (size, size), (246, 231, 195))
    return Image.composite(light, warm, noise)


def build_frames(
    flower_keys: list[Image.Image],
    wren_poses: list[Image.Image],
) -> tuple[list[Image.Image], list[int]]:
    frames: list[Image.Image] = [flower_keys[0].copy()]

    pose_cycle = (0, 1, 0, 2, 3, 2)
    for frame_number in range(1, 17):
        progress = (frame_number - 1) / 15
        bloom = interpolate_keys(flower_keys, smoothstep(progress))
        pose = wren_poses[pose_cycle[(frame_number - 1) % len(pose_cycle)]]
        frames.append(add_wren(bloom, pose, progress))

    frames.append(flower_keys[-1].copy())

    # Let the finished plate fade back into blank paper before the bud returns.
    # This avoids superimposing the open flower and bud during the loop reset.
    paper = make_paper_frame(flower_keys[0])
    for amount in (0.34, 0.68, 1.0):
        frames.append(Image.blend(flower_keys[-1], paper, amount))
    for amount in (0.34, 0.68):
        frames.append(Image.blend(paper, flower_keys[0], amount))
    frames.append(flower_keys[0].copy())

    frames[-1] = frames[0].copy()
    durations = [240] + ([80] * 16) + [320] + ([80] * 6)

    if len(frames) != FRAME_COUNT or len(durations) != FRAME_COUNT:
        raise AssertionError((len(frames), len(durations)))
    return frames, durations


def shared_palette(frames: list[Image.Image], colors: int) -> Image.Image:
    thumb_size = 128
    columns = 6
    rows = math.ceil(len(frames) / columns)
    montage = Image.new("RGB", (columns * thumb_size, rows * thumb_size))
    for index, frame in enumerate(frames):
        thumb = frame.resize((thumb_size, thumb_size), Image.Resampling.LANCZOS)
        x = (index % columns) * thumb_size
        y = (index // columns) * thumb_size
        montage.paste(thumb, (x, y))
    return montage.quantize(colors=colors, method=Image.Quantize.MEDIANCUT)


def save_animation(
    frames: list[Image.Image],
    durations: list[int],
    gif_path: Path,
    colors: int,
) -> None:
    palette = shared_palette(frames, colors)
    quantized = [
        frame.quantize(palette=palette, dither=Image.Dither.NONE)
        for frame in frames
    ]
    gif_path.parent.mkdir(parents=True, exist_ok=True)
    quantized[0].save(
        gif_path,
        save_all=True,
        append_images=quantized[1:],
        duration=durations,
        loop=0,
        disposal=1,
        optimize=False,
    )


def save_webp_animation(
    frames: list[Image.Image],
    durations: list[int],
    webp_path: Path,
    quality: int,
) -> None:
    webp_path.parent.mkdir(parents=True, exist_ok=True)
    frames[0].save(
        webp_path,
        format="WEBP",
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        quality=quality,
        method=6,
    )


def save_review_sheet(frames: list[Image.Image], path: Path) -> None:
    columns = 6
    rows = math.ceil(len(frames) / columns)
    thumb_size = 192
    gap = 8
    sheet = Image.new(
        "RGB",
        (
            (columns * thumb_size) + ((columns - 1) * gap),
            (rows * thumb_size) + ((rows - 1) * gap),
        ),
        (32, 35, 29),
    )
    for index, frame in enumerate(frames):
        thumb = frame.resize((thumb_size, thumb_size), Image.Resampling.LANCZOS)
        x = (index % columns) * (thumb_size + gap)
        y = (index // columns) * (thumb_size + gap)
        sheet.paste(thumb, (x, y))
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(path, format="PNG", optimize=True)


def validate_animation(
    gif_path: Path,
    size: int,
    colors: int,
    expected_durations: list[int],
) -> dict[str, int | float]:
    with Image.open(gif_path) as animation:
        if animation.format != "GIF":
            raise AssertionError(animation.format)
        if animation.size != (size, size):
            raise AssertionError(animation.size)
        if animation.n_frames != FRAME_COUNT:
            raise AssertionError(animation.n_frames)
        if animation.info.get("loop") != 0:
            raise AssertionError(animation.info.get("loop"))

        durations: list[int] = []
        disposals: set[int | None] = set()
        used_colors: set[tuple[int, int, int]] = set()
        first: Image.Image | None = None
        last: Image.Image | None = None
        for index in range(animation.n_frames):
            animation.seek(index)
            animation.load()
            durations.append(animation.info.get("duration", 0))
            disposals.add(getattr(animation, "disposal_method", None))
            rgb = animation.convert("RGB")
            histogram = rgb.getcolors(1 << 24) or []
            used_colors.update(color for _, color in histogram)
            if index == 0:
                first = rgb.copy()
            if index == animation.n_frames - 1:
                last = rgb.copy()

    if durations != expected_durations:
        raise AssertionError(durations)
    if disposals != {1}:
        raise AssertionError(disposals)
    if len(used_colors) > colors:
        raise AssertionError(len(used_colors))
    if first is None or last is None or ImageChops.difference(first, last).getbbox():
        raise AssertionError("The loop seam is not pixel-identical")

    file_size = gif_path.stat().st_size
    if file_size > 12 * 1024 * 1024:
        raise AssertionError(f"GIF exceeds 12 MiB: {file_size}")

    return {
        "frames": FRAME_COUNT,
        "seconds": sum(durations) / 1000,
        "colors": len(used_colors),
        "bytes": file_size,
    }


def validate_webp_animation(
    webp_path: Path,
    size: int,
    expected_durations: list[int],
) -> dict[str, int | float]:
    with Image.open(webp_path) as animation:
        if animation.format != "WEBP":
            raise AssertionError(animation.format)
        if animation.size != (size, size):
            raise AssertionError(animation.size)
        if animation.n_frames != FRAME_COUNT:
            raise AssertionError(animation.n_frames)

        durations: list[int] = []
        for index in range(animation.n_frames):
            animation.seek(index)
            animation.load()
            durations.append(animation.info.get("duration", 0))

    if durations != expected_durations:
        raise AssertionError(durations)

    return {
        "frames": FRAME_COUNT,
        "seconds": sum(durations) / 1000,
        "bytes": webp_path.stat().st_size,
    }


def main() -> None:
    args = parse_args()
    if args.size < 256:
        raise ValueError("Animation size must be at least 256px")
    if not 2 <= args.colors <= 256:
        raise ValueError("GIF colors must be between 2 and 256")
    if not 1 <= args.webp_quality <= 100:
        raise ValueError("WebP quality must be between 1 and 100")

    flower_keys = split_flower_keys(args.flower_sheet, args.size)
    bird_canvas = round(args.size * 0.31)
    wren_poses = split_wren_poses(args.wren_sheet, bird_canvas)
    frames, durations = build_frames(flower_keys, wren_poses)

    save_animation(frames, durations, args.gif, args.colors)
    if args.webp:
        save_webp_animation(frames, durations, args.webp, args.webp_quality)
    args.poster.parent.mkdir(parents=True, exist_ok=True)
    poster = add_wren(flower_keys[-1], wren_poses[1], 0.62)
    poster.save(args.poster, format="PNG", optimize=True)
    if args.review_sheet:
        save_review_sheet(frames, args.review_sheet)

    validation = validate_animation(
        args.gif,
        args.size,
        args.colors,
        durations,
    )
    webp_validation = (
        validate_webp_animation(args.webp, args.size, durations)
        if args.webp
        else None
    )

    print(
        {
            "gif": str(args.gif.resolve()),
            "webp": str(args.webp.resolve()) if args.webp else None,
            "poster": str(args.poster.resolve()),
            "frames": len(frames),
            "size": frames[0].size,
            "seconds": sum(durations) / 1000,
            "colors": args.colors,
            "validation": validation,
            "webp_validation": webp_validation,
        }
    )


if __name__ == "__main__":
    main()
