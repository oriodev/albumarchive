import { Body, Controller, Get, HttpException, Post, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) {}
    
    @Post('login')
    @UseGuards(LocalGuard)
     async login(@Body() authPayload: AuthPayloadDto) {
        const user = await this.authService.validateUser(authPayload)

        if (!user) throw new HttpException('invalid credentials', 401);

        return user;
    }

}
