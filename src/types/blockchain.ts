export interface BlockchainDocument {
  uniqueId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  description: string;
  ipfsUri: string;
  blockchainHash: string;
  ownerAddress: string;
  timestamp: string;
  verificationUrl: string;
  isVerified: boolean;
  tokenId?: number; // Adding tokenId as optional
}

export interface Certificate {
  id: string;
  testId: string;
  title: string;
  score: number;
  issuedDate: string;
  isPublic: boolean;
  certHash: string;
  txHash: string;
  blockId: number;
  issuerName: string;
  holderName: string;
  holderEmail: string;
  vaultId: string;
  recipientName: string;
  recipientEmail: string;
  uniqueId: string;
  blockchainNetwork: string;
  issuer: string;
  contractAddress: string;
  smartContractStandard: string;
  validUntil?: string; // Adding validUntil as optional
}

// Adding missing interfaces
export interface DocumentUploadParams {
  file: File;
  fileName: string;
  description: string;
  ownerAddress: string;
}

export interface DocumentVerification {
  isValid: boolean;
  document?: BlockchainDocument;
  error?: string;
}

export interface UserActivity {
  id: string;
  type: 'exam_taken' | 'certificate_generated' | 'document_added';
  title: string;
  description: string;
  timestamp: string;
  result?: {
    passed?: boolean;
    score?: number;
    certificateId?: string;
  };
}

export interface QwixVaultUser {
  email: string;
  walletAddress: string;
  vaultId: string;
  createdAt: string;
  documents: BlockchainDocument[];
  certificates: Certificate[];
  activities: UserActivity[];  // Adding activities array
}
