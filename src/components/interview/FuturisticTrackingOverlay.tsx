
import React from 'react';

interface TrackingMetrics {
  handPresence: boolean;
  facePresence: boolean;
  posePresence: boolean;
  eyeContact: boolean;
  posture: 'good' | 'poor';
  confidence: number;
}

interface FuturisticTrackingOverlayProps {
  metrics: TrackingMetrics;
  className?: string;
}

const FuturisticTrackingOverlay: React.FC<FuturisticTrackingOverlayProps> = ({ 
  metrics, 
  className = "" 
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none z-30 ${className}`}>
      {/* Minimal Status Indicators */}
      <div className="absolute top-4 left-4 space-y-1">
        <div className={`w-2 h-2 rounded-full ${metrics.facePresence ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <div className={`w-2 h-2 rounded-full ${metrics.eyeContact ? 'bg-green-400' : 'bg-orange-400'}`}></div>
        <div className={`w-2 h-2 rounded-full ${metrics.posture === 'good' ? 'bg-green-400' : 'bg-red-400'}`}></div>
      </div>
      
      {/* Minimal frame indicator when face is detected */}
      {metrics.facePresence && (
        <div className="absolute inset-4 border border-white/20 rounded-lg"></div>
      )}
    </div>
  );
};

export default FuturisticTrackingOverlay;
