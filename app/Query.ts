export type Query = {
    text: string,
    values: any[],
}

export function insertExpense(price: number, category: number, date: string, inputUserId: number): Query {
    return {
        text: 'INSERT INTO expenses(last_updated, price, category, date, input_user_id) VALUES(current_timestamp, $1, $2, $3, $4)',
        values: [price, category, date, inputUserId],
    };
}

export function getCurrentMonthExpense(): Query {
    const date = new Date();
    const year = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const nextMonth = date.getMonth() + 2;
    const currentMonthStr = `${year}/${currentMonth}/01`;
    const nextMonthStr = `${year}/${nextMonth}/01`;

    return {
        text: 'SELECT * FROM expenses WHERE date >= $1 AND date < $2',
        values: [currentMonthStr, nextMonthStr]
    };
}