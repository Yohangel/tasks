import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskStatus } from '../../common/dto/task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    findAllByUser: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    getTaskStats: jest.fn(),
  };

  const mockJwtAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated tasks for user', async () => {
      const userId = 'user-1';
      const filterDto = { page: 1, limit: 10 };
      const mockRequest = { user: { id: userId } };
      const expectedResult = {
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      };

      mockTasksService.findAllByUser.mockResolvedValue(expectedResult);

      const result = await controller.findAll(mockRequest, filterDto);

      expect(service.findAllByUser).toHaveBeenCalledWith(userId, filterDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const userId = 'user-1';
      const createTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      };
      const mockRequest = { user: { id: userId } };
      const expectedResult = {
        id: 'task-1',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTasksService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(mockRequest, createTaskDto);

      expect(service.create).toHaveBeenCalledWith(userId, createTaskDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a specific task', async () => {
      const userId = 'user-1';
      const taskId = 'task-1';
      const mockRequest = { user: { id: userId } };
      const expectedResult = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTasksService.findById.mockResolvedValue(expectedResult);

      const result = await controller.findOne(mockRequest, taskId);

      expect(service.findById).toHaveBeenCalledWith(taskId, userId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const userId = 'user-1';
      const taskId = 'task-1';
      const updateTaskDto = { title: 'Updated Task' };
      const mockRequest = { user: { id: userId } };
      const expectedResult = {
        id: taskId,
        title: 'Updated Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTasksService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(mockRequest, taskId, updateTaskDto);

      expect(service.update).toHaveBeenCalledWith(taskId, userId, updateTaskDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const userId = 'user-1';
      const taskId = 'task-1';
      const mockRequest = { user: { id: userId } };

      mockTasksService.delete.mockResolvedValue(undefined);

      await controller.remove(mockRequest, taskId);

      expect(service.delete).toHaveBeenCalledWith(taskId, userId);
    });
  });

  describe('getStats', () => {
    it('should return task statistics', async () => {
      const userId = 'user-1';
      const mockRequest = { user: { id: userId } };
      const expectedResult = {
        total: 10,
        pending: 3,
        inProgress: 2,
        completed: 4,
        cancelled: 1,
      };

      mockTasksService.getTaskStats.mockResolvedValue(expectedResult);

      const result = await controller.getStats(mockRequest);

      expect(service.getTaskStats).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });
  });
});