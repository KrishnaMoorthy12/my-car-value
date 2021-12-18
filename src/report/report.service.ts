import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
	constructor(@InjectRepository(Report) private readonly repo: Repository<Report>) {}

	create(report: CreateReportDto, user: User) {
		const reportInstance = this.repo.create({ ...report, user });
		return this.repo.save(reportInstance);
	}

	async approve(id: number, approvalState: boolean) {
		const report = await this.repo.findOne(id);
		if (!report) new NotFoundException('Report not found');

		report.approved = approvalState;
		return this.repo.save(report);
	}
}
