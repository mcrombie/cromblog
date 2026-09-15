"""Turn ImageGen's pale checkerboard preview into a real transparent PNG.

The generated Crombot plate is an RGB engraving on a nearly neutral background.
This script builds a soft alpha matte from luminance and chroma, then removes the
light background contribution from edge pixels so the character also composites
cleanly on dark Cromblog themes.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def clamp(value: float, lower: float = 0.0, upper: float = 1.0) -> float:
    return max(lower, min(upper, value))


def smoothstep(edge_zero: float, edge_one: float, value: float) -> float:
    position = clamp((value - edge_zero) / (edge_one - edge_zero))
    return position * position * (3.0 - 2.0 * position)


def alpha_for(red: int, green: int, blue: int) -> int:
    luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    chroma = max(red, green, blue) - min(red, green, blue)

    # The baked checkerboard measures at least 241.6 luminance and no more than
    # three points of chroma at the canvas edges. Engraved paper and wire tints
    # are either darker or more chromatic, which makes this separation stable.
    if luminance >= 240.5 and chroma <= 4:
        return 0
    if luminance <= 234 or chroma >= 7:
        return 255

    pale = smoothstep(234, 241.5, luminance)
    neutral = 1.0 - smoothstep(2.5, 7, chroma)
    alpha = round(255 * (1.0 - pale * neutral))

    if alpha <= 4:
        return 0
    if alpha >= 251:
        return 255
    return alpha


def unmatte(channel: int, alpha: int, background: int = 248) -> int:
    if alpha == 0:
        return 0
    if alpha == 255:
        return channel

    opacity = alpha / 255
    recovered = (channel - (1.0 - opacity) * background) / opacity
    return round(clamp(recovered, 0, 255))


def extract(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGB")
    output = Image.new("RGBA", image.size)

    converted = []
    for red, green, blue in image.get_flattened_data():
        alpha = alpha_for(red, green, blue)
        converted.append(
            (
                unmatte(red, alpha),
                unmatte(green, alpha),
                unmatte(blue, alpha),
                alpha,
            )
        )

    output.putdata(converted)
    destination.parent.mkdir(parents=True, exist_ok=True)
    output.save(destination, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    arguments = parser.parse_args()
    extract(arguments.source, arguments.destination)


if __name__ == "__main__":
    main()
