export default class ParseError extends Error {
  constructor(message, lineNumber, errorCode) {
    super(message);
    this.lineNumber = lineNumber + 1; // lineNumber is 0-indexed
    this.errorCode = errorCode;
  }
}
