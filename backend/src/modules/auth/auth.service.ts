import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from '../../common/dto/auth.dto';
import { LoginResponse, UserResponse } from '../../common/dto/response.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Register a new user
     * Requirements: 1.1, 1.3, 1.4, 1.5
     */
    async register(registerDto: RegisterDto): Promise<UserResponse> {
        try {
            // Create user through UsersService (handles validation and password hashing)
            const user = await this.usersService.create(registerDto);

            // Convert null to undefined for UserResponse compatibility
            return {
                ...user,
                name: user.name ?? undefined,
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error; // Re-throw conflict exception for duplicate email
            }
            throw new BadRequestException('Registration failed');
        }
    }

    /**
     * Login user and return JWT token
     * Requirements: 2.1, 2.2, 2.4
     */
    async login(loginDto: LoginDto): Promise<LoginResponse> {
        try {
            // Validate user credentials
            const user = await this.validateUser(loginDto.email, loginDto.password);

            if (!user) {
                throw new UnauthorizedException('Invalid email or password');
            }

            // Generate JWT token
            const payload = {
                sub: user.id,
                email: user.email,
                iat: Math.floor(Date.now() / 1000)
            };

            const access_token = this.jwtService.sign(payload);

            // Return user data without password and convert null to undefined
            const { password, ...userWithoutPassword } = user;

            return {
                access_token,
                user: {
                    ...userWithoutPassword,
                    name: userWithoutPassword.name ?? undefined,
                },
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new UnauthorizedException('Login failed');
        }
    }

    /**
     * Validate user credentials for login
     * Requirements: 2.1, 2.2
     */
    async validateUser(email: string, password: string): Promise<User | null> {
        try {
            // Find user by email (includes password for validation)
            const user = await this.usersService.findByEmail(email);

            if (!user) {
                return null;
            }

            // Validate password
            const isPasswordValid = await this.usersService.validatePassword(
                password,
                user.password,
            );

            if (!isPasswordValid) {
                return null;
            }

            return user;
        } catch (error) {
            // Log error for debugging but don't expose internal details
            console.error('User validation error:', error);
            return null;
        }
    }

    /**
     * Validate JWT token and return user payload
     * Requirements: 2.4
     */
    async validateToken(payload: any): Promise<UserResponse | null> {
        try {
            // Find user by ID from token payload
            const user = await this.usersService.findById(payload.sub);

            if (!user) {
                return null;
            }

            // Convert null to undefined for UserResponse compatibility
            return {
                ...user,
                name: user.name ?? undefined,
            };
        } catch (error) {
            // Log error for debugging but don't expose internal details
            console.error('Token validation error:', error);
            return null;
        }
    }

    /**
     * Generate JWT token for user
     * Requirements: 2.4
     */
    generateToken(user: User): string {
        const payload = {
            sub: user.id,
            email: user.email,
            iat: Math.floor(Date.now() / 1000)
        };

        return this.jwtService.sign(payload);
    }

    /**
     * Verify JWT token
     * Requirements: 2.4
     */
    async verifyToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}