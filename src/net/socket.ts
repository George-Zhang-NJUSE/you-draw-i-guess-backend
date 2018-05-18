import { Server } from 'http';
import * as socketIO from 'socket.io';
import { configureRoomService } from './room';
import { configureUserService } from './user';
import { configureChatService } from './chat';

export function createSocketServer(server: Server) {

  const socketServer = socketIO(server);

  socketServer.on('connection', socket => {
    // 一条socket对应一个user
    console.log(`socket ${socket.id} connected at ${Date()}`);

    configureRoomService(socket);
    configureUserService(socket);
    configureChatService(socket);

    socket.on('disconnecting', () => {
      console.log(`socket ${socket.id} disconnected at ${Date()}`);
    });

  });

  return socketServer;

}
