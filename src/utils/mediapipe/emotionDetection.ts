
import { FaceLandmarker } from "@mediapipe/tasks-vision";

export interface EmotionScores {
  happy: number;
  sad: number;
  surprised: number;
  neutral: number;
  disgust: number;
  angry: number;
  fearful: number;
}

export interface EmotionState {
  dominant: string;
  confidence: number;
  scores: EmotionScores;
  icon: string;
}

// Map blendshape coefficients to emotions
export const detectEmotion = (blendShapes: any[]): EmotionState => {
  if (!blendShapes || blendShapes.length === 0) {
    return {
      dominant: 'neutral',
      confidence: 0,
      scores: {
        happy: 0,
        sad: 0,
        surprised: 0,
        neutral: 1,
        disgust: 0,
        angry: 0,
        fearful: 0
      },
      icon: '😐'
    };
  }

  const shapes = blendShapes[0];
  const categories = shapes.categories || [];
  
  // Extract relevant blendshape scores
  const getScore = (name: string) => {
    const category = categories.find((c: any) => c.categoryName === name);
    return category ? category.score : 0;
  };

  const scores: EmotionScores = {
    happy: Math.max(
      getScore('mouthSmileLeft'),
      getScore('mouthSmileRight'),
      getScore('cheekSquintLeft'),
      getScore('cheekSquintRight')
    ),
    sad: Math.max(
      getScore('mouthFrownLeft'),
      getScore('mouthFrownRight'),
      getScore('mouthSadLeft'),
      getScore('mouthSadRight')
    ),
    surprised: Math.max(
      getScore('eyeWideLeft'),
      getScore('eyeWideRight'),
      getScore('jawOpen'),
      getScore('mouthFunnel')
    ),
    angry: Math.max(
      getScore('browDownLeft'),
      getScore('browDownRight'),
      getScore('mouthPressLeft'),
      getScore('mouthPressRight')
    ),
    disgust: Math.max(
      getScore('noseSneerLeft'),
      getScore('noseSneerRight'),
      getScore('mouthUpperUpLeft'),
      getScore('mouthUpperUpRight')
    ),
    fearful: Math.max(
      getScore('eyeSquintLeft'),
      getScore('eyeSquintRight'),
      getScore('mouthStretchLeft'),
      getScore('mouthStretchRight')
    ),
    neutral: 1 - Math.max(
      getScore('mouthSmileLeft'),
      getScore('mouthFrownLeft'),
      getScore('eyeWideLeft'),
      getScore('browDownLeft')
    )
  };

  // Find dominant emotion
  const emotionEntries = Object.entries(scores);
  const [dominantEmotion, confidence] = emotionEntries.reduce((max, current) => 
    current[1] > max[1] ? current : max
  );

  const emotionIcons: Record<string, string> = {
    happy: '🙂',
    sad: '😢',
    surprised: '😮',
    angry: '😡',
    disgust: '🤢',
    fearful: '😨',
    neutral: '😐'
  };

  return {
    dominant: dominantEmotion,
    confidence,
    scores,
    icon: emotionIcons[dominantEmotion] || '😐'
  };
};

export const getEmotionFeedback = (emotionState: EmotionState): string | null => {
  const { dominant, confidence } = emotionState;
  
  if (confidence < 0.3) return null; // Not confident enough
  
  switch (dominant) {
    case 'sad':
      return "You seem uncomfortable. Take a moment to think if needed.";
    case 'angry':
      return "Take a deep breath. Stay calm and composed.";
    case 'fearful':
      return "It's normal to feel nervous. You're doing great.";
    case 'surprised':
      return "Take your time to process the question.";
    case 'happy':
      return "I see confidence, great going!";
    default:
      return null;
  }
};
