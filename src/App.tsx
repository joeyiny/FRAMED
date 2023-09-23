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
    <main className="flex items-center justify-center min-h-screen min-w-screen">
      {/* <h1>Based Account Abstraction</h1> */}
      {/* <h2>Connect and Mint your AA powered NFT now</h2> */}
      <div className="space-y-6">
        <img src="assets/logo.png" width={220} alt="FRAMED!"></img>

        {!authenticated && (
          <Button size={"lg"} onClick={login}>
            PLAY!
          </Button>
        )}
      </div>
      {/* {loading && <p>Loading Smart Account...</p>} */}
      {authenticated && <WaitingRoom />}
    </main>
  );
}

export default App;
