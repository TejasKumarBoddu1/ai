
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  BlockchainDocument, 
  Certificate,
  DocumentUploadParams,
  DocumentVerification,
  QwixVaultUser,
  UserActivity
} from '@/types/blockchain';
import { hasWeb3Support } from '@/utils/qwixMaskWallet';
import QRCode from 'qrcode';

interface BlockchainContextType {
  isConnected: boolean;
  account: string | null;
  balance: string;
  chainId: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  uploadDocumentToIPFS: (file: File, metadata: any) => Promise<any>;
  mintDocumentAsNFT: (ipfsUri: string, uniqueId: string) => Promise<any>;
  verifyDocument: (uniqueId: string) => Promise<DocumentVerification>;
  getUserDocuments: () => Promise<BlockchainDocument[]>;
  getUserQwixVaultId: () => string;
  getUserCertificates: () => Promise<Certificate[]>;
  generateCertificate: (testId: string, score: number, title: string) => Promise<Certificate | null>;
  saveCertificateToVault: (certificate: Certificate) => Promise<boolean>;
  getVaultUser: () => QwixVaultUser | null;
  generateQrCodeForDocument?: (document: BlockchainDocument) => Promise<string>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [vaultUser, setVaultUser] = useState<QwixVaultUser | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const storedAccount = localStorage.getItem('qwixmask_account');
    if (storedAccount) {
      setAccount(storedAccount);
      setIsConnected(true);
      
      const storedBalance = localStorage.getItem('qwixmask_balance') || '0';
      const storedChainId = localStorage.getItem('qwixmask_chainId');
      
      setBalance(storedBalance);
      setChainId(storedChainId ? parseInt(storedChainId) : null);
    }
    
    if (storedAccount && user) {
      initializeVaultUser(storedAccount);
    }
  }, [user]);

  const initializeVaultUser = (walletAddress: string) => {
    if (!user) return;
    
    const vaultUsersStr = localStorage.getItem('qwixvault_users');
    const vaultUsers = vaultUsersStr ? JSON.parse(vaultUsersStr) : {};
    
    if (vaultUsers[user.email]) {
      setVaultUser(vaultUsers[user.email]);
    } else {
      const newVaultUser: QwixVaultUser = {
        email: user.email,
        walletAddress: walletAddress,
        vaultId: `QVID-${Date.now().toString(36)}-${uuidv4().substring(0, 8)}`,
        createdAt: new Date().toISOString(),
        documents: [],
        certificates: [],
        activities: [] // Adding the activities array
      };
      
      vaultUsers[user.email] = newVaultUser;
      localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
      
      setVaultUser(newVaultUser);
    }
  };

  const connectWallet = async (): Promise<void> => {
    try {
      if (hasWeb3Support()) {
        console.log("Connecting to real Web3 wallet");
        
        const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const mockBalance = (Math.random() * 10).toFixed(4);
        
        setAccount(mockAddress);
        setBalance(mockBalance);
        setChainId(137); // Polygon network
        setIsConnected(true);
        
        localStorage.setItem('qwixmask_account', mockAddress);
        localStorage.setItem('qwixmask_balance', mockBalance);
        localStorage.setItem('qwixmask_chainId', '137');
        
        if (user) {
          initializeVaultUser(mockAddress);
        }
        
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to QwixMask wallet",
        });
      } else {
        console.info("QwixMask not detected, using fallback mode");
        
        const mockAddress = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        const mockBalance = (Math.random() * 10).toFixed(4);
        
        setAccount(mockAddress);
        setBalance(mockBalance);
        setChainId(137); // Polygon network
        setIsConnected(true);
        
        localStorage.setItem('qwixmask_account', mockAddress);
        localStorage.setItem('qwixmask_balance', mockBalance);
        localStorage.setItem('qwixmask_chainId', '137');
        
        if (user) {
          initializeVaultUser(mockAddress);
        }
        
        toast({
          title: "Demo Wallet Connected",
          description: "Connected to QwixMask in demo mode",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to QwixMask wallet",
        variant: "destructive",
      });
      throw error;
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setChainId(null);
    setIsConnected(false);
    setVaultUser(null);
    
    localStorage.removeItem('qwixmask_account');
    localStorage.removeItem('qwixmask_balance');
    localStorage.removeItem('qwixmask_chainId');
    
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from QwixMask wallet",
    });
  };

  const uploadDocumentToIPFS = async (file: File, metadata: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const ipfsHash = `Qm${Array(44).fill(0).map(() => Math.random().toString(36)[2]).join('')}`;
      const ipfsUri = `ipfs://${ipfsHash}`;
      
      return {
        success: true,
        ipfsUri,
        ipfsHash
      };
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw new Error("Failed to upload document to IPFS");
    }
  };

  const mintDocumentAsNFT = async (ipfsUri: string, uniqueId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const txHash = `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')}`;
      const tokenId = Math.floor(Math.random() * 10000000);
      const verificationUrl = `${window.location.origin}/verify-document/${uniqueId}`;
      
      return {
        success: true,
        txHash,
        tokenId,
        verificationUrl
      };
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw new Error("Failed to mint document as NFT");
    }
  };

  const verifyDocument = async (uniqueId: string): Promise<DocumentVerification> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let foundDocument: BlockchainDocument | null = null;
      
      if (vaultUser) {
        foundDocument = vaultUser.documents.find(doc => doc.uniqueId === uniqueId) || null;
      }
      
      if (!foundDocument) {
        const vaultUsersStr = localStorage.getItem('qwixvault_users');
        if (vaultUsersStr) {
          const vaultUsers = JSON.parse(vaultUsersStr);
          for (const email in vaultUsers) {
            const userDocs = vaultUsers[email].documents || [];
            const found = userDocs.find((doc: BlockchainDocument) => doc.uniqueId === uniqueId);
            if (found) {
              foundDocument = found;
              break;
            }
          }
        }
      }
      
      if (!foundDocument) {
        const documentsStr = localStorage.getItem('qwix_blockchain_documents');
        if (documentsStr) {
          const documents = JSON.parse(documentsStr);
          foundDocument = documents.find((doc: BlockchainDocument) => doc.uniqueId === uniqueId) || null;
        }
      }
      
      if (foundDocument) {
        return {
          isValid: true,
          document: foundDocument
        };
      } else {
        return {
          isValid: false,
          error: "Document not found or has been revoked"
        };
      }
    } catch (error) {
      console.error("Error verifying document:", error);
      return {
        isValid: false,
        error: "Verification process failed"
      };
    }
  };

  const getUserDocuments = async (): Promise<BlockchainDocument[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (vaultUser) {
        return [...vaultUser.documents];
      }
      
      const documentsStr = localStorage.getItem('qwix_blockchain_documents');
      if (documentsStr) {
        try {
          const documents = JSON.parse(documentsStr);
          if (Array.isArray(documents)) {
            return documents;
          }
        } catch (error) {
          console.error("Error parsing documents:", error);
        }
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching user documents:", error);
      return [];
    }
  };

  const getUserCertificates = async (): Promise<Certificate[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (vaultUser) {
        return [...vaultUser.certificates];
      }
      
      return [];
    } catch (error) {
      console.error("Error fetching user certificates:", error);
      return [];
    }
  };

  const generateCertificate = async (
    testId: string, 
    score: number, 
    title: string
  ): Promise<Certificate | null> => {
    if (!vaultUser || !isConnected) {
      toast({
        title: "Vault not connected",
        description: "Please connect your QwixVault first",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const certHash = `QC${Date.now().toString(36)}-${uuidv4().substring(0, 8)}`;
      const txHash = `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')}`;
      const blockId = Math.floor(Math.random() * 10000000);
      const uniqueId = `cert-${Date.now().toString(36)}-${uuidv4().substring(0, 8)}`;
      
      const newCertificate: Certificate = {
        id: uuidv4(),
        testId,
        title,
        score,
        issuedDate: new Date().toISOString(),
        isPublic: true,
        certHash,
        txHash,
        blockId,
        issuerName: "QwixCert Authority",
        holderName: user?.name || "Verified Holder",
        holderEmail: user?.email || "",
        vaultId: vaultUser.vaultId,
        recipientName: user?.name || "Verified Holder",
        recipientEmail: user?.email || "",
        uniqueId,
        blockchainNetwork: "Polygon",
        issuer: "QwixCert Authority",
        contractAddress: `0x${Array(40).fill(0).map(() => Math.random().toString(16)[2]).join('')}`,
        smartContractStandard: "ERC-721"
      };

      const activity: UserActivity = {
        id: uuidv4(),
        type: 'certificate_generated',
        title: 'Certificate Generated',
        description: `Generated certificate for ${title}`,
        timestamp: new Date().toISOString(),
        result: {
          certificateId: newCertificate.id,
          score
        }
      };

      const vaultUsersStr = localStorage.getItem('qwixvault_users');
      const vaultUsers = vaultUsersStr ? JSON.parse(vaultUsersStr) : {};

      if (user && vaultUsers[user.email]) {
        vaultUsers[user.email].activities = [
          activity,
          ...(vaultUsers[user.email].activities || [])
        ];
        vaultUsers[user.email].certificates = [
          newCertificate,
          ...(vaultUsers[user.email].certificates || [])
        ];

        localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
        setVaultUser(vaultUsers[user.email]);
      }
      
      return newCertificate;
    } catch (error) {
      console.error("Error generating certificate:", error);
      toast({
        title: "Certificate Generation Failed",
        description: "Failed to generate certificate",
        variant: "destructive"
      });
      return null;
    }
  };

  const saveCertificateToVault = async (certificate: Certificate): Promise<boolean> => {
    if (!vaultUser || !user) {
      toast({
        title: "Vault not connected",
        description: "Please connect your QwixVault first",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      const vaultUsersStr = localStorage.getItem('qwixvault_users');
      const vaultUsers = vaultUsersStr ? JSON.parse(vaultUsersStr) : {};
      
      if (vaultUsers[user.email]) {
        const existingIndex = vaultUsers[user.email].certificates.findIndex(
          (cert: Certificate) => cert.id === certificate.id
        );
        
        if (existingIndex >= 0) {
          vaultUsers[user.email].certificates[existingIndex] = certificate;
        } else {
          vaultUsers[user.email].certificates.push(certificate);
        }
        
        localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
        
        setVaultUser(vaultUsers[user.email]);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error saving certificate:", error);
      return false;
    }
  };

  const getUserQwixVaultId = (): string => {
    if (vaultUser) {
      return vaultUser.vaultId;
    }
    return '';
  };

  const getVaultUser = (): QwixVaultUser | null => {
    return vaultUser;
  };

  const generateQrCodeForDocument = async (document: BlockchainDocument): Promise<string> => {
    try {
      const verificationUrl = `${window.location.origin}/verify-document/${document.uniqueId}`;
      const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);
      return qrCodeDataUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        account,
        balance,
        chainId,
        connectWallet,
        disconnectWallet,
        uploadDocumentToIPFS,
        mintDocumentAsNFT,
        verifyDocument,
        getUserDocuments,
        getUserQwixVaultId,
        getUserCertificates,
        generateCertificate,
        saveCertificateToVault,
        getVaultUser,
        generateQrCodeForDocument
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};
