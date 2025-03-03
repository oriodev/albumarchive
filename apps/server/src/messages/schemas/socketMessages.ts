import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Album } from "src/albums/schemas/album.schema";
import { List } from "src/lists/schemas/list.schema";

enum MessageType {
    MESSAGE = "message",
    ALBUM = "album",
    LIST = "list",
  }

@Schema({
    timestamps: true
})
export class socketMessage {
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

    @Prop({ required: false })
    album: Album

    @Prop({ required: false })
    list: List

    @Prop()
    likes: number;

}

export const SocketMessageSchema = SchemaFactory.createForClass(socketMessage)
