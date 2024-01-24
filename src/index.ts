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
        origin: 'http://localhost:3001',
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
let gameIsStarted = false

io.on('connection', (socket: any) => {
    socket.on('join', (user: IConnectedUser) => {
        connectedUsers.push({...user, id: socket.id});
        io.emit('updateUsers', connectedUsers);
    });

    socket.on('ready', (isReady: boolean) => {
        connectedUsers.forEach((user) => {
            if (user.id === socket.id) {
                user.isReady = isReady
            }
        })

        const allUsersReady = connectedUsers.every(user => user.isReady);
        io.emit('usersReady', allUsersReady);
        io.emit('updateUsers', connectedUsers)
    });

    socket.on('startGame', (bool: boolean) => {
        gameIsStarted = bool
        socket.emit('startGame', gameIsStarted)
    })

    socket.on('winner', (name: string) => {
        io.emit('gameOver', name);
        gameIsStarted = false
    });

    socket.on('disconnect', () => {
        const userIndex = connectedUsers.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            connectedUsers.splice(userIndex, 1);
            io.emit('updateUsers', connectedUsers);
        }


        if (connectedUsers.length === 1 && gameIsStarted) {
            io.emit('gameOver', connectedUsers[0].name)
            gameIsStarted = false
        }
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

connectToDatabase()
  .then(() => {
      http.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((err) => {
      console.log('Connection error', err)
  })

