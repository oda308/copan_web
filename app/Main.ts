import { assert } from 'console';
import DB from './db/db';
import Utility from './utility';
import { getAccessToken } from './jwt';
import passport from './authenticate/init'

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
// passportの初期化
app.use(passport.initialize());
const port = 5500;

DB.init();

async function registerUser(req: any, res: any) {
  console.log('ユーザー登録');
  console.log(req.body);
  if (await DB.isUserRegistered(req.body.email)) {
    console.log('ユーザーは既に登録されています');
    res.json({ access_token: '' });
  } else {
    console.log('ユーザーは登録されていません');
    const token = getAccessToken(req.body.email);
    DB.registerUser(
      req.body.name,
      req.body.email,
      req.body.password,
      token,
    );
    res.json({ access_token: token });
  }
}

async function getAllExpenses(req: any, res: any) {
  if (Utility.includesNeededParamsForGetExpenses(req.body)) {
    const expenses = await DB.getAllExpenses();
    console.log(expenses);
    const json = JSON.stringify([...expenses]);
    res.json(json);
  } else {
    throw assert('Error: Insufficient parameters for GetExpenses.');
  }
}

async function deleteExpense(req: any, res: any) {
  if (Utility.includesNeededParamsForDeleteExpense(req.body)) {
    await DB.deleteExpense(
      req.body.expenseUuid,
    );
    res.send('Succeeded delete record');
  } else {
    console.log('Error: Insufficient parameters for deleteExpense.');
  }
}

async function insertExpense(req: any, res: any) {
  if (Utility.includesNeededParamsForInsertExpense(req.body)) {
    await DB.insertExpense(
      req.body.price,
      req.body.categoryId,
      req.body.date,
      req.body.description,
      req.body.inputUserId,
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
    res.json({ accessToken: getAccessToken(req.body.email) });
  },
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
