import { Student, StudentDto } from '@workspace/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async getAllStudents(studentFilterDto: any): Promise<any> {
    return this.studentModel.aggregate([
      {
        $match: {
          ...(studentFilterDto.name && {name: studentFilterDto.name}),
          ...(studentFilterDto.email && { email: studentFilterDto.email }),
          age: {
            $gte: studentFilterDto.minAge || 0,
            $lte: studentFilterDto.maxAge || Number.MAX_SAFE_INTEGER,
          },
          rollNumber: {
            $gte: studentFilterDto.minRollNumber || 0,
            $lte: studentFilterDto.maxRollNumber || Number.MAX_SAFE_INTEGER,
          },
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseIds',
          foreignField: '_id',
          as: 'courseDetails',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          age: 1,
          email: 1,
          address: 1,
          rollNumber: 1,
          createdAt: 1,
          updatedAt: 1,
          courseDetails: {
            _id: 1,
            name: 1,
            teacherName: 1,
            price: 1,
          },
        },
      },
    ]);
  }

  async postStudent(studentDto: Partial<StudentDto>) {
    const createdStudent = await new this.studentModel({
      ...studentDto,
    });
    return createdStudent.save();
  }

  async getStudentById(id: string) {
    const student = await this.studentModel
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(id),
          },
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'courseIds',
            foreignField: '_id',
            as: 'courseDetails',
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            age: 1,
            email: 1,
            address: 1,
            rollNumber: 1,
            createdAt: 1,
            updatedAt: 1,
            courseDetails: {
              _id: 1,
              name: 1,
              teacherName: 1,
              price: 1,
            },
          },
        },
      ])
      .exec();
    if (!student) throw new NotFoundException('student not found');
    return student[0];
  }

  async putStudent(id: string, studentDto: Partial<StudentDto>) {
    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(
        id,
        {
          name: studentDto.name ?? null,
          age: studentDto.age ?? null,
          email: studentDto.email ?? null,
        },
        {
          new: true,
          overwrite: true,
        },
      )
      .exec();
    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }
    return updatedStudent;
  }

  async patchStudent(id: string, studentDto: Partial<StudentDto>) {
    const updatedStudent = await this.studentModel
      .findByIdAndUpdate(id, studentDto, { new: true })
      .exec();
    if (!updatedStudent) {
      throw new NotFoundException('Student not found');
    }
    return updatedStudent;
  }

  async deleteStudent(id: string): Promise<{ message: string; student: any }> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id).exec();

    if (!deletedStudent) {
      throw new NotFoundException('Student not found');
    }
    return { message: 'Student Deleted', student: deletedStudent };
  }
}
