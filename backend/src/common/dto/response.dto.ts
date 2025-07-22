import { TaskStatus } from './task.dto';
import { PaginationMeta } from './pagination.dto';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'User unique identifier',
    example: 'clx1234567890abcdef'
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false
  })
  name?: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}

export class TaskResponse {
  @ApiProperty({
    description: 'Task unique identifier',
    example: 'clx1234567890abcdef'
  })
  id: string;

  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation'
  })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Write comprehensive documentation for the API endpoints',
    required: false
  })
  description?: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.PENDING
  })
  status: TaskStatus;

  @ApiProperty({
    description: 'ID of the user who owns this task',
    example: 'clx1234567890abcdef'
  })
  userId: string;

  @ApiProperty({
    description: 'Task creation timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Task last update timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}

export class LoginResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponse
  })
  user: UserResponse;
}

export class ApiResponse<T = any> {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Response data',
    required: false
  })
  data?: T;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
    required: false
  })
  message?: string;

  @ApiProperty({
    description: 'Error message if request failed',
    example: 'Something went wrong',
    required: false
  })
  error?: string;
}

export class PaginatedResponse<T> {
  @ApiProperty({
    description: 'Array of data items',
    isArray: true
  })
  data: T[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMeta
  })
  meta: PaginationMeta;
}

export class ErrorResponse {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message(s)',
    oneOf: [
      { type: 'string', example: 'Bad Request' },
      { type: 'array', items: { type: 'string' }, example: ['Field is required', 'Invalid format'] }
    ]
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request'
  })
  error: string;

  @ApiProperty({
    description: 'Error timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path that caused the error',
    example: '/api/tasks'
  })
  path: string;
}

export class TaskStatsResponse {
  @ApiProperty({
    description: 'Total number of tasks',
    example: 25
  })
  total: number;

  @ApiProperty({
    description: 'Number of pending tasks',
    example: 10
  })
  pending: number;

  @ApiProperty({
    description: 'Number of in-progress tasks',
    example: 8
  })
  inProgress: number;

  @ApiProperty({
    description: 'Number of completed tasks',
    example: 5
  })
  completed: number;

  @ApiProperty({
    description: 'Number of cancelled tasks',
    example: 2
  })
  cancelled: number;
}

export class SuccessResponse {
  @ApiProperty({
    description: 'Indicates if the request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Success message',
    example: 'Operation completed successfully'
  })
  message: string;
}
