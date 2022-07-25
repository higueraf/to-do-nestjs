import {
  Injectable,
  forwardRef,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { Inject } from '@nestjs/common/decorators';
import { LoginUserDto } from '../users/dto/user.login.dto';
import { CreateUserDto } from '../users/dto/create.user.dto';
import { Http2ServerRequest } from 'http2';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  generateJWT(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
  }

  comparePassword(newPassword: string, passwordHash: string): boolean {
    return bcrypt.compareSync(newPassword, passwordHash);
  }

  async validateUser(email: string, password: string) {
    try {
      const findUser: User = await this.userService.findByEmail(email);
      if (findUser === null) {
        return null;
      } else {
        if (!this.comparePassword(password, findUser.password)) return null;
        return findUser;
      }
    } catch (error) {
      return error;
    }
  }

  async login(loginUser: any): Promise<LoginUserDto> {
    if (loginUser === null) {
      throw new UnauthorizedException();
    }
    const accessToken: string = this.generateJWT(loginUser);
    return {
      user: {
        name: loginUser.name,
        email: loginUser.email,
        isAdmin: loginUser.isAdmin,
      },
      accessToken: accessToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
