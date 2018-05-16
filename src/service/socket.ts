import { Server } from 'http';
import * as socketIO from 'socket.io';
import { configureRoomService } from './room';
import { configureUserService } from './user';
import { configureChatService } from './chat';

export function createSocketServer(server: Server) {

  const socketServer = socketIO(server);

  socketServer.on('connection', socket => {

    console.log(`socket ${socket.id} connected at ${Date()}`);

    configureRoomService(socket);
    configureUserService(socket);
    configureChatService(socket);

  });

  return socketServer;

}
