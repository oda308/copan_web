import { jwtSecret } from '../jwt';
import encryptPassword from '../encrypt';

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
  const hashedPassword = await encryptPassword(password);

  if (hashedPassword === null) {
    return done(null, false, {
      message: 'ログイン失敗',
    });
  }

  const buffer = Buffer.from(hashedPassword);

  // 入力したパスワードが一致しない場合
  if (!crypto.timingSafeEqual(buffer, buffer)) {
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
