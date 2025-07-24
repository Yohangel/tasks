export const databaseConfig = {
  url:
    process.env.DATABASE_URL ||
    'postgresql://postgres:password@localhost:5432/taskmanagement?schema=public',
};
