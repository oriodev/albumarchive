import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { SchemaTypes, Types } from "mongoose";

@Schema({
    timestamps: true
})
export class Ratings {    
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Album' })
    album: mongoose.Schema.Types.ObjectId;

    @Prop({ min: 1, max: 5})
    rating: number;
}

export const RatingsSchema = SchemaFactory.createForClass(Ratings)
RatingsSchema.index({ user: 1, album: 1 }, { unique: true});

