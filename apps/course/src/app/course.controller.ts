import {
  Controller,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CoursesDto, MESSAGE_PATTERNS } from '@workspace/shared';
import { MessagePattern, Payload } from '@nestjs/microservices';

const {
  GET_COURSE,
  GET_CART_COURSE,
  REMOVE_ALL_CART_COURSE,
  REMOVE_SINGLE_CART_COURSE,
  GET_SINGLE_COURSE,
  ADD_COURSE,
  DELETE_COURSE,
  ADD_TO_CART,
} = MESSAGE_PATTERNS.COURSE;

@Controller()
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

  @MessagePattern(ADD_TO_CART)
  addToCart(@Payload() payload) {
    return this.courseService.addToCart(payload);
  }

  @MessagePattern(REMOVE_SINGLE_CART_COURSE)
  removeSingleCartCourse(@Payload() payload) {
    return this.courseService.removeSingleCartCourse(payload);
  }

 @MessagePattern(GET_SINGLE_COURSE)
  getCourseById(@Payload() payload) {
    return this.courseService.getCourseById(payload);
  }

  @MessagePattern(ADD_COURSE)
  postCourse(courseDto: CoursesDto) {
    return this.courseService.postCourse(courseDto);
  }

 @MessagePattern(DELETE_COURSE)
  deleteCourse(@Payload() payload) {
    return this.courseService.deleteCourse(payload);
  }
}
