import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { game } from "@/query";
import { useSocket } from "../../context/SocketContext";

const KilledPlayerEvent = ({ gameId, roomId, onPlayerDeath }) => {
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
            if (!isAlive) {
              onPlayerDeath(playerId);
            }
          }
        });
      }
    }, [data, previousData, socket, onPlayerDeath]);
  
    return null;
  };

export default KilledPlayerEvent;
