import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ToDo, State } from './to-do.entity';
import { ToDoService } from './to-do.service';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

const userArray = [
  {
    name: 'name1',
    email: 'name1@to-do.com',
    isAdmin: true,
    password: 'password1',
  },
  {
    name: 'name2',
    email: 'name2@to-do.com',
    isAdmin: false,
    password: 'password2',
  },
];

const oneUser = {
  name: 'name1',
  email: 'name1@to-do.com',
  isAdmin: true,
  password: 'password1',
};

const todoArray = [
  {
    description: 'Example1 description',
    state: State.ACTIVE,
  },
  {
    description: 'Example2 description',
    state: State.ACTIVE,
  },
];

const oneToDo = {
  description: 'Example1 description',
  state: State.ACTIVE,
};

const oneToDoUdated = {
  description: 'Example1 Updated description',
  state: undefined,
  user: {
    name: 'name1',
    email: 'name1@to-do.com',
    isAdmin: true,
    password: 'password1',
  },
};
describe('User Service', () => {
  let service: ToDoService;
  let repository: Repository<ToDo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToDoService,
        {
          provide: getRepositoryToken(ToDo),
          useValue: {
            find: jest.fn().mockResolvedValue(todoArray),
            findOneBy: jest.fn().mockResolvedValue(oneToDo),
            save: jest.fn().mockResolvedValue(oneToDo),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOneBy: jest.fn().mockResolvedValue(oneUser),
            save: jest.fn().mockResolvedValue(oneUser),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ToDoService>(ToDoService);
    repository = module.get<Repository<ToDo>>(getRepositoryToken(ToDo));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a To-Do', async () => {
      const oneToDo = {
        description: 'Example1 description',
        state: State.ACTIVE,
      };
      const result = await service.create(
        {
          description: 'Example1 description',
          state: State.ACTIVE,
        },
        1,
      );
      expect(result).toEqual(oneToDo);
    });
  });

  describe('update()', () => {
    it('should successfully update a To-Do', async () => {
      const result = await service.update(
        1,
        {
          description: 'Example1 Updated description',
          state: State.ACTIVE,
        },
        1,
      );
      expect(result).toEqual(oneToDoUdated);
    });
  });

  describe('findOne()', () => {
    it('should get a single user', () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      const result = service.findOne(1);
      expect(result).resolves.toEqual(oneToDoUdated);
      expect(repoSpy).toBeCalledWith({ id: 1 });
    });
  });

  describe('remove()', () => {
    it('should call remove with the passed value', async () => {
      const removeSpy = jest.spyOn(repository, 'delete');
      const retVal = await service.remove('1');
      expect(removeSpy).toBeCalledWith('1');
      expect(retVal).toBeUndefined();
    });
  });

  /*
  error
  .createQueryBuilder('to-do')

  describe('findAll()', () => {
    it('should return an array of todos', async () => {
      const todos = await service.findAll(1);
      expect(todos).toEqual(todoArray);
    });
  });
  */
});
