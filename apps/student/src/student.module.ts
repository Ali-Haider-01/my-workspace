import { Module } from '@nestjs/common';
import { StudentController } from './app/student.controller';
import { StudentService } from './app/student.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SERVICES, Student, StudentSchema } from '@workspace/shared';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

const schemaObject = {
  // RMQ Configuration
  RMQ_URI: Joi.string().required(),
  [`RMQ_${SERVICES.STUDENT}_QUEUE`]: Joi.string().required(),

  // Mongo DB Configuration
  MONGODB_URI: Joi.string().required(),
  MONGODB_STUDENT: Joi.string().required(),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object(schemaObject),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        dbName: configService.get('MONGODB_STUDENT'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Student.name,
        schema: StudentSchema,
      },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}