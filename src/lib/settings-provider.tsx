
"use client";

import { createContext, useContext, ReactNode, useState } from "react";

export interface Settings {
  exampleSetting?: string;
  prompt?: string;
  vaultPath?: string;
  logTimeWindow?: number;
  logPageSize?: number;
  logModel?: string;
  analysisModel?: string;
  analysisTimeWindow?: number;
  deduplicationEnabled?: boolean;
  screenpipeAppSettings?: {
    enableRealtimeAudioTranscription?: boolean;
    openaiApiKey?: string;
    customSettings?: any;
  };
  openaiApiKey?: string;
}

const DEFAULT_SETTINGS: Settings = {
  exampleSetting: "default value",
  prompt: "Interview coach assistant",
  vaultPath: "",
  logTimeWindow: 5,
  logPageSize: 50,
  logModel: "gpt-4",
  analysisModel: "gpt-4",
  analysisTimeWindow: 10,
  deduplicationEnabled: true,
  screenpipeAppSettings: {
    enableRealtimeAudioTranscription: false,
    openaiApiKey: "",
  },
};

type SettingsContextType = {
  settings: Settings | null;
  updateSettings: (newSettings: Partial<Settings>) => Promise<boolean>;
  loading: boolean;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  const updateSettings = async (newSettings: Partial<Settings>): Promise<boolean> => {
    try {
      setLoading(true);
      setSettings(prev => ({ ...prev, ...newSettings }));
      console.log("Settings updated successfully");
      return true;
    } catch (error) {
      console.error("Failed to update settings:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    settings,
    updateSettings,
    loading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
