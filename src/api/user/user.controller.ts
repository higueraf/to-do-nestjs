import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create.user.dto';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get()
  findAll(): Promise<IUser[]> {
    return this.service.findAll();
  }

  @Get(':id')
  public getUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.getUser(id);
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.service.createUser(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUser> {
    return this.service.update(id, createUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
