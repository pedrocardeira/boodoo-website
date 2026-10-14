import type { BookMediaRef } from "./album-types";

export type FramingMode = "entire" | "fill";
export type Framing = {
  mode: FramingMode;
  zoom: number;
  focusX: number; // 0..1 from left
  focusY: number; // 0..1 from top
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * The original source path is never altered. Cropping is a normalized
 * instruction for the eventual print renderer, not a modified image file.
 */
export function readFraming(media: BookMediaRef): Framing {
  const zoom = media.crop && media.crop.width > 0
    ? clamp(1 / media.crop.width, 1, 3)
    : 1;
  return {
    mode: media.photoLayout === "fill" ? "fill" : "entire",
    zoom,
    focusX: clamp(media.focalPoint?.x ?? 0.5, 0, 1),
    focusY: clamp(media.focalPoint?.y ?? 0.5, 0, 1)
  };
}

export function updateFraming(media: BookMediaRef, framing: Framing): BookMediaRef {
  const zoom = clamp(framing.zoom, 1, 3);
  const x = clamp(framing.focusX, 0, 1);
  const y = clamp(framing.focusY, 0, 1);
  if (framing.mode === "entire") {
    return {
      ...media,
      photoLayout: "entire",
      crop: undefined,
      focalPoint: { x: 0.5, y: 0.5 }
    };
  }
  const length = 1 / zoom;
  return {
    ...media,
    photoLayout: "fill",
    focalPoint: { x, y },
    crop: {
      x: (1 - length) * x,
      y: (1 - length) * y,
      width: length,
      height: length
    }
  };
}
