import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { createGame } from "@/lib/game-functions";

const RoomPicker = ({
  games,
  setGameContract,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  games: any[];
  setGameContract: Dispatch<SetStateAction<string>>;
}) => {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  const { user } = usePrivy();
  // const { data, loading } = useQuery(newGame, { variables: { creator: embeddedWallet } });
  // console.log(data);
  return (
    <div>
      <p className="font-bold text-lg">Pick a game:</p>
      <div className="flex flex-col gap-4">
        {games.map((game, i) => {
          // Note that I'm assuming `game` and `user.wallet` objects are well-formed here.
          // In a production setting, there should be validations.
          const players = game.Players.map((p) => p.player.id);
          const playerIsJoined = players.includes(user.wallet.address.toLowerCase());
          // Perform additional computations here if needed
          return (
            <button
              onClick={() => setGameContract(game.id)}
              disabled={game.Players.length >= 4 && !playerIsJoined}
              className="border border-zinc-600"
              key={i}>
              <div>{game.id}</div>
              <div>{game.Players.length} players</div>
              {playerIsJoined && <div>You are in this game.</div>}
            </button>
          );
        })}
        <Button
          onClick={async () => {
            const address = await createGame(embeddedWallet);
            setGameContract(address);
          }}>
          or, create a game
        </Button>
      </div>
    </div>
  );
};
export default RoomPicker;
