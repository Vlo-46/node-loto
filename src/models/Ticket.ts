import {Schema, model, Model} from 'mongoose'

const TicketsSchema = new Schema<any>(
    {
        data: {
            type: Array,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps: true}
)

export const Ticket: Model<any> = model('Ticket', TicketsSchema)

