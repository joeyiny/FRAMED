/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import InGameScreen from "./screens/in-game";
import PendingGame from "./screens/loading";

import { Client } from "@xmtp/xmtp-js";

// import InGameScreen from "./screens/in-game";
// import { Button } from "./components/ui/button";
import LoginScreen from "./screens/login";
import { usePrivy, useWallets } from "@privy-io/react-auth";

function App() {
  const { authenticated, ready, user } = usePrivy();
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<unknown>();
  useEffect(() => {
    const getProvider = async () => {
      const p = await wallets[0]?.getEthersProvider();
      // setProvider(p);
      const signer = await p?.getSigner();
      const xmtp = await Client.create(signer, { env: "dev" });
      // console.log(xmtp);

      const c = await xmtp.canMessage("0x2777C7735BCa78870978599ec0f98EAcBfc570A5");
    };
    getProvider();
  }, []);

  if (!ready) return <PendingGame />;
  return <>{authenticated && user?.wallet ? <InGameScreen /> : <LoginScreen />}</>;
}

export default App;
