import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Message } from "src/messages/schemas/messages.schema";
import { socketMessage } from "src/messages/schemas/socketMessages";

@WebSocketGateway({
    cors: {
         origin: ['http://localhost:3000']
    }
})
export class Rooms implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    private userSockets: { [socketId: string]: string } = {};

    onModuleInit() {
        this.server.on('connection', (socket) => {
            // STORE THE USER'S SOCKET.
            socket.on('registerUser', (userId: string) => {
                this.userSockets[socket.id] = userId;
            });

            // REMOVE THE USER'S SOCKET.
            socket.on('disconnect', () => {
                delete this.userSockets[socket.id];
            });
        });
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
        const userId = this.userSockets[client.id]; 
        client.join(room);
        this.server.to(room).emit('joined', {
            userId,
        })
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string) {
        const userId = this.userSockets[client.id];
        client.leave(room);
        this.server.to(room).emit('left', {
            userId,
        });
    }

    @SubscribeMessage('sendMessage')
    onSendMessage(client: Socket, payload: socketMessage) {
        this.server.to(payload.room).emit('receiveMessage', payload)
    }
}
