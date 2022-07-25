import { IsString } from 'class-validator';

class UserInfo {
  readonly name: string;
  readonly email: string;
  readonly isAdmin: boolean;
}

export class LoginUserDto {
  @IsString()
  readonly user: UserInfo;

  @IsString()
  readonly accessToken: string;
}
