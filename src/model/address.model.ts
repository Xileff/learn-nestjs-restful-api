import { Address } from '@prisma/client';

export interface CreateAddressRequest {
  contactId: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postalCode: string;
}

export interface AddressResponse {
  id: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postalCode: string;
}

export function toAddressResponse(address: Address): AddressResponse {
  return {
    id: address.id,
    street: address.street,
    city: address.city,
    province: address.province,
    country: address.country,
    postalCode: address.postal_code,
  };
}
