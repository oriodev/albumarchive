import { Body, Controller, Get, HttpException, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { Public } from 'utils/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}
    
    @Public()
    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
        return this.authService.signUp(signUpDto);
    }

    @Public()
    @Post('/login')
    login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
        return this.authService.login(loginDto);
    }

}
