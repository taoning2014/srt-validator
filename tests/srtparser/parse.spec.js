import SRTParser from 'srt-validator/srtparser';
import ParseError from 'srt-validator/srtparser/parseerror';
import { toMS } from 'srt-validator/srtparser/date';
import { parseTimeStamp } from 'srt-validator/srtparser/parse';

test('Success: Simple caption file', () => {
  expect(
    SRTParser.parse(
      `1
00:00:00,000 --> 00:00:00,001
hello

2
00:00:00,001 --> 00:00:00,002
world`
    )
  ).toEqual([
    {
      lineNumbers: {
        chunkStart: 0,
        chunkEnd: 2,
        text: 2,
        timeSpan: 1,
      },
      sequenceNumber: 1,
      time: { start: 0, end: 1 },
      text: 'hello',
    },
    {
      lineNumbers: {
        chunkStart: 4,
        chunkEnd: 6,
        text: 6,
        timeSpan: 5,
      },
      sequenceNumber: 2,
      time: { start: 1, end: 2 },
      text: 'world',
    },
  ]);
});

test('Success: Simple caption file with blank line in the end', () => {
  expect(
    SRTParser.parse(
      `1
00:00:00,000 --> 00:00:00,001
hello

2
00:00:00,001 --> 00:00:00,002
world

`
    )
  ).toEqual([
    {
      lineNumbers: {
        chunkStart: 0,
        chunkEnd: 2,
        text: 2,
        timeSpan: 1,
      },
      sequenceNumber: 1,
      time: { start: 0, end: 1 },
      text: 'hello',
    },
    {
      lineNumbers: {
        chunkStart: 4,
        chunkEnd: 6,
        text: 6,
        timeSpan: 5,
      },
      sequenceNumber: 2,
      time: { start: 1, end: 2 },
      text: 'world',
    },
  ]);
});

test('Success: multiline text', () => {
  expect(
    SRTParser.parse(
      `1
00:00:00,000 --> 00:00:00,001
hello
world
this
is
cool
`
    )
  ).toEqual([
    {
      lineNumbers: {
        chunkEnd: 6,
        chunkStart: 0,
        text: 2,
        timeSpan: 1,
      },
      sequenceNumber: 1,
      time: { start: 0, end: 1 },
      text: `hello
world
this
is
cool`,
    },
  ]);
});

test('Success: erroneous multiline text', () => {
  expect(
    // I'm purposefully choosing to make a mistake and not include a separator here.
    // While it's clear that the separator was intended, the parser should behave
    // exactly as a Video would interpret it. Therefore, the following is valid
    // because the "mistake" will be counted as multiple lines of text.
    SRTParser.parse(
      `1
00:00:00,000 --> 00:00:00,001
hello
1
00:00:00,001 --> 00:00:00,002
world
`
    )
  ).toEqual([
    {
      lineNumbers: {
        chunkEnd: 5,
        chunkStart: 0,
        text: 2,
        timeSpan: 1,
      },
      sequenceNumber: 1,
      time: { start: 0, end: 1 },
      text: `hello
1
00:00:00,001 --> 00:00:00,002
world`,
    },
  ]);
});

test('Failure: blank line at the beginning of the file', () => {
  expect(() =>
    SRTParser.parse(
      `

1
00:00:00,000 --> 00:00:00,001
hello

2
00:00:00,001 --> 00:00:00,002
world`
    )
  ).toThrowError(new ParseError('Missing sequence number', 0));
});

test('Failure: too many separators', () => {
  expect(() =>
    SRTParser.parse(
      `1
00:00:00,000 --> 00:00:00,000
hello


1
00:00:00,000 --> 00:00:00,000
hello
`
    )
  ).toThrowError(new ParseError('Missing sequence number', 4));
});

test('parseTimeStamp: successful conversions', () => {
  [
    // Correctly padded
    { str: '00:00:00,000', expected: 0 },
    { str: '01:00:00,000', expected: toMS.hour },
    { str: '00:01:00,000', expected: toMS.minute },
    { str: '00:00:01,000', expected: toMS.second },

    // Overflow
    { str: '00:60:00,000', expected: toMS.hour },
    { str: '00:00:60,000', expected: toMS.minute },
  ].forEach((datum) => {
    expect(parseTimeStamp(datum.str)).toEqual(datum.expected);
  });
});

test('Failure: missing time span', () => {
  expect(() =>
    SRTParser.parse(`1

hello
  `)
  ).toThrowError(new ParseError('Missing time span', 2));
});

test('Failure: invalid time span', () => {
  expect(() =>
    SRTParser.parse(`1
00:00:00,000 -->
hello`)
  ).toThrowError(new ParseError('Invalid time span: 00:00:00,000 -->', 2));
});

test('Failure: invalid sequence number', () => {
  expect(() =>
    SRTParser.parse(
      `asdf
00:00:00,000 --> 00:00:00,001
hello`
    )
  ).toThrowError(
    new ParseError('Expected Integer for sequence number: asdf', 0)
  );
});

test('Failure: invalid time span', () => {
  expect(() =>
    SRTParser.parse(
      `1
00:00:00,000 -> 00:00:00,001
hello`
    )
  ).toThrowError(
    new ParseError('Invalid time span: 00:00:00,000 -> 00:00:00,001', 1)
  );
});

test('Failure: invalid time span', () => {
  const input = [
    '1',
    '00:00:00,000 --> 00:00:00,001 ', // trailing whitespace
    'hello',
  ].join('\n');

  expect(() => SRTParser.parse(input)).toThrowError(
    new ParseError('Invalid time span: 00:00:00,000 --> 00:00:00,001 ', 2)
  );
});

test('Failure: invalid sequence number', () => {
  const input = [
    '1 ', // trailing whitespace
    '00:00:00,000 --> 00:00:00,001',
    'hello',
  ].join('\n');

  expect(() => SRTParser.parse(input)).toThrowError(
    new ParseError('Expected Integer for sequence number: 1 ', 0)
  );
});

test('Failure: invalid time stamp', () => {
  expect(() =>
    SRTParser.parse(
      `1
asdf --> 00:00:00,000
hello`
    )
  ).toThrowError(
    new ParseError('Invalid time stamp: asdf', 1),
    'start timestamp'
  );

  expect(() =>
    SRTParser.parse(
      `1
00:00:00,000 --> asdf
hello`
    )
  ).toThrowError(
    new ParseError('Invalid time stamp: asdf', 1),
    'end timestamp'
  );

  // unpadded
  expect(() =>
    SRTParser.parse(
      `1
0:0:0,0 --> 00:00:00,001
hello`
    )
  ).toThrowError(
    new ParseError('Invalid time stamp: 0:0:0,0', 1),
    'end timestamp'
  );

  // decimal
  expect(() =>
    SRTParser.parse(
      `1
00:00:00,000 --> 00:00:00.001
hello`
    )
  ).toThrowError(
    new ParseError('Invalid time stamp: 00:00:00.001', 1),
    'end timestamp'
  );
});

test('Failure: invalid time span', () => {
  expect(() =>
    SRTParser.parse(
      `1
00:00:00,000 -> 00:00:00,001
hello`
    )
  ).toThrowError(
    new ParseError('Invalid time span: 00:00:00,000 -> 00:00:00,001', 1)
  );
});

test('Failure: missing caption text', () => {
  expect(() =>
    SRTParser.parse(
      `1
00:00:00,000 --> 00:00:00,000`
    )
  ).toThrowError(new ParseError('Missing caption text', 2));
});

test('parseTimeStamp: unparseable', () => {
  [
    // Missing fields
    ':00:00,000',
    '00::00,000',
    '00:00:,000',
    '00:00:00,',
  ].forEach((data) => {
    expect(() => parseTimeStamp(data.str)).toThrow();
  });
});
