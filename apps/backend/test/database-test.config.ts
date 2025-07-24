import { PrismaClient } from '@prisma/client';

// Create a singleton PrismaClient for testing with a unique database URL
const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';

const prismaTestClient = new PrismaClient({
  datasources: {
    db: {
      url: testDatabaseUrl,
    },
  },
});

export const getTestPrismaClient = () => prismaTestClient;

// Helper function to clean up the database between tests
export const cleanupDatabase = async () => {
  try {
    // Delete all data in reverse order of dependencies
    await prismaTestClient.task.deleteMany({});
    await prismaTestClient.user.deleteMany({});
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
};

// Helper function to disconnect the client when tests are done
export const disconnectDatabase = async () => {
  await prismaTestClient.$disconnect();
};