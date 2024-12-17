import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { ObjectId } from "mongoose";

@Schema({
    timestamps: true
})
export class Album {

    @Prop()
    title: string;

    @Prop()
    artist: string;

    @Prop()
    genre: string;

    @Prop()
    release_date: Date;

    @Prop()
    coverImage: string;

    @Prop()
    overall_rating: number;

    @Prop()
    reviews: [mongoose.Schema.Types.ObjectId];

}

export const AlbumSchema = SchemaFactory.createForClass(Album)