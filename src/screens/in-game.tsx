import { Button } from "@/components/ui/button";
import * as Typography from "@/components/ui/typography";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

import { initializeGame, isMafiaKilled, joinGame, takeAction, viewRole, votePlayer } from "@/lib/game-functions";
import { GamePhase, PlayerRole } from "@/types";
import { ActivePlayerCard, ClickablePlayerCard, WaitingPlayerCard } from "@/components/player-cards";
import { useWallets } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@apollo/client";
import { game } from "@/query";
import SidePanel from "@/components/SidePanel";

export interface Player {
  action: boolean;
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InGameScreen = ({
  gameContract,
  setGameContract,
}: {
  gameContract: string;
  setGameContract: Dispatch<SetStateAction<string>>;
}) => {
  const { wallets } = useWallets();
  const { user } = usePrivy();
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
  const [dialog] = useState("");
  const [resultsText, setResultsText] = useState("loading results...");
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WaitingForPlayers);

  // const [playerIsJoined, setPlayerIsJoined] = useState(false);

  const [playerRole, setPlayerRole] = useState<PlayerRole>(PlayerRole.Unknown);

  const { data, loading } = useQuery(game, { variables: { id: gameContract } });

  let players: Player[] = [];
  if (!loading) players = data.game.Players.map((p) => ({ action: p.action, id: p.player.id }));
  const playerIsJoined = players.some((player) => player.id === user.wallet.address.toLowerCase());

  const doAction = async (i: number) => {
    takeAction(i, embeddedWallet, gameContract);
  };

  // useEffect(() => {
  //   if (user.wallet?.address && players.length > 1)
  //     setPlayerIsJoined(Object.values(players).includes(user.wallet.address));
  // }, [user, players]);
  useEffect(() => {
    data && setGamePhase(data.game.phase);
    console.log(data);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      if (gamePhase !== GamePhase.Results) return;
      const r = await isMafiaKilled(embeddedWallet, gameContract);
      setResultsText(r === 0 ? "The mafia has won!" : "The players have won!");
    };
    fetchData();
  }, [gamePhase]);

  if (loading) return <p>loading</p>;
  return (
    <>
      <p>{user.wallet.address}</p>
      <p>{playerIsJoined ? "player joined" : "player hasnt joined"}</p>
      <Button onClick={() => setGameContract(null)}>Exit room</Button>
      <div className="my-16">
        {!loading &&
          (gamePhase === GamePhase.WaitingForPlayers ? (
            <Typography.TypographyLarge className="animate-pulse">
              {players && length < 4 ? "Waiting for other players to join..." : "Room full!"}
            </Typography.TypographyLarge>
          ) : gamePhase === GamePhase.AwaitPlayerActions ? (
            <div>
              <Typography.TypographyLarge>
                {playerRole === PlayerRole.Unknown
                  ? "Let's check to see what your role is!"
                  : `Your role is ${playerRole}`}
              </Typography.TypographyLarge>
              {playerRole !== PlayerRole.Unknown && (
                <Typography.TypographyMuted>
                  <Typography.TypographySmall>
                    {playerRole === PlayerRole.Citizen
                      ? "Vote for who you think the thief is."
                      : playerRole === PlayerRole.Thief
                      ? "Choose the player you want to kill."
                      : playerRole === PlayerRole.Cop
                      ? "Choose the player you want to save."
                      : "Choose the player you want to examine."}
                  </Typography.TypographySmall>
                </Typography.TypographyMuted>
              )}
            </div>
          ) : gamePhase === GamePhase.Voting ? (
            <Typography.TypographyLarge>Let's vote for who we think the thief is.</Typography.TypographyLarge>
          ) : (
            <Typography.TypographyLarge>And the winner is...</Typography.TypographyLarge>
          ))}
      </div>
      {loading ? (
        <div className="w-full">loading...</div>
      ) : (
        <div id="waiting-cards" className="flex flex-row gap-2 items-center justify-center">
          {players &&
            gamePhase === GamePhase.WaitingForPlayers &&
            players.map((p, i) => <ActivePlayerCard player={p} key={i} index={i} />)}

          {Array(4 - (players ? players.length : 0))
            .fill(null)
            .map((_, i) => (
              <WaitingPlayerCard key={i} />
            ))}
          {players &&
            gamePhase === GamePhase.AwaitPlayerActions &&
            players.map((p, i) => (
              <ClickablePlayerCard index={i} player={p} key={i} onClick={async () => await doAction(i)} />
            ))}
          {players &&
            gamePhase === GamePhase.Voting &&
            players.map((p, i) => (
              <ClickablePlayerCard
                index={i}
                player={p}
                key={i}
                onClick={async () => await votePlayer(i, embeddedWallet, gameContract)}
              />
            ))}
        </div>
      )}
      {dialog && <div>{dialog}</div>}
      {/* {loading && <div>{loading}</div>} */}
      {gamePhase === GamePhase.WaitingForPlayers &&
        (players && players.length >= 4 ? (
          <Button
            onClick={async () => {
              initializeGame(embeddedWallet, gameContract);
            }}
            size="lg"
            className="mt-8">
            Begin Game
          </Button>
        ) : (
          <Button
            onClick={async () => {
              await joinGame(embeddedWallet, gameContract);
              // if (r) setPlayerIsJoined(true);
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
            const role = await viewRole(embeddedWallet, gameContract);
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
    </>
  );
};
export default InGameScreen;
