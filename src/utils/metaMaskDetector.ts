
// MetaMask detection utility
import { toast } from "@/hooks/use-toast";

interface WindowWithEthereum extends Window {
  ethereum?: {
    request: (args: any) => Promise<any>;
    on: (event: string, callback: any) => void;
    removeListener: (event: string, callback: any) => void;
    isMetaMask?: boolean;
    selectedAddress?: string | null;
    chainId?: string;
  };
}

export const POLYGON_MUMBAI_CHAIN_ID = '0x13881'; // 80001 in hex

// Helper function to check if MetaMask is installed and accessible
export const hasMetaMask = (): boolean => {
  const windowWithEthereum = window as WindowWithEthereum;
  return (
    typeof windowWithEthereum !== 'undefined' &&
    typeof windowWithEthereum.ethereum !== 'undefined' &&
    !!windowWithEthereum.ethereum.isMetaMask
  );
};

// Helper function to request accounts from MetaMask
export const requestMetaMaskAccounts = async (): Promise<string[]> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    toast({
      title: "MetaMask Required",
      description: "Please install MetaMask to use blockchain features. Installation window will open automatically.",
      variant: "destructive"
    });
    
    // Open MetaMask in a new tab
    window.open('https://metamask.io/download/', '_blank');
    throw new Error("MetaMask is not installed");
  }
  
  try {
    const accounts = await windowWithEthereum.ethereum?.request({ 
      method: 'eth_requestAccounts' 
    });
    
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found");
    }
    
    // Successfully connected
    toast({
      title: "Wallet Connected",
      description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
    });
    
    return accounts;
  } catch (error: any) {
    if (error.code === 4001) {
      // User rejected the connection
      toast({
        title: "Connection Rejected",
        description: "You rejected the connection request.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive"
      });
    }
    throw error;
  }
};

// Helper function to get current chain ID from MetaMask
export const getMetaMaskChainId = async (): Promise<string | null> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    return null;
  }
  
  try {
    const chainId = await windowWithEthereum.ethereum?.request({ 
      method: 'eth_chainId' 
    });
    
    return chainId;
  } catch (error) {
    console.error("Error getting chain ID from MetaMask:", error);
    return null;
  }
};

// Function to add Polygon Mumbai network to MetaMask
export const addPolygonMumbaiNetwork = async (): Promise<boolean> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    return false;
  }
  
  try {
    await windowWithEthereum.ethereum?.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: POLYGON_MUMBAI_CHAIN_ID,
        chainName: 'Polygon Mumbai Testnet',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com']
      }]
    });
    
    toast({
      title: "Network Added",
      description: "Polygon Mumbai Testnet has been added to your wallet",
    });
    
    return true;
  } catch (error: any) {
    if (error.code === 4001) {
      toast({
        title: "Network Add Rejected",
        description: "You rejected adding the Polygon Mumbai network",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Network Add Failed",
        description: "Failed to add Polygon Mumbai network. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  }
};

// Function to switch to Polygon Mumbai network
export const switchToPolygonMumbai = async (): Promise<boolean> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    return false;
  }
  
  try {
    await windowWithEthereum.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_MUMBAI_CHAIN_ID }],
    });
    
    toast({
      title: "Network Switched",
      description: "Successfully switched to Polygon Mumbai Testnet",
    });
    
    return true;
  } catch (error: any) {
    // This error code means the chain has not been added to MetaMask
    if (error.code === 4902) {
      return addPolygonMumbaiNetwork();
    }
    
    if (error.code === 4001) {
      toast({
        title: "Network Switch Rejected",
        description: "You rejected switching to the Polygon Mumbai network",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to Polygon Mumbai network. Please try again.",
        variant: "destructive"
      });
    }
    return false;
  }
};

// Get current connected account
export const getCurrentAccount = async (): Promise<string | null> => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    return null;
  }
  
  try {
    const accounts = await windowWithEthereum.ethereum?.request({
      method: 'eth_accounts'
    });
    
    return accounts && accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error("Error getting current account:", error);
    return null;
  }
};

// Setup MetaMask event listeners
export const setupMetaMaskEvents = (
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void,
  onDisconnect: () => void
) => {
  const windowWithEthereum = window as WindowWithEthereum;
  
  if (!hasMetaMask()) {
    return () => {};
  }
  
  // Handle account changes
  windowWithEthereum.ethereum?.on('accountsChanged', onAccountsChanged);
  
  // Handle chain changes
  windowWithEthereum.ethereum?.on('chainChanged', onChainChanged);
  
  // Handle disconnect
  windowWithEthereum.ethereum?.on('disconnect', onDisconnect);
  
  // Return cleanup function
  return () => {
    if (windowWithEthereum.ethereum) {
      windowWithEthereum.ethereum.removeListener('accountsChanged', onAccountsChanged);
      windowWithEthereum.ethereum.removeListener('chainChanged', onChainChanged);
      windowWithEthereum.ethereum.removeListener('disconnect', onDisconnect);
    }
  };
};
