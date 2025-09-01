import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Clock, 
  User, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Download, 
  Trash2,
  Eye,
  Calendar,
  Timer
} from "lucide-react";
import { interviewDataStorage } from '@/utils/interviewDataStorage';
import type { InterviewSession } from '@/utils/interviewDataStorage';

const InterviewHistory: React.FC = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = interviewDataStorage.getAllSessions();
    setSessions(allSessions);
  };

  const handleExportSession = (sessionId: string) => {
    const exportData = interviewDataStorage.exportSession(sessionId);
    if (exportData) {
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-session-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    // For now, we'll just clear all data since we don't have individual session deletion
    if (confirm('Are you sure you want to delete all interview data? This cannot be undone.')) {
      interviewDataStorage.clearAllData();
      loadSessions();
    }
  };

  const formatDuration = (startTime: Date, endTime?: Date): string => {
    if (!endTime) return 'In Progress';
    const durationMs = endTime.getTime() - startTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getEmotionIcon = (dominant: string): string => {
    const emotionIcons: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      surprised: '😲',
      neutral: '😐',
      disgusted: '🤢',
      angry: '😠',
      fearful: '😨'
    };
    return emotionIcons[dominant] || '😐';
  };

  const getSessionStats = (session: InterviewSession) => {
    const stats = interviewDataStorage.getSessionStats(session.sessionId);
    return stats;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Interview History</h1>
        <p className="text-slate-600">View and manage your stored interview sessions</p>
      </div>

      {sessions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Interview Sessions</h3>
            <p className="text-slate-500">Complete an interview to see your history here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sessions.map((session) => {
            const stats = getSessionStats(session);
            return (
              <Card key={session.sessionId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        {session.candidateName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4" />
                        {session.jobTitle}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session);
                          setShowDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportSession(session.sessionId)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSession(session.sessionId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-xs text-slate-600">
                          {session.startTime.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-xs text-slate-600">
                          {formatDuration(session.startTime, session.endTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium">Messages</p>
                        <p className="text-xs text-slate-600">
                          {session.messages.length} total
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm font-medium">Scores</p>
                        <p className="text-xs text-slate-600">
                          C: {session.confidenceScore}% | E: {session.engagementScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {stats && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {stats.totalEmotions} Emotions
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {stats.totalBehaviorAnalysis} Behavior Analysis
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {stats.totalObjectDetections} Object Detections
                        </Badge>
                        {stats.dominantEmotions && Object.keys(stats.dominantEmotions).length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {getEmotionIcon(Object.keys(stats.dominantEmotions)[0])} 
                            {Object.keys(stats.dominantEmotions)[0]}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Session Details Modal */}
      {showDetails && selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Interview Details</h2>
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Close
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Messages */}
              <div>
                <h3 className="font-semibold mb-3">Conversation</h3>
                <ScrollArea className="h-64 border rounded p-3">
                  {selectedSession.messages.map((message, index) => (
                    <div key={index} className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={message.role === 'hr' ? 'default' : 'secondary'} className="text-xs">
                          {message.role === 'hr' ? 'Ava' : selectedSession.candidateName}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm bg-slate-50 p-2 rounded">{message.content}</p>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              {/* Analytics */}
              <div>
                <h3 className="font-semibold mb-3">Analytics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Emotions Detected</p>
                    <p className="text-xs text-slate-600">
                      {selectedSession.emotions.length} samples
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Behavior Analysis</p>
                    <p className="text-xs text-slate-600">
                      {selectedSession.behaviorAnalysis.length} samples
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Object Detections</p>
                    <p className="text-xs text-slate-600">
                      {selectedSession.objectDetections.length} detections
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Final Scores</p>
                    <div className="text-xs text-slate-600">
                      <p>Confidence: {selectedSession.confidenceScore}%</p>
                      <p>Engagement: {selectedSession.engagementScore}%</p>
                      <p>Attentiveness: {selectedSession.attentivenessScore}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewHistory; 