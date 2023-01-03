import { jwtSecret } from '../jwt';
import encryptPassword from '../encrypt';
import DB from '../db/db';

const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const passport = require('passport');

export default passport;

const user = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
};

// passport-localの設定
passport.use(new LocalStrategy(user, async (email: string, password: string, done: any) => {
  // DBからパスワードを取得
  const map = await DB.getHashedPassword(email);

  if (map === null) {
    return done(null, false, {
      message: 'ログイン失敗',
    });
  }

  const hashedPassword = await encryptPassword(password, map.get('salt'));

  if (hashedPassword === null) {
    return done(null, false, {
      message: 'ログイン失敗',
    });
  }

  const dbPassword = map.get('password');
  const dbBuffer = Buffer.from(dbPassword as any);
  const buffer = Buffer.from(hashedPassword.get('password') as any);

  // 入力したパスワードが一致しない場合
  if (!crypto.timingSafeEqual(buffer, dbBuffer)) {
    console.log('パスワードが違います');
    return done(null, false, {
      message: 'ログイン失敗',
    });
  }

  // パスワードが一致
  console.log('パスワードが一致しました');
  return done(null, email);
}));

// passport-jwtの設定
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
  issuer: 'accounts.examplesoft.com',
  audience: 'yoursite.net',
};

passport.use(new JwtStrategy(opts, (jwtPayload: any, done: any) => {
  console.log(jwtPayload);
  console.log(done);
}));
