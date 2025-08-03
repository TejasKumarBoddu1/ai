
import React from 'react';
import { EmotionState } from '@/utils/mediapipe/emotionDetection';

interface EmotionDetectionOverlayProps {
  emotionState: EmotionState;
  violations: {
    phoneCount: number;
    peopleCount: number;
  };
}

const EmotionDetectionOverlay: React.FC<EmotionDetectionOverlayProps> = ({
  emotionState,
  violations
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Emotion Display */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emotionState.icon}</span>
          <div className="text-sm">
            <div className="font-medium capitalize">{emotionState.dominant}</div>
            <div className="text-xs text-muted-foreground">
              {Math.round(emotionState.confidence * 100)}% confidence
            </div>
          </div>
        </div>
      </div>

      {/* Violation Warnings */}
      {(violations.phoneCount > 0 || violations.peopleCount > 0) && (
        <div className="absolute top-3 left-3 space-y-2">
          {violations.phoneCount > 0 && (
            <div className="bg-red-500/90 text-white rounded-lg px-3 py-2 text-sm font-medium">
              📱 Phone detected: ⚠️ {violations.phoneCount} / 3
            </div>
          )}
          {violations.peopleCount > 0 && (
            <div className="bg-orange-500/90 text-white rounded-lg px-3 py-2 text-sm font-medium">
              👥 Person in background: ⚠️ {violations.peopleCount}
            </div>
          )}
        </div>
      )}

      {/* Face Detection Box */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-64 h-64 border-2 border-blue-400/50 rounded-lg flex items-center justify-center">
          <div className="text-4xl">{emotionState.icon}</div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetectionOverlay;
