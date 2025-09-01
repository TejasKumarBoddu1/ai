
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Lock, Medal, Shield, Award, CheckCircle } from 'lucide-react';

interface QwiXCertHeaderProps {
  title: string;
  subtitle?: string;
  showBadge?: boolean;
}

const QwiXCertHeader = ({ title, subtitle, showBadge = true }: QwiXCertHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <div className="flex items-center justify-center mb-3">
        <Shield className="h-8 w-8 text-modern-blue-500 mr-2" />
        <h2 className="text-3xl font-bold text-gray-900 font-sf-pro">
          {title}
        </h2>
      </div>
      
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4 font-poppins">
          {subtitle}
        </p>
      )}
      
      {showBadge && (
        <div className="flex justify-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>Blockchain-Verified</span>
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1">
            <Medal className="h-3 w-3" />
            <span>Trustless Credentials</span>
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <Award className="h-3 w-3" />
            <span>Web3 Certification</span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default QwiXCertHeader;
