import { Button } from "@/components/ui/button";
import * as Typography from "@/components/ui/typography";
import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  initializeGame,
  isMafiaKilled,
  joinGame,
  takeAction,
  viewCaught,
  viewRole,
  votePlayer,
} from "@/lib/game-functions";
// import { fetchFundsForNewUser } from "@/lib/faucet-functions";
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
import { Spinner } from "@/components/spinner";
// import { formatEther } from "ethers";
// import { ensureDisplayName } from "@/lib/display-name";

export const PLAYER_NAMES = ["Soup Enjoyer", "Pineapple Guy", "Zippy", "Dizzy Dan"];

export interface Player {
  action: boolean;
  id: string;
  alive: boolean;
  position?: string;
  vote: boolean;
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
  // const [hasFunds, setHasFunds] = useState(false).;
  const [dialog] = useState("");
  const [resultsText, setResultsText] = useState("loading results...");
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WaitingForPlayers);
  // const [deadPlayer, setDeadPlayer] = useState("");

  const { chatsOpenState } = React.useContext(ChatContext);
  const [investigationResults, setInvestigationResults] = useState<"correct" | "incorrect" | "error" | null>(null);

  // const [playerIsJoined, setPlayerIsJoined] = useState(false);

  const [playerRole, setPlayerRole] = useState<PlayerRole>(PlayerRole.Unknown);

  const { data, loading } = useQuery(game, { variables: { id: gameContract } });
  const [loadingButtons, setLoadingButtons] = useState<boolean>(false);

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
    console.log(data.game);
    players = data.game.Players.map((p) => ({
      action: p.action,
      alive: p.alive,
      id: p.player.id,
      position: p.position,
      vote: p.vote,
    }));

    // Find the current player's entry in the players array
    const currentPlayer = players.find((player) => player.id === user.wallet.address.toLowerCase());
    if (currentPlayer) {
      playerId = currentPlayer.position.toString();
    }
    // console.log("HERE: ", currentPlayer);
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

  if (loading)
    return (
      <div className="w-full flex-col flex h-40 items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className={gameStyle}>
        <ErrorBoundary fallback={<p>something went wrong. please refresh.</p>}>
          {/* <p>{user.wallet.address}</p> */}
          <div className="w-full  flex flex-row justify-center items-center gap-3">
            <p className="text-lg font-semibold text-zinc-800">
              Room id: <span className="font-bold">{roomId}</span>
            </p>
            <Button disabled={loadingButtons} onClick={() => setGameContract(null)}>
              Exit room
            </Button>
          </div>
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
                      setLoadingButtons(true);
                      await joinGame(embeddedWallet, gameContract);
                      setLoadingButtons(false);
                    }}
                    disabled={loadingButtons}
                    // disabled={!hasFunds}
                    size="lg"
                    className="mt-8">
                    Join Game
                  </Button>
                </>
              )}
            </>
          )}
          <div className="my-4 sm:my-16">
            {!loading ? (
              gamePhase === GamePhase.WaitingForPlayers ? (
                <Typography.TypographyLarge className="animate-pulse">
                  {players && players.length < 4 ? "Waiting for other players to join..." : "Room full!"}
                </Typography.TypographyLarge>
              ) : gamePhase === GamePhase.AwaitPlayerActions ? (
                playerHasAction ? (
                  <Typography.TypographyLarge>Waiting for others to take action...</Typography.TypographyLarge>
                ) : (
                  <div>
                    <Typography.TypographyLarge>
                      {playerRole === PlayerRole.Unknown
                        ? "Let's check to see what your role is!"
                        : playerRole === 1
                        ? "You are the Thief. 🥷🏼 Try to blend in."
                        : playerRole === 2
                        ? "You are the Detective. 🕵🏻‍♂️"
                        : playerRole === 3
                        ? "You are the Doctor. 👨🏻‍⚕️"
                        : playerRole === 4
                        ? "You are a Citizen. 👦🏻"
                        : "There was an error finding your role."}
                    </Typography.TypographyLarge>
                    {playerRole !== PlayerRole.Unknown && (
                      <Typography.TypographyMuted>
                        <Typography.TypographySmall>
                          {playerRole === PlayerRole.Citizen
                            ? "Vote for who you think the thief is."
                            : playerRole === PlayerRole.Thief
                            ? "Choose the player you want to kill."
                            : playerRole === PlayerRole.Doctor
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
                gamePhase === GamePhase.GameComplete && (
                  <Typography.TypographyLarge>
                    {data.game.winner === 0
                      ? "Congrats to the players for defeating the Thief!"
                      : "The Thief has escaped! The players have lost."}
                  </Typography.TypographyLarge>
                )
              )
            ) : null}
          </div>
          {gamePhase === GamePhase.Voting &&
            playerRole === PlayerRole.Detective &&
            (investigationResults === null ? (
              <Button
                onClick={async () => {
                  const result = await viewCaught(embeddedWallet, gameContract);
                  switch (result) {
                    case 0:
                      setInvestigationResults("incorrect");
                      break;
                    case 1:
                      setInvestigationResults("correct");
                      break;
                    default:
                      setInvestigationResults("error");
                  }
                }}>
                🔍 Check investigation results
              </Button>
            ) : investigationResults === "correct" ? (
              <div className="flex flex-col">
                <span className="font-bold">Your investigation was correct! You found the Thief.</span>
                <span>Now, try to convince the other players that you know who the thief is.</span>
              </div>
            ) : investigationResults === "incorrect" ? (
              <p>Your investigation was incorrect. You did not find the thief.</p>
            ) : (
              <p>An error occurred during the investigation.</p>
            ))}
          {loading ? (
            <div className="w-full flex-col flex h-40 items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <div
              id="player-cards-container"
              className="flex flex-row items-center justify-center w-full  m-2 pt-4 sm:px-0">
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
                    <ClickablePlayerCard
                      gamePhase={gamePhase}
                      index={i}
                      player={p}
                      key={i}
                      onClick={async () => await doAction(i)}
                    />
                  ))}
                {players &&
                  gamePhase === GamePhase.Voting &&
                  players.map((p, i) => (
                    <ClickablePlayerCard
                      index={i}
                      gamePhase={gamePhase}
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
          {gamePhase !== GamePhase.WaitingForPlayers &&
            gamePhase !== GamePhase.GameComplete &&
            playerRole === PlayerRole.Unknown && (
              <Button
                className="mt-4"
                disabled={loadingButtons}
                onClick={async () => {
                  setLoadingButtons(true);
                  const role = await viewRole(embeddedWallet, gameContract);
                  if (role === 4) {
                    setPlayerRole(PlayerRole.Citizen);
                  } else if (role === 1) {
                    setPlayerRole(PlayerRole.Thief);
                  } else if (role === 2) {
                    setPlayerRole(PlayerRole.Detective);
                  } else if (role === 3) {
                    setPlayerRole(PlayerRole.Doctor);
                  }
                  setLoadingButtons(false);
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
        </ErrorBoundary>
      </div>
    </>
  );
};
export default InGameScreen;
