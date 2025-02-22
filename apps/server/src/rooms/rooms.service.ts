import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rooms } from './rooms';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class RoomsService {
    constructor(
        @InjectModel(Rooms.name)
        private roomsModel: Model<Rooms>,
        ) {}  
        
        async getRooms(): Promise<Rooms[]> {
            return this.roomsModel.find().populate("users").exec();
        }

        async getRoom(slug: string): Promise<Rooms> {
            return this.roomsModel.findOne({ slug }).populate("users").exec();
        }

        async createRoom(room: Rooms): Promise<Rooms> {
            const data = Object.assign(room)
            const res = await this.roomsModel.create(data);
            
            return res;
        }

        async addUserToRoom(userId: string, roomId: string): Promise<Rooms> {

            if (!(await this.roomsModel.findById(roomId))) {
                throw new BadRequestException('that room does not exist in our db')
            }
    
            if(!(mongoose.isValidObjectId(userId))) {
                throw new BadRequestException('please enter a valid mongodb id for the user')
            }

            return this.roomsModel.findByIdAndUpdate(
                roomId,
                { $push: { users: userId } },
                { new: true }
            );
        }

        async removeUserFromRoom(userId: string, roomId: string): Promise<Rooms> {
            return this.roomsModel.findByIdAndUpdate(
                roomId,
                { $pull: { users: userId } },
                { new: true }
            );
        }
}