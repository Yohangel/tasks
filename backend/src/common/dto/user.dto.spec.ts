import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto, CreateUserDto } from './user.dto';

describe('User DTOs', () => {
  describe('CreateUserDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional name', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'test@example.com',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints?.isEmail).toBe('Please provide a valid email address');
    });

    it('should fail validation with short password', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.minLength).toBe('Password must be at least 8 characters long');
    });

    it('should fail validation with non-string password', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'test@example.com',
        password: 123456789,
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.isString).toBe('Password must be a string');
    });

    it('should fail validation with non-string name', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'test@example.com',
        password: 'password123',
        name: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints?.isString).toBe('Name must be a string');
    });
  });

  describe('UpdateUserDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(UpdateUserDto, {
        email: 'updated@example.com',
        password: 'newpassword123',
        name: 'Updated User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with empty object', async () => {
      const dto = plainToClass(UpdateUserDto, {});

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only email', async () => {
      const dto = plainToClass(UpdateUserDto, {
        email: 'updated@example.com',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only password', async () => {
      const dto = plainToClass(UpdateUserDto, {
        password: 'newpassword123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation with only name', async () => {
      const dto = plainToClass(UpdateUserDto, {
        name: 'Updated User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = plainToClass(UpdateUserDto, {
        email: 'invalid-email',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints?.isEmail).toBe('Please provide a valid email address');
    });

    it('should fail validation with short password', async () => {
      const dto = plainToClass(UpdateUserDto, {
        password: '123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.minLength).toBe('Password must be at least 8 characters long');
    });

    it('should fail validation with non-string password', async () => {
      const dto = plainToClass(UpdateUserDto, {
        password: 123456789,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.isString).toBe('Password must be a string');
    });

    it('should fail validation with non-string name', async () => {
      const dto = plainToClass(UpdateUserDto, {
        name: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints?.isString).toBe('Name must be a string');
    });
  });
});