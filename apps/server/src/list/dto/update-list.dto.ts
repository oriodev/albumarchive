import mongoose from "mongoose";
import { Type } from "../schemas/list.schema";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateListDto {

    @IsOptional()
    @IsString()
    readonly name: string

    @IsOptional()
    @IsString()
    readonly description: string

    @IsOptional()
    @IsEnum(Type)
    readonly type: Type

    @IsOptional()
    readonly albums: [mongoose.Schema.Types.ObjectId]
}