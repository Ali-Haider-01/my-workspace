import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Address } from '@workspace/shared';

@Schema({ timestamps: true, versionKey: false })
export class Student extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name!: string;

  @Prop({
    type: Number,
    required: true,
  })
  age!: number;

  @Prop()
  email?: string;

  @Prop({ type: [Address] })
  address?: [Address];

  @Prop({
    type: Number,
    required: true,
  })
  rollNumber!: number;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Course' })
  courseIds?: string[];
}

export const StudentSchema = SchemaFactory.createForClass(Student);
