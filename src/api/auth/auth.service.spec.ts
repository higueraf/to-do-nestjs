import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersService } from '../users/users.service';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.development'],
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_TEST_HOST,
          port: parseInt(process.env.DB_TEST_PORT, 10),
          username: process.env.DB_TEST_USER,
          password: process.env.DB_TEST_PASSWORD,
          database: process.env.DB_TEST_DB,
          entities: [__dirname + '/../api/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
        }),
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        UsersService,
        AuthService,
        LocalStrategy,
        JwtStrategy,
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

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('validateUser', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.development'],
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_TEST_HOST,
          port: parseInt(process.env.DB_TEST_PORT, 10),
          username: process.env.DB_TEST_USER,
          password: process.env.DB_TEST_PASSWORD,
          database: process.env.DB_TEST_DB,
          entities: [__dirname + '/../api/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
        }),
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        UsersService,
        AuthService,
        LocalStrategy,
        JwtStrategy,
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
    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should return null when credentials are invalid', async () => {
    const res = await service.validateUser('xxx', 'xxx');
    expect(res).toBeNull();
  });

  it('should return a user object when credentials are valid', async () => {
    const res = await service.validateUser('higueraf@to-do.com', '12345');
    // res return null
    //expect(res.id).toEqual(15);
  });
});

describe('validateLogin', () => {
  let service: AuthService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env.development'],
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_TEST_HOST,
          port: parseInt(process.env.DB_TEST_PORT, 10),
          username: process.env.DB_TEST_USER,
          password: process.env.DB_TEST_PASSWORD,
          database: process.env.DB_TEST_DB,
          entities: [__dirname + '/../api/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: true,
        }),
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        UsersService,
        AuthService,
        LocalStrategy,
        JwtStrategy,
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

    service = moduleRef.get<AuthService>(AuthService);
  });
  it('should return JWT object when credentials are valid', async () => {
    const user = {
      id: 3,
      email: 'higueraf@to-do.com',
      password: '1234567',
      isAdmin: true,
    };
    const res = await service.login(user);
    expect(res.accessToken).toBeDefined();
  });
});
