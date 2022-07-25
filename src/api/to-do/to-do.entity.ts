import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum State {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DELETED = 'deleted',
}

@Entity()
export class ToDo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  description: string;

  @Column({
    type: 'enum',
    enum: State,
    default: State.ACTIVE,
  })
  state: State;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
