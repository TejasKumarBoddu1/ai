import { EnhancedMicrophone, createEnhancedMicrophone } from './enhancedMicrophone';

// Speech synthesis utilities with natural human-like voice
export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (!text || typeof window === 'undefined') return;

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // More natural speech settings
  utterance.rate = 0.85; // Slightly slower for more natural pace
  utterance.pitch = 1.0; // Natural pitch
  utterance.volume = 0.9; // Comfortable volume
  
  // Enhanced voice selection for more natural female voice
  const voices = window.speechSynthesis.getVoices();
  
  // Priority order for most natural-sounding female voices
  const preferredVoices = [
    'Samantha', 'Karen', 'Victoria', 'Susan', 'Zira', 'Hazel', 'Alex',
    'Google US English Female', 'Microsoft Zira Desktop',
    'Alice', 'Allison', 'Ava', 'Serena'
  ];
  
  let selectedVoice = null;
  
  // First, try to find preferred female voices by name
  for (const voiceName of preferredVoices) {
    selectedVoice = voices.find(voice => 
      voice.name.includes(voiceName) && voice.lang.includes('en')
    );
    if (selectedVoice) break;
  }
  
  // Fallback to any female-sounding voice
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => 
      voice.lang.includes('en-US') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.toLowerCase().includes('ella') ||
       voice.name.toLowerCase().includes('emma'))
    );
  }
  
  // Final fallback to any US English voice
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => voice.lang.includes('en-US'));
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  if (onStart) {
    utterance.onstart = onStart;
  }
  
  if (onEnd) {
    utterance.onend = onEnd;
  }
  
  // Add natural pauses and emphasis
  utterance.onboundary = (event) => {
    // Add slight pauses at sentence boundaries for more natural flow
    if (event.name === 'sentence') {
      // Small delay for natural speech rhythm
      setTimeout(() => {}, 100);
    }
  };
  
  // Start speaking
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
}

// Enhanced speech recognition utilities using EnhancedMicrophone
export function createSpeechRecognition(): EnhancedMicrophone | null {
  if (typeof window === 'undefined') return null;
  
  // Check browser support
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn("Speech recognition not supported in this browser");
    return null;
  }
  
  return createEnhancedMicrophone({
    continuous: true,
    interimResults: true,
    language: 'en-US',
    maxAlternatives: 1,
    audioConstraints: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  });
}

// Legacy function for backward compatibility
export function initSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    console.warn("Speech recognition not supported in this browser");
    return null;
  }
  
  const recognition = new SpeechRecognition();
  
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;
  
  return recognition;
}

// Prevent AI from responding to itself by tracking conversation state
let lastSpeakerWasAI = false;
let conversationContext: string[] = [];

export function setLastSpeakerAsAI() {
  lastSpeakerWasAI = true;
}

export function setLastSpeakerAsUser() {
  lastSpeakerWasAI = false;
}

export function shouldAIRespond(): boolean {
  // AI should only respond if the last speaker was not AI
  return !lastSpeakerWasAI;
}

export function addToConversationContext(speaker: 'AI' | 'User', message: string) {
  conversationContext.push(`${speaker}: ${message}`);
  // Keep only last 10 exchanges to manage context size
  if (conversationContext.length > 20) {
    conversationContext = conversationContext.slice(-20);
  }
}

export function getConversationContext(): string {
  return conversationContext.join('\n');
}

export function clearConversationContext() {
  conversationContext = [];
  lastSpeakerWasAI = false;
}

// Speech analysis utilities
interface SpeechAnalysisResult {
  toneScore: number;
  paceScore: number;
  fillerWordCount: number;
  fillerWords: string[];
  keywordsDetected: string[];
}

export function analyzeSpeech(text: string): SpeechAnalysisResult {
  const fillerWordsToCheck = ["um", "uh", "like", "you know", "actually", "basically", "literally"];
  const textLower = text.toLowerCase();
  const fillerWords: string[] = [];
  let fillerWordCount = 0;
  
  fillerWordsToCheck.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = textLower.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      fillerWords.push(word);
      fillerWordCount += count;
    }
  });
  
  // Calculate tone score
  let toneScore = 80;
  
  if (fillerWordCount > 10) {
    toneScore -= 25;
  } else if (fillerWordCount > 5) {
    toneScore -= 15;
  } else if (fillerWordCount > 2) {
    toneScore -= 5;
  }
  
  // Check for hesitant language
  const hesitantPhrases = ["i think", "i guess", "sort of", "kind of"];
  let hesitationCount = 0;
  
  hesitantPhrases.forEach(phrase => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    const matches = textLower.match(regex);
    hesitationCount += matches ? matches.length : 0;
  });
  
  if (hesitationCount > 3) {
    toneScore -= 15;
  } else if (hesitationCount > 0) {
    toneScore -= 5;
  }
  
  // Pace score
  const wordCount = text.split(/\s+/).length;
  const speakingTimeEstimate = wordCount / 2.5;
  const idealLength = 30;
  const paceScore = 100 - Math.abs(speakingTimeEstimate - idealLength) * 1.5;
  
  const boundedToneScore = Math.max(0, Math.min(100, toneScore));
  const boundedPaceScore = Math.max(0, Math.min(100, paceScore));
  
  // Detect keywords
  const keywordMatches = text.match(/\b(experience|skills|project|team|leadership|problem|solution|challenge|success|learn)\b/gi);
  const keywordsDetected = keywordMatches ? [...new Set(keywordMatches.map(k => k.toLowerCase()))] : [];
  
  return {
    toneScore: boundedToneScore,
    paceScore: boundedPaceScore,
    fillerWordCount,
    fillerWords,
    keywordsDetected
  };
}
