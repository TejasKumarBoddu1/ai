
import type { BlockchainDocument, Certificate } from '@/types/blockchain';

// Get all documents from all users
export const getAllDocuments = (): BlockchainDocument[] => {
  // First check new storage format
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  const allDocuments: BlockchainDocument[] = [];
  
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    for (const email in vaultUsers) {
      if (vaultUsers[email].documents) {
        allDocuments.push(...vaultUsers[email].documents);
      }
    }
  }
  
  // Also check legacy storage
  const legacyDocsStr = localStorage.getItem('qwix_blockchain_documents');
  if (legacyDocsStr) {
    try {
      const legacyDocs = JSON.parse(legacyDocsStr);
      if (Array.isArray(legacyDocs)) {
        allDocuments.push(...legacyDocs);
      }
    } catch (e) {
      console.error("Error parsing legacy documents:", e);
    }
  }
  
  return allDocuments;
};

// Get documents for a specific user by owner address
export const getUserDocumentsByOwner = (ownerAddress: string): BlockchainDocument[] => {
  const allDocuments = getAllDocuments();
  const filteredDocs = allDocuments.filter(doc => doc.ownerAddress === ownerAddress);
  
  // If no documents found, create some sample documents for testing
  if (filteredDocs.length === 0) {
    const sampleDocs = generateSampleDocuments(ownerAddress);
    
    // Store sample documents
    try {
      const vaultUsersStr = localStorage.getItem('qwixvault_users');
      if (vaultUsersStr) {
        const vaultUsers = JSON.parse(vaultUsersStr);
        
        // Find the user with this wallet address
        for (const email in vaultUsers) {
          if (vaultUsers[email].walletAddress === ownerAddress) {
            vaultUsers[email].documents = [...sampleDocs];
            localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
            break;
          }
        }
      }
    } catch (e) {
      console.error("Error storing sample documents:", e);
    }
    
    return sampleDocs;
  }
  
  return filteredDocs;
};

// Generate sample documents for testing
const generateSampleDocuments = (ownerAddress: string): BlockchainDocument[] => {
  const currentTime = new Date().toISOString();
  
  return [
    {
      uniqueId: `doc-${Date.now()}-1`,
      fileName: 'Resume_2024.pdf',
      fileType: 'application/pdf',
      fileSize: 245000,
      description: 'Professional resume for tech positions',
      ipfsUri: `ipfs://Qm${Math.random().toString(36).substring(2, 15)}`,
      blockchainHash: `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')}`,
      ownerAddress: ownerAddress,
      timestamp: currentTime,
      verificationUrl: `${window.location.origin}/verify-document/doc-${Date.now()}-1`,
      isVerified: true
    },
    {
      uniqueId: `doc-${Date.now()}-2`,
      fileName: 'Certificate_CompSci.pdf',
      fileType: 'application/pdf',
      fileSize: 1250000,
      description: 'Computer Science degree certificate',
      ipfsUri: `ipfs://Qm${Math.random().toString(36).substring(2, 15)}`,
      blockchainHash: `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')}`,
      ownerAddress: ownerAddress,
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      verificationUrl: `${window.location.origin}/verify-document/doc-${Date.now()}-2`,
      isVerified: true
    },
    {
      uniqueId: `doc-${Date.now()}-3`,
      fileName: 'Project_Portfolio.pdf',
      fileType: 'application/pdf',
      fileSize: 3450000,
      description: 'Portfolio of completed projects',
      ipfsUri: `ipfs://Qm${Math.random().toString(36).substring(2, 15)}`,
      blockchainHash: `0x${Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('')}`,
      ownerAddress: ownerAddress,
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      verificationUrl: `${window.location.origin}/verify-document/doc-${Date.now()}-3`,
      isVerified: true
    }
  ];
};

// Get documents for a specific user by email
export const getUserDocumentsByEmail = (email: string): BlockchainDocument[] => {
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    if (vaultUsers[email] && vaultUsers[email].documents) {
      return vaultUsers[email].documents;
    }
  }
  return [];
};

// Save a new document to a user's vault
export const saveDocumentToUserVault = (
  email: string,
  document: BlockchainDocument
): boolean => {
  if (!email || !document) return false;
  
  try {
    const vaultUsersStr = localStorage.getItem('qwixvault_users');
    const vaultUsers = vaultUsersStr ? JSON.parse(vaultUsersStr) : {};
    
    if (!vaultUsers[email]) {
      console.error("User vault not found");
      return false;
    }
    
    // Add document if it doesn't exist already
    const existingIndex = vaultUsers[email].documents.findIndex(
      (doc: BlockchainDocument) => doc.uniqueId === document.uniqueId
    );
    
    if (existingIndex >= 0) {
      vaultUsers[email].documents[existingIndex] = document;
    } else {
      vaultUsers[email].documents.push(document);
    }
    
    // Save back to localStorage
    localStorage.setItem('qwixvault_users', JSON.stringify(vaultUsers));
    return true;
  } catch (error) {
    console.error("Error saving document to user vault:", error);
    return false;
  }
};

// Get all certificates from all users
export const getAllCertificates = (): Certificate[] => {
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  const allCertificates: Certificate[] = [];
  
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    for (const email in vaultUsers) {
      if (vaultUsers[email].certificates) {
        allCertificates.push(...vaultUsers[email].certificates);
      }
    }
  }
  
  // Also check user_certificates storage
  const userCertsStr = localStorage.getItem('user_certificates');
  if (userCertsStr) {
    try {
      const userCerts = JSON.parse(userCertsStr);
      if (Array.isArray(userCerts)) {
        allCertificates.push(...userCerts);
      }
    } catch (e) {
      console.error("Error parsing user certificates:", e);
    }
  }
  
  return allCertificates;
};

// Get certificates for a specific user by email
export const getUserCertificatesByEmail = (email: string): Certificate[] => {
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    if (vaultUsers[email] && vaultUsers[email].certificates) {
      return vaultUsers[email].certificates;
    }
  }
  return [];
};

// Get certificates for a specific QwixVault ID
export const getCertificatesByVaultId = (vaultId: string): Certificate[] => {
  const allCertificates = getAllCertificates();
  return allCertificates.filter(cert => cert.vaultId === vaultId);
};

// Verify if a certificate exists by its hash
export const verifyCertificateByHash = (certHash: string): Certificate | null => {
  const allCertificates = getAllCertificates();
  return allCertificates.find(cert => cert.certHash === certHash) || null;
};

// Get a user's QwixVault ID by email
export const getQwixVaultIdByEmail = (email: string): string | null => {
  const vaultUsersStr = localStorage.getItem('qwixvault_users');
  if (vaultUsersStr) {
    const vaultUsers = JSON.parse(vaultUsersStr);
    if (vaultUsers[email]) {
      return vaultUsers[email].vaultId;
    }
  }
  return null;
};

// Update document upload functions to use the new storage format
export const getUserDocuments = (): BlockchainDocument[] => {
  // For backward compatibility, still check the legacy storage
  const documentsString = localStorage.getItem('qwix_blockchain_documents');
  
  if (documentsString) {
    try {
      return JSON.parse(documentsString);
    } catch (e) {
      console.error("Error parsing documents:", e);
      return [];
    }
  }
  
  return [];
};
