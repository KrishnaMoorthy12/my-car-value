import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Session,
	UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.gaurd';
import { Serialize } from 'src/interceptors/SerializeInterceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { Credentials } from './dtos/credentials.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@Serialize(UserDto)
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {}

	private setSession(session: any, user?: User) {
		Object.assign(session, { userId: user?.id ?? null });
	}

	@Get('/whoami')
	@UseGuards(AuthGuard)
	whoami(@CurrentUser() user: User) {
		return user;
	}

	@Post('/signup')
	async createUser(@Body() body: CreateUserDto, @Session() session) {
		const user = await this.authService.signup(body.email, body.username, body.password);
		this.setSession(session, user);
		return user;
	}

	@Post('/signin')
	async signin(@Body() body: Credentials, @Session() session) {
		const user = await this.authService.signin(body.email, body.password);
		this.setSession(session, user);
		return user;
	}

	@Post('/signout')
	signout(@Session() session) {
		this.setSession(session, null);
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
