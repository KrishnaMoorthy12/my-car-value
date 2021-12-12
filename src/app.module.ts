import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import cookieSession from 'cookie-session';

@Module({
	imports: [
		UserModule,
		ReportModule,
		TypeOrmModule.forRoot({
			type: 'sqlite',
			database: 'db.sqlite',
			autoLoadEntities: true,
			synchronize: process.env.NODE_ENV !== 'production',
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({ whitelist: true }),
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				cookieSession({
					expires: new Date(Date.now() + 60 * 60 * 1000),
					keys: ['secret'],
				}),
			)
			.forRoutes('*');
	}
}
