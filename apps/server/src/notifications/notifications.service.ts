import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Notification } from "./schemas/notifications.schema";

@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<Notification>,
      ) {}  
      
      async findByUserId(userId: string): Promise<Notification[]> {
        const isValidId = mongoose.isValidObjectId(userId)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        return this.notificationModel.find({ receiver: userId }).populate("sender receiver albumId listId").sort({ createdAt: -1 }).exec();
      }

      async createNotification(notification: Notification): Promise<Notification> {
        const data = Object.assign(notification)
        const res = await this.notificationModel.create(data);
        
        return res;
      }

      async deleteNotificationById(id: string): Promise<Notification> {

        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const deletedNotification = await this.notificationModel.findByIdAndDelete(id);
        if (!deletedNotification) {
            throw new NotFoundException(`Notification with ID ${id} not found`);
        }
        return deletedNotification;
    }
    }