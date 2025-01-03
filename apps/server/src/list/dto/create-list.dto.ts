import mongoose, { Types } from "mongoose";
import { Type } from "../schemas/list.schema";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateListDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly slug: string

    @IsString()
    readonly description: string

    @IsNotEmpty()
    @IsEnum(Type)
    readonly type: Type

    @IsNotEmpty()
    readonly user: Types.ObjectId

    @IsOptional()
    readonly albums: [mongoose.Schema.Types.ObjectId]
}