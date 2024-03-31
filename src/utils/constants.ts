import crypto from 'crypto';

export const SUCCESSFUL = 200;
export const CREATED = 201;

export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const NOT_FOUND = 404;
export const INTERNAL_SERVER_ERROR = 500;

export const JWT_SECRET_KEY = crypto.randomBytes(16).toString('hex');
