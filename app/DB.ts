export function connectDB() {

  var { Client } = require('pg');

  if (process.env.NODE_ENV !== 'production') {
    console.log('current env: develop');
    var result;
    try {
      result = require('dotenv').config();
      console.log(result.error);
    } catch (e) {
      throw console.log(e);
    }
  } else {
    console.log('current env: production');
  }

  const user = process.env.USER;
  const host = process.env.HOST;
  const db = process.env.DB;
  const password = process.env.PASSWORD;
  const port = process.env.PORT;

  if (user == undefined) {
    throw console.log('user is undefined');
  } else {
    console.log("user : " + user);
  }
  if (host == undefined) {
    throw console.log('host is undefined');
  } else {
    console.log("host : " + host);
  }
  if (db == undefined) {
    throw console.log('db is undefined');
  } else {
    console.log("db : " + db);
  }
  if (password == undefined) {
    throw console.log('password is undefined');
  } else {
    console.log("password : " + password);
  }
  if (port == undefined) {
    throw console.log('port is undefined');
  } else {
    console.log("port : " + port);
  }

  return new Client({
    user: user,
    host: host,
    database: db,
    password: password,
    port: port,
  });
}

