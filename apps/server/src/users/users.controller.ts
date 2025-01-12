import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Request } from '@nestjs/common';
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

    @Get('/id/:id')
    async getUserById(
        @Param('id')
        id: string
    ): Promise<User> {
        return await this.usersService.findById(id)
    }

    @Get('/username/:username')
    async getUserByUsername(
        @Param('username')
        username: string
    ): Promise<User> {
        return await this.usersService.findByUsername(username)
    }

    @Post('/batch')
    async findByIdsBatch(@Body('ids') ids: string[]): Promise<User[]> {
        return this.usersService.findByIdsBatch(ids);
    }

    @Delete(':id')
    async deleteUser(
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

    @Post(':userId/:currentUserId/follow')
    async followUser(@Param('userId') userId: string, @Param('currentUserId') currentUserId: string) {
      return this.usersService.followUser(currentUserId, userId);
    }
  
    @Delete(':userId/:currentUserId/unfollow')
    async unfollowUser(@Param('userId') userId: string, @Param('currentUserId') currentUserId: string) {
      return this.usersService.unfollowUser(currentUserId, userId);
    }
}
