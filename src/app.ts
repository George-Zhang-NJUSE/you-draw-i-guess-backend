import { User, Room } from './model';

class App {

  onlineUsers: User[] = [];
  rooms: Room[] = [];

  private nextUserId = 1;

  openNewRoom(roomName: string) {
    this.rooms.push({
      roomId: this.generateRoomId(),
      roomName,
      players: []
    });
  }

  closeRoom(roomId: number) {
    this.deleteSingleIf(this.rooms, (r: Room) => r.roomId === roomId);
  }

  joinRoom(roomId: number, user: User) {
    const room = this.rooms.find(r => r.roomId === roomId);
    if (room) {
      room.players.push(user);
    }
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

  logout(userId: number) {
    this.deleteSingleIf(this.onlineUsers, (u: User) => u.userId === userId);
  }

  private deleteSingleIf(list: any[], condition: (a: any) => boolean) {
    const index = list.findIndex(condition);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  private generateUserId() {
    return this.nextUserId++;
  }

  private generateRoomId() {
    let candidate = Math.round(Math.random() * 100000);
    while (this.rooms.find(r => r.roomId === candidate)) {
      candidate = Math.round(Math.random() * 100000);
    }
    return candidate;
  }

}

export const app = new App();