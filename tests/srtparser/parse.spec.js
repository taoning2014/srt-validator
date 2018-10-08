import SRTParser from 'srt-validator/srtparser';
import ParseError from 'srt-validator/srtparser/parseerror';
import { toMS } from 'srt-validator/srtparser/date';
import { parseTimeStamp } from 'srt-validator/srtparser/parse';

const { test } = QUnit;

test('Success: Simple caption file', function(assert) {
  assert.deepEqual(
    SRTParser.parse(
      `1
00:00:00,000 --> 00:00:00,001
hello

2
00:00:00,001 --> 00:00:00,002
world`
    ),
    [
      {
        lineNumbers: {
          chunkEnd: 2,
          chunkStart: 0,
          sequenceNumber: 0,
          text: 2,
          timeSpan: 1,
        },
        sequenceNumber: 1,
        time: { start: 0, end: 1 },
        text: 'hello',
      },
      {
        lineNumbers: {
          chunkEnd: 6,
          chunkStart: 4,
          sequenceNumber: 4,
          text: 6,
          timeSpan: 5,
        },
        sequenceNumber: 2,
        time: { start: 1, end: 2 },
        text: 'world',
      },
    ]
  );
});

test('Success: multiline text', function(assert) {
  assert.deepEqual(
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
    ),
    [
      {
        lineNumbers: {
          chunkEnd: 5,
          chunkStart: 0,
          sequenceNumber: 0,
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
    ]
  );
});

test('Failure: too many separators', function(assert) {
  assert.throws(
    () =>
      SRTParser.parse(
        `1
00:00:00,000 --> 00:00:00,00
hello


1
00:00:00,000 --> 00:00:00,00
hello
`
      ),
    new ParseError('Missing sequence number', 4)
  );
});

test('parseTimeStamp: successful conversions', function(assert) {
  const data = [
    // Correctly padded
    { str: '00:00:00,000', expected: 0 },
    { str: '01:00:00,000', expected: toMS.hour },
    { str: '00:01:00,000', expected: toMS.minute },
    { str: '00:00:01,000', expected: toMS.second },

    // Decimal separated instead of comma (some US editors do this)
    { str: '00:00:00.000', expected: 0 },
    { str: '01:00:00.000', expected: toMS.hour },
    { str: '00:01:00.000', expected: toMS.minute },
    { str: '00:00:01.000', expected: toMS.second },

    // Overflow
    { str: '00:60:00,000', expected: toMS.hour },
    { str: '00:00:60,000', expected: toMS.minute },

    // Unpadded
    { str: '0:0:0,0', expected: 0 },
    { str: '1:0:0,0', expected: toMS.hour },
    { str: '0:1:0,0', expected: toMS.minute },
    { str: '0:0:1,0', expected: toMS.second },
  ].forEach(data => {
    assert.equal(parseTimeStamp(data.str), data.expected);
  });
});

test('Failure: invalid sequence number', function(assert) {
  assert.throws(
    () =>
      SRTParser.parse(
        `asdf
00:00:00,000 --> 00:00:00,001
hello`
      ),
    new ParseError('Expected Integer for sequence number: asdf', 0)
  );
});

test('Failure: invalid time span', function(assert) {
  assert.throws(
    () =>
      SRTParser.parse(
        `1
00:00:00,000 -> 00:00:00,001
hello`
      ),
    new ParseError('Invalid time span: 00:00:00,000 -> 00:00:00,001', 1)
  );
});

test('Failure: invalid time stamp', function(assert) {
  assert.throws(
    () =>
      SRTParser.parse(
        `1
asdf --> 00:00:00,000
hello`
      ),
    new ParseError('Invalid time stamp: asdf', 1),
    'start timestamp'
  );

  assert.throws(
    () =>
      SRTParser.parse(
        `1
00:00:00,000 --> asdf
hello`
      ),
    new ParseError('Invalid time stamp: asdf', 1),
    'end timestamp'
  );
});

test('Failure: invalid time span', function(assert) {
  assert.throws(
    () =>
      SRTParser.parse(
        `1
00:00:00,000 -> 00:00:00,001
hello`
      ),
    new ParseError('Invalid time span: 00:00:00,000 -> 00:00:00,001', 1)
  );
});

test('Failure: missing caption text', function(assert) {
  assert.throws(
    () =>
      SRTParser.parse(
        `1
00:00:00,000 --> 00:00:00,000`
      ),
    new ParseError('Missing caption text', 2)
  );
});

test('parseTimeStamp: unparseable', function(assert) {
  const data = [
    // Missing fields
    ':00:00,000',
    '00::00,000',
    '00:00:,000',
    '00:00:00,',
  ].forEach(data => {
    assert.throws(() => parseTimeStamp(data.str));
  });
});
