// api/src/types/user.ts
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password?: string;
  picture?: string;
  role: "user" | "admin";
  provider: "local" | "google";
}

const userSchema = new Schema<IUser>(
  {
    _id: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    picture: { type: String, required: false },
    role: { type: String, default: "user" },
    provider: { type: String, default: "local" },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
