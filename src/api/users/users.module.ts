import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ToDo } from '../to-do/to-do.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, ToDo])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
