import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Request,
  Body
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/dto/user.login-dto';
import { CreateUserDto } from '../user/dto/create.user.dto';

@Controller('auth')
export class AuthController {
  
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req): Promise<LoginUserDto> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  } 

}
