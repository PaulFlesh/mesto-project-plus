import { CONFLICT } from '../constants/codes';

export default class Conflict extends Error {
  public statusCode: typeof CONFLICT;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT;
  }
}
