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

// routes

import indexRoute from './routes'
import authRoute from './routes/auth'
import poemsRoute from './routes/poems'
import usersRoute from './routes/users'
import commentsRoute from './routes/comments'

app.use('/', indexRoute);
app.use('/auth', authRoute);
app.use('/poems', poemsRoute);
app.use('/users', usersRoute);
app.use('/comment', commentsRoute);

// database
import { connectToDatabase } from './database';

connectToDatabase()
  .then(() => {
      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  })
  .catch((err) => {
      console.log('Connection error', err)
  })

