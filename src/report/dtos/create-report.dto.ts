/* eslint-disable @typescript-eslint/indent */
import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from 'class-validator';
import { Report } from '../report.entity';

export class CreateReportDto extends Report {
	@IsString() make: string;

	@IsNumber() @Min(10) @Max(1_00_000) price: number;

	@IsString() model: string;

	@IsNumber()
	@Min(1930)
	@Max(2030)
	year: number;

	@IsNumber()
	@Min(0)
	@Max(1_00_000)
	mileage: number;

	@IsNumber() @IsLatitude() lat: number;
	@IsNumber() @IsLongitude() lng: number;
}
