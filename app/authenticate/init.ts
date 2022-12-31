import { jwtSecret } from '../jwt';

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
passport.use(new LocalStrategy(user, (email: string, password: string, done: any) => {
  // saltを作成
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err: Error, hashedPassword: Buffer) => {
    // パスワードのハッシュ化でエラー
    if (err) {
      console.log(`err: ${err}`);
    }

    // 入力したパスワードが一致しない場合
    if (!crypto.timingSafeEqual(hashedPassword, hashedPassword)) {
      console.log('パスワードが違います');
      return done(null, false, {
        message: 'ログイン成功',
      });
    }

    // パスワードが一致
    console.log('パスワードが一致しました');
    return done(null, email);
  });
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
