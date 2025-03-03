import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { UsersController } from './users.controller';
import { List, ListSchema } from 'src/lists/schemas/list.schema';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    MongooseModule.forFeature([{
      name: List.name,
      schema: ListSchema
    }]),
  ],
  controllers: [UsersController]
})

export class UsersModule {}
