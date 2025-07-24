export declare const API_ENDPOINTS: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly PROFILE: "/auth/profile";
    };
    readonly TASKS: {
        readonly BASE: "/tasks";
        readonly STATS: "/tasks/stats";
    };
    readonly USERS: {
        readonly BASE: "/users";
        readonly PROFILE: "/users/profile";
    };
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 10;
    readonly MAX_LIMIT: 100;
    readonly MIN_LIMIT: 1;
};
export declare const VALIDATION: {
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly TASK_TITLE_MAX_LENGTH: 255;
    readonly TASK_DESCRIPTION_MAX_LENGTH: 1000;
    readonly USER_NAME_MAX_LENGTH: 100;
};
export declare const TASK_DEFAULTS: {
    readonly STATUS: "PENDING";
    readonly SORT_BY: "createdAt";
    readonly SORT_ORDER: "desc";
};
export declare const ERROR_MESSAGES: {
    readonly VALIDATION: {
        readonly REQUIRED_FIELD: "This field is required";
        readonly INVALID_EMAIL: "Please provide a valid email address";
        readonly PASSWORD_TOO_SHORT: "Password must be at least 8 characters long";
        readonly INVALID_TASK_STATUS: "Invalid task status";
    };
    readonly AUTH: {
        readonly INVALID_CREDENTIALS: "Invalid email or password";
        readonly UNAUTHORIZED: "You are not authorized to perform this action";
        readonly TOKEN_EXPIRED: "Your session has expired. Please log in again";
        readonly USER_NOT_FOUND: "User not found";
        readonly EMAIL_ALREADY_EXISTS: "An account with this email already exists";
    };
    readonly TASKS: {
        readonly NOT_FOUND: "Task not found";
        readonly ACCESS_DENIED: "You do not have permission to access this task";
        readonly CREATION_FAILED: "Failed to create task";
        readonly UPDATE_FAILED: "Failed to update task";
        readonly DELETE_FAILED: "Failed to delete task";
    };
    readonly GENERAL: {
        readonly INTERNAL_ERROR: "An internal server error occurred";
        readonly NETWORK_ERROR: "Network error. Please check your connection";
        readonly UNKNOWN_ERROR: "An unknown error occurred";
    };
};
export declare const SUCCESS_MESSAGES: {
    readonly AUTH: {
        readonly LOGIN_SUCCESS: "Successfully logged in";
        readonly REGISTER_SUCCESS: "Account created successfully";
        readonly LOGOUT_SUCCESS: "Successfully logged out";
        readonly PROFILE_UPDATED: "Profile updated successfully";
    };
    readonly TASKS: {
        readonly CREATED: "Task created successfully";
        readonly UPDATED: "Task updated successfully";
        readonly DELETED: "Task deleted successfully";
        readonly STATUS_UPDATED: "Task status updated successfully";
    };
};
export declare const STORAGE_KEYS: {
    readonly AUTH_TOKEN: "auth_token";
    readonly USER_DATA: "user_data";
    readonly THEME: "theme";
    readonly LANGUAGE: "language";
    readonly TASK_FILTERS: "task_filters";
};
export declare const THEMES: {
    readonly LIGHT: "light";
    readonly DARK: "dark";
    readonly SYSTEM: "system";
};
export declare const LANGUAGES: {
    readonly EN: "en";
    readonly ES: "es";
};
export declare const DATE_FORMATS: {
    readonly SHORT: "MM/dd/yyyy";
    readonly LONG: "MMMM dd, yyyy";
    readonly WITH_TIME: "MM/dd/yyyy HH:mm";
    readonly ISO: "yyyy-MM-dd";
};
export declare const ENVIRONMENTS: {
    readonly DEVELOPMENT: "development";
    readonly PRODUCTION: "production";
    readonly TEST: "test";
};
export declare const REGEX: {
    readonly EMAIL: RegExp;
    readonly PASSWORD: RegExp;
    readonly SLUG: RegExp;
};
//# sourceMappingURL=index.d.ts.map