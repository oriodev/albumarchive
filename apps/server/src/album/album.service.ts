import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './schemas/album.schema';
import { Query } from 'express-serve-static-core';


@Injectable()
export class AlbumService {
    constructor(
        @InjectModel(Album.name)
        private albumModel: mongoose.Model<Album>
    ) {}


    async findAll(query: Query): Promise<Album[]> {

        const resPerPage = 2
        const currentPage = Number(query.page) || 1
        const skip = resPerPage * (currentPage - 1)

        const search = query.search ? {
            $or: [
                { title: {
                    $regex: query.search,
                    $options: 'i'
                }},
                {artist: {
                    $regex: query.search,
                    $options: 'i'
                }}
            ]
        } : {}

        const albums = await this.albumModel
                .find({ ...search })
                .limit(resPerPage)
                .skip(skip);

        return albums;
    }

    async create(album: Album): Promise<Album> {
        const data = Object.assign(album)
        const res = await this.albumModel.create(data);
        
        return res;
    }

    async findById(id: string): Promise<Album> {

        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        const album = await this.albumModel.findById(id);

        if (!album) {
            throw new NotFoundException('album not found')
        }

        return album;
    }

    async updateById(id: string, album: Album): Promise<Album> {
        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        return await this.albumModel.findByIdAndUpdate(id, album, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<Album> {
        const isValidId = mongoose.isValidObjectId(id)

        if (!isValidId) {
            throw new BadRequestException('please enter a valid mongo id')
        }

        return await this.albumModel.findByIdAndDelete(id)
    }
}
