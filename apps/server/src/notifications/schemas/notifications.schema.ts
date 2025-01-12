import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

enum NotificationType {
    FRIENDREQUEST = "friendRequest",
    ALBUMREC = "albumRec",
    LISTLIKE = "listlike",
  }

@Schema({
    timestamps: true
})
export class Notification {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    sender: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    receiver: Types.ObjectId;

    @Prop()
    type: NotificationType;

    @Prop({ required: false, type: SchemaTypes.ObjectId, ref: 'Album' })
    albumId: string

    @Prop({ required: false, type: SchemaTypes.ObjectId, ref: 'List' })
    listId: string
}

export const NotificationSchema = SchemaFactory.createForClass(Notification)
