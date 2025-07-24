"use strict";
// Shared validation schemas using Zod
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskStatsSchema = exports.loginResponseSchema = exports.taskSchema = exports.userSchema = exports.baseEntitySchema = exports.successResponseSchema = exports.errorResponseSchema = exports.apiResponseSchema = exports.paginatedResponseSchema = exports.paginationMetaSchema = exports.registerSchema = exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = exports.taskFiltersSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.taskStatusSchema = exports.nameSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
const constants_1 = require("../constants");
// Base schemas
exports.emailSchema = zod_1.z
    .string()
    .email('Please provide a valid email address')
    .min(1, 'Email is required');
exports.passwordSchema = zod_1.z
    .string()
    .min(constants_1.VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${constants_1.VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
exports.nameSchema = zod_1.z
    .string()
    .max(constants_1.VALIDATION.USER_NAME_MAX_LENGTH, `Name cannot exceed ${constants_1.VALIDATION.USER_NAME_MAX_LENGTH} characters`)
    .optional();
// Task schemas
exports.taskStatusSchema = zod_1.z.nativeEnum(types_1.TaskStatus);
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Title is required')
        .max(constants_1.VALIDATION.TASK_TITLE_MAX_LENGTH, `Title cannot exceed ${constants_1.VALIDATION.TASK_TITLE_MAX_LENGTH} characters`),
    description: zod_1.z
        .string()
        .max(constants_1.VALIDATION.TASK_DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${constants_1.VALIDATION.TASK_DESCRIPTION_MAX_LENGTH} characters`)
        .optional(),
    status: exports.taskStatusSchema.optional(),
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Title cannot be empty')
        .max(constants_1.VALIDATION.TASK_TITLE_MAX_LENGTH, `Title cannot exceed ${constants_1.VALIDATION.TASK_TITLE_MAX_LENGTH} characters`)
        .optional(),
    description: zod_1.z
        .string()
        .max(constants_1.VALIDATION.TASK_DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${constants_1.VALIDATION.TASK_DESCRIPTION_MAX_LENGTH} characters`)
        .optional(),
    status: exports.taskStatusSchema.optional(),
});
exports.taskFiltersSchema = zod_1.z.object({
    status: exports.taskStatusSchema.optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z
        .number()
        .int()
        .min(1, 'Page must be at least 1')
        .optional()
        .default(constants_1.PAGINATION.DEFAULT_PAGE),
    limit: zod_1.z
        .number()
        .int()
        .min(constants_1.PAGINATION.MIN_LIMIT, `Limit must be at least ${constants_1.PAGINATION.MIN_LIMIT}`)
        .max(constants_1.PAGINATION.MAX_LIMIT, `Limit cannot exceed ${constants_1.PAGINATION.MAX_LIMIT}`)
        .optional()
        .default(constants_1.PAGINATION.DEFAULT_LIMIT),
    sortBy: zod_1.z.string().optional().default('createdAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
});
// User schemas
exports.createUserSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
    name: exports.nameSchema,
});
exports.updateUserSchema = zod_1.z.object({
    email: exports.emailSchema.optional(),
    password: exports.passwordSchema.optional(),
    name: exports.nameSchema,
});
// Auth schemas
exports.loginSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.registerSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
    name: exports.nameSchema,
});
// Pagination schemas
exports.paginationMetaSchema = zod_1.z.object({
    total: zod_1.z.number().int().min(0),
    page: zod_1.z.number().int().min(1),
    limit: zod_1.z.number().int().min(1),
    totalPages: zod_1.z.number().int().min(0),
});
const paginatedResponseSchema = (dataSchema) => zod_1.z.object({
    data: zod_1.z.array(dataSchema),
    meta: exports.paginationMetaSchema,
});
exports.paginatedResponseSchema = paginatedResponseSchema;
// API Response schemas
const apiResponseSchema = (dataSchema) => zod_1.z.object({
    success: zod_1.z.boolean(),
    data: dataSchema.optional(),
    message: zod_1.z.string().optional(),
    error: zod_1.z.string().optional(),
});
exports.apiResponseSchema = apiResponseSchema;
exports.errorResponseSchema = zod_1.z.object({
    statusCode: zod_1.z.number().int(),
    message: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
    error: zod_1.z.string(),
    timestamp: zod_1.z.string(),
    path: zod_1.z.string(),
});
exports.successResponseSchema = zod_1.z.object({
    success: zod_1.z.boolean(),
    message: zod_1.z.string(),
});
// Entity schemas
exports.baseEntitySchema = zod_1.z.object({
    id: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.userSchema = exports.baseEntitySchema.extend({
    email: zod_1.z.string().email(),
    name: zod_1.z.string().optional(),
});
exports.taskSchema = exports.baseEntitySchema.extend({
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    status: exports.taskStatusSchema,
    userId: zod_1.z.string(),
});
exports.loginResponseSchema = zod_1.z.object({
    access_token: zod_1.z.string(),
    user: exports.userSchema,
});
exports.taskStatsSchema = zod_1.z.object({
    total: zod_1.z.number().int().min(0),
    pending: zod_1.z.number().int().min(0),
    inProgress: zod_1.z.number().int().min(0),
    completed: zod_1.z.number().int().min(0),
    cancelled: zod_1.z.number().int().min(0),
});
//# sourceMappingURL=index.js.map