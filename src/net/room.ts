import { ServerEvent, ClientEvent, ClientEventPayload, ServerEventPayload } from '../model/constant';
import { app } from '../model/app';
import { getAttachedUser } from './user';

const roomIdKey = Symbol('roomId'); // 用来存储业务逻辑中的roomId

/**
 * 根据业务逻辑中的roomId拿到socket所在的Room Id
 * @param appRoomId 业务逻辑中的roomId
 */
function getInternalRoomId(appRoomId: number) {
  return `room-${appRoomId}`;
}

/**
 * 获取某条socket的Room Id
 * @param socket 
 */
export function getSocketRoomId(socket: SocketIO.Socket): string | null {
  const appRoomId = socket[roomIdKey];
  if (!appRoomId) {
    return null;
  }
  return getInternalRoomId(appRoomId as number);
}

export function configureRoomService(socket: SocketIO.Socket) {

  function joinRoom(appRoomId: number) {
    try {
      const user = getAttachedUser(socket)!;
      const room = app.joinRoom(appRoomId, user);    // 可能throw err
      const socketRoomId = getInternalRoomId(appRoomId);
      socket.join(socketRoomId, (err: any) => {
        if (err) {
          console.error(err);
          app.leaveRoom(appRoomId, user.userId);  // 回滚
          socket.emit(ClientEvent.SYS_ERROR, err);
          return;
        }
        socket[roomIdKey] = appRoomId;
        socket.emit(ClientEvent.SELF_JOIN_ROOM, room as ClientEventPayload['SELF_JOIN_ROOM']);
        socket.to(socketRoomId).emit(ClientEvent.OTHER_JOIN_ROOM, user as ClientEventPayload['OTHER_JOIN_ROOM']);
      });
    } catch (message) {
      socket.emit(ClientEvent.APP_ERROR, message as ClientEventPayload['APP_ERROR']);
    }
  }

  function leaveRoom() {
    const AppRoomId = socket[roomIdKey] as number;
    const internalRoomId = getInternalRoomId(AppRoomId);
    socket.leave(internalRoomId, (err: any) => {
      if (err) {
        console.error(err);
        socket.emit(ClientEvent.SYS_ERROR, err);
        return;
      }
      const user = getAttachedUser(socket);
      if (!user) {
        return;
      }
      app.leaveRoom(AppRoomId, user.userId);
      socket[roomIdKey] = undefined;
      socket.emit(ClientEvent.SELF_LEAVE_ROOM);
      socket.to(internalRoomId).emit(ClientEvent.OTHER_LEAVE_ROOM, user as ClientEventPayload['OTHER_LEAVE_ROOM']);
    });
  }

  /**
   * 通知其他用户更新房间列表信息
   */
  function notifyRoomListChange() {
    socket.broadcast.emit(ClientEvent.GET_ROOM_LIST, app.rooms as ClientEventPayload['GET_ROOM_LIST']);
  }

  socket.on(ServerEvent.GET_ROOM_PLAYERS, (roomId: ServerEventPayload['GET_ROOM_PLAYERS']) => {
    socket.emit(ClientEvent.GET_ROOM_PLAYERS, app.getRoomPlayers(roomId) as ClientEventPayload['GET_ROOM_PLAYERS']);
  });

  socket.on(ServerEvent.OPEN_NEW_ROOM, (roomName: ServerEventPayload['OPEN_NEW_ROOM']) => {
    const newRoom = app.openNewRoom(roomName);
    joinRoom(newRoom.roomId);
    notifyRoomListChange();
  });

  socket.on(ServerEvent.SELF_JOIN_ROOM, (roomId: ServerEventPayload['SELF_JOIN_ROOM']) => {
    joinRoom(roomId);
    notifyRoomListChange();
  });

  socket.on(ServerEvent.SELF_LEAVE_ROOM, () => {
    leaveRoom();
    notifyRoomListChange();
  });

  socket.on(ServerEvent.GET_ROOM_LIST, () => {
    socket.emit(ClientEvent.GET_ROOM_LIST, app.rooms as ClientEventPayload['GET_ROOM_LIST']);
  });

  socket.on('disconnecting', () => {
    leaveRoom();
  });

}