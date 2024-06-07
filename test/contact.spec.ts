import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Logger } from 'winston';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController', () => {
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

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    afterEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to create contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          firstName: 'Felix',
          lastName: 'Savero',
          email: 'felix@example.com',
          phone: '111122223333',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe('Felix');
      expect(response.body.data.lastName).toBe('Savero');
      expect(response.body.data.email).toBe('felix@example.com');
      expect(response.body.data.phone).toBe('111122223333');
    });

    it('should reject create contact if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject create contact if unauthorized', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'salah')
        .send({
          firstName: 'Felix',
          lastName: 'Savero',
          email: 'felix@example.com',
          phone: '111122223333',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
    });

    afterEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to get contact', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${existingContact.id}`)
        .set('authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(existingContact.id);
      expect(response.body.data.firstName).toBe(existingContact.first_name);
      expect(response.body.data.lastName).toBe(existingContact.last_name);
      expect(response.body.data.email).toBe(existingContact.email);
      expect(response.body.data.phone).toBe(existingContact.phone);
    });

    it('should reject get contact if id is invalid', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${existingContact.id + 1}`)
        .set('authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject get contact if unauthorized', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${existingContact.id}`)
        .set('authorization', 'salah');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
    });

    afterEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to update contact', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${existingContact.id}`)
        .set('authorization', 'test')
        .send({
          firstName: 'updated',
          lastName: 'updated',
          email: 'updated@example.com',
          phone: '111122223333',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(existingContact.id);
      expect(response.body.data.firstName).toBe('updated');
      expect(response.body.data.lastName).toBe('updated');
      expect(response.body.data.email).toBe('updated@example.com');
      expect(response.body.data.phone).toBe('111122223333');
    });

    it('should reject update contact if not found', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${existingContact.id + 1}`)
        .set('authorization', 'test')
        .send({
          firstName: 'updated',
          lastName: 'updated',
          email: 'updated@example.com',
          phone: '111122223333',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject update contact if request is invalid', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${existingContact.id}`)
        .set('authorization', 'test')
        .send({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should reject update contact if unauthorized', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${existingContact.id}`)
        .set('authorization', 'salah')
        .send({
          firstName: 'updated',
          lastName: 'updated',
          email: 'updated@example.com',
          phone: '111122223333',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
    });

    afterEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('should be able to delete contact', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${existingContact.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);

      const checkContactResponse = await request(app.getHttpServer())
        .get(`/api/contacts/${existingContact.id}`)
        .set('Authorization', 'test');

      expect(checkContactResponse.status).toBe(404);
      expect(checkContactResponse.body.errors).toBeDefined();
    });

    it('should be reject delete contact if not found', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${existingContact.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be reject delete contact if unauthorized', async () => {
      const existingContact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .delete(`/api/contacts/${existingContact.id}`)
        .set('Authorization', 'salah');

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  });
});
