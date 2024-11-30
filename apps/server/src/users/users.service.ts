import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
      ) {}  

      async findById(id: string): Promise<User> {

        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const user = await this.userModel.findById(id);

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

        return await this.userModel.findByIdAndDelete(id)
    }

}
