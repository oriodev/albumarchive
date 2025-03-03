import { Test, TestingModule } from '@nestjs/testing';
import { ListService } from './lists.service';
import mongoose, { Model, Types } from 'mongoose';
import { List, Type } from './schemas/list.schema';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AlbumService } from '../albums/album.service';
import { Album } from '../albums/schemas/album.schema';

describe('ListService', () => {
  let service: ListService;
  let albumService: AlbumService;
  let model: Model<List>;
  let albumModel: Model<Album>;

  const mockListService = {
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn()
  }

  const mockAlbumService = {
    findById: jest.fn()
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

  const mockList = {
    _id: "671cf2598f4e61ab24d095b3",
    name: "My Favorite Albums",
    description: "A collection of my all-time favorite albums.",
    type: Type.LISTENED,
    albums: [],
};

const mockListWithAlbum = {
  _id: "671cf2598f4e61ab24d095b3",
  name: "My Favorite Albums",
  description: "A collection of my all-time favorite albums.",
  type: Type.LISTENED,
  albums: ["671cf2598f4e61ab24d095b3"]
}

  const mockAlbumId = "671cf2598f4e61ab24d095b3";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        AlbumService,
        {
          provide: getModelToken(List.name),
          useValue: mockListService
        },
        {
          provide: getModelToken(Album.name),
          useValue: mockAlbumService
        }
      ],
    }).compile();

    service = module.get<ListService>(ListService);
    albumService = module.get<AlbumService>(AlbumService);
    model = module.get<Model<List>>(getModelToken(List.name))
    albumModel = module.get<Model<Album>>(getModelToken(Album.name))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {

    it('should create and return a list', async () => {

      jest.spyOn(model, 'create').mockResolvedValue(mockList as any)

      const {_id, ...newList} = mockList
      
      const result = await service.create(newList as any)

      expect(result).toEqual(mockList)
    })

  })

  describe('deleteById', () => {
    it('should delete and return a list', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockList)
      const isValidObjectionIdMock = jest
      .spyOn(mongoose, 'isValidObjectId')
      .mockReturnValueOnce(true)

      const result = await service.deleteById(mockList._id)

      expect(result).toEqual(mockList)
    })

    it('should throw BadRequestException if id is invalid', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockList)

      const isValidObjectionIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValueOnce(false)

      await expect(service.deleteById(mockList._id)).rejects.toThrow(BadRequestException)
    })
  })

  describe('updateById', () => {
    const updatedList = {
      name: 'New list name',
      ...mockList
    }
    
    const update = {
      name: 'New list name'
    }

    it('should update and return a list', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedList)
      const isValidObjectionIdMock = jest
      .spyOn(mongoose, 'isValidObjectId')
      .mockReturnValueOnce(true)

      const result = await service.updateById(mockList._id, update as any)
      
      expect(result).toEqual(updatedList)

    })

    it('should throw BadRequestException if id is invalid', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedList)

      const isValidObjectionIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValueOnce(false)
      
        await expect(service.updateById(mockList._id, update as any))
          .rejects
          .toThrow(BadRequestException)

    })
  })

  // describe('addAlbum', () => {
  //   const updatedList = {
  //     _id: "671cf2598f4e61ab24d095b3",
  //     name: "My Favorite Albums",
  //     description: "A collection of my all-time favorite albums.",
  //     type: Type.LISTENED,
  //     albums: [new ObjectId("671cf2598f4e61ab24d095b3")],
  // };
  
  //   it('should add album and return list', async () => {
  //     jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedList)
  //     jest.spyOn(albumService, 'findById').mockResolvedValue(mockAlbum as any)

  //     const result = await service.addAlbum(mockList._id, mockAlbumId)

  //     expect(result).toEqual(updatedList)
  //   })

  //   it('should throw BadRequestException if album id is invalid', async () => {
  //     jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedList)
  //     jest.spyOn(albumService, 'findById').mockResolvedValue(undefined)

  //     await expect(service.addAlbum(mockList._id, mockAlbumId))
  //       .rejects
  //       .toThrow(BadRequestException)
  //   })

  //   it('should throw BadRequestException if list id is invalid mongo id', async () => {
  //     jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(updatedList)
  //     jest.spyOn(albumService, 'findById').mockResolvedValue(mockAlbum as any)
  //     jest.spyOn(mongoose, 'isValidObjectId').mockReturnValueOnce(false)

  //     await expect(service.addAlbum(mockList._id, mockAlbumId))
  //       .rejects
  //       .toThrow(BadRequestException)
  //   })
  // })

  describe('removeAlbum', () => {
    const initialList = {
      _id: "671cf2598f4e61ab24d095b3",
      name: "My Favorite Albums",
      description: "A collection of my all-time favorite albums.",
      type: Type.LISTENED,
      albums: [new ObjectId("671cf2598f4e61ab24d095b3")],
  };
  
    it('should remove album and return list', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockList)
      jest.spyOn(albumService, 'findById').mockResolvedValue(initialList as any)

      const result = await service.removeAlbum(initialList._id, mockAlbumId)

      expect(result).toEqual(mockList)
    })

    it('should throw BadRequestException if album id is invalid', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockList)
      jest.spyOn(albumService, 'findById').mockResolvedValue(undefined)

      await expect(service.removeAlbum(initialList._id, mockAlbumId))
        .rejects
        .toThrow(BadRequestException)
    })

    it('should throw BadRequestException if list id is invalid mongo id', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(mockList)
      jest.spyOn(albumService, 'findById').mockResolvedValue(initialList as any)
      jest.spyOn(mongoose, 'isValidObjectId').mockReturnValueOnce(false)

      await expect(service.removeAlbum(mockList._id, mockAlbumId))
        .rejects
        .toThrow(BadRequestException)
    })
  })

  describe('findById', () => {
    it('should find and return a list by ID', async () => {
        jest.spyOn(model, 'findById').mockResolvedValue(mockList)

        const result = await service.findById(mockList._id);
        
        expect(model.findById).toHaveBeenCalledWith(mockList._id) 
        expect(result).toEqual(mockList)
    })

    it('should throw BadRequestException if invalid id is provided', async () => {
        const id = 'invalid-id'

        const isValidObjectionIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false)

        await expect(service.findById(id)).rejects.toThrow(BadRequestException)
        expect(isValidObjectionIdMock).toHaveBeenCalledWith(id)
        isValidObjectionIdMock.mockRestore()
    })

    it('should throw NotFoundException if album is not found', async () => {
        const id = '671cf9598f4e61ab24d095b5'

        jest.spyOn(mongoose, 'isValidObjectId').mockReturnValue(true)

        jest.spyOn(model, 'findById').mockResolvedValue(null)
        await expect(service.findById(id)).rejects.toThrow(NotFoundException)
    })
  })

  // describe('isAlbumInList', () => {
  //   it('should return true if album is in list', async () => {

  //     jest.spyOn(model, 'findById').mockResolvedValueOnce(mockListWithAlbum)

  //     const result = await service.isAlbumInList(mockList._id, mockAlbum._id)
  //     expect(result).toEqual(true)
  //   })
  // })


});
