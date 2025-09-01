
import React, { useRef, useState, useEffect } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useMediapipe } from "@/hooks/useMediaPipe";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hand, Eye, Activity, ToggleLeft } from "lucide-react";
import { useMetrics } from "@/context/MetricsContext";
import FuturisticTrackingOverlay from "./FuturisticTrackingOverlay";

interface EnhancedCameraProps {
  isInterviewActive?: boolean;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

const EnhancedCamera: React.FC<EnhancedCameraProps> = ({ 
  isInterviewActive = false,
  videoRef: externalVideoRef
}) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [overlayEnabled, setOverlayEnabled] = useState(true);
  const { updateMetrics } = useMetrics();

  useCamera(videoRef);

  const {
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
  } = useMediapipe(videoRef, canvasRef, overlayEnabled);

  // Update metrics context when values change
  useEffect(() => {
    const metricsData = {
      handPresence,
      facePresence,
      posePresence,
      handDetectionCounter,
      handDetectionDuration,
      notFacingCounter,
      notFacingDuration,
      badPostureDetectionCounter,
      badPostureDuration
    };
    updateMetrics(metricsData);
  }, [
    handPresence,
    facePresence,
    posePresence,
    handDetectionCounter,
    handDetectionDuration,
    notFacingCounter,
    notFacingDuration,
    badPostureDetectionCounter,
    badPostureDuration,
    updateMetrics
  ]);

  // For interview mode, show futuristic overlay
  if (isInterviewActive) {
    return (
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          width={600}
          height={480}
          className="absolute top-0 left-0 w-full h-full opacity-80 pointer-events-none"
          style={{ backgroundColor: "transparent" }}
        />
        <FuturisticTrackingOverlay
          metrics={{
            handPresence,
            facePresence,
            posePresence,
            eyeContact: !notFacingRef.current,
            posture: hasBadPostureRef.current ? 'poor' : 'good',
            confidence: Math.floor(75 + Math.random() * 20)
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-semibold">Observation</h2>
          <div className="flex items-center space-x-2 bg-slate-100 p-2 rounded-lg">
            <Switch
              id="overlay-toggle"
              checked={overlayEnabled}
              onCheckedChange={setOverlayEnabled}
            />
            <Label htmlFor="overlay-toggle" className="flex items-center gap-2">
              <span>{overlayEnabled ? "Overlay Enabled" : "Overlay Disabled"}</span>
            </Label>
          </div>
        </div>

        {/* Camera and Canvas Container */}
        <div className="flex justify-center w-full rounded-xl p-4">
          <div className="relative w-full max-w-[640px] aspect-[4/3]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg z-10"
              style={{ aspectRatio: '4/3', transform: 'scaleX(-1)' }}
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className={`absolute top-0 left-0 w-full h-full z-20 rounded-lg pointer-events-none ${
                overlayEnabled ? 'opacity-80' : 'opacity-0'
              }`}
              style={{ aspectRatio: '4/3', backgroundColor: "transparent", transform: 'scaleX(-1)' }}
            />
            {/* Real-time Status Indicators */}
            {overlayEnabled && (
              <div className="absolute top-4 left-4 z-30 space-y-2">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                  <span>Gestures: {handPresence ? 'Active' : 'Calm'}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                  <span>Eye Contact: {!notFacingRef.current ? 'Good' : 'Poor'}</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
                  <span>Posture: {!hasBadPostureRef.current ? 'Good' : 'Poor'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Hand Detection Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Hand className="h-5 w-5" />
                Hand Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={handPresence ? "destructive" : "default"}
                    className={handPresence ? "bg-red-500" : "bg-green-500"}
                  >
                    {handPresence ? "Detected" : "Not Detected"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Detection Count:</span>
                  <span className="font-medium">{handDetectionCounter}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Duration:</span>
                  <span className="font-medium">{handDetectionDuration.toFixed(2)} seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Face Detection Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Eye Contact Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={!notFacingRef.current ? "default" : "destructive"}
                    className={!notFacingRef.current ? "bg-green-500" : "bg-red-500"}
                  >
                    {!notFacingRef.current ? "Good Contact" : "Poor Contact"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Loss Count:</span>
                  <span className="font-medium">{notFacingCounter}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Looking Away:</span>
                  <span className="font-medium">{notFacingDuration.toFixed(2)} seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posture Detection Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Posture Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={!hasBadPostureRef.current ? "default" : "destructive"}
                    className={!hasBadPostureRef.current ? "bg-green-500" : "bg-red-500"}
                  >
                    {hasBadPostureRef.current ? "Poor Posture" : "Good Posture"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Poor Count:</span>
                  <span className="font-medium">{badPostureDetectionCounter}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Poor Duration:</span>
                  <span className="font-medium">{badPostureDuration.toFixed(2)} seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCamera;
