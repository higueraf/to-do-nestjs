import { IsNotEmpty, IsString } from 'class-validator';

export class CreateToDoDto {
  @IsString()
  @IsNotEmpty()
  public description: string;
  public state: string;
}
