
import React, { useEffect } from 'react';
import InterviewCoachNew from '@/components/interview/InterviewCoachNew';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { useLocation } from 'react-router-dom';

const InterviewCoach: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log('InterviewCoach page mounted, location:', location.pathname);
    
    return () => {
      console.log('InterviewCoach page unmounting');
    };
  }, [location.pathname]);

  return (
    <StudentDashboardLayout>
      <InterviewCoachNew />
    </StudentDashboardLayout>
  );
};

export default InterviewCoach;
