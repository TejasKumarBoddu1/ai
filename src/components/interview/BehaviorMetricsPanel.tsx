
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Hand, Eye, Activity, TrendingUp, CheckCircle, AlertCircle, Scan } from 'lucide-react';

interface MetricsData {
  handDetectionCounter: number;
  handDetectionDuration: number;
  notFacingCounter: number;
  notFacingDuration: number;
  badPostureDetectionCounter: number;
  badPostureDuration: number;
  handPresence: boolean;
  eyeContact: boolean;
  posture: 'good' | 'poor';
}

interface BehaviorMetricsPanelProps {
  metrics: MetricsData;
  confidenceScore: number;
  engagementScore: number;
  attentivenessScore: number;
  objectDetections?: any[];
}

const BehaviorMetricsPanel: React.FC<BehaviorMetricsPanelProps> = ({
  metrics,
  confidenceScore,
  engagementScore,
  attentivenessScore,
  objectDetections = []
}) => {
  const getStatusIcon = (isGood: boolean) => {
    return isGood ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getStatusBadge = (isGood: boolean, goodText: string, badText: string) => (
    <Badge variant={isGood ? "default" : "destructive"} className={isGood ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}>
      {isGood ? goodText : badText}
    </Badge>
  );

  return (
    <div className="space-y-4">
      {/* Performance Scores */}
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Live Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Confidence</span>
              <span className="font-semibold text-blue-600">{confidenceScore}%</span>
            </div>
            <Progress value={confidenceScore} className="h-2 bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Engagement</span>
              <span className="font-semibold text-emerald-600">{engagementScore}%</span>
            </div>
            <Progress value={engagementScore} className="h-2 bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Attentiveness</span>
              <span className="font-semibold text-purple-600">{attentivenessScore}%</span>
            </div>
            <Progress value={attentivenessScore} className="h-2 bg-slate-200" />
          </div>
        </CardContent>
      </Card>

      {/* Behavior Analysis */}
      <Card className="bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Behavior Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Hand Detection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hand className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-slate-800">Hand Positioning</span>
              </div>
              {getStatusIcon(!metrics.handPresence)}
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Status:</span>
                {getStatusBadge(!metrics.handPresence, "Optimal", "Distracting")}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Detections:</span>
                  <span className="font-medium">{metrics.handDetectionCounter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Duration:</span>
                  <span className="font-medium">{metrics.handDetectionDuration.toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Eye Contact */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-slate-800">Eye Contact</span>
              </div>
              {getStatusIcon(metrics.eyeContact)}
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Status:</span>
                {getStatusBadge(metrics.eyeContact, "Excellent", "Needs Improvement")}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Breaks:</span>
                  <span className="font-medium">{metrics.notFacingCounter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Away Time:</span>
                  <span className="font-medium">{metrics.notFacingDuration.toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posture */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-600" />
                <span className="font-medium text-slate-800">Posture Quality</span>
              </div>
              {getStatusIcon(metrics.posture === 'good')}
            </div>
            <div className="ml-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Status:</span>
                {getStatusBadge(metrics.posture === 'good', "Professional", "Slouching")}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Poor Count:</span>
                  <span className="font-medium">{metrics.badPostureDetectionCounter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Poor Duration:</span>
                  <span className="font-medium">{metrics.badPostureDuration.toFixed(1)}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Object Detection */}
          {objectDetections.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scan className="h-4 w-4 text-slate-600" />
                  <span className="font-medium text-slate-800">Environment Objects</span>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  {objectDetections.length} detected
                </Badge>
              </div>
              <div className="ml-6 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {objectDetections.map((detection, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {detection.class} ({Math.round(detection.score * 100)}%)
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviorMetricsPanel;
