import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourseController } from './common/controller/course.controller';
import { StudentController } from './common/controller/student.controller';
import { UserController } from './common/controller/user.controller';
import { ALL_SERVICE_PROVIDERS, SERVICE_PROVIDERS } from './common/service';
import { JwtStrategy } from './common/guards/jwt.strategy';
import Joi from 'joi';
import { SERVICES } from '@workspace/shared';


const schemaObject = {
  // RMQ Configuration
  RMQ_URI: Joi.string().required(),
  [`RMQ_${SERVICES.GATEWAY}_QUEUE`]: Joi.string().required(),

  // Mongo DB Configuration
  GATEWAY_PORT: Joi.number().default(8000),
        
  // JWT Configuration
  JWT_KEY: Joi.string().required(),
  
  RMQ_USER_QUEUE: Joi.string().required(),
  RMQ_STUDENT_QUEUE: Joi.string().required(),
  RMQ_COURSE_QUEUE: Joi.string().required(),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object(schemaObject),
    })],
  controllers: [
    UserController,
    CourseController,
    StudentController,
  ],
  providers: [...SERVICE_PROVIDERS, ALL_SERVICE_PROVIDERS, JwtStrategy],
  exports: [...SERVICE_PROVIDERS],
})
export class CommonModule {}
