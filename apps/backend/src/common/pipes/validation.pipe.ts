import {
  BadRequestException,
  Injectable,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

function flattenValidationErrors(validationErrors: ValidationError[]): string[] {
  const errors: string[] = [];

  for (const error of validationErrors) {
    if (error.constraints) {
      errors.push(...Object.values(error.constraints));
    }
    if (error.children && error.children.length > 0) {
      errors.push(...flattenValidationErrors(error.children));
    }
  }

  return errors;
}

@Injectable()
export class GlobalValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Allow implicit type conversion
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = flattenValidationErrors(validationErrors);
        return new BadRequestException({
          statusCode: 400,
          message: errors,
          error: 'Bad Request',
        });
      },
    });
  }
}