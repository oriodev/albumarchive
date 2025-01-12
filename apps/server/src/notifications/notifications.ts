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

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id)
            console.log('connected')
        })
    }
 
    @SubscribeMessage('newNotification')
    onNewNotification(@MessageBody() body: any) {
        console.log('body: ', body)
        this.server.emit('onNotification', {
            msg: 'new notification', 
            content: body
        })
    }
}