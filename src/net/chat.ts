import {
  ServerEvent, ChatMessage, User, ClientEvent,
  ClientEventPayload, ServerEventPayload, ErrorMessage
} from '../model/constant';
import { getAttachedUser } from './user';
import { getSocketRoomId } from './room';

export function configureChatService(socket: SocketIO.Socket) {

  socket.on(ServerEvent.CHAT, (text: ServerEventPayload['CHAT']) => {
    
    const message: ChatMessage = {
      createTime: new Date().getTime(),
      text,
      user: getAttachedUser(socket) as User
    };

    const socketRoomId = getSocketRoomId(socket);
    if (!socketRoomId) {
      socket.emit(ClientEvent.APP_ERROR, ErrorMessage.NOT_IN_A_ROOM);
      return;
    }
    socket.to(socketRoomId).emit(ClientEvent.CHAT, message as ClientEventPayload['CHAT']);
  });

}