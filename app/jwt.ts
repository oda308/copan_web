import * as jsonwebtoken from 'jsonwebtoken';

export const jwtSecret = 'secret';

export function generateAccessToken(email: string): string {
  const payload = { email: email };
  const token = jsonwebtoken.sign(payload, jwtSecret, {
    expiresIn: '30d',
  });
  console.log(`token: ${token}`);
  return token;
}

export function extractEmail(accessToken: string): string  {
  try {
    const decoded = jsonwebtoken.verify(accessToken, jwtSecret) as { email: string };
    console.log(decoded.email);
    return decoded.email;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return '';
  }
}

export default {
  jwtSecret,
  generateAccessToken,
  extractEmail,
};
