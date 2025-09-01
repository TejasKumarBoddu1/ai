
import React from 'react';

interface TrackingMetrics {
  handPresence: boolean;
  facePresence: boolean;
  posePresence: boolean;
  eyeContact: boolean;
  posture: 'good' | 'poor';
  confidence: number;
}

interface CleanTrackingOverlayProps {
  metrics: TrackingMetrics;
}

const CleanTrackingOverlay: React.FC<CleanTrackingOverlayProps> = ({ metrics }) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Simple status indicators - minimal and clean */}
      <div className="absolute top-2 right-2 space-y-1">
        {/* Face detection indicator */}
        {metrics.facePresence && (
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${metrics.eyeContact ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            {metrics.eyeContact ? 'Good Eye Contact' : 'Look at Camera'}
          </div>
        )}
        
        {/* Posture indicator */}
        <div className="bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${metrics.posture === 'good' ? 'bg-green-400' : 'bg-orange-400'}`}></div>
          {metrics.posture === 'good' ? 'Good Posture' : 'Sit Straight'}
        </div>
      </div>
      
      {/* Minimal frame indicator - just a subtle border when face is detected */}
      {metrics.facePresence && (
        <div className="absolute inset-4 border border-white/20 rounded-lg"></div>
      )}
    </div>
  );
};

export default CleanTrackingOverlay;
