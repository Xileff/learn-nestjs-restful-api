import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Address, User } from '@prisma/client';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
  toAddressResponse,
} from '../model/address.model';
import { AddressValidation } from './address.validation';
import { ContactService } from '../contact/contact.service';

@Injectable()
export class AddressService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async create(
    user: User,
    request: CreateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.create(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const createRequest = this.validationService.validate(
      AddressValidation.CREATE,
      request,
    );

    const contact = await this.contactService.findContact(
      user.username,
      createRequest.contactId,
    );

    const address = await this.prismaService.address.create({
      data: {
        contact_id: contact.id,
        street: createRequest.street,
        city: createRequest.city,
        province: createRequest.province,
        country: createRequest.country,
        postal_code: createRequest.postalCode,
      },
    });

    return toAddressResponse(address);
  }

  async findAddress(addressId: number, contactId: number): Promise<Address> {
    const address = await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      },
    });

    if (!address) {
      throw new HttpException('Address not found', 404);
    }

    return address;
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.get(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const getRequest = this.validationService.validate(
      AddressValidation.GET,
      request,
    );

    await this.contactService.findContact(user.username, getRequest.contactId);

    const address = await this.findAddress(
      getRequest.addressId,
      getRequest.contactId,
    );

    return toAddressResponse(address);
  }

  async update(
    user: User,
    request: UpdateAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const updateRequest = this.validationService.validate(
      AddressValidation.UPDATE,
      request,
    );

    await this.contactService.findContact(
      user.username,
      updateRequest.contactId,
    );
    let address = await this.findAddress(
      updateRequest.id,
      updateRequest.contactId,
    );

    address = await this.prismaService.address.update({
      data: {
        street: updateRequest.street,
        city: updateRequest.city,
        province: updateRequest.province,
        country: updateRequest.country,
        postal_code: updateRequest.postalCode,
      },
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contactId,
      },
    });

    return toAddressResponse(address);
  }

  async remove(
    user: User,
    request: RemoveAddressRequest,
  ): Promise<AddressResponse> {
    this.logger.debug(
      `AddressService.remove(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );
    const deleteRequest = this.validationService.validate(
      AddressValidation.DELETE,
      request,
    );

    await this.contactService.findContact(
      user.username,
      deleteRequest.contactId,
    );
    let address = await this.findAddress(
      deleteRequest.addressId,
      deleteRequest.contactId,
    );

    address = await this.prismaService.address.delete({
      where: {
        id: deleteRequest.addressId,
        contact_id: deleteRequest.contactId,
      },
    });

    return toAddressResponse(address);
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    await this.contactService.findContact(user.username, contactId);

    const addresses = await this.prismaService.address.findMany({
      where: {
        contact_id: contactId,
      },
    });

    return addresses.map((address) => toAddressResponse(address));
  }
}
