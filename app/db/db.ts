/* eslint-disable no-console */

import jwt from "../jwt";
import * as dotenv from 'dotenv';
import { Pool, PoolClient, QueryResult } from 'pg';

dotenv.config();

export default class DB {
  static client: Pool;

  static init() {
    DB.client = DB.getDBClient();
  }

  static connect() {
    return new Promise((resolve) => {
      DB.client.connect()
        .then((connect: PoolClient) => {
          console.log('connected');
          resolve(connect);
        }).catch(
          (err: Error) => {
          if (err) {
            console.error('error', err.stack);
          } else {
            console.error('An undefined error occurred');
          }
          }
        );
    });
  }

  static insertExpense(
    accessToken: string,
    price: number,
    category: number,
    date: string,
    content: string,
    expenseUuid: string,
  ) {
    const queryString = 'INSERT INTO expenses(last_updated, price, category, date, content, expense_uuid, email) VALUES(current_timestamp, $1, $2, $3, $4, $5, $6)';
     void DB.client.connect()
      .then((client: PoolClient) => {
        client
          .query(queryString, [price, category, date, content, expenseUuid, jwt.extractEmail(accessToken)])
          .then((res: QueryResult) => {
            client.release();
            console.log(res.rows[0]);
          })
          .catch((err: Error) => {
            client.release();
            console.log(err.stack);
          });
      });
  }

  static deleteExpense(
        accessToken: string,
        expenseUuid: string,
  ) {
    const queryString = 'DELETE FROM expenses WHERE expense_uuid = $1 AND email = $2';

    void DB.client
      .connect()
      .then((client: PoolClient) => {
        client
          .query(queryString, [expenseUuid, jwt.extractEmail(accessToken)])
          .then((res: QueryResult) => {
            client.release();
            console.log(res.rows[0]);
          })
          .catch((err: Error) => {
            client.release();
            console.log(err.stack);
          });
      });
  }

  static async isUserRegistered(
    email: string,
  ): Promise<boolean> {
    const queryString = 'SELECT COUNT(*) FROM users WHERE email = $1';

    try {
        const client = await DB.client.connect();
        const res = await client.query(queryString, [email]);
        client.release();
        console.log(`登録済みユーザ数: ${res.rows[0]}`);
        return res.rows[0] > 0;
    } catch (err: unknown) {
        console.error(err);
        throw err;
    }
  }

  static registerUser(
    email: string,
    password: string,
    salt: string,
    accessToken: string,
  ) {
    const queryString = 'INSERT INTO users (name, email, password, salt, access_token) VALUES ($1, $2, $3, $4, $5)';
    const values = ['', email, password, salt, accessToken];

    void DB.client
      .connect()
      .then((client: PoolClient) => {
        client
          .query(queryString, values)
          .then((res: QueryResult) => {
            client.release();
            console.log(res.rows[0]);
          })
          .catch((err: Error) => {
            client.release();
            console.log(err.stack);
          });
      });
  }

  static async getAllExpenses(accessToken: string): Promise<[any]> {
    const queryString = 'SELECT * FROM expenses WHERE expenses.email = $1';
    const values = [jwt.extractEmail(accessToken)]

    return new Promise((resolve) => {
      void DB.client
        .connect()
        .then((client: PoolClient) => {
          client
            .query(queryString, values)
            .then((res: QueryResult) => {
              console.log(res.rows);
              resolve(res.rows);
              client.release();
            })
            .catch((err: Error) => {
              client.release();
              throw Error(`Failed getAllExpenses : ${err.message}`);
            });
        });
    });
  }

  static async getHashedPassword(email: string): Promise<Map<string, string> | null> {
    const queryString = 'SELECT password, salt FROM users WHERE email = $1';

    return new Promise((resolve) => {
      void DB.client
        .connect()
        .then((client: PoolClient) => {
          client
            .query(queryString, [email])
            .then((res: QueryResult) => {
              client.release();
              console.log(res.rows);
              const row = res.rows[0] as { password: string, salt: string } | undefined;

              if (row === undefined) {
                resolve(null);
                return;
              }

              const map = new Map<string, string>();
              map.set('password', row.password);
              map.set('salt', row.salt);
              resolve(map);
            })
            .catch((err: Error) => {
              client.release();
              throw Error(`Failed getHashedPassword : ${err.message}`);
            });
        });
    });
  }

  static getDBClient() {
    console.log(`current env: ${process.env.NODE_ENV}`);

    const user = process.env.USER;
    const host = process.env.HOST;
    const db = process.env.DB;
    const password = process.env.PASSWORD;
    const dbPort = process.env.DB_PORT as number | undefined;

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
    if (dbPort === undefined) {
      throw console.log('dbPort is undefined');
    } else {
      console.log(`dbPort : ${dbPort}`);
    }

    return new Pool({
      user,
      host,
      database: db,
      password,
      port: dbPort,
    });
  }
}
