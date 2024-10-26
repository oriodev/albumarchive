import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './schemas/album.schema';
import { isValidMongoId } from './utils/albumService.utils';

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

        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {}

        const albums = await this.albumModel
                .find({ ...keyword })
                .limit(resPerPage)
                .skip(skip);

        return albums;
    }

    async create(album: Album): Promise<Album> {
        const res = await this.albumModel.create(album);
        return res;
    }

    async findById(id: string): Promise<Album> {

        if (!isValidMongoId(id)) {
            throw new HttpException('id is not a mongoDb id', 400)
        }

        const album = await this.albumModel.findById(id);

        if (!album) {
            throw new NotFoundException('album not found')
        }

        return album;
    }

    async updateById(id: string, album: Album): Promise<Album> {
        if (!isValidMongoId(id)) {
            throw new HttpException('id is not a mongoDb id', 400)
        }

        return await this.albumModel.findByIdAndUpdate(id, album, {
            new: true,
            runValidators: true
        });
    }

    async deleteById(id: string): Promise<Album> {
        if (!isValidMongoId(id)) {
            throw new HttpException('id is not a mongoDb id', 400)
        }

        return await this.albumModel.findByIdAndDelete(id)
    }
}
