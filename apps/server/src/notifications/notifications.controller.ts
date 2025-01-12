import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { Notification } from "./schemas/notifications.schema";

@Controller('notifications')
export class NotificationController {
    constructor(private notificationsService: NotificationsService) {}

    @Get(':userId')
    async getNotifications(@Param('userId') userId: string): Promise<Notification[]> {
      return this.notificationsService.findByUserId(userId); 
    }

    @Post()
    async createNotification(@Body() body: Notification): Promise<Notification> {
        return this.notificationsService.createNotification(body)
    }

    @Delete(':notificationId')
    async deleteNotification(@Param('notificationId') notificationId: string): Promise<Notification> {
        return this.notificationsService.deleteNotificationById(notificationId)
    }
}