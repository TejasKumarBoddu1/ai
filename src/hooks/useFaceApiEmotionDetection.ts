import { useEffect, useRef, useState } from 'react';

// Define the emotion state interface
export interface FaceApiEmotionState {
  dominant: string;
  confidence: number;
  scores: {
    happy: number;
    sad: number;
    surprised: number;
    neutral: number;
    disgusted: number;
    angry: number;
    fearful: number;
  };
  icon: string;
  age?: number;
  gender?: string;
}

export const useFaceApiEmotionDetection = (
  videoRef: React.RefObject<HTMLVideoElement>,
  isActive: boolean
) => {
  const [emotionState, setEmotionState] = useState<FaceApiEmotionState>({
    dominant: 'neutral',
    confidence: 0,
    scores: {
      happy: 0,
      sad: 0,
      surprised: 0,
      neutral: 1,
      disgusted: 0,
      angry: 0,
      fearful: 0
    },
    icon: '😐'
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isRunningRef = useRef<boolean>(false);
  const lastFeedbackTimeRef = useRef<number>(0);
  const modelsLoadedRef = useRef<boolean>(false);
  const frameCounterRef = useRef<number>(0);
  const lastDetectionRef = useRef<any>(null);

  // Check if models are loaded
  useEffect(() => {
    const checkModelsLoaded = async () => {
      try {
        const faceapi = (window as any).faceapi;
        if (!faceapi) return false;
        
        // Check if models are loaded
        const tinyFaceDetectorLoaded = faceapi.nets.tinyFaceDetector.isLoaded;
        const faceLandmarkLoaded = faceapi.nets.faceLandmark68Net.isLoaded;
        const faceExpressionLoaded = faceapi.nets.faceExpressionNet.isLoaded;
        const ageGenderLoaded = faceapi.nets.ageGenderNet.isLoaded;
        
        const allLoaded = tinyFaceDetectorLoaded && faceLandmarkLoaded && 
                          faceExpressionLoaded && ageGenderLoaded;
        
        console.log('Face-API models loaded status:', {
          tinyFaceDetector: tinyFaceDetectorLoaded,
          faceLandmark: faceLandmarkLoaded,
          faceExpression: faceExpressionLoaded,
          ageGender: ageGenderLoaded,
          allLoaded
        });
        
        modelsLoadedRef.current = allLoaded;
        return allLoaded;
      } catch (error) {
        console.error('Error checking Face-API models:', error);
        return false;
      }
    };
    
    // Check models loaded status periodically
    const intervalId = setInterval(async () => {
      const loaded = await checkModelsLoaded();
      if (loaded) {
        clearInterval(intervalId);
      }
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Load face-api models if not already loaded
  useEffect(() => {
    // Load face-api models
    const loadModels = async () => {
      try {
        const faceapi = (window as any).faceapi;
        if (!faceapi) {
          console.error('Face-api.js not found');
          return;
        }

        if (!modelsLoadedRef.current) {
          console.log('Loading Face-API models from hook...');
          await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/Face-api/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/Face-api/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/Face-api/models'),
            faceapi.nets.ageGenderNet.loadFromUri('/Face-api/models'),
          ]);
          
          modelsLoadedRef.current = true;
          console.log('Face-api models loaded successfully from hook');
        }
      } catch (error) {
        console.error('Failed to load face-api models:', error);
      }
    };

    if (isActive) {
      loadModels();
    }

    return () => {
      isRunningRef.current = false;
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive || !videoRef.current) return;

    const video = videoRef.current;
    const faceapi = (window as any).faceapi;
    
    if (!faceapi) {
      console.error('Face-api.js not found');
      return;
    }

    // Create canvas if it doesn't exist
    if (!canvasRef.current) {
      const canvas = faceapi.createCanvasFromMedia(video);
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.display = 'none'; // Hide canvas since we're showing emotions separately
      
      // Add canvas to the same container as video
      if (video.parentNode) {
        video.parentNode.appendChild(canvas);
        canvasRef.current = canvas;
      }
    }

    isRunningRef.current = true;
    frameCounterRef.current = 0;

    const detectEmotions = async () => {
      if (!isRunningRef.current || !video || !canvasRef.current || !modelsLoadedRef.current) {
        if (!modelsLoadedRef.current) {
          console.log('Face-API models not yet loaded, waiting...');
        }
        requestAnimationFrame(detectEmotions);
        return;
      }

      try {
        frameCounterRef.current++;
        const canvas = canvasRef.current;
        
        // Only run full detection every 3 frames for better performance
        if (frameCounterRef.current % 3 === 0) {
          // Match dimensions
          faceapi.matchDimensions(canvas, {
            width: video.clientWidth,
            height: video.clientHeight
          });

          // Detect all faces with expressions and age/gender
          const detections = await faceapi
            .detectAllFaces(
              video, 
              new faceapi.TinyFaceDetectorOptions({
                inputSize: 320, // Smaller input size for better performance
                scoreThreshold: 0.5 // Higher threshold for better accuracy
              })
            )
            .withFaceExpressions()
            .withAgeAndGender();

          // Clear the canvas
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Resize results to match display size
          const resizedDetections = faceapi.resizeResults(detections, {
            width: video.clientWidth,
            height: video.clientHeight
          });

          // Process emotion data
          if (resizedDetections.length > 0) {
            lastDetectionRef.current = resizedDetections[0];
            const detection = resizedDetections[0]; // Use first face
            const expressions = detection.expressions;
            
            // Find dominant emotion
            const emotionEntries = Object.entries(expressions);
            const [dominantEmotion, confidence] = emotionEntries.reduce((max, current) => 
              current[1] > max[1] ? current : max
            );

            const emotionIcons: Record<string, string> = {
              happy: '😊',
              sad: '😢',
              surprised: '😮',
              neutral: '😐',
              disgusted: '🤢',
              angry: '😠',
              fearful: '😨'
            };

            // Update emotion state
            setEmotionState({
              dominant: dominantEmotion,
              confidence: confidence as number,
              scores: {
                happy: expressions.happy || 0,
                sad: expressions.sad || 0,
                surprised: expressions.surprised || 0,
                neutral: expressions.neutral || 0,
                disgusted: expressions.disgusted || 0,
                angry: expressions.angry || 0,
                fearful: expressions.fearful || 0
              },
              icon: emotionIcons[dominantEmotion as string] || '😐',
              age: detection.age,
              gender: detection.gender
            });
          }
        } else if (lastDetectionRef.current) {
          // Use cached detection for intermediate frames
          const detection = lastDetectionRef.current;
          // No need to update the state here as we're using the cached detection
          // This reduces state updates and improves performance
        }

        // Continue detection loop with a slight delay for better performance
        if (isRunningRef.current) {
          setTimeout(() => requestAnimationFrame(detectEmotions), 16); // ~60fps
        }
      } catch (error) {
        console.error('Face-api emotion detection error:', error);
        if (isRunningRef.current) {
          setTimeout(() => requestAnimationFrame(detectEmotions), 1000);
        }
      }
    };

    // Start detection after a short delay to ensure video is playing
    setTimeout(() => {
      if (isRunningRef.current) {
        detectEmotions();
      }
    }, 1000);

    return () => {
      isRunningRef.current = false;
      
      // Remove canvas when component unmounts
      if (canvasRef.current && canvasRef.current.parentNode) {
        canvasRef.current.parentNode.removeChild(canvasRef.current);
        canvasRef.current = null;
      }
    };
  }, [isActive, videoRef.current]);

  return emotionState;
}; 