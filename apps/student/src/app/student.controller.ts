import {
  Body,
  Controller,
  Param,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { Auth, MESSAGE_PATTERNS, StudentDto, StudentFilterDto } from '@workspace/shared';
import { MessagePattern } from '@nestjs/microservices';

const {
  ALL_STUDENTS,
  SINGLE_STUDENT,
  ADD_STUDENT,
  PUT_STUDENT,
  PATCH_STUDENT,
  DELETE_STUDENT,
} = MESSAGE_PATTERNS.STUDENT;

@Controller('student')
@ApiBearerAuth()
@Auth()
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @MessagePattern(ALL_STUDENTS)
  getAllStudents(@Query() studentFilterDto: StudentFilterDto) {
    return this.studentService.getAllStudents(studentFilterDto);
  }

  @MessagePattern(SINGLE_STUDENT)
  getStudentById(@Param('id') id: string) {
    return this.studentService.getStudentById(id);
  }

  @MessagePattern(ADD_STUDENT)
  postStudent(@Body() studentDto: StudentDto) {
    return this.studentService.postStudent(studentDto);
  }

  @MessagePattern(PUT_STUDENT)
  putStudent(@Param('id') id: string, @Body() studentDto: StudentDto) {
    return this.studentService.putStudent(id, studentDto);
  }

  @MessagePattern(PATCH_STUDENT)
  patchStudent(@Param('id') id: string, @Body() studentDto: StudentDto) {
    return this.studentService.patchStudent(id, studentDto);
  }

  @MessagePattern(DELETE_STUDENT)
  deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
