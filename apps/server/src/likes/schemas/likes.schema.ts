import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { SchemaTypes, Types } from "mongoose";


@Schema({
    timestamps: true
})
export class Likes {    
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'List' })
    list: mongoose.Schema.Types.ObjectId;
}

export const LikesSchema = SchemaFactory.createForClass(Likes)
LikesSchema.index({ user: 1, list: 1 }, { unique: true});