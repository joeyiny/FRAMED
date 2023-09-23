/* eslint-disable @typescript-eslint/no-unused-vars */
import { ParticleAuthModule, ParticleProvider } from "@biconomy/particle-auth";
import { ethers } from "ethers";
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const particle = new ParticleAuthModule.ParticleNetwork({
    projectId: "af0a7a24-5167-41ae-b85d-e4f70503553f",
    clientKey: "cm3nVwaX5JFjjtzwacZAGof9Op4oB34X8g3BzN8b",
    appId: "1abd1aaf-810f-43df-8469-960edf59d8e1",
    wallet: {
      displayWalletEntry: true,
      defaultWalletEntryPosition: ParticleAuthModule.WalletEntryPosition.BR,
    },
  });
  const connect = async () => {
    try {
      const userInfo = await particle.auth.login();
      console.log("Logged in user:", userInfo);
      const particleProvider = new ParticleProvider(particle.auth);
      console.log({ particleProvider });
      const web3Provider = new ethers.providers.Web3Provider(particleProvider, "any");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <main>
      <button onClick={connect}> Connect </button>
    </main>
  );
}

export default App;
