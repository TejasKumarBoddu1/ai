import React, { useRef, useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useMediapipe } from "@/hooks/useMediaPipe";

export interface ObservationMetrics {
  handPresence: boolean;
  facePresence: boolean;
  posePresence: boolean;
  handDetectionCounter: number;
  handDetectionDuration: number;
  notFacingCounter: number;
  notFacingDuration: number;
  badPostureDetectionCounter: number;
  badPostureDuration: number;
  isHandOnScreenRef: React.MutableRefObject<boolean>;
  notFacingRef: React.MutableRefObject<boolean>;
  hasBadPostureRef: React.MutableRefObject<boolean>;
}

interface ObservationCameraProps {
  overlayEnabled?: boolean;
  onMetricsUpdate?: (metrics: ObservationMetrics) => void;
}

const DEFAULT_ASPECT = 4 / 3;

const ObservationCamera: React.FC<ObservationCameraProps> = ({ overlayEnabled = true, onMetricsUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCamera(videoRef);
  const metrics = useMediapipe(videoRef, canvasRef, overlayEnabled);

  // Call onMetricsUpdate on every metrics change
  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    metrics.handPresence,
    metrics.facePresence,
    metrics.posePresence,
    metrics.handDetectionCounter,
    metrics.handDetectionDuration,
    metrics.notFacingCounter,
    metrics.notFacingDuration,
    metrics.badPostureDetectionCounter,
    metrics.badPostureDuration,
    metrics.isHandOnScreenRef.current,
    metrics.notFacingRef.current,
    metrics.hasBadPostureRef.current
  ]);

  // Ensure canvas always matches video size
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const updateCanvasSize = () => {
      if (video.videoWidth && video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    };
    video.addEventListener('loadedmetadata', updateCanvasSize);
    video.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    return () => {
      video.removeEventListener('loadedmetadata', updateCanvasSize);
      video.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <div className="relative w-full aspect-video bg-slate-100 rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full rounded-lg z-10"
        style={{ backgroundColor: '#000', objectFit: 'contain', width: '100%', height: '100%' }}
      />
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full z-20 rounded-lg pointer-events-none ${
          overlayEnabled ? 'opacity-80' : 'opacity-0'
        }`}
        style={{ backgroundColor: "transparent", objectFit: 'contain', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ObservationCamera; 