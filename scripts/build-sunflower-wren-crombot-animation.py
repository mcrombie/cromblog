"""Build the ten-second sunflower, wren, and Crombot 1 procession."""

from __future__ import annotations

import argparse
import importlib.util
import math
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps


BASE_SCRIPT = Path(__file__).with_name("build-sunflower-wren-animation-v2.py")
BASE_SPEC = importlib.util.spec_from_file_location("sunflower_wren_v2", BASE_SCRIPT)
if BASE_SPEC is None or BASE_SPEC.loader is None:
    raise RuntimeError(f"Could not load animation helpers from {BASE_SCRIPT}")
base = importlib.util.module_from_spec(BASE_SPEC)
sys.modules[BASE_SPEC.name] = base
BASE_SPEC.loader.exec_module(base)


DEFAULT_SIZE = 1024
DEFAULT_SECONDS = 10
DEFAULT_FPS = 10
DEFAULT_GIF_COLORS = 96
WREN_START = 0.025
WREN_END = 0.70
CROMBOT_START = 0.04
CROMBOT_END = 0.96


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--flower-dir", type=Path, required=True)
    parser.add_argument("--wren-sheet", type=Path, required=True)
    parser.add_argument("--crombot", type=Path, required=True)
    parser.add_argument("--gif", type=Path, required=True)
    parser.add_argument("--webp", type=Path, required=True)
    parser.add_argument("--poster", type=Path, required=True)
    parser.add_argument("--review-sheet", type=Path)
    parser.add_argument("--size", type=int, default=DEFAULT_SIZE)
    parser.add_argument("--seconds", type=int, default=DEFAULT_SECONDS)
    parser.add_argument("--fps", type=int, default=DEFAULT_FPS)
    parser.add_argument("--gif-colors", type=int, default=DEFAULT_GIF_COLORS)
    parser.add_argument("--webp-quality", type=int, default=88)
    return parser.parse_args()


def clamp(value: float, lower: float = 0.0, upper: float = 1.0) -> float:
    return max(lower, min(upper, value))


def smoothstep(value: float) -> float:
    value = clamp(value)
    return value * value * (3.0 - (2.0 * value))


def ease_out_quadratic(value: float) -> float:
    value = clamp(value)
    return 1.0 - ((1.0 - value) ** 2)


def make_durations(frame_count: int, total_ms: int) -> list[int]:
    # GIF durations are encoded in ten-millisecond units. Spread the rounded
    # units deterministically so the result retains the exact requested time.
    if total_ms % 10:
        raise ValueError("Animation duration must be divisible by 10 ms")
    total_units = total_ms // 10
    base_units, remainder = divmod(total_units, frame_count)
    if base_units < 1:
        raise ValueError("Frame rate is too high for GIF timing")
    return [
        (base_units + (1 if index < remainder else 0)) * 10
        for index in range(frame_count)
    ]


def load_crombot(path: Path, canvas_size: int) -> Image.Image:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("RGBA")
    alpha = image.getchannel("A")
    bounds = alpha.getbbox()
    if bounds is None:
        raise ValueError(f"Crombot asset is fully transparent: {path}")
    image = image.crop(bounds)

    target_width = round(canvas_size * 0.34)
    scale = target_width / image.width
    image = image.resize(
        (target_width, round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    # The canonical plate faces lower-right. Mirror it so the sensor face points
    # into Crombot's lower-right-to-center travel direction.
    return ImageOps.mirror(image)


def bloom_at(
    keys: list[Image.Image],
    progress: float,
    reveal_order: Image.Image,
    hard_head: Image.Image,
) -> Image.Image:
    if progress <= 0:
        return keys[0].copy()
    if progress >= 1:
        return keys[-1].copy()

    stage_position = progress * (len(keys) - 1)
    stage_index = min(len(keys) - 2, int(stage_position))
    # A linear local reveal keeps every 100 ms frame visibly productive. A
    # stronger ease caused the first quantized GIF frames to collapse together.
    local_progress = stage_position - stage_index
    return base.reveal_between(
        keys[stage_index],
        keys[stage_index + 1],
        local_progress,
        reveal_order,
        hard_head,
    )


def add_wren(
    bloom: Image.Image,
    poses: list[Image.Image],
    progress: float,
    seconds: int,
) -> Image.Image:
    if progress < WREN_START or progress > WREN_END:
        return bloom.convert("RGBA")

    flight = clamp((progress - WREN_START) / (WREN_END - WREN_START))
    travel = smoothstep(flight)
    size = bloom.width
    center_x = (-0.16 + (1.34 * travel)) * size
    center_y = (
        -0.02
        + (0.36 * travel)
        + (0.04 * math.sin(math.pi * flight))
        + (0.012 * math.sin(4 * math.pi * flight))
    ) * size

    pose_cycle = (0, 1, 0, 2, 3, 2)
    pose_index = round(flight * seconds * 8) % len(pose_cycle)
    pose = poses[pose_cycle[pose_index]]

    frame = bloom.convert("RGBA")
    frame.alpha_composite(
        pose,
        (
            round(center_x - (pose.width / 2)),
            round(center_y - (pose.height / 2)),
        ),
    )

    # Keep the bird intact above the botanical plate. Occluding it with the
    # flower-head mask also caught the tall leaf and fragmented mid-flight poses.
    return frame


def add_crombot(
    background: Image.Image,
    crombot: Image.Image,
    progress: float,
) -> Image.Image:
    drive = ease_out_quadratic(
        (progress - CROMBOT_START) / (CROMBOT_END - CROMBOT_START)
    )
    size = background.width
    center_x = (1.18 + ((0.68 - 1.18) * drive)) * size
    wheel_cycle = drive * 7.0
    bottom = (0.965 * size) + (1.5 * math.sin(2 * math.pi * wheel_cycle))
    angle = 0.55 * math.sin(2 * math.pi * wheel_cycle)

    sprite = crombot.rotate(
        angle,
        resample=Image.Resampling.BICUBIC,
        expand=True,
    )
    left = round(center_x - (sprite.width / 2))
    top = round(bottom - sprite.height)

    frame = background.convert("RGBA")
    shadow = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_width = round(crombot.width * 0.64)
    shadow_draw.ellipse(
        (
            round(center_x - (shadow_width / 2)),
            round(bottom - 9),
            round(center_x + (shadow_width / 2)),
            round(bottom + 7),
        ),
        fill=(83, 57, 28, 48),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(5))
    frame = Image.alpha_composite(frame, shadow)
    frame.alpha_composite(sprite, (left, top))
    return frame


def build_frames(
    keys: list[Image.Image],
    wren_poses: list[Image.Image],
    crombot: Image.Image,
    frame_count: int,
    seconds: int,
) -> list[Image.Image]:
    size = keys[0].width
    # The inherited reveal field intentionally starts around value 30 for the
    # short opener's initial hold. Stretch it to the full range here so the
    # ten-second bloom begins changing on frame two rather than idling.
    reveal_order = ImageOps.autocontrast(base.make_reveal_order(size))
    hard_head = base.make_head_mask(size, feather=1).point(
        lambda value: 255 if value >= 128 else 0
    )

    frames: list[Image.Image] = []
    for index in range(frame_count):
        progress = index / (frame_count - 1)
        bloom = bloom_at(keys, progress, reveal_order, hard_head)
        with_wren = add_wren(bloom, wren_poses, progress, seconds)
        complete = add_crombot(with_wren, crombot, progress)
        frames.append(complete.convert("RGB"))
    return frames


def save_one_shot_gif(
    frames: list[Image.Image],
    durations: list[int],
    path: Path,
    colors: int,
) -> None:
    palette = base.shared_palette(frames, colors)
    quantized = [
        frame.quantize(palette=palette, dither=Image.Dither.NONE)
        for frame in frames
    ]
    for index in range(1, len(quantized)):
        if quantized[index - 1].tobytes() == quantized[index].tobytes():
            raise AssertionError(
                f"Adjacent GIF source frames {index - 1} and {index} are identical"
            )

    path.parent.mkdir(parents=True, exist_ok=True)
    # Deliberately omit the GIF loop extension: the ten-second narrative plays
    # once and holds instead of snapping from an open flower back to a bud.
    quantized[0].save(
        path,
        save_all=True,
        append_images=quantized[1:],
        duration=durations,
        disposal=1,
        optimize=True,
    )


def save_one_shot_webp(
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
        loop=1,
        quality=quality,
        method=6,
        minimize_size=True,
    )


def read_webp_durations(path: Path) -> tuple[list[int], int | None]:
    data = path.read_bytes()
    position = 12
    durations: list[int] = []
    loop_count: int | None = None
    while position + 8 <= len(data):
        tag = data[position : position + 4]
        length = int.from_bytes(data[position + 4 : position + 8], "little")
        payload = data[position + 8 : position + 8 + length]
        if tag == b"ANIM" and len(payload) >= 6:
            loop_count = int.from_bytes(payload[4:6], "little")
        if tag == b"ANMF" and len(payload) >= 16:
            durations.append(int.from_bytes(payload[12:15], "little"))
        position += 8 + length + (length & 1)
    return durations, loop_count


def validate_outputs(
    gif_path: Path,
    webp_path: Path,
    size: int,
    durations: list[int],
) -> dict[str, object]:
    with Image.open(gif_path) as gif:
        gif_durations = []
        for index in range(gif.n_frames):
            gif.seek(index)
            gif_durations.append(gif.info.get("duration", 0))
        if gif.size != (size, size):
            raise AssertionError(gif.size)
        if gif.n_frames != len(durations) or gif_durations != durations:
            raise AssertionError((gif.n_frames, gif_durations, durations))
        if "loop" in gif.info:
            raise AssertionError("GIF unexpectedly contains a loop extension")

    with Image.open(webp_path) as webp:
        if webp.size != (size, size) or webp.n_frames != len(durations):
            raise AssertionError((webp.size, webp.n_frames))
    webp_durations, loop_count = read_webp_durations(webp_path)
    if webp_durations != durations:
        raise AssertionError((webp_durations, durations))
    if loop_count != 1:
        raise AssertionError(("Unexpected WebP loop count", loop_count))

    return {
        "frames": len(durations),
        "duration_ms": sum(durations),
        "gif_bytes": gif_path.stat().st_size,
        "gif_loop": "one-shot",
        "webp_bytes": webp_path.stat().st_size,
        "webp_loop_count": loop_count,
    }


def main() -> None:
    args = parse_args()
    if args.size < 512:
        raise ValueError("The animation master must be at least 512 pixels square")
    if args.seconds < 1 or args.fps < 1:
        raise ValueError("Seconds and fps must be positive")
    if not 2 <= args.gif_colors <= 256:
        raise ValueError("GIF colors must be between 2 and 256")
    if not 1 <= args.webp_quality <= 100:
        raise ValueError("WebP quality must be between 1 and 100")

    frame_count = args.seconds * args.fps
    durations = make_durations(frame_count, args.seconds * 1000)
    keys, shifts = base.load_and_stabilize_keys(args.flower_dir, args.size)
    wren_poses = base.split_wren_poses(
        args.wren_sheet,
        round(args.size * 0.31),
    )
    crombot = load_crombot(args.crombot, args.size)
    frames = build_frames(keys, wren_poses, crombot, frame_count, args.seconds)

    save_one_shot_gif(frames, durations, args.gif, args.gif_colors)
    save_one_shot_webp(frames, durations, args.webp, args.webp_quality)

    # This frame keeps all three subjects visible for archive and card artwork.
    poster_index = round((frame_count - 1) * 0.45)
    args.poster.parent.mkdir(parents=True, exist_ok=True)
    frames[poster_index].save(args.poster, format="PNG", optimize=True)

    if args.review_sheet:
        sample_count = 20
        sample_indexes = [
            round(index * (frame_count - 1) / (sample_count - 1))
            for index in range(sample_count)
        ]
        base.save_sheet(
            [frames[index] for index in sample_indexes],
            args.review_sheet,
            columns=5,
            thumb_size=184,
        )

    validation = validate_outputs(
        args.gif,
        args.webp,
        args.size,
        durations,
    )
    if args.gif.stat().st_size > 24 * 1024 * 1024:
        raise AssertionError(f"GIF exceeds 24 MiB: {args.gif.stat().st_size}")
    if args.webp.stat().st_size > 14 * 1024 * 1024:
        raise AssertionError(f"WebP exceeds 14 MiB: {args.webp.stat().st_size}")

    print(
        {
            "gif": str(args.gif.resolve()),
            "webp": str(args.webp.resolve()),
            "poster": str(args.poster.resolve()),
            "size": (args.size, args.size),
            "stage_count": len(keys),
            "shifts": shifts,
            "validation": validation,
        }
    )


if __name__ == "__main__":
    main()
