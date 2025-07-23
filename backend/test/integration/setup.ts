import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { cleanupDatabase, disconnectDatabase } from '../database-test.config';
import { PrismaService } from '../../src/prisma/prisma.service';
import { GlobalExceptionFilter } from '../../src/common/filters/global-exception.filter';
import { ResponseInterceptor } from '../../src/common/interceptors/response.interceptor';

// Set test environment variables
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

// Global setup for all integration tests
export const setupTestApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  
  // Apply the same pipes, filters, and interceptors as in the main app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  await app.init();
  
  return app;
};

// Helper function to get the PrismaService from the app
export const getPrismaService = (app: INestApplication): PrismaService => {
  return app.get<PrismaService>(PrismaService);
};

// Clean up database before each test
export const beforeEachTest = async () => {
  await cleanupDatabase();
};

// Clean up database and disconnect after all tests
export const afterAllTests = async () => {
  await cleanupDatabase();
  await disconnectDatabase();
};