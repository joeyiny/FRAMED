import { ServerOptions as IOServerOptions } from 'socket.io';

declare module 'socket.io' {
  interface ServerOptions extends IOServerOptions {
    cors?: {
      origin: string;
      methods: string[];
      credentials?: boolean;
    };
  }
}
