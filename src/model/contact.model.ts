import { Contact } from '@prisma/client';

export interface CreateContactRequest {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface UpdateContactRequest {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface ContactResponse {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    firstName: contact.first_name,
    lastName: contact.last_name,
    email: contact.email,
    phone: contact.phone,
  };
}
