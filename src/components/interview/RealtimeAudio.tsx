
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, MicOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMetrics } from "@/context/MetricsContext";
import { useSettings } from "@/lib/settings-provider";

interface TranscriptionChunk {
  transcription: string;
  timestamp: string;
  device: string;
  is_input: boolean;
  is_final: boolean;
}

interface RealtimeAudioProps {
  onDataChange?: (data: any, error: string | null) => void;
  isInterviewActive?: boolean;
}

export function RealtimeAudio({ onDataChange, isInterviewActive = false }: RealtimeAudioProps) {
  const [transcription, setTranscription] = useState<TranscriptionChunk | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState("");
  const [audioSrc, setAudioSrc] = useState<string>("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isResponding, setIsResponding] = useState<boolean>(false);
  
  const isStreamingRef = useRef(false);
  const historyRef = useRef(history);
  const transcriptionRef = useRef("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  
  const { toast } = useToast();
  const { metrics } = useMetrics();
  const { settings } = useSettings();

  // Update ref when history changes
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const startStreaming = async () => {
    try {
      setError(null);
      setIsStreaming(true);
      isStreamingRef.current = true;

      // Check if Speech Recognition API is supported
      if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        throw new Error("Speech recognition is not supported in this browser.");
      }

      // Create speech recognition instance
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          const chunk: TranscriptionChunk = {
            transcription: finalTranscript,
            timestamp: new Date().toISOString(),
            device: "microphone",
            is_input: true,
            is_final: true,
          };

          setTranscription(chunk);
          transcriptionRef.current += " " + chunk.transcription;

          if (onDataChange) {
            onDataChange(chunk, null);
          }

          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
          }
          
          debounceTimeoutRef.current = setTimeout(() => {
            const newHistory = historyRef.current + "You: " + transcriptionRef.current + "\n";
            setHistory(newHistory);
            historyRef.current = newHistory;

            if (isInterviewActive) {
              generateAudio();
            }
            
            transcriptionRef.current = "";
            debounceTimeoutRef.current = null;
          }, 3000);
        }
      };
      
      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        const errorMessage = `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        if (onDataChange) {
          onDataChange(null, errorMessage);
        }
      };
      
      recognition.start();
      recognitionRef.current = recognition;

      toast({
        title: "Audio streaming started",
        description: "Your speech is being transcribed in real-time.",
      });

    } catch (error) {
      console.error("Audio stream failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to start audio streaming";
      setError(errorMessage);
      if (onDataChange) {
        onDataChange(null, errorMessage);
      }
      setIsStreaming(false);
      isStreamingRef.current = false;
    }
  };

  const stopStreaming = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsStreaming(false);
    isStreamingRef.current = false;
    
    toast({
      title: "Audio streaming stopped",
      description: "Speech transcription has been paused.",
    });
  };

  const generateAudio = async () => {
    if (!isStreamingRef.current) return;
    
    setIsResponding(true);
    try {
      const response = await fetch('/api/whisper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: transcriptionRef.current,
          history: historyRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio response');
      }

      const data = await response.json();
      
      if (data.audio) {
        const binaryString = atob(data.audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newHistory = historyRef.current + "Interviewer: " + data.transcription + "\n";
        setHistory(newHistory);
        historyRef.current = newHistory;
        setAudioSrc(audioUrl);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
      setError("Error generating audio response");
    } finally {
      setIsResponding(false);
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: JSON.stringify(metrics),
          history: history,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.message);
      
      toast({
        title: "Summary generated",
        description: "Your interview performance summary is ready.",
      });
    } catch (err) {
      console.error("Error generating summary:", err);
      const errorMessage = "Failed to generate summary. Please try again.";
      setSummary(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const renderTranscriptionContent = () => {
    return (
      <div className="space-y-2 text-xs">
        <div className="flex flex-col text-slate-600">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-semibold">Timestamp: </span>
              <span>
                {transcription ? new Date(transcription.timestamp).toLocaleString() : ""}
              </span>
            </div>
            <div>
              <span className="font-semibold">Device: </span>
              <span>{transcription ? transcription.device : ""}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 rounded p-2 overflow-auto max-h-[100px] whitespace-pre-wrap font-mono text-xs">
          {transcription ? transcription.transcription : ""}
        </div>

        <div className="mt-2">
          <div className="text-slate-600 font-semibold mb-1">Conversation History:</div>
          <div className="bg-slate-100 rounded p-2 overflow-auto h-[130px] whitespace-pre-wrap font-mono text-xs">
            {history || "No conversation history yet..."}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={isStreaming ? stopStreaming : startStreaming}
          size="sm"
          variant={isStreaming ? "destructive" : "default"}
          className="flex items-center gap-2"
        >
          {isStreaming ? (
            <>
              <MicOff className="h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>

        {history && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateSummary}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Generate Summary"
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHistory("");
                setSummary(null);
                setTranscription(null);
              }}
            >
              Clear History
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Transcription Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Real-time Transcription</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTranscriptionContent()}
        </CardContent>
      </Card>

      {/* Interview Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interview Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 rounded p-4 overflow-auto max-h-[300px] whitespace-pre-wrap text-sm">
              {summary}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Response */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Interviewer Audio Response
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={isStreaming && isResponding ? "destructive" : "default"}
                className={
                  isStreaming
                    ? isResponding
                      ? "bg-orange-500"
                      : "bg-green-500"
                    : "bg-gray-500"
                }
              >
                {isStreaming
                  ? isResponding
                    ? "Generating Response..."
                    : "Listening"
                  : "Inactive"}
              </Badge>
            </div>
          </div>
          {audioSrc && (
            <audio controls src={audioSrc} autoPlay className="w-full mt-3">
              Your browser does not support the audio element.
            </audio>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
