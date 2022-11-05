import { assert } from 'console';
import DB from './db/db';
import Utility from './utility';
import jwtSecret from './authenticate/init';

const passport = require('passport');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());
// passportの初期化
app.use(passport.initialize());
const port = 5500;

DB.init();

app.post('/', async (req: any, res: any) => {
  switch (req.body.action) {
    case 'insertExpense':
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
      break;
    case 'deleteExpense':
      if (Utility.includesNeededParamsForDeleteExpense(req.body)) {
        await DB.deleteExpense(
          req.body.expenseUuid,
        );
        res.send('Succeeded delete record');
      } else {
        console.log('Error: Insufficient parameters for deleteExpense.');
      }
      break;
    case 'getAllExpenses':
      if (Utility.includesNeededParamsForGetExpenses(req.body)) {
        const expenses = await DB.getAllExpenses();
        console.log(expenses);
        const json = JSON.stringify([...expenses]);
        res.json(json);
      } else {
        throw assert('Error: Insufficient parameters for GetExpenses.');
      }
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
    const payload = { user: req.body.email };
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: '1m',
    });
    console.log(token);
    res.json({ accessToken: token });
  },
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
