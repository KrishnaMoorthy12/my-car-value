import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Serialize } from 'src/interceptors/SerializeInterceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
@Serialize(UserDto)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/signup')
	createUser(@Body() body: CreateUserDto) {
		return this.userService.create(body.email, body.username, body.password);
	}

	@Get('/')
	getUsers() {
		return this.userService.findAll();
	}

	@Get('/q?')
	getUsersByEmail(@Query('email') email: string) {
		return this.userService.find(email);
	}

	@Get('/:id')
	getUser(@Param('id') id: number) {
		return this.userService.findOne(id);
	}

	@Patch('/:id')
	updateUser(@Param('id') id: number, @Body() body: Partial<CreateUserDto>) {
		return this.userService.update(id, body);
	}

	@Delete('/:id')
	deleteUser(@Param('id') id: number) {
		return this.userService.delete(id);
	}
}
