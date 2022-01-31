import SRTParser from './parser/index';
import { Parsed } from './utils/types';
import ParseError from './utils/parse-error';
import ValidationError from './utils/validation-error';
import CaptionTimeSpanValidator from './validators/caption-time-span-validator';
import LineNumberValidator from './validators/line-number-validator';

type SrtError = ParseError | ValidationError;

function runValidator(
  Validators: (CaptionTimeSpanValidator | LineNumberValidator)[],
  parsedObj: Parsed
) {
  /* eslint-disable */
  return Validators.map((Validator) => {
    // @ts-ignore
    const validator = new Validator(parsedObj);
    return validator.validate();
  }).reduce((acc: ValidationError[], cur: ValidationError[]) => {
    acc.push(...cur);
    return acc;
  }, []);
  /* eslint-enable */
}

function srtValidator(srtString: string) {
  const result: SrtError[] = [];
  let parsedObjArray;

  try {
    parsedObjArray = SRTParser.parse(srtString);
  } catch (error: unknown) {
    result.push(error as ParseError);
  }

  if (result.length) {
    return result;
  }

  /* eslint-disable */
  result.push(
    ...runValidator(
      // @ts-ignore
      [LineNumberValidator, CaptionTimeSpanValidator],
      parsedObjArray
    )
  );
  /* eslint-enable */

  return result.sort((a, b) => a.lineNumber - b.lineNumber);
}

export const validator = srtValidator;
export const parser = SRTParser;

// Default validator for backwards compatibility
export default srtValidator;
