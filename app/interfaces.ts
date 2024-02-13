export interface ExpenseRequestBody {
  price: number;
  categoryId: number;
  date: string;
  description: string;
  expenseUuid: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}
