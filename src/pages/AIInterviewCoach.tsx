
import React, { useEffect } from 'react';
import AIInterviewCoachComponent from '@/components/interview/AIInterviewCoachComponent';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { useLocation } from 'react-router-dom';

const AIInterviewCoach: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('AIInterviewCoach page mounted, location:', location.pathname);
    
    return () => {
      console.log('AIInterviewCoach page unmounting');
    };
  }, [location.pathname]);

  return (
    <StudentDashboardLayout>
      <AIInterviewCoachComponent />
    </StudentDashboardLayout>
  );
};

export default AIInterviewCoach;
