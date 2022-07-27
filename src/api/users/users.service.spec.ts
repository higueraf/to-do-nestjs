import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';

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

describe('User Service', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a user', async () => {
      const oneUser = {
        name: 'name1',
        email: 'name1@to-do.com',
        isAdmin: true,
      };
      const result = await service.create({
        name: 'name1',
        email: 'name1@to-do.com',
        isAdmin: true,
        password: 'password1',
      });
      expect(result).toEqual(oneUser);
    });
  });

  describe('update()', () => {
    it('should successfully update a user', async () => {
      const oneUser = {
        name: 'name1mod',
        email: 'name1mod@to-do.com',
        isAdmin: true,
      };
      const result = await service.update(1, {
        name: 'name1mod',
        email: 'name1mod@to-do.com',
        isAdmin: true,
        password: 'password1',
      });
      expect(result).toEqual(oneUser);
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(userArray);
    });
  });

  describe('findOne()', () => {
    it('should get a single user', () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      expect(service.findOne(1)).resolves.toEqual(oneUser);
      expect(repoSpy).toBeCalledWith({ id: 1 });
    });
  });

  describe('findOne()', () => {
    it('should get a single user', () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      expect(service.findByEmail('name1mod@to-do.com')).resolves.toEqual(
        oneUser,
      );
      expect(repoSpy).toBeCalledWith({ email: 'name1mod@to-do.com' });
    });
  });

  describe('remove()', () => {
    it('should call remove with the passed value', async () => {
      const removeSpy = jest.spyOn(repository, 'delete');
      const retVal = await service.remove('2');
      expect(removeSpy).toBeCalledWith('2');
      expect(retVal).toBeUndefined();
    });
  });
});
