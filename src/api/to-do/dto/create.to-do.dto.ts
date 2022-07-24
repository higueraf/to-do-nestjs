import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create.user.dto';

export class CreateToDoDto {
  @IsString()
  @IsNotEmpty()
  public description: string;

  public state: string;

  user: CreateUserDto;
}
