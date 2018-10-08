import BaseValidator from './base';

export default class CaptionTimeSpanValidator extends BaseValidator {
  constructor(...args) {
    super(...args);
    this._validator = 'CaptionTimeSpanValidator';
  }

  validate(...args) {
    super.validate(...args);

    let previousEndTime = 0;
    this.parsedJSON
      .map(({ time: { start, end }, lineNumbers }, index) => {
        if (start >= end) {
          this._addToResult({
            message: 'start time should be less than end time',
            lineNumber: lineNumbers.timeSpan + 1,
          });
        }

        return { start, end };
      })
      .map(({ start, end }, index) => {
        if (index === 0) {
          previousEndTime = end;
          return;
        }

        if (previousEndTime > start) {
          this._addToResult({
            message: 'start time should be less than previous end time',
            lineNumber: lineNumbers.timeSpan + 1,
          });
        }

        previousEndTime = end;
      });

    return this.result;
  }
}
