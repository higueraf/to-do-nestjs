import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ToDoModule } from './to-do/to-do.module';

@Module({
  imports: [UserModule, AuthModule, ToDoModule],
})
export class ApiModule {}
