import { ServerEvent, User, ClientEvent, ServerEventPayload } from '../model/constant';
import { app } from '../model/app';

const userKey = Symbol('user');

export function getAttachedUser(socket: SocketIO.Socket): User | undefined {
  return socket[userKey];
}

export function configureUserService(socket: SocketIO.Socket) {

  socket.on(ServerEvent.LOGIN, (user: ServerEventPayload['LOGIN']) => {
    socket[userKey] = app.login(user);
    socket.emit(ClientEvent.LOGIN, socket[userKey] as User);
  });

  socket.on('disconnecting', () => {
    const user = getAttachedUser(socket);
    if (user) {
      app.logout(user.userId);
    }
  });
  
}