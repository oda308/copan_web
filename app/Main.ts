import Expense from './Expense';
import DB from './db/db';
import { getToday, includesNeededParamsForInsertExpense, includesNeededParamsForGetExpenses } from './Utility';

const http = require('http');
const url = require('url');

DB.init();
DB.connect();

http.createServer((req: any, res: any) => {
  const urlParse = url.parse(req.url, true);

  // http://127.0.0.1:5500/?action=insertExpense&price=1234&category=3&date&2022-06-26&userId=2
  // http://127.0.0.1:5500/?action=getCurrentMonthExpense&userId=2
  console.log(urlParse.query);

  let action: string;

  if ('action' in urlParse.query) {
    action = urlParse.query.action;
    console.log(`actionは${action}です`);

    if (action === 'insertExpense') {
      if (includesNeededParamsForInsertExpense(urlParse.query)) {
        // DB.connect();
        const expense = new Expense(198, 2, getToday(), 3);
        DB.insertExpense(expense.price, expense.category, expense.date, expense.inputUserId);
        // TODO: クエリ実行完了後切断
        // DB.disconnect();
      } else {
        throw Error('Insufficient parameters for InsertExpense.');
      }
    } else if (action === 'getCurrentMonthExpense') {
      if (includesNeededParamsForGetExpenses(urlParse.query)) {
        // DB.connect();
        DB.getCurrentMonthExpense();
        // TODO: クエリ実行完了後切断
        // DB.disconnect();
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
