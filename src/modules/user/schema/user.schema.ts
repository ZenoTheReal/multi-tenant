import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], index:true })
  roles: Types.ObjectId[];

  @Prop({ default: () => `db_${uuidv4().replace(/-/g, '')}`, index: true })
  tenantId: string;

  @Prop({ default: false, index: true })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ tenantId: 1, email: 1 });
