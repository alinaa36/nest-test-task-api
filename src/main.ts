import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filtres/http-exception.filter';
import { ZodFilter } from './common/filtres/zod-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.useGlobalFilters(new AllExceptionsFilter(), new ZodFilter());

  const config = new DocumentBuilder()
    .setTitle('Notes API')
    .setDescription('API documentation for Notes application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
