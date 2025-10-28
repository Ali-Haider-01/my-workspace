import {
  Controller,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { MESSAGE_PATTERNS, StudentDto, StudentFilterDto } from '@workspace/shared';
import { MessagePattern } from '@nestjs/microservices';

const {
  ALL_STUDENTS,
  SINGLE_STUDENT,
  ADD_STUDENT,
  PUT_STUDENT,
  PATCH_STUDENT,
  DELETE_STUDENT,
} = MESSAGE_PATTERNS.STUDENT;

@Controller()
export class StudentController {
  constructor(private readonly studentService: StudentService) { }

  @MessagePattern(ALL_STUDENTS)
  getAllStudents(studentFilterDto: StudentFilterDto) {
    return this.studentService.getAllStudents(studentFilterDto);
  }

  @MessagePattern(SINGLE_STUDENT)
  getStudentById(id: string) {
    return this.studentService.getStudentById(id);
  }

  @MessagePattern(ADD_STUDENT)
  postStudent(studentDto: StudentDto) {
    return this.studentService.postStudent(studentDto);
  }

  @MessagePattern(PUT_STUDENT)
  putStudent(data: { id: string; studentDto: StudentDto }) {
    return this.studentService.putStudent(data.id, data.studentDto);
  }

  @MessagePattern(PATCH_STUDENT)
  patchStudent(data: { id: string; studentDto: StudentDto }) {
    return this.studentService.patchStudent(data.id, data.studentDto);
  }

  @MessagePattern(DELETE_STUDENT)
  deleteStudent(id: string) {
    return this.studentService.deleteStudent(id);
  }
}
