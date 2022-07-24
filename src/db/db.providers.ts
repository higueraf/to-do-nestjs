import { DataSource } from 'typeorm';

export const dbProvider = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DB,
        entities: [__dirname + '/../api/**/*.entity{.ts,.js}'],
        synchronize: true, // DEV only, do not use on PROD!
      });

      return dataSource.initialize();
    },
  },
];
