import srtValidator from '../dist/index';

test('Success: empty array is returned when there are no errors', () => {
  const input = `1
00:00:00,000 --> 00:00:00,001
hello

2
00:00:00,001 --> 00:00:00,002
world`;

  expect(srtValidator(input)).toEqual([]);
});

test('Failure: error message should be sorted by line number', () => {
  const input = `1
00:00:00,010 --> 00:00:00,001
hello

1
00:00:00,001 --> 00:00:00,002
world`;

  expect(srtValidator(input)).toEqual([
    {
      errorCode: 'validatorErrorStartTime',
      lineNumber: 2,
      message: 'start time should be less than end time',
      validator: 'CaptionTimeSpanValidator',
    },
    {
      errorCode: 'validatorErrorSequenceNumberIncrement',
      lineNumber: 5,
      message: 'number of sequence need to increment by 1',
      validator: 'LineNumberValidator',
    },
  ]);
});

test('Failure: sequence numbers are invalid if they do not start at 1', () => {
  const input = `2
00:00:00,000 --> 00:00:00,001
hello`;

  expect(srtValidator(input)).toEqual([
    {
      errorCode: 'validatorErrorSequenceNumberStart',
      lineNumber: 1,
      message: 'number of sequence need to start with 1',
      validator: 'LineNumberValidator',
    },
  ]);
});

test('Failure: sequence numbers are invalid if they are not sequential', () => {
  const dupedSequenceInput = `1
00:00:00,000 --> 00:00:00,001
hello

1
00:00:00,001 --> 00:00:00,002
world
`;

  const nonConsecutiveInput = `1
00:00:00,000 --> 00:00:00,001
hello

2
00:00:00,001 --> 00:00:00,002
world

30
00:00:00,002 --> 00:00:00,003
sup?
`;

  expect(srtValidator(dupedSequenceInput)).toEqual([
    {
      errorCode: 'validatorErrorSequenceNumberIncrement',
      lineNumber: 5,
      message: 'number of sequence need to increment by 1',
      validator: 'LineNumberValidator',
    },
  ]);

  expect(srtValidator(nonConsecutiveInput)).toEqual([
    {
      errorCode: 'validatorErrorSequenceNumberIncrement',
      lineNumber: 9,
      message: 'number of sequence need to increment by 1',
      validator: 'LineNumberValidator',
    },
  ]);
});

test('Failure: time spans are invalid if start time is after end time', () => {
  const input = `1
00:00:00,000 --> 00:00:00,001
hello

2
00:00:00,002 --> 00:00:00,001
world`;

  expect(srtValidator(input)).toEqual([
    {
      errorCode: 'validatorErrorStartTime',
      lineNumber: 6,
      message: 'start time should be less than end time',
      validator: 'CaptionTimeSpanValidator',
    },
  ]);
});

test('Failure: time spans are invalid if start time is after previous end time', () => {
  const input = `1
00:00:00,000 --> 00:00:00,001
hello
world

2
00:00:00,001 --> 00:00:00,002
sup?

3
00:00:00,001 --> 00:00:00,003
how are you doing?`;

  expect(srtValidator(input)).toEqual([
    {
      errorCode: 'validatorErrorEndTime',
      lineNumber: 11,
      message: 'start time should be less than previous end time',
      validator: 'CaptionTimeSpanValidator',
    },
  ]);
});

test('Failure: parse errors from time spans are returned', () => {
  const invalidTimeSpanInput = `1
00:00:00,000 -->
hello
world
  `;

  const missingTimeSpanInput = `1
00:00:00,000 --> 00:00:00,001
hello
world

2

sup
  `;

  let [{ errorCode, lineNumber, message }] = srtValidator(invalidTimeSpanInput);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorInvalidTimeSpan',
    lineNumber: 2,
    message: 'Invalid time span: 00:00:00,000 -->',
  });

  [{ errorCode, lineNumber, message }] = srtValidator(missingTimeSpanInput);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorMissingTimeSpan',
    lineNumber: 7,
    message: 'Missing time span',
  });
});

test('Failure: parse errors from timestamps are returned', () => {
  const gibberishTimestamp = `1
00:00:00,000 --> gi:bb:00,ish
hello
world`;

  let [{ errorCode, lineNumber, message }] = srtValidator(gibberishTimestamp);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorInvalidTimeStamp',
    lineNumber: 2,
    message: 'Invalid time stamp: gi:bb:00,ish',
  });

  const unpaddedTimestamp = `1
0:0:0,0 --> 0:0:0,1
hello
world`;

  [{ errorCode, lineNumber, message }] = srtValidator(unpaddedTimestamp);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorInvalidTimeStamp',
    lineNumber: 2,
    message: 'Invalid time stamp: 0:0:0,0',
  });

  const decimalTimeStamp = `1
00:00:00.000 --> 00:00:00.001
hello
world`;

  [{ errorCode, lineNumber, message }] = srtValidator(decimalTimeStamp);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorInvalidTimeStamp',
    lineNumber: 2,
    message: 'Invalid time stamp: 00:00:00.000',
  });
});

test('Failure: parse errors from sequence numbers are returned', () => {
  const invalidSequenceInput = `this is clearly not a sequence
00:00:00,000 --> 00:00:00,001
hello
world`;

  const missingSequenceInput = `1
00:00:00,000 --> 00:00:00,001
hello
world


00:00:00,001 --> 00:00:00,002
hi again`;

  const missingTimeSpan = `1

hello
world`;

  const missingCaption = `1
00:00:00,000 --> 00:00:00,001

2
00:00:00,001 --> 00:00:00,002
hi again`;

  let [{ errorCode, lineNumber, message }] = srtValidator(invalidSequenceInput);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorInvalidSequenceNumber',
    lineNumber: 1,
    message:
      'Expected Integer for sequence number: this is clearly not a sequence',
  });

  [{ errorCode, lineNumber, message }] = srtValidator(missingSequenceInput);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorMissingSequenceNumber',
    lineNumber: 6,
    message: 'Missing sequence number',
  });

  [{ errorCode, lineNumber, message }] = srtValidator(missingTimeSpan);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorMissingTimeSpan',
    lineNumber: 2,
    message: 'Missing time span',
  });

  [{ errorCode, lineNumber, message }] = srtValidator(missingCaption);
  expect({ errorCode, lineNumber, message }).toEqual({
    errorCode: 'parserErrorMissingText',
    lineNumber: 3,
    message: 'Missing caption text',
  });
});
