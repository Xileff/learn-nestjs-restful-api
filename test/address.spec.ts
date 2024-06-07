import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('AddressController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule], // Mengambil TestModule
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService); // Mengambil TestService dari TestModule
  });

  describe('POST /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
    });

    afterEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to create address', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${existingContact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postalCode: '11223',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe('test street');
      expect(response.body.data.city).toBe('test city');
      expect(response.body.data.province).toBe('test province');
      expect(response.body.data.country).toBe('test country');
      expect(response.body.data.postalCode).toBe('11223');
    });

    it('should be able to create address without optional data', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${existingContact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: undefined,
          city: undefined,
          province: undefined,
          country: 'test country',
          postalCode: '11223',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.street).toBe(null);
      expect(response.body.data.city).toBe(null);
      expect(response.body.data.province).toBe(null);
      expect(response.body.data.country).toBe('test country');
      expect(response.body.data.postalCode).toBe('11223');
    });

    it('should reject create address if request is invalid', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${existingContact.id}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: '',
          postalCode: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject create address if contact is not found', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${existingContact.id + 1}/addresses`)
        .set('Authorization', 'test')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postalCode: '11223',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject create address if unauthorized', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .post(`/api/contacts/${existingContact.id}/addresses`)
        .set('Authorization', 'salah')
        .send({
          street: 'test street',
          city: 'test city',
          province: 'test province',
          country: 'test country',
          postalCode: '11223',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    afterEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to get address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(address.id);
      expect(response.body.data.street).toBe(address.street);
      expect(response.body.data.city).toBe(address.city);
      expect(response.body.data.province).toBe(address.province);
      expect(response.body.data.country).toBe(address.country);
      expect(response.body.data.postalCode).toBe(address.postal_code);
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if unauthorized', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'salah');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    afterEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to update address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'test jalan',
          city: 'test kota',
          province: 'test provinsi',
          country: 'test negara',
          postalCode: '3332221',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();

      const updatedAddress = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test');

      expect(updatedAddress.body.data.id).toBe(address.id);
      expect(updatedAddress.body.data.street).toBe('test jalan');
      expect(updatedAddress.body.data.city).toBe('test kota');
      expect(updatedAddress.body.data.province).toBe('test provinsi');
      expect(updatedAddress.body.data.country).toBe('test negara');
      expect(updatedAddress.body.data.postalCode).toBe('3332221');
    });

    it('should be able to reject update if request is invalid', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: '',
          city: '',
          province: '',
          country: '',
          postalCode: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to reject update if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test')
        .send({
          street: 'test jalan',
          city: 'test kota',
          province: 'test provinsi',
          country: 'test negara',
          postalCode: '3332221',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to reject update if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test')
        .send({
          street: 'test jalan',
          city: 'test kota',
          province: 'test provinsi',
          country: 'test negara',
          postalCode: '3332221',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to reject update if unauthorized', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'salah')
        .send({
          street: 'test jalan',
          city: 'test kota',
          province: 'test provinsi',
          country: 'test negara',
          postalCode: '3332221',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/contacts/:contactId/addresses/:addressId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    afterEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to remove address', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const deletedAddress = await testService.getAddress();
      expect(deletedAddress).toBeNull();
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if address is not found', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if unauthorized', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
        .set('Authorization', 'salah');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/contacts/:contactId/addresses', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
      await testService.createAddress();
    });

    afterEach(async () => {
      await testService.deleteAddress();
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to list addresses', async () => {
      const contact = await testService.getContact();
      const address = await testService.getAddress();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}/addresses`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(address.id);
      expect(response.body.data[0].street).toBe(address.street);
      expect(response.body.data[0].city).toBe(address.city);
      expect(response.body.data[0].province).toBe(address.province);
      expect(response.body.data[0].country).toBe(address.country);
      expect(response.body.data[0].postalCode).toBe(address.postal_code);
    });

    it('should be rejected if contact is not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}/addresses`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  });
});
