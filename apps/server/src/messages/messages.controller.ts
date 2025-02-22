import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './schemas/messages.schema';

@Controller('messages')
export class MessagesController {
    constructor(private messagesService: MessagesService) {}

    @Get(':room')
    async getMessagesByRoom(@Param('room') room: string): Promise<Message[]> {
        return this.messagesService.getByRoom(room); 
    }

    @Post()
    async saveMessage(@Body() body: Message): Promise<Message> {
        return this.messagesService.saveMessage(body)
    }

    @Delete(':room/:timestamp')
    async deleteMessage(@Request() req, @Param('room') room: string, @Param('timestamp') timestamp: string) {
        const userId = req.user.id;
        if (!userId) throw new BadRequestException('you must be the creator of a message to delete it.');
        
        return this.messagesService.deleteMessage(room, timestamp, userId);
    }
}
