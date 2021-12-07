import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ReportModule } from './report/report.module';
import { TypeOrmModule } from '@nestjs/typeorm';

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
	providers: [AppService],
})
export class AppModule {}
