import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

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
    cover_image_url: string;

    @Prop()
    overall_rating: number;

    @Prop()
    reviews: [ObjectId];

}

export const AlbumSchema = SchemaFactory.createForClass(Album)