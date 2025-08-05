
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Brain, BarChart3, Headphones, Target, Sparkles, Zap } from "lucide-react";
import IntegratedAIInterviewWithTracking from './IntegratedAIInterviewWithTracking';
import { MetricsProvider } from '@/context/MetricsContext';

const AIInterviewCoachComponent: React.FC = () => {
  // Check Face-API.js availability
  useEffect(() => {
    const checkFaceAPI = async () => {
      try {
        // Check if Face-API is loaded
        if ((window as any).faceapi) {
          console.log('Face-API.js is available');
          
          // Preload models
          try {
            const faceapi = (window as any).faceapi;
            console.log('Preloading Face-API models...');
            await Promise.all([
              faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
              faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
              faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
              faceapi.nets.faceExpressionNet.loadFromUri('/models'),
              faceapi.nets.ageGenderNet.loadFromUri('/models'),
            ]);
            console.log('Face-API models preloaded successfully');
          } catch (modelError) {
            console.error('Error preloading Face-API models:', modelError);
          }
        } else {
          console.error('Face-API.js not found! Emotion detection will not work.');
        }
      } catch (error) {
        console.error('Error checking Face-API.js:', error);
      }
    };

    checkFaceAPI();
  }, []);

  return (
    <MetricsProvider>
      <IntegratedAIInterviewWithTracking />
    </MetricsProvider>
  );
};

export default AIInterviewCoachComponent;
