<div align="center">
  <img width="200" height="200"
    src="https://user-images.githubusercontent.com/8691648/149093190-2f610184-e96c-4f8f-b423-d9afee704c1d.png">
</div>

# SrtValidator

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![issues][issues]][issues-url]
[![license][license]][license-url]
[![jest][jest]][jest-url]
[![codecov][codecov]][codecov-url]

SRT file (also known as SubRip Subtitle file) is a plain-text file that contains subtitles with the start and end timecodes of the text to ensure the subtitles match the audio. It also inclues the sequential number of subtitles. A sample SRT looks like this:

```srt
1
00:02:17,440 --> 00:02:20,375
Senator, we're making
our final approach into Coruscant.

2
00:02:20,476 --> 00:02:22,501
Very good, Lieutenant.
```

This library exposes one util function `srtValidator(input)` which takes a string as an input and validates it against the [SRT spec][srt-spec].

## Installing

```bash
npm install srt-validator --save
```

## Examples

The output of the util function `srtValidator(input)` is an array of error objects. If the array is empty then there are no errors and the SRT is valid.

### Valid SRT

```js
import srtValidator from 'srt-validator';

const srtString = `1
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
[];
```

### Invalid SRT

```js
import srtValidator from 'srt-validator';

const srtString = `1
02:01:17,440 --> 02:00:20,375
Forget it, Jake.
It's Chinatown.`;

srtValidator(srtString);
```

This will return:

```js
[
  {
    errorCode: 'validatorErrorStartTime',
    lineNumber: 2,
    message: 'start time should be less than end time',
    validator: 'CaptionTimeSpanValidator',
  },
];
```

## Documentation

- [Type of Errors][types-of-errors]
- [How to debug][how-to-debug]

## Attribution

- _The SRT icon in this file is made by [iconixar](https://www.flaticon.com/authors/iconixar) from [Flaticon](https://www.flaticon.com)_

## License

srt-validator is [MIT licensed](./LICENSE).

[npm]: https://img.shields.io/npm/v/srt-validator.svg
[npm-url]: https://www.npmjs.com/package/srt-validator
[node]: https://img.shields.io/node/v/srt-validator.svg
[node-url]: https://nodejs.org
[issues]: https://img.shields.io/github/issues/taoning2014/srt-validator
[issues-url]: https://github.com/taoning2014/srt-validator/issues
[license]: https://img.shields.io/github/license/taoning2014/srt-validator
[license-url]: ./LICENSE
[jest]: https://img.shields.io/badge/tested_with-jest-99424f.svg
[jest-url]: https://github.com/facebook/jest
[codecov]: https://codecov.io/gh/taoning2014/srt-validator/branch/master/graph/badge.svg?token=rnNON8Fd6g
[codecov-url]: https://app.codecov.io/gh/taoning2014/srt-validator
[srt-spec]: ./doc/srt-spec.md
[types-of-errors]: ./doc/types-of-errors.md
[how-to-debug]: ./doc/how-to-debug.md
