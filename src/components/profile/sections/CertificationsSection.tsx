
import React from 'react';
import { Award, ExternalLink, Download, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProfileSection } from '../ProfileSection';
import type { Certification } from '@/types/profile';
import { format } from 'date-fns';

interface CertificationsSectionProps {
  certifications: Certification[];
  isOwner: boolean;
  onAdd: () => void;
  onEdit?: (certification: Certification) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  isOwner,
  onAdd,
  onEdit
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const isExpired = (expirationDate?: string) => {
    if (!expirationDate) return false;
    return new Date(expirationDate) < new Date();
  };

  return (
    <ProfileSection
      title="Certifications & Licenses"
      isOwner={isOwner}
      onAdd={onAdd}
    >
      {certifications.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {certifications.map((cert) => (
            <div key={cert.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{cert.certification_name}</h4>
                    <p className="text-gray-600 text-sm">{cert.issuing_organization}</p>
                  </div>
                </div>
                {isOwner && onEdit && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(cert)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {cert.issue_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Issued: {formatDate(cert.issue_date)}</span>
                  </div>
                )}
                {cert.expiration_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Expires: {formatDate(cert.expiration_date)}
                      {isExpired(cert.expiration_date) && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Expired
                        </Badge>
                      )}
                    </span>
                  </div>
                )}
                {cert.credential_id && (
                  <p className="text-xs">Credential ID: {cert.credential_id}</p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {cert.certificate_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View
                    </a>
                  </Button>
                )}
                {cert.certificate_file_path && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                )}
                {cert.verification_url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={cert.verification_url} target="_blank" rel="noopener noreferrer">
                      Verify
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic text-center py-8">
          {isOwner 
            ? "Add your certifications to demonstrate your professional credentials."
            : "No certifications added yet."
          }
        </p>
      )}
    </ProfileSection>
  );
};
