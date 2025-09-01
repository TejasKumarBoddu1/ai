import React, { useRef, useEffect, useState } from 'react';
import { useObjectDetection } from '../../hooks/useObjectDetection';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Camera, Square, Play, RefreshCw } from 'lucide-react';

interface ObjectDetectionCameraProps {
  onDetectionChange?: (detections: any[]) => void;
}

export const ObjectDetectionCamera: React.FC<ObjectDetectionCameraProps> = ({
  onDetectionChange
}) => {
  console.log('ObjectDetectionCamera component rendering...');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasError, setHasError] = useState(false);

  const {
    isModelLoaded,
    isDetecting,
    detections,
    error,
    loadingStatus,
    loadModel,
    startDetection,
    stopDetection,
  } = useObjectDetection();

  // Load model on component mount
  useEffect(() => {
    console.log('ObjectDetectionCamera useEffect running...');
    try {
      loadModel();
    } catch (err) {
      console.error('Error in ObjectDetectionCamera:', err);
      setHasError(true);
    }
  }, [loadModel]);

  // Notify parent component of detection changes
  useEffect(() => {
    if (onDetectionChange) {
      onDetectionChange(detections);
    }
  }, [detections, onDetectionChange]);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    stopDetection();
  };

  // Start object detection
  const handleStartDetection = () => {
    if (videoRef.current && canvasRef.current && isModelLoaded) {
      startDetection(videoRef.current, canvasRef.current);
    }
  };

  // Stop object detection
  const handleStopDetection = () => {
    stopDetection();
  };

  // Retry model loading
  const handleRetryModel = () => {
    setHasError(false);
    loadModel();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // If there's a critical error, show a simple fallback
  if (hasError) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Object Detection (Unavailable)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Object detection is currently unavailable. You can still use the interview features.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Real-time Object Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetryModel}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Model Loading Status */}
        <div className="flex items-center gap-2">
          <Badge variant={isModelLoaded ? "default" : "secondary"}>
            {isModelLoaded ? "Model Ready" : loadingStatus}
          </Badge>
          {!isModelLoaded && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        {/* Camera Controls */}
        <div className="flex gap-2">
          {!isCameraActive ? (
            <Button onClick={startCamera} disabled={!isModelLoaded}>
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <Button onClick={stopCamera} variant="destructive">
              <Square className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}

          {isCameraActive && (
            <>
              {!isDetecting ? (
                <Button onClick={handleStartDetection} disabled={!isModelLoaded}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Detection
                </Button>
              ) : (
                <Button onClick={handleStopDetection} variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Detection
                </Button>
              )}
            </>
          )}
        </div>

        {/* Detection Status */}
        {isDetecting && (
          <div className="flex items-center gap-2">
            <Badge variant="default">
              Detecting Objects ({detections.length} found)
            </Badge>
          </div>
        )}

        {/* Video and Canvas Container */}
        <div className="relative w-full max-w-md mx-auto">
          {isCameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-auto rounded-lg"
                style={{ maxWidth: '100%', transform: 'scaleX(-1)' }}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full rounded-lg pointer-events-none"
                style={{ maxWidth: '100%', transform: 'scaleX(-1)' }}
              />
            </>
          ) : (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                <p>Camera not active</p>
                <p className="text-sm">Click "Start Camera" to begin</p>
              </div>
            </div>
          )}
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

export default ObjectDetectionCamera; 