export default class Expense {
  price: number;

  category: number;

  date: string;

  inputUserId: number;

  constructor(price: number, category: number, date: string, inputUserId: number) {
    this.price = price;
    this.category = category;
    this.date = date;
    this.inputUserId = inputUserId;
  }
}
