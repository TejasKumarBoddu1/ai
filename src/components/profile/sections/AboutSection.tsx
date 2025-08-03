
import React from 'react';
import { ProfileSection } from '../ProfileSection';
import type { UserProfile } from '@/types/profile';

interface AboutSectionProps {
  profile: UserProfile | null;
  isOwner: boolean;
  onEdit: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  profile,
  isOwner,
  onEdit
}) => {
  return (
    <ProfileSection
      title="About"
      isOwner={isOwner}
      onEdit={onEdit}
    >
      <div className="prose max-w-none">
        {profile?.about_summary ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {profile.about_summary}
          </p>
        ) : (
          <p className="text-gray-500 italic">
            {isOwner 
              ? "Add a professional summary to help others understand your background and expertise."
              : "No summary provided."
            }
          </p>
        )}
      </div>
    </ProfileSection>
  );
};
