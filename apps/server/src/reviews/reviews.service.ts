import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reviews } from './schemas/reviews.schema';
import mongoose from 'mongoose';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Reviews.name)
        private reviewsModel: mongoose.Model<Reviews>,
    ) {}

    /**
     * create a new review.
     * @param review { user, album, vibes, text }
     * @returns like object.
     */
    async create (review: Reviews): Promise<Reviews> {
        const data = Object.assign(review)
        const res = await this.reviewsModel.create(data)

        return res
    }
}
