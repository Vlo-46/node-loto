import {Schema, model, Model} from 'mongoose'

const ExpectedNumberSchema = new Schema<any>(
    {
        numbers: {
            type: Array,
            required: true
        },
    },
    {timestamps: true}
)

export const ExpectedNumber: Model<any> = model('ExpectedNumber', ExpectedNumberSchema)

