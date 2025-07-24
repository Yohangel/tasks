// Shared validation schemas using Zod

import { z } from 'zod';
import { TaskStatus } from '../types';
import { VALIDATION, PAGINATION } from '../constants';

// Base schemas
export const emailSchema = z
  .string()
  .email('Please provide a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(
    VALIDATION.PASSWORD_MIN_LENGTH,
    `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`
  );

export const nameSchema = z
  .string()
  .max(
    VALIDATION.USER_NAME_MAX_LENGTH,
    `Name cannot exceed ${VALIDATION.USER_NAME_MAX_LENGTH} characters`
  )
  .optional();

// Task schemas
export const taskStatusSchema = z.nativeEnum(TaskStatus);

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(
      VALIDATION.TASK_TITLE_MAX_LENGTH,
      `Title cannot exceed ${VALIDATION.TASK_TITLE_MAX_LENGTH} characters`
    ),
  description: z
    .string()
    .max(
      VALIDATION.TASK_DESCRIPTION_MAX_LENGTH,
      `Description cannot exceed ${VALIDATION.TASK_DESCRIPTION_MAX_LENGTH} characters`
    )
    .optional(),
  status: taskStatusSchema.optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(
      VALIDATION.TASK_TITLE_MAX_LENGTH,
      `Title cannot exceed ${VALIDATION.TASK_TITLE_MAX_LENGTH} characters`
    )
    .optional(),
  description: z
    .string()
    .max(
      VALIDATION.TASK_DESCRIPTION_MAX_LENGTH,
      `Description cannot exceed ${VALIDATION.TASK_DESCRIPTION_MAX_LENGTH} characters`
    )
    .optional(),
  status: taskStatusSchema.optional(),
});

export const taskFiltersSchema = z.object({
  status: taskStatusSchema.optional(),
  search: z.string().optional(),
  page: z
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .optional()
    .default(PAGINATION.DEFAULT_PAGE),
  limit: z
    .number()
    .int()
    .min(PAGINATION.MIN_LIMIT, `Limit must be at least ${PAGINATION.MIN_LIMIT}`)
    .max(PAGINATION.MAX_LIMIT, `Limit cannot exceed ${PAGINATION.MAX_LIMIT}`)
    .optional()
    .default(PAGINATION.DEFAULT_LIMIT),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// User schemas
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  name: nameSchema,
});

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

// Pagination schemas
export const paginationMetaSchema = z.object({
  total: z.number().int().min(0),
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  totalPages: z.number().int().min(0),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: z.array(dataSchema),
    meta: paginationMetaSchema,
  });

// API Response schemas
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    error: z.string().optional(),
  });

export const errorResponseSchema = z.object({
  statusCode: z.number().int(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string(),
  timestamp: z.string(),
  path: z.string(),
});

export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Entity schemas
export const baseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userSchema = baseEntitySchema.extend({
  email: z.string().email(),
  name: z.string().optional(),
});

export const taskSchema = baseEntitySchema.extend({
  title: z.string(),
  description: z.string().optional(),
  status: taskStatusSchema,
  userId: z.string(),
});

export const loginResponseSchema = z.object({
  access_token: z.string(),
  user: userSchema,
});

export const taskStatsSchema = z.object({
  total: z.number().int().min(0),
  pending: z.number().int().min(0),
  inProgress: z.number().int().min(0),
  completed: z.number().int().min(0),
  cancelled: z.number().int().min(0),
});

// Type inference helpers
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFiltersInput = z.infer<typeof taskFiltersSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PaginationMetaInput = z.infer<typeof paginationMetaSchema>;
export type ErrorResponseInput = z.infer<typeof errorResponseSchema>;
export type SuccessResponseInput = z.infer<typeof successResponseSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type LoginResponseInput = z.infer<typeof loginResponseSchema>;
export type TaskStatsInput = z.infer<typeof taskStatsSchema>;
