
const client = connectDB();

client
  .connect()
  .then(() => console.log('connected'))
  .catch((err: any) => console.error('connection error', err.stack))


// Mock Data
const price: number = 198;
const category: number = 2;
const date: string = getToday();
const input_user_id: number = 3;

const query = insertExpense(price, category, date, input_user_id);

client.query(query, (err: any, res: any) => {
  if (err) {
    console.log('Error: ' + err.stack)
  } else {
    console.log('Success: ' + res.rows[0])
  }
});

type Query = {
  text: string,
  values: any[],
}

function insertExpense(price: number, category: number, date: string, input_user_id: number): Query {
  return {
    text: 'INSERT INTO expenses(last_updated, price, category, date, input_user_id) VALUES(current_timestamp, $1, $2, $3, $4)',
    values: [price, category, date, input_user_id],
  };
}

function getToday(): string {
  const now = new Date();
  return now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate().toString()
}