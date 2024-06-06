import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';
import { AuthMiddleware } from './auth.middleware';

@Global()
@Module({
  // imports : isinya config logger dan .env
  imports: [
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint({ colorize: true }),
      ),
      transports: new winston.transports.Console(),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  // providers : berisi class2 yang ada di folder common
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  // exports : menentukan provider apa saja yang boleh diakses global
  // khusus APP_FILTER : tidak perlu di-export, karena otomatis dibaca oleh AppModule
  exports: [PrismaService, ValidationService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/api/*');
  }
}
