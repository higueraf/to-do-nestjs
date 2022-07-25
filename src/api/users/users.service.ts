import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const pass = password.toString();
    const salt = bcrypt.genSalt(10);
    return bcrypt.hash(pass, parseInt(salt));
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hash = await this.hashPassword(createUserDto.password);
      const user = new User();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = hash;
      user.isAdmin = createUserDto.isAdmin ? createUserDto.isAdmin : false;
      const userCreated = await this.usersRepository.save(user);
      delete userCreated.password;
      return userCreated;
    } catch (error) {
      return error;
    }
  }

  async update(id: number, createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });
      const hash = await this.hashPassword(createUserDto.password);
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = hash;
      user.isAdmin = createUserDto.isAdmin ? createUserDto.isAdmin : false;
      const userUpdated = await this.usersRepository.save(user);
      delete userUpdated.password;
      return userUpdated;
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email: email });
  }
}
