
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MediaPipeAnalysis } from '@/types/mediapipe';

interface MetricsContextType {
  metrics: MediaPipeAnalysis | null;
  updateMetrics: (newMetrics: MediaPipeAnalysis) => void;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<MediaPipeAnalysis | null>(null);

  const updateMetrics = (newMetrics: MediaPipeAnalysis) => {
    setMetrics(newMetrics);
  };

  return (
    <MetricsContext.Provider value={{ metrics, updateMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricsContext);
  if (context === undefined) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
}
