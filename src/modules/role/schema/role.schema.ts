import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true, unique: true })
  role: string; // e.g., 'admin', 'user'

  @Prop({ required: true })
  roleGroup: string; // e.g., 'management', 'customer'

  @Prop()
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

