
import React from 'react';
import { Certificate } from '@/types/certification';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ExternalLink, Award, Shield } from 'lucide-react';

interface CertificationsSectionProps {
  certificates: Certificate[];
}

const CertificationsSection = ({ certificates }: CertificationsSectionProps) => {
  // Only show public certificates
  const publicCertificates = certificates.filter(cert => cert.isPublic);
  
  if (publicCertificates.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold flex items-center mb-3">
        <Shield className="h-5 w-5 mr-2 text-modern-blue-500" /> 
        Verified Blockchain Certifications
      </h2>
      
      <div className="space-y-3">
        {publicCertificates.map((cert) => (
          <div 
            key={cert.id} 
            className="flex justify-between items-center p-2 rounded-md border border-blue-100 bg-blue-50"
          >
            <div className="flex items-center">
              <Award className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <span className="font-medium">{cert.title}</span>
                <div className="text-xs text-blue-700">
                  Issued {new Date(cert.issuedDate).toLocaleDateString()} • Score: {cert.score}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Badge variant="outline" className="bg-white mr-2 text-xs px-2">
                Blockchain Verified
              </Badge>
              
              <Link 
                to={`/verify-cert/${cert.certHash}`}
                className="text-blue-600 hover:text-blue-800"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Verify</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificationsSection;
