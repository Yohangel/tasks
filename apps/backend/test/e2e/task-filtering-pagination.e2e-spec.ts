import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp, beforeEachTest, afterAllTests, getPrismaService } from '../integration/setup';
import { PrismaService } from '../../src/prisma/prisma.service';
import { TaskStatus } from '@prisma/client';

/**
 * End-to-end tests for task filtering and pagination
 * This tests the search, filter, and pagination capabilities of the task API
 */
describe('Task Filtering and Pagination (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtToken: string;
  let userId: string;
  
  const testUser = {
    email: 'filter-test@example.com',
    password: 'FilterPassword123!',
    name: 'Filter Test User',
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
    
    // Create a set of tasks with different statuses and titles for filtering tests
    await prismaService.task.createMany({
      data: [
        {
          title: 'Project Planning',
          description: 'Plan the new project phases',
          status: TaskStatus.PENDING,
          userId,
        },
        {
          title: 'Design Implementation',
          description: 'Implement the new design system',
          status: TaskStatus.IN_PROGRESS,
          userId,
        },
        {
          title: 'Bug Fixing',
          description: 'Fix reported bugs in the system',
          status: TaskStatus.IN_PROGRESS,
          userId,
        },
        {
          title: 'Documentation',
          description: 'Write project documentation',
          status: TaskStatus.COMPLETED,
          userId,
        },
        {
          title: 'Feature Planning',
          description: 'Plan new features for next release',
          status: TaskStatus.PENDING,
          userId,
        },
        {
          title: 'Code Review',
          description: 'Review pull requests',
          status: TaskStatus.COMPLETED,
          userId,
        },
        {
          title: 'Meeting Preparation',
          description: 'Prepare for client meeting',
          status: TaskStatus.CANCELLED,
          userId,
        },
        {
          title: 'Project Planning 2',
          description: 'Plan the second phase',
          status: TaskStatus.PENDING,
          userId,
        },
        {
          title: 'Design Review',
          description: 'Review design implementation',
          status: TaskStatus.IN_PROGRESS,
          userId,
        },
        {
          title: 'Testing',
          description: 'Test new features',
          status: TaskStatus.PENDING,
          userId,
        },
        {
          title: 'Deployment',
          description: 'Deploy to production',
          status: TaskStatus.COMPLETED,
          userId,
        },
        {
          title: 'Feedback Collection',
          description: 'Collect user feedback',
          status: TaskStatus.COMPLETED,
          userId,
        },
      ],
    });
  });

  afterAll(async () => {
    await afterAllTests();
    await app.close();
  });

  it('should filter tasks by status', async () => {
    // Filter by PENDING status
    let response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ status: TaskStatus.PENDING })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(4); // 4 PENDING tasks
    expect(response.body.data.every(task => task.status === TaskStatus.PENDING)).toBe(true);
    
    // Filter by IN_PROGRESS status
    response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ status: TaskStatus.IN_PROGRESS })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(3); // 3 IN_PROGRESS tasks
    expect(response.body.data.every(task => task.status === TaskStatus.IN_PROGRESS)).toBe(true);
    
    // Filter by COMPLETED status
    response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ status: TaskStatus.COMPLETED })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(4); // 4 COMPLETED tasks
    expect(response.body.data.every(task => task.status === TaskStatus.COMPLETED)).toBe(true);
    
    // Filter by CANCELLED status
    response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ status: TaskStatus.CANCELLED })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(1); // 1 CANCELLED task
    expect(response.body.data.every(task => task.status === TaskStatus.CANCELLED)).toBe(true);
  });

  it('should search tasks by title and description', async () => {
    // Search by title keyword "Planning"
    let response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ search: 'Planning' })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(3); // 3 tasks with "Planning" in title
    expect(response.body.data.every(task => task.title.includes('Planning') || task.description.includes('Planning'))).toBe(true);
    
    // Search by title keyword "Design"
    response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ search: 'Design' })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(2); // 2 tasks with "Design" in title
    expect(response.body.data.every(task => task.title.includes('Design') || task.description.includes('Design'))).toBe(true);
    
    // Search by description keyword "features"
    response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ search: 'features' })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(2); // 2 tasks with "features" in description
    expect(response.body.data.every(task => task.title.includes('features') || task.description.includes('features'))).toBe(true);
  });

  it('should combine status filter and search', async () => {
    // Search for "Planning" tasks with PENDING status
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ 
        search: 'Planning',
        status: TaskStatus.PENDING
      })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(2); // 2 PENDING tasks with "Planning" in title/description
    expect(response.body.data.every(task => task.status === TaskStatus.PENDING)).toBe(true);
    expect(response.body.data.every(task => task.title.includes('Planning') || task.description.includes('Planning'))).toBe(true);
  });

  it('should paginate tasks correctly', async () => {
    // Get first page with 5 items
    let response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ page: 1, limit: 5 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(5);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(5);
    expect(response.body.meta.total).toBe(12); // Total 12 tasks
    expect(response.body.meta.totalPages).toBe(3); // 3 pages with 5 items per page (last page has 2)
    
    // Get second page with 5 items
    response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ page: 2, limit: 5 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(5);
    expect(response.body.meta.page).toBe(2);
    
    // Get third page with remaining 2 items
    response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ page: 3, limit: 5 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(2); // Last page has only 2 items
    expect(response.body.meta.page).toBe(3);
  });

  it('should handle pagination edge cases', async () => {
    // Request page beyond available data
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ page: 10, limit: 5 })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(0); // No data on page 10
    expect(response.body.meta.page).toBe(10);
    expect(response.body.meta.total).toBe(12);
    expect(response.body.meta.totalPages).toBe(3);
  });

  it('should combine pagination with filtering and searching', async () => {
    // Get first page of PENDING tasks with 2 items per page
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .query({ 
        status: TaskStatus.PENDING,
        page: 1,
        limit: 2
      })
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);
    
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data.every(task => task.status === TaskStatus.PENDING)).toBe(true);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(2);
    expect(response.body.meta.total).toBe(4); // 4 PENDING tasks total
    expect(response.body.meta.totalPages).toBe(2); // 2 pages with 2 items per page
  });
});