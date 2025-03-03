import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Likes } from './schemas/likes.schema';
import mongoose, { mongo } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { List } from 'src/lists/schemas/list.schema';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class LikesService {
    constructor(
        @InjectModel(Likes.name)
        private likesModel: mongoose.Model<Likes>,
        @InjectModel('List')
        private listModel: mongoose.Model<List>,
        @InjectModel('User')
        private userModel: mongoose.Model<User>,
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

    /**
     * Get all lists a user has liked.
     * @param userId 
     * @returns 
     */
    async getUserLikedLists(userId: string): Promise<List[]> {
        const isValidId = mongoose.isValidObjectId(userId);

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id');
        }

        const likes = await this.likesModel.find({ user: userId }).exec();
        
        const listIds = likes.map((like) => like.list);
        const likedLists = await this.listModel.find({ _id: { $in: listIds } }).populate('user').exec();
        
        return likedLists;
    }

}

