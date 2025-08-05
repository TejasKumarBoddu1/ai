// Interview Data Storage Utility
// Manages temporary local storage of interview data with timestamps, emotions, and behavior analysis

export interface InterviewMessage {
  role: 'hr' | 'candidate';
  content: string;
  timestamp: Date;
  messageId: string;
}

export interface EmotionData {
  dominant: string;
  confidence: number;
  scores: {
    happy: number;
    sad: number;
    surprised: number;
    neutral: number;
    disgusted: number;
    angry: number;
    fearful: number;
  };
  icon: string;
  timestamp: Date;
}

export interface BehaviorAnalysis {
  handDetectionCounter: number;
  handDetectionDuration: number;
  notFacingCounter: number;
  notFacingDuration: number;
  badPostureDetectionCounter: number;
  badPostureDuration: number;
  handPresence: boolean;
  eyeContact: boolean;
  posture: 'good' | 'poor';
  timestamp: Date;
}

export interface ObjectDetection {
  class: string;
  score: number;
  bbox: [number, number, number, number];
  timestamp: Date;
}

export interface InterviewSession {
  sessionId: string;
  candidateName: string;
  jobTitle: string;
  duration: number;
  aiBackend: string;
  startTime: Date;
  endTime?: Date;
  messages: InterviewMessage[];
  emotions: EmotionData[];
  behaviorAnalysis: BehaviorAnalysis[];
  objectDetections: ObjectDetection[];
  confidenceScore: number;
  engagementScore: number;
  attentivenessScore: number;
  questionCount: number;
  isComplete: boolean;
}

export interface InterviewDataStorage {
  // Current active session
  currentSession: InterviewSession | null;
  
  // All completed sessions
  completedSessions: InterviewSession[];
  
  // Storage methods
  startNewSession: (sessionData: Partial<InterviewSession>) => string;
  addMessage: (message: Omit<InterviewMessage, 'messageId'>) => void;
  addEmotion: (emotion: Omit<EmotionData, 'timestamp'>) => void;
  addBehaviorAnalysis: (behavior: Omit<BehaviorAnalysis, 'timestamp'>) => void;
  addObjectDetection: (detection: Omit<ObjectDetection, 'timestamp'>) => void;
  updateScores: (scores: { confidenceScore?: number; engagementScore?: number; attentivenessScore?: number }) => void;
  completeSession: () => InterviewSession | null;
  getCurrentSession: () => InterviewSession | null;
  getAllSessions: () => InterviewSession[];
  clearCurrentSession: () => void;
  clearAllData: () => void;
  exportSession: (sessionId: string) => string | null;
  importSession: (sessionData: string) => boolean;
}

class InterviewDataManager implements InterviewDataStorage {
  private storageKey = 'interview_data';
  private currentSessionKey = 'current_interview_session';
  private completedSessionsKey = 'completed_interview_sessions';

  // Add the missing properties to satisfy the interface
  get currentSession(): InterviewSession | null {
    return this.loadCurrentSession();
  }

  get completedSessions(): InterviewSession[] {
    return this.loadCompletedSessions();
  }

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    // Ensure storage keys exist
    if (!localStorage.getItem(this.currentSessionKey)) {
      localStorage.setItem(this.currentSessionKey, 'null');
    }
    if (!localStorage.getItem(this.completedSessionsKey)) {
      localStorage.setItem(this.completedSessionsKey, '[]');
    }
  }

  private generateSessionId(): string {
    return `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveCurrentSession(session: InterviewSession | null): void {
    try {
      localStorage.setItem(this.currentSessionKey, JSON.stringify(session));
    } catch (error) {
      console.error('Error saving current session:', error);
    }
  }

  private loadCurrentSession(): InterviewSession | null {
    try {
      const sessionData = localStorage.getItem(this.currentSessionKey);
      if (sessionData && sessionData !== 'null') {
        const session = JSON.parse(sessionData);
        // Convert string timestamps back to Date objects
        session.startTime = new Date(session.startTime);
        session.endTime = session.endTime ? new Date(session.endTime) : undefined;
        session.messages = session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        session.emotions = session.emotions.map((emotion: any) => ({
          ...emotion,
          timestamp: new Date(emotion.timestamp)
        }));
        session.behaviorAnalysis = session.behaviorAnalysis.map((behavior: any) => ({
          ...behavior,
          timestamp: new Date(behavior.timestamp)
        }));
        session.objectDetections = session.objectDetections.map((detection: any) => ({
          ...detection,
          timestamp: new Date(detection.timestamp)
        }));
        return session;
      }
      return null;
    } catch (error) {
      console.error('Error loading current session:', error);
      return null;
    }
  }

  private saveCompletedSessions(sessions: InterviewSession[]): void {
    try {
      localStorage.setItem(this.completedSessionsKey, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving completed sessions:', error);
    }
  }

  private loadCompletedSessions(): InterviewSession[] {
    try {
      const sessionsData = localStorage.getItem(this.completedSessionsKey);
      if (sessionsData) {
        const sessions = JSON.parse(sessionsData);
        // Convert string timestamps back to Date objects
        return sessions.map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: session.endTime ? new Date(session.endTime) : undefined,
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          emotions: session.emotions.map((emotion: any) => ({
            ...emotion,
            timestamp: new Date(emotion.timestamp)
          })),
          behaviorAnalysis: session.behaviorAnalysis.map((behavior: any) => ({
            ...behavior,
            timestamp: new Date(behavior.timestamp)
          })),
          objectDetections: session.objectDetections.map((detection: any) => ({
            ...detection,
            timestamp: new Date(detection.timestamp)
          }))
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading completed sessions:', error);
      return [];
    }
  }

  startNewSession(sessionData: Partial<InterviewSession>): string {
    const sessionId = this.generateSessionId();
    
    const newSession: InterviewSession = {
      sessionId,
      candidateName: sessionData.candidateName || 'Unknown',
      jobTitle: sessionData.jobTitle || 'Unknown Position',
      duration: sessionData.duration || 15,
      aiBackend: sessionData.aiBackend || 'gemini',
      startTime: new Date(),
      messages: [],
      emotions: [],
      behaviorAnalysis: [],
      objectDetections: [],
      confidenceScore: 85,
      engagementScore: 72,
      attentivenessScore: 90,
      questionCount: 0,
      isComplete: false,
      ...sessionData
    };

    this.saveCurrentSession(newSession);
    console.log('📝 Started new interview session:', sessionId);
    return sessionId;
  }

  addMessage(message: Omit<InterviewMessage, 'messageId'>): void {
    const currentSession = this.loadCurrentSession();
    if (!currentSession) {
      console.warn('No active session to add message to');
      return;
    }

    const messageWithId: InterviewMessage = {
      ...message,
      messageId: this.generateMessageId(),
      timestamp: new Date()
    };

    currentSession.messages.push(messageWithId);
    this.saveCurrentSession(currentSession);
    console.log('📝 Added message to session:', messageWithId.messageId);
  }

  addEmotion(emotion: Omit<EmotionData, 'timestamp'>): void {
    const currentSession = this.loadCurrentSession();
    if (!currentSession) {
      console.warn('No active session to add emotion to');
      return;
    }

    const emotionWithTimestamp: EmotionData = {
      ...emotion,
      timestamp: new Date()
    };

    currentSession.emotions.push(emotionWithTimestamp);
    this.saveCurrentSession(currentSession);
    console.log('😊 Added emotion data to session:', emotion.dominant);
  }

  addBehaviorAnalysis(behavior: Omit<BehaviorAnalysis, 'timestamp'>): void {
    const currentSession = this.loadCurrentSession();
    if (!currentSession) {
      console.warn('No active session to add behavior analysis to');
      return;
    }

    const behaviorWithTimestamp: BehaviorAnalysis = {
      ...behavior,
      timestamp: new Date()
    };

    currentSession.behaviorAnalysis.push(behaviorWithTimestamp);
    this.saveCurrentSession(currentSession);
    console.log('📊 Added behavior analysis to session');
  }

  addObjectDetection(detection: Omit<ObjectDetection, 'timestamp'>): void {
    const currentSession = this.loadCurrentSession();
    if (!currentSession) {
      console.warn('No active session to add object detection to');
      return;
    }

    const detectionWithTimestamp: ObjectDetection = {
      ...detection,
      timestamp: new Date()
    };

    currentSession.objectDetections.push(detectionWithTimestamp);
    this.saveCurrentSession(currentSession);
    console.log('🔍 Added object detection to session:', detection.class);
  }

  updateScores(scores: { confidenceScore?: number; engagementScore?: number; attentivenessScore?: number }): void {
    const currentSession = this.loadCurrentSession();
    if (!currentSession) {
      console.warn('No active session to update scores for');
      return;
    }

    if (scores.confidenceScore !== undefined) {
      currentSession.confidenceScore = scores.confidenceScore;
    }
    if (scores.engagementScore !== undefined) {
      currentSession.engagementScore = scores.engagementScore;
    }
    if (scores.attentivenessScore !== undefined) {
      currentSession.attentivenessScore = scores.attentivenessScore;
    }

    this.saveCurrentSession(currentSession);
    console.log('📈 Updated scores:', scores);
  }

  completeSession(): InterviewSession | null {
    const currentSession = this.loadCurrentSession();
    if (!currentSession) {
      console.warn('No active session to complete');
      return null;
    }

    currentSession.endTime = new Date();
    currentSession.isComplete = true;

    // Move to completed sessions
    const completedSessions = this.loadCompletedSessions();
    completedSessions.unshift(currentSession); // Add to beginning
    this.saveCompletedSessions(completedSessions);

    // Clear current session
    this.saveCurrentSession(null);

    console.log('✅ Completed interview session:', currentSession.sessionId);
    return currentSession;
  }

  getCurrentSession(): InterviewSession | null {
    return this.loadCurrentSession();
  }

  getAllSessions(): InterviewSession[] {
    const currentSession = this.loadCurrentSession();
    const completedSessions = this.loadCompletedSessions();
    
    const allSessions = [...completedSessions];
    if (currentSession) {
      allSessions.unshift(currentSession);
    }
    
    return allSessions;
  }

  clearCurrentSession(): void {
    this.saveCurrentSession(null);
    console.log('🗑️ Cleared current session');
  }

  clearAllData(): void {
    localStorage.removeItem(this.currentSessionKey);
    localStorage.removeItem(this.completedSessionsKey);
    this.initializeStorage();
    console.log('🗑️ Cleared all interview data');
  }

  exportSession(sessionId: string): string | null {
    const allSessions = this.getAllSessions();
    const session = allSessions.find(s => s.sessionId === sessionId);
    
    if (!session) {
      console.warn('Session not found for export:', sessionId);
      return null;
    }

    try {
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        session: session
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting session:', error);
      return null;
    }
  }

  importSession(sessionData: string): boolean {
    try {
      const importData = JSON.parse(sessionData);
      
      if (!importData.session || !importData.session.sessionId) {
        console.error('Invalid session data format');
        return false;
      }

      const completedSessions = this.loadCompletedSessions();
      const existingIndex = completedSessions.findIndex(s => s.sessionId === importData.session.sessionId);
      
      if (existingIndex >= 0) {
        completedSessions[existingIndex] = importData.session;
      } else {
        completedSessions.push(importData.session);
      }

      this.saveCompletedSessions(completedSessions);
      console.log('📥 Imported session:', importData.session.sessionId);
      return true;
    } catch (error) {
      console.error('Error importing session:', error);
      return false;
    }
  }

  // Utility methods for data analysis
  getSessionStats(sessionId: string): any {
    const allSessions = this.getAllSessions();
    const session = allSessions.find(s => s.sessionId === sessionId);
    
    if (!session) return null;

    const totalMessages = session.messages.length;
    const hrMessages = session.messages.filter(m => m.role === 'hr').length;
    const candidateMessages = session.messages.filter(m => m.role === 'candidate').length;
    
    const avgEmotionConfidence = session.emotions.length > 0 
      ? session.emotions.reduce((sum, e) => sum + e.confidence, 0) / session.emotions.length 
      : 0;
    
    const dominantEmotions = session.emotions.reduce((acc, emotion) => {
      acc[emotion.dominant] = (acc[emotion.dominant] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalDuration = session.endTime 
      ? (session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60 // in minutes
      : 0;

    return {
      sessionId: session.sessionId,
      candidateName: session.candidateName,
      jobTitle: session.jobTitle,
      totalMessages,
      hrMessages,
      candidateMessages,
      totalEmotions: session.emotions.length,
      avgEmotionConfidence,
      dominantEmotions,
      totalBehaviorAnalysis: session.behaviorAnalysis.length,
      totalObjectDetections: session.objectDetections.length,
      finalScores: {
        confidence: session.confidenceScore,
        engagement: session.engagementScore,
        attentiveness: session.attentivenessScore
      },
      duration: totalDuration,
      questionCount: session.questionCount,
      isComplete: session.isComplete
    };
  }

  // Auto-save functionality
  autoSave(): void {
    const currentSession = this.loadCurrentSession();
    if (currentSession) {
      this.saveCurrentSession(currentSession);
      console.log('💾 Auto-saved current session');
    }
  }

  // Clean up old sessions (keep last 50)
  cleanupOldSessions(maxSessions: number = 50): void {
    const completedSessions = this.loadCompletedSessions();
    if (completedSessions.length > maxSessions) {
      const sessionsToKeep = completedSessions.slice(0, maxSessions);
      this.saveCompletedSessions(sessionsToKeep);
      console.log(`🧹 Cleaned up old sessions, kept ${sessionsToKeep.length} most recent`);
    }
  }
}

// Create and export singleton instance
export const interviewDataStorage = new InterviewDataManager();

// Auto-save every 30 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    interviewDataStorage.autoSave();
  }, 30000);

  // Clean up old sessions on page load
  interviewDataStorage.cleanupOldSessions();
}

export default interviewDataStorage; 