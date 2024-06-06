import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}
  async use(req: any, res: any, next: (error?: any) => void) {
    // pokoknya klo ada token, dia akan next()
    // hasil middleware ini akan dibaca oleh decorator Auth
    console.info(req.headers);
    const token = req.headers['authorization'] as string;
    if (token) {
      const user = await this.prismaService.user.findFirst({
        where: {
          token,
        },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  }
}
