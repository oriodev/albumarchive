import { Module } from "@nestjs/common";
import { AppNotifications } from "./notifications";
import { NotificationController } from "./notifications.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationSchema } from "./schemas/notifications.schema";
import { NotificationsService } from "./notifications.service";

@Module({
    providers: [AppNotifications, NotificationsService],
    controllers: [NotificationController],
      imports: [
        MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema}]),
      ]
})
export class NotificationsModule {}