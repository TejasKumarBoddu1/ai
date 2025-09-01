// No import needed - this is the main file

export interface SpeechConfig {
  stt: {
    language: string;
    continuous: boolean;
    interimResults: boolean;
    confidenceThreshold: number;
    maxAlternatives?: number;
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
  alternatives?: Array<{
    transcript: string;
    confidence: number;
  }>;
}

// ============================================================================
// ENHANCED ENTERPRISE STT
// ============================================================================

export class EnterpriseSTT {
  private recognition: SpeechRecognition | null = null;
  private isRecording = false;
  private isAISpeaking = false;
  private isManuallyStopped = false;
  private config: SpeechConfig;
  private callbacks: any = {};
  private currentTranscript = '';
  private interimTranscript = '';
  private lastFinalTranscript = '';
  private restartAttempts = 0;
  private maxRestartAttempts = 3;
  private restartTimeout: NodeJS.Timeout | null = null;

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
    if (this.isRecording) {
      console.log('🎤 Already recording, skipping start');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Speech recognition not supported in this browser');
    }

    // Stop any existing recognition
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping existing recognition:', error);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Reset state
    this.currentTranscript = '';
    this.interimTranscript = '';
    this.lastFinalTranscript = '';
    this.restartAttempts = 0;

    // Create new recognition instance
    this.recognition = new SpeechRecognition();
    this.isManuallyStopped = false;

    // Configure recognition
    this.recognition.continuous = true; // Always continuous for better long sentence handling
    this.recognition.interimResults = true; // Always get interim results
    this.recognition.lang = this.config.stt.language;
    this.recognition.maxAlternatives = this.config.stt.maxAlternatives || 3;

    // Set up event handlers
    this.recognition.onstart = () => {
      console.log('🎤 Speech recognition started successfully');
      this.isRecording = true;
      this.emit('start');
    };

    this.recognition.onresult = (event) => {
      this.handleSpeechResult(event);
    };

    this.recognition.onerror = (event) => {
      this.handleSpeechError(event);
    };

    this.recognition.onend = () => {
      this.handleSpeechEnd();
    };

    // Start recognition
    try {
      this.recognition.start();
      console.log('🎤 Recognition start requested');
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.emit('error', 'Failed to start speech recognition');
    }
  }

  private handleSpeechResult(event: SpeechRecognitionEvent): void {
    const results = Array.from(event.results);
    let finalTranscript = '';
    let interimTranscript = '';

    // Process all results
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const transcript = result[0].transcript.trim();
      
      if (result.isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript + ' ';
      }
    }

    // Clean up transcripts
    finalTranscript = finalTranscript.trim();
    interimTranscript = interimTranscript.trim();

    console.log('🎤 Speech result:', {
      final: finalTranscript,
      interim: interimTranscript,
      isFinal: results[results.length - 1]?.isFinal,
      confidence: results[results.length - 1]?.[0]?.confidence
    });

    // Handle final results
    if (finalTranscript && finalTranscript !== this.lastFinalTranscript) {
      this.lastFinalTranscript = finalTranscript;
      this.currentTranscript = finalTranscript;
      
      const result: SpeechResult = {
        transcript: finalTranscript,
        confidence: results[results.length - 1]?.[0]?.confidence || 0.8,
        isFinal: true,
        alternatives: Array.from(results[results.length - 1] || []).map(alt => ({
          transcript: alt.transcript,
          confidence: alt.confidence || 0.8
        }))
      };

      console.log('🎤 Emitting final transcript:', result);
      this.emit('final', result);
    }

    // Handle interim results
    if (interimTranscript && interimTranscript !== this.interimTranscript) {
      this.interimTranscript = interimTranscript;
      
      const result: SpeechResult = {
        transcript: interimTranscript,
        confidence: results[results.length - 1]?.[0]?.confidence || 0.6,
        isFinal: false,
        alternatives: Array.from(results[results.length - 1] || []).map(alt => ({
          transcript: alt.transcript,
          confidence: alt.confidence || 0.6
        }))
      };

      console.log('🎤 Emitting interim transcript:', result);
      this.emit('interim', result);
    }
  }

  private handleSpeechError(event: SpeechRecognitionErrorEvent): void {
    console.error('🎤 Speech recognition error:', event.error, event.message);
    
    this.isRecording = false;
    
    // Handle specific errors
    switch (event.error) {
      case 'no-speech':
        console.log('🎤 No speech detected, continuing...');
        break;
      case 'audio-capture':
        this.emit('error', 'Microphone access denied or not available');
        break;
      case 'not-allowed':
        this.emit('error', 'Microphone permission denied');
        break;
      case 'network':
        this.emit('error', 'Network error occurred');
        break;
      case 'service-not-allowed':
        this.emit('error', 'Speech recognition service not allowed');
        break;
      default:
        this.emit('error', `Speech recognition error: ${event.error}`);
    }
  }

  private handleSpeechEnd(): void {
    console.log('🎤 Speech recognition ended');
    this.isRecording = false;
    this.emit('end');
    
    // Auto-restart if not manually stopped and we haven't exceeded max attempts
    if (!this.isManuallyStopped && this.restartAttempts < this.maxRestartAttempts) {
      this.restartAttempts++;
      console.log(`🎤 Auto-restarting recognition (attempt ${this.restartAttempts}/${this.maxRestartAttempts})`);
      
      if (this.restartTimeout) {
        clearTimeout(this.restartTimeout);
      }
      
      this.restartTimeout = setTimeout(() => {
        this.startRecording().catch(error => {
          console.error('Failed to restart speech recognition:', error);
        });
      }, 1000);
    } else if (this.restartAttempts >= this.maxRestartAttempts) {
      console.log('🎤 Max restart attempts reached, stopping auto-restart');
      this.emit('error', 'Speech recognition failed to restart after multiple attempts');
    }
  }

  stopRecording(): void {
    console.log('🎤 Manually stopping speech recognition');
    this.isManuallyStopped = true;
    this.isRecording = false;
    this.restartAttempts = 0;
    
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      this.recognition = null;
    }
  }

  setAISpeakingState(isSpeaking: boolean): void {
    this.isAISpeaking = isSpeaking;
    console.log(`🤖 AI speaking state changed to: ${isSpeaking}`);
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
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
  private boundaryFallbackTimer: number | null = null;

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
      let preferredVoice: SpeechSynthesisVoice | undefined;

      if (options.voice && typeof options.voice === 'string') {
        // Try exact name match first
        preferredVoice = voices.find(v => v.name === options.voice);
        // Try partial name includes
        if (!preferredVoice) preferredVoice = voices.find(v => v.name.toLowerCase().includes(options.voice.toLowerCase()));
        // Try language fallback if looks like a locale code
        if (!preferredVoice && /[a-z]{2}-[A-Z]{2}/.test(options.voice)) {
          preferredVoice = voices.find(v => v.lang === options.voice);
        }
      }

      if (!preferredVoice) {
        // Sensible defaults
        preferredVoice = voices.find(v => v.name.includes('Google UK English Female'))
          || voices.find(v => v.lang?.startsWith('en-US') && /female|samantha|victoria|aria|jenny/i.test(v.name))
          || voices.find(v => v.lang?.startsWith('en'))
          || voices[0];
      }

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      // Set properties
      utterance.rate = options.rate || this.config.tts.rate;
      utterance.pitch = options.pitch || this.config.tts.pitch;
      utterance.volume = options.volume || this.config.tts.volume;

      utterance.onstart = () => {
        console.log('🗣️ TTS started speaking');
        // Start boundary fallback in case onboundary isn't supported
        if (!('onboundary' in utterance)) {
          const approxWpm = 160; // average
          const words = text.split(/\s+/).filter(Boolean).length || 1;
          const approxMs = Math.max(1500, (words / approxWpm) * 60_000);
          const interval = Math.max(80, Math.min(160, approxMs / (words * 5)));
          this.boundaryFallbackTimer = window.setInterval(() => {
            const letters = 'ABEFDCHX';
            const viseme = letters[Math.floor(Math.random() * letters.length)];
            this.emit('boundary', { type: 'fallback', viseme });
          }, interval) as unknown as number;
        }
      };

      utterance.onend = () => {
        console.log('🗣️ TTS finished speaking');
        if (this.boundaryFallbackTimer) {
          clearInterval(this.boundaryFallbackTimer);
          this.boundaryFallbackTimer = null;
        }
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('TTS Error:', event);
        if (this.boundaryFallbackTimer) {
          clearInterval(this.boundaryFallbackTimer);
          this.boundaryFallbackTimer = null;
        }
        reject(new Error(`TTS error: ${event.error}`));
      };

      // Emit boundary events for realtime viseme approximation
      utterance.onboundary = (event: SpeechSynthesisEvent & { name?: string; charIndex?: number }) => {
        try {
          const index = (event as any).charIndex ?? 0;
          const ch = text[index] || ' ';
          const viseme = charToApproxViseme(ch);
          this.emit('boundary', { type: (event as any).name || 'char', index, char: ch, viseme });
        } catch (err) {
          console.warn('Boundary mapping error:', err);
        }
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.speechQueue = [];
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
  private lastViseme: string = 'X';
  private externalAvatarSpeak?: (text: string) => void;

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
    this.stt.on('interim', (result: SpeechResult) => this.emit('interim', result));
    this.stt.on('final', (result: SpeechResult) => this.emit('final', result));
    this.stt.on('error', (error: any) => this.emit('error', error));

    this.tts.on('speaking_start', (data: any) => {
      this.stt.setAISpeakingState(true);
      this.emit('speaking_start', data);
    });

    this.tts.on('speaking_end', () => {
      this.stt.setAISpeakingState(false);
      this.emit('speaking_end');
    });

    this.tts.on('error', (error: any) => this.emit('tts_error', error));

    // Pass boundary / viseme approximation to consumers
    (this.tts as any).on('boundary', (payload: any) => {
      this.lastViseme = payload?.viseme || 'X';
      this.emit('tts_boundary', { viseme: this.lastViseme, raw: payload });
    });
  }

  async startRecording(): Promise<void> {
    await this.stt.startRecording();
  }

  stopRecording(): void {
    this.stt.stopRecording();
  }

  async speak(text: string, options: any = {}): Promise<void> {
    console.log('🎤 EnterpriseSpeechManager speaking:', text.substring(0, 50) + '...');
    try {
      // Use the new TalkingHead3DAvatar system
      const newTalkingHeadFn = (window as any).newTalkingHeadSpeak as ((t: string) => void) | undefined;
      const newTalkingHeadReady = (window as any).newTalkingHeadReady;

      if (typeof newTalkingHeadFn === 'function' && newTalkingHeadReady) {
        console.log('🗣️ Forwarding to NewTalkingHead avatar:', text.substring(0, 50) + '...');
        newTalkingHeadFn(text);
      } else {
        console.warn('🗣️ NewTalkingHead function not available or not ready:', {
          newTalkingHeadFn: typeof newTalkingHeadFn,
          newTalkingHeadReady
        });
      }
    } catch (error) {
      console.error('🗣️ Error forwarding to NewTalkingHead:', error);
    }
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
    confidenceThreshold: 0.1,
    maxAlternatives: 3
  },
  tts: {
    voice: 'Google UK English Female',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.9
  }
}; 

// ============================================================================
// HELPERS: Approximate char -> viseme mapping for better lip realism
// ============================================================================
function charToApproxViseme(ch: string): string {
  const c = (ch || ' ').toLowerCase();
  if ('pbm'.includes(c)) return 'A'; // PP
  if ('kqg'.includes(c)) return 'B'; // kk/G
  if ('t d n l r'.replace(/\s/g, '').includes(c)) return 'C'; // I
  if ('a'.includes(c)) return 'D'; // AA
  if ('o'.includes(c)) return 'E'; // O
  if ('u w'.replace(/\s/g, '').includes(c)) return 'F'; // U
  if ('f v'.replace(/\s/g, '').includes(c)) return 'G'; // FF
  if ('th'.includes(c)) return 'H'; // TH
  return 'X';
}