import { Transform } from 'class-transformer';
import { IsLatitude, IsLongitude, IsNumber, IsString } from 'class-validator';
import { Report } from '../report.entity';

export class GetEstimateDto extends Report {
	@IsString() make: string;

	@IsString() model: string;

	@IsNumber() @Transform(({ value }) => +value) year: number;

	@IsNumber() @Transform(({ value }) => +value) mileage: number;

	@IsLatitude() @Transform(({ value }) => +value) lat: number;

	@IsLongitude() @Transform(({ value }) => +value) lng: number;
}
