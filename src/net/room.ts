import { ServerEvent, ClientEvent, User, ClientEventPayload, ServerEventPayload } from '../model/constant';
import { app } from '../model/app';
import { getAttachedUser } from './user';

const roomIdKey = Symbol('roomId'); // 用来存储业务逻辑中的roomId

/**
 * 根据业务逻辑中的roomId拿到socket所在的RoomId
 * @param roomId 业务逻辑中的roomId
 */
function getSocketRoomId(roomId: number) {
  return `room-${roomId}`;
}

export function configureRoomService(socket: SocketIO.Socket) {

  function joinRoom(roomId: number) {
    try {
      const user = getAttachedUser(socket)!;
      const room = app.joinRoom(roomId, user);    // 可能throw err
      socket.join(getSocketRoomId(roomId), (err: any) => {
        if (err) {
          console.error(err);
          app.leaveRoom(roomId, user.userId);  // 回滚
          socket.emit(ClientEvent.SYS_ERROR, err);
          return;
        }
        socket[roomIdKey] = roomId;
        socket.emit(ClientEvent.SELF_JOIN_ROOM, room as ClientEventPayload['SELF_JOIN_ROOM']);
        socket.broadcast.emit(ClientEvent.OTHER_JOIN_ROOM, user as ClientEventPayload['OTHER_JOIN_ROOM']);
      });
    } catch (message) {
      socket.emit(ClientEvent.APP_ERROR, message as ClientEventPayload['APP_ERROR']);
    }
  }

  function leaveRoom() {
    const roomId = socket[roomIdKey] as number;
    const socketRoomId = getSocketRoomId(roomId);
    socket.leave(socketRoomId, (err: any) => {
      if (err) {
        console.error(err);
        socket.emit(ClientEvent.SYS_ERROR, err);
        return;
      }
      const user = getAttachedUser(socket) as User;
      app.leaveRoom(roomId, user.userId);
      socket[roomIdKey] = undefined;
      socket.emit(ClientEvent.SELF_LEAVE_ROOM);
      socket.to(socketRoomId).emit(ClientEvent.OTHER_LEAVE_ROOM, user as ClientEventPayload['OTHER_LEAVE_ROOM']);
    });
  }

  socket.on(ServerEvent.GET_ROOM_PLAYERS, (roomId: ServerEventPayload['GET_ROOM_PLAYERS']) => {
    socket.emit(ClientEvent.GET_ROOM_PLAYERS, app.getRoomPlayers(roomId) as ClientEventPayload['GET_ROOM_PLAYERS']);
  });

  socket.on(ServerEvent.OPEN_NEW_ROOM, (roomName: ServerEventPayload['OPEN_NEW_ROOM']) => {
    const newRoom = app.openNewRoom(roomName);
    joinRoom(newRoom.roomId);
  });

  socket.on(ServerEvent.SELF_JOIN_ROOM, (roomId: ServerEventPayload['SELF_JOIN_ROOM']) => {
    joinRoom(roomId);
  });

  socket.on(ServerEvent.SELF_LEAVE_ROOM, () => {
    leaveRoom();
  });

  socket.on(ServerEvent.GET_ROOM_LIST, () => {
    socket.emit(ClientEvent.GET_ROOM_LIST, app.rooms as ClientEventPayload['GET_ROOM_LIST']);
  });

  socket.on('disconnecting', () => {
    leaveRoom();
  });

}