import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

	async findAll(): Promise<User[]> {
		return await this.userRepo.find();
	}

	async create(email: string, password: string): Promise<User> {
		const newUser = this.userRepo.create({ email, password });
		return await this.userRepo.save(newUser);
	}
}
