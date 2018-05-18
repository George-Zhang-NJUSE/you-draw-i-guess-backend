import { User, Room, ROOM_CAPACITY, ErrorMessage } from '../model/constant';
import { data } from '../util/dataAccess';

class App {

  onlineUsers: User[] = [];
  rooms: Room[] = [];

  openNewRoom(roomName: string): Room {
    const newRoom = {
      roomId: this.generateRoomId(),
      roomName,
      players: []
    };
    this.rooms.push(newRoom);
    return newRoom;
  }

  closeRoom(roomId: number) {
    this.deleteSingleIf(this.rooms, (r: Room) => r.roomId === roomId);
  }

  joinRoom(roomId: number, user: User): Room {
    const room = this.rooms.find(r => r.roomId === roomId);
    if (!room) {
      throw ErrorMessage.ROOM_ALREADY_CLOSED;
    }
    if (room.players.length === ROOM_CAPACITY) {
      throw ErrorMessage.ROOM_PLAYERS_FULL;
    }
    room.players.push(user);
    return room;
  }

  leaveRoom(roomId: number, userId: number) {
    const room = this.rooms.find(r => r.roomId === roomId);
    if (room) {
      this.deleteSingleIf(room.players, (u: User) => u.userId === userId);
      if (room.players.length === 0) {
        this.closeRoom(roomId);
      }
    }
  }

  getRoomPlayers(roomId: number): User[] {
    const room = this.rooms.find(r => r.roomId === roomId);
    if (room) {
      return room.players;
    }
    return [];
  }

  /**
   * 
   * @param user userId可能不存在
   */
  login(user: Partial<User>) {
    if (!user.userId) {
      user.userId = this.generateUserId();
    }
    this.onlineUsers.push(user as User);
    return user as User;
  }

  logout(userId: number, roomId: number = 0) {
    if (roomId) {
      this.leaveRoom(roomId, userId);
    }
    this.deleteSingleIf(this.onlineUsers, (u: User) => u.userId === userId);
  }

  private deleteSingleIf(list: any[], condition: (a: any) => boolean) {
    const index = list.findIndex(condition);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  private generateUserId() {
    return data.nextUserId++;
  }

  private generateRoomId() {
    let candidate = Math.round(Math.random() * 100000);
    while (this.rooms.find(r => r.roomId === candidate)) {
      candidate = Math.round(Math.random() * 100000);
    }
    if (candidate === 0) {
      candidate++;
    }
    return candidate;
  }

}

export const app = new App();