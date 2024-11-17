import { Test, TestingModule } from "@nestjs/testing"
import { getModelToken } from "@nestjs/mongoose"
import mongoose, { Model } from "mongoose"
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { User } from "./schemas/user.schema"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from 'bcryptjs'


describe('AuthService', () => {

    let authService: AuthService;
    let model: Model<User>;
    let jwtService: JwtService;

    const mockAuthService = {
        create: jest.fn(),
        findOne: jest.fn()
    }

    const signUpDto = {
        username: 'Ghulam',
        email: 'ghulam1@gmail.com',
        password: '12345678', 
      };

    const token = 'jwt-token';

    const mockUser = {
        _id: '61c0ccf11d7bf83d153d7c06',
        username: 'Ghulam',
        email: 'ghulam1@gmail.com',
      };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                {
                    provide: getModelToken(User.name),
                    useValue: mockAuthService
                }
            ]
        }).compile()

        authService = module.get<AuthService>(AuthService);
        model = module.get<Model<User>>(getModelToken(User.name));
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(authService).toBeDefined()
    })

    describe('signUp', () => {
        it('should register the new user', async () => {

            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword')
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve(mockUser as any))
            jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token')

            const result = await authService.signUp(signUpDto)
            
            expect(bcrypt.hash).toHaveBeenCalled()
            expect(result).toEqual({ token })

        })

        it('should throw duplicate email error', async () => {

            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.reject({ code: 11000} ))

            await expect(authService.signUp(signUpDto)).rejects.toThrow(ConflictException)

        })
    })

    describe('login', () => {
        const loginDto = {
            email: 'ghulam1@gmail.com',
            password: '12345678',
          };

        it('should login a user and return the token', async () => {

            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser)
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true)
            jest.spyOn(jwtService, 'sign').mockReturnValue(token)

            const result = await authService.login(loginDto)

            expect(result).toEqual({ token })

        })

        it('should throw invalid email error', async () => {

            jest.spyOn(model, 'findOne').mockResolvedValueOnce(null)

            expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException)

        })

        it('should throw invalid password error', async () => {

            jest.spyOn(model, 'findOne').mockResolvedValueOnce(mockUser)
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false)

            expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException)

        })
    })
})