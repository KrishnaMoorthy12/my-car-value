import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.gaurd';
import { Serialize } from '../interceptors/SerializeInterceptor';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportService } from './report.service';

@UseGuards(AuthGuard)
@Controller('report')
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@Post('/create')
	@Serialize(ReportDto)
	createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
		return this.reportService.create(body, user);
	}
}
