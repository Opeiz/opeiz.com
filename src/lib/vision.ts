// Image processing: pure functions, no React, no browser → easy to test.
//
// An image is a grid of pixels. Each pixel = 4 numbers (Red, Green, Blue, Alpha), 0–255,
// stored one after another in a flat array: [R,G,B,A, R,G,B,A, ...].
// Pixel (x, y) starts at index (y * width + x) * 4.
// Same layout as the browser's ImageData, so canvas pixels can go in and out directly.

export type Img = { width: number; height: number; data: Uint8ClampedArray };
// Uint8ClampedArray: values are automatically "clamped" to 0–255 (300 → 255, -20 → 0).

export type Kernel = number[][]; // 3×3 grid of weights

export function createImg(width: number, height: number): Img {
  return { width, height, data: new Uint8ClampedArray(width * height * 4) };
}

/** Perceived brightness of a color. Green counts most: human eyes are most sensitive to it. */
export function luminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** Color → shades of gray (R = G = B = brightness). */
export function grayscale(src: Img): Img {
  const out = createImg(src.width, src.height);
  for (let i = 0; i < src.data.length; i += 4) {
    const y = luminance(src.data[i], src.data[i + 1], src.data[i + 2]);
    out.data[i] = out.data[i + 1] = out.data[i + 2] = y;
    out.data[i + 3] = src.data[i + 3];
  }
  return out;
}

/** Every pixel becomes black or white: brighter than `level` → white. */
export function threshold(src: Img, level: number): Img {
  const out = createImg(src.width, src.height);
  for (let i = 0; i < src.data.length; i += 4) {
    const v = luminance(src.data[i], src.data[i + 1], src.data[i + 2]) >= level ? 255 : 0;
    out.data[i] = out.data[i + 1] = out.data[i + 2] = v;
    out.data[i + 3] = 255;
  }
  return out;
}

/**
 * Convolution: slide a 3×3 kernel over the image. For every pixel and every color channel:
 *   new value = Σ (neighbour × weight) / divisor + offset
 * At the borders, missing neighbours copy the nearest edge pixel ("clamp").
 */
export function convolve(src: Img, kernel: Kernel, divisor = 1, offset = 0): Img {
  const { width: w, height: h, data } = src;
  const out = createImg(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let ky = -1; ky <= 1; ky++) {
        const sy = Math.min(h - 1, Math.max(0, y + ky)); // clamp to the image
        for (let kx = -1; kx <= 1; kx++) {
          const sx = Math.min(w - 1, Math.max(0, x + kx));
          const weight = kernel[ky + 1][kx + 1];
          const i = (sy * w + sx) * 4;
          r += data[i] * weight;
          g += data[i + 1] * weight;
          b += data[i + 2] * weight;
        }
      }
      const o = (y * w + x) * 4;
      out.data[o] = r / divisor + offset;
      out.data[o + 1] = g / divisor + offset;
      out.data[o + 2] = b / divisor + offset;
      out.data[o + 3] = data[o + 3];
    }
  }
  return out;
}

export const SOBEL_X: Kernel = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
];
export const SOBEL_Y: Kernel = [
  [-1, -2, -1],
  [0, 0, 0],
  [1, 2, 1],
];

/**
 * Sobel edge detection: measure how fast brightness changes left↔right (Gx) and up↔down (Gy).
 * Edge strength = √(Gx² + Gy²). Flat areas → 0 (black), sharp changes → bright.
 */
export function sobel(src: Img): Img {
  const gray = grayscale(src);
  const { width: w, height: h, data } = gray;
  const out = createImg(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let gx = 0;
      let gy = 0;
      for (let ky = -1; ky <= 1; ky++) {
        const sy = Math.min(h - 1, Math.max(0, y + ky));
        for (let kx = -1; kx <= 1; kx++) {
          const sx = Math.min(w - 1, Math.max(0, x + kx));
          const v = data[(sy * w + sx) * 4];
          gx += v * SOBEL_X[ky + 1][kx + 1];
          gy += v * SOBEL_Y[ky + 1][kx + 1];
        }
      }
      const o = (y * w + x) * 4;
      out.data[o] = out.data[o + 1] = out.data[o + 2] = Math.hypot(gx, gy);
      out.data[o + 3] = 255;
    }
  }
  return out;
}

// ---------- The filters shown on the site ----------

export type FilterId = "original" | "grayscale" | "blur" | "sharpen" | "edges" | "emboss" | "threshold";

export type Filter = {
  id: FilterId;
  label: string;
  kernel?: Kernel; // shown in the diagram
  kernelNote?: string; // e.g. "÷ 16"
  explain: string;
};

export const FILTERS: Filter[] = [
  { id: "original", label: "Original", explain: "What the camera captures: a grid of red, green and blue numbers from 0 to 255." },
  {
    id: "grayscale",
    label: "Grayscale",
    explain: "Brightness = 0.299·R + 0.587·G + 0.114·B. Green weighs most because our eyes are most sensitive to it. Most vision algorithms start here.",
  },
  {
    id: "blur",
    label: "Gaussian blur",
    kernel: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1],
    ],
    kernelNote: "÷ 16",
    explain: "Each pixel becomes a weighted average of its neighbours. It removes noise before detecting edges.",
  },
  {
    id: "sharpen",
    label: "Sharpen",
    kernel: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    explain: "Boost the center, subtract the neighbours: differences get bigger, so details pop.",
  },
  {
    id: "edges",
    label: "Edges (Sobel)",
    kernel: SOBEL_X,
    kernelNote: "+ its vertical twin",
    explain: "Measures how fast brightness changes. Edges are the first step for lane detection, robots finding objects, or reading text.",
  },
  {
    id: "emboss",
    label: "Emboss",
    kernel: [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2],
    ],
    kernelNote: "+ 128",
    explain: "A diagonal difference plus a gray offset: surfaces look lit from one side, like a relief.",
  },
  {
    id: "threshold",
    label: "Threshold",
    explain: "Every pixel becomes black or white. The simplest segmentation: separate the object from the background.",
  },
];

/** The kernel of a filter, looked up by id (not by position in the list, which can change). */
function kernelOf(id: FilterId): Kernel {
  const kernel = FILTERS.find((f) => f.id === id)?.kernel;
  if (!kernel) throw new Error(`Filter "${id}" has no kernel`);
  return kernel;
}

/** Run one filter. `level` is only used by threshold. */
export function applyFilter(src: Img, id: FilterId, level = 128): Img {
  switch (id) {
    case "original":
      return src;
    case "grayscale":
      return grayscale(src);
    case "blur":
      return convolve(src, kernelOf("blur"), 16);
    case "sharpen":
      return convolve(src, kernelOf("sharpen"));
    case "edges":
      return sobel(src);
    case "emboss":
      return convolve(grayscale(src), kernelOf("emboss"), 1, 128);
    case "threshold":
      return threshold(src, level);
  }
}
