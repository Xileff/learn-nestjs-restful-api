import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Contact, User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
  toContactResponse,
} from '../model/contact.model';
import { Logger } from 'winston';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async create(
    user: User,
    request: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const createRequest = this.validationService.validate(
      ContactValidation.CREATE,
      request,
    );

    const contact = await this.prismaService.contact.create({
      data: {
        first_name: createRequest.firstName,
        last_name: createRequest.lastName,
        email: createRequest.email,
        phone: createRequest.phone,
        username: user.username,
      },
    });

    return toContactResponse(contact);
  }

  async findContact(username: string, id: number): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        id,
        username,
      },
    });

    if (!contact) {
      throw new HttpException('Contact not found.', 404);
    }

    return contact;
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.debug(`ContactService.get(${user}, ${contactId})`);
    const contact = await this.findContact(user.username, contactId);
    return toContactResponse(contact);
  }

  async update(
    user: User,
    request: UpdateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(`ContactService.update(${user}, ${request})`);
    const updateRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      request,
    );

    let contact = await this.findContact(user.username, updateRequest.id);

    console.info('Contact found : ');
    console.info(contact);

    contact = await this.prismaService.contact.update({
      data: {
        first_name: updateRequest.firstName,
        last_name: updateRequest.lastName,
        email: updateRequest.email,
        phone: updateRequest.phone,
      },
      where: {
        id: contact.id,
        username: contact.username,
      },
    });

    return toContactResponse(contact);
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.debug(`ContactService.remove(${contactId})`);
    let contact = await this.findContact(user.username, contactId);
    contact = await this.prismaService.contact.delete({
      where: {
        id: contact.id,
        username: contact.username,
      },
    });
    return toContactResponse(contact);
  }
}
