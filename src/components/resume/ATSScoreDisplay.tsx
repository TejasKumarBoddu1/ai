
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, AlertCircle, Target, FileText, Key, Layout } from "lucide-react";
import { ATSScoreData } from "@/utils/atsScoreApi";
import * as THREE from "three";

export interface ATSScoreDisplayProps {
  scoreData: ATSScoreData | null;
  isLoading: boolean;
}

// 3D Speedometer for the ATS score
const ATSScoreGauge = ({ score }: { score: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(200, 200);
    
    // Create the gauge background
    const gaugeGeometry = new THREE.RingGeometry(0.6, 0.8, 64);
    const gaugeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1a365d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const gauge = new THREE.Mesh(gaugeGeometry, gaugeMaterial);
    scene.add(gauge);
    
    // Create the gauge progress indicator
    const scoreRatio = score / 100;
    const progressGeometry = new THREE.RingGeometry(0.6, 0.8, 64, 1, 0, scoreRatio * Math.PI * 2);
    
    // Determine color based on score
    let color;
    if (score >= 80) color = 0x0077FF; // Blue
    else if (score >= 60) color = 0x00CCBC; // Teal
    else color = 0x8B5CF6; // Purple
    
    const progressMaterial = new THREE.MeshBasicMaterial({ 
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const progress = new THREE.Mesh(progressGeometry, progressMaterial);
    scene.add(progress);
    
    // Add needle
    const needleGeometry = new THREE.BoxGeometry(0.05, 0.6, 0.01);
    const needleMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.9
    });
    const needle = new THREE.Mesh(needleGeometry, needleMaterial);
    needle.position.y = 0.2;
    scene.add(needle);
    
    // Animate the needle to point to the score
    const targetRotation = -Math.PI / 2 + (scoreRatio * Math.PI);
    let currentRotation = -Math.PI / 2;
    
    // Add tick marks around the gauge
    for (let i = 0; i <= 5; i++) {
      const tickGeometry = new THREE.BoxGeometry(0.02, 0.1, 0.01);
      const tickMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.7
      });
      const tick = new THREE.Mesh(tickGeometry, tickMaterial);
      const angle = -Math.PI / 2 + (i / 5) * Math.PI;
      const radius = 0.9;
      tick.position.x = radius * Math.cos(angle);
      tick.position.y = radius * Math.sin(angle);
      tick.rotation.z = angle + Math.PI/2;
      scene.add(tick);
    }
    
    // Position camera
    camera.position.z = 2;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Smoothly animate needle rotation
      const rotationDiff = targetRotation - currentRotation;
      currentRotation += rotationDiff * 0.05;
      
      needle.rotation.z = currentRotation;
      gauge.rotation.z = -Math.PI / 2;
      progress.rotation.z = -Math.PI / 2;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup on unmount
    return () => {
      renderer.dispose();
    };
  }, [score]);
  
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[200px] h-[200px]">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <span className="block text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-modern-blue-500 to-soft-purple font-sf-pro">{score}</span>
            <span className="text-gray-400 text-sm font-poppins">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ATSScoreDisplay = ({ scoreData, isLoading }: ATSScoreDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="border shadow-sm h-full glassmorphism">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-modern-blue-800">
            <Target className="mr-2 h-5 w-5 text-modern-blue-500" />
            ATS Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-modern-blue-500 border-t-transparent animate-spin"></div>
            <p className="text-muted-foreground font-poppins">Analyzing your resume...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scoreData) {
    return (
      <Card className="border shadow-sm h-full glassmorphism">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-modern-blue-800">
            <Target className="mr-2 h-5 w-5 text-modern-blue-500" />
            ATS Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground font-poppins">Complete your resume to see ATS analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-modern-blue-500";
    if (score >= 60) return "text-cyan-500";
    return "text-soft-purple";
  };

  const getProgressProps = (score: number) => {
    if (score >= 80) return { 
      style: { '--progress-start': '#0077FF', '--progress-end': '#38BDF8' } as React.CSSProperties
    };
    if (score >= 60) return { 
      style: { '--progress-start': '#00CCBC', '--progress-end': '#4FD1C5' } as React.CSSProperties
    };
    return { 
      style: { '--progress-start': '#8B5CF6', '--progress-end': '#A78BFA' } as React.CSSProperties
    };
  };

  return (
    <Card className="border shadow-sm h-full glassmorphism transition-all duration-300 hover:shadow-xl">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-modern-blue-800">
          <Target className="mr-2 h-5 w-5 text-modern-blue-500" />
          ATS Score Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col space-y-6">
            {/* 3D Speedometer */}
            <ATSScoreGauge score={scoreData.overallScore} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center font-poppins">
                    <Key className="h-3 w-3 mr-1 text-modern-blue-500" /> Keywords
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(scoreData.keywordScore)} font-poppins`}>
                    {scoreData.keywordScore}%
                  </span>
                </div>
                <Progress value={scoreData.keywordScore} className="h-1.5" {...getProgressProps(scoreData.keywordScore)} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center font-poppins">
                    <Layout className="h-3 w-3 mr-1 text-soft-purple" /> Format
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(scoreData.formatScore)} font-poppins`}>
                    {scoreData.formatScore}%
                  </span>
                </div>
                <Progress value={scoreData.formatScore} className="h-1.5" {...getProgressProps(scoreData.formatScore)} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs flex items-center font-poppins">
                    <FileText className="h-3 w-3 mr-1 text-cyan-500" /> Content
                  </span>
                  <span className={`text-sm font-semibold ${getScoreColor(scoreData.contentScore)} font-poppins`}>
                    {scoreData.contentScore}%
                  </span>
                </div>
                <Progress value={scoreData.contentScore} className="h-1.5" {...getProgressProps(scoreData.contentScore)} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-modern-blue-800 flex items-center font-sf-pro">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            Improvement Suggestions:
          </h3>
          <ul className="space-y-2">
            {scoreData.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm flex items-start gap-2 glassmorphism p-3 rounded-lg transition-transform duration-300 hover:scale-102 transform">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 font-poppins">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-modern-blue-800 flex items-center font-sf-pro">
            <Check className="h-4 w-4 text-green-500 mr-2" />
            Best Job Match:
          </h3>
          <div className="glassmorphism p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-poppins">{scoreData.jobMatch}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
