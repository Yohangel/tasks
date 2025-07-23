import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp, beforeEachTest, afterAllTests, getPrismaService } from './setup';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

describe('Tasks Integration Tests', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtToken: string;
  let userId: string;
  let taskId: string;

  const testUser = {
    email: 'taskuser@example.com',
    password: 'Password123!',
    name: 'Task User',
  };

  const testTask = {
    title: 'Test Task',
    description: 'This is a test task description',
    status: TaskStatus.PENDING,
  };

  beforeAll(async () => {
    app = await setupTestApp();
    prismaService = getPrismaService(app);
  });

  beforeEach(async () => {
    await beforeEachTest();
    
    // Register a user
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

  describe('POST /tasks', () => {
    it('should create a task successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(testTask)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(testTask.title);
      expect(response.body.description).toBe(testTask.description);
      expect(response.body.status).toBe(testTask.status);
      expect(response.body.userId).toBe(userId);
      
      // Save task ID for later tests
      taskId = response.body.id;
      
      // Verify task was created in the database
      const dbTask = await prismaService.task.findUnique({
        where: { id: taskId },
      });
      expect(dbTask).toBeDefined();
      expect(dbTask?.title).toBe(testTask.title);
    });

    it('should create a task with default status when not provided', async () => {
      const taskWithoutStatus = {
        title: 'Task without status',
        description: 'This task has no status specified',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(taskWithoutStatus)
        .expect(201);

      expect(response.body.status).toBe(TaskStatus.PENDING);
    });

    it('should return 400 for task without title', async () => {
      const invalidTask = {
        description: 'This task has no title',
      };

      const response = await request(app.getHttpServer())
        .post('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidTask)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('title');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/tasks')
        .send(testTask)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('GET /tasks', () => {
    beforeEach(async () => {
      // Create some tasks for the user
      await prismaService.task.createMany({
        data: [
          {
            title: 'Task 1',
            description: 'Description 1',
            status: TaskStatus.PENDING,
            userId,
          },
          {
            title: 'Task 2',
            description: 'Description 2',
            status: TaskStatus.IN_PROGRESS,
            userId,
          },
          {
            title: 'Task 3',
            description: 'Description 3',
            status: TaskStatus.COMPLETED,
            userId,
          },
        ],
      });
    });

    it('should get all tasks for the user', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(3);
      expect(response.body.meta.total).toBe(3);
      expect(response.body.meta.page).toBe(1);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .query({ status: TaskStatus.PENDING })
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].status).toBe(TaskStatus.PENDING);
    });

    it('should search tasks by title', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .query({ search: 'Task 2' })
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title).toBe('Task 2');
    });

    it('should paginate tasks', async () => {
      // Create more tasks to test pagination
      const tasksToCreate = [];
      for (let i = 4; i <= 15; i++) {
        tasksToCreate.push({
          title: `Task ${i}`,
          description: `Description ${i}`,
          status: TaskStatus.PENDING,
          userId,
        });
      }
      
      await prismaService.task.createMany({
        data: tasksToCreate,
      });

      const response = await request(app.getHttpServer())
        .get('/tasks')
        .query({ page: 2, limit: 5 })
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(5);
      expect(response.body.meta.page).toBe(2);
      expect(response.body.meta.limit).toBe(5);
      expect(response.body.meta.total).toBe(15);
      expect(response.body.meta.totalPages).toBe(3);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('GET /tasks/:id', () => {
    beforeEach(async () => {
      // Create a task for the user
      const task = await prismaService.task.create({
        data: {
          title: 'Get Task Test',
          description: 'Task to be retrieved by ID',
          status: TaskStatus.PENDING,
          userId,
        },
      });
      
      taskId = task.id;
      
      // Create a task for another user
      const anotherUser = await prismaService.user.create({
        data: {
          email: 'another@example.com',
          password: 'hashedpassword',
          name: 'Another User',
        },
      });
      
      await prismaService.task.create({
        data: {
          title: 'Another User Task',
          description: 'This task belongs to another user',
          status: TaskStatus.PENDING,
          userId: anotherUser.id,
        },
      });
    });

    it('should get a task by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Get Task Test');
      expect(response.body.userId).toBe(userId);
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = 'non-existent-id';
      
      const response = await request(app.getHttpServer())
        .get(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 403 when accessing another user\'s task', async () => {
      // Find a task that belongs to another user
      const anotherUserTask = await prismaService.task.findFirst({
        where: {
          title: 'Another User Task',
        },
      });
      
      const response = await request(app.getHttpServer())
        .get(`/tasks/${anotherUserTask?.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('forbidden');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tasks/${taskId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('PUT /tasks/:id', () => {
    beforeEach(async () => {
      // Create a task for the user
      const task = await prismaService.task.create({
        data: {
          title: 'Update Task Test',
          description: 'Task to be updated',
          status: TaskStatus.PENDING,
          userId,
        },
      });
      
      taskId = task.id;
    });

    it('should update a task successfully', async () => {
      const updateData = {
        title: 'Updated Task Title',
        description: 'Updated task description',
        status: TaskStatus.IN_PROGRESS,
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.status).toBe(updateData.status);
      
      // Verify the update in the database
      const dbTask = await prismaService.task.findUnique({
        where: { id: taskId },
      });
      expect(dbTask?.title).toBe(updateData.title);
      expect(dbTask?.status).toBe(updateData.status);
    });

    it('should update only provided fields', async () => {
      const updateData = {
        status: TaskStatus.COMPLETED,
      };

      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(taskId);
      expect(response.body.title).toBe('Update Task Test'); // Original title
      expect(response.body.description).toBe('Task to be updated'); // Original description
      expect(response.body.status).toBe(updateData.status); // Updated status
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = 'non-existent-id';
      
      const response = await request(app.getHttpServer())
        .put(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer())
        .put(`/tasks/${taskId}`)
        .send({ title: 'Updated Title' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('DELETE /tasks/:id', () => {
    beforeEach(async () => {
      // Create a task for the user
      const task = await prismaService.task.create({
        data: {
          title: 'Delete Task Test',
          description: 'Task to be deleted',
          status: TaskStatus.PENDING,
          userId,
        },
      });
      
      taskId = task.id;
    });

    it('should delete a task successfully', async () => {
      await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(204);

      // Verify the task was deleted from the database
      const dbTask = await prismaService.task.findUnique({
        where: { id: taskId },
      });
      expect(dbTask).toBeNull();
    });

    it('should return 404 for non-existent task', async () => {
      const nonExistentId = 'non-existent-id';
      
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('should return 403 when deleting another user\'s task', async () => {
      // Create a task for another user
      const anotherUser = await prismaService.user.create({
        data: {
          email: 'another-delete@example.com',
          password: 'hashedpassword',
          name: 'Another Delete User',
        },
      });
      
      const anotherUserTask = await prismaService.task.create({
        data: {
          title: 'Another User Delete Task',
          description: 'This task belongs to another user',
          status: TaskStatus.PENDING,
          userId: anotherUser.id,
        },
      });
      
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${anotherUserTask.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('forbidden');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/tasks/${taskId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });
  });

  describe('GET /tasks/stats', () => {
    beforeEach(async () => {
      // Create tasks with different statuses
      await prismaService.task.createMany({
        data: [
          {
            title: 'Pending Task 1',
            description: 'Pending task description',
            status: TaskStatus.PENDING,
            userId,
          },
          {
            title: 'Pending Task 2',
            description: 'Pending task description',
            status: TaskStatus.PENDING,
            userId,
          },
          {
            title: 'In Progress Task',
            description: 'In progress task description',
            status: TaskStatus.IN_PROGRESS,
            userId,
          },
          {
            title: 'Completed Task',
            description: 'Completed task description',
            status: TaskStatus.COMPLETED,
            userId,
          },
        ],
      });
    });

    it('should get task statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks/stats')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('byStatus');
      expect(response.body.total).toBe(4);
      expect(response.body.byStatus.PENDING).toBe(2);
      expect(response.body.byStatus.IN_PROGRESS).toBe(1);
      expect(response.body.byStatus.COMPLETED).toBe(1);
      expect(response.body.byStatus.CANCELLED).toBe(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app.getHttpServer())
        .get('/tasks/stats')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Unauthorized');
    });
  });
});