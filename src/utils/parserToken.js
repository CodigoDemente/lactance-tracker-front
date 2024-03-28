import { Buffer } from 'buffer';

export const parseToken = (token) => {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64').toString('ascii');
    return JSON.parse(decoded);
};