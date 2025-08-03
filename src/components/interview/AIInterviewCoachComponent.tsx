
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        {/* Enhanced Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          
          <div className="relative container mx-auto px-6 py-16">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl scale-150"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-8 border border-white/20 shadow-2xl">
                    <Bot className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                AI Interview Coach
              </h1>
              
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
                Practice with our advanced AI interviewer powered by enhanced speech recognition, 
                real-time analytics, and intelligent feedback systems.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Headphones className="h-8 w-8 text-white mx-auto mb-3" />
                  <p className="text-white text-sm font-semibold">Enhanced Speech Recognition</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-white mx-auto mb-3" />
                  <p className="text-white text-sm font-semibold">Real-time Analytics</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Brain className="h-8 w-8 text-white mx-auto mb-3" />
                  <p className="text-white text-sm font-semibold">AI-Powered Questions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <Sparkles className="h-8 w-8 text-white mx-auto mb-3" />
                  <p className="text-white text-sm font-semibold">Smart Feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Component */}
        <div className="container mx-auto px-6 py-12">
          <Card className="bg-white/70 backdrop-blur-sm border border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Interview Coach - Enhanced Mode
                </CardTitle>
              </div>
              <CardDescription className="text-lg text-slate-600 max-w-2xl mx-auto">
                Complete interview experience with enhanced speech recognition, real-time analytics, and intelligent feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-b-xl">
                <IntegratedAIInterviewWithTracking />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MetricsProvider>
  );
};

export default AIInterviewCoachComponent;
