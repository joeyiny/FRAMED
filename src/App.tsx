/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import InGameScreen from "./screens/in-game";
import PendingGame from "./screens/loading";

// import InGameScreen from "./screens/in-game";
// import { Button } from "./components/ui/button";
import LoginScreen from "./screens/login";
import { usePrivy } from "@privy-io/react-auth";

function App() {
  const { authenticated, ready, user } = usePrivy();

  if (!ready) return <PendingGame />;
  return <>{authenticated && user?.wallet ? <InGameScreen /> : <LoginScreen />}</>;
}

export default App;
