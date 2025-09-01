
import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker } from "@mediapipe/tasks-vision";
import { EmotionState, detectEmotion, getEmotionFeedback } from '@/utils/mediapipe/emotionDetection';
import { speakText } from '@/utils/speechUtils';

export const useEmotionDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const [emotionState, setEmotionState] = useState<EmotionState>({
    dominant: 'neutral',
    confidence: 0,
    scores: {
      happy: 0,
      sad: 0,
      surprised: 0,
      neutral: 1,
      disgust: 0,
      angry: 0,
      fearful: 0
    },
    icon: '😐'
  });

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const lastFeedbackTimeRef = useRef<number>(0);

  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        const vision = await import("@mediapipe/tasks-vision").then(m => m.FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        ));

        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          outputFaceBlendshapes: true,
          numFaces: 1,
        });
      } catch (error) {
        console.error('Failed to initialize face landmarker for emotions:', error);
      }
    };

    if (isActive) {
      initializeFaceLandmarker();
    }

    return () => {
      faceLandmarkerRef.current = null;
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !faceLandmarkerRef.current || !videoRef.current) return;

    let animationFrame: number;

    const detectEmotions = () => {
      const video = videoRef.current;
      const faceLandmarker = faceLandmarkerRef.current;

      if (video && faceLandmarker && video.readyState === 4) {
        try {
          const results = faceLandmarker.detectForVideo(video, performance.now());
          
          if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
            const newEmotionState = detectEmotion(results.faceBlendshapes);
            setEmotionState(newEmotionState);

            // Provide emotion-based feedback (throttled)
            const now = Date.now();
            if (now - lastFeedbackTimeRef.current > 15000) { // Every 15 seconds
              const feedback = getEmotionFeedback(newEmotionState);
              if (feedback) {
                speakText(feedback);
                lastFeedbackTimeRef.current = now;
              }
            }
          }
        } catch (error) {
          console.error('Emotion detection error:', error);
        }
      }

      animationFrame = requestAnimationFrame(detectEmotions);
    };

    detectEmotions();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isActive, videoRef]);

  return emotionState;
};
