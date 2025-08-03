
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/context/BlockchainContext';
import { useAuth } from '@/context/AuthContext';
import { getUserDocumentsByOwner } from '@/utils/blockchainDocuments';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink } from 'lucide-react';
import type { BlockchainDocument } from '@/types/blockchain';

const QwixVaultProfile = () => {
  const { account, isConnected, connectWallet, getUserQwixVaultId } = useBlockchain();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<BlockchainDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate the QwixVault ID based on authenticated user
  const qwixVaultId = getUserQwixVaultId(); // Get vault ID from context
  
  useEffect(() => {
    if (account) {
      // Get documents for the connected wallet
      const userDocs = getUserDocumentsByOwner(account);
      setDocuments(userDocs);
      setIsLoading(false);
    }
  }, [account]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">QwixVault Profile</h1>
      
      {isConnected && account ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><strong>Status:</strong> Connected</p>
              <p className="mb-2"><strong>Address:</strong> {account}</p>
              <p className="mb-2"><strong>QwixVault ID:</strong> {qwixVaultId || 'Not assigned'}</p>
              <p><strong>Documents:</strong> {documents.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2"><strong>Name:</strong> {user?.name || 'N/A'}</p>
              <p className="mb-2"><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Member since:</strong> {formatDate(new Date().toISOString())}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button variant="outline" asChild>
                <Link to="/blockchain-vault">View Documents</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/certification-center">View Certificates</Link>
              </Button>
              <Button variant="outline">Manage Account</Button>
            </CardContent>
          </Card>
          
          {documents.length > 0 && (
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Your Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <Card key={doc.uniqueId} className="overflow-hidden">
                        <div className="h-24 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                          <FileText className="h-10 w-10 text-blue-500/70" />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium truncate">{doc.fileName}</h3>
                          <p className="text-xs text-muted-foreground mb-2">
                            Uploaded on {formatDate(doc.timestamp)}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">Verified</span>
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/verify-document/${doc.uniqueId}`}>
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Connect your wallet to access your QwixVault Profile.</p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QwixVaultProfile;
