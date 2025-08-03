
import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { drawRect } from '../utils/objectDetectionUtils';

interface DetectionResult {
  bbox: [number, number, number, number];
  class: string;
  score: number;
}

export const useObjectDetection = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const modelRef = useRef<any>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load the coco-ssd model
  const loadModel = async () => {
    try {
      setError(null);
      setIsModelLoaded(false);
      setLoadingStatus('Checking TensorFlow.js...');
      
      // Check if TensorFlow.js is available
      if (!tf) {
        throw new Error('TensorFlow.js is not available');
      }

      console.log('TensorFlow.js version:', tf.version.tfjs || 'Unknown');
      
      // Initialize TensorFlow.js backend
      setLoadingStatus('Initializing TensorFlow.js backend...');
      await tf.ready();
      console.log('TensorFlow.js backend:', tf.getBackend());
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Not in browser environment');
      }
      
      setLoadingStatus('Loading coco-ssd model...');
      console.log('Starting coco-ssd model load...');
      
      // Load the model with timeout
      const modelPromise = cocossd.load();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Model loading timeout (30s)')), 30000)
      );
      
      const net = await Promise.race([modelPromise, timeoutPromise]);
      
      if (!net) {
        throw new Error('Model failed to load');
      }
      
      console.log('Model loaded successfully:', net);
      modelRef.current = net;
      setIsModelLoaded(true);
      setLoadingStatus('Model ready');
      console.log('coco-ssd model loaded successfully');
    } catch (err: any) {
      console.error('Error loading coco-ssd model:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      const errorMessage = err.message || 'Failed to load object detection model';
      setError(errorMessage);
      setLoadingStatus('Failed to load model');
      setIsModelLoaded(false);
    }
  };

  // Start real-time detection
  const startDetection = (videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) => {
    if (!modelRef.current || !videoElement || !canvasElement) {
      console.error('Model, video, or canvas not available');
      setError('Model, video, or canvas not available');
      return;
    }

    setIsDetecting(true);
    setError(null);
    
    const detect = async () => {
      try {
        // Check if video is ready
        if (videoElement.readyState === 4) {
          // Get video properties
          const videoWidth = videoElement.videoWidth;
          const videoHeight = videoElement.videoHeight;

          // Set canvas dimensions
          canvasElement.width = videoWidth;
          canvasElement.height = videoHeight;

          // Make detections
          const predictions = await modelRef.current.detect(videoElement);
          
          // Update detections state
          setDetections(predictions);

          // Draw on canvas
          const ctx = canvasElement.getContext('2d');
          if (ctx) {
            // Clear canvas
            ctx.clearRect(0, 0, videoWidth, videoHeight);
            // Draw detections
            drawRect(predictions, ctx);
          }
        }
      } catch (err: any) {
        console.error('Detection error:', err);
        setError(`Detection failed: ${err.message}`);
        setIsDetecting(false);
      }
    };

    // Start detection loop
    detectionIntervalRef.current = setInterval(detect, 100); // 10 FPS
  };

  // Stop detection
  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  return {
    isModelLoaded,
    isDetecting,
    detections,
    error,
    loadingStatus,
    loadModel,
    startDetection,
    stopDetection,
  };
};
