
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useBlockchain } from '@/context/BlockchainContext';
import { VaultRoom } from '@/components/blockchain/VaultRoom';
import { DocumentUploader } from '@/components/blockchain/DocumentUploader';
import DocumentsDashboard from '@/components/blockchain/DocumentsDashboard';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Upload, Database, FileText } from "lucide-react";
import { ConnectWalletPrompt } from '@/components/blockchain/ConnectWalletPrompt';
import { useAuth } from '@/context/AuthContext';

const BlockchainVault = () => {
  const { isConnected } = useBlockchain();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('vault');
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-2">QwiXEd360°Suite Blockchain Vault</h1>
        <p className="text-muted-foreground mb-8">
          Securely store, manage, and verify your professional documents using blockchain technology
        </p>
        
        {!isConnected ? (
          <ConnectWalletPrompt />
        ) : (
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="vault" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Digital Vault
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                Document Dashboard
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="vault">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Your Digital Vault Room
                  </CardTitle>
                  <CardDescription>
                    An immersive view of your blockchain-secured document storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VaultRoom />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-primary" />
                    Upload to Blockchain
                  </CardTitle>
                  <CardDescription>
                    Securely store your documents on the blockchain with tamper-proof verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentUploader onUploadComplete={() => setActiveTab('documents')} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Your Blockchain Documents
                  </CardTitle>
                  <CardDescription>
                    Manage and verify your documents secured on the blockchain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentsDashboard />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default BlockchainVault;
