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
      
      async findAll(query: Query): Promise<User[]> {
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
      
        const users = await this.userModel
                      .find({ ...search })
                      .limit(resPerPage)
                      .skip(skip);
      
        return users;
      }

      async findById(id: string): Promise<User> {

        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const user = await this.userModel.findById(id).populate('lists');;

        if (!user) {
            throw new NotFoundException('user not found')
        }

        return user;
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
