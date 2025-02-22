import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Rooms } from './rooms';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomsSchema } from './schemas/rooms.schema';

@Module({
  controllers: [RoomsController],
  providers: [Rooms, RoomsService],
  imports: [
    MongooseModule.forFeature([{ name: 'Rooms', schema: RoomsSchema}]),
  ]
})
export class RoomsModule {}
