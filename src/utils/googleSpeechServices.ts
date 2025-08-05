// Enhanced Google Speech Services with advanced features and better accuracy
export interface GoogleSpeechConfig {
  apiKey?: string;
  language?: string;
  sampleRate?: number;
  // Enhanced config options
  alternativeLanguages?: string[];
  profanityFilter?: boolean;
  enableWordTimeOffsets?: boolean;
  enableWordConfidence?: boolean;
  model?: 'latest_long' | 'latest_short' | 'command_and_search' | 'phone_call' | 'video';
  useEnhanced?: boolean;
  maxAlternatives?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  // Enhanced result properties
  alternatives?: Array<{
    transcript: string;
    confidence: number;
    words?: Array<{
      word: string;
      startTime: number;
      endTime: number;
      confidence: number;
    }>;
  }>;
  languageCode?: string;
  stability?: number;
}

export interface TTSOptions {
  voice?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
  // Enhanced TTS options
  voiceGender?: 'MALE' | 'FEMALE' | 'NEUTRAL';
  ssmlText?: string;
  effectsProfile?: string[];
  audioEncoding?: 'MP3' | 'OGG_OPUS' | 'MULAW' | 'LINEAR16';
}

// Enhanced microphone management with advanced Google Speech features
export class EnhancedMicrophoneManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioStream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private isMutedDuringAIResponse = false;
  private recognition: SpeechRecognition | null = null;
  private isAISpeaking = false;
  private onTranscript?: (result: SpeechRecognitionResult) => void;
  private onError?: (error: string) => void;
  
  // Enhanced properties for better speech processing
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private streamingRecognitionActive = false;
  private lastTranscriptTime = 0;
  private confidenceThreshold = 0.7;
  private speechDetectionTimeout: NodeJS.Timeout | null = null;
  private adaptiveLanguageDetection = true;
  
  // Enhanced TTS coordination - FIXED: Reduced delay to allow hearing Ava's voice
  private speechEndTimeout: NodeJS.Timeout | null = null;
  private speechEndDelayMs = 1000; // Reduced from 2000ms to 1000ms for better user experience
  
  // Typing detection to prevent speech recognition during typing
  private isTyping = false;
  private typingTimeout: NodeJS.Timeout | null = null;

  constructor(
    private config: GoogleSpeechConfig = {},
    callbacks: {
      onTranscript?: (result: SpeechRecognitionResult) => void;
      onError?: (error: string) => void;
    } = {}
  ) {
    this.onTranscript = callbacks.onTranscript;
    this.onError = callbacks.onError;
    
    // Enhanced default configuration
    this.config = {
      language: 'en-US',
      sampleRate: 48000,
      alternativeLanguages: ['en-GB', 'en-AU', 'en-IN'],
      profanityFilter: false,
      enableWordTimeOffsets: true,
      enableWordConfidence: true,
      model: 'latest_long',
      useEnhanced: true,
      maxAlternatives: 3,
      ...config
    };
    
    this.confidenceThreshold = 0.7;
  }

  async startRecording(): Promise<void> {
    if (this.isRecording || this.isMutedDuringAIResponse) {
      console.log('🎤 Microphone blocked - already recording or muted for AI response');
      return;
    }

    try {
      // Enhanced audio constraints for better quality
      this.audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: this.config.sampleRate || 48000,
          channelCount: 1
        }
      });

      // Initialize enhanced audio processing
      this.initializeAudioProcessing();

      // Use enhanced Google Speech API if available
      if (this.config.apiKey) {
        await this.startEnhancedGoogleSpeechRecognition();
        return;
      }

      // Enhanced Web Speech API fallback
      this.startEnhancedWebSpeechRecognition();
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      this.onError?.('Failed to access microphone. Please check permissions.');
    }
  }

  private initializeAudioProcessing(): void {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.audioStream!);
      this.analyser = this.audioContext.createAnalyser();
      
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      source.connect(this.analyser);
      
      // Voice activity detection for better speech recognition
      this.startVoiceActivityDetection();
    } catch (error) {
      console.warn('Audio processing initialization failed:', error);
    }
  }

  private startVoiceActivityDetection(): void {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const detectVoiceActivity = () => {
      if (!this.analyser || this.isAISpeaking) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      
      // Enhanced voice activity detection algorithm
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      const speechFrequencies = dataArray.slice(10, 80); // Focus on speech frequencies
      const speechEnergy = speechFrequencies.reduce((sum, value) => sum + value, 0) / speechFrequencies.length;
      
      const isSpeechDetected = speechEnergy > 30 && average > 20;
      
      if (isSpeechDetected && !this.streamingRecognitionActive) {
        this.streamingRecognitionActive = true;
        console.log('🎤 Voice activity detected - starting recognition');
      }
      
      if (this.streamingRecognitionActive && !this.isAISpeaking) {
        requestAnimationFrame(detectVoiceActivity);
      }
    };
    
    detectVoiceActivity();
  }

  private async startEnhancedGoogleSpeechRecognition(): Promise<void> {
    this.mediaRecorder = new MediaRecorder(this.audioStream!, {
      mimeType: 'audio/webm;codecs=opus'
    });

    this.audioChunks = [];
    let processingQueue: Blob[] = [];
    let isProcessing = false;

    this.mediaRecorder.ondataavailable = async (event) => {
      if (event.data.size > 0 && !this.isAISpeaking) {
        processingQueue.push(event.data);
        
        // Process audio chunks in parallel for better responsiveness
        if (!isProcessing) {
          isProcessing = true;
          await this.processAudioQueue(processingQueue);
          processingQueue = [];
          isProcessing = false;
        }
      }
    };

    this.mediaRecorder.onstop = async () => {
      if (!this.isAISpeaking && processingQueue.length > 0) {
        await this.processAudioQueue(processingQueue);
      }
    };

    // Reduced chunk interval for better real-time performance
    this.mediaRecorder.start(500);
    this.isRecording = true;
    console.log('🎤 Enhanced Google Speech Recognition started');
  }

  private startEnhancedWebSpeechRecognition(): void {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      this.onError?.('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.config.language || 'en-US';
    this.recognition.maxAlternatives = this.config.maxAlternatives || 3;
    
    // Enhanced Web Speech settings - only set grammars if supported
    const grammar = this.createSpeechGrammar();
    if (grammar && this.recognition.grammars !== undefined) {
      this.recognition.grammars = grammar;
    }

    this.recognition.onstart = () => {
      console.log('🎤 Enhanced Web Speech Recognition started');
      this.isRecording = true;
    };

    this.recognition.onresult = (event) => {
      if (this.isAISpeaking || this.isMutedDuringAIResponse || this.isTyping) {
        console.log('🔇 Ignoring speech result - AI is speaking or user is typing');
        return;
      }

      const results = Array.from(event.results);
      const latestResult = results[results.length - 1];
      
      if (latestResult && latestResult[0].confidence > this.confidenceThreshold) {
        const transcript = latestResult[0].transcript.trim();
        
        // Filter out repetitive or invalid transcripts
        if (this.isRepetitiveTranscript(transcript)) {
          console.log('🔇 Ignoring repetitive transcript:', transcript);
          return;
        }
        
        // Filter out very short or noise-like transcripts
        if (transcript.length < 3 || this.isNoiseTranscript(transcript)) {
          console.log('🔇 Ignoring noise transcript:', transcript);
          return;
        }
        
        const alternatives = Array.from(latestResult).map(alt => ({
          transcript: alt.transcript,
          confidence: alt.confidence || 0.8
        }));

        this.onTranscript?.({
          transcript: transcript,
          confidence: latestResult[0].confidence || 0.8,
          isFinal: latestResult.isFinal,
          alternatives: alternatives.slice(0, this.config.maxAlternatives || 3),
          languageCode: this.config.language,
          stability: latestResult.isFinal ? 1.0 : 0.5
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Enhanced Speech recognition error:', event.error);
      if (!['no-speech', 'aborted', 'audio-capture'].includes(event.error)) {
        this.onError?.(`Speech recognition error: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      console.log('🎤 Enhanced Web Speech Recognition ended');
      this.isRecording = false;
      
      // Only restart if AI is not speaking and we're not intentionally muted
      if (!this.isMutedDuringAIResponse && !this.isAISpeaking) {
        setTimeout(() => {
          try {
            if (this.recognition && !this.isAISpeaking && !this.isMutedDuringAIResponse) {
              this.recognition.start();
            }
          } catch (error) {
            console.error('Failed to restart recognition:', error);
          }
        }, 1000); // Increased delay to prevent rapid restarts
      }
    };

    try {
      this.recognition.start();
      this.isRecording = true;
    } catch (error) {
      this.onError?.('Failed to start enhanced speech recognition');
    }
  }

  private createSpeechGrammar(): SpeechGrammarList | null {
    try {
      const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
      if (!SpeechGrammarList) return null;

      const grammar = new SpeechGrammarList();
      // Enhanced grammar for better recognition of common phrases
      const grammarString = `
        #JSGF V1.0; grammar commands;
        public <command> = (what | how | when | where | why | who | tell | show | explain | describe | help | please | thank | yes | no | stop | start | pause | resume | again | more | less | next | previous | back | forward | up | down | left | right | okay | alright | sure | certainly | absolutely | definitely | probably | maybe | perhaps | exactly | precisely | specifically | generally | basically | actually | really | truly | honestly | obviously | clearly | apparently | seemingly | presumably | allegedly | reportedly | supposedly | theoretically | practically | essentially | fundamentally | ultimately | eventually | finally | initially | originally | previously | recently | currently | now | today | tomorrow | yesterday | morning | afternoon | evening | night | time | date | year | month | week | day | hour | minute | second);
      `;
      grammar.addFromString(grammarString, 1);
      return grammar;
    } catch (error) {
      console.warn('Failed to create speech grammar:', error);
      return null;
    }
  }

  private async processAudioQueue(audioChunks: Blob[]): Promise<void> {
    if (audioChunks.length === 0 || !this.config.apiKey || this.isAISpeaking) return;

    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    
    try {
      const base64Audio = await this.blobToBase64(audioBlob);
      const result = await this.callEnhancedGoogleSpeechToText(base64Audio);
      
      if (result && !this.isAISpeaking) {
        this.onTranscript?.(result);
      }
    } catch (error) {
      console.error('Failed to process audio queue:', error);
      if (!this.isAISpeaking) {
        this.onError?.('Failed to process speech');
      }
    }
  }

  private async callEnhancedGoogleSpeechToText(base64Audio: string): Promise<SpeechRecognitionResult | null> {
    if (!this.config.apiKey || this.isAISpeaking) return null;

    try {
      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: this.config.sampleRate || 48000,
            languageCode: this.config.language || 'en-US',
            alternativeLanguageCodes: this.config.alternativeLanguages || ['en-GB', 'en-AU', 'en-IN'],
            enableAutomaticPunctuation: true,
            enableWordTimeOffsets: this.config.enableWordTimeOffsets || true,
            enableWordConfidence: this.config.enableWordConfidence || true,
            model: this.config.model || 'latest_long',
            useEnhanced: this.config.useEnhanced || true,
            maxAlternatives: this.config.maxAlternatives || 3,
            profanityFilter: this.config.profanityFilter || false,
            enableSpeakerDiarization: false,
            diarizationSpeakerCount: 1,
            enableSpokenPunctuation: true,
            enableSpokenEmojis: true,
            adaptation: {
              phraseSets: [{
                phrases: [
                  { value: "artificial intelligence", boost: 10 },
                  { value: "machine learning", boost: 10 },
                  { value: "neural network", boost: 10 },
                  { value: "deep learning", boost: 10 },
                  { value: "natural language processing", boost: 10 }
                ]
              }]
            }
          },
          audio: {
            content: base64Audio.split(',')[1]
          }
        })
      });

      const result = await response.json();
      
      if (result.results && result.results.length > 0) {
        const primaryResult = result.results[0];
        const alternatives = primaryResult.alternatives || [];
        const primaryAlternative = alternatives[0];
        
        return {
          transcript: primaryAlternative.transcript,
          confidence: primaryAlternative.confidence || 0.9,
          isFinal: true,
          alternatives: alternatives.slice(0, this.config.maxAlternatives || 3).map((alt: any) => ({
            transcript: alt.transcript,
            confidence: alt.confidence || 0.8,
            words: alt.words ? alt.words.map((word: any) => ({
              word: word.word,
              startTime: parseFloat(word.startTime?.seconds || 0) + (word.startTime?.nanos || 0) / 1000000000,
              endTime: parseFloat(word.endTime?.seconds || 0) + (word.endTime?.nanos || 0) / 1000000000,
              confidence: word.confidence || 0.8
            })) : undefined
          })),
          languageCode: result.results[0].languageCode || this.config.language,
          stability: 1.0
        };
      }
      
      return null;
    } catch (error) {
      console.error('Enhanced Google Speech-to-Text API error:', error);
      return null;
    }
  }

  stopRecording(): void {
    console.log('🔇 Stopping enhanced microphone recording');
    this.isRecording = false;
    this.streamingRecognitionActive = false;
    
    if (this.speechDetectionTimeout) {
      clearTimeout(this.speechDetectionTimeout);
      this.speechDetectionTimeout = null;
    }
    
    if (this.speechEndTimeout) {
      clearTimeout(this.speechEndTimeout);
      this.speechEndTimeout = null;
    }
    
    if (this.recognition) {
      try {
        this.recognition.stop();
        this.recognition = null;
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(track => track.stop());
      this.audioStream = null;
    }
  }

  // FIXED: Don't mute microphone during AI response - just pause recognition temporarily
  muteForAIResponse(): void {
    console.log('🔇 Pausing microphone recognition for AI response (but keeping mic active)');
    this.isMutedDuringAIResponse = true;
    this.isAISpeaking = true;
    
    // Only stop the recognition, not the entire microphone stream
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  // FIXED: Resume recognition after AI response with shorter delay
  resumeAfterAIResponse(): void {
    console.log('🎤 Resuming microphone recognition after AI response');
    this.isMutedDuringAIResponse = false;
    this.isAISpeaking = false;
    
    // Clear any existing timeout
    if (this.speechEndTimeout) {
      clearTimeout(this.speechEndTimeout);
    }
    
    // Shorter delay before resuming microphone recognition
    this.speechEndTimeout = setTimeout(() => {
      if (!this.isRecording && !this.isAISpeaking && !this.isMutedDuringAIResponse) {
        console.log('🎤 Actually starting enhanced microphone recording after delay');
        this.startRecording();
      }
    }, this.speechEndDelayMs);
  }

  // FIXED: Better coordination between AI speaking and microphone
  setAISpeakingState(isSpeaking: boolean): void {
    this.isAISpeaking = isSpeaking;
    if (isSpeaking) {
      console.log('🤖 AI started speaking - pausing microphone recognition');
      // Don't stop the microphone stream, just pause recognition
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
      
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop();
      }
    } else {
      console.log('🤖 AI finished speaking - scheduling microphone recognition resume');
      
      // Clear any existing timeout
      if (this.speechEndTimeout) {
        clearTimeout(this.speechEndTimeout);
      }
      
      // Shorter delay before resuming microphone recognition
      this.speechEndTimeout = setTimeout(() => {
        if (!this.isMutedDuringAIResponse) {
          console.log('🎤 Resuming microphone recognition after AI speech completion');
          this.startRecording();
        }
      }, this.speechEndDelayMs);
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording && !this.isMutedDuringAIResponse && !this.isAISpeaking;
  }

  // Enhanced utility methods
  setConfidenceThreshold(threshold: number): void {
    this.confidenceThreshold = Math.max(0.1, Math.min(1.0, threshold));
  }

  toggleAdaptiveLanguageDetection(enabled: boolean): void {
    this.adaptiveLanguageDetection = enabled;
  }
  
  // Temporarily disable speech recognition when typing is detected
  setTypingState(isTyping: boolean): void {
    this.isTyping = isTyping;
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    if (isTyping) {
      // Disable speech recognition immediately when typing starts
      if (this.recognition && this.isRecording) {
        try {
          this.recognition.stop();
        } catch (error) {
          console.error('Failed to stop recognition during typing:', error);
        }
      }
    } else {
      // Re-enable speech recognition after typing stops (with delay)
      this.typingTimeout = setTimeout(() => {
        if (!this.isAISpeaking && !this.isMutedDuringAIResponse) {
          try {
            if (this.recognition && !this.isRecording) {
              this.recognition.start();
            }
          } catch (error) {
            console.error('Failed to restart recognition after typing:', error);
          }
        }
      }, 2000); // Wait 2 seconds after typing stops
    }
  }

  setSpeechEndDelay(delayMs: number): void {
    this.speechEndDelayMs = Math.max(500, Math.min(3000, delayMs)); // Reduced range for better UX
  }
  
  // Filter out repetitive transcripts
  private isRepetitiveTranscript(transcript: string): boolean {
    const words = transcript.toLowerCase().split(/\s+/);
    if (words.length < 3) return false;
    
    // Check for repeated phrases
    const phrase = words.slice(0, 3).join(' ');
    const remainingWords = words.slice(3);
    
    for (let i = 0; i < remainingWords.length - 2; i++) {
      const checkPhrase = remainingWords.slice(i, i + 3).join(' ');
      if (checkPhrase === phrase) {
        return true; // Found repetition
      }
    }
    
    return false;
  }
  
  // Filter out noise-like transcripts
  private isNoiseTranscript(transcript: string): boolean {
    const lowerTranscript = transcript.toLowerCase();
    
    // Common noise patterns
    const noisePatterns = [
      /^[aeiou]+$/i, // Only vowels
      /^[bcdfghjklmnpqrstvwxyz]+$/i, // Only consonants
      /^(.)\1{2,}$/, // Repeated single character
      /^[^a-zA-Z\s]+$/, // No letters, only symbols/numbers
      /^(um|uh|ah|er|hmm|mmm|aaa|eee|ooo|iii|uuu)+$/i, // Filler sounds
    ];
    
    return noisePatterns.some(pattern => pattern.test(lowerTranscript));
  }
}

// Enhanced Text-to-Speech with advanced Google TTS features
export class EnhancedTextToSpeech {
  private currentAudio: HTMLAudioElement | null = null;
  private onSpeechStart?: () => void;
  private onSpeechEnd?: () => void;
  private audioQueue: HTMLAudioElement[] = [];
  private isProcessingQueue = false;
  private isSpeaking = false;
  private speechEndTimeout: NodeJS.Timeout | null = null;
  private preferredVoice: string | null = null;
  private speechQueue: string[] = [];
  private isProcessingSpeechQueue = false;

  constructor(
    private config: GoogleSpeechConfig = {},
    callbacks: {
      onSpeechStart?: () => void;
      onSpeechEnd?: () => void;
    } = {}
  ) {
    this.onSpeechStart = callbacks.onSpeechStart;
    this.onSpeechEnd = callbacks.onSpeechEnd;
    
    // Log available voices when initialized
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (window.speechSynthesis.getVoices().length > 0) {
        this.logAvailableVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = this.logAvailableVoices.bind(this);
      }
    }
  }
  
  // Log all available voices for debugging
  private logAvailableVoices(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const voices = window.speechSynthesis.getVoices();
    console.log('TTS Available voices:', voices.length);
    voices.forEach(voice => {
      console.log(`Voice: ${voice.name}, Lang: ${voice.lang}, Default: ${voice.default}, Local: ${voice.localService}`);
    });
    
    // Try to find and set a good female voice
    this.findAndSetFemaleVoice();
  }
  
  // Find and set a good female voice
  private findAndSetFemaleVoice(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const voices = window.speechSynthesis.getVoices();
    
    // First try to find Google UK English Female specifically
    const ukFemaleVoice = voices.find(v => 
      v.name === 'Google UK English Female' || 
      v.name.includes('Google UK English Female')
    );
    
    if (ukFemaleVoice) {
      this.preferredVoice = ukFemaleVoice.name;
      console.log(`Found and set preferred voice: Google UK English Female`);
      return;
    }
    
    // List of other preferred female voice names as fallback
    const preferredFemaleVoices = [
      'Google US English Female',
      'Microsoft Zira Desktop',
      'Samantha',
      'Victoria',
      'Karen',
      'Microsoft Aria'
    ];
    
    // Try to find a preferred female voice
    for (const voiceName of preferredFemaleVoices) {
      const voice = voices.find(v => 
        v.name.includes(voiceName) && 
        v.lang.includes('en')
      );
      
      if (voice) {
        this.preferredVoice = voice.name;
        console.log(`Google UK English Female not found. Using fallback: ${voice.name}`);
        return;
      }
    }
    
    // Fallback to any female voice
    const femaleVoice = voices.find(v => 
      (v.name.toLowerCase().includes('female') || 
       !v.name.toLowerCase().includes('male')) && 
      v.lang.includes('en')
    );
    
    if (femaleVoice) {
      this.preferredVoice = femaleVoice.name;
      console.log(`No preferred female voices found. Using: ${femaleVoice.name}`);
    }
  }

  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    // Add to speech queue
    this.speechQueue.push(text);
    
    // If already processing queue, just add to it
    if (this.isProcessingSpeechQueue) {
      console.log('🗣️ Added to speech queue, will process when current speech finishes');
      return;
    }
    
    // Start processing the queue
    this.processSpeechQueue(options);
  }
  
  private async processSpeechQueue(options: TTSOptions = {}): Promise<void> {
    if (this.isProcessingSpeechQueue || this.speechQueue.length === 0) {
      return;
    }
    
    this.isProcessingSpeechQueue = true;
    
    while (this.speechQueue.length > 0) {
      const text = this.speechQueue.shift()!;
      
      console.log('🗣️ Processing speech from queue:', text.substring(0, 50) + '...');
      this.isSpeaking = true;
      
      // Ensure we have a female voice
      if (this.preferredVoice && !options.voice) {
        options.voice = this.preferredVoice;
        console.log(`Using preferred female voice: ${this.preferredVoice}`);
      }
      
      // Always set female gender
      options.voiceGender = 'FEMALE';
      
      // Adjust pitch for female voice if not set
      if (!options.pitch) {
        options.pitch = 0.5;
      }

      // Add retry mechanism for interrupted speech
      const maxRetries = 2;
      let retryCount = 0;

      const attemptSpeech = async () => {
        try {
          if (this.config.apiKey) {
            await this.speakWithEnhancedGoogleTTS(text, options);
          } else {
            this.speakWithEnhancedWebAPI(text, options);
          }
        } catch (error) {
          console.error('Speech error, attempting retry:', error);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(() => {
              attemptSpeech();
            }, 1000); // Wait 1 second before retry
          } else {
            console.error('Speech failed after all retries');
            this.isSpeaking = false;
            this.onSpeechEnd?.();
          }
        }
      };

      await attemptSpeech();
      
      // Wait for speech to finish before processing next
      await new Promise(resolve => {
        const checkSpeaking = () => {
          if (!this.isSpeaking) {
            resolve(undefined);
          } else {
            setTimeout(checkSpeaking, 100);
          }
        };
        checkSpeaking();
      });
    }
    
    this.isProcessingSpeechQueue = false;
  }

  private async speakWithEnhancedGoogleTTS(text: string, options: TTSOptions): Promise<void> {
    if (!this.config.apiKey) return;

    try {
      // Split long text into chunks for better synthesis
      const textChunks = this.splitTextIntoChunks(text);
      
      for (const chunk of textChunks) {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.config.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: { text: chunk },
            voice: {
              languageCode: this.config.language || 'en-GB',
              name: options.voice || 'en-GB-Standard-F',
              ssmlGender: 'FEMALE'
            },
            audioConfig: {
              audioEncoding: 'MP3',
              sampleRateHertz: 24000
            }
          })
        });

        const result = await response.json();
        
        if (result.audioContent) {
          const audioBlob = this.base64ToBlob(result.audioContent, 'audio/mp3');
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const audio = new Audio(audioUrl);
          audio.preload = 'auto';
          
          this.audioQueue.push(audio);
        }
      }
      
      await this.processAudioQueue();
      
    } catch (error) {
      console.error('Google TTS error:', error);
      this.speakWithEnhancedWebAPI(text, options);
    }
  }

  private splitTextIntoChunks(text: string, maxLength: number = 3000): string[] {
    if (text.length <= maxLength) return [text];
    
    const chunks: string[] = [];
    // Split by sentences more carefully to avoid breaking mid-sentence
    const sentences = text.split(/(?<=[.!?])\s+/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;
      
      // If adding this sentence would exceed the limit
      if (currentChunk.length + trimmedSentence.length + 1 > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        // If a single sentence is too long, split it by commas
        if (trimmedSentence.length > maxLength) {
          const subSentences = trimmedSentence.split(/(?<=,)\s+/);
          for (const subSentence of subSentences) {
            if (subSentence.trim()) {
              chunks.push(subSentence.trim());
            }
          }
        } else {
          currentChunk = trimmedSentence;
        }
      } else {
        currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  private async processAudioQueue(): Promise<void> {
    if (this.isProcessingQueue || this.audioQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    for (const audio of this.audioQueue) {
      await new Promise<void>((resolve) => {
        this.currentAudio = audio;
        
        audio.onplay = () => {
          if (this.audioQueue.indexOf(audio) === 0) {
            this.isSpeaking = true;
            this.onSpeechStart?.();
          }
        };
        
        audio.onended = () => {
          if (this.audioQueue.indexOf(audio) === this.audioQueue.length - 1) {
            // Immediate callback for better responsiveness
            this.isSpeaking = false;
            this.onSpeechEnd?.();
          }
          URL.revokeObjectURL(audio.src);
          resolve();
        };
        
        audio.onerror = (error) => {
          console.error('Audio playback error:', error);
          resolve();
        };
        
        audio.play().catch(error => {
          console.error('Audio play error:', error);
          resolve();
        });
      });
    }
    
    this.audioQueue = [];
    this.isProcessingQueue = false;
  }

  private speakWithEnhancedWebAPI(text: string, options: TTSOptions): void {
    if (typeof window === 'undefined') return;

    // Don't cancel ongoing speech - let it finish naturally
    // speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get available voices
    const voices = speechSynthesis.getVoices();
    console.log(`Selecting from ${voices.length} available voices`);
    
    // Try to find Google UK English Female
    const ukFemaleVoice = voices.find(voice => 
      voice.name === 'Google UK English Female' || 
      voice.name.includes('Google UK English Female')
    );
    
    if (ukFemaleVoice) {
      utterance.voice = ukFemaleVoice;
      console.log('Using Google UK English Female voice');
    } else if (options.voice) {
      // Try to use specified voice if provided
      const specifiedVoice = voices.find(voice => 
        voice.name === options.voice || voice.name.includes(options.voice as string)
      );
      
      if (specifiedVoice) {
        utterance.voice = specifiedVoice;
        console.log(`Using specified voice: ${specifiedVoice.name}`);
      } else {
        // Fallback to any female voice
        const femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes('female') && 
          voice.lang.includes('en')
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
          console.log(`Using fallback female voice: ${femaleVoice.name}`);
        }
      }
    }
    
    // Enhanced speech parameters for better quality
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0; // Natural pitch
    utterance.volume = 0.9; // Good volume level
    utterance.text = text;
    
    utterance.onstart = () => {
      this.isSpeaking = true;
      this.onSpeechStart?.();
    };
    
    utterance.onend = () => {
      // Immediate callback for better responsiveness
      this.isSpeaking = false;
      this.onSpeechEnd?.();
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      this.isSpeaking = false;
      this.onSpeechEnd?.();
    };
    
    // Add boundary event to track progress
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        // Optional: Add progress tracking here
      }
    };
    
    speechSynthesis.speak(utterance);
  }
  
  // Add natural pauses to text for more human-like speech
  private addNaturalPauses(text: string): string {
    // Return the original text without modifications
    return text;
  }

  stop(): void {
    if (this.speechEndTimeout) {
      clearTimeout(this.speechEndTimeout);
      this.speechEndTimeout = null;
    }
    
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    // Clear audio queue
    this.audioQueue.forEach(audio => {
      audio.pause();
      URL.revokeObjectURL(audio.src);
    });
    this.audioQueue = [];
    this.isProcessingQueue = false;
    
    // Clear speech queue
    this.speechQueue = [];
    this.isProcessingSpeechQueue = false;
    
    if (typeof window !== 'undefined') {
      speechSynthesis.cancel();
    }
    
    this.isSpeaking = false;
  }

  private base64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }

  // Enhanced utility methods
  async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
      } else {
        speechSynthesis.onvoiceschanged = () => {
          resolve(speechSynthesis.getVoices());
        };
      }
    });
  }

  setVoicePreference(voiceName: string): void {
    // Store voice preference for future use
    localStorage.setItem('preferredVoice', voiceName);
  }

  isSpeechActive(): boolean {
    return this.isSpeaking;
  }
}
