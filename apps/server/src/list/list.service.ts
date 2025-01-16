import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { List } from './schemas/list.schema';
import mongoose, { ObjectId } from 'mongoose';
import { AlbumService } from '../album/album.service';
import { User } from 'src/auth/schemas/user.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class ListService {
    constructor(
        @InjectModel(List.name)
        private listModel: mongoose.Model<List>,
        @InjectModel('User')
        private userModel: mongoose.Model<User>,
        private albumService: AlbumService
    ) {}

    async findAll(query: Query): Promise<{ lists: List[]; total: number }> {
        const resPerPage = 3;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
    
        const search = query.search ? {
            $or: [
                { name: { $regex: query.search, $options: 'i' } }
            ]
        } : {};
    
        const exclusion = {
            name: { $nin: ['Listened', 'To Listen'] }
        };
    
        const total = await this.listModel.countDocuments({ ...search, ...exclusion }).exec();
    
        const lists = await this.listModel.aggregate([
            { $match: { ...search, ...exclusion } },
            {
                $lookup: {
                    from: 'likes', // The name of the likes collection
                    localField: '_id',
                    foreignField: 'list',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    totalLikes: { $size: '$likes' } // Count the number of likes for each list
                }
            },
            {
                $project: {
                    likes: 0 // Exclude the likes array from the final output
                }
            },
            {
                $skip: skip // Skip the documents for pagination
            },
            {
                $limit: resPerPage // Limit the number of documents returned
            }
        ]);
    
        return { lists, total };
    }
    
    async findById(id: string): Promise<List> {

        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const list = await this.listModel.findById(id);

        if (!list) {
            throw new NotFoundException('list not found')
        }

        return list;
    }

    async findBySlug(user: string, slug: string): Promise<List> {

        const isValidId = mongoose.isValidObjectId(user)
        
        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const list = await this.listModel.findOne({
            user: user,
            slug: slug 
        })

        return list

    }

    async create (list: List): Promise<List> {
        const data = Object.assign(list)
        const res = await this.listModel.create(data)

        await this.userModel.findByIdAndUpdate(list.user, {
            $push: { lists: res._id },
        })

        return res
    }

    async deleteById (id: string): Promise<List> {
        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId) {
            throw new BadRequestException('please enter a valid mongodb id')
        }

        return await this.listModel.findByIdAndDelete(id)
    }

    async updateById (id: string, update: List): Promise<List> {
        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId) {
            throw new BadRequestException('please enter a valid mongodb id')
        }

        return await this.listModel.findByIdAndUpdate(id, update,  {
            new: true,
            runValidators: true
        })
    }

    /**
     * checks if an album id is in a list.
     *
     * @param list_id - The list id you are searching.
     * @param album_id - The album id you are searching for.
     * @returns Boolean.
     * @throws Error if the list_id or album_id are invalid ids.
    */
    async isAlbumInList(list_id: string, album_id: string) {

        if (!mongoose.isValidObjectId(list_id) || !mongoose.isValidObjectId(album_id)) {
            throw new Error('invalid list_id or album_id');
        }

        const list = await this.listModel.findById(list_id, 'albums')

        if (!list) {
            throw new Error('List not found');
        }

        const albumIds = list.albums.map((id) => id.toString());

        return albumIds.includes(album_id);
    }

    async addAlbum (id: string, album_id: string): Promise<List> {

        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId) {
            throw new BadRequestException('please enter a valid mongodb id for the list')
        }

        const albumIsValid = await this.albumService.findById(album_id)
        
        if (!albumIsValid) {
            throw new BadRequestException('that album does not exist in our db')
        }

        // check if album id already exists
        const isAlbumInList = await this.isAlbumInList(id, album_id)


        if (isAlbumInList) {
            throw new BadRequestException('album is already in list')
        }

        return await this.listModel.findByIdAndUpdate(
            id,
            { $push: { albums: album_id } },
            { new: true }
        )
    }

    async removeAlbum (id: string, album_id: string): Promise<List> {
        const albumIsValid = await this.albumService.findById(album_id)
        
        if (!albumIsValid) {
            throw new BadRequestException('that album does not exist in our db')
        }

        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId) {
            throw new BadRequestException('please enter a valid mongodb id for the list')
        }

        return await this.listModel.findByIdAndUpdate(
            id,
            { $pull: { albums: album_id } },
            { new: true }
        )
    }
}
