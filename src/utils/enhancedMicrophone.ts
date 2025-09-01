
export interface MicrophoneConfig {
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  language?: string;
  audioConstraints?: MediaStreamConstraints['audio'];
}

export interface MicrophoneCallbacks {
  onResult?: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onSoundLevel?: (level: number) => void;
}

export class EnhancedMicrophone {
  private recognition: SpeechRecognition | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private isListening = false;
  private restartAttempts = 0;
  private maxRestartAttempts = 3;
  private restartTimeout: number | null = null;
  private soundLevelInterval: number | null = null;

  constructor(
    private config: MicrophoneConfig = {},
    private callbacks: MicrophoneCallbacks = {}
  ) {
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      this.callbacks.onError?.('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.setupRecognitionConfig();
    this.setupRecognitionEvents();
  }

  private setupRecognitionConfig() {
    if (!this.recognition) return;

    this.recognition.continuous = this.config.continuous ?? true;
    this.recognition.interimResults = this.config.interimResults ?? true;
    this.recognition.maxAlternatives = this.config.maxAlternatives ?? 1;
    this.recognition.lang = this.config.language ?? 'en-US';
  }

  private setupRecognitionEvents() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      console.log('Speech recognition started');
      this.isListening = true;
      this.restartAttempts = 0;
      this.callbacks.onStart?.();
      this.startSoundLevelMonitoring();
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        this.callbacks.onResult?.(finalTranscript, true);
      } else if (interimTranscript) {
        this.callbacks.onResult?.(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      // Handle specific errors
      switch (event.error) {
        case 'network':
          this.callbacks.onError?.('Network error occurred. Please check your connection.');
          break;
        case 'not-allowed':
          this.callbacks.onError?.('Microphone access denied. Please allow microphone permissions.');
          break;
        case 'no-speech':
          // Silently restart for no-speech errors
          this.attemptRestart();
          return;
        case 'audio-capture':
          this.callbacks.onError?.('Microphone not found or not working.');
          break;
        default:
          this.callbacks.onError?.(`Speech recognition error: ${event.error}`);
      }
      
      this.attemptRestart();
    };

    this.recognition.onend = () => {
      console.log('Speech recognition ended');
      this.isListening = false;
      this.stopSoundLevelMonitoring();
      
      // Auto-restart if we're supposed to be listening
      if (this.restartAttempts < this.maxRestartAttempts) {
        this.attemptRestart();
      } else {
        this.callbacks.onEnd?.();
      }
    };
  }

  private attemptRestart() {
    if (this.restartAttempts >= this.maxRestartAttempts) {
      console.log('Max restart attempts reached');
      this.callbacks.onEnd?.();
      return;
    }

    this.restartAttempts++;
    console.log(`Attempting to restart recognition (attempt ${this.restartAttempts})`);
    
    this.restartTimeout = window.setTimeout(() => {
      if (this.recognition && !this.isListening) {
        try {
          this.recognition.start();
        } catch (error) {
          console.error('Failed to restart recognition:', error);
          this.callbacks.onError?.('Failed to restart microphone. Please try again.');
        }
      }
    }, 1000);
  }

  private async setupAudioContext() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: this.config.audioConstraints || {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          // Enhanced audio quality settings
          channelCount: 1,
          sampleRate: 48000
        }
      });

      // Use proper AudioContext constructor with fallback
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (AudioContextConstructor) {
        this.audioContext = new AudioContextConstructor({
          latencyHint: 'interactive',
          sampleRate: 48000
        });
        
        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        
        // Add noise reduction and audio processing
        const compressor = this.audioContext.createDynamicsCompressor();
        compressor.threshold.value = -50;
        compressor.knee.value = 40;
        compressor.ratio.value = 12;
        compressor.attack.value = 0;
        compressor.release.value = 0.25;
        
        // Create analyser for volume detection
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 1024; // Increased for better frequency resolution
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;
        this.analyser.smoothingTimeConstant = 0.85;
        
        // Connect the audio processing chain
        source.connect(compressor);
        compressor.connect(this.analyser);
      }
    } catch (error) {
      console.error('Failed to setup audio context:', error);
      this.callbacks.onError?.('Failed to access microphone for sound level monitoring.');
    }
  }

  private startSoundLevelMonitoring() {
    if (!this.callbacks.onSoundLevel) return;

    this.setupAudioContext().then(() => {
      this.soundLevelInterval = window.setInterval(() => {
        if (this.analyser) {
          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          this.analyser.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          this.callbacks.onSoundLevel?.(average);
        }
      }, 100);
    });
  }

  private stopSoundLevelMonitoring() {
    if (this.soundLevelInterval) {
      clearInterval(this.soundLevelInterval);
      this.soundLevelInterval = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  public async startListening(): Promise<void> {
    if (!this.recognition) {
      this.callbacks.onError?.('Speech recognition not available');
      return;
    }

    if (this.isListening) {
      console.log('Already listening');
      return;
    }

    try {
      // Request microphone permissions first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.restartAttempts = 0;
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start listening:', error);
      this.callbacks.onError?.('Failed to start microphone. Please check permissions.');
    }
  }

  public stopListening(): void {
    this.isListening = false;
    
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
    }

    this.stopSoundLevelMonitoring();
    this.callbacks.onEnd?.();
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public updateCallbacks(newCallbacks: Partial<MicrophoneCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...newCallbacks };
  }

  public updateConfig(newConfig: Partial<MicrophoneConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.setupRecognitionConfig();
  }

  public destroy(): void {
    this.stopListening();
    this.stopSoundLevelMonitoring();
    this.recognition = null;
  }
}

// Factory function for easier usage
export const createEnhancedMicrophone = (
  config?: MicrophoneConfig,
  callbacks?: MicrophoneCallbacks
) => {
  return new EnhancedMicrophone(config, callbacks);
};
