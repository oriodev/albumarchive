import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

enum GenreNames {
    POP = "Pop",
    ROCK = "Rock",
    PUNK = "Punk",
    COUNTRY = "Country",
    JAZZ = "Jazz",
    LOFI = "Lofi",
    RAP = "Rap",
}

@Schema({
    timestamps: true
})

export class User {
    @Prop({ unique: [true, 'duplicate username entered'] })
    username: string;

    @Prop({ unique: [true, 'duplicate email entered'] })
    email: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false })
    profileImg: string;

    @Prop()
    password: string;

    @Prop()
    private: boolean;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }] })
    lists: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    followers: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    following: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reviews' }] })
    reviews: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: [String], enum: GenreNames, required: false, default: [], validate: {
        validator: function (value: GenreNames[]) {
            return value.length <= 5;
        },
        message: 'You can only add up to 5 genres.'
    } }) 
    genres: GenreNames[]; 
}

export const UserSchema = SchemaFactory.createForClass(User);
