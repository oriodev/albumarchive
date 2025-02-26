import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Ratings } from './schemas/ratings.schema';
import mongoose, { mongo } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Reviews } from 'src/reviews/schemas/reviews.schema';

@Injectable()
export class RatingsService {
    constructor(
        @InjectModel(Ratings.name)
        private ratingsModel: mongoose.Model<Ratings>,
        @InjectModel('Reviews')
        private reviewsModel: mongoose.Model<Reviews>
    ) {}

    
    /**
     * grab a rating by user and album.
     * @param userId 
     * @param albumId 
     * @returns 
     */
    async getRating(userId: string, albumId: string): Promise<Ratings> {

        const isValidId = mongoose.isValidObjectId(userId) && mongoose.isValidObjectId(albumId)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const rating = await this.ratingsModel.findOne({
            user: userId,
            album: albumId
        })

        if (!rating) {
            throw new NotFoundException('rating not found')
        }

        return rating;
    }

    /**
     * create a new rating.
     * @param rating user, album, number rating.
     * @returns rating object.
     */
    async create (rating: Ratings): Promise<Ratings> {
        const data = Object.assign(rating)
        const res = await this.ratingsModel.create(data)

        await this.reviewsModel.findOneAndUpdate({ user: rating.user, album: rating.album}, {
            rating: res.id
        })

        return res
    }

    /**
     * update the number in the rating.
     * @param id rating id.
     * @param updatedRating number.
     * @returns updated rating.
     */
    async updateById (id: string, updatedRating: number): Promise<Ratings> {
        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId) {
            throw new BadRequestException('please enter a valid mongodb id')
        }

        const res = await this.ratingsModel.findByIdAndUpdate(id, {
            rating: updatedRating
        },
        { new: true,
          runValidators: true
         })

         if (!res.rating) {
             await this.reviewsModel.findOneAndUpdate({ user: res.user, album: res.album}, {
                rating: res.id
            })
         }

         return res
    }

    /**
     * delete rating
     * @param id 
     * @returns 
     */
    async deleteRating (id: string): Promise<Ratings> {
        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongodb id')
        }

        return await this.ratingsModel.findByIdAndDelete(id)
    }
}
