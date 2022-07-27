import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateToDoDto } from './dto/create.to-do.dto';
import { ToDo, State } from './to-do.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ToDoService {
  constructor(
    @InjectRepository(ToDo)
    private readonly todosRepository: Repository<ToDo>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createToDoDto: CreateToDoDto, userId: number): Promise<ToDo> {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });
      const todo = new ToDo();
      todo.description = createToDoDto.description;
      todo.state = State[createToDoDto.state];
      todo.user = user;
      const todoCreated = await this.todosRepository.save(todo);
      return todoCreated;
    } catch (error) {
      return error;
    }
  }

  async update(
    id: number,
    createToDoDto: CreateToDoDto,
    userId: number,
  ): Promise<ToDo> {
    try {
      const user = await this.usersRepository.findOneBy({ id: userId });
      const todo = await this.todosRepository.findOneBy({ id: id });
      todo.description = createToDoDto.description;
      todo.state = State[createToDoDto.state];
      todo.user = user;
      const todoUpdated = await this.todosRepository.save(todo);
      return todoUpdated;
    } catch (error) {
      return error;
    }
  }

  async findAll(userId: number): Promise<ToDo[]> {
    const todos = await this.todosRepository
      .createQueryBuilder('to-do')
      .where('to-do.userId = :userId', { userId: userId })
      .orderBy('to-do.createdAt', 'DESC')
      .getMany();
    return todos;
  }

  findOne(id: number): Promise<ToDo> {
    return this.todosRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.todosRepository.delete(id);
  }
}
