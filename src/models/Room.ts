import {Schema, model, Model} from 'mongoose'
import {IRoom} from '../interfaces/loto'

const RoomSchema = new Schema<IRoom>(
  {
      roomName: {
          type: String,
          required: true
      },
      users: [
          {
              type: Schema.Types.ObjectId,
              ref: 'User',
          },
      ],
      gameIsStarted: {
          type: Boolean,
          default: false
      },
  },
  {timestamps: true}
)

export const Room: Model<IRoom> = model('Room', RoomSchema)

