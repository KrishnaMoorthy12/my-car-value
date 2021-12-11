import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('User Controller', () => {
	let authService: Partial<AuthService>;
	let userService: Partial<UserService>;

	let controller: UserController;

	beforeEach(async () => {
		authService = {};

		userService = {
			findOne: id =>
				Promise.resolve({
					id,
					email: 'test@email.com',
					username: 'name',
					password: 'test',
				}),
			find: (email: string) =>
				Promise.resolve([{ id: 1, email, username: 'user', password: 'password' }]),
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{ provide: AuthService, useValue: authService },
				{ provide: UserService, useValue: userService },
			],
		}).compile();
		controller = module.get<UserController>(UserController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('findAllUsers returns a list of users w/ given email', async () => {
		const users = await controller.getUsersByEmail('test@test.com');
		expect(users.length).toBe(1);
		expect(users[0].email).toEqual('test@test.com');
	});

	it('findUser returns a single user with given id', async () => {
		const user = await controller.getUser(1);
		expect(user).toBeDefined();
		expect(user.id).toEqual(1);
	});

	it('findUser throws if a user w/ given id is not found', async () => {
		userService.find = () => null;

		try {
			await controller.getUser(1);
		} catch (err) {
			expect(err).toBeDefined();
		}
	});
});
