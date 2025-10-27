import { NestFactory } from '@nestjs/core';
import { StudentModule } from './student.module';
import { Transport } from '@nestjs/microservices';
import { SERVICES } from '@workspace/shared';

async function bootstrap() {
     const app = await NestFactory.createMicroservice(StudentModule,{
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URI],
      queue: process.env[`RMQ_${SERVICES.STUDENT}_QUEUE`],
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.listen();
}

bootstrap();
