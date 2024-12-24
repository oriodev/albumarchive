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

    @Prop({ type: [String] })
    genre: string[];

    @Prop()
    releaseDate: string;

    @Prop()
    coverImage: string;

    @Prop()
    overallRating: number;

    @Prop()
    reviews: [mongoose.Schema.Types.ObjectId];

}

export const AlbumSchema = SchemaFactory.createForClass(Album)
AlbumSchema.index({ artist: 1, title: 1 }, { unique: true });
