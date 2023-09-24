/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import Authenticated from "./screens/authenticated";
import PendingGame from "./screens/loading";

// import InGameScreen from "./screens/in-game";
import { useState, useEffect } from "react";
import { init, getInstance } from "./lib/fhevm";
import { Button } from "./components/ui/button";
// import WaitingRoom from "./screens/waiting-room";
import { usePrivy } from "@privy-io/react-auth";
import { Connect } from "./components/ui/connect";
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
      <Connect>
        {(account, provider) => (
          <>
            {/* <h1>Based Account Abstraction</h1> */}
            {/* <h2>Connect and Mint your AA powered NFT now</h2> */}
            {!authenticated && <Login />}
            {/* {loading && <p>Loading Smart Account...</p>} */}
            {authenticated && <Authenticated />}
          </>
        )}
      </Connect>
    </main>
  );
}

export default App;
