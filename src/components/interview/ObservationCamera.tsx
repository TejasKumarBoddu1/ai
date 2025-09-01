import React, { useRef, useEffect, useCallback, useMemo } from "react";
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

const ObservationCamera: React.FC<ObservationCameraProps> = ({ overlayEnabled = true, onMetricsUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastMetricsUpdateRef = useRef<number>(0);
  const metricsUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useCamera(videoRef);
  const metrics = useMediapipe(videoRef, canvasRef, overlayEnabled);

  // Optimized metrics update with debouncing
  const debouncedMetricsUpdate = useCallback((metrics: ObservationMetrics) => {
    const now = performance.now();
    
    // Clear existing timeout
    if (metricsUpdateTimeoutRef.current) {
      clearTimeout(metricsUpdateTimeoutRef.current);
    }
    
    // Only update if enough time has passed (100ms debounce)
    if (now - lastMetricsUpdateRef.current > 100) {
      lastMetricsUpdateRef.current = now;
      onMetricsUpdate?.(metrics);
    } else {
      // Debounce rapid updates
      metricsUpdateTimeoutRef.current = setTimeout(() => {
        lastMetricsUpdateRef.current = performance.now();
        onMetricsUpdate?.(metrics);
      }, 100);
    }
  }, [onMetricsUpdate]);

  // Memoized metrics object to prevent unnecessary re-renders
  const memoizedMetrics = useMemo(() => ({
    handPresence: metrics.handPresence,
    facePresence: metrics.facePresence,
    posePresence: metrics.posePresence,
    handDetectionCounter: metrics.handDetectionCounter,
    handDetectionDuration: metrics.handDetectionDuration,
    notFacingCounter: metrics.notFacingCounter,
    notFacingDuration: metrics.notFacingDuration,
    badPostureDetectionCounter: metrics.badPostureDetectionCounter,
    badPostureDuration: metrics.badPostureDuration,
    isHandOnScreenRef: metrics.isHandOnScreenRef,
    notFacingRef: metrics.notFacingRef,
    hasBadPostureRef: metrics.hasBadPostureRef
  }), [
    metrics.handPresence,
    metrics.facePresence,
    metrics.posePresence,
    metrics.handDetectionCounter,
    metrics.handDetectionDuration,
    metrics.notFacingCounter,
    metrics.notFacingDuration,
    metrics.badPostureDetectionCounter,
    metrics.badPostureDuration
  ]);

  // Optimized metrics update effect
  useEffect(() => {
    debouncedMetricsUpdate(memoizedMetrics);
  }, [memoizedMetrics, debouncedMetricsUpdate]);

  // Optimized canvas size management
  const updateCanvasSize = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    if (video.videoWidth && video.videoHeight) {
      // Only update if size actually changed
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    // Use passive listeners for better performance
    video.addEventListener('loadedmetadata', updateCanvasSize, { passive: true });
    video.addEventListener('resize', updateCanvasSize, { passive: true });
    updateCanvasSize();
    
    return () => {
      video.removeEventListener('loadedmetadata', updateCanvasSize);
      video.removeEventListener('resize', updateCanvasSize);
    };
  }, [updateCanvasSize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (metricsUpdateTimeoutRef.current) {
        clearTimeout(metricsUpdateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full rounded-lg z-10"
        style={{ objectFit: 'cover', width: '100%', height: '100%', transform: 'scaleX(-1)' }}
      />
      <canvas
        ref={canvasRef}
        className={`absolute top-0 left-0 w-full h-full z-20 rounded-lg pointer-events-none ${
          overlayEnabled ? 'opacity-80' : 'opacity-0'
        }`}
        style={{ backgroundColor: "transparent", objectFit: 'cover', width: '100%', height: '100%', transform: 'scaleX(-1)' }}
      />
    </div>
  );
};

export default ObservationCamera; 