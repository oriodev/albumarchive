import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import mongoose, { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { List } from '../lists/schemas/list.schema';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;
  let listModel: Model<List>;

  const mockUserService = {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
  }

  const mockListService = {}

  const mockUserId = '67309d8c36ce871afc3358c1'
  const mockUser = {
    _id: "67309d8c36ce871afc3358c1",
    username: "sebastian1",
    email: "seb1@bby.com",
    password: "$2a$10$iZKYzdSw/ACpQ6PWdju2j.UbHJwtspzI69mn1JVHRHNvC0.vnYyP2",
    createdAt: "2024-11-10T11:48:28.788Z",
    updatedAt: "2024-11-10T11:48:28.788Z",
    __v: 0
}

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService
        },
        {
          provide: getModelToken(List.name),
          useValue: mockListService
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
    listModel = module.get<Model<List>>(getModelToken(List.name));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user', async () => {
        const mockUserWithLists = [
            {
                _id: mockUser._id,
                username: mockUser.username,
                email: mockUser.email,
                password: mockUser.password,
                lists: [],
                followers: [],
                following: [],
                reviews: []
            }
        ];

        jest.spyOn(model, 'aggregate').mockResolvedValue(mockUserWithLists);

        const user = await service.findById(mockUserId);

        expect(user).toEqual(mockUserWithLists[0]);
    });

    it('should throw BadRequestException if invalid id is provided', async () => {
        const id = 'invalid-id';

        const isValidObjectIdMock = jest
            .spyOn(mongoose, 'isValidObjectId')
            .mockReturnValue(false);

        await expect(service.findById(id)).rejects.toThrow(BadRequestException);
        expect(isValidObjectIdMock).toHaveBeenCalledWith(id);
        isValidObjectIdMock.mockRestore();
    });

    it('should throw NotFoundException if user is not found', async () => {
        const id = '671cf9598f4e61ab24d095b5';

        const isValidObjectIdMock = jest
            .spyOn(mongoose, 'isValidObjectId')
            .mockReturnValue(true);

        jest.spyOn(model, 'aggregate').mockResolvedValue([]);

        await expect(service.findById(id)).rejects.toThrow(NotFoundException);
    });
});


  describe('deleteById', () => {
    it('should delete and return a user', async () => {

        jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockUser);
        
        const result = await service.deleteById(mockUser._id);

        expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id)
        expect(result).toEqual(mockUser)
    })
})

});
