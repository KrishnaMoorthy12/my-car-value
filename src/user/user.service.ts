import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

	async findAll(): Promise<User[]> {
		return await this.repo.find();
	}

	async create(email: string, username: string, password: string, admin: boolean): Promise<User> {
		const user = await this.repo.find({ email });
		if (user.length > 0) throw new BadRequestException('email in use');
		const newUser = this.repo.create({ email, username, password, admin });
		return await this.repo.save(newUser);
	}

	async findOne(id: number): Promise<User> {
		if (!id) return null;
		const user = await this.repo.findOne(id);
		if (!user) throw new NotFoundException('user not found');

		return user;
	}

	find(email: string): Promise<User[]> {
		if (!email) throw new BadRequestException();
		return this.repo.find({ email });
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
