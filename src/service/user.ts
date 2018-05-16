import { ServerEvent, User, ClientEvent, ServerEventPayload } from '../model/constant';
import { app } from '../model/app';

const socketUserKey = Symbol('user');

export function getAttachedUser(socket: SocketIO.Socket): User | undefined {
  return socket[socketUserKey];
}

export function configureUserService(socket: SocketIO.Socket) {

  socket.on(ServerEvent.LOGIN, (user: ServerEventPayload['LOGIN']) => {
    socket[socketUserKey] = app.login(user);
    socket.emit(ClientEvent.LOGIN, socket[socketUserKey] as User);
  });

  socket.on('disconnecting', () => {
    socket.broadcast.emit(ClientEvent.OTHER_LEAVE_ROOM, socket[socketUserKey] as User);
    app.logout((socket[socketUserKey] as User).userId);
    console.log(`socket ${socket.id} disconnected at ${Date()}`);
  });
  
}