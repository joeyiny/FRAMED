import Navbar from "@/components/navbar";

import TutorialFlow from "./tutorial-flow";
import { useState } from "react";

const InGameScreen = () => {
  const [gamePhase, setGamePhase] = useState("tutorial");
  return (
    <div>
      <Navbar />
      {gamePhase === "tutorial" && <TutorialFlow setGamePhase={setGamePhase} />}
      {gamePhase === "inRoom" && <p>in room</p>}
    </div>
  );
};
export default InGameScreen;
