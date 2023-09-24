import Navbar from "@/components/navbar";

import TutorialFlow from "./tutorial-flow";
import { useState } from "react";
import WaitingRoom from "./waiting-room";
import Chat from "@/components/Chat";

const InGameScreen = () => {
  const [gamePhase, setGamePhase] = useState<"tutorial" | "inRoom">("tutorial");
  return (
    <div className="relative">
      <Navbar />
      <main>
        {gamePhase === "tutorial" && <TutorialFlow setGamePhase={setGamePhase} />}
        {gamePhase === "inRoom" && <WaitingRoom />}
      </main>
      <section className="absolute w-80 right-0 top-0 h-screen">
        <Chat />
      </section>
    </div>
  );
};
export default InGameScreen;
