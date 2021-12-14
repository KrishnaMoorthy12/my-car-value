import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';

describe('Auth Controller', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const appModule: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = appModule.createNestApplication();
		// setupApp(app);
		app.init();
	});

	it('POST: /user/signup', async () => {
		const email = 'asdfg@email.com';
		return request(app.getHttpServer())
			.post('/user/signup')
			.send({ email, username: 'asdf', password: 'pass' })
			.expect(201)
			.then(res => {
				const { id, email } = res.body;
				expect(id).toBeDefined();
				expect(email).toEqual(email);
			});
	});

	it('GET: /user/whoami', async () => {
		const [email, password] = ['asdf@email.com', 'password'];
		await request(app.getHttpServer())
			.post('/user/signup')
			.send({ email, username: 'user', password })
			.expect(201);

		const res = await request(app.getHttpServer())
			.post('/user/signin')
			.send({ email, password })
			.expect(201);

		const cookie = res.get('Set-Cookie');

		const { body } = await request(app.getHttpServer())
			.get('/user/whoami')
			.set('Cookie', cookie)
			.expect(200);

		expect(body.email).toEqual(email);
	});
});
