export default class Expense {
  price: number;

  category: number;

  date: string;

  email: string;

  constructor(price: number, category: number, date: string, email: string) {
    this.price = price;
    this.category = category;
    this.date = date;
    this.email = email;
  }
}
