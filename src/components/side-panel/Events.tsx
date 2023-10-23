import React, { useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { game } from "@/query";
import { useSocket } from "../../context/SocketContext";

const KilledPlayerEvent = ({ gameId, roomId }) => {
  const { data, previousData } = useQuery(game, {
    variables: { id: gameId }
  });
  const socket = useSocket();

  useEffect(() => {
    if (data && previousData && socket) {
      const currentPlayerStatuses = new Map(data.game.Players.map(p => [p.player.id, p.alive]));
      const previousPlayerStatuses = new Map(previousData.game.Players.map(p => [p.player.id, p.alive]));

      currentPlayerStatuses.forEach((isAlive, playerId) => {
        if (isAlive !== previousPlayerStatuses.get(playerId)) {
          // Player status has changed
          if (!isAlive) {
            // Player has just died, send update to server
            socket.emit("playerDeath", roomId, playerId);
          }
        }
      });
    }
  }, [data, previousData, socket]);

  return null; // This component doesn't render anything
};

export default KilledPlayerEvent;
