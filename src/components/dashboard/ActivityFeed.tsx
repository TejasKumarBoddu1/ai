
import React from 'react';
import { Award, Shield, Clock, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { UserActivity } from '@/types/blockchain';

interface ActivityFeedProps {
  activities: UserActivity[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_taken':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'certificate_generated':
        return <Award className="h-4 w-4 text-primary" />;
      case 'document_added':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-start gap-3 pb-3 border-b">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <p className="font-medium">{activity.title}</p>
            <p className="text-sm text-muted-foreground">
              {activity.description}
              {activity.result?.score && ` - Score: ${activity.result.score}%`}
              {activity.result?.passed !== undefined && 
                ` - ${activity.result.passed ? 'Passed' : 'Failed'}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(activity.timestamp)}
            </p>
          </div>
          <Badge variant="outline" className="ml-auto mt-2">
            {activity.type === 'exam_taken' ? 'Test' : 
             activity.type === 'certificate_generated' ? 'Certificate' : 
             'Document'}
          </Badge>
        </div>
      ))}

      {activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No activities found</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
