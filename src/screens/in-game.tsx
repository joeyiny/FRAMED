// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
import * as Typography from "@/components/ui/typography";
import { useState, useEffect } from "react";
import mafiaABI from "../abi/mafia.json";
import { useContractEvent } from "wagmi";
import {
  initializeGame,
  isMafiaKilled,
  joinGame,
  queryUsers,
  takeAction,
  viewRole,
  votePlayer,
} from "@/lib/game-functions";
import { GamePhase, PlayerRole } from "@/types";
import { ActivePlayerCard, ClickablePlayerCard, WaitingPlayerCard } from "@/components/player-cards";
import { useWallets } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import SidePanel from '../components/SidePanel';

export const CONTRACT_ADDRESS = "0x31238F667F86D0A1867D7c747bC74CD2F6dD6438";
const useGameEvents = (eventName: string, callback: (log: unknown) => void) => {
  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: mafiaABI,
    eventName,
    listener(log) {
      callback(log);
    },
    chainId: 9090,
  });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InGameScreen = ({
  gamePhase,
  setGamePhase,
}: {
  gamePhase: GamePhase;
  setGamePhase: React.Dispatch<React.SetStateAction<GamePhase>>;
}) => {
  // State and Variables
  const { wallets } = useWallets();
  const { user } = usePrivy();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  const [loading, setLoading] = useState(true);
  const [dialog] = useState("");
  const [resultsText, setResultsText] = useState("loading results...");
  const [playerIsJoined, setPlayerIsJoined] = useState(false);
  const [players, setPlayers] = useState<string[] | null>(null);
  const [playerRole, setPlayerRole] = useState<PlayerRole>(PlayerRole.Unknown);

  // Contract Event Hooks
  useGameEvents("JoinGame", (log) => {
    console.log("JoinGame event from wagmi:", log);
  });

  useGameEvents("InitGame", (log) => {
    console.log("InitGame event from wagmi:", log);
  });

  useGameEvents("NewState", (log) => {
    const hexString = log[0].data;
    const r = parseInt(hexString, 16);
    if (!r) {
      throw Error("There was an issue getting the game state from the contract.");
    } else {
      setGamePhase(r);
    }
  });

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      const p = await queryUsers();
      const w = user.wallet.address;
      setLoading(false);
      setPlayers(p);
      setPlayerIsJoined(Object.values(p).includes(w));
    };
    fetchData();
  }, [user.wallet.address]);

  useEffect(() => {
    const fetchData = async () => {
      if (gamePhase !== GamePhase.Results) return;
      const r = await isMafiaKilled();
      setResultsText(r === 0 ? "The mafia has won!" : "The players have won!");
    };
    fetchData();
  }, [gamePhase]);

  return (
    <>
      {/* <p>{ensName}</p> */}
      <div className="my-16">
        {/* {gamePhase} */}
        {!loading && gamePhase === GamePhase.WaitingForPlayers && (
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
        {gamePhase === GamePhase.Voting && (
          <Typography.TypographyLarge>Let's vote for who we think the thief is.</Typography.TypographyLarge>
        )}
        {gamePhase === GamePhase.Results && (
          <Typography.TypographyLarge>And the winner is...</Typography.TypographyLarge>
        )}
      </div>
      {loading ? (
        <div className="w-full">loading...</div>
      ) : (
        <div id="waiting-cards" className="flex flex-row gap-2 items-center justify-center">
          {/* <ActivePlayerCard address={user?.wallet?.address || ""} /> */}
          {players &&
            gamePhase === GamePhase.WaitingForPlayers &&
            players.map((p: string, i) => <ActivePlayerCard address={p} index={i} />)}

          {Array(3 - (players ? players.length : 0))
            .fill(null)
            .map((_, i) => (
              <WaitingPlayerCard key={i} />
            ))}

          {/* <WaitingPlayerCard />
          <WaitingPlayerCard />
          <WaitingPlayerCard />
          <WaitingPlayerCard /> */}
          {players &&
            gamePhase === GamePhase.AwaitPlayerActions &&
            players.map((p, i) => (
              <ClickablePlayerCard index={i} address={p} onClick={async () => await doAction(i)} />
            ))}
          {players &&
            gamePhase === GamePhase.Voting &&
            players.map((p, i) => (
              <ClickablePlayerCard index={i} address={p} onClick={async () => await votePlayer(i)} />
            ))}
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
          <Button
            onClick={async () => {
              const r = await joinGame(embeddedWallet);
              if (r) setPlayerIsJoined(true);
            }}
            disabled={playerIsJoined}
            size="lg"
            className="mt-8">
            {playerIsJoined ? "Begin Game" : "Join Game"}
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
      {gamePhase === GamePhase.Results && (
        <div>
          <Typography.TypographyH3>{resultsText}</Typography.TypographyH3>
          <Button className="mt-4">Play Again</Button>
        </div>
      )}
      {/* <Button onClick={initializeGame}>Initialize Game</Button>
      <Button onClick={takeAction}>Take Action</Button>
      <Button onClick={votePlayer}>Vote Player</Button>
      <Button onClick={viewRole}>View Role</Button>
      <Button onClick={queryUsers}>Get users</Button>
      {userRole && <div>{userRole}</div>}
      <Button onClick={viewCaught}>View Caught</Button>
      {isCaught && <div>{isCaught}</div>} */}
      <SidePanel />
    </>
  );
};
export default InGameScreen;

const doAction = async (i: number) => {
  takeAction(i);
};
