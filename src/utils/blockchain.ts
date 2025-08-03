import html2pdf from 'html2pdf.js';
import { Certificate, BlockchainDocument, DocumentVerification } from '@/types/blockchain';
import QRCode from 'qrcode';

// Generate Certificate PDF
export const generateCertificatePDF = async (elementId: string, fileName?: string): Promise<string> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');

    const pdfOptions = {
      margin: 0,
      filename: fileName || 'certificate.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    
    const pdfBlob = await html2pdf().from(element).set(pdfOptions).outputPdf('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Share certificate
export const shareCertificate = async (certificate: Certificate) => {
  const verificationUrl = `${window.location.origin}/verify-cert/${certificate.certHash}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${certificate.title} - Certificate`,
        text: `Check out my certificate: ${certificate.title}`,
        url: verificationUrl
      });
      return true;
    } catch (error) {
      console.error('Error sharing:', error);
      
      return copyToClipboard(verificationUrl);
    }
  } else {
    return copyToClipboard(verificationUrl);
  }
};

// Copy to clipboard helper
const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// Generate a certificate
export const generateCertificate = async (
  testId: string, 
  title: string,
  score: number, 
  recipientName: string,
  recipientEmail: string
): Promise<Certificate> => {
  const uniqueId = `cert-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  
  const certHash = `qwix-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
  
  const txHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  const certificate: Certificate = {
    id: uniqueId,
    testId,
    title,
    score,
    issuedDate: new Date().toISOString(),
    isPublic: true,
    certHash,
    txHash,
    blockId: Math.floor(Math.random() * 1000000),
    issuerName: "QwiXCert Authority",
    holderName: recipientName,
    holderEmail: recipientEmail,
    vaultId: getQwixVaultIdByEmail(recipientEmail) || "default-vault",
    recipientName,
    recipientEmail,
    uniqueId,
    blockchainNetwork: "Polygon",
    issuer: "QwiXCert Authority",
    contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    smartContractStandard: "ERC-721"
  };

  return certificate;
};

// Certificate verification functions
export const verifyCertificate = async (
  identifier: string, 
  method: 'certHash' | 'txHash' | 'blockId' | 'uniqueId' = 'certHash'
): Promise<{ isValid: boolean; certificate?: Certificate; transaction?: any; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const certificates = getUserCertificates();
  
  let certificate;
  
  switch (method) {
    case 'certHash':
      certificate = certificates.find(cert => cert.certHash === identifier);
      break;
    case 'txHash':
      certificate = certificates.find(cert => cert.txHash === identifier);
      break;
    case 'blockId':
      certificate = certificates.find(cert => cert.blockId.toString() === identifier);
      break;
    case 'uniqueId':
      certificate = certificates.find(cert => cert.uniqueId === identifier);
      break;
    default:
      return { isValid: false, error: 'Invalid verification method' };
  }
  
  if (certificate) {
    const transaction = {
      hash: certificate.txHash,
      blockId: certificate.blockId,
      confirmations: Math.floor(Math.random() * 1000),
      timestamp: certificate.issuedDate,
      status: 'confirmed' as const
    };
    
    return { isValid: true, certificate, transaction };
  }
  
  return { isValid: false, error: 'Certificate not found' };
};

// Verify certificate from file
export const verifyCertificateFromFile = async (file: File): Promise<{ isValid: boolean; certificate?: Certificate; error?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  if (file.type === 'application/pdf') {
    const mockCertificate: Certificate = {
      id: `cert-${Date.now()}`,
      testId: 'mock-test-001',
      title: 'Mock Certificate from File',
      score: 85,
      issuedDate: new Date().toISOString(),
      isPublic: true,
      certHash: `qwix-${Date.now().toString(36)}`,
      txHash: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      blockId: Math.floor(Math.random() * 1000000),
      issuerName: 'QwiXCert Authority',
      holderName: 'File Holder',
      holderEmail: 'file@example.com',
      vaultId: 'mock-vault-id',
      recipientName: 'File Holder',
      recipientEmail: 'file@example.com',
      uniqueId: `file-cert-${Date.now()}`,
      blockchainNetwork: 'Polygon',
      issuer: 'QwiXCert Authority',
      contractAddress: `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      smartContractStandard: 'ERC-721'
    };
    
    return { isValid: true, certificate: mockCertificate };
  }
  
  return { isValid: false, error: 'Invalid certificate file format. Please upload a PDF.' };
};

// Get user certificates
export const getUserCertificates = (): Certificate[] => {
  try {
    const certificatesStr = localStorage.getItem('user_certificates');
    if (certificatesStr) {
      return JSON.parse(certificatesStr);
    }
  } catch (error) {
    console.error('Error getting certificates:', error);
  }
  
  return [];
};

// Update certificate visibility
export const updateCertificateVisibility = (certificateId: string, isPublic: boolean): boolean => {
  try {
    const certificates = getUserCertificates();
    const updatedCertificates = certificates.map(cert => 
      cert.id === certificateId ? { ...cert, isPublic } : cert
    );
    
    localStorage.setItem('user_certificates', JSON.stringify(updatedCertificates));
    return true;
  } catch (error) {
    console.error('Error updating certificate visibility:', error);
    return false;
  }
};

// Helper function to get user's QwixVault ID by email
export const getQwixVaultIdByEmail = (email: string): string | null => {
  try {
    const vaultUsersStr = localStorage.getItem('qwixvault_users');
    if (vaultUsersStr) {
      const vaultUsers = JSON.parse(vaultUsersStr);
      if (vaultUsers[email]) {
        return vaultUsers[email].vaultId;
      }
    }
  } catch (error) {
    console.error('Error getting QwixVault ID:', error);
  }
  
  return null;
};

// Verify document by uniqueId - works without login
export const verifyDocument = async (uniqueId: string): Promise<DocumentVerification> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let foundDocument: BlockchainDocument | null = null;
    
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

// Generate QR code for verification
export const generateVerificationQrCode = async (uniqueId: string): Promise<string> => {
  try {
    const verificationUrl = `${window.location.origin}/verify-document/${uniqueId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};
