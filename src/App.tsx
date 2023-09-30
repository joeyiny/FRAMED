/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import Authenticated from "./screens/authenticated";
import PendingGame from "./screens/loading";
import { useContractEvent } from 'wagmi'
import mafiaAbi from "../contracts/mafiaABI.json";


import { Client } from "@xmtp/xmtp-js";

// import InGameScreen from "./screens/in-game";
import { useState, useEffect } from "react";
import { init, getInstance } from "./lib/fhevm";
import { Button } from "./components/ui/button";
// import WaitingRoom from "./screens/waiting-room";
import { usePrivy } from "@privy-io/react-auth";
import Login from "./screens/login";

function App() {
  const { login, authenticated, ready } = usePrivy();
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
    <main>
      {!authenticated && <Login />}
      {/* {loading && <p>Loading Smart Account...</p>} */}
      {authenticated && <Authenticated />}
    </main>
  );
}

export default App;
