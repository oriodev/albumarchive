import mongoose, { Types } from "mongoose";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { Type } from "../schemas/list.schema";

export class UpdateListDto {

    @IsOptional()
    @IsString()
    readonly name: string

    @IsOptional()
    @IsString()
    readonly slug: string

    @IsOptional()
    @IsString()
    readonly description: string

    @IsOptional()
    @IsEnum(Type)
    readonly type: Type

    @IsOptional()
    readonly user: Types.ObjectId

    @IsOptional()
    readonly albums: [mongoose.Schema.Types.ObjectId]
}