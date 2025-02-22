import { create } from "zustand";

interface Web3State {
  connected: boolean;
  address: string | null;
  network: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<void>;
}

// Constants for Sonic Network
export const SONIC_TESTNET = {
  chainId: "0xDEDE", // 57054 in hex
  chainName: "Sonic Blaze Testnet",
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.blaze.soniclabs.com"],
  blockExplorerUrls: ["https://testnet.sonicscan.org"],
};

// Mock web3 store for demo
export const useWeb3 = create<Web3State>((set) => ({
  connected: false,
  address: null,
  network: null,
  connect: async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        // Switch to Sonic network
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SONIC_TESTNET],
        });

        set({ 
          connected: true, 
          address: accounts[0],
          network: SONIC_TESTNET.chainName
        });
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      window.open('https://metamask.io/download.html', '_blank');
    }
  },
  disconnect: () => set({ connected: false, address: null, network: null }),
  switchNetwork: async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SONIC_TESTNET.chainId }],
        });
      } catch (error: any) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SONIC_TESTNET],
          });
        }
      }
    }
  },
}));

export async function sendTransaction(amount: number, recipientAddress: string): Promise<string> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    // Convert amount to wei (1 S = 10^18 wei)
    const amountInWei = BigInt(amount * Math.pow(10, 18)).toString(16);

    const transactionParameters = {
      from: accounts[0],
      to: recipientAddress, // Send directly to charity's wallet
      value: `0x${amountInWei}`,
      data: '0x',
    };

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    return txHash;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

// Contract addresses on Sonic testnet
export const CONTRACTS = {
  BRIDGE: "0x9Ef7629F9B930168b76283AdD7120777b3c895b3",
  TOKEN_PAIRS: "0x134E4c207aD5A13549DE1eBF8D43c1f49b00ba94",
  WRAPPED_S: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
  WRAPPED_ETH: "0x309C92261178fA0CF748A855e90Ae73FDb79EBc7",
};