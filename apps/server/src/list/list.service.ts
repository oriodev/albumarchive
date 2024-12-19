import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { List } from './schemas/list.schema';
import mongoose, { ObjectId, Types } from 'mongoose';
import { AlbumService } from '../album/album.service';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class ListService {
    constructor(
        @InjectModel(List.name)
        private listModel: mongoose.Model<List>,
        @InjectModel('User')
        private userModel: mongoose.Model<User>,
        private albumService: AlbumService
    ) {}

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
            slug: { $regex: new RegExp(slug, 'i') }
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
        // check if list_id is valid id.
        // check if album_id is valid id.
        // fetch the list by id and return only the albums for efficiency.
        const list = await this.listModel.findById(list_id, 'albums')

        const album = new mongoose.Schema.Types.ObjectId(album_id)

        return list.albums.includes(album)
    }

    // async addAlbum (id: string, album_id: ObjectId): Promise<List> {
    //     const isValidId = mongoose.isValidObjectId(id)

    //     if(!isValidId) {
    //         throw new BadRequestException('please enter a valid mongodb id for the list')
    //     }

    //     const albumIsValid = await this.albumService.findById(album_id)
        
    //     if (!albumIsValid) {
    //         throw new BadRequestException('that album does not exist in our db')
    //     }

    //     // check if album id already exists


    //     return await this.listModel.findByIdAndUpdate(
    //         id,
    //         { $push: { albums: album_id } },
    //         { new: true }
    //     )
    // }

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
