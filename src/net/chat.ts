import { ServerEvent, ChatMessage, User, ClientEvent, ClientEventPayload, ServerEventPayload } from '../model/constant';
import { getAttachedUser } from './user';

export function configureChatService(socket: SocketIO.Socket) {

  socket.on(ServerEvent.CHAT, (text: ServerEventPayload['CHAT']) => {
    const message: ChatMessage = {
      createTime: new Date().getTime(),
      text,
      user: getAttachedUser(socket) as User
    };
    socket.broadcast.emit(ClientEvent.CHAT, message as ClientEventPayload['CHAT']);
  });
  
}