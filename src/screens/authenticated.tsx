import Navbar from "@/components/navbar";

// import TutorialFlow from "./tutorial-flow";
import { useState } from "react";
import InGameScreen from "./in-game";
import { useQuery } from "@apollo/client";
import { games } from "@/query";
import RoomPicker from "@/components/room-picker";

export const FACTORY_ADDRESS = "0x004cb0A9fbB32468aF5a76e85F0F97101f294093";

const Authenticated = () => {
  // const [clientState, setClientState] = useState<ClientState>(ClientState.Tutorial);

  // const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");

  // const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WaitingForPlayers);
  const [gameContract, setGameContract] = useState<string | null>(null);

  const { data, loading } = useQuery(games);

  if (loading || !data) return <p>loading</p>;
  return (
    <div>
      <Navbar />
      {gameContract === null ? (
        <RoomPicker games={data.games} setGameContract={setGameContract} />
      ) : (
        <InGameScreen gameContract={gameContract} setGameContract={setGameContract} />
      )}
      {/* {gameContract === null ? <TutorialFlow setClientState={setClientState} />: <InGameScreen gamePhase={gamePhase} setGamePhase={setGamePhase} />} */}
    </div>
  );
};
export default Authenticated;
