import { Course, CoursesDto } from '@workspace/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async getCourse() {
    return this.courseModel.aggregate([
      {
        $project: {
          name: 1,
          teacherName: 1,
          price: 1,
          _id: 1,
        },
      },
    ]);
  }
  
async getCartCourse() {
  const cartArray = await this.courseModel.find({ isAddedToCart: true }).exec();

  if (!cartArray || cartArray.length === 0) {
    throw new NotFoundException('Cart is empty');
  }

  return cartArray;
}

async removeSingleCartCourse(id: string) {
  const selectedCartCourse = await this.courseModel.findOne({ _id: id });
  if (!selectedCartCourse) {
    throw new NotFoundException('Course not found');
  }

  if (!selectedCartCourse.isAddedToCart) {
    throw new NotFoundException('Course is not in the cart');
  }

  selectedCartCourse.isAddedToCart = false;
  await selectedCartCourse.save();
  return { message: 'Remove selected Cart course successfully' };
}

async removeAllCartCourse() {
  const cartCourses = await this.courseModel.find({ isAddedToCart: true });

  if (!cartCourses || cartCourses.length === 0) {
    throw new NotFoundException('No courses found in the cart');
  }

  await this.courseModel.updateMany(
    { isAddedToCart: true },
    { $set: { isAddedToCart: false } },
  );

  return { message: 'All cart courses removed successfully' };
}

  async getCourseById(id: string) {
    const singleCourse = await this.courseModel
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
          },
        },
        {
          $project: {
            name: 1,
            teacherName: 1,
            price: 1,
            _id: 1,
          },
        },
      ])
      .exec();
    if (!singleCourse) throw new NotFoundException('course not found');
    return singleCourse[0];
  }

  async postCourse(coursesDto: Partial<CoursesDto>) {
    const createdCourse = await new this.courseModel({ ...coursesDto }).save();
    return createdCourse.save();
  }

  async deleteCourse(id: string) {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

    if (!deletedCourse) {
      throw new NotFoundException('course not found');
    }
    return { message: 'course Deleted', course: deletedCourse };
  }

}
