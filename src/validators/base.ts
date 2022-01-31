import ValidationError from '../utils/validation-error';
import { Parsed, ValidatorType } from '../utils/types';

export default abstract class BaseValidator {
  abstract readonly validator: ValidatorType;

  protected result: ValidationError[];

  constructor(protected parsedJSON: Parsed[]) {
    this.result = [];
    this.parsedJSON = parsedJSON;
  }

  abstract validate(): void;

  // Push to result
  // Todo[@taoning2014]: Push the `ParseError` into the result array directly instead of destructing it
  addToResult(validationError: ValidationError) {
    this.result.push(validationError);
  }
}
