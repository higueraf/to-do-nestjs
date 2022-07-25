import { Test, TestingModule } from '@nestjs/testing';
import { CreateToDoDto } from './dto/create.to-do.dto';
import { ToDosController } from './to-do.controller';
import { ToDoService } from './to-do.service';
import { State } from './to-do.entity';

const createTodoDto: CreateToDoDto = {
  description: 'Example1 description',
  state: State.ACTIVE,
};

describe('ToDosController', () => {
  let todosController: ToDosController;
  let todoService: ToDoService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ToDosController],
      providers: [
        ToDoService,
        {
          provide: ToDoService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((todo: CreateToDoDto) =>
                Promise.resolve({ id: '1', ...todo }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                description: 'Example1 description',
                state: State.ACTIVE,
              },
              {
                description: 'Example2 description',
                state: State.ACTIVE,
              },
            ]),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                description: 'Example1 description',
                state: State.ACTIVE,
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    todosController = app.get<ToDosController>(ToDosController);
    todoService = app.get<ToDoService>(ToDoService);
  });

  it('should be defined', () => {
    expect(todosController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a todo', async () => {
      const req = { user: { id: 1 } };
      const result = await todosController.create(req, createTodoDto);
      expect(result).toEqual({
        id: '1',
        ...createTodoDto,
      });
      expect(todoService.create).toHaveBeenCalledWith(createTodoDto);
    });
  });

  describe('findAll()', () => {
    it('should find all todos ', () => {
      const req = { user: { id: 1 } };
      todosController.findAll(req);
      expect(todoService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a todo', () => {
      expect(todosController.findOne(1)).resolves.toEqual({
        description: 'Example1 description',
        state: State.ACTIVE,
      });
      expect(todoService.findOne).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove the todo', () => {
      todosController.remove('2');
      expect(todoService.remove).toHaveBeenCalled();
    });
  });
});
