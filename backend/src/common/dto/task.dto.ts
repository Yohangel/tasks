import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    minLength: 1
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @ApiProperty({
    description: 'Task description (optional)',
    example: 'Write comprehensive documentation for the API endpoints',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    required: false,
    default: TaskStatus.PENDING
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      'Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED',
  })
  status?: TaskStatus;
}

export class UpdateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Complete project documentation',
    minLength: 1,
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title?: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Write comprehensive documentation for the API endpoints',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    required: false
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      'Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED',
  })
  status?: TaskStatus;
}

export class TaskFilterDto {
  @ApiProperty({
    description: 'Filter tasks by status',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    required: false
  })
  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      'Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED',
  })
  status?: TaskStatus;

  @ApiProperty({
    description: 'Search tasks by title or description',
    example: 'documentation',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  search?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    minimum: 1,
    default: 1,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit?: number = 10;

  @ApiProperty({
    description: 'Field to sort by',
    example: 'createdAt',
    default: 'createdAt',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Sort field must be a string' })
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Sort order',
    enum: ['asc', 'desc'],
    example: 'desc',
    default: 'desc',
    required: false
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'], {
    message: 'Sort order must be either "asc" or "desc"',
  })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
