import express from 'express';
import { AppRouter } from './AppRouter.js';
import path from 'path';
import bodyParser from 'body-parser';
import { rootDir } from './util/path.js';
import './controllers/rootController.js';
import mongoose from 'mongoose';
import { Request } from './controllers/rootController.js';
import { User } from './models/user.js';
import cors from 'cors';
import { config } from 'dotenv';
config({ path: '.env' });

function formatCookie(cookie?: string) {
  if (cookie) {
    return cookie.split(';').reduce<Record<string, string>>((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key.trim()] = value.trim();
      return acc;
    }, {});
  }
  return {};
}

const app = express();

app.use(cors({ origin: 'https://war-z.onrender.com', methods: ['GET', 'POST', 'OPTIONS'] }));
app.use(async function (req: Request, res, next) {
  const user: string = formatCookie(req.headers.cookie).username;
  await User.findOne({ username: user })
    .then(foundUser => {
      foundUser && (req.loggedUser = { username: foundUser.username });
    })
    .catch(err => {
      req.loggedUser = { username: 'Invitado (app 33)' };
      console.log('User not found.');
    });
  next();
});

app.use(express.static(path.join(rootDir, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //formularios

app.set('view engine', 'pug');
app.set('views', 'web-views');

app.use(AppRouter.getRouter());

const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');
    console.log('Conectando...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('You successfully connected to MongoDB!');
    app.listen(process.env.PORT || 3333, () => {
      console.log(`Listening on port ${process.env.PORT || 3333}.`);
    });
  } catch (err) {
    console.log(err);
  }
};
start();
