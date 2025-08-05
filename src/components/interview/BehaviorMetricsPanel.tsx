
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Hand, Eye, Activity, TrendingUp, CheckCircle, AlertCircle, Scan, Target } from 'lucide-react';

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
    <Card className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-blue-100 p-3">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <Target className="h-5 w-5 text-blue-600" />
        <CardTitle className="text-base font-bold text-slate-800">Behavior Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-2 pt-0">
        {/* Hand Positioning */}
        <div className="rounded-xl bg-blue-50/60 p-2 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Hand className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-slate-700">Hand Positioning</span>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${!metrics.handPresence ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{!metrics.handPresence ? 'Optimal' : 'Distracting'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between"><span>Detections:</span><span className="font-bold">{metrics.handDetectionCounter}</span></div>
            <div className="flex justify-between"><span>Duration:</span><span className="font-bold">{metrics.handDetectionDuration.toFixed(1)}s</span></div>
          </div>
        </div>
        {/* Eye Contact */}
        <div className="rounded-xl bg-purple-50/60 p-2 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-purple-500" />
            <span className="font-semibold text-slate-700">Eye Contact</span>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${metrics.eyeContact ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{metrics.eyeContact ? 'Excellent' : 'Needs Improvement'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between"><span>Breaks:</span><span className="font-bold">{metrics.notFacingCounter}</span></div>
            <div className="flex justify-between"><span>Away Time:</span><span className="font-bold">{metrics.notFacingDuration.toFixed(1)}s</span></div>
          </div>
        </div>
        {/* Posture Quality */}
        <div className="rounded-xl bg-green-50/60 p-2 flex flex-col gap-1 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-slate-700">Posture Quality</span>
            <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-semibold ${metrics.posture === 'good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{metrics.posture === 'good' ? 'Professional' : 'Slouching'}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between"><span>Poor Count:</span><span className="font-bold">{metrics.badPostureDetectionCounter}</span></div>
            <div className="flex justify-between"><span>Poor Duration:</span><span className="font-bold">{metrics.badPostureDuration.toFixed(1)}s</span></div>
          </div>
        </div>
        {/* Environment Objects */}
        {objectDetections.length > 0 && (
          <div className="rounded-xl bg-blue-50/60 p-2 flex flex-col gap-1 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Scan className="h-4 w-4 text-blue-500" />
              <span className="font-semibold text-slate-700">Environment Objects</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 ml-auto">{objectDetections.length} detected</Badge>
            </div>
            <div className="flex flex-wrap gap-2 ml-6">
              {objectDetections.map((detection, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-blue-200 text-blue-800 border-blue-300 px-2 py-0.5 rounded-full">
                  {detection.class} ({Math.round(detection.score * 100)}%)
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BehaviorMetricsPanel;
