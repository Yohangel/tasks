import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilterDto,
  TaskStatus,
} from '../../common/dto/task.dto';
import {
  TaskResponse,
  PaginatedResponse,
} from '../../common/dto/response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new task for the authenticated user
   */
  async create(userId: string, createTaskDto: CreateTaskDto): Promise<TaskResponse> {
    try {
      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const task = await this.prisma.task.create({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: createTaskDto.status || TaskStatus.PENDING,
          userId,
        },
      });

      return this.mapTaskToResponse(task);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to create task');
    }
  }

  /**
   * Find all tasks for a specific user with filtering and pagination
   */
  async findAllByUser(
    userId: string,
    filterDto: TaskFilterDto,
  ): Promise<PaginatedResponse<TaskResponse>> {
    try {
      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const {
        status,
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = filterDto;

      // Build where clause
      const where: any = {
        userId,
      };

      if (status) {
        where.status = status;
      }

      if (search) {
        where.OR = [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      // Validate sort field
      const allowedSortFields = ['title', 'status', 'createdAt', 'updatedAt'];
      const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const total = await this.prisma.task.count({ where });

      // Get tasks with pagination and sorting
      const tasks = await this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortField]: sortOrder,
        },
      });

      const taskResponses = tasks.map(task => this.mapTaskToResponse(task));
      const pagination = new PaginationDto(page, limit, total);

      return {
        data: taskResponses,
        meta: pagination,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve tasks');
    }
  }

  /**
   * Find a specific task by ID for a user
   */
  async findById(id: string, userId: string): Promise<TaskResponse> {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      // Check if task belongs to the user
      if (task.userId !== userId) {
        throw new ForbiddenException('Access denied to this task');
      }

      return this.mapTaskToResponse(task);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve task');
    }
  }

  /**
   * Update a task for a specific user
   */
  async update(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponse> {
    try {
      // First check if task exists and belongs to user
      const existingTask = await this.findById(id, userId);

      // Validate status transition if status is being updated
      if (updateTaskDto.status && updateTaskDto.status !== existingTask.status) {
        this.validateStatusTransition(existingTask.status, updateTaskDto.status);
      }

      const updatedTask = await this.prisma.task.update({
        where: { id },
        data: {
          ...(updateTaskDto.title && { title: updateTaskDto.title }),
          ...(updateTaskDto.description !== undefined && { description: updateTaskDto.description }),
          ...(updateTaskDto.status && { status: updateTaskDto.status }),
        },
      });

      return this.mapTaskToResponse(updatedTask);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to update task');
    }
  }

  /**
   * Delete a task for a specific user
   */
  async delete(id: string, userId: string): Promise<void> {
    try {
      // First check if task exists and belongs to user
      await this.findById(id, userId);

      await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to delete task');
    }
  }

  /**
   * Get task statistics for a user
   */
  async getTaskStats(userId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  }> {
    try {
      // Verify user exists
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const [total, pending, inProgress, completed, cancelled] = await Promise.all([
        this.prisma.task.count({ where: { userId } }),
        this.prisma.task.count({ where: { userId, status: TaskStatus.PENDING } }),
        this.prisma.task.count({ where: { userId, status: TaskStatus.IN_PROGRESS } }),
        this.prisma.task.count({ where: { userId, status: TaskStatus.COMPLETED } }),
        this.prisma.task.count({ where: { userId, status: TaskStatus.CANCELLED } }),
      ]);

      return {
        total,
        pending,
        inProgress,
        completed,
        cancelled,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to retrieve task statistics');
    }
  }

  /**
   * Validate status transitions (business logic)
   */
  private validateStatusTransition(currentStatus: TaskStatus, newStatus: TaskStatus): void {
    const validTransitions: Record<TaskStatus, TaskStatus[]> = {
      [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS, TaskStatus.CANCELLED],
      [TaskStatus.IN_PROGRESS]: [TaskStatus.COMPLETED, TaskStatus.CANCELLED, TaskStatus.PENDING],
      [TaskStatus.COMPLETED]: [TaskStatus.IN_PROGRESS], // Allow reopening completed tasks
      [TaskStatus.CANCELLED]: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS], // Allow reactivating cancelled tasks
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  /**
   * Map Prisma task model to response DTO
   */
  private mapTaskToResponse(task: any): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}