import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})

export class User {
    @Prop({ unique: [true, 'duplicate username entered']})
    username: string

    @Prop({ unique: [true, 'duplicate email entered']})
    email: string

    @Prop() 
    password: string

    @Prop()
    private: boolean
    
}

export const UserSchema = SchemaFactory.createForClass(User)