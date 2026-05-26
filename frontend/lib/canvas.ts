import type { Stroke, Point } from "../../shared/types";

/**
 * Renders all strokes onto the canvas context.
 * Uses quadratic bezier curves for smooth freehand rendering.
 */
export function renderStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Stroke[],
  canvasWidth: number,
  canvasHeight: number
): void {
  // Clear canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (const stroke of strokes) {
    renderStroke(ctx, stroke);
  }
}

/**
 * Renders a single stroke onto the canvas.
 * Handles both pen and eraser tools.
 */
export function renderStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke
): void {
  if (stroke.points.length === 0) return;

  ctx.save();

  ctx.globalCompositeOperation =
    stroke.tool === "eraser" ? "destination-out" : "source-over";
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();

  if (stroke.points.length === 1) {
    // Single dot
    const { x, y } = stroke.points[0];
    ctx.arc(x, y, stroke.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = stroke.tool === "eraser" ? "rgba(0,0,0,1)" : stroke.color;
    ctx.fill();
  } else {
    // Smooth bezier curve through points
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

    for (let i = 1; i < stroke.points.length - 1; i++) {
      const cp = stroke.points[i];
      const next = stroke.points[i + 1];
      // Midpoint for smooth curve
      const midX = (cp.x + next.x) / 2;
      const midY = (cp.y + next.y) / 2;
      ctx.quadraticCurveTo(cp.x, cp.y, midX, midY);
    }

    // Last segment
    const last = stroke.points[stroke.points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Appends new points to an in-progress stroke and renders only the new segment.
 * Much faster than full re-render for active drawing.
 */
export function renderStrokeTail(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  newPoints: Point[]
): void {
  if (newPoints.length === 0) return;

  ctx.save();

  ctx.globalCompositeOperation =
    stroke.tool === "eraser" ? "destination-out" : "source-over";
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const allPoints = stroke.points;
  const startIdx = Math.max(0, allPoints.length - newPoints.length - 1);

  ctx.beginPath();

  if (allPoints.length <= 1) {
    if (allPoints.length === 1) {
      const { x, y } = allPoints[0];
      ctx.arc(x, y, stroke.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = stroke.tool === "eraser" ? "rgba(0,0,0,1)" : stroke.color;
      ctx.fill();
    }
  } else {
    ctx.moveTo(allPoints[startIdx].x, allPoints[startIdx].y);
    for (let i = startIdx + 1; i < allPoints.length - 1; i++) {
      const cp = allPoints[i];
      const next = allPoints[i + 1];
      const midX = (cp.x + next.x) / 2;
      const midY = (cp.y + next.y) / 2;
      ctx.quadraticCurveTo(cp.x, cp.y, midX, midY);
    }
    const last = allPoints[allPoints.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Gets normalized canvas coordinates from a mouse/touch event.
 */
export function getCanvasPoint(
  e: MouseEvent | Touch,
  canvas: HTMLCanvasElement
): Point {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

/**
 * Exports the canvas as a PNG download.
 */
export function downloadCanvasAsPng(
  canvas: HTMLCanvasElement,
  filename = "whiteboard.png"
): void {
  // Create a temporary canvas with white background
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d")!;

  tempCtx.fillStyle = "#ffffff";
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.drawImage(canvas, 0, 0);

  const link = document.createElement("a");
  link.download = filename;
  link.href = tempCanvas.toDataURL("image/png");
  link.click();
}
