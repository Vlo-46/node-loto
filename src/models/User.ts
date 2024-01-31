import {Schema, model, Model} from 'mongoose'
import {IUser} from "../interfaces/user";

const UserSchema = new Schema<IUser>(
  {
      name: {type: String, required: true},
      lastName: {type: String, required: true},
      email: {type: String, required: true, unique: true},
      password: {type: String, required: true},
      wins: {type: Number, default: 0},
      losses: {type: Number, default: 0},
  },
  {timestamps: true}
);

export const User: Model<IUser> = model('User', UserSchema)