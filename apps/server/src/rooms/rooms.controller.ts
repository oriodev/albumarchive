import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Rooms } from './rooms';

@Controller('rooms')
export class RoomsController {
    constructor(private roomsService: RoomsService) {}

    @Get()
    async getRooms(): Promise<Rooms[]> {
        return this.roomsService.getRooms(); 
    }

    @Get(':slug')
    async getRoom(@Param('slug') slug: string): Promise<Rooms> {
        return this.roomsService.getRoom(slug);
    }

    @Post()
    async createRoom(@Body() body: Rooms): Promise<Rooms> {
        return this.roomsService.createRoom(body)
    }

    @Put('/add')
    async addUserToRoom(@Query('userId') userId: string, @Query('roomId') roomId: string): Promise<Rooms> {
        return this.roomsService.addUserToRoom(userId, roomId);
    }

    @Put('/remove')
    async removeUserFromRoom(@Query('userId') userId: string, @Query('roomId') roomId: string): Promise<Rooms> {
        return this.roomsService.removeUserFromRoom(userId, roomId);
    }
}
