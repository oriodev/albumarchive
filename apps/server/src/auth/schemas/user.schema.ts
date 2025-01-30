import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps: true
})

export class User {
    @Prop({ unique: [true, 'duplicate username entered']})
    username: string

    @Prop({ unique: [true, 'duplicate email entered']})
    email: string

    @Prop({ required: false })
    description: string

    @Prop() 
    password: string

    @Prop()
    private: boolean

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }] })
    lists: mongoose.Schema.Types.ObjectId[];   

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    followers: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    following: mongoose.Schema.Types.ObjectId[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reviews' }] })
    reviews: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User)
