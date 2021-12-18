import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { User } from '../user.entity';

export class CreateUserDto extends User {
	@IsEmail() email: string;
	@IsString() username: string;
	@IsString() password: string;
	@IsBoolean() admin: boolean;
}
