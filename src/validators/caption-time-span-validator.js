import BaseValidator from './base';
import ERROR_CODE from '../utils/error-code';

export default class CaptionTimeSpanValidator extends BaseValidator {
  constructor(...args) {
    super(...args);
    this.validator = 'CaptionTimeSpanValidator';
  }

  validate(...args) {
    super.validate(...args);

    let previousEndTime = 0;
    this.parsedJSON
      .map(({ time: { start, end }, lineNumbers }) => {
        if (start >= end) {
          this.addToResult({
            errorCode: ERROR_CODE.VALIDATOR_ERROR_START_TIME,
            message: 'start time should be less than end time',
            lineNumber: lineNumbers.timeSpan + 1, // lineNumber is 0-indexed
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
          });
        }

        previousEndTime = end;
      });

    return this.result;
  }
}
