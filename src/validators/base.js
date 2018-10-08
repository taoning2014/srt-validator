export default class BaseValidator {
  constructor(parsedJSON) {
    this.result = [];
    this.parsedJSON = parsedJSON;
  }

  // Need to be Override
  validate() {
    if (!this.parsedJSON.length) {
      return this.result;
    }
  }

  // Push to result
  _addToResult({ message = '', lineNumber, errorCode }) {
    this.result.push({
      errorCode,
      message,
      lineNumber,
      validator: this._validator,
    });
  }
}
