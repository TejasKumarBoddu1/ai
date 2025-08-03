import React, { useEffect, useRef, useState } from 'react';

interface DirectFaceApiCameraProps {
  onEmotionDetected?: (emotions: any) => void;
}

const DirectFaceApiCamera: React.FC<DirectFaceApiCameraProps> = ({ onEmotionDetected }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  // Load Face-API script directly from source
  useEffect(() => {
    const loadFaceApi = async () => {
      try {
        // Check if already loaded
        if ((window as any).faceapi) {
          console.log('Face-API already loaded');
          initializeCamera();
          return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = '/face-api/face-api.min.js'; // Use path to copied file
        script.async = false;

        // Add load event
        script.onload = () => {
          console.log('Face-API script loaded successfully');
          initializeCamera();
        };

        script.onerror = (e) => {
          console.error('Error loading Face-API script:', e);
          setError('Failed to load Face-API. Please refresh the page.');
          setIsLoading(false);
        };

        // Add to document
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error in loadFaceApi:', error);
        setError('Failed to initialize Face-API. Please refresh the page.');
        setIsLoading(false);
      }
    };

    loadFaceApi();

    return () => {
      // Cleanup
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Initialize camera
  const initializeCamera = async () => {
    try {
      if (!videoRef.current) {
        setError('Video element not found');
        setIsLoading(false);
        return;
      }

      // Load models from source directory
      const faceapi = (window as any).faceapi;
      console.log('Loading Face-API models from source directory...');

      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/face-api/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/face-api/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/face-api/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/face-api/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/face-api/models"),
        ]);
        console.log('Face-API models loaded successfully');
      } catch (modelError) {
        console.error('Error loading models:', modelError);
        setError('Failed to load Face-API models. Please refresh the page.');
        setIsLoading(false);
        return;
      }

      // Get camera stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: "user"
          },
          audio: false
        });

        // Set video source
        videoRef.current.srcObject = stream;
        
        // Setup detection when video starts playing
        videoRef.current.onplay = () => {
          console.log('Video is playing, setting up detection');
          setupFaceDetection();
          setIsLoading(false);
        };

        // Start playing
        videoRef.current.play().catch(e => {
          console.error('Error playing video:', e);
          setError('Failed to play video: ' + e.message);
          setIsLoading(false);
        });
      } catch (cameraError) {
        console.error('Camera access error:', cameraError);
        setError('Failed to access camera. Please check permissions.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in initializeCamera:', error);
      setError('Failed to initialize camera. Please refresh the page.');
      setIsLoading(false);
    }
  };

  // Setup face detection - directly based on script.js
  const setupFaceDetection = () => {
    if (!videoRef.current || !containerRef.current) return;

    const video = videoRef.current;
    const container = containerRef.current;
    const faceapi = (window as any).faceapi;

    // Create canvas from video
    const canvas = faceapi.createCanvasFromMedia(video);
    canvas.className = 'camera-canvas face-detection-canvas';
    
    // Set canvas size to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Add to container
    container.appendChild(canvas);
    canvasRef.current = canvas;

    // Match dimensions for face-api
    faceapi.matchDimensions(canvas, { 
      width: video.videoWidth, 
      height: video.videoHeight 
    });

    console.log(`Canvas created with dimensions: ${canvas.width}x${canvas.height}`);

    // Start detection interval - directly based on script.js
    detectionIntervalRef.current = window.setInterval(async () => {
      try {
        // Detect faces with all features
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();

        // Clear canvas
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);

        // Resize results to match actual video dimensions
        const displaySize = { 
          width: video.videoWidth, 
          height: video.videoHeight 
        };
        
        // Ensure canvas dimensions match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Match dimensions for face-api
        faceapi.matchDimensions(canvas, displaySize);

        // Resize results
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        // Draw results - exactly like script.js
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        // Add age and gender labels
        resizedDetections.forEach(detection => {
          const box = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, {
            label: Math.round(detection.age) + " years " + detection.gender
          });
          drawBox.draw(canvas);
        });

        // Send emotion data to parent component
        if (resizedDetections.length > 0 && onEmotionDetected) {
          const detection = resizedDetections[0];
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

          onEmotionDetected({
            dominant: dominantEmotion,
            confidence: confidence,
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
      } catch (error) {
        console.error('Face detection error:', error);
      }
    }, 100);
  };

  return (
    <div ref={containerRef} className="camera-container">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-slate-600">Loading Face-API...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-red-600 text-center p-4">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      <video 
        ref={videoRef}
        className="camera-video"
        autoPlay
        playsInline
        muted
      />
    </div>
  );
};

export default DirectFaceApiCamera; 