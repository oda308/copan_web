const jsonwebtoken = require('jsonwebtoken');

export const jwtSecret = 'secret';

export function generateAccessToken(email: string): string {
  const payload = { email: email };
  const token = jsonwebtoken.sign(payload, jwtSecret, {
    expiresIn: '30d',
  });
  console.log('token: \(token)')
  return token;
}

export function getEmailFromAccessToken(accessToken: string) { 
  try { 
    const decoded = jsonwebtoken.verify(accessToken, jwtSecret)
    return decoded.email
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  } 
}

export default { 
  jwtSecret,
  generateAccessToken,
  getEmailFromAccessToken
}