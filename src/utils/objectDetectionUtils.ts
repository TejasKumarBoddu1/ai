const CLASS_COLOR_MAP: Record<string, string> = {
  'person': '#2196F3',      // blue
  'cell phone': '#E53935',  // red
  'laptop': '#43A047',      // green
  // Add more classes as needed
  'default': '#FFC107'      // amber/yellow for unknown
};

export const drawRect = (
  detections: any[],
  ctx: CanvasRenderingContext2D
) => {
  detections.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const text = prediction.class;

    // Use fixed color per class
    const color = CLASS_COLOR_MAP[text] || CLASS_COLOR_MAP['default'];
    ctx.strokeStyle = color;
    ctx.font = "18px Arial";
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.fillText(text, x, y);
    ctx.rect(x, y, width, height);
    ctx.stroke();
  });
}; 