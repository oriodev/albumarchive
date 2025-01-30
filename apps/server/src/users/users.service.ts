import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import { List } from 'src/list/schemas/list.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        @InjectModel('List')
        private listModel: Model<List>
      ) {}  
      
      async findAll(query: Query): Promise<{ users: User[]; total: number }> {
        const resPerPage = 10
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)
      
        const search = query.search ? {
            $or: [
                { username: {
                  $regex: query.search,
                  $options: 'i'
                }},
             ]
              } : {}
      
        const total = await this.userModel.countDocuments({ ...search }).exec();

        const users = await this.userModel
                      .find({ ...search })
                      .limit(resPerPage)
                      .skip(skip);
      
        return { users, total };
      }

      async findById(id: string): Promise<User> {
        const isValidId = mongoose.isValidObjectId(id);
    
        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id');
        }
    
        const user = await this.userModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'lists',
                    localField: 'lists',
                    foreignField: '_id',
                    as: 'lists'
                }
            },
            {
                $unwind: {
                    path: '$lists',
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: 'lists._id',
                    foreignField: 'list',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    'lists.totalLikes': { $size: '$likes' }
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'reviews',
                    foreignField: '_id',
                    as: 'reviews'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    email: { $first: '$email' },
                    description: { $first: '$description' },
                    password: { $first: '$password' },
                    private: { $first: '$private' },
                    lists: { $push: '$lists' },
                    followers: { $first: '$followers' },
                    following: { $first: '$following' },
                    reviews: { $first: '$reviews'}
                }
            }
        ]);
    
        if (!user || user.length === 0) {
            throw new NotFoundException('user not found');
        }
    
        return user[0];
    }
    
    

    async findByUsername(username: string): Promise<User> {

        const user = await this.userModel.aggregate([
            { $match: { username } },
            {
                $lookup: {
                    from: 'lists',
                    localField: 'lists',
                    foreignField: '_id',
                    as: 'lists'
                }
            },
            {
                $unwind: {
                    path: '$lists',
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: 'lists._id',
                    foreignField: 'list',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    'lists.totalLikes': { $size: '$likes' }
                }
            },
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'reviews',
                    foreignField: '_id',
                    as: 'reviews'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    username: { $first: '$username' },
                    email: { $first: '$email' },
                    description: { $first: '$description' },
                    password: { $first: '$password' },
                    private: { $first: '$private' },
                    lists: { $push: '$lists' },
                    followers: { $first: '$followers' },
                    following: { $first: '$following' },
                    reviews: { $first: '$reviews'}
                }
            }
        ]);

        if (!user) {
            throw new NotFoundException('user not found')
        }

        return user[0];

    }

    /**
     * Fetch a list of users by their IDs.
     * @param ids a list of ids we want to fetch.
     */
    async findByIdsBatch(ids: string[]): Promise<User[]> {
        // Validate the IDs
        const invalidIds = ids.filter(id => !mongoose.isValidObjectId(id));
        if (invalidIds.length > 0) {
            throw new BadRequestException('please enter valid mongo ids');
        }

        // Fetch users by IDs
        const users = await this.userModel.find({ _id: { $in: ids } }).populate('lists');

        // Check if any users were found
        if (users.length === 0) {
            throw new NotFoundException('no users found for the provided ids');
        }

        return users;
    }

    async deleteById(id: string): Promise<User> {
        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        await this.listModel.deleteMany({ user: id })

        return await this.userModel.findByIdAndDelete(id)
    }

    async editById(user: Partial<User>, id: string): Promise<User> {
        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        await this.userModel.updateOne(
            { _id: id },
            { $set: user }
        )

        const updatedUser = await this.userModel.findById(id)

        return updatedUser
    }

    async followUser(currentUserId: string, userId: string) {
        await this.userModel.updateOne(
          { _id: currentUserId },
          { $addToSet: { following: userId } }
        );
        await this.userModel.updateOne(
          { _id: userId },
          { $addToSet: { followers: currentUserId } }
        );
        return { message: 'followed' };
      }
    
    async unfollowUser(currentUserId: string, userId: string) {
    await this.userModel.updateOne(
        { _id: currentUserId },
        { $pull: { following: userId } }
    );
    await this.userModel.updateOne(
        { _id: userId },
        { $pull: { followers: currentUserId } }
    );
    return { message: 'unfollowed' };
    }

}
