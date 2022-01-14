# SRT Spec

SRT is a basic subtitle format. It consists of four parts, all in text:

1. A number indicating which subtitle it is in the sequence.
2. The time that the subtitle should appear on the screen, and then disappear.
3. The subtitle itself.
4. A blank line indicating the start of a new subtitle.

Subtitles are numbered sequentially, starting at 1. The timecode format used is **hours:minutes:seconds,milliseconds** with time units fixed to two zero-padded digits and fractions fixed to three zero-padded digits (00:00:00,000).
