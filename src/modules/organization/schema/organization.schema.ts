import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as crypto from 'crypto';

@Schema({ timestamps: true })
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  orgCode: string;

  @Prop({ required: true, unique: true })
  tenantId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

OrganizationSchema.pre('save', async function (next: any) {
  if (!this.orgCode) {
    let isUnique = false;
    let newCode = '';
    while (!isUnique) {
      newCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      // Check if code already exists
      const existing = await (this.constructor as any).findOne({ orgCode: newCode }).exec();
      if (!existing) {
        isUnique = true;
      }
    }
    this.orgCode = newCode;
  }
  next();
});
