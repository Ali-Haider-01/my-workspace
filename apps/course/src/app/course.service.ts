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
    const cartArray = await this.courseModel
      .find({ isAddedToCart: true })
      .exec();

    if (!cartArray || cartArray.length === 0) {
      throw new NotFoundException('Cart is empty');
    }

    return cartArray;
  }

  async addToCart(payload) {
    await this.courseModel.findOneAndUpdate({
     _id: payload.id,
     isAddedToCart: false,
   }, { $set: { isAddedToCart: true } });

   return { message: 'Add course from your cart successfully' };
 }

  async removeSingleCartCourse(payload) {
     await this.courseModel.findOneAndUpdate({
      _id: payload.id,
      isAddedToCart: true,
    }, { $set: { isAddedToCart: false } });

    return { message: 'Remove course from your cart successfully' };
  }

  async removeAllCartCourse() {
    const cartCourses = await this.courseModel.find({ isAddedToCart: true });

    if (!cartCourses || cartCourses.length === 0) {
      throw new NotFoundException('No courses found in the cart');
    }

    await this.courseModel.updateMany(
      { isAddedToCart: true },
      { $set: { isAddedToCart: false } }
    );

    return { message: 'All cart courses removed successfully' };
  }

  async getCourseById(payload) {
    const singleCourse = await this.courseModel
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(payload.id),
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

  async deleteCourse(payload) {
    const deletedCourse = await this.courseModel.findByIdAndDelete(payload.id).exec();

    if (!deletedCourse) {
      throw new NotFoundException('course not found');
    }
    return { message: 'course Deleted', course: deletedCourse };
  }
}
