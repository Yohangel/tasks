# Arquitectura Backend: Sistema de Gestión de Tareas

## 1. Tecnologías Seleccionadas

- **Framework:** NestJS (TypeScript) **con Fastify** (en vez de Express)
- **ORM:** Prisma
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT (passport-jwt)
- **Validación:** class-validator
- **Testing:** Jest (unit, integration), Supertest (e2e)
- **Documentación:** Swagger (OpenAPI)
- **Gestión de variables:** dotenv
- **CI/CD:** GitHub Actions (lint, test, build, deploy)
- **Bonus:** Docker y docker-compose, scripts de migración, paginación, búsqueda avanzada

### ¿Por qué Fastify?

- **Rendimiento superior**: Fastify es más rápido y eficiente en manejo de peticiones concurrentes que Express.
- **Menor consumo de recursos**: Ideal para microservicios y APIs RESTful.
- **Soporte oficial en NestJS**: NestJS permite cambiar la plataforma HTTP a Fastify fácilmente.
- **Plugins modernos**: Ecosistema de plugins robusto y seguro.

> En el `main.ts` de NestJS se inicializará la app con Fastify:
>
> ```ts
> import { NestFactory } from '@nestjs/core';
> import { AppModule } from './app.module';
> import {
>   FastifyAdapter,
>   NestFastifyApplication,
> } from '@nestjs/platform-fastify';
>
> async function bootstrap() {
>   const app = await NestFactory.create<NestFastifyApplication>(
>     AppModule,
>     new FastifyAdapter(),
>   );
>   await app.listen(3000, '0.0.0.0');
> }
> bootstrap();
> ```

## 2. Estructura de Carpetas

```plaintext
/src
  /modules
    /auth         # Registro, login, JWT, guards
    /users        # CRUD usuarios
    /tasks        # CRUD tareas, filtros, paginación
    /common       # DTOs, pipes, guards, interceptors
  /prisma         # Prisma schema y client
  /config         # Configuración global
  /scripts        # Migraciones, seeders
  /tests          # Unitarios, integración, e2e
  /docs           # Swagger y documentación extra
```

## 3. Principios y Patrones

- **Modularidad:** Cada dominio en su propio módulo
- **DTOs y validación estricta**
- **Autenticación y autorización centralizadas**
- **Separación de lógica de negocio y acceso a datos**
- **Manejo global de errores y logging**
- **Middlewares para logging, rate limiting, CORS**

## 4. Integración de Bonus

- **Docker y docker-compose:** Para desarrollo y despliegue
- **Testing:** Cobertura mínima 80% (unit, integration, e2e)
- **Paginación y búsqueda avanzada:** En endpoints de tareas
- **Swagger:** Documentación interactiva de la API
- **Scripts de migración y seed**
- **CI/CD:** Lint, test, build y deploy automáticos

## 5. Seguridad

- **Hash de contraseñas (bcrypt)**
- **JWT con expiración y refresh tokens**
- **Validación exhaustiva de inputs**
- **CORS configurado**
- **Rate limiting y helmet**
- **Variables sensibles en .env**

## 6. Despliegue

- **Railway, Render, Heroku o similar**
- **Docker para portabilidad**
- **Variables de entorno en dashboard del proveedor**

## 7. Justificación de Decisiones

- **NestJS:** Escalable, modular, soporte TypeScript nativo
- **Prisma:** Tipado, migraciones seguras, fácil de usar
- **PostgreSQL:** Robusta y ampliamente soportada
- **Swagger:** Facilita consumo y testing de la API
- **Testing:** Garantiza calidad y mantenibilidad

## 8. Documentación y Entregables

- **README.md:** Instrucciones, arquitectura, decisiones técnicas
- **Swagger:** Documentación de endpoints
- **Scripts:** Migraciones y seed
- **.env.example:** Variables necesarias
