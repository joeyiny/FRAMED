import express, { Request, Response } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer} from 'socket.io';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = createServer(app);

const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);
  
  // Every socket joins the "main" room upon connection
  socket.join('main');

  socket.on('sendMessage', (message: string) => {
    console.log('Received sendMessage event', message);
    io.to('main').emit('newMessage', message); // Send to all sockets in the "main" room.
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
