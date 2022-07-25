import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToDo } from './to-do.entity';
import { User } from '../users/user.entity';
import { ToDosController } from './to-do.controller';
import { ToDoService } from './to-do.service';

@Module({
  imports: [TypeOrmModule.forFeature([ToDo, User])],
  providers: [ToDoService],
  controllers: [ToDosController],
})
export class ToDosModule {}
