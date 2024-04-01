export interface IError extends Error {
  statusCode: number;
  message: string
}
