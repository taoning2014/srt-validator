import BaseValidator from './base';
import { ERROR_CODE } from '../utils/errorCode';

export default class LineNumberValidator extends BaseValidator {
  constructor(...args) {
    super(...args);
    this._validator = 'LineNumberValidator';
  }

  validate(...args) {
    super.validate(...args);

    // need to start with 1
    if (this.parsedJSON[0].sequenceNumber !== 1) {
      this._addToResult({
        errorCode: ERROR_CODE.VALIDATOR_ERROR_SEQUENCE_NUMBER_START,
        message: 'number of sequence need to start with 1',
        lineNumber: this.parsedJSON[0].sequenceNumber + 1,
      });
    }

    // need to increment by 1
    // todo: refactor to reduce
    this.parsedJSON.map((obj, index) => {
      const { sequenceNumber, lineNumbers } = obj;
      if (sequenceNumber !== index + 1) {
        this._addToResult({
          errorCode: ERROR_CODE.VALIDATOR_ERROR_SEQUENCE_NUMBER_INCREMENT,
          message: 'number of sequence need to increment by 1',
          lineNumber: lineNumbers.sequenceNumber + 1,
        });
      }
    });

    return this.result;
  }
}
