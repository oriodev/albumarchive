import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../auth/schemas/user.schema';
import { Model } from 'mongoose';
import { List } from 'src/lists/schemas/list.schema';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let listModel: Model<List>;

  const mockUserModel = {
    countDocuments: jest.fn(),
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn()
  };

  const mockListModel = {
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken('List'),
          useValue: mockListModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    listModel = module.get<Model<List>>(getModelToken('List'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return users and total count', async () => {
      const query = { page: '1', search: 'test' };
      const mockUsers = [{ username: 'testUser1' }, { username: 'testUser2' }];
      const totalCount = mockUsers.length;

      (userModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(totalCount),
      });
      (userModel.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockResolvedValue(mockUsers),
        }),
      });

      const result = await service.findAll(query);

      expect(result).toEqual({ users: mockUsers, total: totalCount });
      expect(userModel.countDocuments).toHaveBeenCalledWith({
        $or: [{ username: { $regex: query.search, $options: 'i' } }],
      });
      expect(userModel.find).toHaveBeenCalledWith({
        $or: [{ username: { $regex: query.search, $options: 'i' } }],
      });
    });

    it('should return empty users and total count when no users found', async () => {
      const query = { page: '1', search: 'nonexistent' };
      const totalCount = 0;

      (userModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(totalCount),
      });
      (userModel.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockResolvedValue([]),
        }),
      });

      const result = await service.findAll(query);

      expect(result).toEqual({ users: [], total: totalCount });
      expect(userModel.countDocuments).toHaveBeenCalledWith({
        $or: [{ username: { $regex: query.search, $options: 'i' } }],
      });
      expect(userModel.find).toHaveBeenCalledWith({
        $or: [{ username: { $regex: query.search, $options: 'i' } }],
      });
    });

    it('should handle pagination correctly', async () => {
      const query = { page: '2', search: 'test' };
      const mockUsers = [{ username: 'testUser3' }, { username: 'testUser4' }];
      const totalCount = 20;

      (userModel.countDocuments as jest.Mock).mockReturnValue({
        exec: jest.fn().mockResolvedValue(totalCount),
      });
      (userModel.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockResolvedValue(mockUsers),
        }),
      });

      const result = await service.findAll(query);

      expect(result).toEqual({ users: mockUsers, total: totalCount });
      expect(userModel.countDocuments).toHaveBeenCalledWith({
        $or: [{ username: { $regex: query.search, $options: 'i' } }],
      });
      expect(userModel.find).toHaveBeenCalledWith({
        $or: [{ username: { $regex: query.search, $options: 'i' } }],
      });
    });
  });

  describe('deleteById', () => {
    it('should throw BadRequestException for invalid MongoDB ID', async () => {
      const invalidId = 'invalid-id';

      await expect(service.deleteById(invalidId)).rejects.toThrow(BadRequestException);
      await expect(service.deleteById(invalidId)).rejects.toThrow('please enter a valid mongo id');
    });

    it('should delete user and associated lists when valid ID is provided', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const mockUser = { _id: validId, username: 'testUser' };

      mockUserModel.findByIdAndDelete.mockResolvedValue(mockUser);
      mockListModel.deleteMany.mockResolvedValue({ deletedCount: 1 });

      const result = await service.deleteById(validId);

      expect(result).toEqual(mockUser);
      expect(mockListModel.deleteMany).toHaveBeenCalledWith({ user: validId });
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
    });

    it('should return null if user is not found', async () => {
      const validId = '507f1f77bcf86cd799439011';

      mockUserModel.findByIdAndDelete.mockResolvedValue(null);
      mockListModel.deleteMany.mockResolvedValue({ deletedCount: 0 });

      const result = await service.deleteById(validId);

      expect(result).toBeNull();
      expect(mockListModel.deleteMany).toHaveBeenCalledWith({ user: validId });
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith(validId);
    });
  });

  describe('followUser', () => {
    it('should follow a user and update both users', async () => {
      const currentUserId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439012';

      (userModel.updateOne as jest.Mock).mockResolvedValue({ nModified: 1 });

      const result = await service.followUser(currentUserId, userId);

      expect(result).toEqual({ message: 'followed' });
      expect(userModel.updateOne).toHaveBeenCalledTimes(2);
      expect(userModel.updateOne).toHaveBeenCalledWith(
        { _id: currentUserId },
        { $addToSet: { following: userId } }
      );
      expect(userModel.updateOne).toHaveBeenCalledWith(
        { _id: userId },
        { $addToSet: { followers: currentUserId } }
      );
    });

    it('should handle errors when updating users', async () => {
      const currentUserId = '507f1f77bcf86cd799439011';
      const userId = '507f1f77bcf86cd799439012';

      (userModel.updateOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.followUser(currentUserId, userId)).rejects.toThrow('Database error');
      expect(userModel.updateOne).toHaveBeenCalledTimes(1);
    });
  });
});
