import { Injectable, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/api/user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/api/user/user.service';
import { Inject } from '@nestjs/common/decorators';
import { LoginUserDto } from '../user/dto/user.login-dto';
import { CreateUserDto } from '../user/dto/create.user.dto';


@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  generateJWT(user: User) {
    const payload = {
      email: user.email,
      sub: user.id
    };
    return this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET
    });
  }
  
  comparePassword(newPassword: string, passwordHash: string): boolean {
    return bcrypt.compareSync(newPassword, passwordHash);
  }

  async validateUser(email: string, password: string): Promise<User> {
    try {
      const findUser: User = await this.userService.findByEmail(email);
      if (!this.comparePassword(password, findUser.password)) return null;
      return findUser;
    } catch (error) {
      return(error);
    }
  }

  async login(loginUser: User): Promise<LoginUserDto> {
    const accessToken: string = this.generateJWT(loginUser);
    return  {
      user: {
        name: loginUser.name,
        email: loginUser.email,
        isAdmin: loginUser.isAdmin,
      },
      accessToken: accessToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
