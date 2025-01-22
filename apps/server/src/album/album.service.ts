import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './schemas/album.schema';
import { Query } from 'express-serve-static-core';
import { Ratings } from 'src/ratings/schemas/ratings.schema';
import { List } from 'src/list/schemas/list.schema';


@Injectable()
export class AlbumService {
    constructor(
        @InjectModel(Album.name)
        private albumModel: mongoose.Model<Album>

        // @InjectModel("Ratings")
        // private ratingsModel: mongoose.Model<Ratings>

        // @InjectModel("List")
        // private listModel: mongoose.Model<List>
    ) {}


    async findAll(query: Query): Promise<{ albums: Album[]; total: number }> {

        const resPerPage = 25
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

        const total = await this.albumModel.countDocuments({ ...search }).exec();
    
        const albums = await this.albumModel
            .find({ ...search })
            .limit(resPerPage)
            .skip(skip);
    
        return { albums, total };
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

    async findByName(title: string): Promise<Album> {

        const album = await this.albumModel.findOne({ title: title })

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

    async findByArtist(artistName: string): Promise<Album[]> {
        const albums = await this.albumModel.find({ artist: artistName })

        return albums
    }

    async findByGenre(genre: string): Promise<Album[]> {
        const albums = await this.albumModel.find({ genre }).limit(25).sort({ rating: -1 })

        return albums
    }
}

