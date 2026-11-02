// The sample picture for the vision lab, drawn with code (no image file needed):
// the Alps at dusk, a lake, and a sailboat. Strong shapes and contrast → nice edges.

export function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const horizon = h * 0.62;

  // Sky: night blue at the top → warm orange at the horizon
  const sky = ctx.createLinearGradient(0, 0, 0, horizon);
  sky.addColorStop(0, "#1f2a44");
  sky.addColorStop(0.6, "#7a5a78");
  sky.addColorStop(1, "#f0a272");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, horizon);

  // Sun
  ctx.fillStyle = "#ffd9a0";
  ctx.beginPath();
  ctx.arc(w * 0.72, horizon - h * 0.12, h * 0.09, 0, Math.PI * 2);
  ctx.fill();

  // Mountains: list of [x, y] as fractions of the width/height
  const range = (points: [number, number][], color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    for (const [x, y] of points) ctx.lineTo(x * w, y * h);
    ctx.lineTo(w, horizon);
    ctx.closePath();
    ctx.fill();
  };
  range([[0, 0.45], [0.12, 0.3], [0.22, 0.42], [0.36, 0.22], [0.5, 0.4], [0.62, 0.33], [0.78, 0.47], [0.9, 0.36], [1, 0.44]], "#4a5578");
  range([[0, 0.55], [0.15, 0.4], [0.3, 0.56], [0.46, 0.36], [0.6, 0.55], [0.82, 0.42], [1, 0.56]], "#2a3352");

  // Snow caps on the front peaks: small white triangles
  ctx.fillStyle = "#eef1f6";
  for (const [px, py] of [[0.15, 0.4], [0.46, 0.36], [0.82, 0.42]] as [number, number][]) {
    ctx.beginPath();
    ctx.moveTo(px * w, py * h);
    ctx.lineTo(px * w - w * 0.035, py * h + h * 0.06);
    ctx.lineTo(px * w + w * 0.035, py * h + h * 0.06);
    ctx.closePath();
    ctx.fill();
  }

  // Lake
  const lake = ctx.createLinearGradient(0, horizon, 0, h);
  lake.addColorStop(0, "#3b4a70");
  lake.addColorStop(1, "#141b30");
  ctx.fillStyle = lake;
  ctx.fillRect(0, horizon, w, h - horizon);

  // Sun reflection: short horizontal stripes
  ctx.fillStyle = "rgba(255, 217, 160, 0.55)";
  for (let i = 0; i < 6; i++) {
    const width = w * (0.12 - i * 0.015);
    ctx.fillRect(w * 0.72 - width / 2, horizon + 8 + i * 12, width, 3);
  }

  // Sailboat: hull, mast, two sails (one in the site's orange)
  const bx = w * 0.3;
  const by = h * 0.8;
  ctx.fillStyle = "#0e1116";
  ctx.beginPath();
  ctx.moveTo(bx - 46, by);
  ctx.lineTo(bx + 52, by);
  ctx.lineTo(bx + 36, by + 16);
  ctx.lineTo(bx - 34, by + 16);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(bx - 2, by - 110, 4, 110);
  ctx.fillStyle = "#f5f0e6";
  ctx.beginPath();
  ctx.moveTo(bx + 4, by - 108);
  ctx.lineTo(bx + 50, by - 8);
  ctx.lineTo(bx + 4, by - 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#e4572e";
  ctx.beginPath();
  ctx.moveTo(bx - 4, by - 92);
  ctx.lineTo(bx - 4, by - 8);
  ctx.lineTo(bx - 40, by - 8);
  ctx.closePath();
  ctx.fill();
}

/** Draw an image/video so it fills the whole canvas, cropping the extra (like CSS object-fit: cover). */
export function drawCover(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / sourceWidth, h / sourceHeight);
  const dw = sourceWidth * scale;
  const dh = sourceHeight * scale;
  ctx.drawImage(source, (w - dw) / 2, (h - dh) / 2, dw, dh);
}
