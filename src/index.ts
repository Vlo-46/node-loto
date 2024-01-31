import express from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

// middlewares

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors())

app.use(helmet());
app.use(compression());

morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
})

// sockets

interface IConnectedUser {
    id: string
    name: string
    isReady: boolean
}

let connectedUsers: IConnectedUser[] = [];

io.on('connection', (socket: any) => {
    socket.on('startGame', (roomId: string) => startGame(socket, roomId))

    // socket.on('winner', async (user: IUser) => await checkWinner(socket, user, io));

    socket.on('getRooms', async () => await getRooms(socket))

    socket.on('createRoom', async ({roomName, user}: {roomName: string, user: IUser}) => await newRoom(socket, roomName, io, user))

    socket.on('joinToRoom', async ({roomId, user}: {roomId: string, user: IUser}) => await joinToRoom(socket, roomId, io, user))

    socket.on('disconnect', () => {
        const userIndex = connectedUsers.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            connectedUsers.splice(userIndex, 1);
            io.emit('updateUsers', connectedUsers);
        }

        // if (connectedUsers.length === 1 && gameIsStarted) {
        //     io.emit('gameOver', connectedUsers[0].name)
        //     gameIsStarted = false
        // }
    });
});

// routes

import indexRoute from './routes'
import authRoute from './routes/auth'
import usersRoute from './routes/users'
import settingsRoute from './routes/settings'

app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/settings', settingsRoute);

// database
import { connectToDatabase } from './database';
import {Room} from "./models/Room";
import {checkWinner, getRooms, joinToRoom, newRoom, startGame} from "./socket";
import {IUser} from "./interfaces/user";

connectToDatabase()
  .then(() => {
      http.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((err) => {
      console.log('Connection error', err)
  })

