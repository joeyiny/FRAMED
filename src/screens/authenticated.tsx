import Navbar from "@/components/navbar";
import { useState } from "react";
import InGameScreen from "./in-game";
import { useQuery } from "@apollo/client";
import { games } from "@/query";
import GameSelection from "@/components/game-selection";

export const FACTORY_ADDRESS = "0x004cb0A9fbB32468aF5a76e85F0F97101f294093";

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
