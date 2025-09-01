import React from 'react';
import SimpleAvatar from './SimpleAvatar';

interface AvatarStageProps {
  isSpeaking?: boolean;
  visemeHint?: string;
  reactionTrigger?: number;
}

const AvatarStage: React.FC<AvatarStageProps> = ({ isSpeaking, visemeHint }) => {
  return (
    <div className="w-full h-full relative">
      <SimpleAvatar width={346} height={193} isSpeaking={isSpeaking} visemeHint={visemeHint} />
    </div>
  );
};

export default AvatarStage;


