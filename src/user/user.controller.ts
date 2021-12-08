import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		return this.userService.create(body.email, body.password);
	}

	@Get('/')
	getUsers() {
		return this.userService.findAll();
	}

	@Get('/:email')
	getUsersByEmail(@Param('email') email: string) {
		return this.userService.find(email);
	}

	@Get('/:id')
	getUser(@Param('id') id: number) {
		return this.userService.findOne(id);
	}

	@Patch('/:id')
	updateUser(@Param('id') id: number, @Body() body: Partial<CreateUserDto>) {
		this.userService.update(id, body);
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: number) {
		this.userService.delete(id);
	}
}
