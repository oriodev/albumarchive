import { ObjectId } from "mongoose"

export class UpdateAlbumDto {
    readonly title: string
    readonly artist: string 
    readonly genre: string
    readonly release_date: Date
    readonly cover_image_url: string
    readonly reviews: [ObjectId]
    readonly overall_rating: number   
}
