import { assert } from 'console';
import DB from './db/db';
import Utility from './utility';
import jwt from './jwt';
import passport from './authenticate/init';
import encryptPassword from './encrypt';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
// passportの初期化
app.use(passport.initialize());

const port = process.env.NODE_ENV === 'production' ? 8080 : 5500;

DB.init();

async function registerUser(req: any, res: any) {
  console.log('ユーザー登録');
  console.log(req.body);
  if (await DB.isUserRegistered(req.body.email)) {
    console.log('ユーザーは既に登録されています');
    res.json({ access_token: '' });
  } else {
    console.log('ユーザーは登録されていません');
    const token = jwt.generateAccessToken(req.body.email);
    const email = jwt.getEmailFromAccessToken(token);
    console.log(email);

    const map = await encryptPassword(req.body.email);

    if (map === null) {
      console.log('Failed to encryptPassword');
      res.json({ access_token: '' });
      return;
    }

    console.log(`hashed: ${map.get('password')}`);
    console.log(`salt: ${map.get('salt')}`);
    console.log(`token: ${token}`);

    DB.registerUser(
      req.body.name,
      req.body.email,
      map.get('password') as any,
      map.get('salt') as any,
      token,
    );
    res.json({ access_token: token });
  }
}

async function getAllExpenses(req: any, res: any) {
  const accessToken = req.headers.authorization
  const expenses = await DB.getAllExpenses(accessToken);
  console.log(expenses);
  const json = JSON.stringify([...expenses]);
  res.json(json);
}

async function deleteExpense(req: any, res: any) {
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

async function insertExpense(req: any, res: any) {
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

app.post('/', async (req: any, res: any) => {
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
    case 'registerUser':
      await registerUser(req, res);
      break;
    default:
      console.log('Error: Unknown action');
      break;
  }
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
  console.log(`App listening on port ${port}`);
});
