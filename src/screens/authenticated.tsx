import Navbar from "@/components/navbar";

// import TutorialFlow from "./tutorial-flow";
import { useEffect, useState } from "react";
import InGameScreen from "./in-game";
import { getGameStateFromContract } from "@/lib/game-functions";
import { GamePhase } from "@/types";
import { useWallets } from "@privy-io/react-auth";
import { useQuery } from "@apollo/client";
import { games } from "@/query";
import RoomPicker from "@/components/room-picker";

export const FACTORY_ADDRESS = "0xeb7f8b1ddcb7b2df870575dd64fcc3a420c6d907";

const Authenticated = () => {
  // const [clientState, setClientState] = useState<ClientState>(ClientState.Tutorial);

  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");

  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WaitingForPlayers);
  const [gameContract, setGameContract] = useState<string | null>(null);

  const { data, loading } = useQuery(games);
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const r = await getGameStateFromContract(embeddedWallet, gameContract);
        console.log("r in fGS:", r);
        if (r === 0) {
          setGamePhase(GamePhase.WaitingForPlayers);
        } else if (r === 1) {
          setGamePhase(GamePhase.AwaitPlayerActions);
        } else if (r === 2) {
          setGamePhase(GamePhase.Voting);
        } else if (r === 3) {
          setGamePhase(GamePhase.Results);
        } else {
          throw Error("There was an issue getting the game state from the contract.");
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (embeddedWallet) fetchGameState();
  }, [embeddedWallet]);
  if (loading || !data) return <p>loading</p>;
  return (
    <div>
      <Navbar />
      {gameContract === null ? (
        <RoomPicker games={data.games} setGameContract={setGameContract} />
      ) : (
        <InGameScreen gameContract={gameContract} setGameContract={setGameContract} gamePhase={gamePhase} />
      )}
      {/* {gameContract === null ? <TutorialFlow setClientState={setClientState} />: <InGameScreen gamePhase={gamePhase} setGamePhase={setGamePhase} />} */}
    </div>
  );
};
export default Authenticated;
