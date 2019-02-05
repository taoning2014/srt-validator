import srtValidator from 'srt-validator/srtValidator';

test('Success: empty array is returned when there are no errors', () => {
  const input = `1
00:00:00,000 --> 00:00:00,001
hello

2
00:00:00,001 --> 00:00:00,002
world`;

  expect(srtValidator(input)).toEqual([]);
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

test('Failure: time spans are invalid if start time is after finish time', () => {
  const input = `1
  00:00:00,000 --> 00:00:00,001
  hello

  2
  00:00:00,002 --> 00:00:00,001
  world
  `;

  expect(srtValidator(input)).toEqual([
    {
      errorCode: 'validatorErrorStartTime',
      lineNumber: 6,
      message: 'start time should be less than end time',
      validator: 'CaptionTimeSpanValidator',
    },
  ]);
});

test('Failure: time spans are invalid if start time is after end time', () => {
  const input = `1
  00:00:00,000 --> 00:00:00,001
  hello

  2
  00:00:00,002 --> 00:00:00,001
  world
  `;

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
  how are you doing?
  `;

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

  expect(srtValidator(invalidTimeSpanInput)).toEqual([
    {
      errorCode: 'parserErrorInvalidTimeSpan',
      lineNumber: 2,
      message: 'Invalid time span: 00:00:00,000 -->',
    },
  ]);

  expect(srtValidator(missingTimeSpanInput)).toEqual([
    {
      errorCode: 'parserErrorMissingTimeSpan',
      lineNumber: 7,
      message: 'Missing time span',
    },
  ]);
});

test('Failure: parse errors from timestamps are returned', () => {
  const invalidTimestamp = `1
00:00:00,000 --> 0o:00:00,000
hello
world
  `;

  expect(srtValidator(invalidTimestamp)).toEqual([
    {
      errorCode: 'parserErrorInvalidTimeStamp',
      lineNumber: 2,
      message: 'Invalid time stamp: 0o:00:00,000',
    },
  ]);
});

test('Failure: parse errors from sequence numbers are returned', () => {
  const invalidSequenceInput = `this is clearly not a sequence
00:00:00,000 --> 00:00:00,001
hello
world
  `;

  const missingSequenceInput = `1
00:00:00,000 --> 00:00:00,001
hello
world


00:00:00,001 --> 00:00:00,002
hi again
  `;

  expect(srtValidator(invalidSequenceInput)).toEqual([
    {
      errorCode: 'parserErrorInvalidSequenceNumber',
      lineNumber: 1,
      message:
        'Expected Integer for sequence number: this is clearly not a sequence',
    },
  ]);

  expect(srtValidator(missingSequenceInput)).toEqual([
    {
      errorCode: 'parserErrorMissingSequenceNumber',
      lineNumber: 6,
      message: 'Missing sequence number',
    },
  ]);
});
