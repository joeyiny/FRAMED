import React, { useEffect, useState } from "react";
import "./App.css";
import Authenticated from "./screens/authenticated";
import PendingGame from "./screens/loading";
import { useContractEvent } from 'wagmi';
import mafiaAbi from "../contracts/mafiaABI.json";
import { SocketProvider } from "./messaging/SocketContext";
import { init, getInstance } from "./lib/fhevm";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import Login from "./screens/login";

function App() {
  const { login, authenticated, ready, connectWallet } = usePrivy();
  const { wallets } = useWallets();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch(() => setIsInitialized(false));
  }, []);

  if (!isInitialized) return null;

  if (!ready) return <p>loading...</p>;

  return (
    <SocketProvider>s
      <main>
        {!authenticated && <Login />}
        {authenticated && <Authenticated />}
      </main>
    </SocketProvider>
  );
}

export default App;
