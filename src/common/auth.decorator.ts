import {
  ExecutionContext,
  HttpException,
  createParamDecorator,
} from '@nestjs/common';

// decorator ini akan ngebaca req.user yang udah dikasih oleh AuthMiddleware
export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.info(request.user);
    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }
    return user;
  },
);
