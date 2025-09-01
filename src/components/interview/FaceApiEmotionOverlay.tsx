import React from 'react';
import { FaceApiEmotionState } from '@/hooks/useFaceApiEmotionDetection';

interface FaceApiEmotionOverlayProps {
  emotionState: FaceApiEmotionState;
}

const FaceApiEmotionOverlay: React.FC<FaceApiEmotionOverlayProps> = ({
  emotionState
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

      {/* Face Detection Box */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-green-400 rounded-lg bg-green-400/10">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            Face Detected
          </div>
        </div>
      </div>

      {/* Emotion Scores Bar Chart */}
      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-3 w-64">
        <h4 className="text-sm font-medium mb-2">Emotion Analysis</h4>
        <div className="space-y-1.5">
          {Object.entries(emotionState.scores).map(([emotion, score]) => (
            <div key={emotion} className="grid grid-cols-6 items-center gap-2">
              <span className="text-xs font-medium capitalize col-span-2">{emotion}</span>
              <div className="col-span-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className={`h-full ${getEmotionColor(emotion)}`} 
                  style={{ width: `${Math.round(score * 100)}%` }}
                />
              </div>
              <span className="text-xs text-right">{Math.round(score * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to get color for each emotion
const getEmotionColor = (emotion: string): string => {
  switch (emotion) {
    case 'happy':
      return 'bg-green-500';
    case 'sad':
      return 'bg-blue-500';
    case 'surprised':
      return 'bg-yellow-500';
    case 'neutral':
      return 'bg-gray-500';
    case 'disgusted':
      return 'bg-purple-500';
    case 'angry':
      return 'bg-red-500';
    case 'fearful':
      return 'bg-orange-500';
    default:
      return 'bg-slate-500';
  }
};

export default FaceApiEmotionOverlay; 