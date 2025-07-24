import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateTaskDto,
  UpdateTaskDto,
  TaskFilterDto,
  TaskStatus,
} from '../../common/dto/task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: any;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
      },
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTaskDto: CreateTaskDto = {
      title: 'New Task',
      description: 'New Description',
      status: TaskStatus.PENDING,
    };

    it('should create a task successfully', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.task.create.mockResolvedValue(mockTask);

      const result = await service.create('user-1', createTaskDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          status: TaskStatus.PENDING,
          userId: 'user-1',
        },
      });
      expect(result).toEqual({
        id: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        status: mockTask.status,
        userId: mockTask.userId,
        createdAt: mockTask.createdAt,
        updatedAt: mockTask.updatedAt,
      });
    });

    it('should set default status to PENDING if not provided', async () => {
      const createTaskDtoWithoutStatus = {
        title: 'New Task',
        description: 'New Description',
      };

      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.task.create.mockResolvedValue(mockTask);

      await service.create('user-1', createTaskDtoWithoutStatus);

      expect(prismaService.task.create).toHaveBeenCalledWith({
        data: {
          title: createTaskDtoWithoutStatus.title,
          description: createTaskDtoWithoutStatus.description,
          status: TaskStatus.PENDING,
          userId: 'user-1',
        },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create('user-1', createTaskDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException on database error', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.task.create.mockRejectedValue(new Error('Database error'));

      await expect(service.create('user-1', createTaskDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllByUser', () => {
    const filterDto: TaskFilterDto = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    it('should return paginated tasks for user', async () => {
      const tasks = [mockTask];
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.task.count.mockResolvedValue(1);
      prismaService.task.findMany.mockResolvedValue(tasks);

      const result = await service.findAllByUser('user-1', filterDto);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
    });

    it('should filter tasks by status', async () => {
      const filterWithStatus = { ...filterDto, status: TaskStatus.COMPLETED };
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.task.count.mockResolvedValue(0);
      prismaService.task.findMany.mockResolvedValue([]);

      await service.findAllByUser('user-1', filterWithStatus);

      expect(prismaService.task.count).toHaveBeenCalledWith({
        where: { userId: 'user-1', status: TaskStatus.COMPLETED },
      });
    });

    it('should search tasks by title and description', async () => {
      const filterWithSearch = { ...filterDto, search: 'test' };
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.task.count.mockResolvedValue(0);
      prismaService.task.findMany.mockResolvedValue([]);

      await service.findAllByUser('user-1', filterWithSearch);

      expect(prismaService.task.count).toHaveBeenCalledWith({
        where: {
          userId: 'user-1',
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findAllByUser('user-1', filterDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findById', () => {
    it('should return task if it belongs to user', async () => {
      prismaService.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.findById('task-1', 'user-1');

      expect(result).toEqual({
        id: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        status: mockTask.status,
        userId: mockTask.userId,
        createdAt: mockTask.createdAt,
        updatedAt: mockTask.updatedAt,
      });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      prismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.findById('task-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if task belongs to different user', async () => {
      const taskForDifferentUser = { ...mockTask, userId: 'user-2' };
      prismaService.task.findUnique.mockResolvedValue(taskForDifferentUser);

      await expect(service.findById('task-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    const updateTaskDto: UpdateTaskDto = {
      title: 'Updated Task',
      status: TaskStatus.IN_PROGRESS,
    };

    it('should update task successfully', async () => {
      const updatedTask = { ...mockTask, ...updateTaskDto };
      prismaService.task.findUnique.mockResolvedValue(mockTask);
      prismaService.task.update.mockResolvedValue(updatedTask);

      const result = await service.update('task-1', 'user-1', updateTaskDto);

      expect(prismaService.task.update).toHaveBeenCalledWith({
        where: { id: 'task-1' },
        data: {
          title: updateTaskDto.title,
          status: updateTaskDto.status,
        },
      });
      expect(result.title).toBe(updateTaskDto.title);
      expect(result.status).toBe(updateTaskDto.status);
    });

    it('should validate status transitions', async () => {
      const invalidUpdateDto = { status: TaskStatus.COMPLETED };
      const taskInProgress = { ...mockTask, status: TaskStatus.COMPLETED };
      prismaService.task.findUnique.mockResolvedValue(taskInProgress);

      // Try to transition from COMPLETED to CANCELLED (invalid)
      const invalidTransition = { status: TaskStatus.CANCELLED };
      await expect(
        service.update('task-1', 'user-1', invalidTransition),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      prismaService.task.findUnique.mockResolvedValue(null);

      await expect(
        service.update('task-1', 'user-1', updateTaskDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if task belongs to different user', async () => {
      const taskForDifferentUser = { ...mockTask, userId: 'user-2' };
      prismaService.task.findUnique.mockResolvedValue(taskForDifferentUser);

      await expect(
        service.update('task-1', 'user-1', updateTaskDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('delete', () => {
    it('should delete task successfully', async () => {
      prismaService.task.findUnique.mockResolvedValue(mockTask);
      prismaService.task.delete.mockResolvedValue(mockTask);

      await service.delete('task-1', 'user-1');

      expect(prismaService.task.delete).toHaveBeenCalledWith({
        where: { id: 'task-1' },
      });
    });

    it('should throw NotFoundException if task does not exist', async () => {
      prismaService.task.findUnique.mockResolvedValue(null);

      await expect(service.delete('task-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if task belongs to different user', async () => {
      const taskForDifferentUser = { ...mockTask, userId: 'user-2' };
      prismaService.task.findUnique.mockResolvedValue(taskForDifferentUser);

      await expect(service.delete('task-1', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getTaskStats', () => {
    it('should return task statistics for user', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      prismaService.task.count
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(3) // pending
        .mockResolvedValueOnce(4) // in progress
        .mockResolvedValueOnce(2) // completed
        .mockResolvedValueOnce(1); // cancelled

      const result = await service.getTaskStats('user-1');

      expect(result).toEqual({
        total: 10,
        pending: 3,
        inProgress: 4,
        completed: 2,
        cancelled: 1,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getTaskStats('user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});