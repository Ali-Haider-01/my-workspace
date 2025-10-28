import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';

class AddressDto {
  @IsNumber()
  @ApiProperty({ example: 89 })
  house!: number;

  @IsNumber()
  @ApiProperty({ example: 2 })
  street?: number;

  @IsString()
  @ApiProperty({ example: 'lahore' })
  city!: string;
}

export class StudentDto {
  @IsString()
  @ApiProperty({
    example: 'name',
    type: String,
  })
  name!: string;

  @IsInt()
  @ApiProperty({
    example: 18,
    type: Number,
  })
  age!: number;

  @IsString()
  @ApiProperty({
    example: 'example@gmail.com',
    type: String,
  })
  email?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty({ type: [AddressDto] })
  address?: [AddressDto];
  @IsInt()
  @ApiProperty({
    example: 18,
    type: Number,
  })
  rollNumber!: number;


  @ApiProperty({ 
    example: ['64a823fab7f481d3be03d5b6', '64a823fab7f481d3be03d5b7'],
    type: [String],
    description: 'Array of course IDs'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  courseIds?: string[];
}

export class StudentFilterDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  @ApiProperty({
    example: '',
    required: false,
    type: String,
  })
  name?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  @ApiProperty({
    example: '',
    required: false,
    type: String,
  })
  email?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    example: null,
    required: false,
    type: Number,
  })
  minAge?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    example: null,
    required: false,
    type: Number,
  })
  maxAge?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    example: null,
    required: false,
    type: Number,
  })
  minRollNumber?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    example: null,
    required: false,
    type: Number,
  })
  maxRollNumber?: number;
}
