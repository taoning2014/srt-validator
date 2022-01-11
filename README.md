# SrtValidator

[![Issues](https://img.shields.io/github/issues/taoning2014/srt-validator)](https://www.npmjs.com/package/srt-validator)
[![License](https://img.shields.io/github/license/taoning2014/srt-validator)](https://github.com/taoning2014/srt-validator/blob/master/LICENSE)
[![npm version](https://badge.fury.io/js/srt-validator.svg)](https://badge.fury.io/js/srt-validator)
[![Downloads](https://img.shields.io/github/downloads/taoning2014/srt-validator/total.svg)](https://www.npmjs.com/package/srt-validator)

This library exposes one util function `srtValidator(input)` which takes a string as an input and validates it against the [SRT spec](../srt-validator/doc/srt-spec.md).

## Installing

```bash
npm install srt-validator --save
```

## Examples

The output of the util function `srtValidator(input)` is an array of error objects. If the array is empty then there are no errors and the SRT is valid.

### Valid SRT

```js
import srtValidator from 'srt-validator';

const srtString =
`1
00:02:17,440 --> 00:02:20,375
Senator, we're making
our final approach into Coruscant.

2
00:02:20,476 --> 00:02:22,501
Very good, Lieutenant.`;

srtValidator(srtString);
```

This will return:

```js
[]
```

### Invalid SRT

```js
import srtValidator from 'srt-validator';

const srtString =
`1
02:01:17,440 --> 02:00:20,375
Forget it, Jake.
It's Chinatown.`;

srtValidator(srtString);
```

This will return:

```js
[{
  errorCode: 'validatorErrorStartTime',
  lineNumber: 2,
  message: 'start time should be less than end time',
  validator: 'CaptionTimeSpanValidator',
}]
```

## Documentation

- [Errors return by `srtValidator`](../srt-validator/doc/types-of-errors.md)
- [How to debug](../srt-validator/doc/how-to-debug.md)
