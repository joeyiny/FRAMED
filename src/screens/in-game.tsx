import Navbar from "@/components/navbar";

import TutorialFlow from "./tutorial-flow";
import { useEffect, useState } from "react";
import WaitingRoom from "./waiting-room";
// import { CONTRACT_ADDRESS } from "./waiting-room";
import { getGameStateFromContract } from "@/lib/game-functions";
import { ClientState, GamePhase } from "@/types";

const InGameScreen = () => {
  const [clientState, setClientState] = useState<ClientState>(ClientState.Tutorial);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WaitingForPlayers);
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const r = await getGameStateFromContract();
        if (!r) {
          throw Error("There was an issue getting the game state from the contract.");
        }
        if (r === 0) {
          setGamePhase(GamePhase.WaitingForPlayers);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchGameState();
  }, []);
  return (
    <div>
      <Navbar />
      {clientState === "tutorial" && <TutorialFlow setClientState={setClientState} />}
      {clientState === "inGame" && <WaitingRoom gamePhase={gamePhase} />}
    </div>
  );
};
export default InGameScreen;
