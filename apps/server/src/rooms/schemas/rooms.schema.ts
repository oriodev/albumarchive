import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
    timestamps: true
})
export class Rooms {
    @Prop()
    title: string;

    @Prop()
    slug: string

    @Prop()
    icon: string

    @Prop()
    description: string

    @Prop({ type: [SchemaTypes.ObjectId], ref: 'User' })
    users: Types.ObjectId[];

}

export const RoomsSchema = SchemaFactory.createForClass(Rooms)