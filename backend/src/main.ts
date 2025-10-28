import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get('API_PREFIX', 'api');
  const frontendUrlConfig = configService.get<string>('FRONTEND_URL');

  const frontendOrigins = frontendUrlConfig
    ? frontendUrlConfig
        .split(',')
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
    : undefined;

  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }
  app.enableCors({
    origin: frontendOrigins && frontendOrigins.length > 0 ? frontendOrigins : true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const port = configService.get('PORT');
  await app.listen(port ? Number(port) : 4000);
}
bootstrap();
