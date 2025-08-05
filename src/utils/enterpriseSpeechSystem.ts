// Enterprise-Grade Speech System
export interface SpeechConfig {
  stt: {
    language: string;
    continuous: boolean;
    interimResults: boolean;
    confidenceThreshold: number;
  };
  tts: {
    voice: string;
    rate: number;
    pitch: number;
    volume: number;
  };
}

export interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

// ============================================================================
// ENTERPRISE STT
// ============================================================================

export class EnterpriseSTT {
  private recognition: SpeechRecognition | null = null;
  private isRecording = false;
  private isAISpeaking = false;
  private isManuallyStopped = false;
  private config: SpeechConfig;
  private callbacks: any = {};

  constructor(config: SpeechConfig) {
    this.config = config;
  }

  on(event: string, callback: Function): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.callbacks[event];
    if (callbacks) {
      callbacks.forEach((callback: Function) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  async startRecording(): Promise<void> {
    if (this.isRecording) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported');
    }

    // If there's an existing recognition instance, stop it first
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping existing recognition:', error);
      }
      // Wait a moment for it to fully stop
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.recognition = new SpeechRecognition();
    this.isManuallyStopped = false;
    this.recognition.continuous = this.config.stt.continuous;
    this.recognition.interimResults = this.config.stt.interimResults;
    this.recognition.lang = this.config.stt.language;

    this.recognition.onstart = () => {
      this.isRecording = true;
      this.emit('start');
    };

    this.recognition.onresult = (event) => {
      if (this.isAISpeaking) return;

      const results = Array.from(event.results);
      const latestResult = results[results.length - 1];

      if (latestResult && latestResult[0].confidence > this.config.stt.confidenceThreshold) {
        const transcript = latestResult[0].transcript.trim();
        
        if (this.isValidTranscript(transcript)) {
          const result: SpeechResult = {
            transcript,
            confidence: latestResult[0].confidence || 0.8,
            isFinal: latestResult.isFinal
          };

          this.emit(result.isFinal ? 'final' : 'interim', result);
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.error('STT Error:', event.error);
      this.emit('error', event.error);
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this.emit('end');
      
      // Only auto-restart if not manually stopped and AI is not speaking
      if (!this.isManuallyStopped && !this.isAISpeaking && this.recognition) {
        setTimeout(() => this.restart(), 1000);
      }
    };

    this.recognition.start();
  }

  private isValidTranscript(transcript: string): boolean {
    if (transcript.length < 2) return false;
    
    // Filter repetitive patterns
    const words = transcript.toLowerCase().split(/\s+/);
    if (words.length >= 3) {
      const phrase = words.slice(0, 3).join(' ');
      const remainingWords = words.slice(3);
      
      for (let i = 0; i < remainingWords.length - 2; i++) {
        const checkPhrase = remainingWords.slice(i, i + 3).join(' ');
        if (checkPhrase === phrase) return false;
      }
    }
    
    // Filter noise patterns
    const noisePatterns = [
      /^[aeiou]+$/i,
      /^[bcdfghjklmnpqrstvwxyz]+$/i,
      /^(.)\1{2,}$/,
      /^(um|uh|ah|er|hmm|mmm)+$/i
    ];
    
    return !noisePatterns.some(pattern => pattern.test(transcript));
  }

  private restart(): void {
    if (this.recognition && !this.isRecording && !this.isAISpeaking && !this.isManuallyStopped) {
      try {
        // Add a small delay to prevent conflicts
        setTimeout(() => {
          if (!this.isRecording && !this.isAISpeaking && !this.isManuallyStopped) {
            this.recognition?.start();
          }
        }, 100);
      } catch (error) {
        console.error('Failed to restart STT:', error);
      }
    }
  }

  stopRecording(): void {
    this.isRecording = false;
    this.isManuallyStopped = true;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping STT:', error);
      }
      // Clear the recognition instance to prevent conflicts
      this.recognition = null;
    }
  }

  setAISpeakingState(isSpeaking: boolean): void {
    this.isAISpeaking = isSpeaking;
    if (isSpeaking && this.recognition && this.isRecording) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping STT during AI speech:', error);
      }
    }
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording && !this.isAISpeaking;
  }
}

// ============================================================================
// ENTERPRISE TTS
// ============================================================================

export class EnterpriseTTS {
  private config: SpeechConfig;
  private isSpeaking = false;
  private speechQueue: Array<{text: string, options: any, resolve: Function, reject: Function}> = [];
  private callbacks: any = {};

  constructor(config: SpeechConfig) {
    this.config = config;
  }

  on(event: string, callback: Function): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.callbacks[event];
    if (callbacks) {
      callbacks.forEach((callback: Function) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  async speak(text: string, options: any = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      this.speechQueue.push({ text, options, resolve, reject });
      
      if (!this.isSpeaking) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.speechQueue.length === 0 || this.isSpeaking) {
      return;
    }

    const { text, options, resolve, reject } = this.speechQueue.shift()!;

    try {
      this.isSpeaking = true;
      this.emit('speaking_start', { text: text.substring(0, 50) + '...' });

      await this.speakWithWebAPI(text, options);
      resolve();
    } catch (error) {
      console.error('TTS Error:', error);
      reject(error);
    } finally {
      this.isSpeaking = false;
      this.emit('speaking_end');
      
      // Process next in queue
      setTimeout(() => this.processQueue(), 100);
    }
  }

  private async speakWithWebAPI(text: string, options: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Female') && v.lang.includes('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Set speech parameters
      utterance.rate = options.rate || this.config.tts.rate || 0.9;
      utterance.pitch = options.pitch || this.config.tts.pitch || 1.0;
      utterance.volume = options.volume || this.config.tts.volume || 0.9;
      
      utterance.onstart = () => {
        this.emit('speaking_start', { text: text.substring(0, 50) + '...' });
      };
      
      utterance.onend = () => {
        this.emit('speaking_end');
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    this.isSpeaking = false;
    this.speechQueue = [];
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  getQueueLength(): number {
    return this.speechQueue.length;
  }
}

// ============================================================================
// ENTERPRISE SPEECH MANAGER
// ============================================================================

export class EnterpriseSpeechManager {
  private stt: EnterpriseSTT;
  private tts: EnterpriseTTS;
  private config: SpeechConfig;
  private callbacks: any = {};

  constructor(config: SpeechConfig) {
    this.config = config;
    this.stt = new EnterpriseSTT(config);
    this.tts = new EnterpriseTTS(config);
    this.setupEventHandlers();
  }

  on(event: string, callback: Function): void {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.callbacks[event];
    if (callbacks) {
      callbacks.forEach((callback: Function) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }

  private setupEventHandlers(): void {
    this.stt.on('start', () => this.emit('stt_start'));
    this.stt.on('end', () => this.emit('stt_end'));
    this.stt.on('interim', (result: SpeechResult) => this.emit('interim_transcript', result));
    this.stt.on('final', (result: SpeechResult) => this.emit('final_transcript', result));
    this.stt.on('error', (error: any) => this.emit('stt_error', error));

    this.tts.on('speaking_start', (data: any) => {
      this.stt.setAISpeakingState(true);
      this.emit('ai_speaking_start', data);
    });

    this.tts.on('speaking_end', () => {
      this.stt.setAISpeakingState(false);
      this.emit('ai_speaking_end');
    });

    this.tts.on('error', (error: any) => this.emit('tts_error', error));
  }

  async startRecording(): Promise<void> {
    await this.stt.startRecording();
  }

  stopRecording(): void {
    this.stt.stopRecording();
  }

  async speak(text: string, options: any = {}): Promise<void> {
    await this.tts.speak(text, options);
  }

  stopSpeaking(): void {
    this.tts.stop();
  }

  setTypingState(isTyping: boolean): void {
    // Implementation for typing detection
  }

  isCurrentlyRecording(): boolean {
    return this.stt.isCurrentlyRecording();
  }

  isCurrentlySpeaking(): boolean {
    return this.tts.isCurrentlySpeaking();
  }

      setAISpeakingState(isSpeaking: boolean): void {
      // Don't automatically manage STT state - let user control it
      // this.stt.setAISpeakingState(isSpeaking);
    }
}

// ============================================================================
// DEFAULT CONFIG
// ============================================================================

export const DEFAULT_SPEECH_CONFIG: SpeechConfig = {
  stt: {
    language: 'en-US',
    continuous: true,
    interimResults: true,
    confidenceThreshold: 0.7
  },
  tts: {
    voice: 'Google UK English Female',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.9
  }
}; 