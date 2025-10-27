import { Prop, Schema } from '@nestjs/mongoose';

@Schema({versionKey: false})
export class Address {
  @Prop()
  house: number;
  @Prop()
  street: number;
  @Prop()
  city: string;
}
