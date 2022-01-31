import BaseValidator from './base';
import ERROR_CODE from '../utils/error-code';
import { Parsed, ValidatorType } from '../utils/types';

export default class LineNumberValidator extends BaseValidator {
  readonly validator: ValidatorType = 'LineNumberValidator';

  constructor(protected parsedJSON: Parsed[]) {
    super(parsedJSON);
  }

  validate() {
    if (!this.parsedJSON.length) {
      return this.result;
    }

    // need to start with 1
    if (this.parsedJSON[0].sequenceNumber !== 1) {
      this.addToResult({
        errorCode: ERROR_CODE.VALIDATOR_ERROR_SEQUENCE_NUMBER_START,
        message: 'number of sequence need to start with 1',
        lineNumber: this.parsedJSON[0].lineNumbers.chunkStart + 1, // lineNumber is 0-indexed
        validator: this.validator,
      });
    }

    // start at index 1, because we already validated the first sequence
    for (let i = 1; i < this.parsedJSON.length; i += 1) {
      const { sequenceNumber, lineNumbers } = this.parsedJSON[i];
      if (sequenceNumber !== i + 1) {
        this.addToResult({
          errorCode: ERROR_CODE.VALIDATOR_ERROR_SEQUENCE_NUMBER_INCREMENT,
          message: 'number of sequence need to increment by 1',
          lineNumber: lineNumbers.chunkStart + 1, // lineNumber is 0-indexed
          validator: this.validator,
        });
      }
    }

    return this.result;
  }
}
