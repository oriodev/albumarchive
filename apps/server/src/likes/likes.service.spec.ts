import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from './likes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Likes } from './schemas/likes.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';

describe('LikesService', () => {
  let service: LikesService;
  let likesModel: any;
  let listModel: any;
  let userModel: any;

  const mockLikesModel = {
    findOne: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn()
  };

  const mockListModel = {
    find: jest.fn()
  };
  const mockUserModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: getModelToken(Likes.name),
          useValue: mockLikesModel,
        },        
        {
          provide: getModelToken('List'),
          useValue: mockListModel,
        },        
        {
          provide: getModelToken('User'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    likesModel = module.get(getModelToken(Likes.name));
    listModel = module.get(getModelToken('List'));
    userModel = module.get(getModelToken('User'));

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLike', () => {
    it('should return a like if found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const listId = '507f1f77bcf86cd799439012';
      const mockLike = { user: userId, list: listId };

      (likesModel.findOne as jest.Mock).mockResolvedValue(mockLike);

      const result = await service.getLike(userId, listId);

      expect(result).toEqual(mockLike);
      expect(likesModel.findOne).toHaveBeenCalledWith({ user: userId, list: listId });
    });

    it('should throw BadRequestException for invalid MongoDB IDs', async () => {
      const invalidUserId = 'invalid-id';
      const listId = '507f1f77bcf86cd799439012';

      await expect(service.getLike(invalidUserId, listId)).rejects.toThrow(BadRequestException);
      await expect(service.getLike(invalidUserId, listId)).rejects.toThrow('please enter a valid mongo id');
    });

    it('should throw NotFoundException if like is not found', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const listId = '507f1f77bcf86cd799439012';

      (likesModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getLike(userId, listId)).rejects.toThrow(NotFoundException);
      await expect(service.getLike(userId, listId)).rejects.toThrow('rating not found');
    });
  });

  describe('getListLikes', () => {
    it('should return the count of likes for a valid list ID', async () => {
      const listId = '507f1f77bcf86cd799439011';
      const mockCount = 10;

      (likesModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockCount),
      });

      const result = await service.getListLikes(listId);

      expect(result).toBe(mockCount);
      expect(likesModel.countDocuments).toHaveBeenCalledWith({ list: listId });
    });

    it('should throw BadRequestException for an invalid MongoDB ID', async () => {
      const invalidListId = 'invalid-id';

      await expect(service.getListLikes(invalidListId)).rejects.toThrow(BadRequestException);
      await expect(service.getListLikes(invalidListId)).rejects.toThrow('please enter a valid mongodb ID');
    });
  });

  describe('getUserLikedLists', () => {
    it('should return all lists a user has liked for a valid user ID', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const mockLikes = [
        { user: userId, list: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012') },
        { user: userId, list: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013') },
      ];
      const mockLikedLists = [
        { _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'), title: 'List 1' },
        { _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'), title: 'List 2' },
      ];

      (likesModel.find as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLikes),
      });

      (listModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockLikedLists),
        }),
      });

      const result = await service.getUserLikedLists(userId);

      expect(result).toEqual(mockLikedLists);
      expect(likesModel.find).toHaveBeenCalledWith({ user: userId });
      expect(listModel.find).toHaveBeenCalledWith({ _id: { $in: mockLikes.map(like => like.list) } });
    });

    it('should throw BadRequestException for an invalid MongoDB ID', async () => {
      const invalidUserId = 'invalid-id';

      await expect(service.getUserLikedLists(invalidUserId)).rejects.toThrow(BadRequestException);
      await expect(service.getUserLikedLists(invalidUserId)).rejects.toThrow('please enter a valid mongo id');
    });
  });
});
