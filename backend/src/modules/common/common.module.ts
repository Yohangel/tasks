import { Module } from '@nestjs/common';
import { GlobalValidationPipe } from '@/common/pipes/validation.pipe';
import { GlobalExceptionFilter } from '@/common/filters/global-exception.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

@Module({
  providers: [GlobalValidationPipe, GlobalExceptionFilter, ResponseInterceptor],
  exports: [GlobalValidationPipe, GlobalExceptionFilter, ResponseInterceptor],
})
export class CommonModule {}
