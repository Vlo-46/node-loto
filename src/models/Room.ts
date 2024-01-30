import {Schema, model, Model} from 'mongoose'
import {IRoom} from '../interfaces/loto'

const RoomSchema = new Schema<IRoom>(
  {
      roomName: {
          type: String,
          required: true
      },
      users: {
          type: Number,
          required: true
      }
  },
  {timestamps: true}
)

export const Room: Model<IRoom> = model('Room', RoomSchema)

