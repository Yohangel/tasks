import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserWithoutPassword = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      validatePassword: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should successfully register a new user', async () => {
      // Arrange
      usersService.create.mockResolvedValue(mockUserWithoutPassword);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(usersService.create).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Arrange
      usersService.create.mockRejectedValue(new ConflictException('User with this email already exists'));

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException for other registration errors', async () => {
      // Arrange
      usersService.create.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      // Arrange
      const mockToken = 'jwt.token.here';
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(true);
      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(usersService.validatePassword).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        iat: expect.any(Number),
      });
      expect(result).toEqual({
        access_token: mockToken,
        user: expect.objectContaining({
          id: mockUserWithoutPassword.id,
          email: mockUserWithoutPassword.email,
          name: mockUserWithoutPassword.name,
        }),
      });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(usersService.validatePassword).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(false);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for service errors', async () => {
      // Arrange
      usersService.findByEmail.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return user for valid credentials', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(true);

      // Act
      const result = await authService.validateUser('test@example.com', 'password123');

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(null);

      // Act
      const result = await authService.validateUser('test@example.com', 'password123');

      // Assert
      expect(result).toBeNull();
      expect(usersService.validatePassword).not.toHaveBeenCalled();
    });

    it('should return null for invalid password', async () => {
      // Arrange
      usersService.findByEmail.mockResolvedValue(mockUser);
      usersService.validatePassword.mockResolvedValue(false);

      // Act
      const result = await authService.validateUser('test@example.com', 'wrongpassword');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for service errors', async () => {
      // Arrange
      usersService.findByEmail.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await authService.validateUser('test@example.com', 'password123');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('validateToken', () => {
    const mockPayload = { sub: '1', email: 'test@example.com' };

    it('should return user for valid token payload', async () => {
      // Arrange
      usersService.findById.mockResolvedValue(mockUserWithoutPassword);

      // Act
      const result = await authService.validateToken(mockPayload);

      // Assert
      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUserWithoutPassword);
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      usersService.findById.mockRejectedValue(new Error('User not found'));

      // Act
      const result = await authService.validateToken(mockPayload);

      // Assert
      expect(result).toBeNull();
    });

    it('should return null for service errors', async () => {
      // Arrange
      usersService.findById.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await authService.validateToken(mockPayload);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('should generate JWT token for user', () => {
      // Arrange
      const mockToken = 'jwt.token.here';
      jwtService.sign.mockReturnValue(mockToken);

      // Act
      const result = authService.generateToken(mockUser);

      // Assert
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        iat: expect.any(Number),
      });
      expect(result).toBe(mockToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid JWT token', async () => {
      // Arrange
      const mockToken = 'jwt.token.here';
      const mockPayload = { sub: '1', email: 'test@example.com' };
      jwtService.verify.mockReturnValue(mockPayload);

      // Act
      const result = await authService.verifyToken(mockToken);

      // Assert
      expect(jwtService.verify).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Arrange
      const mockToken = 'invalid.token';
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act & Assert
      await expect(authService.verifyToken(mockToken)).rejects.toThrow(UnauthorizedException);
    });
  });
});