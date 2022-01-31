import ErrorCode from './error-code';

export default class ParseError extends Error {
  constructor(
    message: string,
    public lineNumber: number,
    public errorCode: ErrorCode
  ) {
    super(message);
    this.lineNumber = lineNumber + 1; // lineNumber is 0-indexed
    this.errorCode = errorCode;
  }
}
