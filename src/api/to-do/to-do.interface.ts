import { IUser } from '../user/user.interface';

export interface IToDo {
  id: number;
  description: string;
  state: string;
  user: IUser;
}
