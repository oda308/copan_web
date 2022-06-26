/* eslint-disable no-console */

require('dotenv').config();
const { Client } = require('pg');

export default class DB {
  static client: any;

  static init() {
    console.log('dbのインスタンス取得');
    DB.client = DB.getDBClient();
  }

  static connect() {
    DB.client.connect()
      .then(() => console.log('connected'))
      .catch(
        (err: any) => console.error('connection error', err.stack),
      );
  }

  static disconnect() {
    DB.client.end((err: any) => {
      if (err) {
        console.log('error during disconnection', err.stack);
      }
    });
  }

  static insertExpense(price: number, category: number, date: string, inputUserId: number) {
    const query = {
      text: 'INSERT INTO expenses(last_updated, price, category, date, input_user_id) VALUES(current_timestamp, $1, $2, $3, $4)',
      values: [price, category, date, inputUserId],
    };

    DB.client.query(query, (err: any, res: any) => {
      if (err) {
        console.log(`Error: ${err.stack}`);
      } else {
        console.log(`Success: ${res.rows[0]}`);
      }
    });
  }

  static getCurrentMonthExpense() {
    const date = new Date();
    const year = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const nextMonth = date.getMonth() + 2;
    const currentMonthStr = `${year}/${currentMonth}/01`;
    const nextMonthStr = `${year}/${nextMonth}/01`;

    const query = {
      text: 'SELECT * FROM expenses WHERE date >= $1 AND date < $2',
      values: [currentMonthStr, nextMonthStr],
    };

    DB.client.query(query, (err: any, res: any) => {
      if (err) {
        console.log(`Error: ${err.stack}`);
      } else {
        console.log(`Success: ${res.rows[0]}`);
        console.dir(res.rows);
      }
    });
  }

  static getDBClient() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('current env: develop');
    } else {
      console.log('current env: production');
    }

    const user = process.env.USER;
    const host = process.env.HOST;
    const db = process.env.DB;
    const password = process.env.PASSWORD;
    const port = process.env.PORT;

    if (user === undefined) {
      throw console.log('user is undefined');
    } else {
      console.log(`user : ${user}`);
    }
    if (host === undefined) {
      throw console.log('host is undefined');
    } else {
      console.log(`host : ${host}`);
    }
    if (db === undefined) {
      throw console.log('db is undefined');
    } else {
      console.log(`db : ${db}`);
    }
    if (password === undefined) {
      throw console.log('password is undefined');
    } else {
      console.log(`password : ${password}`);
    }
    if (port === undefined) {
      throw console.log('port is undefined');
    } else {
      console.log(`port : ${port}`);
    }

    return new Client({
      user,
      host,
      database: db,
      password,
      port,
    });
  }
}
