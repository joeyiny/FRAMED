import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as Privy from "@privy-io/react-auth";
import { Chain } from "@wagmi/chains";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const incoChain: Chain = {
  id: 9090,
  name: "Inco",
  network: "inco",
  nativeCurrency: {
    name: "Inco",
    symbol: "INCO",
    decimals: 18,
  },
  rpcUrls: {
    public: {
      http: ["https://evm-rpc.inco.network/"],
    },
    default: {
      http: ["https://evm-rpc.inco.network/"],
    },
  },
};

const { publicClient, webSocketPublicClient } = configureChains([incoChain], [publicProvider()]);

const config = createConfig({
  publicClient,
  webSocketPublicClient,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <WagmiConfig config={config}>
      <Privy.PrivyProvider
        appId={"clmweg8kd00qfl70fb48z6afs"}
        onSuccess={() => {}}
        config={{
          loginMethods: ["wallet", "sms", "google"],
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
          additionalChains: [incoChain],
          appearance: {
            theme: "light",
            accentColor: "#FF3D00",
            logo: "https://i.imgur.com/N9VR8K1.png",
          },
        }}>
        <App />
      </Privy.PrivyProvider>
    </WagmiConfig>
  </>
);
