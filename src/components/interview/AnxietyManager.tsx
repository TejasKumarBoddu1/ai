
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Zap, Volume2, VolumeX } from "lucide-react";

interface AnxietyManagerProps {
  currentStressLevel?: number;
  onStressReduced?: () => void;
}

const AnxietyManager: React.FC<AnxietyManagerProps> = ({ 
  currentStressLevel = 0, 
  onStressReduced 
}) => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  const [playAudio, setPlayAudio] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathingCount(prev => {
          const newCount = prev + 1;
          
          // 4-7-8 breathing pattern
          if (newCount <= 4) {
            setBreathingPhase('inhale');
          } else if (newCount <= 11) {
            setBreathingPhase('hold');
          } else if (newCount <= 19) {
            setBreathingPhase('exhale');
          } else {
            setBreathingCount(0);
            setBreathingPhase('inhale');
          }
          
          return newCount > 19 ? 0 : newCount;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [breathingActive]);

  const startBreathingExercise = () => {
    setBreathingActive(true);
    setBreathingCount(0);
    setBreathingPhase('inhale');
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    setBreathingCount(0);
    onStressReduced?.();
  };

  const getBreathingInstruction = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold your breath...';
      case 'exhale':
        return 'Breathe out slowly...';
    }
  };

  const getBreathingProgress = () => {
    if (breathingPhase === 'inhale') return (breathingCount / 4) * 100;
    if (breathingPhase === 'hold') return ((breathingCount - 4) / 7) * 100;
    return ((breathingCount - 11) / 8) * 100;
  };

  const calmingTechniques = [
    {
      title: "Power Pose",
      description: "Stand tall, hands on hips, chin up for 2 minutes",
      duration: "2 min",
      icon: "💪"
    },
    {
      title: "Positive Visualization",
      description: "Imagine yourself succeeding in the interview",
      duration: "3 min",
      icon: "✨"
    },
    {
      title: "Quick Meditation",
      description: "Focus on your breath and clear your mind",
      duration: "5 min",
      icon: "🧘"
    },
    {
      title: "Affirmations",
      description: "Repeat positive statements about your abilities",
      duration: "2 min",
      icon: "🗣️"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stress Level Indicator */}
      {currentStressLevel > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Stress Level Detected
            </CardTitle>
            <CardDescription>
              Let's take a moment to calm your nerves before continuing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current stress level</span>
                <span>{currentStressLevel}%</span>
              </div>
              <Progress 
                value={currentStressLevel} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Breathing Exercise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            4-7-8 Breathing Exercise
          </CardTitle>
          <CardDescription>
            A proven technique to reduce anxiety and center yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {breathingActive ? (
              <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                  <div 
                    className={`absolute inset-0 rounded-full border-4 transition-all duration-1000 ${
                      breathingPhase === 'inhale' ? 'border-blue-500 scale-110' :
                      breathingPhase === 'hold' ? 'border-yellow-500 scale-100' :
                      'border-green-500 scale-90'
                    }`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {breathingPhase === 'inhale' ? breathingCount + 1 : 
                       breathingPhase === 'hold' ? breathingCount - 3 :
                       breathingCount - 10}
                    </span>
                  </div>
                </div>
                
                <div>
                  <p className="text-lg font-medium">{getBreathingInstruction()}</p>
                  <Progress value={getBreathingProgress()} className="mt-2" />
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setPlayAudio(!playAudio)}
                  >
                    {playAudio ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    Sounds
                  </Button>
                  <Button variant="outline" onClick={stopBreathingExercise}>
                    Stop Exercise
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
                </p>
                <Button onClick={startBreathingExercise}>
                  Start Breathing Exercise
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Calming Techniques */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Calming Techniques</CardTitle>
          <CardDescription>
            Choose a technique to help you feel more confident and relaxed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calmingTechniques.map((technique, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{technique.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">{technique.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {technique.description}
                    </p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {technique.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pre-Interview Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-Interview Confidence Boost</CardTitle>
          <CardDescription>
            Complete these quick checks before starting your interview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "Take 3 deep breaths",
              "Sit up straight with good posture",
              "Smile and practice positive body language",
              "Review your key achievements",
              "Remember: they want you to succeed"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnxietyManager;
