import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
	constructor(private readonly userService: UserService) {}

	async intercept(context: ExecutionContext, handler: CallHandler<any>) {
		const req = context.switchToHttp().getRequest();
		const { userId } = req.session || {};

		if (userId) {
			const user = await this.userService.findOne(userId);
			req.currentUser = user;
		}

		return handler.handle();
	}
}
