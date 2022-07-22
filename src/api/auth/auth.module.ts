import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/api/user/user.module';
import { DatabaseModule } from 'src/db/db.module';
import { userProviders } from '../user/user.providers';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports:[
        DatabaseModule,
        JwtModule,
        PassportModule,
        UserModule,
    ],
    controllers: [AuthController],
    providers: [
        ...userProviders,
        UserService, 
        AuthService, 
        LocalStrategy, 
        JwtStrategy],
    
})
export class AuthModule {}
