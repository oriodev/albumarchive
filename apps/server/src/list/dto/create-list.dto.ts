import mongoose from "mongoose";
import { Type } from "../schemas/list.schema";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateListDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly description: string

    @IsNotEmpty()
    @IsEnum(Type)
    readonly type: Type

    @IsOptional()
    readonly albums: [mongoose.Schema.Types.ObjectId]
}