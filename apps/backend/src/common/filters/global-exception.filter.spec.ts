import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalExceptionFilter],
    }).compile();

    filter = module.get<GlobalExceptionFilter>(GlobalExceptionFilter);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/test',
      method: 'GET',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle HttpException', () => {
    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Test error',
      error: 'HttpException',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle HttpException with array message', () => {
    // Create a custom HttpException with array message
    const exception = new HttpException(
      { message: ['Error 1', 'Error 2'], error: 'HttpException' },
      HttpStatus.BAD_REQUEST
    );
    
    // Create a new mock response for this test
    const mockSpecificResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    
    // Override the switchToHttp implementation for this test
    const mockSpecificArgumentsHost = {
      ...mockArgumentsHost,
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockSpecificResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };
    
    filter.catch(exception, mockSpecificArgumentsHost);

    expect(mockSpecificResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockSpecificResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ['Error 1', 'Error 2'],
      error: 'HttpException',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle Prisma unique constraint error', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '4.0.0',
        meta: { target: ['email'] },
      }
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'email already exists',
      error: 'Conflict',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle Prisma record not found error', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Record not found',
      {
        code: 'P2025',
        clientVersion: '4.0.0',
      }
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Record not found',
      error: 'Not Found',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle Prisma foreign key constraint error', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Foreign key constraint failed',
      {
        code: 'P2003',
        clientVersion: '4.0.0',
      }
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid reference to related record',
      error: 'Bad Request',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle other Prisma known request errors', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Some other error',
      {
        code: 'P2001',
        clientVersion: '4.0.0',
      }
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database error occurred',
      error: 'Internal Server Error',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle Prisma validation error', () => {
    const exception = new PrismaClientValidationError(
      'Validation error',
      { clientVersion: '4.0.0' }
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Validation error',
      error: 'PrismaClientValidationError',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle generic errors', () => {
    const exception = new Error('Generic error');

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Generic error',
      error: 'Error',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle unique constraint with multiple fields', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '4.0.0',
        meta: { target: ['email', 'username'] },
      }
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'email, username already exists',
      error: 'Conflict',
      timestamp: expect.any(String),
      path: '/test',
    });
  });

  it('should handle unique constraint without target meta', () => {
    const exception = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '4.0.0',
        meta: {},
      }
    );

    filter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockResponse.send).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'Field already exists',
      error: 'Conflict',
      timestamp: expect.any(String),
      path: '/test',
    });
  });
});