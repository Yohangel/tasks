import { z } from 'zod';
import { TaskStatus } from '../types';
export declare const emailSchema: z.ZodString;
export declare const passwordSchema: z.ZodString;
export declare const nameSchema: z.ZodOptional<z.ZodString>;
export declare const taskStatusSchema: z.ZodNativeEnum<typeof TaskStatus>;
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof TaskStatus>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description?: string | undefined;
    status?: TaskStatus | undefined;
}, {
    title: string;
    description?: string | undefined;
    status?: TaskStatus | undefined;
}>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof TaskStatus>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    status?: TaskStatus | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    status?: TaskStatus | undefined;
}>;
export declare const taskFiltersSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<typeof TaskStatus>>;
    search: z.ZodOptional<z.ZodString>;
    page: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sortBy: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodDefault<z.ZodOptional<z.ZodEnum<["asc", "desc"]>>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    status?: TaskStatus | undefined;
    search?: string | undefined;
}, {
    status?: TaskStatus | undefined;
    search?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
}>;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    password?: string | undefined;
    name?: string | undefined;
}, {
    email?: string | undefined;
    password?: string | undefined;
    name?: string | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const paginationMetaSchema: z.ZodObject<{
    total: z.ZodNumber;
    page: z.ZodNumber;
    limit: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}>;
export declare const paginatedResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    data: z.ZodArray<T, "many">;
    meta: z.ZodObject<{
        total: z.ZodNumber;
        page: z.ZodNumber;
        limit: z.ZodNumber;
        totalPages: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }, {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
}, "strip", z.ZodTypeAny, {
    data: T["_output"][];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}, {
    data: T["_input"][];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
export declare const apiResponseSchema: <T extends z.ZodTypeAny>(dataSchema: T) => z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}>, any> extends infer T_1 ? { [k in keyof T_1]: z.objectUtil.addQuestionMarks<z.baseObjectOutputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}>, any>[k]; } : never, z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}> extends infer T_2 ? { [k_1 in keyof T_2]: z.baseObjectInputType<{
    success: z.ZodBoolean;
    data: z.ZodOptional<T>;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}>[k_1]; } : never>;
export declare const errorResponseSchema: z.ZodObject<{
    statusCode: z.ZodNumber;
    message: z.ZodUnion<[z.ZodString, z.ZodArray<z.ZodString, "many">]>;
    error: z.ZodString;
    timestamp: z.ZodString;
    path: z.ZodString;
}, "strip", z.ZodTypeAny, {
    path: string;
    message: string | string[];
    error: string;
    statusCode: number;
    timestamp: string;
}, {
    path: string;
    message: string | string[];
    error: string;
    statusCode: number;
    timestamp: string;
}>;
export declare const successResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    success: boolean;
}, {
    message: string;
    success: boolean;
}>;
export declare const baseEntitySchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    id: string;
    updatedAt: Date;
}, {
    createdAt: Date;
    id: string;
    updatedAt: Date;
}>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    email: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    createdAt: Date;
    email: string;
    id: string;
    updatedAt: Date;
    name?: string | undefined;
}, {
    createdAt: Date;
    email: string;
    id: string;
    updatedAt: Date;
    name?: string | undefined;
}>;
export declare const taskSchema: z.ZodObject<{
    id: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
} & {
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodNativeEnum<typeof TaskStatus>;
    userId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    status: TaskStatus;
    createdAt: Date;
    id: string;
    updatedAt: Date;
    userId: string;
    description?: string | undefined;
}, {
    title: string;
    status: TaskStatus;
    createdAt: Date;
    id: string;
    updatedAt: Date;
    userId: string;
    description?: string | undefined;
}>;
export declare const loginResponseSchema: z.ZodObject<{
    access_token: z.ZodString;
    user: z.ZodObject<{
        id: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    } & {
        email: z.ZodString;
        name: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        createdAt: Date;
        email: string;
        id: string;
        updatedAt: Date;
        name?: string | undefined;
    }, {
        createdAt: Date;
        email: string;
        id: string;
        updatedAt: Date;
        name?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    access_token: string;
    user: {
        createdAt: Date;
        email: string;
        id: string;
        updatedAt: Date;
        name?: string | undefined;
    };
}, {
    access_token: string;
    user: {
        createdAt: Date;
        email: string;
        id: string;
        updatedAt: Date;
        name?: string | undefined;
    };
}>;
export declare const taskStatsSchema: z.ZodObject<{
    total: z.ZodNumber;
    pending: z.ZodNumber;
    inProgress: z.ZodNumber;
    completed: z.ZodNumber;
    cancelled: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
}, {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
}>;
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
//# sourceMappingURL=index.d.ts.map