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
// sebenarnya ini cuma jadi perantara antara controller dan service untuk ngebaca req.user
// kalo di express.js, object request (req) bener2 dikasih controller ke service. sehingga service akan baca semuanya : req.headers, req.body, dan req.user
// kalo di sini, service cuma dapat req.body dari controller, makanya req.user perlu dibaca dengan decorator
