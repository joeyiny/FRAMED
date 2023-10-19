import { Button } from "@/components/ui/button";
import * as Typography from "@/components/ui/typography";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";

import { initializeGame, isMafiaKilled, joinGame, takeAction, viewRole, votePlayer } from "@/lib/game-functions";
import { GamePhase, PlayerRole } from "@/types";
import { ActivePlayerCard, ClickablePlayerCard, WaitingPlayerCard } from "@/components/player-cards";
import { useWallets } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@apollo/client";
import { game } from "@/query";
// import SidePanel from "@/components/side-panel";
import { ChatContext } from "../context/ChatContext";
import InviteFriends from "@/components/invite-friends";
import SidePanel from "@/components/side-panel";
// import { ensureDisplayName } from "@/lib/display-name";

export const PLAYER_NAMES = ["Soup Enjoyer", "Jerry", "Zippy", "Dizzy Dan"];

export interface Player {
  action: boolean;
  id: string;
  alive: boolean;
  position?: string;
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
  // const [deadPlayer, setDeadPlayer] = useState("");

  const { chatsOpenState } = React.useContext(ChatContext);

  // const [playerIsJoined, setPlayerIsJoined] = useState(false);

  const [playerRole, setPlayerRole] = useState<PlayerRole>(PlayerRole.Unknown);

  const { data, loading } = useQuery(game, { variables: { id: gameContract } });

  // const [displayName, setDisplayName] = useState<string | null>(null);
  // const [playerId, setPlayerId] = useState<string | null>(null);

  let roomId = null;
  if (data && data.game) {
    roomId = data.game.roomId;
  }
  
  const isChatOpen = chatsOpenState[roomId];
  const gameStyle = isChatOpen 
    ? "w-11/12 h-11/12 sm:w-full sm:h-auto lg:w-2/3 transition-all duration-300" 
    : "w-11/12 h-11/12 sm:w-full sm:h-auto  mt-20 sm:mt-0 transition-all duration-300";



  let players: Player[] = [];
  let playerHasAction = false;
  let playerId = null;

  if (!loading) {
    players = data.game.Players.map((p) => ({
      action: p.action,
      alive: p.alive,
      id: p.player.id,
      position: p.position,
    }));

    // Find the current player's entry in the players array
    const currentPlayer = players.find((player) => player.id === user.wallet.address.toLowerCase());
    if (currentPlayer) {
      playerId = currentPlayer.position.toString();
    }
    console.log("HERE: ", currentPlayer);
    // setPlayerId(currentPlayer.id);
    // Update playerHasAction based on the currentPlayer's action property
    playerHasAction = currentPlayer ? Boolean(currentPlayer.action) : false;
  }
  const playerIsJoined = players.some((player) => player.id === user.wallet.address.toLowerCase());
  console.log("Is player joined:", playerIsJoined);

  const doAction = async (i: number) => {
    !playerHasAction && takeAction(i, embeddedWallet, gameContract);
  };

  // useEffect(() => {
  //   if (user.wallet?.address && players.length > 1)
  //     setPlayerIsJoined(Object.values(players).includes(user.wallet.address));
  // }, [user, players]);

  // useEffect(() => {
  //   const name = ensureDisplayName();
  //   setDisplayName(name);
  // }, []);

  useEffect(() => {
    data && setGamePhase(data.game.phase);
    console.log(data);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      if (gamePhase !== GamePhase.RoundComplete) return;
      const r = await isMafiaKilled(embeddedWallet, gameContract);
      setResultsText(r === 0 ? "The mafia has won!" : "The players have won!");
    };
    fetchData();
  }, [gamePhase]);

  if (loading) return <p>loading</p>;

  return (
    <>
      <div className={gameStyle}>
        {/* <p>{user.wallet.address}</p> */}
        <Button onClick={() => setGameContract(null)}>Exit room</Button>
        <div className="my-4 sm:my-16">
          {!loading ? (
            gamePhase === GamePhase.WaitingForPlayers ? (
                (
                <Typography.TypographyLarge className="animate-pulse">
                  {players && players.length < 4 ? "Waiting for other players to join..." : "Room full!"}
                </Typography.TypographyLarge>
              ) 
            ) : gamePhase === GamePhase.AwaitPlayerActions ? (
              playerHasAction ? (
                <Typography.TypographyLarge>Waiting for others to take action...</Typography.TypographyLarge>
              ) : (
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
              )
            ) : gamePhase === GamePhase.Voting ? (
              <Typography.TypographyLarge>Let's vote for who we think the thief is.</Typography.TypographyLarge>
            ) : (
              <Typography.TypographyLarge>And the winner is...</Typography.TypographyLarge>
            )
          ) : null}
        </div>
        {loading ? (
          <div className="w-full">loading...</div>
        ) : (
          <div id="player-cards-container" className="flex flex-row items-center justify-center w-full  m-2 pt-4 sm:px-0">
          <div id="waiting-cards" className="flex flex-row gap-2 items-center justify-center">
            {players &&
              gamePhase === GamePhase.WaitingForPlayers &&
              players.map((p, i) => (
                <div>
                  <ActivePlayerCard player={p} key={i} index={i} />
                </div>
              ))}

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
          </div>
        )}
        {dialog && <div>{dialog}</div>}
        {/* {loading && <div>{loading}</div>} */}
        {gamePhase === GamePhase.WaitingForPlayers && (
          <>
            {players && players.length >= 4 ? (
              <Button
                onClick={async () => {
                  initializeGame(embeddedWallet, gameContract);
                }}
                size="lg"
                className="mt-8">
                Begin Game
              </Button>
            ) : playerIsJoined ? (
              <InviteFriends roomId={data.game.roomId} />
            ) : (
              <>
                <Button
                  onClick={async () => {
                    await joinGame(embeddedWallet, gameContract);
                  }}
                  size="lg"
                  className="mt-8">
                  Join Game
                </Button>
              </>
            )}
          </>
        )}
        {gamePhase === GamePhase.AwaitPlayerActions && playerRole === PlayerRole.Unknown && !playerHasAction && (
          <Button
            className="mt-4"
            onClick={async () => {
              const role = await viewRole(embeddedWallet, gameContract);
              if (role === 4) {
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
        {gamePhase === GamePhase.RoundComplete && (
          <div>
            <Typography.TypographyH3>{resultsText}</Typography.TypographyH3>
            <Button className="mt-4">Play Again</Button>
          </div>
        )}
        {playerIsJoined && playerId && <SidePanel roomId={roomId} player_id={playerId} hasJoined={playerIsJoined} />}
      </div>
    </>
  );
};
export default InGameScreen;
