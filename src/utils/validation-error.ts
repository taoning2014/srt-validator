import ErrorCode from './error-code';
import { ValidatorType } from './types';

type ValidationError = {
  errorCode: ErrorCode;
  message: string;
  lineNumber: number;
  validator: ValidatorType;
};

export default ValidationError;
