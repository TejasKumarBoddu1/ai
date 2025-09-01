
import { Landmark } from "@/types/mediapipe";

export const isFacingForward = (landmarks: Landmark[]): boolean => {
  if (landmarks.length < 473) {
    console.warn("Not enough landmarks provided for gaze estimation.");
    return false;
  }

  const rightEyeOuter = landmarks[33];
  const rightEyeInner = landmarks[133];

  const irisLandmarks = landmarks.slice(468, 468 + 5);
  if (irisLandmarks.length < 5) {
    console.warn("Not enough iris landmarks for gaze estimation.");
    return false;
  }

  const irisCenter = irisLandmarks.reduce(
    (acc, cur) => ({
      x: acc.x + cur.x,
      y: acc.y + cur.y,
      z: acc.z + cur.z,
      visibility: 0,
    }),
    { x: 0, y: 0, z: 0, visibility: 0 }
  );

  irisCenter.x /= irisLandmarks.length;
  irisCenter.y /= irisLandmarks.length;
  irisCenter.z /= irisLandmarks.length;

  const AB = {
    x: rightEyeInner.x - rightEyeOuter.x,
    y: rightEyeInner.y - rightEyeOuter.y,
  };

  const AI = {
    x: irisCenter.x - rightEyeOuter.x,
    y: irisCenter.y - rightEyeOuter.y,
  };

  const dot = AI.x * AB.x + AI.y * AB.y;
  const norm2 = AB.x * AB.x + AB.y * AB.y;
  if (norm2 === 0) {
    return false;
  }

  const t = dot / norm2;
  return t >= 0.4 && t <= 0.6;
};

export const isBadPosture = (landmarks: Landmark[]): boolean => {
  const head = landmarks[0];
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];

  if (!head || !leftShoulder || !rightShoulder) return false;

  const midShoulders = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };

  const dx = head.x - midShoulders.x;
  const dy = head.y - midShoulders.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < 0.3;
};
