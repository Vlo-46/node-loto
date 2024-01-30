export interface IRoom {
    roomName: {
        type: String,
        required: true
    },
    users: {
        type: Number,
        required: true
    }
}