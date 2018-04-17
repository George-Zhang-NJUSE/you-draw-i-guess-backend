// 接口粒度定小一点，减小耦合度
export const ServerEvent = {
  LOGIN: 's-login',
  SELF_JOIN_ROOM: 's-self join room',
  SELF_LEAVE_ROOM: 's-self leave room',
  CHAT: 's-chat',
  GET_ROOM_PLAYERS: 's-get room players'
};

export const ClientEvent = {
  LOGIN: 'c-login',
  SELF_JOIN_ROOM: 'c-self join room',
  OTHER_JOIN_ROOM: 'c-other join room',
  SELF_LEAVE_ROOM: 'c-self leave room',
  OTHER_LEAVE_ROOM: 'c-other leave room',
  CHAT: 'c-chat',
  GET_ROOM_PLAYERS: 'c-get room players'
};

export type User = {
  userName: string  // 可能重复
  userId: number
};

export type Room = {
  roomName: string  // 可能重复
  roomId: number
  players: User[]
};

export type Data = {
  nextUserId: number
};