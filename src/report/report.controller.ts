import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/SerializeInterceptor';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportService } from './report.service';

@UseGuards(AuthGuard)
@Controller('report')
export class ReportController {
	constructor(private readonly reportService: ReportService) {}

	@Serialize(ReportDto)
	@Post('/create')
	createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
		return this.reportService.create(body, user);
	}

	@UseGuards(AdminGuard)
	@Patch('/:id')
	changeApproval(@Param('id') id: number, @Body() body: ApproveReportDto) {
		return this.reportService.approve(id, body.approved);
	}

	@Get('/estimate')
	getEstimate(@Query() query: GetEstimateDto) {
		console.log(query);
	}
}
