export const event = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  SELF_JOIN_ROOM: 'self join room',
  OTHER_JOIN_ROOM: 'other join room',
  SELF_LEAVE_ROOM: 'self leave room',
  OTHER_LEAVE_ROOM: 'other leave room',
  CHAT: 'chat'
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