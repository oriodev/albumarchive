import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reviews } from './schemas/reviews.schema';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';
import { Ratings } from 'src/ratings/schemas/ratings.schema';


@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Reviews.name)
        private reviewsModel: mongoose.Model<Reviews>,
        @InjectModel('User')
        private userModel: mongoose.Model<User>,
        @InjectModel('Ratings')
        private ratingsModel: mongoose.Model<Ratings>
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
        }).populate('rating')

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
    async findAll(query: Query): Promise<{ reviews: Reviews[]; total: number }> {

        const resPerPage = 10
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const total = await this.reviewsModel.countDocuments({ album: query.albumId }).exec();
    
        const reviews = await this.reviewsModel
            .find({ album: query.albumId })
            .limit(resPerPage)
            .skip(skip)
            .populate('user', 'rating')
    
        return { reviews, total };
    }

        /**
     * get all reviews for an album
     * @param query 
     * @returns 
     */
    async findAllByUser(query: Query): Promise<{ reviews: Reviews[]; total: number }> {

        const resPerPage = 25
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const total = await this.reviewsModel.countDocuments({ user: query.userId }).exec();
    
        const reviews = await this.reviewsModel
            .find({ user: query.userId })
            .limit(resPerPage)
            .skip(skip)
            .populate('user', 'rating')
    
        return { reviews, total };
    }

    /**
     * get all reviews for an album by rating
     * @param query 
     * @returns 
     */
    async findAllByRating(query: Query): Promise<{ reviews: Reviews[]; total: number }> {

        const resPerPage = 10
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const total = await this.reviewsModel.countDocuments({ user: query.userId }).exec();
    
        const reviews = await this.reviewsModel
            .find({ user: query.userId })
            .limit(resPerPage)
            .skip(skip)
            .populate('user', 'rating')
    
        return { reviews, total };
    }

    /**
     * create a new review.
     * @param review { user, album, vibes, text }
     * @returns like object.
     */
    async create (review: Reviews): Promise<Reviews> {
        const data = Object.assign(review)
        const res = await this.reviewsModel.create(data)

        await this.userModel.findByIdAndUpdate(review.user, {
            $push: { reviews: res._id },
        })

        const rating = await this.ratingsModel.findOne({ user: res.user, album: res.album })

        await this.reviewsModel.findByIdAndUpdate(res.id, {
            rating: rating.id
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
}
