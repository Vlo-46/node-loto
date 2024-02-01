import {Schema, model, Model} from 'mongoose'
import {IRoom} from '../interfaces/loto'

interface IRoomDocument extends IRoom, Document {
    expectedNumbers: Schema.Types.ObjectId;
}

const RoomSchema = new Schema<IRoomDocument>(
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
      expectedNumbers: {
          type: Schema.Types.ObjectId,
          ref: "ExpectedNumber"
      }
  },
  {timestamps: true}
)

RoomSchema.post('findOneAndDelete', async function (doc: IRoomDocument | null) {
    if (doc) {
        try {
            // Remove the associated ExpectedNumber
            await model('ExpectedNumber').findByIdAndDelete(doc.expectedNumbers);
        } catch (error) {
            console.error(error);
        }
    }
});

export const Room: Model<IRoomDocument> = model('Room', RoomSchema)

