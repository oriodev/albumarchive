import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe())

  // https://www.albumarchive.live
  // http://localhost:3000

  app.enableCors({
    origin: 'https://www.albumarchive.live', // PROD
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 8000);

  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    console.log(`Memory Usage: 
      RSS: ${memoryUsage.rss / 1024 / 1024} MB,
      Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB,
      Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB,
      External: ${memoryUsage.external / 1024 / 1024} MB`);
  }, 60000); // Log every minute
  
}
bootstrap();


