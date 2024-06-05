import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Logger } from 'winston';
import { Prisma, PrismaClient } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable() // Supaya bisa DI ke module lain
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, string>
  implements OnModuleInit
{
  // Extend dari PrismaClient untuk tambahin custom logger
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    // Manggil super constructor untuk bikin semua level aktivitas ditembak sebagai 'event'
    super({
      log: [
        {
          level: 'info',
          emit: 'event',
        },
        {
          level: 'warn',
          emit: 'event',
        },
        {
          level: 'error',
          emit: 'event',
        },
        {
          level: 'query',
          emit: 'event',
        },
      ],
    });
  }

  // Buat event listeners untuk logger ketika terjadi 'event'
  onModuleInit() {
    this.$on('info', (e) => {
      this.logger.info(e);
    });
    this.$on('warn', (e) => {
      this.logger.info(e);
    });
    this.$on('error', (e) => {
      this.logger.info(e);
    });
    this.$on('query', (e) => {
      this.logger.info(e);
    });
  }
}
