import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  RegisterUserRequest,
  UserResponse,
  toUserResponse,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user : ${JSON.stringify(request)}`);
    const registerRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    );

    const isUsernameExist = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (isUsernameExist !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        username: registerRequest.username,
        password: registerRequest.password,
        name: registerRequest.name,
      },
    });

    return toUserResponse(user);
  }
}
