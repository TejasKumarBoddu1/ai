
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlockchain } from '@/context/BlockchainContext';
import { Shield, Wallet, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasWeb3Support } from '@/utils/qwixMaskWallet';
import { useToast } from "@/components/ui/use-toast";

export const ConnectWalletPrompt: React.FC = () => {
  const { connectWallet } = useBlockchain();
  const { toast } = useToast();
  
  const handleConnect = async () => {
    // The Web3 support check is now handled in the connectWallet function
    connectWallet();
  };
  
  return (
    <div className="flex items-center justify-center py-10">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle>Connect QwixMask Wallet</CardTitle>
          <CardDescription>
            To access your blockchain vault and securely store documents, connect your QwixMask wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Blockchain-Secured Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Your documents are secured with tamper-proof blockchain technology for maximum security and verifiability.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <LockKeyhole className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium">Your Keys, Your Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Only you control access to your documents through your personal wallet credentials.
                </p>
              </div>
            </div>
          </div>
          
          <Button onClick={handleConnect} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect QwixMask
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectWalletPrompt;
