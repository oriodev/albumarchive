import { Body, Controller, Delete, Get, Param, Put, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/auth/schemas/user.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';


@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get()
    getUser(@Request() req) {
        return req.user
    }

    @Get('/all')
    findAll(@Query() query: ExpressQuery) {
        return this.usersService.findAll(query)
    }

    @Get(':id')
    async getUserById(
        @Param('id')
        id: string
    ): Promise<User> {
        return await this.usersService.findById(id)
    }

    @Delete(':id')
    async deleteAlbum(
        @Param('id')
        id: string
    ): Promise<User> {
        return this.usersService.deleteById(id)
    }

    @Put(':id')
    async editUser(
        @Param('id')
        id: string,
        @Body() user: User
    ): Promise<User> {
        return this.usersService.editById(user, id)
    }
}
