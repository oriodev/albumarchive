import { Test, TestingModule } from "@nestjs/testing"
import { AlbumService } from "./album.service"
import { getModelToken } from "@nestjs/mongoose"
import { Album } from "./schemas/album.schema"
import mongoose, { Model } from "mongoose"
import { BadRequestException, NotFoundException } from "@nestjs/common"


describe('AlbumService', () => {

    let albumService: AlbumService;
    let model: Model<Album>;
    const mockAlbumService = {
        findById: jest.fn(),
        find: jest.fn(),
        create: jest.fn(),
        findByIdAndUpdate: jest.fn(),
        findByIdAndDelete: jest.fn()
    }

    const mockAlbum = {
        _id: "671cf2598f4e61ab24d095b3",
        title: "Blue Neighbourhood",
        artist: "Troye Sivan Mellet",
        genre: "Pop",
        release_date: "2015-12-04T00:00:00.000Z",
        coverImage: "https://link-to-cover-image.com/blue_neighbourhood.jpg",
        overall_rating: 4.5,
        reviews: [],
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AlbumService,
                {
                    provide: getModelToken(Album.name),
                    useValue: mockAlbumService
                }
            ]
        }).compile()

        albumService = module.get<AlbumService>(AlbumService);
        model = module.get<Model<Album>>(getModelToken(Album.name)); 
    })

    describe('findAll', () => {
        it('should return an array of albums', async () => {
            const query = {
                page: "1",
                search: "bloom"
            }

            jest.spyOn(model, 'find').mockImplementation(
                () => (
                    {
                        limit: () => ({
                            skip: jest.fn().mockResolvedValue([mockAlbum])
                        })
                    } as any
                )
            );

            const result = await albumService.findAll(query)
            expect(model.find).toHaveBeenCalledWith({
                $or: [
                    { title: {
                        $regex: 'bloom',
                        $options: 'i'
                    }},
                    {artist: {
                        $regex: 'bloom',
                        $options: 'i'
                    }}
                ]
            })
            expect(result).toEqual([mockAlbum])
        })
    })

    describe('findById', () => {
        it('should find and return an album by ID', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockAlbum)

            const result = await albumService.findById(mockAlbum._id);
            
            expect(model.findById).toHaveBeenCalledWith(mockAlbum._id) 
            expect(result).toEqual(mockAlbum)
        })

        it('should throw BadRequestException if invalid id is provided', async () => {
            const id = 'invalid-id'

            const isValidObjectionIdMock = jest
            .spyOn(mongoose, 'isValidObjectId')
            .mockReturnValue(false)

            await expect(albumService.findById(id)).rejects.toThrow(BadRequestException)
            expect(isValidObjectionIdMock).toHaveBeenCalledWith(id)
            isValidObjectionIdMock.mockRestore()
        })

        it('should throw NotFoundException if album is not found', async () => {
            const id = '671cf9598f4e61ab24d095b5'

            const isValidObjectionIdMock = jest
                .spyOn(mongoose, 'isValidObjectId')
                .mockReturnValue(true)

            jest.spyOn(model, 'findById').mockResolvedValue(null)
            await expect(albumService.findById(id)).rejects.toThrow(NotFoundException)
        })
    })

    describe('create', () => {
        it('should create and return an album', async () => {
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockAlbum as any))
            
            const newAlbum = {
                title: "Blue Neighbourhood",
                artist: "Troye Sivan Mellet",
                genre: "Pop",
                release_date: "2015-12-04T00:00:00.000Z",
                coverImage: "https://link-to-cover-image.com/blue_neighbourhood.jpg",
                overall_rating: 4.5,
                reviews: [],
            }
            
            const result = await albumService.create(newAlbum as any)

            expect(result).toEqual(mockAlbum)
        })
    })

    describe('updateById', () => {
        it('should update and return an album', async () => {
            
            const updatedAlbum = {
                ...mockAlbum,
                title: 'updated name'
            }

            const album = {
                title: 'updated name'
            }

            jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedAlbum);
            
            const result = await albumService.updateById(mockAlbum._id, album as any);

            expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockAlbum._id, album as any, {
                new: true,
                runValidators: true
            })
            expect(result.title).toEqual(album.title)
        })
    })

    describe('deleteById', () => {
        it('should delete and return an album', async () => {

            jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockAlbum);
            
            const result = await albumService.deleteById(mockAlbum._id);

            expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockAlbum._id)
            expect(result).toEqual(mockAlbum)
        })
    })
})