import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/messages.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Message.name)
        private messageModel: Model<Message>,
    ) {}

    // get all messages from a room.
    async getByRoom(room: string): Promise<Message[]> {
        return this.messageModel.find({ room }).populate("sender album list").sort({ createdAt: 1 }).exec();
    }

    // save message to a room.
    async saveMessage(message: Message): Promise<Message> {
        const data = Object.assign(message)
        const res = await this.messageModel.create(data);
        
        return res;
    }

    // delete message.
    async deleteMessage(room: string, timestamp: string, userId: string): Promise<{ deletedCount: number }> {
        console.log('timestamp: ', timestamp, 'room: ', room)
        
        const result = await this.messageModel.deleteOne({
            timestamp: timestamp,
            sender: userId,
            room: room
        });

        console.log('result: ', result)

        if (result.deletedCount === 0) {
            throw new BadRequestException('No message found with the specified criteria.');
        }

        return result;
    }
}
