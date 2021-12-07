import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		return this.userService.create(body.email, body.password);
	}
}
