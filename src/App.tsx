/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import Authenticated from "./screens/authenticated";
import PendingGame from "./screens/loading";

// import InGameScreen from "./screens/in-game";
import { useState, useEffect } from "react";
// import { init, getInstance } from "./lib/fhevm";
import { Button } from "./components/ui/button";
// import WaitingRoom from "./screens/waiting-room";
import { usePrivy } from "@privy-io/react-auth";
import Login from "./screens/login";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";

function App() {
  const { login, authenticated, ready } = usePrivy();
  // const [isInitialized, setIsInitialized] = useState(false);

  // useEffect(() => {
  //   init()
  //     .then(() => {
  //       setIsInitialized(true);
  //     })
  //     .catch(() => setIsInitialized(false));
  // }, []);

  // if (!isInitialized) return null;

  // if (!ready) return <p>loading...</p>;

  return (
    <ChatProvider>
      <SocketProvider>
        <main>
          {!authenticated && <Login />}
          {authenticated && <Authenticated />}
        </main>
      </SocketProvider>
    </ChatProvider>
  );
}

export default App;
