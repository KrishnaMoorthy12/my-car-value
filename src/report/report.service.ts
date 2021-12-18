import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
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

	async getEstimate(options: GetEstimateDto) {
		const query = this.repo
			.createQueryBuilder()
			.select('AVG(price)', 'price')
			.where('make = :make AND model = :model', {
				make: options.make,
				model: options.model,
			})
			.andWhere('lat - :lat BETWEEN -5 AND 5', { lat: options.lat })
			.andWhere('lng - :lng BETWEEN -5 AND 5', { lng: options.lng })
			.andWhere('year - :year BETWEEN -3 AND 3', { year: options.year })
			.andWhere('approved IS TRUE')
			.orderBy('mileage = :mileage', 'DESC')
			.setParameter('mileage', options.mileage)
			.limit(3)
			.getRawOne();

		return query;
	}
}
