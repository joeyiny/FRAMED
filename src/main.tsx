import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import * as Privy from "@privy-io/react-auth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Privy.PrivyProvider
      appId={"clmweg8kd00qfl70fb48z6afs"}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://your-logo-url",
        },
      }}>
      <App />
    </Privy.PrivyProvider>
  </React.StrictMode>
);
