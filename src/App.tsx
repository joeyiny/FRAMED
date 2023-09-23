/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";

// import InGameScreen from "./screens/in-game";
// import { Button } from "./components/ui/button";
import LoginScreen from "./screens/login";
import WaitingRoom from "./screens/waiting-room";
import { usePrivy } from "@privy-io/react-auth";

function App() {
  const { authenticated, ready, user } = usePrivy();

  if (!ready) return <p>loading...</p>;
  return <>{authenticated && user?.wallet ? <WaitingRoom /> : <LoginScreen />}</>;
}

export default App;
