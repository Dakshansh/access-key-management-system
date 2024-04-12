import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';;

@Schema({ versionKey: false, timestamps: true })
export class AccessKey extends AbstractDocument {
  @Prop({ type:String,unique: true })
  key: string;

  @Prop({type:Number})
  rateLimit: number;

  @Prop({type:Date})
  expirationDate: Date;

  @Prop({ type:Boolean ,default: true })
  isActive: boolean;
}

export const AccessKeySchema = SchemaFactory.createForClass(AccessKey);