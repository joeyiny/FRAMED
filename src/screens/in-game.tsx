// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
import * as Typography from "@/components/ui/typography";
import { shortenEthAddress, shuffleArray } from "@/lib/utils";
import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import { getInstance, provider } from "../lib/fhevm";
import { Contract } from "ethers";
import mafiaABI from "../abi/mafia.json";
import { useContractEvent } from "wagmi";
import { joinGame, queryUsers, takeAction, viewCaught, viewRole, votePlayer } from "@/lib/game-functions";
import { GamePhase } from "@/types";
import { ActivePlayerCard, WaitingPlayerCard } from "@/components/player-cards";

export const CONTRACT_ADDRESS = "0x1d576bE5C42dd9A0682f8E1354EB15A4Ce2d0795";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InGameScreen = ({ gamePhase }: { gamePhase: GamePhase }) => {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isCaught, setIsCaught] = useState(null);
  const [players, setPlayers] = useState<[unknown] | null>();
  const eventListener = (log) => {
    console.log(log);
  };

  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: mafiaABI,
    eventName: "JoinGame",
    // listener: eventListener,
    listener(log) {
      console.log(log);
    },
  });

  useEffect(() => {
    async function fetchInstance() {
      instance = await getInstance();
    }
    fetchInstance();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const p = await queryUsers();
      setLoading(false);
      setPlayers(p);
    };
    fetchData();
  }, []);

  return (
    <>
      {/* <p>{ensName}</p> */}
      <div className="my-16">
        <Typography.TypographyLarge className="animate-pulse">
          Waiting for other players to join...
        </Typography.TypographyLarge>
        <Typography.TypographyMuted>
          {/* <Typography.TypographySmall>1/6 players joined</Typography.TypographySmall> */}
        </Typography.TypographyMuted>
      </div>
      {loading ? (
        "loading..."
      ) : (
        <div id="waiting-cards" className="flex flex-row gap-2 items-center justify-center">
          {/* <ActivePlayerCard address={user?.wallet?.address || ""} /> */}
          {players && players.map((p) => <ActivePlayerCard address={p} />)}
          {/* <WaitingPlayerCard />
          <WaitingPlayerCard />
          <WaitingPlayerCard />
          <WaitingPlayerCard /> */}
        </div>
      )}
      {dialog && <div>{dialog}</div>}
      {/* {loading && <div>{loading}</div>} */}
      {gamePhase === GamePhase.WaitingForPlayers && (
        <Button onClick={joinGame} size="lg" className="mt-8">
          Join Game
        </Button>
      )}
      {/* <Button onClick={initializeGame}>Initialize Game</Button>
      <Button onClick={takeAction}>Take Action</Button>
      <Button onClick={votePlayer}>Vote Player</Button>
      <Button onClick={viewRole}>View Role</Button>
      <Button onClick={queryUsers}>Get users</Button>
      {userRole && <div>{userRole}</div>}
      <Button onClick={viewCaught}>View Caught</Button>
      {isCaught && <div>{isCaught}</div>} */}
    </>
  );
};
export default InGameScreen;
