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