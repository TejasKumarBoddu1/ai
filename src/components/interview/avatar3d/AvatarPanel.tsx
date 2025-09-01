import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import AvatarStage, { AvatarMessage } from './AvatarStage';

interface AvatarPanelProps {
  message?: AvatarMessage | null;
}

const AvatarPanel: React.FC<AvatarPanelProps> = ({ message }) => {
  return (
    <Card style={{ width: 364, height: 270 }} className="rounded-2xl shadow-xl bg-gradient-to-br from-white to-pink-50/30 border border-pink-100/50 flex flex-col">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-pink-600" />
          <CardTitle className="text-base font-semibold">Devi (HR)</CardTitle>
        </div>
        <Badge className="bg-pink-100 text-pink-700 text-xs font-semibold border border-pink-200">
          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse mr-1"></div>
          Active
        </Badge>
      </CardHeader>
      <CardContent className="p-2 flex items-center justify-center flex-1">
        <div style={{ width: 346, height: 193 }} className="flex items-center justify-center bg-black rounded-lg overflow-hidden border border-slate-200">
          <AvatarStage message={message} />
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarPanel;


