"use strict";
// Shared utility functions
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortBy = exports.unique = exports.groupBy = exports.pick = exports.omit = exports.getRelativeTime = exports.formatDateTime = exports.formatDate = exports.slugify = exports.capitalizeFirst = exports.truncateText = exports.isValidPassword = exports.isValidEmail = exports.calculateOffset = exports.calculatePagination = exports.isValidTaskStatus = exports.getTaskStatusColor = exports.getTaskStatusLabel = void 0;
const types_1 = require("../types");
// Task utility functions
const getTaskStatusLabel = (status) => {
    const labels = {
        [types_1.TaskStatus.PENDING]: 'Pending',
        [types_1.TaskStatus.IN_PROGRESS]: 'In Progress',
        [types_1.TaskStatus.COMPLETED]: 'Completed',
        [types_1.TaskStatus.CANCELLED]: 'Cancelled',
    };
    return labels[status];
};
exports.getTaskStatusLabel = getTaskStatusLabel;
const getTaskStatusColor = (status) => {
    const colors = {
        [types_1.TaskStatus.PENDING]: 'gray',
        [types_1.TaskStatus.IN_PROGRESS]: 'blue',
        [types_1.TaskStatus.COMPLETED]: 'green',
        [types_1.TaskStatus.CANCELLED]: 'red',
    };
    return colors[status];
};
exports.getTaskStatusColor = getTaskStatusColor;
const isValidTaskStatus = (status) => {
    return Object.values(types_1.TaskStatus).includes(status);
};
exports.isValidTaskStatus = isValidTaskStatus;
// Pagination utility functions
const calculatePagination = (page, limit, total) => {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
    };
};
exports.calculatePagination = calculatePagination;
const calculateOffset = (page, limit) => {
    return (page - 1) * limit;
};
exports.calculateOffset = calculateOffset;
// Validation utility functions
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPassword = (password) => {
    return password.length >= 8;
};
exports.isValidPassword = isValidPassword;
// String utility functions
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength) + '...';
};
exports.truncateText = truncateText;
const capitalizeFirst = (text) => {
    if (!text)
        return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
exports.capitalizeFirst = capitalizeFirst;
const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.slugify = slugify;
// Date utility functions
const formatDate = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
};
exports.formatDate = formatDate;
const formatDateTime = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString();
};
exports.formatDateTime = formatDateTime;
const getRelativeTime = (date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'just now';
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return (0, exports.formatDate)(d);
};
exports.getRelativeTime = getRelativeTime;
// Object utility functions
const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};
exports.omit = omit;
const pick = (obj, keys) => {
    const result = {};
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });
    return result;
};
exports.pick = pick;
// Array utility functions
const groupBy = (array, keyFn) => {
    return array.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
};
exports.groupBy = groupBy;
const unique = (array) => {
    return Array.from(new Set(array));
};
exports.unique = unique;
const sortBy = (array, keyFn, order = 'asc') => {
    return [...array].sort((a, b) => {
        const aVal = keyFn(a);
        const bVal = keyFn(b);
        if (aVal < bVal)
            return order === 'asc' ? -1 : 1;
        if (aVal > bVal)
            return order === 'asc' ? 1 : -1;
        return 0;
    });
};
exports.sortBy = sortBy;
//# sourceMappingURL=index.js.map