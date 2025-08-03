import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Camera, Scan } from 'lucide-react';
import { drawRect } from '../../utils/objectDetectionUtils';

interface AutoObjectDetectionCameraProps {
  onDetectionChange?: (detections: any[]) => void;
}

export const AutoObjectDetectionCamera: React.FC<AutoObjectDetectionCameraProps> = ({
  onDetectionChange
}) => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<string>('Initializing...');
  const modelRef = useRef<any>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Main function to run object detection
  const runCoco = async () => {
    try {
      setLoadingStatus('Loading TensorFlow.js...');
      console.log('Loading TensorFlow.js...');
      
      // Initialize TensorFlow.js
      await tf.ready();
      console.log('TensorFlow.js backend:', tf.getBackend());
      
      setLoadingStatus('Loading coco-ssd model...');
      console.log('Loading coco-ssd model...');
      
      // Load the coco-ssd model
      const net = await cocossd.load();
      modelRef.current = net;
      setIsModelLoaded(true);
      setLoadingStatus('Model ready');
      console.log('coco-ssd model loaded successfully');

      // Start detection loop
      setIsDetecting(true);
      detectionIntervalRef.current = setInterval(() => {
        detect(net);
      }, 100); // 10 FPS

    } catch (err: any) {
      console.error('Error in runCoco:', err);
      setError(err.message || 'Failed to initialize object detection');
      setLoadingStatus('Failed to load');
    }
  };

  const detect = async (net: any) => {
    try {
      // Check if video is available and ready
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.readyState === 4
      ) {
        // Get Video Properties
        const video = webcamRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        // Set canvas dimensions
        if (canvasRef.current) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }

        // Make detections
        const predictions = await net.detect(video);
        
        // Update detections state
        setDetections(predictions);
        
        // Notify parent component
        if (onDetectionChange) {
          onDetectionChange(predictions);
        }

        // Draw detections on canvas
        const ctx = canvasRef.current?.getContext('2d');
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
    }
  };

  // Start camera automatically
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = mediaStream;
        console.log('Camera started successfully');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please check permissions.');
    }
  };

  // Initialize everything on component mount
  useEffect(() => {
    console.log('AutoObjectDetectionCamera mounting...');
    
    // Start camera first
    startCamera();
    
    // Then start object detection
    runCoco();

    // Cleanup on unmount
    return () => {
      console.log('AutoObjectDetectionCamera unmounting...');
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (webcamRef.current?.srcObject) {
        const stream = webcamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Auto Object Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Status */}
        <div className="flex items-center gap-2">
          <Badge variant={isModelLoaded ? "default" : "secondary"}>
            {isModelLoaded ? "Detection Active" : loadingStatus}
          </Badge>
          {!isModelLoaded && <Loader2 className="h-4 w-4 animate-spin" />}
          {isDetecting && <Scan className="h-4 w-4 animate-pulse" />}
        </div>

        {/* Video and Canvas Container */}
        <div className="relative w-full max-w-md mx-auto">
          <video
            ref={webcamRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto rounded-lg"
            style={{ maxWidth: '100%' }}
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
            style={{ maxWidth: '100%' }}
          />
        </div>

        {/* Detection Results */}
        {detections.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Detected Objects:</h4>
            <div className="flex flex-wrap gap-2">
              {detections.map((detection, index) => (
                <Badge key={index} variant="outline">
                  {detection.class} ({Math.round(detection.score * 100)}%)
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutoObjectDetectionCamera; 