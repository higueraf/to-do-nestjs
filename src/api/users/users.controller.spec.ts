import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create.user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const createUserDto: CreateUserDto = {
  name: 'name1',
  email: 'name1@to-do.com',
  isAdmin: true,
  password: 'password1',
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((user: CreateUserDto) =>
                Promise.resolve({ id: '1', ...user }),
              ),
            findAll: jest.fn().mockResolvedValue([
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
            ]),
            findOne: jest.fn().mockImplementation((id: number) =>
              Promise.resolve({
                name: 'name1',
                email: 'name1@to-do.com',
                isAdmin: true,
                password: 'password1',
                id,
              }),
            ),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
    usersService = app.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a user', () => {
      usersController.create(createUserDto);
      expect(usersController.create(createUserDto)).resolves.toEqual({
        id: '1',
        ...createUserDto,
      });
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll()', () => {
    it('should find all users ', () => {
      usersController.findAll();
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a user', () => {
      expect(usersController.findOne(1)).resolves.toEqual({
        name: 'name1',
        email: 'name1@to-do.com',
        isAdmin: true,
        password: 'password1',
        id: 1,
      });
      expect(usersService.findOne).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove the user', () => {
      usersController.remove('2');
      expect(usersService.remove).toHaveBeenCalled();
    });
  });
});
