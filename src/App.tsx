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
import InGameScreen from "./screens/in-game";
import { Button } from "./components/ui/button";

const CHAIN_ID = ChainId.POLYGON_MUMBAI;

function App() {
  const bundler: IBundler = new Bundler({
    bundlerUrl: `https://bundler.biconomy.io/api/v2/${CHAIN_ID}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
    chainId: CHAIN_ID,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  });

  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/guQhvlLnJ.fdbac399-b062-443c-a827-0d18d45f879a",
  });

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
      setLoading(true);
      const userInfo = await particle.auth.login();
      console.log("Logged in user:", userInfo);
      const particleProvider = new ParticleProvider(particle.auth);
      const web3Provider = new ethers.providers.Web3Provider(particleProvider, "any");
      setProvider(web3Provider);

      const module = await ECDSAOwnershipValidationModule.create({
        signer: web3Provider.getSigner(),
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      });

      const biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module,
        activeValidationModule: module,
      });

      setAddress(await biconomySmartAccount.getAccountAddress());
      setSmartAccount(biconomySmartAccount);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null);

  return (
    <main>
      {/* <h1>Based Account Abstraction</h1> */}
      {/* <h2>Connect and Mint your AA powered NFT now</h2> */}
      {!loading && !address && <Button onClick={connect}>Connect to Based Web3</Button>}
      {/* {loading && <p>Loading Smart Account...</p>} */}
      {address && <InGameScreen />}
    </main>
  );
}

export default App;
