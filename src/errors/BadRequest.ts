import { BAD_REQUEST } from '../constants/codes';

export default class BadRequest extends Error {
  public statusCode: typeof BAD_REQUEST;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}
