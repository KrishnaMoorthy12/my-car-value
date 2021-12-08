import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

	async findAll(): Promise<User[]> {
		return await this.repo.find();
	}

	async create(email: string, username: string, password: string): Promise<User> {
		const newUser = this.repo.create({ email, username, password });
		return await this.repo.save(newUser);
	}

	async findOne(id: number): Promise<User> {
		const user = await this.repo.findOne(id);
		if (!user) throw new NotFoundException('user not found');

		return user;
	}

	async find(email: string): Promise<User[]> {
		const user = await this.repo.find({ email });
		if (!user) throw new NotFoundException('user(s) not found');

		return user;
	}

	async update(id: number, attrs: Partial<User>) {
		// const res = await this.repo.update(id, attrs);
		// if (res.affected === 0) throw new NotFoundException('user not found');
		const user = await this.findOne(id);
		Object.assign(user, attrs);
		return this.repo.save(user);
	}

	async delete(id: number) {
		// const res = await this.repo.delete(id);
		// if (res.affected === 0) throw new NotFoundException('user not found');
		const user = await this.findOne(id);
		return this.repo.remove(user);
	}
}
