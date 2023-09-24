import Navbar from "@/components/navbar";

import TutorialFlow from "./tutorial-flow";
import { useState } from "react";
import WaitingRoom from "./waiting-room";

const InGameScreen = () => {
  const [gamePhase, setGamePhase] = useState<"tutorial" | "inRoom">("tutorial");
  return (
    <div>
      <Navbar />
      {gamePhase === "tutorial" && <TutorialFlow setGamePhase={setGamePhase} />}
      {gamePhase === "inRoom" && <WaitingRoom />}
    </div>
  );
};
export default InGameScreen;
