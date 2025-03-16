import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { getModelToken } from '@nestjs/mongoose';
import { Album } from './schemas/album.schema';
import mongoose, { Document } from 'mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AlbumService', () => {
    let service: AlbumService;
    let albumModel: mongoose.Model<Album & Document>;

    const mockAlbumModel = {
        countDocuments: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        findById: jest.fn(),
        create: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AlbumService,
                {
                    provide: getModelToken(Album.name),
                    useValue: mockAlbumModel,
                },
            ],
        }).compile();

        service = module.get<AlbumService>(AlbumService);
        albumModel = module.get(getModelToken(Album.name));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllAlbums', () => {
      it('should return paginated albums and total count', async () => {
        const query = { page: '1', search: 'test' };
        const mockAlbums = [{ title: 'Test Album', artist: 'Test Artist' }];
        const totalCount = 1;

        (albumModel.countDocuments as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(totalCount),
        });

        (albumModel.find as jest.Mock).mockReturnValue({
            limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockResolvedValue(mockAlbums),
            }),
        });

        const result = await service.getAllAlbums(query);

        expect(result).toEqual({ albums: mockAlbums, total: totalCount });
        expect(albumModel.countDocuments).toHaveBeenCalledWith({
            $or: [
                { title: { $regex: 'test', $options: 'i' } },
                { artist: { $regex: 'test', $options: 'i' } },
            ],
        });
        expect(albumModel.find).toHaveBeenCalledWith({
            $or: [
                { title: { $regex: 'test', $options: 'i' } },
                { artist: { $regex: 'test', $options: 'i' } },
            ],
        });
    });

    it('should return all albums when no search query is provided', async () => {
        const query = { page: '1' };
        const mockAlbums = [{ title: 'Test Album', artist: 'Test Artist' }];
        const totalCount = 1;

        (albumModel.countDocuments as jest.Mock).mockReturnValue({
          exec: jest.fn().mockResolvedValue(totalCount),
        });

        (albumModel.find as jest.Mock).mockReturnValue({
            limit: jest.fn().mockReturnValue({
                skip: jest.fn().mockResolvedValue(mockAlbums),
            }),
        });

        const result = await service.getAllAlbums(query);

        expect(result).toEqual({ albums: mockAlbums, total: totalCount });
        expect(albumModel.countDocuments).toHaveBeenCalledWith({});
        expect(albumModel.find).toHaveBeenCalledWith({});
    });

        it('should handle pagination correctly', async () => {
            const query = { page: '2', search: 'test' };
            const mockAlbums = [{ title: 'Test Album', artist: 'Test Artist' }];
            const totalCount = 50; // Assume there are 50 total albums

            (albumModel.countDocuments as jest.Mock).mockReturnValue({
              exec: jest.fn().mockResolvedValue(totalCount),
            });
            (albumModel.find as jest.Mock).mockReturnValue({
                limit: jest.fn().mockReturnValue({
                    skip: jest.fn().mockResolvedValue(mockAlbums),
                }),
            });

            const result = await service.getAllAlbums(query);

            expect(result).toEqual({ albums: mockAlbums, total: totalCount });
            expect(albumModel.countDocuments).toHaveBeenCalledWith({
                $or: [
                    { title: { $regex: 'test', $options: 'i' } },
                    { artist: { $regex: 'test', $options: 'i' } },
                ],
            });
            expect(albumModel.find).toHaveBeenCalledWith({
                $or: [
                    { title: { $regex: 'test', $options: 'i' } },
                    { artist: { $regex: 'test', $options: 'i' } },
                ],
            });
        });
    });

    describe('getAlbumByTitle', () => {
      it('should return an album when found', async () => {
          const title = 'Test Album';
          const mockAlbum = { title: 'Test Album', artist: 'Test Artist' };

          (albumModel.findOne as jest.Mock).mockResolvedValue(mockAlbum);

          const result = await service.getAlbumByTitle(title);

          expect(result).toEqual(mockAlbum);
          expect(albumModel.findOne).toHaveBeenCalledWith({ title: title });
      });

      it('should throw NotFoundException when album is not found', async () => {
          const title = 'Nonexistent Album';

          (albumModel.findOne as jest.Mock).mockResolvedValue(null);

          await expect(service.getAlbumByTitle(title)).rejects.toThrow(NotFoundException);
          await expect(service.getAlbumByTitle(title)).rejects.toThrow('album not found');
          expect(albumModel.findOne).toHaveBeenCalledWith({ title: title });
      });
    });

    describe('getAlbumById', () => {
      it('should return an album when a valid ID is provided', async () => {
          const id = new mongoose.Types.ObjectId().toString();
          const mockAlbum = { title: 'Test Album', artist: 'Test Artist' };

          (mockAlbumModel.findById as jest.Mock).mockResolvedValue(mockAlbum);

          const result = await service.getAlbumById(id);

          expect(result).toEqual(mockAlbum);
          expect(mockAlbumModel.findById).toHaveBeenCalledWith(id);
      });

      it('should throw BadRequestException when an invalid ID is provided', async () => {
          const invalidId = 'invalid_id';

          await expect(service.getAlbumById(invalidId)).rejects.toThrow(BadRequestException);
          await expect(service.getAlbumById(invalidId)).rejects.toThrow('please enter a valid mongo id');
          expect(mockAlbumModel.findById).not.toHaveBeenCalled();
      });

      it('should throw NotFoundException when album is not found', async () => {
          const id = new mongoose.Types.ObjectId().toString();

          (mockAlbumModel.findById as jest.Mock).mockResolvedValue(null);

          await expect(service.getAlbumById(id)).rejects.toThrow(NotFoundException);
          await expect(service.getAlbumById(id)).rejects.toThrow('album not found');
          expect(mockAlbumModel.findById).toHaveBeenCalledWith(id);
      });
    });


    describe('getAlbumsByArtist', () => {
      it('should return an array of albums for a given artist', async () => {
          const artistName = 'Test Artist';
          const mockAlbums = [
              { title: 'Album 1', artist: artistName },
              { title: 'Album 2', artist: artistName },
          ];

          (mockAlbumModel.find as jest.Mock).mockResolvedValue(mockAlbums);

          const result = await service.getAlbumsByArtist(artistName);

          expect(result).toEqual(mockAlbums);
          expect(mockAlbumModel.find).toHaveBeenCalledWith({ artist: artistName });
      });

      it('should return an empty array when no albums are found for the artist', async () => {
          const artistName = 'Nonexistent Artist';

          (mockAlbumModel.find as jest.Mock).mockResolvedValue([]);

          const result = await service.getAlbumsByArtist(artistName);

          expect(result).toEqual([]);
          expect(mockAlbumModel.find).toHaveBeenCalledWith({ artist: artistName });
      });
    });
});
``
