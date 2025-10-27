import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, CoursesDto, MESSAGE_PATTERNS, SERVICES } from '@workspace/shared';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const {
  GET_COURSE,
  GET_CART_COURSE,
  REMOVE_ALL_CART_COURSE,
  REMOVE_SINGLE_CART_COURSE,
  GET_SINGLE_COURSE,
  ADD_COURSE,
  DELETE_COURSE,
} = MESSAGE_PATTERNS.COURSE;

@Controller('course')
@ApiBearerAuth()
@Auth()
@ApiTags('course')
export class CourseController {
  constructor(@Inject(SERVICES.COURSE) private readonly courseClient: ClientRMQ) {}

  @Get('/get-course')
  async getCourse() {
    return await firstValueFrom(this.courseClient.send(GET_COURSE, {}));
  }

  @Get('/get-cart-course')
  async getCartCourse() {
    return await firstValueFrom(this.courseClient.send( GET_CART_COURSE, {}));
  }

  @Patch('/remove-all-cart-course')
  async removeAllCartCourse() {
    return await firstValueFrom(
      this.courseClient.send(REMOVE_ALL_CART_COURSE, {})
    );
  }

  @Put('/remove-single-cart-course/:id')
  async removeSingleCartCourse(@Param('id') id: string) {
    return await firstValueFrom(
      this.courseClient.send(REMOVE_SINGLE_CART_COURSE, id)
    );
  }

  @Get('/get-single-course/:id')
  async getCourseById(@Param('id') id: string) {
    return await firstValueFrom(
      this.courseClient.send(GET_SINGLE_COURSE, id)
    );
  }

  @Post('/add-course')
  async postCourse(@Body() courseDto: CoursesDto) {
    return await firstValueFrom(
      this.courseClient.send(ADD_COURSE, courseDto)
    );
  }

  @Delete('/delete-course/:id')
  async deleteCourse(@Param('id') id: string) {
    return await firstValueFrom(
      this.courseClient.send(DELETE_COURSE, id)
    );
  }
}
