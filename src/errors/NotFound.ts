import { NOT_FOUND } from '../constants/codes';

export default class NotFound extends Error {
  public statusCode: typeof NOT_FOUND;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}
