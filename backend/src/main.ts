import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JsendInterceptor } from './common/interceptors/jsend.interceptor';
import { JsendExceptionFilter } from './common/filters/jsend-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new JsendInterceptor());
  app.useGlobalFilters(new JsendExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
