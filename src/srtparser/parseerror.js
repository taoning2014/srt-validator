export default class ParseError extends Error {
  constructor(message, lineNumber) {
    super(message);
    this.lineNumber = lineNumber + 1;
  }
}
