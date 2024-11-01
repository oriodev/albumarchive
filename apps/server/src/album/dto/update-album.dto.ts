import { IsDateString, IsNumber, IsOptional, IsString, Max, Min } from "class-validator"
import { ObjectId, Types } from "mongoose"

export class UpdateAlbumDto {
    @IsOptional()
    @IsString()
    readonly title: string

    @IsOptional()
    @IsString()
    readonly artist: string 

    @IsOptional()
    @IsString()
    readonly genre: string

    @IsOptional()
    @IsDateString()
    readonly release_date: Date

    @IsOptional()
    @IsString()
    readonly cover_image_url: string

    @IsOptional()
    readonly reviews: Types.ObjectId[]

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    readonly overall_rating: number   
}
