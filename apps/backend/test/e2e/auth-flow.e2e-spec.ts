import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp, beforeEachTest, afterAllTests, getPrismaService } from '../integration/setup';
import { PrismaService } from '../../src/prisma/prisma.service';

/**
 * End-to-end tests for the complete authentication flow
 * This tests the entire user journey from registration to profile management
 */
describe('Authentication Flow (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  
  const testUser = {
    email: 'e2e-test@example.com',
    password: 'SecurePassword123!',
    name: 'E2E Test User',
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

  it('should complete the full registration and login flow', async () => {
    // Step 1: Register a new user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(registerResponse.body.success).toBe(true);
    expect(registerResponse.body.data).toHaveProperty('id');
    expect(registerResponse.body.data.email).toBe(testUser.email);
    
    const userId = registerResponse.body.data.id;

    // Step 2: Login with the registered user
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data).toHaveProperty('access_token');
    
    const jwtToken = loginResponse.body.data.access_token;

    // Step 3: Access protected profile endpoint
    const profileResponse = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(profileResponse.body.success).toBe(true);
    expect(profileResponse.body.data.id).toBe(userId);
    expect(profileResponse.body.data.email).toBe(testUser.email);

    // Step 4: Update profile information
    const updatedProfile = {
      name: 'Updated E2E User',
    };

    const updateResponse = await request(app.getHttpServer())
      .put('/auth/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updatedProfile)
      .expect(200);

    expect(updateResponse.body.success).toBe(true);
    expect(updateResponse.body.data.name).toBe(updatedProfile.name);

    // Step 5: Verify the updated profile
    const verifyResponse = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(verifyResponse.body.data.name).toBe(updatedProfile.name);
  });

  it('should handle the password update and re-authentication flow', async () => {
    // Step 1: Register a new user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    // Step 2: Login with the registered user
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    const jwtToken = loginResponse.body.data.access_token;

    // Step 3: Update password
    const newPassword = 'NewSecurePassword456!';
    const updatePasswordResponse = await request(app.getHttpServer())
      .put('/auth/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ password: newPassword })
      .expect(200);

    expect(updatePasswordResponse.body.success).toBe(true);

    // Step 4: Try to login with old password (should fail)
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(401);

    // Step 5: Login with new password (should succeed)
    const newLoginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: newPassword,
      })
      .expect(200);

    expect(newLoginResponse.body.success).toBe(true);
    expect(newLoginResponse.body.data).toHaveProperty('access_token');
  });

  it('should handle registration validation errors correctly', async () => {
    // Test invalid email format
    const invalidEmailResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...testUser,
        email: 'invalid-email',
      })
      .expect(400);

    expect(invalidEmailResponse.body.success).toBe(false);
    expect(invalidEmailResponse.body.message).toContain('email');

    // Test short password
    const shortPasswordResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...testUser,
        password: 'short',
      })
      .expect(400);

    expect(shortPasswordResponse.body.success).toBe(false);
    expect(shortPasswordResponse.body.message).toContain('password');

    // Test duplicate email
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    const duplicateEmailResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409);

    expect(duplicateEmailResponse.body.success).toBe(false);
    expect(duplicateEmailResponse.body.message).toContain('already exists');
  });

  it('should handle authentication edge cases', async () => {
    // Register a user first
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    // Test non-existent user login
    const nonExistentUserResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: testUser.password,
      })
      .expect(401);

    expect(nonExistentUserResponse.body.success).toBe(false);

    // Test wrong password
    const wrongPasswordResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword123!',
      })
      .expect(401);

    expect(wrongPasswordResponse.body.success).toBe(false);

    // Test invalid token format
    const invalidTokenResponse = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', 'Bearer invalid-token-format')
      .expect(401);

    expect(invalidTokenResponse.body.success).toBe(false);

    // Test missing token
    const missingTokenResponse = await request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401);

    expect(missingTokenResponse.body.success).toBe(false);
  });
});