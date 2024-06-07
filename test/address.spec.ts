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
});
