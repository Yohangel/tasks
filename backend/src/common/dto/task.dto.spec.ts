import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto, TaskStatus } from './task.dto';

describe('Task DTOs', () => {
  describe('CreateTaskDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(CreateTaskDto, {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.PENDING,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional fields', async () => {
      const dto = plainToClass(CreateTaskDto, {
        title: 'Test Task',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty title', async () => {
      const dto = plainToClass(CreateTaskDto, {
        title: '',
        description: 'Test Description',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints?.isNotEmpty).toBe('Title cannot be empty');
    });

    it('should fail validation with non-string title', async () => {
      const dto = plainToClass(CreateTaskDto, {
        title: 123,
        description: 'Test Description',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints?.isString).toBe('Title must be a string');
    });

    it('should fail validation with missing title', async () => {
      const dto = plainToClass(CreateTaskDto, {
        description: 'Test Description',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation with non-string description', async () => {
      const dto = plainToClass(CreateTaskDto, {
        title: 'Test Task',
        description: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints?.isString).toBe('Description must be a string');
    });

    it('should fail validation with invalid status', async () => {
      const dto = plainToClass(CreateTaskDto, {
        title: 'Test Task',
        status: 'INVALID_STATUS',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints?.isEnum).toBe('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED');
    });
  });

  describe('UpdateTaskDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(UpdateTaskDto, {
        title: 'Updated Task',
        description: 'Updated Description',
        status: TaskStatus.IN_PROGRESS,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      const dto = plainToClass(UpdateTaskDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with empty title', async () => {
      const dto = plainToClass(UpdateTaskDto, {
        title: '',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints?.isNotEmpty).toBe('Title cannot be empty');
    });

    it('should fail validation with non-string title', async () => {
      const dto = plainToClass(UpdateTaskDto, {
        title: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('title');
      expect(errors[0].constraints?.isString).toBe('Title must be a string');
    });

    it('should fail validation with non-string description', async () => {
      const dto = plainToClass(UpdateTaskDto, {
        description: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('description');
      expect(errors[0].constraints?.isString).toBe('Description must be a string');
    });

    it('should fail validation with invalid status', async () => {
      const dto = plainToClass(UpdateTaskDto, {
        status: 'INVALID_STATUS',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints?.isEnum).toBe('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED');
    });
  });

  describe('TaskFilterDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(TaskFilterDto, {
        status: TaskStatus.PENDING,
        search: 'test',
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      const dto = plainToClass(TaskFilterDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid status', async () => {
      const dto = plainToClass(TaskFilterDto, {
        status: 'INVALID_STATUS',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('status');
      expect(errors[0].constraints?.isEnum).toBe('Status must be one of: PENDING, IN_PROGRESS, COMPLETED, CANCELLED');
    });

    it('should fail validation with non-string search', async () => {
      const dto = plainToClass(TaskFilterDto, {
        search: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('search');
      expect(errors[0].constraints?.isString).toBe('Search term must be a string');
    });

    it('should fail validation with invalid page number', async () => {
      const dto = plainToClass(TaskFilterDto, {
        page: 0,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('page');
      expect(errors[0].constraints?.min).toBe('Page must be at least 1');
    });

    it('should fail validation with non-integer page', async () => {
      const dto = plainToClass(TaskFilterDto, {
        page: 'invalid',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('page');
      expect(errors[0].constraints?.isInt).toBe('Page must be an integer');
    });

    it('should fail validation with invalid limit', async () => {
      const dto = plainToClass(TaskFilterDto, {
        limit: 0,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('limit');
      expect(errors[0].constraints?.min).toBe('Limit must be at least 1');
    });

    it('should fail validation with limit exceeding maximum', async () => {
      const dto = plainToClass(TaskFilterDto, {
        limit: 101,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('limit');
      expect(errors[0].constraints?.max).toBe('Limit cannot exceed 100');
    });

    it('should fail validation with non-integer limit', async () => {
      const dto = plainToClass(TaskFilterDto, {
        limit: 'invalid',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('limit');
      expect(errors[0].constraints?.isInt).toBe('Limit must be an integer');
    });

    it('should fail validation with non-string sortBy', async () => {
      const dto = plainToClass(TaskFilterDto, {
        sortBy: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('sortBy');
      expect(errors[0].constraints?.isString).toBe('Sort field must be a string');
    });

    it('should fail validation with invalid sortOrder', async () => {
      const dto = plainToClass(TaskFilterDto, {
        sortOrder: 'invalid',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('sortOrder');
      expect(errors[0].constraints?.isEnum).toBe('Sort order must be either "asc" or "desc"');
    });

    it('should transform string numbers to integers for page and limit', async () => {
      const dto = plainToClass(TaskFilterDto, {
        page: '2',
        limit: '20',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
      expect(dto.page).toBe(2);
      expect(dto.limit).toBe(20);
    });
  });
});