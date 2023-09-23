/* eslint-disable @typescript-eslint/no-unused-vars */
import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";
import "./App.css";

import { useState } from "react";
import { IBundler, Bundler } from "@biconomy/bundler";
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
// import InGameScreen from "./screens/in-game";
import { Button } from "./components/ui/button";
import WaitingRoom from "./screens/waiting-room";
import { useContext } from "react";
import * as Privy from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";

const CHAIN_ID = ChainId.POLYGON_MUMBAI;

function App() {
  const { login, authenticated } = usePrivy();

  return (
    <main>
      {/* <h1>Based Account Abstraction</h1> */}
      {/* <h2>Connect and Mint your AA powered NFT now</h2> */}
      {!authenticated && <Button onClick={login}>JOIN GAME</Button>}
      {/* {loading && <p>Loading Smart Account...</p>} */}
      {authenticated && <WaitingRoom />}
    </main>
  );
}

export default App;
