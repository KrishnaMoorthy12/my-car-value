/* eslint-disable @typescript-eslint/indent */
import { Expose, Transform } from 'class-transformer';
import { User } from '../../user/user.entity';
import { Report } from '../report.entity';

export class ReportDto extends Report {
	@Expose()
	id: number;

	@Expose()
	make: string;

	@Expose()
	model: string;

	@Expose()
	year: number;

	@Expose()
	mileage: number;

	@Expose()
	price: number;

	@Expose()
	lat: number;

	@Expose()
	lng: number;

	@Expose()
	@Transform(({ obj }) => ((obj as Report).user as User).id)
	userId: number;
}
