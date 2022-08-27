export default class Utility {
  static includesNeededParamsForInsertExpense(requestMap: any): boolean {
    let includesNeededParams = false;

    if (requestMap.get('price') != null
      && requestMap.get('categoryId') != null
      && requestMap.get('description') != null
      && requestMap.get('date') != null
      && requestMap.get('expenseUuid') != null) {
      includesNeededParams = true;
    }

    return includesNeededParams;
  }

  static includesNeededParamsForDeleteExpense(requestMap: any): boolean {
    let includesNeededParams = false;

    if (requestMap.get('expenseUuid') != null) {
      includesNeededParams = true;
    }

    return includesNeededParams;
  }

  static includesNeededParamsForGetExpenses(requestMap: any): boolean {
    let includesNeededParams = false;

    if (requestMap.get('userId') != null) {
      includesNeededParams = true;
    }

    return includesNeededParams;
  }
}
