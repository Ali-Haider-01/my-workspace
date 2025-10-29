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
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, MESSAGE_PATTERNS, SERVICES, StudentDto, StudentFilterDto } from '@workspace/shared';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

const {
  ALL_STUDENTS,
  SINGLE_STUDENT,
  ADD_STUDENT,
  PUT_STUDENT,
  PATCH_STUDENT,
  DELETE_STUDENT,
} = MESSAGE_PATTERNS.STUDENT;

@Controller()
@ApiBearerAuth()
@Auth()
@ApiTags('student')
export class StudentController {
  constructor(@Inject(SERVICES.STUDENT) private readonly studentClient: ClientRMQ) { }

  @Get('/all-students')
  async getAllStudents(@Query() studentFilterDto: StudentFilterDto) {
    try {
      return await firstValueFrom(this.studentClient.send(ALL_STUDENTS, studentFilterDto));
    } catch (error) {
      console.error('Gateway getAllStudents error:', error);
      throw error;
    }
  }

  @Get('/single-student/:id')
  async getStudentById(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.studentClient.send(SINGLE_STUDENT, {id}));
    } catch (error) {
      console.error('Gateway getStudentById error:', error);
      throw error;
    }
  }

  @Post('/add-student')
  async postStudent(@Body() studentDto: StudentDto) {
    try {
      return await firstValueFrom(this.studentClient.send(ADD_STUDENT, studentDto));
    } catch (error) {
      console.error('Gateway postStudent error:', error);
      throw error;
    }
  }

  @Put('/put-student/:id')
  async putStudent(@Param('id') id: string, @Body() studentDto: StudentDto) {
    try {
      return await firstValueFrom(this.studentClient.send(PUT_STUDENT, { id, studentDto }));
    } catch (error) {
      console.error('Gateway putStudent error:', error);
      throw error;
    }
  }

  @Patch('/patch-student/:id')
  async patchStudent(@Param('id') id: string, @Body() studentDto: StudentDto) {
    try {
      return await firstValueFrom(this.studentClient.send(PATCH_STUDENT, { id, studentDto }));
    } catch (error) {
      console.error('Gateway patchStudent error:', error);
      throw error;
    }
  }

  @Delete('/delete-student/:id')
  async deleteStudent(@Param('id') id: string) {
    try {
      return await firstValueFrom(this.studentClient.send(DELETE_STUDENT, {id}));
    } catch (error) {
      console.error('Gateway deleteStudent error:', error);
      throw error;
    }
  }
}
