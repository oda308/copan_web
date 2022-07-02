import Expense from './Expense';
import DB from './db/db';
import { getToday, includesNeededParamsForInsertExpense, includesNeededParamsForGetExpenses } from './Utility';

const http = require('http');
const url = require('url');

DB.init();

http.createServer(async (req: any, res: any) => {
  if (req.url === '/favicon.ico') {
    return;
  }

  const urlParse = url.parse(req.url, true);

  // http://127.0.0.1:5500/?action=insertExpense&price=1234&category=3&date&2022-06-26&userId=2
  // http://127.0.0.1:5500/?action=getCurrentMonthExpense&userId=2

  let action: string;

  if ('action' in urlParse.query) {
    action = urlParse.query.action;

    if (action === 'insertExpense') {
      if (includesNeededParamsForInsertExpense(urlParse.query)) {
        const expense = new Expense(198, 2, getToday(), 3);
        await DB.insertExpense(expense.price, expense.category, expense.date, expense.inputUserId);
      } else {
        throw Error('Insufficient parameters for InsertExpense.');
      }
    } else if (action === 'getCurrentMonthExpense') {
      if (includesNeededParamsForGetExpenses(urlParse.query)) {
        const expenses = await DB.getCurrentMonthExpense();
        console.log(expenses);
      } else {
        throw Error('Insufficient parameters for GetExpenses.');
      }
    } else {
      throw Error('Illegal action.');
    }
  } else {
    throw Error('Action was not found.');
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Hello there');
  res.end();
}).listen(5500);
