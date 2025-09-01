import * as cocossd from '@tensorflow-models/coco-ssd';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Camera, Scan } from 'lucide-react';
import { drawRect } from '../../utils/objectDetectionUtils';

interface AutoObjectDetectionCameraProps {
  onDetectionChange?: (detections: any[]) => void;
  embedded?: boolean; // when true, render minimal view without Card/header/status
}

export const AutoObjectDetectionCamera: React.FC<AutoObjectDetectionCameraProps> = ({
  onDetectionChange,
  embedded = false
}) => {
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [model, setModel] = useState<any>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Loading model...');
  const [detections, setDetections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const detectIntervalRef = useRef<number | null>(null);

  // Load model
  const runCoco = async () => {
    try {
      setLoadingStatus('Loading model...');
      const net = await cocossd.load({ base: 'lite_mobilenet_v2' });
      setModel(net);
      setIsModelLoaded(true);
      setLoadingStatus('Detection Ready');
    } catch (e: any) {
      console.error(e);
      setError('Failed to load object detection model.');
      setLoadingStatus('Failed to load');
    }
  };

  const detect = async (net: any) => {
    try {
      if (
        typeof webcamRef.current !== 'undefined' &&
        webcamRef.current !== null &&
        webcamRef.current.readyState === 4
      ) {
        const video = webcamRef.current;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (canvasRef.current) {
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
        }

        const predictions = await net.detect(video);
        setDetections(predictions);
        if (onDetectionChange) onDetectionChange(predictions);

        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, videoWidth, videoHeight);
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
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
      });
      if (webcamRef.current) {
        webcamRef.current.srcObject = mediaStream as any;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please check permissions.');
    }
  };

  // Initialize
  useEffect(() => {
    runCoco();
    startCamera();
  }, []);

  // Loop detection
  useEffect(() => {
    if (isModelLoaded && model && !detectIntervalRef.current) {
      setIsDetecting(true);
      const id = window.setInterval(() => detect(model), 100);
      detectIntervalRef.current = id;
    }
    return () => {
      if (detectIntervalRef.current) {
        clearInterval(detectIntervalRef.current);
        detectIntervalRef.current = null;
      }
    };
  }, [isModelLoaded, model]);

  // Embedded minimal view (no card, no status)
  if (embedded) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
          style={{ objectFit: 'cover', transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-lg pointer-events-none"
          style={{ objectFit: 'cover', transform: 'scaleX(-1)' }}
        />
      </div>
    );
  }

  // Standalone card view (original)
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Object Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <Badge variant={isModelLoaded ? 'default' : 'secondary'}>
            {isModelLoaded ? 'Detection Ready' : loadingStatus}
          </Badge>
          {!isModelLoaded && <Loader2 className="h-4 w-4 animate-spin" />}
          {isDetecting && <Scan className="h-4 w-4 animate-pulse" />}
        </div>

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