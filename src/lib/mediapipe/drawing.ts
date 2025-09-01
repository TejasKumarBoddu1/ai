
import { DrawingUtils } from "@mediapipe/tasks-vision";
import { Landmark } from "@/types/mediapipe";

export const drawHandLandmarks = (
  canvas: HTMLCanvasElement,
  landmarksArray: Landmark[][]
): void => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const drawingUtils = new DrawingUtils(ctx);
  landmarksArray.forEach((landmarks) => {
    // Draw hand connections
    const HAND_CONNECTIONS = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
      [5, 9], [9, 13], [13, 17] // Palm connections
    ];

    // Draw connections
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;
    HAND_CONNECTIONS.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        const startPoint = {
          x: landmarks[start].x * canvas.width,
          y: landmarks[start].y * canvas.height
        };
        const endPoint = {
          x: landmarks[end].x * canvas.width,
          y: landmarks[end].y * canvas.height
        };
        
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
        ctx.stroke();
      }
    });

    // Draw landmarks
    landmarks.forEach((landmark) => {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;
      ctx.beginPath();
      ctx.fillStyle = "#ff0000";
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  });
};

// Full MediaPipe FaceMesh tesselation (912 connections, 468 points)
// Source: https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/src/mediapipe-facemesh/triangulation.ts
// (Shortened for brevity, but in real code, paste the full array)
const FACEMESH_TESSELATION: [number, number][] = [
  [127, 34],[34,139],[139,127],[11,0],[0,37],[37,11],[232,231],[231,120],
  [120,232],[72,37],[37,39],[39,72],[128,121],[121,47],[47,128],
  // ... (Paste all 912 connections here. For brevity, only a few are shown)
];

export const drawFaceMeshLandmarks = (
  canvas: HTMLCanvasElement,
  faceResults: any
): void => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (!faceResults.faceLandmarks || faceResults.faceLandmarks.length === 0) return;

  const landmarks = faceResults.faceLandmarks[0];
  if (!landmarks || landmarks.length === 0) return;

  ctx.save();
  ctx.globalAlpha = 0.95;

  // 1. Draw all mesh connections as thin white lines (wireframe)
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.1;
  FACEMESH_TESSELATION.forEach(([start, end]) => {
    if (landmarks[start] && landmarks[end]) {
      ctx.beginPath();
      ctx.moveTo(landmarks[start].x * canvas.width, landmarks[start].y * canvas.height);
      ctx.lineTo(landmarks[end].x * canvas.width, landmarks[end].y * canvas.height);
      ctx.stroke();
    }
  });

  // 2. Draw a small dot at each mesh point (joint)
  ctx.fillStyle = "#fff";
  landmarks.forEach((landmark: Landmark) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
  });
  // 3. Draw glowing dots at each mesh point
  landmarks.forEach((landmark: Landmark) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    // Glow
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y, 0.7, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    // Sharp dot
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(x, y, 0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
};

export const drawPoseLandmarkers = (
  canvas: HTMLCanvasElement,
  poseLandmarks: Landmark[][]
): void => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  poseLandmarks.forEach((landmarks) => {
    // Minimal pose: thin lines for connections, small subtle points
    ctx.save();
    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.7;
    const POSE_CONNECTIONS = [
      [11, 12], // Shoulders
      [11, 13], [13, 15], // Left arm
      [12, 14], [14, 16], // Right arm
      [11, 23], [12, 24], // Torso
      [23, 24], // Hips
      [23, 25], [25, 27], // Left leg
      [24, 26], [26, 28], // Right leg
    ];
    POSE_CONNECTIONS.forEach(([start, end]) => {
      if (landmarks[start] && landmarks[end]) {
        ctx.beginPath();
        ctx.moveTo(landmarks[start].x * canvas.width, landmarks[start].y * canvas.height);
        ctx.lineTo(landmarks[end].x * canvas.width, landmarks[end].y * canvas.height);
        ctx.stroke();
      }
    });
    // Draw small subtle points
    ctx.fillStyle = "#00ff00";
    landmarks.forEach((landmark) => {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.restore();
  });
};
