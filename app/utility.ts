import { DeleteExpenseRequestBody, InsertExpenseRequestBody } from "./interfaces";

export default class Utility {
  // TODO: 呼び出し元でキャストした時のエラーを見れば不要と思う
  static includesNeededParamsForInsertExpense(body: InsertExpenseRequestBody): boolean {
    if (body.price != null
      && body.categoryId != null
      && body.description != null
      && body.date != null
      && body.expenseUuid != null) {
      return true;
    }

    return false;
  }

  // TODO: 呼び出し元でキャストした時のエラーを見れば不要と思う
  static includesNeededParamsForDeleteExpense(body: DeleteExpenseRequestBody): boolean {
    return body.expenseUuid != null;
  }
}
