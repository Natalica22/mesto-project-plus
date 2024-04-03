import { NextFunction } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import ConflictError from '../errors/conflict-error';
import BadRequestError from '../errors/bad-request-error';

const translateValidationError = (next: NextFunction, validationError: string, confilctError: string = '') => (err: Error) => {
  if (err instanceof mongoose.Error.ValidationError) {
    next(new BadRequestError(`${validationError}. ${err.message}`));
  } else if (err instanceof mongoose.Error.CastError) {
    next(new BadRequestError(validationError));
  } else if (err instanceof MongoServerError && err.code === 11000) {
    next(new ConflictError(confilctError));
  } else {
    next(err);
  }
};

export default translateValidationError;
