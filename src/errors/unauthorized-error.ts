import { UNAUTHORIZED } from './constants';

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

export default UnauthorizedError;
