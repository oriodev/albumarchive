import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import mongoose, { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUserService = {
    findById: jest.fn(),
    findByIdAndDelete: jest.fn()
  }

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
      }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockUser)

      const user = await service.findById(mockUserId)

      expect(user).toEqual(mockUser)
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

      const isValidObjectionIdMock = jest
          .spyOn(mongoose, 'isValidObjectId')
          .mockReturnValue(true)

      jest.spyOn(model, 'findById').mockResolvedValue(null)
      await expect(service.findById(id)).rejects.toThrow(NotFoundException)
  })
  })

  describe('deleteById', () => {
    it('should delete and return a user', async () => {

        jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(mockUser);
        
        const result = await service.deleteById(mockUser._id);

        expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockUser._id)
        expect(result).toEqual(mockUser)
    })
})

});
