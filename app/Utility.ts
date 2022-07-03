export function getToday(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString();
  const date = now.getDate().toString();

  return `${year}-${month}-${date}`;
}

export function includesNeededParamsForInsertExpense(requestMap: any): boolean {
  let includesNeededParams = false;

  if (requestMap.get('price') != null
    && requestMap.get('categoryId') != null
    && requestMap.get('description') != null
    && requestMap.get('date') != null) {
    includesNeededParams = true;
  }

  return includesNeededParams;
}

export function includesNeededParamsForGetExpenses(requestMap: any): boolean {
  let includesNeededParams = false;

  if (requestMap.get('userId') != null) {
    includesNeededParams = true;
  }

  return includesNeededParams;
}
