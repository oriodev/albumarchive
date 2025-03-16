import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { List } from './schemas/list.schema';
import mongoose, { Document } from 'mongoose';
import { ListService } from './lists.service';
import { User } from '../auth/schemas/user.schema';
import { Likes } from '../likes/schemas/likes.schema';
import { AlbumService } from '../albums/album.service';
import { Album } from 'src/albums/schemas/album.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ListService', () => {
    let service: ListService;
    let albumService: AlbumService;
    let listModel: mongoose.Model<List & Document>;
    let userModel: mongoose.Model<User>; 
    let likesModel: mongoose.Model<Likes>;
    let albumModel: mongoose.Model<Album>;

    const mockListModel = {
        countDocuments: jest.fn(),
        aggregate: jest.fn(),
    };

    const mockUserModel = {
    };

    const mockLikesModel = {
    };

    const mockAlbumModel = {}

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListService,
                AlbumService,
                {
                    provide: getModelToken(List.name),
                    useValue: mockListModel,
                },
                {
                    provide: getModelToken('User'),
                    useValue: mockUserModel,
                },
                {
                    provide: getModelToken('Likes'),
                    useValue: mockLikesModel,
                },
                {
                  provide: getModelToken('Album'),
                  useValue: mockAlbumModel,
              },
            ],
        }).compile();

        service = module.get<ListService>(ListService);
        listModel = module.get(getModelToken(List.name));
        userModel = module.get(getModelToken('User'));
        likesModel = module.get(getModelToken('Likes'));
        albumModel = module.get(getModelToken('Album'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
      it('should return lists and total count', async () => {
          const mockQuery = { page: '1', search: 'test' };
          const mockLists = [{ _id: '1', name: 'Test List', user: 'userId1' }];
          const mockTotal = 1;
  
          (listModel.countDocuments as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockTotal),
          });


          listModel.aggregate = jest.fn().mockResolvedValue(mockLists);
  
          const result = await service.findAll(mockQuery);
  
          expect(result).toEqual({ lists: mockLists, total: mockTotal });
          expect(listModel.countDocuments).toHaveBeenCalledWith({
              $or: [{ name: { $regex: 'test', $options: 'i' } }],
              name: { $nin: ['Listened', 'To Listen'] }
          });
          expect(listModel.aggregate).toHaveBeenCalled();
      });
    });

    describe('getListById', () => {
      const validId = '60c72b2f9b1d4c001c8e4e1f';
      const invalidId = 'invalidObjectId';
      const mockList = {
          _id: validId,
          name: 'Test List',
          description: 'A list for testing',
          listCoverImg: 'cover.jpg',
          slug: 'test-list',
          type: 'playlist',
          user: 'userId1',
          albums: [],
          totalLikes: 0
      };
  
      it('should return the list when a valid ID is provided', async () => {
          listModel.aggregate = jest.fn().mockResolvedValue([mockList]);
  
          const result = await service.getListById(validId);
  
          expect(result).toEqual(mockList);
          expect(listModel.aggregate).toHaveBeenCalledWith([
              { $match: { _id: new mongoose.Types.ObjectId(validId) } },
              {
                  $lookup: {
                      from: 'likes',
                      localField: '_id',
                      foreignField: 'list',
                      as: 'likes'
                  }
              },
              {
                  $lookup: {
                      from: 'albums',
                      localField: 'albums',
                      foreignField: '_id',
                      as: 'albumDetails'
                  }
              },
              {
                  $lookup: {
                      from: 'users',
                      localField: 'user',
                      foreignField: '_id',
                      as: 'user'
                  }
              },
              {
                  $unwind: {
                      path: '$user',
                      preserveNullAndEmptyArrays: true
                  }
              },
              {
                  $addFields: {
                      totalLikes: { $size: '$likes' }
                  }
              },
              {
                  $project: {
                      _id: 1,
                      name: 1,
                      description: 1,
                      listCoverImg: 1,
                      slug: 1,
                      type: 1,
                      user: 1,
                      albums: '$albumDetails',
                      totalLikes: 1
                  }
              }
          ]);
      });
  
      it('should throw NotFoundException when the list is not found', async () => {
          listModel.aggregate = jest.fn().mockResolvedValue([]);
  
          await expect(service.getListById(validId)).rejects.toThrow(NotFoundException);
          await expect(service.getListById(validId)).rejects.toThrow('List not found');
      });
  
      it('should throw BadRequestException for an invalid ID', async () => {
          await expect(service.getListById(invalidId)).rejects.toThrow(BadRequestException);
          await expect(service.getListById(invalidId)).rejects.toThrow('please enter a valid mongo id');
      });
    });

    describe('findByUserId', () => {
      const validId = '60c72b2f9b1d4c001c8e4e1f';
      const invalidId = 'invalidObjectId';
      const mockLists = [
          { _id: '1', name: 'Test List 1', user: validId },
          { _id: '2', name: 'Test List 2', user: validId }
      ];
  
      it('should return lists when a valid user ID is provided', async () => {
          listModel.find = jest.fn().mockReturnValue({
              populate: jest.fn().mockResolvedValue(mockLists)
          });
  
          const result = await service.findByUserId(validId);
  
          expect(result).toEqual(mockLists);
          expect(listModel.find).toHaveBeenCalledWith({ user: validId });
          expect(listModel.find().populate).toHaveBeenCalledWith('user');
      });
  
      it('should throw NotFoundException when no lists are found for the user', async () => {
          listModel.find = jest.fn().mockReturnValue({
              populate: jest.fn().mockResolvedValue([])
          });
  
          await expect(service.findByUserId(validId)).rejects.toThrow(NotFoundException);
          await expect(service.findByUserId(validId)).rejects.toThrow('list not found');
      });
  
      it('should throw BadRequestException for an invalid user ID', async () => {
          await expect(service.findByUserId(invalidId)).rejects.toThrow(BadRequestException);
          await expect(service.findByUserId(invalidId)).rejects.toThrow('please enter a valid mongo id');
      });
    });
  
    describe('deleteById', () => {
      const validId = '60c72b2f9b1d4c001c8e4e1f';
      const invalidId = 'invalidObjectId';
      const mockDeletedList = { _id: validId, name: 'Test List' };
  
      it('should delete the list when a valid ID is provided', async () => {
          listModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedList);
  
          const result = await service.deleteById(validId);
  
          expect(result).toEqual(mockDeletedList);
          expect(listModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
      });
  
      it('should return null when no list is found to delete', async () => {
          listModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);
  
          const result = await service.deleteById(validId);
  
          expect(result).toBeNull();
          expect(listModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
      });
  
      it('should throw BadRequestException for an invalid ID', async () => {
          await expect(service.deleteById(invalidId)).rejects.toThrow(BadRequestException);
          await expect(service.deleteById(invalidId)).rejects.toThrow('please enter a valid mongodb id');
      });
  });

    describe('isAlbumInList', () => {
    const validListId = '60c72b2f9b1d4c001c8e4e1f';
    const validAlbumId = '60c72b2f9b1d4c001c8e4e2f'; 
    const invalidId = 'invalidObjectId';
    const mockList = {
        _id: validListId,
        albums: [validAlbumId]
    };

    it('should return true if the album is in the list', async () => {
        listModel.findById = jest.fn().mockResolvedValue(mockList);

        const result = await service.isAlbumInList(validListId, validAlbumId);

        expect(result).toBe(true);
        expect(listModel.findById).toHaveBeenCalledWith(validListId, 'albums');
    });

    it('should return false if the album is not in the list', async () => {
        const mockListWithoutAlbum = {
            _id: validListId,
            albums: []
        };
        listModel.findById = jest.fn().mockResolvedValue(mockListWithoutAlbum);

        const result = await service.isAlbumInList(validListId, validAlbumId);

        expect(result).toBe(false);
        expect(listModel.findById).toHaveBeenCalledWith(validListId, 'albums');
    });

    it('should throw an error for an invalid album_id', async () => {
        await expect(service.isAlbumInList(validListId, invalidId)).rejects.toThrow('invalid list_id or album_id');
    });

    it('should throw an error for an invalid list_id', async () => {
        await expect(service.isAlbumInList(invalidId, validAlbumId)).rejects.toThrow('invalid list_id or album_id');
    });

    it('should throw an error for both invalid IDs', async () => {
        await expect(service.isAlbumInList(invalidId, invalidId)).rejects.toThrow('invalid list_id or album_id');
    });

    it('should throw an error if the list is not found', async () => {
        listModel.findById = jest.fn().mockResolvedValue(null);

        await expect(service.isAlbumInList(validListId, validAlbumId)).rejects.toThrow('List not found');
    });
    });
});
