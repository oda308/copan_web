const crypto = require('crypto');

// パスワードを暗号化する
async function encryptPassword(password: string): Promise<string | null> {
  // saltを作成
  const salt = crypto.randomBytes(16);

  return new Promise((resolve) => {
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err: Error, hashedPassword: Buffer) => {
      // パスワードのハッシュ化でエラー
      if (err) {
        console.log(`err: ${err}`);
        resolve(null);
      }
      resolve(hashedPassword.toString());
    });
  });
}

export default encryptPassword;
