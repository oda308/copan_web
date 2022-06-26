export function getToday(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString();
  const date = now.getDate().toString();

  return `${year}-${month}-${date}`;
}

export function includesNeededParamsForInsertExpense(query: any): boolean {
  let includesNeededParams = false;

  if ('price' in query
    && 'category' in query
    && 'date' in query
    && 'userId' in query) {
    includesNeededParams = true;
  }

  return includesNeededParams;
}

export function includesNeededParamsForGetExpenses(query: any): boolean {
  let includesNeededParams = false;

  if ('userId' in query) {
    includesNeededParams = true;
  }

  return includesNeededParams;
}
