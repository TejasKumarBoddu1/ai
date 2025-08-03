
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProfileSection } from '../ProfileSection';
import type { Skill } from '@/types/profile';

interface SkillsSectionProps {
  skills: Skill[];
  isOwner: boolean;
  onAdd: () => void;
  onEdit?: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  isOwner,
  onAdd,
  onEdit
}) => {
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <ProfileSection
      title="Skills"
      isOwner={isOwner}
      onAdd={onAdd}
      onEdit={onEdit}
    >
      {skills.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
              <div className="grid gap-3">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-medium text-gray-800 min-w-0 flex-1">
                        {skill.skill_name}
                      </span>
                      {skill.proficiency_level && (
                        <div className="flex items-center gap-2 w-32">
                          <Progress 
                            value={skill.proficiency_level * 20} 
                            className="h-2"
                          />
                          <span className="text-xs text-gray-500 w-8">
                            {skill.proficiency_level}/5
                          </span>
                        </div>
                      )}
                    </div>
                    {skill.endorsement_count > 0 && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        {skill.endorsement_count} endorsements
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-center py-8">
          {isOwner 
            ? "Add your skills to showcase your expertise."
            : "No skills added yet."
          }
        </p>
      )}
    </ProfileSection>
  );
};
