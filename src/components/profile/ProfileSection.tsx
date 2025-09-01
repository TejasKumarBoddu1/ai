
import React from 'react';
import { Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  isOwner: boolean;
  onEdit?: () => void;
  onAdd?: () => void;
  className?: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  title,
  children,
  isOwner,
  onEdit,
  onAdd,
  className = ''
}) => {
  return (
    <Card className={`${className}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {isOwner && (
          <div className="flex gap-2">
            {onAdd && (
              <Button variant="outline" size="sm" onClick={onAdd}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
