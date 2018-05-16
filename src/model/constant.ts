// 接口粒度定小一点，减小耦合度
export const ServerEvent = {
  LOGIN: 's-login',
  OPEN_NEW_ROOM: 's-add new room',
  SELF_JOIN_ROOM: 's-self join room',
  SELF_LEAVE_ROOM: 's-self leave room',
  CHAT: 's-chat',
  GET_ROOM_PLAYERS: 's-get room players',
  GET_ROOM_LIST: 's-get room list'
};

export const ClientEvent = {
  LOGIN: 'c-login',
  SELF_JOIN_ROOM: 'c-self join room',
  OTHER_JOIN_ROOM: 'c-other join room',
  SELF_LEAVE_ROOM: 'c-self leave room',
  OTHER_LEAVE_ROOM: 'c-other leave room',
  CHAT: 'c-chat',
  GET_ROOM_PLAYERS: 'c-get room players',
  GET_ROOM_LIST: 'c-get room list',
  APP_ERROR: 'c-my error',  // 业务逻辑上的错误，不是socket自带的'error'事件
  SYS_ERROR: 'c-sys error'  // 系统的错误
};

export type ClientEventPayload = {
  LOGIN: User,
  SELF_JOIN_ROOM: Room,
  OTHER_JOIN_ROOM: User,
  SELF_LEAVE_ROOM: never,
  OTHER_LEAVE_ROOM: User,
  CHAT: ChatMessage,
  GET_ROOM_PLAYERS: User[],
  GET_ROOM_LIST: Room[],
  APP_ERROR: string,  // 业务逻辑上的错误，不是socket自带的'error'事件
  SYS_ERROR: any  // 系统的错误
};

export type ServerEventPayload = {
  LOGIN: Partial<User>,
  OPEN_NEW_ROOM: string,
  SELF_JOIN_ROOM: number,
  SELF_LEAVE_ROOM: number,
  CHAT: string,
  GET_ROOM_PLAYERS: number,
  GET_ROOM_LIST: never
};

export const ErrorMessage = {
  ROOM_ALREADY_CLOSED: '房间已关闭',
  ROOM_PLAYERS_FULL: '房间人数已满'
};

export const ROOM_CAPACITY = 10; // 单个房间最大人数

export type User = {
  userName: string  // 可能重复
  userId: number
};

export type Room = {
  roomName: string  // 可能重复
  roomId: number
  players: User[]
};

export type ChatMessage = {
  text: string
  user: User
  createTime: number
};

export type Data = {
  nextUserId: number
};
