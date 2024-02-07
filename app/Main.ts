import DB from './db/db';
import Utility from './utility';
import jwt from './jwt';
import passport from './authenticate/init';
import encryptPassword from './encrypt';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(bodyParser.json());
// passportの初期化
app.use(passport.initialize());

const port = process.env.PORT ?? 3000;

DB.init();

app.use('/', async (req: Request, res: Response, next: any) => {
  if (req.body.action === 'registerUser') {
    next();
    return;
  }
  const email = jwt.getEmailFromAccessToken(req.headers.authorization);
  const isRegistered = await DB.isUserRegistered(email);

  if (isRegistered) {
    next();
  } else {
    res.status(401).json({ message: 'Authentication failed: User not registered.' });
  }
});

function generateRandomPassword(length = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const passwordArray = [];

  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    passwordArray.push(characters.charAt(randomIndex));
  }
  return passwordArray.join('');
}

async function registerUser(req: Request, res: Response) {
  console.log('ユーザー登録');
  const userId = uuidv4();
  const token = jwt.generateAccessToken(userId);
  const password = generateRandomPassword();
  const map = await encryptPassword(password);
  const hashedPassword = map?.get('password');
  const salt = map?.get('salt');

  if (hashedPassword === undefined || salt === undefined) {
    console.log('Failed to get password or salt from map');
    res.json({ access_token: '' });
    return;
  }
  
  console.log(`hashed: ${hashedPassword}`);
  console.log(`salt: ${salt}`);
  console.log(`token: ${token}`);

  DB.registerUser(userId, hashedPassword, salt, token);
  res.json({ access_token: token });
}

async function getAllExpenses(req: Request, res: Response) {
  const accessToken = req.headers.authorization;
  const expenses = await DB.getAllExpenses(accessToken);
  console.log(expenses);
  const json = JSON.stringify([...expenses]);
  res.json(json);
}

async function deleteExpense(req: Request, res: Response) {
  if (Utility.includesNeededParamsForDeleteExpense(req.body)) {
    const accessToken = req.headers.authorization;

    await DB.deleteExpense(
      accessToken,
      req.body.expenseUuid,
    );
    res.send('Succeeded delete record');
  } else {
    console.log('Error: Insufficient parameters for deleteExpense.');
  }
}

async function insertExpense(req: Request, res: Response) {
  if (Utility.includesNeededParamsForInsertExpense(req.body)) {
    const accessToken = req.headers.authorization

    await DB.insertExpense(
      accessToken,
      req.body.price,
      req.body.categoryId,
      req.body.date,
      req.body.description,
      req.body.expenseUuid,
    );
    res.send('Succeeded insert record');
  } else {
    console.log('Error: Insufficient parameters for InsertExpense.');
  }
}

app.post(
  '/',
  async (req: Request, res: Response) => {
    switch (req.body.action) {
      case 'insertExpense':
        await insertExpense(req, res);
        break;
      case 'deleteExpense':
        await deleteExpense(req, res);
        break;
      case 'getAllExpenses':
        await getAllExpenses(req, res);
        break;
      default:
        console.log('Error: Unknown action');
        break;
    }
  },
);

app.post('/registerUser', async (req: Request, res: Response) => {
  await registerUser(req, res);
});

app.post(
  '/auth/login',
  passport.authenticate('local', { session: false }),
  (req: any, res: any) => {
    console.log('Login Successful!');
    console.log(`email: ${req.body.email}`);
    console.log(`password: ${req.body.password}`);
    res.json({ accessToken: jwt.generateAccessToken(req.body.email) });
  },
);

app.listen(port, () => {
  console.log(`envの確認: ${process.env.NODE_ENV}`);
  console.log(`App listening on port ${port}`);
});
