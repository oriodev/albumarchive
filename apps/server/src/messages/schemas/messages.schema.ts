import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

enum MessageType {
    MESSAGE = "message",
    ALBUM = "album",
    LIST = "list",
  }

@Schema({
    timestamps: true
})
export class Message {
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    sender: Types.ObjectId;

    @Prop()
    room: string;

    @Prop()
    type: MessageType;

    @Prop()
    content: string

    @Prop()
    timestamp: string

    @Prop({ required: false, type: SchemaTypes.ObjectId, ref: 'Album' })
    album: string

    @Prop({ required: false, type: SchemaTypes.ObjectId, ref: 'List' })
    list: string

    @Prop()
    likes: number;

}

export const MessageSchema = SchemaFactory.createForClass(Message)
