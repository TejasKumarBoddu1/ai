
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Award, BookOpen, AlertTriangle, Loader2 } from "lucide-react";
import CertificateCard from "@/components/certification/CertificateCard";
import { Certificate } from "@/types/certification";
import { getUserCertificates, updateCertificateVisibility } from "@/utils/blockchain";
import { Link } from 'react-router-dom';

const CertificationsTab = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user certificates
    const fetchCertificates = () => {
      setIsLoading(true);
      try {
        const userCerts = getUserCertificates();
        setCertificates(userCerts);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);
  
  const handleUpdateVisibility = (certificateId: string, isPublic: boolean) => {
    updateCertificateVisibility(certificateId, isPublic);
    
    // Update local state
    setCertificates(prev => 
      prev.map(cert => 
        cert.id === certificateId ? { ...cert, isPublic } : cert
      )
    );
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Award className="h-5 w-5 text-primary mr-2" />
          Blockchain Certifications
        </CardTitle>
        <CardDescription>
          Manage your verifiable certificates and control which ones appear on your resume
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : certificates.length > 0 ? (
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <Award className="h-4 w-4 mr-2" />
                All Certificates ({certificates.length})
              </TabsTrigger>
              <TabsTrigger value="public" className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                Public ({certificates.filter(c => c.isPublic).length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {certificates.map(certificate => (
                  <CertificateCard 
                    key={certificate.id} 
                    certificate={certificate}
                    onUpdateVisibility={handleUpdateVisibility}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="public">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {certificates
                  .filter(cert => cert.isPublic)
                  .map(certificate => (
                    <CertificateCard 
                      key={certificate.id} 
                      certificate={certificate}
                      onUpdateVisibility={handleUpdateVisibility}
                    />
                  ))
                }
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-10 space-y-4">
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 max-w-md mx-auto mb-6">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">No Certificates Found</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You haven't earned any blockchain certificates yet. Take an assessment to get started.
                  </p>
                </div>
              </div>
            </div>
            
            <Button asChild>
              <Link to="/certification-center">
                <Award className="mr-2 h-4 w-4" />
                Explore Certification Tests
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CertificationsTab;
