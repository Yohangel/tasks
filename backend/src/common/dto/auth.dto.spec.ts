import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { RegisterDto, LoginDto } from './auth.dto';

describe('Auth DTOs', () => {
  describe('RegisterDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation without optional name', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints?.isEmail).toBe('Please provide a valid email address');
    });

    it('should fail validation with missing email', async () => {
      const dto = plainToClass(RegisterDto, {
        password: 'password123',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with short password', async () => {
      const dto = plainToClass(RegisterDto, {
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
      const dto = plainToClass(RegisterDto, {
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
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        password: 'password123',
        name: 123,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('name');
      expect(errors[0].constraints?.isString).toBe('Name must be a string');
    });

    it('should fail validation with missing password', async () => {
      const dto = plainToClass(RegisterDto, {
        email: 'test@example.com',
        name: 'Test User',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('LoginDto', () => {
    it('should pass validation with valid data', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation with invalid email', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'invalid-email',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
      expect(errors[0].constraints?.isEmail).toBe('Please provide a valid email address');
    });

    it('should fail validation with missing email', async () => {
      const dto = plainToClass(LoginDto, {
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail validation with non-string password', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
        password: 123456789,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
      expect(errors[0].constraints?.isString).toBe('Password must be a string');
    });

    it('should fail validation with missing password', async () => {
      const dto = plainToClass(LoginDto, {
        email: 'test@example.com',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });
  });
});