
import { StudentContext } from '@/types/aiQuestions';

export interface PracticeSchedule {
  nextSessionDate: Date;
  recommendedDuration: number;
  focusAreas: string[];
  sessionType: 'confidence-building' | 'skill-challenge' | 'comprehensive';
  reminder: string;
}

export const generateOptimalSchedule = (studentContext: StudentContext): PracticeSchedule => {
  const now = new Date();
  const daysSinceLastSession = Math.floor(
    (now.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Determine optimal next session timing
  let nextSessionDays = 1; // Default to tomorrow
  if (studentContext.confidenceLevel > 80) {
    nextSessionDays = 2; // Can wait longer if confident
  } else if (studentContext.confidenceLevel < 50) {
    nextSessionDays = 0; // Practice today if low confidence
  }
  
  const nextSessionDate = new Date();
  nextSessionDate.setDate(nextSessionDate.getDate() + nextSessionDays);
  
  // Determine session type based on performance
  let sessionType: 'confidence-building' | 'skill-challenge' | 'comprehensive' = 'comprehensive';
  if (studentContext.averageAnswerScore < 60) {
    sessionType = 'confidence-building';
  } else if (studentContext.averageAnswerScore > 80) {
    sessionType = 'skill-challenge';
  }
  
  // Recommend duration based on attention span and performance
  let recommendedDuration = 30; // Default 30 minutes
  if (studentContext.confidenceLevel < 50) {
    recommendedDuration = 20; // Shorter sessions for low confidence
  } else if (studentContext.confidenceLevel > 80) {
    recommendedDuration = 40; // Longer sessions for high confidence
  }
  
  // Focus areas based on weak points
  const focusAreas = [...studentContext.weakAreas];
  if (focusAreas.length === 0) {
    focusAreas.push('advanced scenarios');
  }
  
  // Generate motivational reminder
  const reminder = generateReminder(studentContext, sessionType);
  
  return {
    nextSessionDate,
    recommendedDuration,
    focusAreas,
    sessionType,
    reminder
  };
};

const generateReminder = (context: StudentContext, sessionType: string): string => {
  const reminders = {
    'confidence-building': [
      "You're making great progress! A short practice session will boost your confidence.",
      "Every small step counts. Let's build on your strengths today.",
      "You've got this! Practice makes perfect, one question at a time."
    ],
    'skill-challenge': [
      "Ready for the next level? Let's tackle some challenging questions today.",
      "Your skills are sharp! Time to push your limits with advanced scenarios.",
      "You're interview-ready! Let's fine-tune with some expert-level questions."
    ],
    'comprehensive': [
      "Time for your regular practice session. Let's keep the momentum going!",
      "Consistency is key to success. Ready for today's interview practice?",
      "Your target job is waiting! Let's prepare with focused practice."
    ]
  };
  
  const categoryReminders = reminders[sessionType as keyof typeof reminders];
  return categoryReminders[Math.floor(Math.random() * categoryReminders.length)];
};

export const shouldSendReminder = (lastSessionDate: Date, remindersSent: number): boolean => {
  const daysSinceLastSession = Math.floor(
    (new Date().getTime() - lastSessionDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Send reminder if it's been more than 2 days and we haven't sent too many
  return daysSinceLastSession >= 2 && remindersSent < 3;
};
