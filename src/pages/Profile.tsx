import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import StudentDashboardLayout from '@/components/layout/StudentDashboardLayout';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ExperienceSection } from '@/components/profile/sections/ExperienceSection';
import { AboutSection } from '@/components/profile/sections/AboutSection';
import { SkillsSection } from '@/components/profile/sections/SkillsSection';
import { CertificationsSection } from '@/components/profile/sections/CertificationsSection';
import { ResumeSection } from '@/components/profile/sections/ResumeSection';
import { EditProfileModal } from '@/components/profile/modals/EditProfileModal';
import { AddExperienceModal } from '@/components/profile/modals/AddExperienceModal';
import { AddSkillModal } from '@/components/profile/modals/AddSkillModal';
import { AddCertificationModal } from '@/components/profile/modals/AddCertificationModal';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/context/AuthContext';

const Profile = () => {
  const { userId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { 
    profile, 
    experiences, 
    skills, 
    certifications, 
    resumeFiles,
    analytics,
    jobMatches,
    loading, 
    refetch 
  } = useProfile(userId);

  const isOwner = !userId || userId === user?.id;

  // Modal states
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addExperienceOpen, setAddExperienceOpen] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [addCertificationOpen, setAddCertificationOpen] = useState(false);

  // Prevent navigation when modals are open
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (editProfileOpen || addExperienceOpen || addSkillOpen || addCertificationOpen) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [editProfileOpen, addExperienceOpen, addSkillOpen, addCertificationOpen]);

  // Prevent accidental navigation
  useEffect(() => {
    const preventNavigation = (e: PopStateEvent) => {
      if (editProfileOpen || addExperienceOpen || addSkillOpen || addCertificationOpen) {
        e.preventDefault();
        // Close any open modal instead of navigating
        setEditProfileOpen(false);
        setAddExperienceOpen(false);
        setAddSkillOpen(false);
        setAddCertificationOpen(false);
        window.history.pushState(null, '', location.pathname);
      }
    };

    window.addEventListener('popstate', preventNavigation);
    return () => window.removeEventListener('popstate', preventNavigation);
  }, [editProfileOpen, addExperienceOpen, addSkillOpen, addCertificationOpen, location.pathname]);

  if (loading) {
    return (
      <StudentDashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </StudentDashboardLayout>
    );
  }

  return (
    <StudentDashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Enhanced Profile Header */}
          <ProfileHeader
            profile={profile}
            analytics={analytics}
            isOwner={isOwner}
            onEdit={() => setEditProfileOpen(true)}
            onProfileUpdate={refetch}
          />

          {/* Main Content */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <AboutSection
                  profile={profile}
                  isOwner={isOwner}
                  onEdit={() => setEditProfileOpen(true)}
                />

                {/* Experience Section */}
                <ExperienceSection
                  experiences={experiences}
                  isOwner={isOwner}
                  onAdd={() => setAddExperienceOpen(true)}
                />

                {/* Skills Section */}
                <SkillsSection
                  skills={skills}
                  isOwner={isOwner}
                  onAdd={() => setAddSkillOpen(true)}
                />
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                {/* Certifications Section */}
                <CertificationsSection
                  certifications={certifications}
                  isOwner={isOwner}
                  onAdd={() => setAddCertificationOpen(true)}
                />

                {/* Resume Section */}
                <ResumeSection
                  resumeFiles={resumeFiles}
                  analytics={analytics}
                  isOwner={isOwner}
                  onUpdate={refetch}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {editProfileOpen && (
          <EditProfileModal
            isOpen={editProfileOpen}
            onClose={() => setEditProfileOpen(false)}
            profile={profile}
            onUpdate={refetch}
          />
        )}

        {addExperienceOpen && (
          <AddExperienceModal
            isOpen={addExperienceOpen}
            onClose={() => setAddExperienceOpen(false)}
            onSuccess={refetch}
          />
        )}

        {addSkillOpen && (
          <AddSkillModal
            isOpen={addSkillOpen}
            onClose={() => setAddSkillOpen(false)}
            onSuccess={refetch}
          />
        )}

        {addCertificationOpen && (
          <AddCertificationModal
            isOpen={addCertificationOpen}
            onClose={() => setAddCertificationOpen(false)}
            onSuccess={refetch}
          />
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default Profile;
