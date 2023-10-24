import { useWallets } from "@privy-io/react-auth";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { createGame } from "@/lib/game-functions";
import { Input } from "./ui/input";
import { TypographyH2 } from "./ui/typography";
import { useQuery } from "@apollo/client";
import { games } from "@/query";

const RoomPicker = ({
  // games,
  setGameContract,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  games: any[];
  setGameContract: Dispatch<SetStateAction<string>>;
}) => {
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  // const { user } = usePrivy();
  const { data, loading } = useQuery(games);
  const [roomIdInput, setRoomIdInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loadingCreatingGame, setLoadingCreatingGame] = useState(false);

  const handleJoin = (roomId: string) => {
    // Change this to string to match the input
    // Convert the roomId from string to number
    const parsedRoomId = parseInt(roomId, 10);

    // Check if roomId is a valid number
    if (isNaN(parsedRoomId)) {
      console.error("Invalid room ID");
      // Here, you can set some state to display the error in your UI if you want
      return;
    }

    // Find the game with the corresponding roomId
    const gameToJoin = data.games.find((game) => game.roomId === parsedRoomId);

    if (!gameToJoin) {
      console.error(`Game ${roomId} not found`);
      setErrorMessage(`Game ${roomId} not found`);
      // Set state or handle the error as you wish here, possibly show a message to the user
      return;
    }

    // If we find a game, we can extract the address and proceed
    const gameAddress = gameToJoin.id;

    // Proceed with the game address, such as updating state or redirecting to the game room
    setGameContract(gameAddress);
  };

  // const { data, loading } = useQuery(newGame, { variables: { creator: embeddedWallet } });
  // console.log(data);
  return (
    <div className="max-w-xs  m-auto mt-6">
      <TypographyH2 className="font-bold mb-6 border-b-0 ">Choose a game</TypographyH2>
      <div className="flex flex-col gap-4">
        {/* {games.map((game, i) => {
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
              <div>Room {game.roomId}</div>
              <div>{game.Players.length} players</div>
              {playerIsJoined && <div>You are in this game.</div>}
            </button>
          );
        })} */}
        {/* <p>Enter a room ID:</p> */}
        {errorMessage && <p className="text-red-700">{errorMessage}</p>}
        <div className=" m-auto flex flex-row gap-2">
          {/* <Label>Enter a room ID:</Label> */}
          <Input
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            className=" border-zinc-300 w-full"
            type="number"
            min="0"
            placeholder="Enter Room ID"></Input>
          <Button disabled={loading || loadingCreatingGame} onClick={() => handleJoin(roomIdInput)}>
            {loading ? "loading..." : "Submit"}
          </Button>
        </div>
        <span>-- or --</span>
        <Button
          disabled={loadingCreatingGame}
          onClick={async () => {
            setLoadingCreatingGame(true);
            const address = await createGame(embeddedWallet);
            setLoadingCreatingGame(false);
            setGameContract(address);
          }}>
          {loadingCreatingGame ? "Creating game..." : "Create game"}
        </Button>
      </div>
    </div>
  );
};
export default RoomPicker;
