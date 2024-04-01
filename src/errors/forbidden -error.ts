import { FORBIDDEN } from './constants';

class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

export default ForbiddenError;
