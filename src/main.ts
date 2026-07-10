import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalValidationPipe, RequestInterceptor, ResponseInterceptor, CustomExceptionFilter } from '@common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  app.useGlobalPipes(new GlobalValidationPipe());
  app.useGlobalInterceptors(new RequestInterceptor(), new ResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter(configService));

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`, 'Local environment')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidocs', app, documentFactory,
    // { swaggerOptions: { defaultModelsExpandDepth: -1 } }
  );

  await app.listen(port);

  const purple = '\x1b[35m';
  const reset = '\x1b[0m';

  logger.log(`\n${purple}🚀 Application is running on: http://localhost:${port}${reset}`);
  logger.log(`\n${purple}📄 Swagger documentation is available at: http://localhost:${port}/apidocs${reset}`);
}
bootstrap();

