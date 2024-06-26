import {IUser} from "./user";

export interface IRoom {
    _id: string
    roomName: string
    users: Partial<IUser>[]
    gameIsStarted: boolean
    author: any
    tickets: any
    expectedNumbers: any
}