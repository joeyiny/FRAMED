import { BrowserProvider } from "ethers";
import { createFhevmInstance } from "../../lib/fhevm";
import { useState, useCallback, useEffect, useMemo } from "react";
import React from "react";

const AUTHORIZED_CHAIN_ID = ["0x2328"];

interface ConnectProps {
  children: (account: string, provider: any) => React.ReactNode;
}

export const Connect: React.FC<ConnectProps> = ({ children }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [validNetwork, setValidNetwork] = useState<boolean>(false);
  const [account, setAccount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<any | null>(null);

  const refreshAccounts = useCallback(async (accounts: string[]) => {
    setAccount(accounts[0] || "");
    setConnected(accounts.length > 0);
  }, []);

  const hasValidNetwork = useCallback(async () => {
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    return AUTHORIZED_CHAIN_ID.includes(currentChainId.toLowerCase());
  }, []);

  const refreshNetwork = useCallback(async () => {
    if (await hasValidNetwork()) {
      await createFhevmInstance();
      setValidNetwork(true);
    } else {
      setValidNetwork(false);
    }
  }, [hasValidNetwork]);

  const refreshProvider = useCallback((eth: any) => {
    const p = new BrowserProvider(eth);
    setProvider(p);
    return p;
  }, []);

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) {
      setError("No wallet has been found");
      return;
    }

    const p = refreshProvider(eth);

    p.send("eth_accounts", [])
      .then(async (accounts: string[]) => {
        refreshAccounts(accounts);
        await refreshNetwork();
      })
      .catch(() => {
        // Do nothing
      });

    eth.on("accountsChanged", refreshAccounts);
    eth.on("chainChanged", refreshNetwork);
  }, [refreshProvider, refreshAccounts, refreshNetwork]);

  const connect = useCallback(async () => {
    if (!provider) {
      return;
    }
    const accounts = await provider.send("eth_requestAccounts", []);

    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setConnected(true);
      if (!(await hasValidNetwork())) {
        await switchNetwork();
      }
    }
  }, [provider, hasValidNetwork]);

  const switchNetwork = useCallback(async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: AUTHORIZED_CHAIN_ID[0] }],
      });
    } catch (e) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: AUTHORIZED_CHAIN_ID[0],
            rpcUrls: ["https://evm-rpc.inco.network/"],
            chainName: "Inco Network Devnet",
            nativeCurrency: {
              name: "INCO",
              symbol: "INCO",
              decimals: 18,
            },
            blockExplorerUrls: ["https://explorer.inco.network"],
          },
        ],
      });
    }
    await refreshNetwork();
  }, [refreshNetwork]);

  const child = useMemo(() => {
    if (!account || !provider) {
      return null;
    }

    if (!validNetwork) {
      return (
        <div>
          <p>You're not on the correct network</p>
          <p>
            <button
              className="Connect__button bg-gray-200 hover:bg-blue-400"
              onClick={switchNetwork}
            >
              Switch to Inco Network Devnet
            </button>
          </p>
        </div>
      );
    }

    return children(account, provider);
  }, [account, provider, validNetwork, children, switchNetwork]);

  if (error) {
    return <p>No wallet has been found.</p>;
  }

  const connectInfos = (
    <div className="Connect__info flex flex-col">
      <a
        href="https://faucetdev.inco.network/"
        target="_blank"
        className="mb-16 text-gray-500 hover:text-gray-900"
      >
        Get test tokens from Faucet
      </a>
      {!connected && (
        <button
          className="Connect__button bg-gray-200 hover:bg-blue-400"
          onClick={connect}
        >
          Connect your wallet
        </button>
      )}
      {connected && (
        <div className="Connect__account">
          Connected with{" "}
          {account.substring(0, 5) +
            "..." +
            account.substring(account.length - 5, account.length)}
        </div>
      )}
    </div>
  );

  return (
    <>
      {connectInfos}
      <div className="Connect__child">{child}</div>
    </>
  );
};
