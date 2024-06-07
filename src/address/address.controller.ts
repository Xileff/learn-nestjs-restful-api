import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResponse, CreateAddressRequest } from '../model/address.model';
import { WebResponse } from '../model/web.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/contacts/:contactId/addresses')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('')
  async create(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: CreateAddressRequest,
  ): Promise<WebResponse<AddressResponse>> {
    request.contactId = contactId;
    const result = await this.addressService.create(user, request);
    return {
      data: result,
    };
  }
}
