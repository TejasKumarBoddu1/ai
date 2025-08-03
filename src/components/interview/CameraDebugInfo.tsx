
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraDebugInfoProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const CameraDebugInfo: React.FC<CameraDebugInfoProps> = ({ videoRef }) => {
  const [cameraStatus, setCameraStatus] = useState<{
    hasUserMedia: boolean;
    videoReady: boolean;
    streamActive: boolean;
    isPlaying: boolean;
    dimensions: string;
    error: string | null;
  }>({
    hasUserMedia: false,
    videoReady: false,
    streamActive: false,
    isPlaying: false,
    dimensions: '',
    error: null
  });

  const checkCameraStatus = () => {
    const video = videoRef.current;
    if (!video) {
      setCameraStatus(prev => ({ ...prev, error: 'Video element not found' }));
      return;
    }

    const hasStream = !!video.srcObject;
    const isReady = video.readyState >= 2;
    const isPlaying = !video.paused && !video.ended && video.readyState > 2;
    const stream = video.srcObject as MediaStream;
    const isActive = stream ? stream.active && stream.getTracks().some(track => track.readyState === 'live') : false;
    const dimensions = video.videoWidth && video.videoHeight ? `${video.videoWidth}x${video.videoHeight}` : 'Unknown';

    setCameraStatus({
      hasUserMedia: hasStream,
      videoReady: isReady,
      streamActive: isActive,
      isPlaying: isPlaying,
      dimensions: dimensions,
      error: null
    });
  };

  useEffect(() => {
    // Check status immediately and then every second
    checkCameraStatus();
    const interval = setInterval(checkCameraStatus, 1000);

    return () => clearInterval(interval);
  }, [videoRef]);

  const refreshCamera = async () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
    
    // Trigger camera restart by reloading the page
    window.location.reload();
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Camera className="h-4 w-4" />
          Camera Diagnostics
          <Button variant="outline" size="sm" onClick={refreshCamera} className="ml-auto">
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Stream Available:</span>
          <Badge variant={cameraStatus.hasUserMedia ? "default" : "destructive"}>
            {cameraStatus.hasUserMedia ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {cameraStatus.hasUserMedia ? 'Yes' : 'No'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Video Ready:</span>
          <Badge variant={cameraStatus.videoReady ? "default" : "secondary"}>
            {cameraStatus.videoReady ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {cameraStatus.videoReady ? 'Yes' : 'No'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Stream Active:</span>
          <Badge variant={cameraStatus.streamActive ? "default" : "destructive"}>
            {cameraStatus.streamActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {cameraStatus.streamActive ? 'Yes' : 'No'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Playing:</span>
          <Badge variant={cameraStatus.isPlaying ? "default" : "secondary"}>
            {cameraStatus.isPlaying ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
            {cameraStatus.isPlaying ? 'Yes' : 'No'}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Dimensions:</span>
          <span className="text-xs font-mono">{cameraStatus.dimensions}</span>
        </div>

        {cameraStatus.error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            Error: {cameraStatus.error}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2 p-2 bg-slate-50 rounded">
          <div>💡 Troubleshooting:</div>
          <div>• Allow camera permissions when prompted</div>
          <div>• Ensure no other apps are using the camera</div>
          <div>• Try refreshing the page</div>
          <div>• Check browser console for detailed errors</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraDebugInfo;
