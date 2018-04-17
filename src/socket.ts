import { Server } from 'http';
import * as socketIO from 'socket.io';
import { ServerEvent, ClientEvent, User } from './model';
import { app } from './app';

const userKey = Symbol('user');

function getSocketRoomId(roomId: number) {
  return `room-${roomId}`;
}

export function createSocketServer(server: Server) {

  const socketServer = socketIO(server);

  socketServer.on('connection', socket => {

    console.log(`socket ${socket.id} connected at ${Date()}`);

    socket.on(ServerEvent.LOGIN, (user: Partial<User>) => {
      socket[userKey] = app.login(user);
      socket.emit(ClientEvent.LOGIN, socket[userKey] as User);
    });

    socket.on(ServerEvent.GET_ROOM_PLAYERS, (roomId: number) => {
      socket.emit(ClientEvent.GET_ROOM_PLAYERS, app.getRoomPlayers(roomId));
    });

    socket.on('disconnecting', () => {
      socket.broadcast.emit(ClientEvent.OTHER_LEAVE_ROOM, socket[userKey] as User);
      app.logout((socket[userKey] as User).userId);
      console.log(`socket ${socket.id} disconnected at ${Date()}`);
    });

    socket.on(ServerEvent.SELF_JOIN_ROOM, (roomId: number) => {
      socket.join(getSocketRoomId(roomId), (err: any) => {
        if (err) {
          throw err;
        }
        const user = socket[userKey] as User;
        app.joinRoom(roomId, user);
        socket.emit(ClientEvent.SELF_JOIN_ROOM, roomId);
        socket.broadcast.emit(ClientEvent.OTHER_JOIN_ROOM, user);
      });
    });

    socket.on(ServerEvent.SELF_LEAVE_ROOM, (roomId: number) => {
      const socketRoomId = getSocketRoomId(roomId);
      socket.leave(socketRoomId, (err: any) => {
        if (err) {
          throw err;
        }
        const user = socket[userKey] as User;
        app.leaveRoom(roomId, user.userId);
        socket.emit(ClientEvent.SELF_LEAVE_ROOM);
        socket.to(socketRoomId).emit(ClientEvent.OTHER_LEAVE_ROOM, user);
      });
    });

    socket.on(ServerEvent.CHAT, (message: string) => {
      socket.broadcast.emit(ClientEvent.CHAT, message);
    });

  });

  return socketServer;

}
