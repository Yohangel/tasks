import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { GlobalValidationPipe } from '@/common/pipes/validation.pipe';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { 
  UserResponse, 
  TaskResponse, 
  LoginResponse, 
  ErrorResponse, 
  TaskStatsResponse,
  PaginatedResponse 
} from '@/common/dto/response.dto';
import { RegisterDto, LoginDto } from '@/common/dto/auth.dto';
import { CreateTaskDto, UpdateTaskDto, TaskFilterDto } from '@/common/dto/task.dto';
import { UpdateUserDto } from '@/common/dto/user.dto';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Register Fastify plugins for security and rate limiting
  await app.register(require('@fastify/helmet'), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        scriptSrc: [`'self'`],
        objectSrc: [`'none'`],
        upgradeInsecureRequests: [],
      },
    },
  });

  await app.register(require('@fastify/rate-limit'), {
    max: 100, // Maximum 100 requests
    timeWindow: 15 * 60 * 1000, // 15 minutes in milliseconds
    errorResponseBuilder: function (request: any, context: any) {
      return {
        statusCode: 429,
        error: 'Too Many Requests',
        message: `Rate limit exceeded, retry in ${Math.round(context.ttl / 1000)} seconds`,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    },
  });

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global pipes, filters, and interceptors
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Task Management System API')
    .setDescription(`
      A comprehensive task management system backend built with NestJS and Fastify.
      
      ## Features
      - User authentication with JWT tokens
      - User profile management
      - Task CRUD operations with advanced filtering
      - Pagination and search capabilities
      - Task statistics and analytics
      
      ## Authentication
      Most endpoints require authentication. Use the /auth/login endpoint to obtain a JWT token,
      then click the "Authorize" button below and enter "Bearer <your-token>" to authenticate requests.
      
      ## Error Handling
      All endpoints return consistent error responses with appropriate HTTP status codes.
      Validation errors include detailed field-level error messages.
    `)
    .setVersion('1.0')
    .setContact(
      'API Support',
      'https://github.com/your-repo/task-management-system',
      'support@example.com'
    )
    .setLicense(
      'MIT',
      'https://opensource.org/licenses/MIT'
    )
    .addServer('http://localhost:3000', 'Development server')
    .addServer('http://localhost:3001', 'Alternative development server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token (without "Bearer " prefix)',
        in: 'header',
      },
      'JWT-auth'
    )
    .addTag('auth', 'Authentication and user session management')
    .addTag('tasks', 'Task management operations with filtering and pagination')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    extraModels: [
      UserResponse,
      TaskResponse,
      LoginResponse,
      ErrorResponse,
      TaskStatsResponse,
      PaginatedResponse,
      RegisterDto,
      LoginDto,
      CreateTaskDto,
      UpdateTaskDto,
      TaskFilterDto,
      UpdateUserDto,
    ],
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Task Management API Documentation',
    customfavIcon: '/favicon.ico',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    ],
  });

  await app.listen(
    process.env.PORT ? Number(process.env.PORT) : 3000,
    '0.0.0.0',
  );
}
bootstrap();
