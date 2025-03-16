import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { Reviews } from './schemas/reviews.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import mongoose, { Query } from 'mongoose';

describe('ReviewsService', () => {
    let service: ReviewsService;
    let reviewsModel: any;
    let userModel: any;

    let mockReviewsModel = {
      findOne: jest.fn(),
      countDocuments: jest.fn(),
      find: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReviewsService,
                {
                    provide: 'ReviewsModel',
                    useValue: mockReviewsModel
                },
                {
                    provide: 'UserModel',
                    useValue: {},
                },
            ],
        }).compile();

        service = module.get<ReviewsService>(ReviewsService);
        reviewsModel = module.get('ReviewsModel');
        userModel = module.get('UserModel');
    });

    describe('getReview', () => {
        it('should return a review if valid userId and albumId are provided', async () => {
            const userId = new mongoose.Types.ObjectId().toString();
            const albumId = new mongoose.Types.ObjectId().toString();
            const mockReview = { user: userId, album: albumId, content: 'Great album!' };

            reviewsModel.findOne = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockReview),
            });

            const result = await service.getReview(userId, albumId);
            expect(result).toEqual(mockReview);
            expect(reviewsModel.findOne).toHaveBeenCalledWith({
                user: userId,
                album: albumId,
            });
        });

        it('should throw BadRequestException if userId or albumId is invalid', async () => {
            await expect(service.getReview('invalidId', 'invalidId')).rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException if review is not found', async () => {
            const userId = new mongoose.Types.ObjectId().toString();
            const albumId = new mongoose.Types.ObjectId().toString();

            reviewsModel.findOne = jest.fn().mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            });

            await expect(service.getReview(userId, albumId)).rejects.toThrow(NotFoundException);
        });
    });

    describe('getAllAlbumReviews', () => {
      it('should return all reviews for an album with pagination', async () => {
          const query = { albumId: new mongoose.Types.ObjectId().toString(), page: '1' };
          const excludeUserId = '';
          const mockReviews = [
              { user: 'user1', album: query.albumId, content: 'Great album!' },
              { user: 'user2', album: query.albumId, content: 'Not bad!' },
          ];
          const totalReviews = mockReviews.length;

          (reviewsModel.countDocuments as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalReviews),
          });
          
          reviewsModel.find = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockReviews),
                }),
            }),
          });

          const result = await service.getAllAlbumReviews(query, excludeUserId);
          expect(result).toEqual({ reviews: mockReviews, total: totalReviews });
          expect(reviewsModel.countDocuments).toHaveBeenCalledWith({ album: query.albumId });
          expect(reviewsModel.find).toHaveBeenCalledWith({ album: query.albumId });
      });

      it('should exclude reviews from a specific user', async () => {
          const query = { albumId: new mongoose.Types.ObjectId().toString(), page: '1' };
          const excludeUserId = 'user1';
          const mockReviews = [
              { user: 'user2', album: query.albumId, content: 'Not bad!' },
          ];
          const totalReviews = mockReviews.length;

          (reviewsModel.countDocuments as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalReviews),
          });

          reviewsModel.find = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockReviews),
                }),
            }),
          });

          const result = await service.getAllAlbumReviews(query, excludeUserId);
          expect(result).toEqual({ reviews: mockReviews, total: totalReviews });
          expect(reviewsModel.countDocuments).toHaveBeenCalledWith({
              album: query.albumId,
              user: { $ne: excludeUserId },
          });
          expect(reviewsModel.find).toHaveBeenCalledWith({
              album: query.albumId,
              user: { $ne: excludeUserId },
          });
      });

      it('should handle pagination correctly', async () => {
          const query = { albumId: new mongoose.Types.ObjectId().toString(), page: '2' };
          const excludeUserId = '';
          const mockReviews = [
              { user: 'user1', album: query.albumId, content: 'Great album!' },
              { user: 'user2', album: query.albumId, content: 'Not bad!' },
          ];
          const totalReviews = 25;

          (reviewsModel.countDocuments as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalReviews),
          });

          reviewsModel.find = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockReviews),
                }),
            }),
          });

          const result = await service.getAllAlbumReviews(query, excludeUserId);
          expect(result).toEqual({ reviews: mockReviews, total: totalReviews });
          expect(reviewsModel.countDocuments).toHaveBeenCalledWith({ album: query.albumId });
          expect(reviewsModel.find).toHaveBeenCalledWith({ album: query.albumId });
      });
    });

    describe('getAllByUser', () => {
      it('should return all reviews by a user with pagination', async () => {
          const query = { userId: new mongoose.Types.ObjectId().toString(), page: '1' };
          const mockReviews = [
              { user: query.userId, album: 'album1', content: 'Great album!' },
              { user: query.userId, album: 'album2', content: 'Not bad!' },
          ];
          const totalReviews = mockReviews.length;

          (reviewsModel.countDocuments as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalReviews),
          });
          
          reviewsModel.find = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockReviews),
                }),
            }),
          });

          const result = await service.getAllByUser(query);
          expect(result).toEqual({ reviews: mockReviews, total: totalReviews });
          expect(reviewsModel.countDocuments).toHaveBeenCalledWith({ user: query.userId });
          expect(reviewsModel.find).toHaveBeenCalledWith({ user: query.userId });
      });

      it('should handle pagination correctly', async () => {
          const query = { userId: new mongoose.Types.ObjectId().toString(), page: '2' };
          const mockReviews = [
              { user: query.userId, album: 'album1', content: 'Great album!' },
              { user: query.userId, album: 'album2', content: 'Not bad!' },
          ];
          const totalReviews = 50;

          (reviewsModel.countDocuments as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalReviews),
          });

          reviewsModel.find = jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(mockReviews),
                }),
            }),
          });

          const result = await service.getAllByUser(query);
          expect(result).toEqual({ reviews: mockReviews, total: totalReviews });
          expect(reviewsModel.countDocuments).toHaveBeenCalledWith({ user: query.userId });
          expect(reviewsModel.find).toHaveBeenCalledWith({ user: query.userId });
      });
    });

    describe('getAlbumRating', () => {
      it('should return the average rating for a valid albumId', async () => {
          const albumId = new mongoose.Types.ObjectId().toString();
          const mockRatings = [{ averageRating: 4.5 }];

          reviewsModel.aggregate = jest.fn().mockResolvedValue(mockRatings);

          const result = await service.getAlbumRating(albumId);
          expect(result).toBe(4.5);
          expect(reviewsModel.aggregate).toHaveBeenCalledWith([
              { $match: { album: new mongoose.Types.ObjectId(albumId) } },
              { $group: { _id: null, averageRating: { $avg: '$rating' } } },
          ]);
      });

      it('should return 0 if there are no ratings for the album', async () => {
          const albumId = new mongoose.Types.ObjectId().toString();
          reviewsModel.aggregate = jest.fn().mockResolvedValue([]);

          const result = await service.getAlbumRating(albumId);
          expect(result).toBe(0);
          expect(reviewsModel.aggregate).toHaveBeenCalledWith([
              { $match: { album: new mongoose.Types.ObjectId(albumId) } },
              { $group: { _id: null, averageRating: { $avg: '$rating' } } },
          ]);
      });

      it('should throw BadRequestException for an invalid albumId', async () => {
          await expect(service.getAlbumRating('invalidId')).rejects.toThrow(BadRequestException);
      });
    });

    describe('getRatingsCount', () => {
      it('should return the count of ratings for each star and total for a valid albumId', async () => {
          const albumId = new mongoose.Types.ObjectId().toString();
          const mockTotalRatings = [
              { _id: 1, count: 3 },
              { _id: 2, count: 5 },
              { _id: 3, count: 2 },
              { _id: 4, count: 4 },
              { _id: 5, count: 1 },
          ];

          reviewsModel.aggregate = jest.fn().mockResolvedValue(mockTotalRatings);

          const result = await service.getRatingsCount(albumId);
          expect(result).toEqual({
              1: 3,
              2: 5,
              3: 2,
              4: 4,
              5: 1,
              total: 15,
          });
          expect(reviewsModel.aggregate).toHaveBeenCalledWith([
              { $match: { album: new mongoose.Types.ObjectId(albumId) } },
              {
                  $group: {
                      _id: "$rating",
                      count: { $count: {} }
                  }
              }
          ]);
      });

      it('should return counts of 0 for each star and total if there are no ratings', async () => {
          const albumId = new mongoose.Types.ObjectId().toString();
          const mockTotalRatings = []; // No ratings

          reviewsModel.aggregate = jest.fn().mockResolvedValue(mockTotalRatings);

          const result = await service.getRatingsCount(albumId);
          expect(result).toEqual({
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
              total: 0,
          });
          expect(reviewsModel.aggregate).toHaveBeenCalledWith([
              { $match: { album: new mongoose.Types.ObjectId(albumId) } },
              {
                  $group: {
                      _id: "$rating",
                      count: { $count: {} }
                  }
              }
          ]);
      });

      it('should throw BadRequestException for an invalid albumId', async () => {
          await expect(service.getRatingsCount('invalidId')).rejects.toThrow(BadRequestException);
      });
    });
});
