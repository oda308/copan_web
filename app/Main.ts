import Expense from './Expense';
import DB from './db/db';
import getToday from './Utility';

const client = new DB();

// Mock Data
const expense = new Expense(198, 2, getToday(), 3);

DB.insertExpense(expense.price, expense.category, expense.date, expense.inputUserId);
DB.getCurrentMonthExpense();
