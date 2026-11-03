"use client";

import { Camera, CameraOff, ImageUp, Mountain } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { drawCover, drawScene } from "@/lib/scene";
import { t, type Dict } from "@/i18n/dictionaries";
import { applyFilter, FILTERS, type FilterId, type Kernel } from "@/lib/vision";

const W = 640; // processing size (enough detail, still fast enough for live camera)
const H = 400;

type Source = "scene" | "photo" | "camera";

/**
 * "How a machine sees": pick a filter, compare before/after, try your own photo or camera.
 * Everything runs in the browser; photos and camera frames are never uploaded.
 */
export function VisionLab({ text }: { text: Dict["vision"] }) {
  const sourceCanvas = useRef<HTMLCanvasElement | null>(null); // hidden: holds the current input image
  const originalCanvas = useRef<HTMLCanvasElement>(null);
  const outputCanvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const dragging = useRef(false);

  const [filterId, setFilterId] = useState<FilterId>("edges");
  const [level, setLevel] = useState(128); // threshold level
  const [split, setSplit] = useState(50); // % from the left where "filtered" starts
  const [source, setSource] = useState<Source>("scene");
  const [cameraError, setCameraError] = useState<string | null>(null);

  const filter = FILTERS.find((f) => f.id === filterId)!;
  const filterText = text.filters[filterId]; // name + explanation in the visitor's language

  /** Read the input pixels, show them on the left, filter them, show the result on the right. */
  const render = useCallback(() => {
    const src = sourceCanvas.current;
    const left = originalCanvas.current?.getContext("2d");
    const right = outputCanvas.current?.getContext("2d");
    if (!src || !left || !right) return;
    const frame = src.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, W, H);
    left.putImageData(frame, 0, 0);
    const result = applyFilter({ width: W, height: H, data: frame.data }, filterId, level);
    const out = right.createImageData(W, H);
    out.data.set(result.data);
    right.putImageData(out, 0, 0);
  }, [filterId, level]);

  // The camera loop needs the LATEST render function, without restarting the loop each time.
  const renderRef = useRef(render);
  useEffect(() => {
    renderRef.current = render;
    render(); // filter or level changed → redraw now
  }, [render]);

  /** The hidden source canvas, created once (no need to put it on the page). */
  function sourceContext() {
    if (!sourceCanvas.current) {
      sourceCanvas.current = document.createElement("canvas");
      sourceCanvas.current.width = W;
      sourceCanvas.current.height = H;
    }
    return sourceCanvas.current.getContext("2d", { willReadFrequently: true })!;
  }

  function stopCamera() {
    stream.current?.getTracks().forEach((track) => track.stop()); // turns the camera light off
    stream.current = null;
    if (video.current) video.current.srcObject = null;
  }

  function showScene() {
    stopCamera();
    drawScene(sourceContext(), W, H);
    setSource("scene");
    renderRef.current();
  }

  // First drawing, and turn the camera off if the visitor leaves the page.
  useEffect(() => {
    drawScene(sourceContext(), W, H);
    renderRef.current();
    return stopCamera;
  }, []);

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow choosing the same file again later
    if (!file) return;
    stopCamera();
    const bitmap = await createImageBitmap(file); // decoded locally, never uploaded
    const ctx = sourceContext();
    ctx.clearRect(0, 0, W, H);
    drawCover(ctx, bitmap, bitmap.width, bitmap.height, W, H);
    bitmap.close();
    setSource("photo");
    renderRef.current();
  }

  async function startCamera() {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      stream.current = media;
      video.current!.srcObject = media;
      await video.current!.play();
      setCameraError(null);
      setSource("camera");
    } catch {
      setCameraError(text.cameraError);
    }
  }

  // Camera loop: copy each video frame (mirrored, like a selfie) into the source, then filter it.
  useEffect(() => {
    if (source !== "camera") return;
    const ctx = sourceContext();
    let frame = 0;
    const tick = () => {
      const v = video.current;
      if (v && v.videoWidth) {
        ctx.save();
        ctx.translate(W, 0);
        ctx.scale(-1, 1);
        drawCover(ctx, v, v.videoWidth, v.videoHeight, W, H);
        ctx.restore();
        renderRef.current();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [source]);

  /** Drag on the image to move the before/after line. */
  function splitFromPointer(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setSplit(Math.round(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))));
  }

  const chip = (active: boolean) =>
    `inline-flex min-h-10 items-center rounded-full border px-3.5 text-sm transition ${
      active ? "border-accent bg-accent font-semibold text-on-accent" : "border-border bg-surface hover:border-foreground/30"
    }`;
  const sourceButton =
    "inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium transition hover:border-foreground/30";

  return (
    <div>
      {/* Filter picker */}
      <div role="group" aria-label={text.filterGroup} className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" aria-pressed={f.id === filterId} onClick={() => setFilterId(f.id)} className={chip(f.id === filterId)}>
            {text.filters[f.id].label}
          </button>
        ))}
      </div>

      {/* Before / after image */}
      <div className="mt-4 rounded-3xl border border-border bg-surface p-3 shadow-sm md:p-4">
        <div
          className="relative aspect-[16/10] cursor-ew-resize touch-pan-y overflow-hidden rounded-2xl bg-background select-none"
          onPointerDown={(e) => {
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            splitFromPointer(e);
          }}
          onPointerMove={(e) => dragging.current && splitFromPointer(e)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <canvas ref={originalCanvas} width={W} height={H} aria-hidden="true" className="absolute inset-0 h-full w-full" />
          <canvas
            ref={outputCanvas}
            width={W}
            height={H}
            role="img"
            aria-label={t(text.imageLabel, { filter: filterText.label, source: text.sources[source] })}
            className="absolute inset-0 h-full w-full"
            style={{ clipPath: `inset(0 0 0 ${split}%)` }}
          />
          {/* Divider line + labels */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow" style={{ left: `${split}%` }}>
            <span className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/40 backdrop-blur" />
          </div>
          <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] text-white">
            {text.original}
          </span>
          <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] text-white">
            {filterText.label}
          </span>
        </div>

        {/* Compare slider: the keyboard-friendly way to move the line */}
        <label className="mt-3 flex items-center gap-3 px-1 font-mono text-xs text-muted">
          {text.compare}
          <input
            type="range"
            min={0}
            max={100}
            value={split}
            onChange={(e) => setSplit(Number(e.target.value))}
            className="h-11 flex-1 accent-accent"
          />
        </label>

        {filterId === "threshold" && (
          <label className="flex items-center gap-3 px-1 font-mono text-xs text-muted">
            {t(text.level, { level })}
            <input
              type="range"
              min={0}
              max={255}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="h-11 flex-1 accent-accent"
            />
          </label>
        )}

        {/* Input source */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={showScene} aria-pressed={source === "scene"} className={sourceButton}>
            <Mountain className="size-4" strokeWidth={1.8} aria-hidden="true" />
            {text.sampleScene}
          </button>
          <label className={`${sourceButton} cursor-pointer focus-within:ring-2 focus-within:ring-accent`}>
            <ImageUp className="size-4" strokeWidth={1.8} aria-hidden="true" />
            {text.yourPhoto}
            <input type="file" accept="image/*" onChange={onPhoto} className="sr-only" />
          </label>
          {source === "camera" ? (
            <button type="button" onClick={showScene} className={sourceButton}>
              <CameraOff className="size-4" strokeWidth={1.8} aria-hidden="true" />
              {text.stopCamera}
            </button>
          ) : (
            <button type="button" onClick={startCamera} className={sourceButton}>
              <Camera className="size-4" strokeWidth={1.8} aria-hidden="true" />
              {text.liveCamera}
            </button>
          )}
          <p className="ml-auto pr-1 font-mono text-xs text-muted">{text.privacy}</p>
        </div>
        {cameraError && (
          <p role="alert" className="mt-2 px-1 text-sm text-accent">
            {cameraError}
          </p>
        )}
        <video ref={video} playsInline muted className="hidden" />
      </div>

      {/* Explanation + diagram */}
      {/* Diagram gets 3/5 of the width: it needs room for pixels × kernel = result on one line */}
      <div className="mt-4 grid gap-4 md:grid-cols-5">
        <div className="rounded-3xl border border-border bg-surface p-5 md:col-span-2 md:p-6">
          <p className="font-mono text-xs tracking-widest text-accent uppercase">{filterText.label}</p>
          <p className="mt-3 leading-relaxed">{filterText.explain}</p>
          {filter.kernel ? (
            <div className="mt-5 flex items-center gap-3">
              <KernelGrid kernel={filter.kernel} label={text.kernel} />
              {filterText.note && <span className="font-mono text-sm text-muted">{filterText.note}</span>}
            </div>
          ) : (
            <p className="mt-5 font-mono text-xs text-muted">{text.noKernel}</p>
          )}
        </div>
        <ConvolutionDiagram kernel={filter.kernel ?? FILTERS.find((f) => f.id === "edges")!.kernel!} divisor={filterId === "blur" ? 16 : 1} offset={0} text={text} />
      </div>
    </div>
  );
}

// ---------- Diagrams ----------

/** A 3×3 kernel as a grid of numbers. Positive = orange, negative = muted, zero = faint. */
function KernelGrid({ kernel, label, small = false }: { kernel: Kernel; label: string; small?: boolean }) {
  return (
    <div className={`grid grid-cols-3 gap-1 font-mono ${small ? "text-xs" : "text-sm"}`} aria-label={`${label}: ${kernel.map((r) => r.join(" ")).join(" / ")}`}>
      {kernel.flat().map((v, i) => (
        <span
          key={i}
          className={`flex items-center justify-center rounded-md border border-border ${small ? "size-7" : "size-10"} ${
            v > 0 ? "bg-accent-soft text-accent" : v < 0 ? "text-muted" : "text-muted/40"
          }`}
        >
          {v}
        </span>
      ))}
    </div>
  );
}

// A tiny 5×5 patch of a dark→bright vertical edge, to show the math on real numbers.
const PATCH = Array.from({ length: 5 }, () => [10, 10, 10, 90, 90]);

/**
 * How one output pixel is computed: take the 3×3 window around it, multiply by the kernel,
 * add everything up. The result uses the CURRENT filter's kernel.
 */
function ConvolutionDiagram({ kernel, divisor, offset, text }: { kernel: Kernel; divisor: number; offset: number; text: Dict["vision"] }) {
  // Window = rows 1–3, columns 1–3 of the patch (centered on the middle pixel)
  let sum = 0;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) sum += PATCH[r + 1][c + 1] * kernel[r][c];
  const raw = sum / divisor + offset;
  const clamped = Math.round(Math.min(255, Math.max(0, raw)));

  return (
    <figure className="rounded-3xl border border-border bg-surface p-5 md:col-span-3 md:p-6">
      <figcaption className="font-mono text-xs tracking-widest text-accent uppercase">{text.howTitle}</figcaption>
      <div className="mt-5 flex flex-wrap items-center gap-3" aria-hidden="true">
        {/* Pixels, with the 3×3 window highlighted */}
        <div className="grid grid-cols-5 gap-0.5 font-mono text-[10px]">
          {PATCH.flatMap((row, r) =>
            row.map((v, c) => {
              const inWindow = r >= 1 && r <= 3 && c >= 1 && c <= 3;
              return (
                <span
                  key={`${r}-${c}`}
                  className={`flex size-6 items-center justify-center rounded-sm ${inWindow ? "ring-2 ring-accent" : ""}`}
                  style={{ background: `rgb(${v * 2.5} ${v * 2.5} ${v * 2.5})`, color: v > 50 ? "#111" : "#eee" }}
                >
                  {v}
                </span>
              );
            }),
          )}
        </div>
        <span className="font-mono text-muted">×</span>
        <KernelGrid kernel={kernel} label={text.kernel} small />
        <span className="font-mono text-muted">=</span>
        <span
          className="flex size-10 items-center justify-center rounded-md font-mono text-xs ring-2 ring-accent"
          style={{ background: `rgb(${clamped} ${clamped} ${clamped})`, color: clamped > 128 ? "#111" : "#eee" }}
        >
          {clamped}
        </span>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-muted">
        {text.howText}
        {divisor !== 1 && ` (÷ ${divisor})`}
        {offset !== 0 && ` (+ ${offset})`}. {text.here} <span className="font-mono text-foreground">{Math.round(raw)}</span>
        {raw !== clamped && (
          <>
            {" "}→ {text.clampedTo} <span className="font-mono text-foreground">{clamped}</span>
          </>
        )}
        .
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {text.cnnBefore} <span className="text-foreground">{text.cnnLearns}</span> {text.cnnAfter}
      </p>
    </figure>
  );
}
