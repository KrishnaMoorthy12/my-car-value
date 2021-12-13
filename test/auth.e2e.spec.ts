import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/setup-app';
import request from 'supertest';

describe('Auth Controller', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const appModule: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = appModule.createNestApplication();
		setupApp(app);
		app.init();
	});

	it('GET: /user/signup', async () => {
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
});
