import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilterDto,
} from '../../common/dto/task.dto';
import {
  TaskResponse,
  PaginatedResponse,
  ApiResponse,
  TaskStatsResponse,
} from '../../common/dto/response.dto';

@ApiTags('tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /**
   * GET /tasks - Get user tasks with filtering and pagination
   */
  @ApiOperation({
    summary: 'Get user tasks',
    description: 'Retrieve all tasks belonging to the authenticated user with optional filtering, pagination, and search capabilities.'
  })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], description: 'Filter tasks by status' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search tasks by title or description' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page (default: 10)' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Field to sort by (default: createdAt)' })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order (default: desc)' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/TaskResponse' }
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 25 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 3 }
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'JWT token is missing or invalid' })
  @Get()
  async findAll(
    @Request() req: any,
    @Query() filterDto: TaskFilterDto,
  ): Promise<PaginatedResponse<TaskResponse>> {
    const userId = req.user.id;
    return this.tasksService.findAllByUser(userId, filterDto);
  }

  /**
   * POST /tasks - Create new task
   */
  @ApiOperation({
    summary: 'Create new task',
    description: 'Create a new task for the authenticated user. Task will be associated with the current user automatically.'
  })
  @ApiBody({ type: CreateTaskDto })
  @SwaggerApiResponse({
    status: 201,
    description: 'Task created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clx1234567890abcdef' },
        title: { type: 'string', example: 'Complete project documentation' },
        description: { type: 'string', example: 'Write comprehensive documentation for the API endpoints' },
        status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'PENDING' },
        userId: { type: 'string', example: 'clx1234567890abcdef' },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or validation errors' })
  @ApiUnauthorizedResponse({ description: 'JWT token is missing or invalid' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: any,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<TaskResponse> {
    const userId = req.user.id;
    return this.tasksService.create(userId, createTaskDto);
  }

  /**
   * GET /tasks/stats - Get task statistics for user
   */
  @ApiOperation({
    summary: 'Get task statistics',
    description: 'Retrieve task statistics for the authenticated user including counts by status.'
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Task statistics retrieved successfully',
    type: TaskStatsResponse
  })
  @ApiUnauthorizedResponse({ description: 'JWT token is missing or invalid' })
  @Get('stats')
  async getStats(@Request() req: any): Promise<TaskStatsResponse> {
    const userId = req.user.id;
    return this.tasksService.getTaskStats(userId);
  }

  /**
   * GET /tasks/:id - Get specific task
   */
  @ApiOperation({
    summary: 'Get specific task',
    description: 'Retrieve a specific task by ID. Only tasks belonging to the authenticated user can be accessed.'
  })
  @ApiParam({ name: 'id', description: 'Task ID', example: 'clx1234567890abcdef' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Task retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clx1234567890abcdef' },
        title: { type: 'string', example: 'Complete project documentation' },
        description: { type: 'string', example: 'Write comprehensive documentation for the API endpoints' },
        status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'IN_PROGRESS' },
        userId: { type: 'string', example: 'clx1234567890abcdef' },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T12:30:00.000Z' }
      }
    }
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({ description: 'Access denied - task belongs to another user' })
  @ApiUnauthorizedResponse({ description: 'JWT token is missing or invalid' })
  @Get(':id')
  async findOne(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<TaskResponse> {
    const userId = req.user.id;
    return this.tasksService.findById(id, userId);
  }

  /**
   * PUT /tasks/:id - Update task
   */
  @ApiOperation({
    summary: 'Update task',
    description: 'Update a specific task by ID. Only tasks belonging to the authenticated user can be updated.'
  })
  @ApiParam({ name: 'id', description: 'Task ID', example: 'clx1234567890abcdef' })
  @ApiBody({ type: UpdateTaskDto })
  @SwaggerApiResponse({
    status: 200,
    description: 'Task updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'clx1234567890abcdef' },
        title: { type: 'string', example: 'Complete project documentation' },
        description: { type: 'string', example: 'Write comprehensive documentation for the API endpoints' },
        status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], example: 'COMPLETED' },
        userId: { type: 'string', example: 'clx1234567890abcdef' },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T15:45:00.000Z' }
      }
    }
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or validation errors' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({ description: 'Access denied - task belongs to another user' })
  @ApiUnauthorizedResponse({ description: 'JWT token is missing or invalid' })
  @Put(':id')
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    const userId = req.user.id;
    return this.tasksService.update(id, userId, updateTaskDto);
  }

  /**
   * DELETE /tasks/:id - Delete task
   */
  @ApiOperation({
    summary: 'Delete task',
    description: 'Delete a specific task by ID. Only tasks belonging to the authenticated user can be deleted.'
  })
  @ApiParam({ name: 'id', description: 'Task ID', example: 'clx1234567890abcdef' })
  @SwaggerApiResponse({
    status: 204,
    description: 'Task deleted successfully'
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiForbiddenResponse({ description: 'Access denied - task belongs to another user' })
  @ApiUnauthorizedResponse({ description: 'JWT token is missing or invalid' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    const userId = req.user.id;
    await this.tasksService.delete(id, userId);
  }
}