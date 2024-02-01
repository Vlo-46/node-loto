import {Socket} from "socket.io-client";
import {Types} from "mongoose";
import {Room} from "../models/Room";
import {User} from "../models/User";
import {ExpectedNumber} from "../models/ExpectedNumbers";
import {IUser} from "../interfaces/user";
import {Ticket} from "../models/Ticket";
import {createTickets, generateExpectedNumbers} from "../helpers/loto";

export async function getRooms(socket: Socket) {
    const allRooms: any = await Room.find()
    socket.emit('updateRooms', allRooms)
}

export async function newRoom(socket: Socket, roomName: string, io: any, user: IUser) {
    const generatedExpectedNumbers = generateExpectedNumbers()
    const expectedNumbers = await ExpectedNumber.create({
        numbers: generatedExpectedNumbers
    })

    await Room.create({
        roomName,
        users: [],
        author: user._id,
        expectedNumbers: expectedNumbers._id
    })

    const allRooms: any = await Room.find()
    io.emit('updateRooms', allRooms)
}

export async function joinToRoom(socket: Socket, roomId: string, io: any, user: IUser) {
    const currentRoom: any = await Room.findById(roomId).populate('users').exec()
    if (!currentRoom || currentRoom.users.length >= 5 || !!currentRoom.users.find((u: IUser) => !(u._id instanceof Types.ObjectId) || u._id.equals(user._id))) {
        console.log('user is exist')
        io.emit('userExist')
        return
    }

    const generatedTickets = createTickets()
    const tickets = await Ticket.create({
        data: generatedTickets,
        user: user._id
    })

    await User.findByIdAndUpdate(
      user._id,
      {
          $push: { tickets: tickets._id },
      },
      { new: true }
    );

    const updatedRoom: any = await Room.findByIdAndUpdate(
      roomId,
      {
          $push: {users: user._id},
      },
      {
          new: true,
          returnOriginal: false,
          populate: ['users', 'expectedNumbers', 'author']
      }
    );

    const roomWithUsersAndTickets = await Room.populate(updatedRoom, { path: 'users', populate: { path: 'tickets' } });

    const allRooms: any = await Room.find().populate('users').exec();
    io.emit('updateRooms', allRooms)
    io.emit('roomData', roomWithUsersAndTickets)
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