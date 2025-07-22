import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { JwtStrategy, JwtPayload } from './jwt.strategy';
import { AuthService } from '../auth.service';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;
  let authService: jest.Mocked<AuthService>;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockAuthService = {
      validateToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate a valid JWT payload', async () => {
    const payload: JwtPayload = {
      sub: 'user-id-123',
      email: 'test@example.com',
    };

    authService.validateToken.mockResolvedValue(mockUser);

    const result = await strategy.validate(payload);

    expect(authService.validateToken).toHaveBeenCalledWith(payload);
    expect(result).toEqual(mockUser);
  });

  it('should throw UnauthorizedException for invalid payload without sub', async () => {
    const payload = {
      email: 'test@example.com',
    } as JwtPayload;

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(authService.validateToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException for invalid payload without email', async () => {
    const payload = {
      sub: 'user-id-123',
    } as JwtPayload;

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(authService.validateToken).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    const payload: JwtPayload = {
      sub: 'user-id-123',
      email: 'test@example.com',
    };

    authService.validateToken.mockResolvedValue(null);

    await expect(strategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(authService.validateToken).toHaveBeenCalledWith(payload);
  });

  it('should throw error if JWT_SECRET is not defined', () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue(undefined),
    };

    expect(() => {
      new JwtStrategy(mockConfigService as any, authService);
    }).toThrow('JWT_SECRET is not defined in environment variables');
  });
});