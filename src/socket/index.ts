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
    if (!currentRoom || currentRoom.users.length >= 5) {
        io.emit('userExist')
        return
    }

    const isUserExist = !!currentRoom.users.find((u: IUser) => !(u._id instanceof Types.ObjectId) || u._id.equals(user._id))

    let updatedRoom: any = await Room.findById(roomId)
      .populate(['users', 'author', 'expectedNumbers'])
      .exec();

    updatedRoom = await Room.populate(updatedRoom, {path: 'users', populate: {path: 'tickets'}})

    if (!isUserExist) {
        const generatedTickets = createTickets()
        const tickets = await Ticket.create({
            data: generatedTickets,
            user: user._id
        })

        await User.findByIdAndUpdate(
          user._id,
          {
              $push: {tickets: tickets._id},
          },
          {new: true}
        );

        updatedRoom = await Room.findByIdAndUpdate(
          roomId,
          {
              $push: {users: user._id},
          },
          {
              new: true,
              returnOriginal: false,
              populate: ['users', 'author']
          }
        );

        const roomWithUsersAndTickets = await Room.populate(updatedRoom, {path: 'users', populate: {path: 'tickets'}});
        io.emit('roomData', roomWithUsersAndTickets)
    }

    io.emit('roomData', updatedRoom)
    const allRooms: any = await Room.find().populate('users').exec();
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
    socket.emit('gameIsStarted', updatedRoom.gameIsStarted)
}

export async function checkCreationRoomRule(socket: Socket, io: any, user: IUser) {
    const canCreate = await Room.findOne({author: user._id})
    socket.emit('canCreateRoom', !!canCreate)
}

export async function checkSelected(socket: Socket, io: any, user: IUser, roomId: string, num: number) {
    const updatedRoom = await Room.findById(roomId)
      .populate(['users', 'expectedNumbers'])
      .exec();

    const populatedRoom: any = await Room.populate(updatedRoom, {path: 'users', populate: {path: 'tickets'}});
    const currentUser = populatedRoom.users.find((u: IUser) => !(u._id instanceof Types.ObjectId) || u._id.equals(user._id));

    if (currentUser) {
        currentUser.tickets.data = currentUser.tickets.data?.map((data: any) =>
          data?.map((item: any) =>
            item.map((i: any) =>
              i && i.num === num ? {...i, selected: true} : i
            )
          )
        );

        await Ticket.findOneAndUpdate({user: user._id}, {data: currentUser.tickets?.data});
    }

    const updatedRoomAfterUpdate = await Room.populate(updatedRoom, {path: 'users', populate: {path: 'tickets'}});
    io.emit('roomData', updatedRoomAfterUpdate);
}

export async function checkNotMarkedItems(socket: Socket, io: any, user: IUser, roomId: string, num: number) {
    const updatedRoom = await Room.findById(roomId)
      .populate(['users', 'expectedNumbers'])
      .exec();

    const populatedRoom: any = await Room.populate(updatedRoom, {path: 'users', populate: {path: 'tickets'}});
    const currentUser = populatedRoom.users.find((u: IUser) => !(u._id instanceof Types.ObjectId) || u._id.equals(user._id));

    if (currentUser) {
        currentUser.tickets.data = currentUser.tickets?.data?.map((data: any) => {
            return data?.map((item: any) =>
              item.map((i: any) =>
                i && i.num === num && !i.selected ? {...i, notMarked: true} : i
              )
            )
        });

        await Ticket.findOneAndUpdate({user: user._id}, {data: currentUser.tickets.data});
    }

    const updatedRoomAfterUpdate = await Room.populate(updatedRoom, {path: 'users', populate: {path: 'tickets'}});
    io.emit('roomData', updatedRoomAfterUpdate);
}

export async function finishGame(socket: Socket, io: any, users: any, roomId: string, winners: boolean) {
    io.emit('finishGame', {
        winners: winners ? {
            winner: "test"
        } : false
    })
    const userIds = users.map((user: any) => user._id);

    await User.updateMany({_id: {$in: userIds}}, {$inc: {losses: 1}});
    await User.updateMany({_id: {$in: userIds}}, {$unset: {'tickets': 1}});
    await ExpectedNumber.deleteMany({user: {$in: userIds}});
    await Ticket.deleteMany({user: {$in: userIds}});
    await Room.findByIdAndDelete(roomId)
}