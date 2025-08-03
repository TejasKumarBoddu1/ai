import React, { useEffect, useRef, useState } from 'react';

interface FaceApiCameraProps {
  onEmotionDetected?: (emotions: any) => void;
}

// Function to load Face-API script dynamically
const loadFaceApiScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).faceapi) {
      console.log('Face-API already loaded');
      resolve();
      return;
    }

    console.log('Dynamically loading Face-API script...');
    const script = document.createElement('script');
    script.src = '/face-api.min.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Face-API script loaded successfully');
      resolve();
    };
    
    script.onerror = (e) => {
      console.error('Error loading Face-API script:', e);
      reject(new Error('Failed to load Face-API script'));
    };
    
    document.head.appendChild(script);
  });
};

const FaceApiCamera: React.FC<FaceApiCameraProps> = ({ onEmotionDetected }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // First effect: Load the Face-API script
  useEffect(() => {
    const loadScript = async () => {
      try {
        await loadFaceApiScript();
        setIsScriptLoaded(true);
      } catch (error) {
        console.error('Failed to load Face-API script:', error);
        setError('Failed to load Face-API script. Please refresh the page.');
      }
    };

    loadScript();
  }, []);

  // Second effect: Start camera once script is loaded
  useEffect(() => {
    if (!isScriptLoaded) return;
    
    const startWebcam = async () => {
      try {
        if (!videoRef.current) {
          setError('Video element not found');
          return;
        }

        console.log('Requesting webcam access...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 320 },
            height: { ideal: 240 },
            facingMode: "user"
          },
          audio: false,
        });

        console.log('Webcam access granted');
        
        // Store stream reference for cleanup
        streamRef.current = stream;
        
        // Set video source
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing');
                setIsVideoLoaded(true);
                
                // Get actual video dimensions
                if (videoRef.current) {
                  const videoWidth = videoRef.current.videoWidth;
                  const videoHeight = videoRef.current.videoHeight;
                  setDimensions({ width: videoWidth, height: videoHeight });
                  console.log(`Video dimensions: ${videoWidth}x${videoHeight}`);
                }
                
                // Setup canvas and start detection when video starts playing
                setupCanvasAndDetection();
              })
              .catch(e => {
                console.error('Error playing video:', e);
                setError('Failed to play video: ' + e.message);
              });
          }
        };
      } catch (error: any) {
        console.error('Error accessing webcam:', error);
        setError('Camera access denied or not available: ' + error.message);
      }
    };

    startWebcam();

    return () => {
      // Stop webcam stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          console.log('Stopping track:', track.kind);
          track.stop();
        });
      }
    };
  }, [isScriptLoaded]);

  // Update canvas size when container or video dimensions change
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current || !canvasRef.current || !videoRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Set canvas dimensions to match container
      canvasRef.current.width = containerWidth;
      canvasRef.current.height = containerHeight;
      
      console.log(`Canvas resized to: ${containerWidth}x${containerHeight}`);
    };
    
    // Call once immediately
    if (isVideoLoaded) {
      updateCanvasSize();
    }
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [isVideoLoaded, dimensions]);

  // Setup canvas and start detection - similar to script.js approach
  const setupCanvasAndDetection = async () => {
    try {
      if (!videoRef.current || !isVideoLoaded || !containerRef.current) return;
      
      const video = videoRef.current;
      const container = containerRef.current;
      const faceapi = (window as any).faceapi;
      
      if (!faceapi) {
        setError('Face-API not loaded');
        return;
      }
      
      console.log('Loading Face-API models...');
      
      // Load all models like in script.js
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ]);
      
      console.log('Face-API models loaded successfully');
      
      // Create canvas if it doesn't exist
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas');
        canvas.className = 'camera-canvas face-detection-canvas';
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Add canvas to container
        container.appendChild(canvas);
        canvasRef.current = canvas;
        
        console.log(`Created canvas with size: ${canvas.width}x${canvas.height}`);
      }
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      console.log('Starting face detection...');
      setIsDetecting(true);
      
      // Start detection loop
      detectionIntervalRef.current = window.setInterval(async () => {
        if (!isDetecting || video.paused || video.ended || !canvas) return;
        
        try {
          // Detect faces with all features
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
              inputSize: 320, // Use smaller input size for better performance
              scoreThreshold: 0.3 // Lower threshold for better detection
            }))
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender();
          
          // Clear previous drawings
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
          
          // Calculate display size based on actual container size
          const displaySize = {
            width: container.clientWidth,
            height: container.clientHeight
          };
          
          // Resize results to match display size
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          // Draw results
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections, { drawLines: true, color: 'lightblue' });
          faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
          
          // Add age and gender labels
          resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
              label: Math.round(detection.age) + " years " + detection.gender,
              lineWidth: 2,
              boxColor: 'deepskyblue'
            });
            drawBox.draw(canvas);
          });
          
          // Process emotion data if callback provided
          if (resizedDetections.length > 0 && onEmotionDetected) {
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
            
            // Send emotion data to parent component
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
      }, 100); // Same interval as script.js
    } catch (error) {
      console.error('Error setting up detection:', error);
      setError('Failed to setup face detection. Check console for details.');
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      console.log('Cleaning up FaceApiCamera...');
      setIsDetecting(false);
      
      // Stop detection interval
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      
      // Stop webcam stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, []);

      return (
      <div 
        ref={containerRef}
        className="camera-container face-detection-container"
      >
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-red-600 text-center p-4">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
              <a 
                href="/face-api-test.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Test Face-API in New Window
              </a>
            </div>
          </div>
        )}
        
        {!isVideoLoaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-slate-600">Initializing camera...</p>
            </div>
          </div>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />
      </div>
    );
};

export default FaceApiCamera; 