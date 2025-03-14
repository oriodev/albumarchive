import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reviews } from './schemas/reviews.schema';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';


@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Reviews.name)
        private reviewsModel: mongoose.Model<Reviews>,
        @InjectModel('User')
        private userModel: mongoose.Model<User>,
    ) {}

    /**
     * grab a review by user and album.
     * @param userId 
     * @param albumId 
     * @returns 
     */
    async getReview(userId: string, albumId: string): Promise<Reviews> {

        const isValidId = mongoose.isValidObjectId(userId) && mongoose.isValidObjectId(albumId)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const review = await this.reviewsModel.findOne({
            user: userId,
            album: albumId
        }).populate('user')

        if (!review) {
            throw new NotFoundException('review not found')
        }

        return review;
    }

    /**
     * get all reviews for an album
     * @param query 
     * @returns 
     */
    async getAllAlbumReviews(query: Query, excludeUserId: string): Promise<{ reviews: Reviews[]; total: number; }> {

        const resPerPage = 10
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const total = await this.reviewsModel.countDocuments(
            { album: query.albumId, ...(excludeUserId ? { user: { $ne: excludeUserId } } : {}) }
            ).exec();
    
        const reviews = await this.reviewsModel
            .find({ album: query.albumId, ...(excludeUserId ? { user: { $ne: excludeUserId } } : {}) })
            .limit(resPerPage)
            .skip(skip)
            .populate('user')

    
        return { reviews, total };
    }

    /**
     * get all reviews by a user
     * @param query 
     * @returns 
     */
    async getAllByUser(query: Query): Promise<{ reviews: Reviews[]; total: number }> {

        const resPerPage = 25
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const total = await this.reviewsModel.countDocuments({ user: query.userId }).exec();
    
        const reviews = await this.reviewsModel
            .find({ user: query.userId })
            .limit(resPerPage)
            .skip(skip)
            .populate('user')
    
        return { reviews, total };
    }

    /**
     * create a new review.
     * @param review { user, album, vibes, text }
     * @returns like object.
     */
    async create(review: Reviews): Promise<Reviews> {
        const data = Object.assign(review)
        const res = await this.reviewsModel.create(data)

        await this.userModel.findByIdAndUpdate(review.user, {
            $push: { reviews: res._id },
        })

        return res
    }

    /**
     * edit the review.
     * @param review
     * @param id 
     * @returns 
     */
    async editById(review: Partial<Reviews>, id: string): Promise<Reviews> {
        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        await this.reviewsModel.updateOne(
            { _id: id },
            { $set: review }
        )

        const updatedUser = await this.reviewsModel.findById(id)

        return updatedUser
    }

    /**
     * delete review
     * @param id 
     * @returns 
     */
    async deleteReview (id: string): Promise<Reviews> {
        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongodb id')
        }

        return await this.reviewsModel.findByIdAndDelete(id)
    }

    /**
     * get overall album rating
     * @param albumId 
     * @returns 
     */
    async getAlbumRating(albumId: string): Promise<number> {
        const isValidId = mongoose.isValidObjectId(albumId);

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongodb ID');
        }

        const ratings = await this.reviewsModel.aggregate([
            { $match: { album: new mongoose.Types.ObjectId(albumId) } },
            { $group: { _id: null, averageRating: { $avg: '$rating' } } },
        ]);

        if (ratings.length === 0) {
            return 0
        }

        return ratings[0].averageRating;
    }


    /**
     * returns a count of how many ratings there are for each star plus the total.
     * @param albumId 
     * @returns 
     */
    async getRatingsCount(albumId: string): Promise<{}> {
        const isValidId = mongoose.isValidObjectId(albumId);

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongodb ID');
        }

        const totalRatings = await this.reviewsModel.aggregate([
            { $match: { album: new mongoose.Types.ObjectId(albumId) } },
            {
                $group: {
                    _id: "$rating",
                    count: { $count: {} }
                }
            }
        ]);

        const ratings = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            total: 0
        };
        
        totalRatings.forEach(rating => {
            ratings[rating._id] = rating.count;
        });
        
        ratings.total = totalRatings.reduce((sum, rating) => sum + rating.count, 0);
        
        return ratings;
    }
}

