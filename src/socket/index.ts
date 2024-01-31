import {Socket} from "socket.io-client";
import {Room} from "../models/Room";
import {IUser} from "../interfaces/user";
import {Types} from "mongoose";
import {User} from "../models/User";

export async function getRooms(socket: Socket) {
    const allRooms: any = await Room.find()
    socket.emit('updateRooms', allRooms)
}

export async function newRoom(socket: Socket, roomName: string, io: any, user: IUser) {
    await Room.create({
        roomName,
        users: [],
    })
    const allRooms: any = await Room.find()
    io.emit('updateRooms', allRooms)
}

export async function joinToRoom(socket: Socket, roomId: string, io: any, user: IUser) {
    const currentRoom: any = await Room.findById(roomId).populate('users').exec()
    if (!currentRoom || currentRoom.users.length >= 5 || !!currentRoom.users.find((u: IUser) => !(u._id instanceof Types.ObjectId) || u._id.equals(user._id))) {
        console.log('user is exist')
        return
    }

    const updatedRoom: any = await Room.findByIdAndUpdate(
      roomId,
      {$push: {users: user._id}},
      {new: true, returnOriginal: false, populate: 'users'}
    );

    const allRooms: any = await Room.find().populate('users').exec();
    io.emit('updateUsers', updatedRoom.users);
    io.emit('updateRooms', allRooms)
}

export async function checkWinner(socket: Socket, user: IUser, io: any) {
    const updatedUser: any = await User.findByIdAndUpdate(
      user._id,
      {$inc: {wins: 1}},
      {new: true, returnOriginal: false}
    );
    io.emit('gameOver', updatedUser.name);
}

export async function startGame(socket: Socket, roomId: string) {
    const updatedRoom: any = await Room.findByIdAndUpdate(
      roomId,
      {gameIsStarted: true},
      {new: true, returnOriginal: false, populate: 'users'}
    );
    socket.emit('startGame', updatedRoom.gameIsStarted)
}