import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';
import { UpdateUserDto } from '../../common/dto/user.dto';
import { ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLoginResponse = {
    access_token: 'jwt-token',
    user: mockUser,
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const mockUsersService = {
      findById: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual({
        success: true,
        data: mockUser,
        message: 'User registered successfully',
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
      };

      authService.register.mockRejectedValue(
        new ConflictException('User with this email already exists'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        success: true,
        data: mockLoginResponse,
        message: 'Login successful',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      authService.login.mockRejectedValue(
        new UnauthorizedException('Invalid email or password'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile successfully', async () => {
      const mockRequest = {
        user: { id: '1', email: 'test@example.com' },
      };

      usersService.findById.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest);

      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        success: true,
        data: {
          ...mockUser,
          name: mockUser.name,
        },
        message: 'Profile retrieved successfully',
      });
    });

    it('should handle user not found', async () => {
      const mockRequest = {
        user: { id: '999', email: 'test@example.com' },
      };

      usersService.findById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(controller.getProfile(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
      expect(usersService.findById).toHaveBeenCalledWith('999');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      const mockRequest = {
        user: { id: '1', email: 'test@example.com' },
      };

      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const updatedUser = {
        ...mockUser,
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      usersService.update.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(mockRequest, updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual({
        success: true,
        data: {
          ...updatedUser,
          name: updatedUser.name,
        },
        message: 'Profile updated successfully',
      });
    });

    it('should throw ConflictException when updating to existing email', async () => {
      const mockRequest = {
        user: { id: '1', email: 'test@example.com' },
      };

      const updateUserDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      usersService.update.mockRejectedValue(
        new ConflictException('Email is already in use'),
      );

      await expect(
        controller.updateProfile(mockRequest, updateUserDto),
      ).rejects.toThrow(ConflictException);
      expect(usersService.update).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('should handle user not found during update', async () => {
      const mockRequest = {
        user: { id: '999', email: 'test@example.com' },
      };

      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      usersService.update.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.updateProfile(mockRequest, updateUserDto),
      ).rejects.toThrow(NotFoundException);
      expect(usersService.update).toHaveBeenCalledWith('999', updateUserDto);
    });
  });
});