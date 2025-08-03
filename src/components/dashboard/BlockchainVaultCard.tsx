
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Database, Archive } from "lucide-react";
import { useBlockchain } from "@/context/BlockchainContext";
import { Link } from "react-router-dom";

const BlockchainVaultCard = () => {
  const { isConnected, connectWallet } = useBlockchain();

  return (
    <Card className="col-span-1 h-full flex flex-col overflow-hidden transition-transform duration-300 hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          QwiXEd360°Suite Blockchain Vault
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex flex-col h-full">
          <div className="mb-4 flex items-center justify-center">
            <Archive className="h-16 w-16 text-blue-500 my-4" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Securely store, manage, and verify your professional documents using blockchain technology
          </p>
          <div className="flex flex-col gap-1 text-sm mb-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <span>Tamper-proof document storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span>Blockchain verification</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {isConnected ? (
          <Button asChild className="w-full">
            <Link to="/blockchain-vault">Access Vault</Link>
          </Button>
        ) : (
          <Button onClick={connectWallet} className="w-full">
            Connect Wallet
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BlockchainVaultCard;
