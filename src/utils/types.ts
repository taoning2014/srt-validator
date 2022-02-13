type LineNumber = {
  chunkStart: number;
  timeSpan: number;
  text: number;
  chunkEnd: number;
};

export type Time = {
  start: number;
  end: number;
};

// Todo[@taoning2014]: remove lineNumbers property
export type Parsed = {
  lineNumbers: LineNumber;
  sequenceNumber: number;
  time: Time;
  text: string;
};

export type ValidatorType = 'LineNumberValidator' | 'CaptionTimeSpanValidator';
