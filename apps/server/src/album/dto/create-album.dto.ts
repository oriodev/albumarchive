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
    readonly genre: string[]

    @IsNotEmpty()
    @IsDateString()
    readonly releaseDate: string

    @IsNotEmpty()
    @IsString()
    readonly coverImage: string

    @IsNotEmpty()
    readonly reviews: [mongoose.Schema.Types.ObjectId]

    @IsNotEmpty()
    @IsNumber()
    readonly overallRating: number   
}
