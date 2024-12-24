import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"
import mongoose, { ObjectId, Types } from "mongoose"

export class UpdateAlbumDto {
    @IsOptional()
    @IsString()
    readonly title: string

    @IsOptional()
    @IsString()
    readonly artist: string 

    @IsOptional()
    @IsString()
    readonly genre: string[]

    @IsOptional()
    @IsDateString()
    readonly releaseDate: string

    @IsOptional()
    @IsString()
    readonly coverImage: string

    @IsOptional()
    readonly reviews: [mongoose.Schema.Types.ObjectId]

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    readonly overallRating: number   
}
