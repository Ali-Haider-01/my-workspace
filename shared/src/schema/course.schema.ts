import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Course extends Document {
  @Prop({
    required: true,
  })
  name: string;
  @Prop({
    required: true,
  })
  teacherName: string;
  @Prop()
  price?: number;
  @Prop()
  isAddedToCart: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
