export interface InsertExpenseRequestBody {
  price: number;
  categoryId: number;
  date: string;
  description: string;
  expenseUuid: string;
}

export interface DeleteExpenseRequestBody {
  expenseUuid: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface DBExpense { 
  category: number;
  content: string;
  date: string;
  expenseUuid: string;
  price: number;
}
