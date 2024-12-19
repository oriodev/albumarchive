import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId, SchemaTypes, Types } from "mongoose";
import { User } from "src/auth/schemas/user.schema";

export enum Type {
    LISTENED = 'Listened',
    TOLISTEN = 'To Listen',
    CUSTOM = 'Custom'
}

@Schema({
    timestamps: true
})
export class List {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    slug: string;

    @Prop()
    type: Type;
    
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop()
    albums: [mongoose.Schema.Types.ObjectId];
}

export const ListSchema = SchemaFactory.createForClass(List)