
import React from 'react';
import { Plus, Edit, MapPin, Users, DollarSign, TrendingUp, Award, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileSection } from '@/components/profile/ProfileSection';
import type { Experience } from '@/types/profile';

interface ExperienceSectionProps {
  experiences: Experience[];
  isOwner: boolean;
  onAdd: () => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  isOwner,
  onAdd
}) => {
  const formatCurrency = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatDateRange = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    if (isCurrent) return `${start} - Present`;
    if (!endDate) return `${start} - Present`;
    
    const end = new Date(endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    return `${start} - ${end}`;
  };

  const calculateDuration = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate);
    const end = isCurrent || !endDate ? new Date() : new Date(endDate);
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years}y ${months}m`;
    }
    return `${months}m`;
  };

  return (
    <ProfileSection
      title="Experience"
      isOwner={isOwner}
      onAdd={onAdd}
      className="bg-white rounded-xl shadow-sm border border-gray-200"
    >
      {experiences.length > 0 ? (
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <div key={experience.id} className={`pb-6 ${index < experiences.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <div className="flex gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                  {experience.company_logo_url ? (
                    <img
                      src={experience.company_logo_url}
                      alt={`${experience.company_name} logo`}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {experience.company_name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Experience Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {experience.job_title}
                        {experience.is_current && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            Current
                          </Badge>
                        )}
                      </h3>
                      <p className="text-gray-700 font-medium flex items-center gap-2">
                        {experience.company_name}
                        {experience.employment_type && (
                          <Badge variant="outline" className="text-xs">
                            {experience.employment_type}
                          </Badge>
                        )}
                      </p>
                    </div>
                    {isOwner && (
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Duration and Location */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="font-medium">
                      {formatDateRange(experience.start_date, experience.end_date, experience.is_current)}
                    </span>
                    <span>•</span>
                    <span>{calculateDuration(experience.start_date, experience.end_date, experience.is_current)}</span>
                    {experience.location && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{experience.location}</span>
                          {experience.is_remote && (
                            <Badge variant="outline" className="text-xs ml-1">Remote</Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Key Metrics Row */}
                  {(experience.team_size || experience.budget_managed || experience.direct_reports) && (
                    <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                      {experience.team_size && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <Users className="h-4 w-4" />
                          <span>Team: {experience.team_size}</span>
                        </div>
                      )}
                      {experience.budget_managed && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <DollarSign className="h-4 w-4" />
                          <span>Budget: {formatCurrency(experience.budget_managed)}</span>
                        </div>
                      )}
                      {experience.direct_reports && experience.direct_reports > 0 && (
                        <div className="flex items-center gap-1 text-gray-700">
                          <Users className="h-4 w-4" />
                          <span>{experience.direct_reports} direct reports</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Impact Metrics */}
                  {(experience.revenue_impact || experience.cost_savings) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {experience.revenue_impact && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {experience.revenue_impact}
                        </Badge>
                      )}
                      {experience.cost_savings && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          <Award className="h-3 w-3 mr-1" />
                          {experience.cost_savings}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {experience.description && (
                    <p className="text-gray-700 leading-relaxed mb-3">
                      {experience.description}
                    </p>
                  )}

                  {/* Achievements */}
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {experience.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills Used */}
                  {experience.skills_used && experience.skills_used.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-1">
                        {experience.skills_used.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Media Links */}
                  {experience.media_links && experience.media_links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {experience.media_links.map((link, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a href={link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Project
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 italic">
            {isOwner 
              ? "Add your work experience to showcase your professional journey."
              : "No experience added yet."
            }
          </p>
        </div>
      )}
    </ProfileSection>
  );
};
