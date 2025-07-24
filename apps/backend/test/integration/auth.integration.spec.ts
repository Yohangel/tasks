import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp, beforeEachTest, afterAllTests, getPrismaService } from './setup';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('Authentication Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtToken: string;
  const testUser = {
    email: 'test@example.com',
    password: 'Password123!',
    name: 'Test User',
  };

  beforeAll(async () => {
    app = await setupTestApp();
    prismaService = getPrismaService(app);
  });

  beforeEach(async () => {
    await beforeEachTest();
  });

  afterAll(async () => {
    await afterAllTests();
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.name).toBe(testUser.name);
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.message).toBe('User registered successfully');

      // Verify user was created in the database
      const dbUser = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });
      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe(testUser.email);
      
      // Verify password was hashed
      const passwordMatch = await bcrypt.compare(testUser.password, dbUser!.password);
      expect(passwordMatch).toBe(true);
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should return 400 for short password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          ...testUser,
          password: 'short',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should return 409 for duplicate email', async () => {
      // First register a user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Try to register with the same email
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('access_token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.message).toBe('Login successful');

      // Save token for protected route tests
      jwtToken = response.body.data.access_token;
    });

    it('should return 401 for invalid password', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: 'wrong-password',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('GET /auth/profile', () => {
    beforeEach(async () => {
      // Register and login a user before each profile test
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      jwtToken = loginResponse.body.data.access_token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.name).toBe(testUser.name);
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.message).toBe('Profile retrieved successfully');
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('PUT /auth/profile', () => {
    beforeEach(async () => {
      // Register and login a user before each profile update test
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser);

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      jwtToken = loginResponse.body.data.access_token;
    });

    it('should update user profile successfully', async () => {
      const updatedData = {
        name: 'Updated Name',
      };

      const response = await request(app.getHttpServer())
        .put('/auth/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.message).toBe('Profile updated successfully');

      // Verify the update in the database
      const dbUser = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });
      expect(dbUser?.name).toBe(updatedData.name);
    });

    it('should update password successfully', async () => {
      const updatedData = {
        password: 'NewPassword123!',
      };

      const response = await request(app.getHttpServer())
        .put('/auth/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Profile updated successfully');

      // Verify the password was updated and hashed in the database
      const dbUser = await prismaService.user.findUnique({
        where: { email: testUser.email },
      });
      const passwordMatch = await bcrypt.compare(updatedData.password, dbUser!.password);
      expect(passwordMatch).toBe(true);

      // Verify we can login with the new password
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: updatedData.password,
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should return 409 when updating email to an existing one', async () => {
      // Create another user first
      const anotherUser = {
        email: 'another@example.com',
        password: 'Password123!',
        name: 'Another User',
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(anotherUser);

      // Try to update email to the existing one
      const updatedData = {
        email: anotherUser.email,
      };

      const response = await request(app.getHttpServer())
        .put('/auth/profile')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updatedData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should return 401 without token', async () => {
      const response = await request(app.getHttpServer())
        .put('/auth/profile')
        .send({ name: 'Updated Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });
  });
});