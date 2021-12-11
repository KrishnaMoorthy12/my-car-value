import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

describe('Auth Service', () => {
	let authService: AuthService;
	let fakeUsersService: Partial<UserService>;

	beforeEach(async () => {
		fakeUsersService = {
			find: () => Promise.resolve([]),
			create: (email: string, username: string, password: string) =>
				Promise.resolve({ id: 1, email, username, password }),
		};

		const module = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UserService,
					useValue: fakeUsersService,
				},
			],
		}).compile();

		authService = module.get(AuthService);
	});

	it('can create an instance of auth service', async () => {
		expect(authService).toBeDefined();
	});

	it('creates a new user with salted & hashed password', async () => {
		const user = await authService.signup('test@email.com', 'Test user', 'testpass');

		expect(user.password).not.toEqual('testpass');

		// const [salt, hash] = user.password.split('.');
		// expect(salt).toBeDefined();
		// expect(hash).toBeDefined();
	});

	it('throw if email is in use', async () => {
		fakeUsersService.find = () =>
			Promise.resolve([
				{
					id: 1,
					email: 'asdf@asdf.com',
					username: 'Some user',
					password: 'dummy',
				},
			]);
		try {
			await authService.signup('test@email.com', 'Test', 'Password');
		} catch (error) {
			expect(error).toBeDefined();
			expect(error instanceof BadRequestException).toBeTruthy();
		}
	});
});
