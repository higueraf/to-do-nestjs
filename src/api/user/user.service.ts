import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/user.login-dto';
import { User } from './user.entity';
import { IUser } from './user.interface';

@Injectable()
export class UserService {

  constructor(
    @Inject('USER_REPOSITORY')
    private repository: Repository<User>,
    private authService: AuthService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  public findAll(): Promise<IUser[]> {
    try {
      return this.repository.find();
    } catch (error) {
      return error;
    }
  }

  public getUser(id: number): Promise<IUser> {
    try {
      return this.repository.findOneBy({ id: id });
    } catch (error) {
      return error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const hash = await this.hashPassword(createUserDto.password);
      const user = new User();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = hash;
      user.isAdmin = createUserDto.isAdmin ? createUserDto.isAdmin : false;
      let userCreated = await this.repository.save(user);
      delete userCreated.password;
      return userCreated;
    } catch (error) {
      return error;
    }
  }

  async update(id: number, createUserDto: CreateUserDto): Promise<IUser> {
    try {
      const user = await this.repository.findOneBy({ id: id });
      const hash = await this.hashPassword(createUserDto.password);
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = hash;
      user.isAdmin = createUserDto.isAdmin ? createUserDto.isAdmin : false;
      let userUpdated = await this.repository.save(user);
      delete userUpdated.password;
      return userUpdated;
    } catch (error) {
      return error;
    }
  }

  async delete(id: string) {
    try {
      await this.repository.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
      };
    } catch (error) {
      return error;
    }
  }

  async findByEmail(email: string) {
    return await this.repository.findOneBy({ email: email });
  }
  
}
