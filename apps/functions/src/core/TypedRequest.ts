import { Request } from 'firebase-functions/v1/https';

export interface TypedRequest<T> extends Request {
  body: T;
}
