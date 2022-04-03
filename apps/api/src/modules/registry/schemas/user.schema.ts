import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IUser } from "@thesis/api-interfaces";
import { Document } from "mongoose";

@Schema({
  timestamps: true,
  toJSON: {
    versionKey: false,
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
    }
  }
})

export class User implements Omit<IUser, "id" | "createdAt" | "updatedAt"> {
  @Prop({ type: String, required: true })
  first_name: string;

  @Prop({ type: String, required: true })
  last_name: string;

  @Prop({ type: String })
  middle_name: string;

  @Prop({ type: Date, required: true })
  birthday: Date;

  @Prop({ type: String, required: true, unique: true })
  phone: string;

  @Prop({ type: String, required: true, unique: true })
  tax_id: string;

  @Prop({ type: String, required: true, unique: true })
  passport: string;

  @Prop({ type: String, required: true })
  address: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
