import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
         origin: ['http://localhost:3000']
    }
})
export class AppNotifications implements OnModuleInit {

    @WebSocketServer()
    server: Server
    private users: Map<string, string> = new Map();

    onHandleConnection(client: any) {
        const userId = client.handshake.query.userId;
        this.users.set(userId, client.id);
        console.log('userId: ', userId)
    }

    handleDisconnect(client: any) {
        this.users.forEach((socketId, userId) => {
        if (socketId === client.id) {
            this.users.delete(userId);
        }
        });
    }

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id)
            console.log('connected')
        })
    }

    @SubscribeMessage('sendNotification')
    handleNotification(client: any, payload: { message: string; userId: string }) {
      const recipientSocketId = this.users.get(payload.userId);
      if (recipientSocketId) {
        // Send notification only to the specific user
        this.server.to(recipientSocketId).emit('notification', payload);
      }
    }
 
    @SubscribeMessage('sendNotification')
    onNewNotification(client: any, payload: { message: string; userId: string }) {
        const recipientSocketId = this.users.get(payload.userId);
        if (recipientSocketId) {
          this.server.to(recipientSocketId).emit('notification', payload);
        }
    }
}