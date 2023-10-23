import Navbar from "@/components/navbar";
import { useState } from "react";
import InGameScreen from "./in-game";
import { useQuery } from "@apollo/client";
import { games } from "@/query";
import GameSelection from "@/components/game-selection";

export const FACTORY_ADDRESS = "0xA95FE66beecBe8cBEeF30d91A9F27506d071f80e";

const Authenticated = () => {
  const [gameContract, setGameContract] = useState<string | null>(null);

  const { data, loading } = useQuery(games);

  if (loading || !data) return <p>loading</p>;

  return (
    <div>
      <Navbar />
      {gameContract === null ? (
        <GameSelection games={data.games} setGameContract={setGameContract} />
      ) : (
        <InGameScreen gameContract={gameContract} setGameContract={setGameContract} />
      )}
    </div>
  );
};

export default Authenticated;
