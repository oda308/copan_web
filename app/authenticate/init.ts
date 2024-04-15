import jwt from '../jwt';
import encryptPassword from '../encrypt';
import DB from '../db/db';
import crypto from 'crypto';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import passport from 'passport';
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';

export default passport;

// passport-localの設定
passport.use(new LocalStrategy((email: string, password: string, done: VerifyFunction) => {
  DB.getHashedPassword(email)
    .then(map => {
      if (!map) {
        return done(null, false, { message: 'ログイン失敗' });
      }
      return encryptPassword(password, map.get('salt')).then(hashedPassword => {
        if (!hashedPassword) {
          return done(null, false, { message: 'ログイン失敗' });
        }
        const dbPassword = map.get('password');
        if (!dbPassword) {
          return done(null, false, { message: 'ログイン失敗' });
        }
        const dbBuffer = Buffer.from(dbPassword);
        const password = hashedPassword.get('password')
        if (!password) {
          return done(null, false, { message: 'ログイン失敗' });
        }
        const buffer = Buffer.from(password);
        if (!crypto.timingSafeEqual(buffer, dbBuffer)) {
          console.log('パスワードが違います');
          return done(null, false, { message: 'ログイン失敗' });
        }
        console.log('パスワードが一致しました');
        return done(null, email);
      });
    })
    .catch((err: string) => done(err));
}));

// passport-jwtの設定
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwt.jwtSecret,
};

passport.use(new JwtStrategy(opts, (jwtPayload: string, done: VerifyCallback) => {
  console.log(jwtPayload);
  console.log(done);
}));

type VerifyFunction = (
  err: string | null,
  user?: Express.User | false,
  info?: IVerifyOptions
) => void;
