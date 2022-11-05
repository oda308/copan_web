export default class Utility {
  static includesNeededParamsForInsertExpense(body: any): boolean {
    if (body.price != null
      && body.categoryId != null
      && body.description != null
      && body.date != null
      && body.expenseUuid != null) {
      return true;
    }

    return false;
  }

  static includesNeededParamsForDeleteExpense(body: any): boolean {
    return body.expenseUuid != null;
  }

  static includesNeededParamsForGetExpenses(body: any): boolean {
    return body.userId != null;
  }
}
