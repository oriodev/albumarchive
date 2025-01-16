import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Likes } from './schemas/likes.schema';
import mongoose, { mongo } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LikesService {
    constructor(
        @InjectModel(Likes.name)
        private likesModel: mongoose.Model<Likes>,
    ) {}

    
    /**
     * grab a like by user and list.
     * @param userId 
     * @param listId 
     * @returns 
     */
    async getLike(userId: string, listId: string): Promise<Likes> {

        const isValidId = mongoose.isValidObjectId(userId) && mongoose.isValidObjectId(listId)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const like = await this.likesModel.findOne({
            user: userId,
            list: listId
        })

        if (!like) {
            throw new NotFoundException('rating not found')
        }

        return like;
    }

    /**
     * create a new like.
     * @param like user, album, number rating.
     * @returns like object.
     */
    async create (like: Likes): Promise<Likes> {
        const data = Object.assign(like)
        const res = await this.likesModel.create(data)

        return res
    }

    /**
     * delete like
     * @param id like id
     * @returns 
     */
    async deleteLike (id: string): Promise<Likes> {
        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongodb id')
        }

        return await this.likesModel.findByIdAndDelete(id)
    }

    /**
     * get overall list likes
     * @param listId 
     * @returns 
     */
    async getListLikes(listId: string): Promise<number> {
        const isValidId = mongoose.isValidObjectId(listId);

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongodb ID');
        }

        const likes = await this.likesModel.countDocuments({ list: listId }).exec();
    
        return likes;
    }
}
