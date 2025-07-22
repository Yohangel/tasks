import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
    },
  });

  // Create test tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Complete project setup',
        description: 'Set up the initial project structure and dependencies',
        status: 'COMPLETED',
        userId: user1.id,
      },
      {
        title: 'Implement authentication',
        description: 'Add JWT-based authentication system',
        status: 'IN_PROGRESS',
        userId: user1.id,
      },
      {
        title: 'Write unit tests',
        description: 'Create comprehensive unit tests for all services',
        status: 'PENDING',
        userId: user1.id,
      },
      {
        title: 'Design database schema',
        description: 'Create and optimize database schema',
        status: 'COMPLETED',
        userId: user2.id,
      },
      {
        title: 'API documentation',
        description: 'Document all API endpoints with Swagger',
        status: 'PENDING',
        userId: user2.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Created users: ${user1.email}, ${user2.email}`);
  console.log('📝 Created 5 sample tasks');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });