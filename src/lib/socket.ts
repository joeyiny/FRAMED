import { Server, ServerOptions } from "socket.io";
import { createServer } from "http";
import * as http from 'http';
import * as https from 'https';

let io: Server;

export const initSocket = (server: http.Server | https.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      io.to(roomId).emit("userJoined", { userId: socket.id });
    });

    socket.on("sendMessage", (message, roomId) => {
      io.to(roomId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const getIo = () => io;
