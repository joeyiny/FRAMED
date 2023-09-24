import Navbar from "@/components/navbar";

import TutorialFlow from "./tutorial-flow";
import { useEffect, useState } from "react";
import WaitingRoom from "./waiting-room";
import { CONTRACT_ADDRESS } from "./waiting-room";
import { getGameStateFromContract } from "@/lib/game-functions";

const InGameScreen = () => {
  const [gamePhase, setGamePhase] = useState<"tutorial" | "inRoom">("tutorial");
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const r = await getGameStateFromContract();
        console.log(r);
        return r;
      } catch (err) {
        console.error(err);
      }
    };
    fetchGameState();
  }, []);
  return (
    <div>
      <Navbar />
      {gamePhase === "tutorial" && <TutorialFlow setGamePhase={setGamePhase} />}
      {gamePhase === "inRoom" && <WaitingRoom />}
    </div>
  );
};
export default InGameScreen;
