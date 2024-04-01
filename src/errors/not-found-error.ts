import { NOT_FOUND } from './constants';

class NotFoundError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

export default NotFoundError;
