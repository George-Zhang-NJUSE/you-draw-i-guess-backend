import { Server } from 'http';
import * as socketIO from 'socket.io';
import { event, User } from './model';
import { app } from './app';

const userKey = Symbol('user');

export function createSocketServer(server: Server) {
  
  const socketServer = socketIO(server);

  socketServer.on('connection', socket => {

    console.log(`socket ${socket.id} connected at ${Date()}`);

    socket.on(event.LOGIN, (user: Partial<User>) => {
      socket[userKey] = app.login(user);
      socket.emit(event.LOGIN, socket[userKey]);
    });

    socket.on('disconnecting', () => {
      socket.broadcast.emit(event.OTHER_LEAVE_ROOM, (socket[userKey] as User).userName);
      console.log(`socket ${socket.id} disconnected at ${Date()}`);
    });

    socket.on(event.SELF_JOIN_ROOM, (roomId: number, user: User) => {
      socket.join(`room-${roomId}`);
      
      socket.broadcast.emit(event.OTHER_JOIN_ROOM, user.userName);
      // todo 获取房间内其他人
      // socket.emit(event.SELF_JOIN_ROOM, )
    });

  });

  return socketServer;
}
