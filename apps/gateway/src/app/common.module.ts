import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CourseController } from './common/controller/course.controller';
import { StudentController } from './common/controller/student.controller';
import { UserController } from './common/controller/user.controller';
import { ALL_SERVICE_PROVIDERS, SERVICE_PROVIDERS } from './common/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    CourseController,
    StudentController,
    UserController,
  ],
  providers: [...SERVICE_PROVIDERS, ALL_SERVICE_PROVIDERS],
  exports: [...SERVICE_PROVIDERS],
})
export class CommonModule {}
