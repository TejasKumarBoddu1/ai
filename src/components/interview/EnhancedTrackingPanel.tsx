
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmotionState } from '@/utils/mediapipe/emotionDetection';
import { MediaPipeAnalysis } from '@/types/mediapipe';
import { Eye, Hand, Activity, Brain, AlertTriangle, Clock } from 'lucide-react';

interface EnhancedTrackingPanelProps {
  metrics: MediaPipeAnalysis;
  emotionState: EmotionState;
  violations: {
    phoneCount: number;
    peopleCount: number;
    phoneDetectionTimes: Date[];
    peopleDetectionTimes: Date[];
  };
  confidenceScore: number;
  engagementScore: number;
  attentivenessScore: number;
}

const EnhancedTrackingPanel: React.FC<EnhancedTrackingPanelProps> = ({
  metrics,
  emotionState,
  violations,
  confidenceScore,
  engagementScore,
  attentivenessScore
}) => {
  return (
    <div className="space-y-4">
      {/* Real-time Behavior Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Behavior Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hand Detection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hand className="h-4 w-4" />
              <span className="text-sm font-medium">Hand Detection</span>
            </div>
            <div className="pl-6 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={metrics.handPresence ? "destructive" : "default"}>
                  {metrics.handPresence ? "Detected" : "Not Detected"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Detection Count:</span>
                <span>{metrics.handDetectionCounter}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Duration Visible:</span>
                <span>{metrics.handDetectionDuration.toFixed(2)} sec</span>
              </div>
            </div>
          </div>

          {/* Eye Contact Detection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Eye Contact Detection</span>
            </div>
            <div className="pl-6 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={metrics.notFacingCounter > 0 ? "destructive" : "default"}>
                  {metrics.notFacingCounter > 0 ? "Poor Contact" : "Good Contact"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Loss Count:</span>
                <span>{metrics.notFacingCounter}</span>
              </div>
              <div className="flex justify-between">
                <span>Looking Away Time:</span>
                <span>{metrics.notFacingDuration.toFixed(2)} sec</span>
              </div>
            </div>
          </div>

          {/* Posture Monitoring */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Posture Monitoring</span>
            </div>
            <div className="pl-6 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant={metrics.badPostureDetectionCounter > 0 ? "destructive" : "default"}>
                  {metrics.badPostureDetectionCounter > 0 ? "Poor Posture" : "Good Posture"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Poor Count:</span>
                <span>{metrics.badPostureDetectionCounter}</span>
              </div>
              <div className="flex justify-between">
                <span>Poor Duration:</span>
                <span>{metrics.badPostureDuration.toFixed(2)} sec</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emotion Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Emotion Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{emotionState.icon}</span>
            <div>
              <div className="font-medium capitalize">{emotionState.dominant}</div>
              <div className="text-xs text-muted-foreground">
                {Math.round(emotionState.confidence * 100)}% confidence
              </div>
            </div>
          </div>
          <div className="space-y-1 text-xs">
            {Object.entries(emotionState.scores).map(([emotion, score]) => (
              <div key={emotion} className="flex justify-between">
                <span className="capitalize">{emotion}:</span>
                <span>{Math.round(score * 100)}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Meters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Performance Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Confidence</span>
              <span>{confidenceScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Engagement</span>
              <span>{engagementScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${engagementScore}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Attentiveness</span>
              <span>{attentivenessScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${attentivenessScore}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations Log */}
      {(violations.phoneCount > 0 || violations.peopleCount > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Disciplinary Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {violations.phoneDetectionTimes.map((time, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                <span>Phone detected at {time.toLocaleTimeString()}</span>
              </div>
            ))}
            {violations.peopleDetectionTimes.map((time, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3" />
                <span>Person detected at {time.toLocaleTimeString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Suggestions to Improve</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs space-y-1">
            {metrics.notFacingCounter > 2 && (
              <li>• Maintain eye contact with the camera</li>
            )}
            {metrics.badPostureDetectionCounter > 1 && (
              <li>• Keep your shoulders back and spine straight</li>
            )}
            {metrics.handDetectionCounter > 3 && (
              <li>• Use natural hand gestures to emphasize points</li>
            )}
            {emotionState.dominant === 'sad' && (
              <li>• Take deep breaths to appear more confident</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedTrackingPanel;
