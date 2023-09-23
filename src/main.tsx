import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as Privy from "@privy-io/react-auth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Privy.PrivyProvider
      appId={"clmweg8kd00qfl70fb48z6afs"}
      onSuccess={() => {}}
      config={{
        loginMethods: ["wallet", "sms"],
        appearance: {
          theme: "light",
          accentColor: "#FF3D00",
          logo: "https://i.imgur.com/N9VR8K1.png",
        },
      }}>
      <App />
    </Privy.PrivyProvider>
  </React.StrictMode>
);
