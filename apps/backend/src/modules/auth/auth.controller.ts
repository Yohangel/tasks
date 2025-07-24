import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';

interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
  };
}
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';
import { UpdateUserDto } from '../../common/dto/user.dto';
import {
  LoginResponse,
  UserResponse,
  ApiResponse,
} from '../../common/dto/response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Register a new user
   * POST /auth/register
   * Requirements: 1.1, 1.3, 1.4, 1.5
   */
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Create a new user account with email and password. Password will be hashed before storage.'
  })
  @ApiBody({ type: RegisterDto })
  @SwaggerApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx1234567890abcdef' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        message: { type: 'string', example: 'User registered successfully' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or validation errors'
  })
  @ApiConflictResponse({ 
    description: 'Email already exists'
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(ValidationPipe) registerDto: RegisterDto,
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const user = await this.authService.register(registerDto);
      return {
        success: true,
        data: user,
        message: 'User registered successfully',
      };
    } catch (error) {
      throw error; // Let global exception filter handle the error
    }
  }

  /**
   * Login user and return JWT token
   * POST /auth/login
   * Requirements: 2.1, 2.2, 2.4
   */
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Authenticate user with email and password, returns JWT access token on success.'
  })
  @ApiBody({ type: LoginDto })
  @SwaggerApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbHgxMjM0NTY3ODkwYWJjZGVmIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjQwOTk1MjAwLCJleHAiOjE2NDA5OTg4MDB9.example' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'clx1234567890abcdef' },
                email: { type: 'string', example: 'user@example.com' },
                name: { type: 'string', example: 'John Doe' },
                createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
              }
            }
          }
        },
        message: { type: 'string', example: 'Login successful' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or validation errors'
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid credentials'
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const loginResponse = await this.authService.login(loginDto);
      return {
        success: true,
        data: loginResponse,
        message: 'Login successful',
      };
    } catch (error) {
      throw error; // Let global exception filter handle the error
    }
  }

  /**
   * Get current user profile
   * GET /auth/profile
   * Requirements: 3.1
   */
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Retrieve the profile information of the currently authenticated user.'
  })
  @ApiBearerAuth('JWT-auth')
  @SwaggerApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx1234567890abcdef' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        message: { type: 'string', example: 'Profile retrieved successfully' }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'JWT token is missing or invalid'
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() req: AuthenticatedRequest): Promise<ApiResponse<UserResponse>> {
    try {
      // The user is already attached to the request by the JWT strategy
      const userId = req.user.id;
      const user = await this.usersService.findById(userId);
      
      return {
        success: true,
        data: {
          ...user,
          name: user.name ?? undefined,
        },
        message: 'Profile retrieved successfully',
      };
    } catch (error) {
      throw error; // Let global exception filter handle the error
    }
  }

  /**
   * Update current user profile
   * PUT /auth/profile
   * Requirements: 3.2, 3.3
   */
  @ApiOperation({ 
    summary: 'Update current user profile',
    description: 'Update the profile information of the currently authenticated user.'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: UpdateUserDto })
  @SwaggerApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clx1234567890abcdef' },
            email: { type: 'string', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
          }
        },
        message: { type: 'string', example: 'Profile updated successfully' }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid input data or validation errors'
  })
  @ApiUnauthorizedResponse({ 
    description: 'JWT token is missing or invalid'
  })
  @ApiConflictResponse({ 
    description: 'Email already exists'
  })
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<ApiResponse<UserResponse>> {
    try {
      // The user is already attached to the request by the JWT strategy
      const userId = req.user.id;
      const updatedUser = await this.usersService.update(userId, updateUserDto);
      
      return {
        success: true,
        data: {
          ...updatedUser,
          name: updatedUser.name ?? undefined,
        },
        message: 'Profile updated successfully',
      };
    } catch (error) {
      throw error; // Let global exception filter handle the error
    }
  }
}