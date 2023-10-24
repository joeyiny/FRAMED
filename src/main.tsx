import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as Privy from "@privy-io/react-auth";
import { Chain } from "@wagmi/chains";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { GraphApolloLink } from "@graphprotocol/client-apollo";
import * as GraphClient from "../.graphclient";

const client = new ApolloClient({
  link: new GraphApolloLink(GraphClient),
  cache: new InMemoryCache(),
});

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
          loginMethods: ["sms", "google"],
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
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Privy.PrivyProvider>
    </WagmiConfig>
  </>
);
