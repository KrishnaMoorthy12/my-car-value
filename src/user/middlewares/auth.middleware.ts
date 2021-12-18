import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { User } from '../user.entity';
import { UserService } from '../user.service';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace Express {
		interface Request {
			currentUser?: User;
		}
	}
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const { userId } = req.session ?? {};
		if (!userId) {
			// throw new UnauthorizedException('Session not found');
			return next();
		}

		try {
			const user = await this.userService.findOne(userId);
			req.currentUser = user;
			next();
		} catch (err) {
			req.session = null;
			throw new UnauthorizedException('User id not found, logging out');
		}
	}
}
