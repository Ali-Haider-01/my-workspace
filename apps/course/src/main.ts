import { NestFactory } from '@nestjs/core';
import { CourseModule } from './course.module';
import { Transport } from '@nestjs/microservices';
import { SERVICES } from '@workspace/shared';

async function bootstrap() {
    const app = await NestFactory.createMicroservice(CourseModule,{
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URI],
      queue: process.env[`RMQ_${SERVICES.COURSE}_QUEUE`],
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.listen();

}

bootstrap();
