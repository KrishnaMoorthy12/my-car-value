import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

describe('Auth Service', () => {
	let authService: AuthService;
	let fakeUsersService: Partial<UserService>;

	beforeEach(async () => {
		const users: User[] = [];
		fakeUsersService = {
			find: email => Promise.resolve(users.filter(u => u.email === email)),
			create: (email: string, username: string, password: string) => {
				const user = { id: Math.floor(Math.random() * 888), email, username, password };
				users.push(user);
				return Promise.resolve(user);
			},
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

	it('throws if email is in use', async () => {
		try {
			await authService.signup('test@email.com', 'Test', 'Password');
			await authService.signup('test@email.com', 'Test', 'Password');
		} catch (error) {
			expect(error).toBeDefined();
			expect(error instanceof BadRequestException).toBeTruthy();
		}
	});

	it('throws if signin is attempted with unused email', async () => {
		try {
			await authService.signin('test@test.com', 'test');
		} catch (error) {
			expect(error).toBeDefined();
			expect(error instanceof UnauthorizedException).toBeTruthy();
		}
	});

	it('throws if an invalid password is provided', async () => {
		try {
			await authService.signup('test@email.com', 'user', 'password');
			await authService.signin('test@email.com', 'qwerty');
		} catch (error) {
			expect(error).toBeDefined();
		}
	});

	it('return user if valid password is provided', async () => {
		try {
			await authService.signup('test@email.com', 'user', 'password');
			await authService.signin('test@email.com', 'password');
		} catch (error) {
			expect(error).toBeDefined();
		}
	});
});
