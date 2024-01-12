import { sign, verify, Secret } from 'jsonwebtoken';

const secret: Secret = 'jwt-secret-key';

export const generateToken = (payload: object): string => {
    return sign(payload, secret, { expiresIn: '1h' });
};

export const verifyToken = (token: string): object | string => {
    try {
        return verify(token, secret);
    } catch (err) {
        return 'Invalid token';
    }
};