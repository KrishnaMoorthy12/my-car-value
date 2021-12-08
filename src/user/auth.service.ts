import bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async signup(email: string, username: string, password: string) {
		// check if email is free
		const user = await this.userService.find(email);
		if (!user) {
			throw new BadRequestException('email in use');
		}

		//hash
		const hashedPassword = await bcrypt.hash(password, 5);

		// create a user
		const newUser = this.userService.create(email, username, hashedPassword);

		return newUser;
	}

	// signin() {}
}