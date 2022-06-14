import { Expense } from './Expense';
import { connectDB } from './DB';
import { insertExpense } from './Query';
import { getToday } from './Utility';

const client = connectDB();

client
  .connect()
  .then(() => console.log('connected'))
  .catch((err: any) => console.error('connection error', err.stack));

// Mock Data
const expense = new Expense(198, 2, getToday(), 3);
const query = insertExpense(expense.price, expense.category, expense.date, expense.inputUserId);

client.query(query, (err: any, res: any) => {
  if (err) {
    console.log(`Error: ${err.stack}`);
  } else {
    console.log(`Success: ${res.rows[0]}`);
  }
});
