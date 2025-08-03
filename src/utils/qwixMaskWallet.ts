
// Helper utility to check if Web3/QwixMask is supported in the browser
export const hasWeb3Support = (): boolean => {
  // Check if window.ethereum is available (MetaMask, QwixMask, or other providers)
  return typeof window !== 'undefined' && Boolean(window.ethereum);
};

// Function to check if it's a compatible network for QwixCV
export const isCompatibleNetwork = (chainId: number | null): boolean => {
  if (!chainId) return false;
  
  // List of supported chain IDs (example values)
  const supportedChains = [
    1,      // Ethereum Mainnet
    5,      // Goerli Testnet
    137,    // Polygon Mainnet
    80001,  // Mumbai Testnet
    31337   // Hardhat Local
  ];
  
  return supportedChains.includes(chainId);
};

// Parse Ethereum address to readable format
export const formatAddress = (address: string | null): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Simple local wallet implementation for demo purposes
export class LocalWallet {
  private address: string;
  private balance: string;
  
  constructor() {
    // Generate a random-looking address
    this.address = `0x${Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    this.balance = '1.2345';
  }
  
  getAddress(): string {
    return this.address;
  }
  
  getBalance(): string {
    return this.balance;
  }
  
  signMessage(message: string): Promise<string> {
    return Promise.resolve(`0x${Array(130).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`);
  }
}

// Get mock transaction history for the QwixVault
export const getTransactionHistory = () => {
  return [
    {
      txHash: "0x7a69c8a47b584e1d78c97e9a773f7e94d09d85e0d1233a82f19d28c954610bb3",
      type: "Upload",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      status: "Confirmed"
    },
    {
      txHash: "0x9b75c8a47b584e1d78c97e9a773f7e94d09d85e0d1233a82f19d28c954610cc4",
      type: "Mint",
      timestamp: new Date(Date.now() - 86400000 * 30).toISOString(),
      status: "Confirmed"
    }
  ];
};
