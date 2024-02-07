const crypto = require('crypto');

// パスワードをハッシュ化する
async function encryptPassword(password: string, salt?: string)
  : Promise<Map<string, string> | null> {
  let usedSalt: string;
  if (salt === undefined) {
    // saltを作成
    usedSalt = crypto.randomBytes(16).toString('hex');
  } else {
    usedSalt = salt;
  }

  return new Promise((resolve) => {
    crypto.pbkdf2(password, usedSalt, 310000, 32, 'sha256', (err: Error, hashedPassword: Buffer) => {
      // パスワードのハッシュ化でエラー
      if (err) {
        console.log(`err: ${err}`);
        resolve(null);
      }

      const map = new Map<string, string>();
      map.set('salt', usedSalt);
      map.set('password', hashedPassword.toString('hex'));
      resolve(map);
    });
  });
}

export default encryptPassword;
