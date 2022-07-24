import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateToDoDto } from './dto/create.to-do.dto';
import { ToDo, State } from './to-do.entity';
import { IToDo } from './to-do.interface';
import { User } from '../user/user.entity';

@Injectable()
export class ToDoService {
  constructor(
    @Inject('TODO_REPOSITORY')
    private repository: Repository<ToDo>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  public findAll(): Promise<ToDo[]> {
    try {
      return this.repository.find({ order: { createdAt: 'DESC' } });
    } catch (error) {
      return error;
    }
  }

  public getToDo(id: number): Promise<IToDo> {
    try {
      return this.repository.findOneBy({ id: id });
    } catch (error) {
      return error;
    }
  }

  async createToDo(
    createToDoDto: CreateToDoDto,
    userId: number,
  ): Promise<IToDo> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      const todo = new ToDo();
      todo.description = createToDoDto.description;
      todo.state = State[createToDoDto.state];
      todo.user = user;
      const todoCreated = await this.repository.save(todo);
      return todoCreated;
    } catch (error) {
      return error;
    }
  }

  async update(
    id: number,
    createToDoDto: CreateToDoDto,
    userId: number,
  ): Promise<IToDo> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      const todo = await this.repository.findOneBy({ id: id });
      todo.description = createToDoDto.description;
      todo.state = State[createToDoDto.state];
      todo.user = user;
      const todoUpdated = await this.repository.save(todo);
      return todoUpdated;
    } catch (error) {
      return error;
    }
  }

  async delete(id: string) {
    try {
      await this.repository.delete(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'ToDo deleted successfully',
      };
    } catch (error) {
      return error;
    }
  }
}
