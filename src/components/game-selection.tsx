import { useState, useEffect } from "react"; 
import { useWallets } from "@privy-io/react-auth";
import { Button } from "./ui/button";
import { createGame } from "@/lib/game-functions";
import { fetchFundsForNewUser } from "@/lib/faucet-functions";
import { useQuery, useApolloClient } from "@apollo/client";
import { newGame } from "@/query";

const GameSelection = ({ games, setGameContract }) => {
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isJoinEnabled, setIsJoinEnabled] = useState(false);
  const [hasFunds, setHasFunds] = useState(localStorage.getItem("hasFunds") === "true"); 
  const { wallets } = useWallets();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  const [gameAddress, setGameAddress] = useState(null);

  const { data, loading, error } = useQuery(newGame, {
    variables: { id: gameAddress },
  });

  useEffect(() => { 
    const provideInitialFunds = async () => {
      const result = await fetchFundsForNewUser(embeddedWallet.getEthersProvider(), embeddedWallet.address);
      if (result.status === "success") {
        setHasFunds(true);
      } else if (result.status === "error") {
        console.error("Error fetching funds:", result.message);
      } else {
        console.log(
          result.status === "already_funded" ? "User is already funded" : "Unexpected status:",
          result.status
        );
      }
    };
    provideInitialFunds().catch((error) => console.error("Unexpected error:", error));
  }, [embeddedWallet]);


  useEffect(() => {
    if (data && data.games && data.games.length > 0) {
      const game = data.games[0];
      const roomId = game.roomId;
      console.log('Room ID from live query:', roomId);
      setJoinCode(roomId.toString());
      setIsJoining(true);
      const isGameValid = games.some(game => game.roomId === roomId);
      console.log("handeling joining the game");
      if(isGameValid) {
        handleJoinNewGame(roomId); // Automatically join the game
      }
    }
  }, [data]);
  

  const handleCodeChange = (e) => {
    const enteredCode = e.target.value;
    setJoinCode(enteredCode);
  
    // Check if the entered code is a valid roomId
    setIsJoinEnabled(games.some(game => {
      console.log('Comparing with game:', game);
      return game.roomId === parseInt(enteredCode, 10);
    }));
    handleJoinGame
  };

  const handleJoinGame = () => {
    if (isJoinEnabled) {
      const gameToJoin = games.find(game => game.roomId === parseInt(joinCode, 10));
      setGameContract(gameToJoin.id);
    }
  };
  

const handleCreateGame = async () => {
  try {
    const address = await createGame(embeddedWallet);
    console.log("Created address:", address);
    setGameAddress(address);
  } catch (error) {
    console.error("Error during handleCreateGame:", error);
  }
};

// currently relies on subgraph for roomId of new game
// would be best to pass in the id directly
const handleJoinNewGame = (roomId) => {
  console.log('Joining new game with roomId:', roomId);
  const gameToJoin = games.find(game => game.roomId === roomId);
  if (gameToJoin) {
    setGameContract(gameToJoin.id);
  } else {
    console.error('Could not find the game to join');
  }
};


  
  if (isJoining) {
    return (
      <div className="overflow-y-hidden flex flex-col gap-2 items-center justify-center h-[calc(100vh-4rem)]">
        <a className="mb-4 text-gray-500 cursor-pointer" onClick={() => setIsJoining(false)}>← Go back</a>
        <div className="bg-white p-6 rounded shadow-md w-96">
          <p className="mb-4 text-center">Join an existing room</p>
          <input 
            type="number"
            value={joinCode}
            onChange={handleCodeChange}
            placeholder="Enter room code"
            className="w-full p-2 mb-4 border rounded"
          />
          <Button onClick={handleJoinGame} disabled={!isJoinEnabled} className="w-full bg-black text-white">
            Join room
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="overflow-y-hidden flex flex-col gap-2 pb-24 items-center justify-center h-[calc(100vh-4rem)]">
        <Button 
          onClick={() => setIsJoining(true)} 
          className="w-[40%] mb-2 sm:w-[25%] bg-white text-black hover:bg-gray-200">
          Join a room
        </Button>
        <Button 
          onClick={handleCreateGame}
          disabled={!hasFunds}
          className="w-[40%] sm:w-[25%] bg-black text-white border border-black">
          Create a room
        </Button>
      </div>
    );
  }
};

export default GameSelection;
