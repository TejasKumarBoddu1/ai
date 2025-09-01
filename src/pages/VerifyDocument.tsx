
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DocumentVerifier from '@/components/blockchain/DocumentVerifier';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Fingerprint, QrCode } from 'lucide-react';

const VerifyDocument = () => {
  const { uniqueId } = useParams<{ uniqueId: string }>();
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // If this is a QR code scan request, we could initialize a QR scanner here
    if (uniqueId === 'scan') {
      setIsScanning(true);
    }
    
    // Simulate faster loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [uniqueId]);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-10 animate-pulse">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <div className="h-10 w-10 bg-primary/20 rounded-full" />
                </div>
              </div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Fingerprint className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Blockchain Document Verification</h1>
            <p className="text-muted-foreground mt-2">
              Verify the authenticity and integrity of documents secured on the blockchain
            </p>
          </div>
          
          {isScanning ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Scan QR Code
                </CardTitle>
                <CardDescription>
                  Scan a document QR code to verify its authenticity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">
                    QR scanner would be implemented here in a production environment
                  </p>
                  <p className="text-sm text-muted-foreground">
                    For demonstration purposes, please enter the document unique ID manually
                  </p>
                </div>
                
                <DocumentVerifier />
              </CardContent>
            </Card>
          ) : (
            <DocumentVerifier uniqueId={uniqueId} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default VerifyDocument;
