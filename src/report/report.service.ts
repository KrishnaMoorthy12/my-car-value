import { Injectable } from '@nestjs/common';
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
}
