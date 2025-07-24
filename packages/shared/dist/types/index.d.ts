export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export interface Task extends BaseEntity {
    title: string;
    description?: string;
    status: TaskStatus;
    userId: string;
}
export interface CreateTaskData {
    title: string;
    description?: string;
    status?: TaskStatus;
}
export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: TaskStatus;
}
export interface TaskFilters {
    status?: TaskStatus;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface TaskStats {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
}
export interface User extends BaseEntity {
    email: string;
    name?: string;
}
export interface CreateUserData {
    email: string;
    password: string;
    name?: string;
}
export interface UpdateUserData {
    email?: string;
    password?: string;
    name?: string;
}
export interface LoginData {
    email: string;
    password: string;
}
export interface RegisterData {
    email: string;
    password: string;
    name?: string;
}
export interface LoginResponse {
    access_token: string;
    user: User;
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
export interface ErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
    timestamp: string;
    path: string;
}
export interface SuccessResponse {
    success: boolean;
    message: string;
}
export type SortOrder = 'asc' | 'desc';
//# sourceMappingURL=index.d.ts.map