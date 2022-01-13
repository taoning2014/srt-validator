export default class BaseValidator {
  constructor(parsedJSON) {
    this.result = [];
    this.parsedJSON = parsedJSON;
  }

  // Need to be Override
  // eslint-disable-next-line consistent-return
  validate() {
    if (!this.parsedJSON.length) {
      return this.result;
    }
  }

  // Push to result
  addToResult({ message = '', lineNumber, errorCode }) {
    this.result.push({
      errorCode,
      message,
      lineNumber,
      validator: this.validator,
    });
  }
}
