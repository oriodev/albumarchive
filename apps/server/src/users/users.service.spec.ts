import { Test, TestingModule } from '@nestjs/testing';
import { User, UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let users: User[];

  beforeEach(async () => {
    users = []

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    (UsersService as any).users = users;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one user', async () => {
    const result = await service.findOne('cas');
    expect(result).toEqual({
      userId: 1,
      username: 'cas',
      password: 'password'
  })
  })

});
