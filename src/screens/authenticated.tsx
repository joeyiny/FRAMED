import Navbar from "@/components/navbar";

import TutorialFlow from "./tutorial-flow";
import { useEffect, useState } from "react";
import InGameScreen from "./in-game";
// import { CONTRACT_ADDRESS } from "./waiting-room";
import { getGameStateFromContract } from "@/lib/game-functions";
import { ClientState, GamePhase } from "@/types";

const Authenticated = () => {
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
        if (r === 1) {
          setGamePhase(GamePhase.AwaitPlayerActions);
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
      {clientState === "inGame" && <InGameScreen gamePhase={gamePhase} />}
    </div>
  );
};
export default Authenticated;
