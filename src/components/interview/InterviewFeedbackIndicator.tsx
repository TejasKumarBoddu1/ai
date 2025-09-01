
import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface FeedbackIndicatorProps {
  type: 'posture' | 'voice' | 'appearance' | 'filler' | 'info';
  message: string;
  severity: 'error' | 'warning' | 'success' | 'info';
  isVisible: boolean;
}

const InterviewFeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({
  type,
  message,
  severity,
  isVisible
}) => {
  if (!isVisible) return null;
  
  const getSeverityStyles = () => {
    switch (severity) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getTypeIcon = () => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 mr-1.5" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 mr-1.5" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 mr-1.5" />;
      case 'info':
        return <Info className="h-4 w-4 mr-1.5" />;
      default:
        return <Info className="h-4 w-4 mr-1.5" />;
    }
  };
  
  const getTypeLabel = () => {
    switch (type) {
      case 'posture':
        return 'Posture';
      case 'voice':
        return 'Voice';
      case 'appearance':
        return 'Appearance';
      case 'filler':
        return 'Filler Words';
      case 'info':
        return 'Tip';
      default:
        return 'Feedback';
    }
  };
  
  return (
    <div className={`flex items-center text-sm rounded-md border px-3 py-2 mb-2 ${getSeverityStyles()} animate-fade-in`}>
      {getTypeIcon()}
      <span className="font-medium mr-1">{getTypeLabel()}:</span>
      <span>{message}</span>
    </div>
  );
};

export default InterviewFeedbackIndicator;
