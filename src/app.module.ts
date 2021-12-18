import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieSession from 'cookie-session';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportModule } from './report/report.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigService],
			useFactory: async (config: ConfigService) => {
				return {
					type: 'sqlite',
					database: config.get<string>('DB_NAME'),
					synchronize: true,
					autoLoadEntities: true,
				};
			},
			inject: [ConfigService],
		}),
		UserModule,
		ReportModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
			}),
		},
	],
})
export class AppModule {
	constructor(private readonly config: ConfigService) {}

	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(
				cookieSession({
					expires: new Date(Date.now() + 60 * 60 * 1000),
					keys: [this.config.get('SESSION_KEY')],
				}),
			)
			.forRoutes('*');
	}
}
