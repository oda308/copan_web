/* eslint-disable no-console */

require('dotenv').config();
const { Pool } = require('pg');

export default class DB {
  static client: any;

  static init() {
    DB.client = DB.getDBClient();
  }

  static connect() {
    return new Promise((resolve) => {
      DB.client.connect()
        .then((connect: any) => {
          console.log('connected');
          resolve(connect);
        }).catch(
          (err: any) => console.error('error', err.stack),
        );
    });
  }

  static insertExpense(price: number, category: number, date: string, inputUserId: number) {
    const queryString = 'INSERT INTO expenses(last_updated, price, category, date, input_user_id) VALUES(current_timestamp, $1, $2, $3, $4)';

    DB.client
      .connect()
      .then((client: any) => {
        client
          .query(queryString, [price, category, date, inputUserId])
          .then((res: any) => {
            client.release();
            console.log(res.rows[0]);
          })
          .catch((err: any) => {
            client.release();
            console.log(err.stack);
          });
      });
  }

  static async getCurrentMonthExpense(): Promise<any> {
    const date = new Date();
    const year = date.getFullYear();
    const currentMonth = date.getMonth() + 1;
    const nextMonth = date.getMonth() + 2;
    const currentMonthStr = `${year}/${currentMonth}/01`;
    const nextMonthStr = `${year}/${nextMonth}/01`;

    console.log(currentMonthStr);
    console.log(nextMonthStr);

    const queryString = 'SELECT * FROM expenses WHERE date >= $1 AND date < $2';
    const values = [currentMonthStr, nextMonthStr];

    return new Promise((resolve) => {
      DB.client
        .connect()
        .then((client: any) => {
          client
            .query(queryString, values)
            .then((res: any) => {
              console.log(res.rows);
              resolve(res.rows);
              client.release();
            })
            .catch((err: any) => {
              client.release();
              throw Error(`Failed getCurrentMonthExpense : ${err}`);
            });
        });
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

    return new Pool({
      user,
      host,
      database: db,
      password,
      port,
    });
  }
}
