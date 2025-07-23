import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp, beforeEachTest, afterAllTests, getPrismaService } from '../integration/setup';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

/**
 * End-to-end tests for the complete task management flow
 * This tests the entire task lifecycle from creation to deletion
 */
describe('Task Management Flow (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtToken: string;
  let userId: string;
  
  const testUser = {
    email: 'taskflow@example.com',
    password: 'TaskPassword123!',
    name: 'Task Flow User',
  };

  beforeAll(async () => {
    app = await setupTestApp();
    prismaService = getPrismaService(app);
  });

  beforeEach(async () => {
    await beforeEachTest();
    
    // Register a user for task tests
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);
    
    userId = registerResponse.body.data.id;
    
    // Login to get JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });
    
    jwtToken = loginResponse.body.data.access_token;
  });

  afterAll(async () => {
    await afterAllTests();
    await app.close();
  });

  it('should complete the full task creation, update, and deletion flow', async () => {
    // Step 1: Create a new task
    const newTask = {
      title: 'E2E Flow Task',
      description: 'This is a task for e2e flow testing',
      status: TaskStatus.PENDING,
    };
    
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newTask)
      .expect(201);
    
    expect(createResponse.body).toHaveProperty('id');
    expect(createResponse.body.title).toBe(newTask.title);
    expect(createResponse.body.status).toBe(newTask.status);
    
    const taskId = createResponse.body.id;
    
    // Step 2: Retrieve the created task
    const getResponse = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(getResponse.body.id).toBe(taskId);
    expect(getResponse.body.title).toBe(newTask.title);
    
    // Step 3: Update the task
    const updateData = {
      title: 'Updated E2E Task',
      status: TaskStatus.IN_PROGRESS,
    };
    
    const updateResponse = await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(updateData)
      .expect(200);
    
    expect(updateResponse.body.id).toBe(taskId);
    expect(updateResponse.body.title).toBe(updateData.title);
    expect(updateResponse.body.status).toBe(updateData.status);
    expect(updateResponse.body.description).toBe(newTask.description); // Unchanged field
    
    // Step 4: Verify the update
    const verifyResponse = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(verifyResponse.body.title).toBe(updateData.title);
    expect(verifyResponse.body.status).toBe(updateData.status);
    
    // Step 5: Delete the task
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(204);
    
    // Step 6: Verify the task was deleted
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  it('should handle the task status transition flow', async () => {
    // Create a task with PENDING status
    const newTask = {
      title: 'Status Flow Task',
      description: 'Testing task status transitions',
      status: TaskStatus.PENDING,
    };
    
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(newTask)
      .expect(201);
    
    const taskId = createResponse.body.id;
    
    // Update to IN_PROGRESS
    await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ status: TaskStatus.IN_PROGRESS })
      .expect(200);
    
    // Verify status is IN_PROGRESS
    let verifyResponse = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(verifyResponse.body.status).toBe(TaskStatus.IN_PROGRESS);
    
    // Update to COMPLETED
    await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ status: TaskStatus.COMPLETED })
      .expect(200);
    
    // Verify status is COMPLETED
    verifyResponse = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(verifyResponse.body.status).toBe(TaskStatus.COMPLETED);
    
    // Update to CANCELLED
    await request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ status: TaskStatus.CANCELLED })
      .expect(200);
    
    // Verify status is CANCELLED
    verifyResponse = await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(verifyResponse.body.status).toBe(TaskStatus.CANCELLED);
  });
});