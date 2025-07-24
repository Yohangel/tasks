"use strict";
// Shared constants
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGEX = exports.ENVIRONMENTS = exports.DATE_FORMATS = exports.LANGUAGES = exports.THEMES = exports.STORAGE_KEYS = exports.SUCCESS_MESSAGES = exports.ERROR_MESSAGES = exports.TASK_DEFAULTS = exports.VALIDATION = exports.PAGINATION = exports.HTTP_STATUS = exports.API_ENDPOINTS = void 0;
// API Constants
exports.API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
    },
    TASKS: {
        BASE: '/tasks',
        STATS: '/tasks/stats',
    },
    USERS: {
        BASE: '/users',
        PROFILE: '/users/profile',
    },
};
// HTTP Status Codes
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
};
// Pagination Constants
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
};
// Validation Constants
exports.VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    TASK_TITLE_MAX_LENGTH: 255,
    TASK_DESCRIPTION_MAX_LENGTH: 1000,
    USER_NAME_MAX_LENGTH: 100,
};
// Task Constants
exports.TASK_DEFAULTS = {
    STATUS: 'PENDING',
    SORT_BY: 'createdAt',
    SORT_ORDER: 'desc',
};
// Error Messages
exports.ERROR_MESSAGES = {
    VALIDATION: {
        REQUIRED_FIELD: 'This field is required',
        INVALID_EMAIL: 'Please provide a valid email address',
        PASSWORD_TOO_SHORT: `Password must be at least ${exports.VALIDATION.PASSWORD_MIN_LENGTH} characters long`,
        INVALID_TASK_STATUS: 'Invalid task status',
    },
    AUTH: {
        INVALID_CREDENTIALS: 'Invalid email or password',
        UNAUTHORIZED: 'You are not authorized to perform this action',
        TOKEN_EXPIRED: 'Your session has expired. Please log in again',
        USER_NOT_FOUND: 'User not found',
        EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
    },
    TASKS: {
        NOT_FOUND: 'Task not found',
        ACCESS_DENIED: 'You do not have permission to access this task',
        CREATION_FAILED: 'Failed to create task',
        UPDATE_FAILED: 'Failed to update task',
        DELETE_FAILED: 'Failed to delete task',
    },
    GENERAL: {
        INTERNAL_ERROR: 'An internal server error occurred',
        NETWORK_ERROR: 'Network error. Please check your connection',
        UNKNOWN_ERROR: 'An unknown error occurred',
    },
};
// Success Messages
exports.SUCCESS_MESSAGES = {
    AUTH: {
        LOGIN_SUCCESS: 'Successfully logged in',
        REGISTER_SUCCESS: 'Account created successfully',
        LOGOUT_SUCCESS: 'Successfully logged out',
        PROFILE_UPDATED: 'Profile updated successfully',
    },
    TASKS: {
        CREATED: 'Task created successfully',
        UPDATED: 'Task updated successfully',
        DELETED: 'Task deleted successfully',
        STATUS_UPDATED: 'Task status updated successfully',
    },
};
// Local Storage Keys
exports.STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    THEME: 'theme',
    LANGUAGE: 'language',
    TASK_FILTERS: 'task_filters',
};
// Theme Constants
exports.THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};
// Language Constants
exports.LANGUAGES = {
    EN: 'en',
    ES: 'es',
};
// Date Format Constants
exports.DATE_FORMATS = {
    SHORT: 'MM/dd/yyyy',
    LONG: 'MMMM dd, yyyy',
    WITH_TIME: 'MM/dd/yyyy HH:mm',
    ISO: 'yyyy-MM-dd',
};
// Environment Constants
exports.ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
    TEST: 'test',
};
// Regular Expressions
exports.REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};
//# sourceMappingURL=index.js.map