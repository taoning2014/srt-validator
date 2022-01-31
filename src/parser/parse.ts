import ErrorCode from '../utils/error-code';
import ParseError from '../utils/parse-error';
import toMS from './date';
import { Parsed } from '../utils/types';

const EOL = /\r?\n/;
const TRAILING_WHITE_SPACE = /\s$/;
const TIME_STAMP_REGEX = /^(\d{2}):(\d{2}):(\d{2}),(\d{3})$/;

/**
 * Parse a sequence number
 * @param  {String} sequenceNumber
 * @param  {Number} lineNumber - The line number currently being parsed
 * @return {Number}
 */
function parseSequenceNumber(sequenceNumber: string, lineNumber: number) {
  if (!sequenceNumber) {
    throw new ParseError(
      `Missing sequence number`,
      lineNumber,
      ErrorCode.PARSER_ERROR_MISSING_SEQUENCE_NUMBER
    );
  }

  const sequenceNum = Number(sequenceNumber);
  if (
    !Number.isInteger(sequenceNum) ||
    TRAILING_WHITE_SPACE.test(sequenceNumber)
  ) {
    throw new ParseError(
      `Expected Integer for sequence number: ${sequenceNumber}`,
      lineNumber,
      ErrorCode.PARSER_ERROR_INVALID_SEQUENCE_NUMBER
    );
  }
  return sequenceNum;
}

/**
 * Parse a timestamp into an integer
 * @example
 * Input:
 * "00:00:02,820"
 * Output:
 * 2820
 * @param  {String} timeStamp - a timestamp from a timespan.
 * @param  {Number} lineNumber - The line number currently being parsed
 * @return {Number}
 */
export function parseTimeStamp(timeStamp: string, lineNumber: number) {
  const match = TIME_STAMP_REGEX.exec(timeStamp);
  if (!match) {
    throw new ParseError(
      `Invalid time stamp: ${timeStamp}`,
      lineNumber,
      ErrorCode.PARSER_ERROR_INVALID_TIME_STAMP
    );
  }
  const [hours, minutes, seconds, millis] = match.slice(1).map(Number);
  return (
    hours * toMS.hour + minutes * toMS.minute + seconds * toMS.second + millis
  );
}

/**
 * Parse a timespan into integer start and end values
 * @example
 * Input:
 * "00:00:02,820 --> 00:00:05,120"
 * Output:
 * { start: 2820, end: 5120 }
 *
 * @param  {String} timeSpan
 * @param  {Number} lineNumber - The line number currently being parsed
 * @return {Object}
 */
function parseTimeSpan(timeSpan: string, lineNumber: number) {
  if (!timeSpan) {
    throw new ParseError(
      `Missing time span`,
      lineNumber,
      ErrorCode.PARSER_ERROR_MISSING_TIME_SPAN
    );
  }
  const [start, end] = timeSpan.split(' --> ');
  if (!start || !end || TRAILING_WHITE_SPACE.test(timeSpan)) {
    throw new ParseError(
      `Invalid time span: ${timeSpan}`,
      lineNumber,
      ErrorCode.PARSER_ERROR_INVALID_TIME_SPAN
    );
  }
  return {
    start: parseTimeStamp(start, lineNumber),
    end: parseTimeStamp(end, lineNumber),
  };
}

/**
 * Parses a given SRT file contents
 * @param  {String} file - Contents of an SRT file in the string format
 * @return {Array} - A list of subtitle metadata
 */
export default function parse(file: string) {
  const lines = file.trimEnd().split(EOL);

  const result: Parsed[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const lineNumbers = { chunkStart: i, timeSpan: i, text: i, chunkEnd: i };

    // First line
    const sequenceNumber = parseSequenceNumber(lines[i], i);

    // Second line
    i += 1;
    lineNumbers.timeSpan = i;
    const time = parseTimeSpan(lines[i], i);

    // Text can span multiple lines, so consume all lines
    // until the separator

    i += 1;
    lineNumbers.text = i;
    const linesOfText = [];
    while (lines[i] && lines[i].trim()) {
      linesOfText.push(lines[i]);
      i += 1;
    }
    const text = linesOfText.join('\n');
    if (!text) {
      throw new ParseError(
        `Missing caption text`,
        i,
        ErrorCode.PARSER_ERROR_MISSING_TEXT
      );
    }

    lineNumbers.chunkEnd = i - 1;

    result.push({
      lineNumbers,
      sequenceNumber,
      time,
      text,
    });
  }

  return result;
}
