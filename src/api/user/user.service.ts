import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';
import { IUser } from './user.interface';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

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
      const user = new User();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
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
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
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
  
}
