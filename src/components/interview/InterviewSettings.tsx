
import React from "react";
import { Slider } from "@/components/ui/slider";

interface InterviewSettingsProps {
  timePerQuestion: number; // in seconds
  onTimeChange: (time: number) => void;
}

export const InterviewSettings = ({
  timePerQuestion,
  onTimeChange
}: InterviewSettingsProps) => {
  const handleTimeChange = (value: number[]) => {
    onTimeChange(value[0]);
  };
  
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Time Per Question</label>
        <span className="text-sm text-muted-foreground">
          {formatTime(timePerQuestion)}
        </span>
      </div>
      <Slider
        defaultValue={[timePerQuestion]}
        min={30}
        max={300}
        step={30}
        onValueChange={handleTimeChange}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>30s</span>
        <span>1m</span>
        <span>2m</span>
        <span>3m</span>
        <span>4m</span>
        <span>5m</span>
      </div>
    </div>
  );
};
