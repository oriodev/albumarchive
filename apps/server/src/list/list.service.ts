import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { List } from './schemas/list.schema';
import mongoose from 'mongoose';
import { AlbumService } from '../album/album.service';

@Injectable()
export class ListService {
    constructor(
        @InjectModel(List.name)
        private listModel: mongoose.Model<List>,
        private albumService: AlbumService 
    ) {}

    async create (list: List): Promise<List> {
        const data = Object.assign(list)
        const res = await this.listModel.create(data)

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

    async addAlbum (id: string, album_id: string): Promise<List> {
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
