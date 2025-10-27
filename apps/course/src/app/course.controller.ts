import {
  Body,
  Controller,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { Auth, CoursesDto, MESSAGE_PATTERNS } from '@workspace/shared';
import { MessagePattern } from '@nestjs/microservices';

const {
  GET_COURSE,
  GET_CART_COURSE,
  REMOVE_ALL_CART_COURSE,
  REMOVE_SINGLE_CART_COURSE,
  GET_SINGLE_COURSE,
  ADD_COURSE,
  DELETE_COURSE
} = MESSAGE_PATTERNS.COURSE;

@Controller('course')
@ApiBearerAuth()
@Auth()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @MessagePattern(GET_COURSE)
  getCourse() {
    return this.courseService.getCourse();
  }

  @MessagePattern(GET_CART_COURSE)
  getCartCourse() {
    return this.courseService.getCartCourse();
  }

  @MessagePattern(REMOVE_ALL_CART_COURSE)
  removeAllCartCourse() {
    return this.courseService.removeAllCartCourse();
  }

  @MessagePattern(REMOVE_SINGLE_CART_COURSE)
  removeSingleCartCourse(@Param('id') id: string) {
    return this.courseService.removeSingleCartCourse(id);
  }

 @MessagePattern(GET_SINGLE_COURSE)
  getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @MessagePattern(ADD_COURSE)
  postCourse(@Body() courseDto: CoursesDto) {
    return this.courseService.postCourse(courseDto);
  }

 @MessagePattern(DELETE_COURSE)
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
