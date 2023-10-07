import express, { Request, Response } from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const server = createServer(app);

const io: SocketIOServer = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

let roomMessages: { [roomId: string]: Message[] } = {};
let roomsWithInitialMessage: Set<string> = new Set();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    if (!roomMessages[roomId]) {
      roomMessages[roomId] = [];
    }
  });

  socket.on('requestInitialMessage', async (roomId, ack) => {
    console.log(`Initial message request received for room: ${roomId}`);
    if (!roomsWithInitialMessage.has(roomId)) {
      roomsWithInitialMessage.add(roomId);
      console.log(`Sending initial message for room: ${roomId}`);
      const initialMessageContext: Message = {
        role: 'user',
        content: 'An NFT has been stolen and there is a single perpetrator among us, there are players that must try and decide who did it. This game is called FRAMED. Your role is one of an engaged non-player with a british heritage. Players are assigned roles as a detective, doctor, citizen, or the theif, players do not know who is who. Start off by setting up this context for the players in a witty way. Do this in 20 words or less',
      };

      const chatCompletion = await openai.chat.completions.create({
        messages: [initialMessageContext],
        model: 'gpt-3.5-turbo',
      });

      const assistantOpeningRemark = chatCompletion.choices[0]?.message.content.trim();
      console.log('assistantOpeningRemark:', assistantOpeningRemark);

      io.to(roomId).emit('newMessage', { sender: 'assistant', content: assistantOpeningRemark });

      roomsWithInitialMessage.add(roomId);
    }
   else {
    console.log(`Initial message already sent for room: ${roomId}`);
  }
    
    ack && ack(true);
  });

  socket.on('sendMessage', async (roomId, message: { sender: string; content: string }) => {
    console.log('Received roomId:', roomId);
    console.log('Received message object:', message);

    if (!roomId || !message) {
      console.error('Missing required parameters. Room ID:', roomId, 'Message:', message);
      return;
    }

    if (['system', 'user', 'assistant'].includes(message.sender)) {
      roomMessages[roomId].push({ role: message.sender as 'system' | 'user' | 'assistant', content: message.content });
      
  

      const chatCompletion = await openai.chat.completions.create({
        messages: roomMessages[roomId], // it seems to have no context rn
        model: 'gpt-3.5-turbo',
      });

      const assistantMessage = chatCompletion.choices[0]?.message.content.trim();
      roomMessages[roomId].push({ role: 'assistant', content: assistantMessage });

      io.to(roomId).emit('newMessage', { sender: 'assistant', content: assistantMessage });
    } else {
      console.error('Invalid sender role:', message.sender);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});

const PORT: number = Number(process.env.PORT) || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
