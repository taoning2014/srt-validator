# Types of Errors

## Sequence number

When the sequence number is not an integer:

```srt
Network
00:00:00,000 --> 00:00:00,001
I'm as mad as hell, and I'm not going to take this anymore!"
```

```srt
{
  errorCode: 'parserErrorInvalidSequenceNumber',
  lineNumber: 1,
  message:
    'Expected Integer for sequence number: Network',
}
```

When the first sequence is not 1:

```srt
2
00:00:00,000 --> 00:00:00,001
Louis, I think this is the beginning of a beautiful friendship.
```

```srt
{
  errorCode: 'validatorErrorSequenceNumberStart',
  lineNumber: 1,
  message: 'number of sequence need to start with 1',
  validator: 'LineNumberValidator',
}
```

When the sequences are not in order:

```srt
1
00:00:00,000 --> 00:00:00,001
You know how to whistle, don't you, Steve?

3
00:00:00,001 --> 00:00:00,002
You just put your lips together and blow.
```

```srt
{
  errorCode: 'validatorErrorSequenceNumberIncrement',
  lineNumber: 5,
  message: 'number of sequence need to increment by 1',
  validator: 'LineNumberValidator',
}
```

When the sequence number is missing:

```srt
1
00:00:01,000 --> 00:00:02,000
Badges? We ain't got no badges! We don't need no badges!


00:00:02,000 --> 00:00:03,000
I don't have to show you any stinking badges!
```

```srt
{
  errorCode: 'parserErrorMissingSequenceNumber',
  lineNumber: 5,
  message: 'Missing sequence number',
},
```

## Time Span

When the start of a sequence is after it ends:

```srt
1
00:00:00,000 --> 00:00:00,001
You've got to ask yourself one question: "Do I feel lucky?"

2
00:00:00,002 --> 00:00:00,001
Well, do ya, punk?
```

```srt
{
  errorCode: 'validatorErrorStartTime',
  lineNumber: 6,
  message: 'start time should be less than end time',
  validator: 'CaptionTimeSpanValidator',
}
```

When the start of one sequence is before the previous sequence's end:

```srt
1
00:00:00,000 --> 00:00:00,001
One morning I shot an elephant in my pajamas.

2
00:00:00,001 --> 00:00:00,002
How he got in my pajamas...

3
00:00:00,001 --> 00:00:00,003
I don't know.
```

```srt
{
  errorCode: 'validatorErrorEndTime',
  lineNumber: 10,
  message: 'start time should be less than previous end time',
  validator: 'CaptionTimeSpanValidator',
}
```

When the time span is missing:

```srt
1

There's no crying in baseball!
```

```srt
{
  errorCode: 'parserErrorMissingTimeSpan',
  lineNumber: 2,
  message: 'Missing time span',
}
```

## Timestamp

When the timestamp isn't fixed to two zero-padded digits and fractions fixed to three zero-padded digits:

```srt
1
0:0:0,0 --> 0:0:0,1
A boy's best friend is his mother.
```

```srt
{
  errorCode: 'parserErrorInvalidTimeStamp',
  lineNumber: 2,
  message: 'Invalid time stamp: 0:0:0,0',
}
```

When the fractional seperator is a period and not a comma:

```srt
1
00:00:00.000 --> 00:00:00.001
Mrs. Robinson, you're trying to seduce me. Aren't you?
```

```srt
{
  errorCode: 'parserErrorInvalidTimeStamp',
  lineNumber: 2,
  message: 'Invalid time stamp: 00:00:00.000',
}
```

## Captions text

When the caption text is missing:

```srt
1
00:00:00,000 --> 00:00:00,001

2
00:00:00,001 --> 00:00:00,002
My mother thanks you. My father thanks you. My sister thanks you. And I thank you.
```

```srt
{
  errorCode: 'parserErrorMissingText',
  lineNumber: 3,
  message: 'Missing caption text',
}
```
