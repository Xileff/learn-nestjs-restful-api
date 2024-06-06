import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
  toUserResponse,
} from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    // Dependency Injection (DI) dari CommonModule yang bersifat @Global
    private validationService: ValidationService,
    private prismaService: PrismaService,
    // Logger ambil dari NestApplication di main.ts
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.register(${JSON.stringify(request)})`);
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

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Invalid username or password', 401);
    }

    const isPasswordMatch = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException('Invalid username or password', 401);
    }

    user = await this.prismaService.user.update({
      data: {
        token: uuid(),
      },
      where: {
        username: user.username,
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    this.logger.debug(`UserService.get(${JSON.stringify(user)})`);
    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const updateRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      data: {
        name: user.name,
        password: user.password,
      },
      where: {
        username: user.username,
      },
    });

    return toUserResponse(updatedUser);
  }

  async logout(user: User) {
    await this.prismaService.user.update({
      data: {
        token: null,
      },
      where: {
        username: user.username,
      },
    });
  }
}
