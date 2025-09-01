
export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface MediaPipeAnalysis {
  handDetectionCounter: number;
  handDetectionDuration: number;
  notFacingCounter: number;
  notFacingDuration: number;
  badPostureDetectionCounter: number;
  badPostureDuration: number;
  handPresence?: boolean;
  facePresence?: boolean;
  posePresence?: boolean;
}
