import { Controller, Get, Param, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/auth/schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':id')
    async getUserById(
        @Param('id')
        id: string
    ): Promise<User> {
        return await this.usersService.findById(id)
    }

    @Get()
    getUser(@Request() req) {
        return req.user
    }

}
