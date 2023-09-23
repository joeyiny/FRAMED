/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";

// import InGameScreen from "./screens/in-game";
import { Button } from "./components/ui/button";
import WaitingRoom from "./screens/waiting-room";
import { usePrivy } from "@privy-io/react-auth";

function App() {
  const { login, authenticated, ready } = usePrivy();

  if (!ready) return <p>loading...</p>;
  return (
    <main>
      {/* <h1>Based Account Abstraction</h1> */}
      {/* <h2>Connect and Mint your AA powered NFT now</h2> */}
      {!authenticated && <Button onClick={login}>JOIN GAME</Button>}
      {/* {loading && <p>Loading Smart Account...</p>} */}
      {authenticated && <WaitingRoom />}
    </main>
  );
}

export default App;
