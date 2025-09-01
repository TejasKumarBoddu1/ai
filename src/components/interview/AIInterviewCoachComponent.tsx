
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
        const w: any = window as any;
        if (w.faceapi) {
          console.log('Face-API.js is available');
          
          // Prevent double preloading across components/pages
          if (!w.__faceModelsPreloaded) {
            try {
              const faceapi = w.faceapi;
              console.log('Preloading Face-API models (once)...');
              await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/face-api/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/face-api/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/face-api/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/face-api/models'),
                faceapi.nets.ageGenderNet.loadFromUri('/face-api/models'),
              ]);
              w.__faceModelsPreloaded = true;
              console.log('Face-API models preloaded successfully');
            } catch (modelError) {
              console.error('Error preloading Face-API models:', modelError);
            }
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
