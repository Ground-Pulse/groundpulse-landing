#!/usr/bin/env python3
"""Render the GroundPulse mark to PNG at avatar sizes.

Mirrors the inline SVG in index.html: a rounded frame with a pulse trace
across it, white on --ink. Requires Pillow.
"""
from PIL import Image, ImageDraw

INK = (0x13, 0x20, 0x2C, 255)
MARK = (0xFF, 0xFF, 0xFF, 255)


def render(size, path, bg=INK):
    supersample = 4
    w = size * supersample
    img = Image.new("RGBA", (w, w), bg)
    draw = ImageDraw.Draw(img)

    unit = w / 24.0          # the SVG viewBox is 0 0 24 24
    stroke = max(1, round(1.6 * unit))
    half = 1.6 / 2

    draw.rounded_rectangle(
        [2.5 * unit, 4.5 * unit, 21.5 * unit, 19.5 * unit],
        radius=2.5 * unit, outline=MARK, width=stroke,
    )

    # Stop the trace at the inner face of the frame so the round caps sit
    # inside it instead of bulging out the sides.
    pts = [(2.5 + half, 12.6), (6.7, 12.6), (8.7, 8.5), (11.1, 15.7),
           (13.1, 12.6), (21.5 - half, 12.6)]
    draw.line([(x * unit, y * unit) for x, y in pts],
              fill=MARK, width=stroke, joint="curve")

    # Round only the interior vertices; the two ends stay flush.
    r = stroke / 2
    for x, y in pts[1:-1]:
        draw.ellipse([x * unit - r, y * unit - r,
                      x * unit + r, y * unit + r], fill=MARK)

    img.resize((size, size), Image.LANCZOS).save(path)


if __name__ == "__main__":
    for s in (1024, 512, 180):
        render(s, f"brand/groundpulse-mark-{s}.png")
    render(1024, "brand/groundpulse-mark-1024-transparent.png", bg=(0, 0, 0, 0))
    print("rendered 4 files into brand/")
