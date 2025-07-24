import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { GlobalValidationPipe } from './validation.pipe';
import { IsString, IsNotEmpty } from 'class-validator';

class TestDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

describe('GlobalValidationPipe', () => {
  let pipe: GlobalValidationPipe;

  beforeEach(() => {
    pipe = new GlobalValidationPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should pass validation with valid data', async () => {
    const value = { name: 'test' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
      data: '',
    };

    const result = await pipe.transform(value, metadata);
    expect(result).toEqual(value);
  });

  it('should throw BadRequestException with invalid data', async () => {
    const value = { name: '' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
      data: '',
    };

    await expect(pipe.transform(value, metadata)).rejects.toThrow(BadRequestException);
  });

  it('should return value unchanged for primitive types', async () => {
    const value = 'test string';
    const metadata: ArgumentMetadata = {
      type: 'param',
      metatype: String,
      data: '',
    };

    const result = await pipe.transform(value, metadata);
    expect(result).toBe(value);
  });

  it('should return value unchanged when no metatype', async () => {
    const value = { name: 'test' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: undefined,
      data: '',
    };

    const result = await pipe.transform(value, metadata);
    expect(result).toEqual(value);
  });

  it('should handle array validation', async () => {
    const value = [{ name: 'test1' }, { name: 'test2' }];
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: Array,
      data: '',
    };

    const result = await pipe.transform(value, metadata);
    expect(result).toEqual(value);
  });

  it('should transform and validate nested objects', async () => {
    const value = { name: 'test' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: TestDto,
      data: '',
    };

    const result = await pipe.transform(value, metadata);
    expect(result).toBeInstanceOf(TestDto);
    expect(result.name).toBe('test');
  });
});