import { hash, compare } from 'bcrypt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async signup(email: string, username: string, password: string, admin: boolean) {
		// check if email is free
		const user = await this.userService.find(email);
		if (user.length) {
			throw new BadRequestException('email in use');
		}

		//hash
		const hashedPassword = await hash(password, 5);

		// create a user
		const newUser = this.userService.create(email, username, hashedPassword, admin);

		return newUser;
	}

	async signin(email: string, password: string) {
		const [user] = await this.userService.find(email);

		if (!user || !(await compare(password, user.password))) {
			throw new UnauthorizedException('Incorrect email or password');
		}

		return user;
	}
}
