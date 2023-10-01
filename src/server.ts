import express, { Request, Response } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = createServer(app);
const io: any = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your client's URL
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

  socket.on('sendMessage', (message: string, roomId: string) => {
    socket.to(roomId).emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
