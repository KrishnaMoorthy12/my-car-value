import { Expose } from 'class-transformer';
import { User } from '../user.entity';

export class UserDto extends User {
	@Expose() id: number;
	@Expose() email: string;
	@Expose() username: string;
	@Expose() admin: boolean;
}
