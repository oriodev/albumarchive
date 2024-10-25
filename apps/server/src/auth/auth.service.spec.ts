import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { nullUser, verifiableUser } from '../../utils/stubs/user';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn()
          }
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a token if user is found', async () => {

    (jwtService.sign as jest.Mock).mockReturnValue('token');

    const result = await authService.validateUser(verifiableUser);

    expect(result).toBe('token')
  })

  it('should return null if user is not found', async () => {

    const result = await authService.validateUser(nullUser);

    expect(result).toBe(null)
  })
});