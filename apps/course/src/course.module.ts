import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema, SERVICES} from '@workspace/shared';
import { CourseController } from './app/course.controller';
import { CourseService } from './app/course.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

const schemaObject = {
  // RMQ Configuration
  RMQ_URI: Joi.string().required(),
  [`RMQ_${SERVICES.COURSE}_QUEUE`]: Joi.string().required(),

  // Mongo DB Configuration
  MONGODB_URI: Joi.string().required(),
  MONGODB_COURSE: Joi.string().required(),
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
        dbName: configService.get('MONGODB_COURSE'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}