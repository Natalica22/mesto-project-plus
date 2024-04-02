import crypto from 'crypto';

export const SUCCESSFUL = 200;
export const CREATED = 201;

export const JWT_TOKEN_COOKIE = 'JWT_TOKEN';
export const JWT_SECRET_KEY = crypto.randomBytes(16).toString('hex');

export const LINK_REGEXP = /^https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?$/;
