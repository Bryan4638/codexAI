import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
