import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CoursesDto {

  @IsString()
  @ApiProperty({
    example: 'Evening Mathematics',
    description: 'Name of the course',
  })
  name: string;

  @IsString()
  @ApiProperty({
    example: 'Amir Khan',
    description: 'Name of the teacher',
  })
  teacherName?: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    example: 2500,
    description: 'Price of the course',
  })
  price: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Indicates whether the course is added to cart',
  })
  isAddedToCart?: boolean;
}
