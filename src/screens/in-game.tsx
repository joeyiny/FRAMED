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
import {
  initializeGame,
  joinGame,
  queryUsers,
  takeAction,
  viewCaught,
  viewRole,
  votePlayer,
} from "@/lib/game-functions";
import { GamePhase, PlayerRole } from "@/types";
import { ActivePlayerCard, ClickablePlayerCard, WaitingPlayerCard } from "@/components/player-cards";

export const CONTRACT_ADDRESS = "0x1d576bE5C42dd9A0682f8E1354EB15A4Ce2d0795";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InGameScreen = ({ gamePhase }: { gamePhase: GamePhase }) => {
  const { user } = usePrivy();
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isCaught, setIsCaught] = useState(null);
  const [players, setPlayers] = useState<[unknown] | null>();
  const [playerRole, setPlayerRole] = useState(PlayerRole.Unknown);

  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: mafiaABI,
    eventName: "JoinGame",
    // listener: eventListener,
    listener(log) {
      console.log(log);
    },
  });

  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: mafiaABI,
    eventName: "NewState",
    // listener: eventListener,
    listener(log) {
      console.log(log);
    },
  });

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
        {gamePhase === GamePhase.WaitingForPlayers && (
          <Typography.TypographyLarge className="animate-pulse">
            {players && players.length < 3 ? "Waiting for other players to join..." : "Room full!"}
          </Typography.TypographyLarge>
        )}
        {gamePhase === GamePhase.AwaitPlayerActions && playerRole === PlayerRole.Unknown && (
          <Typography.TypographyLarge>Let's check to see what your role is!</Typography.TypographyLarge>
        )}

        {gamePhase === GamePhase.AwaitPlayerActions && playerRole !== PlayerRole.Unknown && (
          <Typography.TypographyLarge>Your role is {playerRole}</Typography.TypographyLarge>
        )}
        {gamePhase === GamePhase.AwaitPlayerActions && playerRole === PlayerRole.Citizen && (
          <Typography.TypographyMuted>
            <Typography.TypographySmall>Vote for who you think the thief is.</Typography.TypographySmall>
          </Typography.TypographyMuted>
        )}
        {gamePhase === GamePhase.AwaitPlayerActions && playerRole === PlayerRole.Thief && (
          <Typography.TypographyMuted>
            <Typography.TypographySmall>Choose the player you want to kill.</Typography.TypographySmall>
          </Typography.TypographyMuted>
        )}
        {gamePhase === GamePhase.AwaitPlayerActions && playerRole === PlayerRole.Cop && (
          <Typography.TypographyMuted>
            <Typography.TypographySmall>Choose the player you want to save.</Typography.TypographySmall>
          </Typography.TypographyMuted>
        )}
        {gamePhase === GamePhase.AwaitPlayerActions && playerRole === PlayerRole.Detective && (
          <Typography.TypographyMuted>
            <Typography.TypographySmall>Choose the player you want to examine.</Typography.TypographySmall>
          </Typography.TypographyMuted>
        )}
      </div>
      {loading ? (
        "loading..."
      ) : (
        <div id="waiting-cards" className="flex flex-row gap-2 items-center justify-center">
          {/* <ActivePlayerCard address={user?.wallet?.address || ""} /> */}
          {players &&
            gamePhase !== GamePhase.AwaitPlayerActions &&
            players.map((p) => <ActivePlayerCard address={p} />)}
          {players &&
            gamePhase === GamePhase.AwaitPlayerActions &&
            players.map((p, i) => <ClickablePlayerCard index={i} address={p} onClick={() => alert(i)} />)}
          {/* <WaitingPlayerCard />
          <WaitingPlayerCard />
          <WaitingPlayerCard />
          <WaitingPlayerCard /> */}
        </div>
      )}
      {dialog && <div>{dialog}</div>}
      {/* {loading && <div>{loading}</div>} */}
      {gamePhase === GamePhase.WaitingForPlayers &&
        (players && players.length >= 3 ? (
          <Button
            onClick={() => {
              initializeGame();
            }}
            size="lg"
            className="mt-8">
            Begin Game
          </Button>
        ) : (
          <Button onClick={joinGame} size="lg" className="mt-8">
            Join Game
          </Button>
        ))}
      {gamePhase === GamePhase.AwaitPlayerActions && playerRole === PlayerRole.Unknown && (
        <Button
          className="mt-4"
          onClick={async () => {
            const role = await viewRole();
            if (role === 0) {
              setPlayerRole(PlayerRole.Citizen);
            } else if (role === 1) {
              setPlayerRole(PlayerRole.Thief);
            } else if (role === 2) {
              setPlayerRole(PlayerRole.Detective);
            } else if (role === 3) {
              setPlayerRole(PlayerRole.Cop);
            }
          }}>
          View Role
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

let selectCard = () => {};
