
import { useEffect, useRef, useState, RefObject } from "react";
import { FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";
import { initializeFaceDetection } from "@/utils/mediapipe/faceDetection";
import { initializeHandDetection } from "@/utils/mediapipe/handDetection";
import { initializePoseDetection } from "@/utils/mediapipe/poseDetection";
import { isFacingForward, isBadPosture } from "@/utils/mediapipe/analytics";
import { drawHandLandmarks, drawFaceMeshLandmarks, drawPoseLandmarkers } from "@/lib/mediapipe/drawing";

export const useMediapipe = (
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  overlayEnabled: boolean
) => {
  const [handPresence, setHandPresence] = useState(false);
  const [facePresence, setFacePresence] = useState(false);
  const [posePresence, setPosePresence] = useState(false);
  
  const [handDetectionCounter, setHandDetectionCounter] = useState(0);
  const [handDetectionDuration, setHandDetectionDuration] = useState(0);
  const [notFacingCounter, setNotFacingCounter] = useState(0);
  const [notFacingDuration, setNotFacingDuration] = useState(0);
  const [badPostureDetectionCounter, setBadPostureDetectionCounter] = useState(0);
  const [badPostureDuration, setBadPostureDuration] = useState(0);

  const isHandOnScreenRef = useRef(false);
  const notFacingRef = useRef(false);
  const hasBadPostureRef = useRef(false);

  const handDetectionStartTimeRef = useRef<number | null>(null);
  const notFacingStartTimeRef = useRef<number | null>(null);
  const badPostureStartTimeRef = useRef<number | null>(null);

  const faceLandmarkerRef = useRef<any>(null);
  const handLandmarkerRef = useRef<any>(null);
  const poseLandmarkerRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastProcessTimeRef = useRef<number>(0);

  useEffect(() => {
    const initializeMediaPipe = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );

        // Initialize all detectors
        faceLandmarkerRef.current = await initializeFaceDetection(vision);
        handLandmarkerRef.current = await initializeHandDetection(vision);
        poseLandmarkerRef.current = await initializePoseDetection(vision);

        startDetection();
      } catch (error) {
        console.error("Failed to initialize MediaPipe:", error);
      }
    };

    const startDetection = () => {
      const detect = () => {
        const now = performance.now();
        
        // Throttle to ~20fps for better performance
        if (now - lastProcessTimeRef.current < 50) {
          animationFrameRef.current = requestAnimationFrame(detect);
          return;
        }
        
        lastProcessTimeRef.current = now;

        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          if (ctx && video.readyState >= 2) {
            const currentTime = performance.now();
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Face detection
            if (faceLandmarkerRef.current) {
              try {
                const faceResults = faceLandmarkerRef.current.detectForVideo(video, currentTime);
                const hasFace = faceResults.faceLandmarks.length > 0;
                setFacePresence(hasFace);

                if (hasFace) {
                  if (overlayEnabled) {
                    drawFaceMeshLandmarks(canvas, faceResults);
                  }

                  const landmarks = faceResults.faceLandmarks[0];
                  const facingForward = isFacingForward(landmarks);
                  
                  if (!facingForward && !notFacingRef.current) {
                    notFacingRef.current = true;
                    notFacingStartTimeRef.current = Date.now();
                    setNotFacingCounter(prev => prev + 1);
                  } else if (facingForward && notFacingRef.current) {
                    notFacingRef.current = false;
                    if (notFacingStartTimeRef.current) {
                      const duration = (Date.now() - notFacingStartTimeRef.current) / 1000;
                      setNotFacingDuration(prev => prev + duration);
                      notFacingStartTimeRef.current = null;
                    }
                  }
                }
              } catch (error) {
                console.error("Face detection error:", error);
              }
            }

            // Hand detection
            if (handLandmarkerRef.current) {
              try {
                const handResults = handLandmarkerRef.current.detectForVideo(video, currentTime);
                const hasHands = handResults.landmarks.length > 0;
                setHandPresence(hasHands);
                
                if (hasHands && !isHandOnScreenRef.current) {
                  isHandOnScreenRef.current = true;
                  handDetectionStartTimeRef.current = Date.now();
                  setHandDetectionCounter(prev => prev + 1);
                } else if (!hasHands && isHandOnScreenRef.current) {
                  isHandOnScreenRef.current = false;
                  if (handDetectionStartTimeRef.current) {
                    const duration = (Date.now() - handDetectionStartTimeRef.current) / 1000;
                    setHandDetectionDuration(prev => prev + duration);
                    handDetectionStartTimeRef.current = null;
                  }
                }

                if (hasHands && overlayEnabled) {
                  drawHandLandmarks(canvas, handResults.landmarks);
                }
              } catch (error) {
                console.error("Hand detection error:", error);
              }
            }

            // Pose detection
            if (poseLandmarkerRef.current) {
              try {
                const poseResults = poseLandmarkerRef.current.detectForVideo(video, currentTime);
                const hasPose = poseResults.landmarks.length > 0;
                setPosePresence(hasPose);

                if (hasPose) {
                  if (overlayEnabled) {
                    drawPoseLandmarkers(canvas, poseResults.landmarks);
                  }

                  const landmarks = poseResults.landmarks[0];
                  const badPosture = isBadPosture(landmarks);
                  
                  if (badPosture && !hasBadPostureRef.current) {
                    hasBadPostureRef.current = true;
                    badPostureStartTimeRef.current = Date.now();
                    setBadPostureDetectionCounter(prev => prev + 1);
                  } else if (!badPosture && hasBadPostureRef.current) {
                    hasBadPostureRef.current = false;
                    if (badPostureStartTimeRef.current) {
                      const duration = (Date.now() - badPostureStartTimeRef.current) / 1000;
                      setBadPostureDuration(prev => prev + duration);
                      badPostureStartTimeRef.current = null;
                    }
                  }
                }
              } catch (error) {
                console.error("Pose detection error:", error);
              }
            }
          }
        }
        
        animationFrameRef.current = requestAnimationFrame(detect);
      };

      detect();
    };

    initializeMediaPipe();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [overlayEnabled]);

  return {
    handPresence,
    facePresence,
    posePresence,
    handDetectionCounter,
    handDetectionDuration,
    notFacingCounter,
    notFacingDuration,
    badPostureDetectionCounter,
    badPostureDuration,
    isHandOnScreenRef,
    notFacingRef,
    hasBadPostureRef
  };
};
