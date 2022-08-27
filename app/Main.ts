import DB from './db/Db';
import Utility from './Utility';

const http = require('http');

const port = '5500';
const hostname = 'localhost';

const mockJsonInsert = require('./mock/InsertExpense.json');
const mockJsonDelete = require('./mock/DeleteExpense.json');

const usesMock = false;

function convertRequestBodyToMap(buffers: Uint8Array[]) {
  const data = Buffer.concat(buffers).toString();
  const json = JSON.parse(data);
  const map = new Map(Object.entries(json));
  return map;
}

DB.init();

const server = http.createServer(async (req: any, res: any) => {
  if (req.url === '/favicon.ico') {
    return;
  }

  const buffers: Uint8Array[] = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  let reqMap: Map<string, any>;

  if (usesMock) {
    reqMap = new Map(Object.entries(mockJsonDelete));
  } else {
    reqMap = convertRequestBodyToMap(buffers) as Map<string, any>;
  }

  if (reqMap.get('action') === 'insertExpense') {
    if (Utility.includesNeededParamsForInsertExpense(reqMap)) {
      await DB.insertExpense(
        reqMap.get('price'),
        reqMap.get('categoryId'),
        reqMap.get('date'),
        reqMap.get('description'),
        reqMap.get('inputUserId'),
        reqMap.get('expenseUuid'),
      );
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.write('Succeeded insert record');
      res.end();
    } else {
      throw Error('Insufficient parameters for InsertExpense.');
    }
  } else if (reqMap.get('action') === 'deleteExpense') {
    if (Utility.includesNeededParamsForDeleteExpense(reqMap)) {
      await DB.deleteExpense(
        reqMap.get('expenseUuid'),
      );
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.write('Succeeded delete record');
      res.end();
    } else {
      throw Error('Insufficient parameters for deleteExpense.');
    }
  } else if (reqMap.get('action') === 'getAllExpenses') {
    if (Utility.includesNeededParamsForGetExpenses(reqMap)) {
      const expenses = await DB.getAllExpenses();
      console.log(expenses);
      const json = JSON.stringify([...expenses]);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.write(json);
      res.end();
    } else {
      throw Error('Insufficient parameters for GetExpenses.');
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
