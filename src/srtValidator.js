import SRTParser from './srtparser';
import LineNumberValidator from './validators/lineNumberValidator';
import CaptionTimeSpanValidator from './validators/captionTimeSpanValidator';

function _runValidator(Validators, parsedObj) {
  return Validators.map(Validator => {
    const validator = new Validator(parsedObj);
    return validator.validate();
  }).reduce((acc, cur) => {
    acc.push(...cur);
    return acc;
  }, []);
}

export default function srtValidator(srtString) {
  const result = [];
  let parsedObj;

  try {
    parsedObj = SRTParser.parse(srtString);
  } catch (error) {
    // grab the details from the ParseError
    const { message, lineNumber, errorCode } = error;
    result.push({ message, lineNumber, errorCode });
  }

  if (result.length) {
    return result;
  }

  result.push(
    ..._runValidator([LineNumberValidator, CaptionTimeSpanValidator], parsedObj)
  );
  return result;
}
