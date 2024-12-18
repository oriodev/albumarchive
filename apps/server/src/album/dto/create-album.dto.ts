import { IsDateString, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator"
import mongoose, { ObjectId, Types } from "mongoose"

export class CreateAlbumDto {

    @IsNotEmpty()
    @IsString()
    readonly title: string

    @IsNotEmpty()
    @IsString()
    readonly artist: string 

    @IsNotEmpty()
    @IsString()
    readonly genre: string

    @IsNotEmpty()
    @IsDateString()
    readonly release_date: Date

    @IsNotEmpty()
    @IsString()
    readonly coverImage: string

    @IsNotEmpty()
    readonly reviews: [mongoose.Schema.Types.ObjectId]

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    readonly overall_rating: number   
}
