import { Module } from '@nestjs/common';
import { ToDoController } from './to-do.controller';
import { ToDoService } from './to-do.service';
import { todoProviders } from './to-do.providers';
import { userProviders } from '../user/user.providers';
import { DatabaseModule } from 'src/db/db.module';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule],
  controllers: [ToDoController],
  providers: [
    ...todoProviders,
    ...userProviders,
    ToDoService,
    AuthService,
    JwtService,
    UserService,
  ],
})
export class ToDoModule {}
