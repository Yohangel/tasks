import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResponseInterceptor],
    }).compile();

    interceptor = module.get<ResponseInterceptor<any>>(ResponseInterceptor);

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          method: 'GET',
          url: '/test',
        }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    mockCallHandler = {
      handle: jest.fn().mockReturnValue(of({})),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response with success format', (done) => {
    const testData = { id: 1, name: 'test' };
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({
        success: true,
        data: testData,
        timestamp: expect.any(String),
      });
      done();
    });
  });

  it('should handle null data', (done) => {
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(null));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({
        success: true,
        data: null,
        timestamp: expect.any(String),
      });
      done();
    });
  });

  it('should handle undefined data', (done) => {
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(undefined));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({
        success: true,
        data: undefined,
        timestamp: expect.any(String),
      });
      done();
    });
  });

  it('should handle array data', (done) => {
    const testData = [{ id: 1 }, { id: 2 }];
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({
        success: true,
        data: testData,
        timestamp: expect.any(String),
      });
      done();
    });
  });

  it('should handle string data', (done) => {
    const testData = 'test string';
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({
        success: true,
        data: testData,
        timestamp: expect.any(String),
      });
      done();
    });
  });

  it('should handle number data', (done) => {
    const testData = 42;
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({
        success: true,
        data: testData,
        timestamp: expect.any(String),
      });
      done();
    });
  });

  it('should handle boolean data', (done) => {
    const testData = true;
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result).toEqual({
        success: true,
        data: testData,
        timestamp: expect.any(String),
      });
      done();
    });
  });

  it('should preserve timestamp format', (done) => {
    const testData = { test: 'data' };
    (mockCallHandler.handle as jest.Mock).mockReturnValue(of(testData));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe((result: any) => {
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      done();
    });
  });
});