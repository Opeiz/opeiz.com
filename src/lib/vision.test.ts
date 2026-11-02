// Tests for the image filters. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import { applyFilter, convolve, createImg, FILTERS, grayscale, sobel, threshold, type Img } from "./vision.ts";

/** A w×h image filled with one color. */
function solid(w: number, h: number, r: number, g: number, b: number): Img {
  const img = createImg(w, h);
  for (let i = 0; i < img.data.length; i += 4) img.data.set([r, g, b, 255], i);
  return img;
}

/** Left half black, right half white: one sharp vertical edge in the middle. */
function verticalEdge(w: number, h: number): Img {
  const img = createImg(w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const v = x < w / 2 ? 0 : 255;
      img.data.set([v, v, v, 255], (y * w + x) * 4);
    }
  return img;
}

const red = (img: Img, x: number, y: number) => img.data[(y * img.width + x) * 4];

test("grayscale: pure red becomes the brightness 0.299 × 255 ≈ 76", () => {
  const out = grayscale(solid(2, 2, 255, 0, 0));
  assert.deepEqual([...out.data.slice(0, 4)], [76, 76, 76, 255]);
});

test("identity kernel leaves the image unchanged", () => {
  const img = verticalEdge(6, 4);
  const identity = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ];
  assert.deepEqual(convolve(img, identity).data, img.data);
});

test("blurring a single-color image changes nothing", () => {
  const img = solid(5, 5, 40, 120, 200);
  assert.deepEqual(applyFilter(img, "blur").data, img.data);
});

test("sobel: flat image has no edges, a black/white border does", () => {
  assert.equal(Math.max(...sobel(solid(6, 6, 90, 90, 90)).data.filter((_, i) => i % 4 === 0)), 0);
  const edges = sobel(verticalEdge(8, 8));
  assert.equal(red(edges, 0, 4), 0, "far from the edge: black");
  assert.ok(red(edges, 4, 4) > 200, "on the edge: bright");
});

test("threshold: only pure black and white remain", () => {
  const values = new Set(threshold(verticalEdge(6, 2), 128).data);
  assert.deepEqual([...values].sort((a, b) => a - b), [0, 255]);
});

test("every filter in the menu runs without errors", () => {
  const img = verticalEdge(6, 6);
  for (const f of FILTERS) assert.equal(applyFilter(img, f.id).data.length, img.data.length, f.id);
});
