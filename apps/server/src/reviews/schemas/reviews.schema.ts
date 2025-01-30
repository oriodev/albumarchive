import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { SchemaTypes, Types } from "mongoose";


@Schema({
    timestamps: true
})
export class Reviews {    
    @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Album' })
    album: mongoose.Schema.Types.ObjectId;

    @Prop({ maxlength: 3 })
    vibes: string[]

    @Prop({ min: 1, max: 5000 })
    reviewText: string

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Ratings' })
    rating: mongoose.Schema.Types.ObjectId;
}

export const ReviewsSchema = SchemaFactory.createForClass(Reviews)
ReviewsSchema.index({ user: 1, album: 1 }, { unique: true});
