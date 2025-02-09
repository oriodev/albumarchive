import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Notification } from "./schemas/notifications.schema";

@WebSocketGateway({
    cors: {
         origin: ['http://localhost:3000']
    }
})
export class AppNotifications implements OnModuleInit {
    @WebSocketServer()
    server: Server

    private userSockets: { [userId: string]: string } = {};

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log('connected: ', socket.id)

            // STORE THE USER'S SOCKET.
            socket.on('registerUser', (userId: string) => {
                this.userSockets[userId] = socket.id;
                console.log(`User registered: ${userId} with socket ID: ${socket.id}`);
            })

            // REMOVE THE USER'S SOCKET.
            socket.on('disconnect', () => {
                for (const userId in this.userSockets) {
                    if (this.userSockets[userId] === socket.id) {
                        delete this.userSockets[userId];
                        console.log(`User disconnected: ${userId}`);
                        break;
                    }
                }
            });

        })
    }
 
    @SubscribeMessage('newNotification')
    onNewNotification(@MessageBody() notification: Notification) {
        const receiver = notification.receiver._id.toString();
        const receiverSocket = this.userSockets[receiver];

        this.server.to(receiverSocket).emit('onNotification', notification)
}
}