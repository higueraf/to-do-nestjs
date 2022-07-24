import { DataSource } from 'typeorm';
import { ToDo } from './to-do.entity';

export const todoProviders = [
  {
    provide: 'TODO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ToDo),
    inject: ['DATA_SOURCE'],
  },
];
