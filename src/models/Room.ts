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
      author: {
          type: Schema.Types.ObjectId,
          ref: 'User',
      },
      tickets: {
          type: Schema.Types.ObjectId,
          ref: "Ticket",
      },
      expectedNumbers: {
          type: Schema.Types.ObjectId,
          ref: "ExpectedNumber"
      }
  },
  {timestamps: true}
)

export const Room: Model<IRoom> = model('Room', RoomSchema)

