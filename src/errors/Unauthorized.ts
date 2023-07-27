import { UNAUTHORIZED } from '../constants/codes';

export default class Unathorized extends Error {
  public statusCode: typeof UNAUTHORIZED;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}
