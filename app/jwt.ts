const jwt = require('jsonwebtoken');

export const jwtSecret = 'secret';

export function getAccessToken(email: string): string {
  const payload = { user: email };
  return jwt.sign(payload, jwtSecret, {
    expiresIn: '1m',
  });
}
