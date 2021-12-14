import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '../report/report.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn() id: number;

	@Column() username: string;

	@Column() password: string;

	@Column() email: string;

	@OneToMany(() => Report, report => report.user) reports: Report[];
}
