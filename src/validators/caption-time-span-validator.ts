import BaseValidator from './base';
import ERROR_CODE from '../utils/error-code';
import { Parsed, ValidatorType } from '../utils/types';

export default class CaptionTimeSpanValidator extends BaseValidator {
  readonly validator: ValidatorType = 'CaptionTimeSpanValidator';

  constructor(protected parsedJSON: Parsed[]) {
    super(parsedJSON);
  }

  validate() {
    if (!this.parsedJSON.length) {
      return this.result;
    }

    let previousEndTime = 0;
    this.parsedJSON
      .map(({ time: { start, end }, lineNumbers }) => {
        if (start >= end) {
          this.addToResult({
            errorCode: ERROR_CODE.VALIDATOR_ERROR_START_TIME,
            message: 'start time should be less than end time',
            lineNumber: lineNumbers.timeSpan + 1, // lineNumber is 0-indexed
            validator: this.validator,
          });
        }

        return { start, end, lineNumbers };
      })
      .forEach(({ start, end, lineNumbers }, index) => {
        if (index === 0) {
          previousEndTime = end;
          return;
        }

        if (previousEndTime > start) {
          this.addToResult({
            errorCode: ERROR_CODE.VALIDATOR_ERROR_END_TIME,
            message: 'start time should be less than previous end time',
            lineNumber: lineNumbers.timeSpan + 1, // lineNumber is 0-indexed
            validator: this.validator,
          });
        }

        previousEndTime = end;
      });

    return this.result;
  }
}
