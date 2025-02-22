import { useWeb3 } from "@/lib/web3";
import { CyberButton } from "./ui/cyber-button";

export function WalletConnect() {
  const { connected, address, network, connect, disconnect } = useWeb3();

  if (!connected) {
    return (
      <CyberButton onClick={() => connect()}>
        Connect Wallet
      </CyberButton>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-cyan-400">
        {network}
      </div>
      <CyberButton 
        variant="secondary"
        onClick={() => disconnect()}
        title={address || ""}
      >
        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
      </CyberButton>
    </div>
  );
}