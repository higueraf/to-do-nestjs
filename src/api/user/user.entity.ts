import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ToDo } from '../to-do/to-do.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 120 })
  email: string;

  @Column({ type: 'varchar', length: 120 })
  password: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isAdmin: boolean;

  @OneToMany(() => ToDo, (todo) => todo.user) // note: we will create author property in the Photo class below
  todos: ToDo[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
