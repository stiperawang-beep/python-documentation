# `wave` — Read and write WAV files

**Source code:** [Lib/wave.py](https://github.com/python/cpython/tree/main/Lib/wave.py)

---

The `wave` module provides a convenient interface to the Waveform Audio
“WAVE” (or “WAV”) file format.

The module supports uncompressed PCM and IEEE floating-point WAV formats.

#### Versionchanged
Changed in version 3.12: Support for `WAVE_FORMAT_EXTENSIBLE` headers was added, provided that the
extended format is `KSDATAFORMAT_SUBTYPE_PCM`.

#### Versionchanged
Changed in version 3.15: Support for reading and writing `WAVE_FORMAT_IEEE_FLOAT` files was added.

The `wave` module defines the following function and exception:

### wave.open(file, mode=None)

If *file* is a string, a [path-like object](../glossary.md#term-path-like-object) or a
[bytes-like object](../glossary.md#term-bytes-like-object) open the file by that name, otherwise treat it as
a file-like object.  *mode* can be:

`'rb'`
: Read only mode.

`'wb'`
: Write only mode.

Note that it does not allow read/write WAV files.

A *mode* of `'rb'` returns a [`Wave_read`](#wave.Wave_read) object, while a *mode* of
`'wb'` returns a [`Wave_write`](#wave.Wave_write) object.  If *mode* is omitted and a
file-like object is passed as *file*, `file.mode` is used as the default
value for *mode*.

If you pass in a file-like object, the wave object will not close it when its
`close()` method is called; it is the caller’s responsibility to close
the file object.

The [`open()`](#wave.open) function may be used in a [`with`](../reference/compound_stmts.md#with) statement.  When
the `with` block completes, the [`Wave_read.close()`](#wave.Wave_read.close) or
[`Wave_write.close()`](#wave.Wave_write.close) method is called.

#### Versionchanged
Changed in version 3.4: Added support for unseekable files.

#### Versionchanged
Changed in version 3.15: Added support for [path-like objects](../glossary.md#term-path-like-object)
and [bytes-like objects](../glossary.md#term-bytes-like-object).

### *exception* wave.Error

An error raised when something is impossible because it violates the WAV
specification or hits an implementation deficiency.

### wave.WAVE_FORMAT_PCM

Format code for uncompressed PCM audio.

### wave.WAVE_FORMAT_IEEE_FLOAT

Format code for IEEE floating-point audio.

### wave.WAVE_FORMAT_EXTENSIBLE

Format code for WAVE extensible headers.

<a id="wave-read-objects"></a>

## Wave_read Objects

### *class* wave.Wave_read

Read a WAV file.

Wave_read objects, as returned by [`open()`](#wave.open), have the following methods:

#### close()

Close the stream if it was opened by `wave`, and make the instance
unusable.  This is called automatically on object collection.

#### getnchannels()

Returns number of audio channels (`1` for mono, `2` for stereo).

#### getsampwidth()

Returns sample width in bytes.

#### getframerate()

Returns sampling frequency.

#### getnframes()

Returns number of audio frames.

#### getformat()

Returns the frame format code.

This is one of [`WAVE_FORMAT_PCM`](#wave.WAVE_FORMAT_PCM),
[`WAVE_FORMAT_IEEE_FLOAT`](#wave.WAVE_FORMAT_IEEE_FLOAT), or [`WAVE_FORMAT_EXTENSIBLE`](#wave.WAVE_FORMAT_EXTENSIBLE).

#### getcomptype()

Returns compression type (`'NONE'` is the only supported type).

#### getcompname()

Human-readable version of [`getcomptype()`](#wave.Wave_read.getcomptype). Usually `'not compressed'`
parallels `'NONE'`.

#### getparams()

Returns a [`namedtuple()`](collections.md#collections.namedtuple) `(nchannels, sampwidth,
framerate, nframes, comptype, compname)`, equivalent to output
of the `get*()` methods.

#### readframes(n)

Reads and returns at most *n* frames of audio, as a [`bytes`](stdtypes.md#bytes) object.

#### rewind()

Rewind the file pointer to the beginning of the audio stream.

The following two methods define a term “position” which is compatible between
them, and is otherwise implementation dependent.

#### setpos(pos)

Set the file pointer to the specified position.

#### tell()

Return current file pointer position.

<a id="wave-write-objects"></a>

## Wave_write Objects

### *class* wave.Wave_write

Write a WAV file.

Wave_write objects, as returned by [`open()`](#wave.open).

For seekable output streams, the `wave` header will automatically be updated
to reflect the number of frames actually written.  For unseekable streams, the
*nframes* value must be accurate when the first frame data is written.  An
accurate *nframes* value can be achieved either by calling
[`setnframes()`](#wave.Wave_write.setnframes) or [`setparams()`](#wave.Wave_write.setparams) with the number
of frames that will be written before [`close()`](#wave.Wave_write.close) is called and
then using [`writeframesraw()`](#wave.Wave_write.writeframesraw) to write the frame data, or by
calling [`writeframes()`](#wave.Wave_write.writeframes) with all of the frame data to be
written.  In the latter case [`writeframes()`](#wave.Wave_write.writeframes) will calculate
the number of frames in the data and set *nframes* accordingly before writing
the frame data.

#### Versionchanged
Changed in version 3.4: Added support for unseekable files.

Wave_write objects have the following methods:

#### close()

Make sure *nframes* is correct, and close the file if it was opened by
`wave`.  This method is called upon object collection.  It will raise
an exception if the output stream is not seekable and *nframes* does not
match the number of frames actually written.

#### setnchannels(n)

Set the number of channels.

#### getnchannels()

Return the number of channels.

#### setsampwidth(n)

Set the sample width to *n* bytes.

For [`WAVE_FORMAT_IEEE_FLOAT`](#wave.WAVE_FORMAT_IEEE_FLOAT), only 4-byte (32-bit) and
8-byte (64-bit) sample widths are supported.

#### getsampwidth()

Return the sample width in bytes.

#### setframerate(n)

Set the frame rate to *n*.

#### Versionchanged
Changed in version 3.2: A non-integral input to this method is rounded to the nearest
integer.

#### getframerate()

Return the frame rate.

#### setnframes(n)

Set the number of frames to *n*.  This will be changed later if the number
of frames actually written is different (this update attempt will
raise an error if the output stream is not seekable).

#### getnframes()

Return the number of audio frames written so far.

#### setcomptype(type, name)

Set the compression type and description. At the moment, only compression type
`NONE` is supported, meaning no compression.

#### getcomptype()

Return the compression type (`'NONE'`).

#### getcompname()

Return the human-readable compression type name.

#### setformat(format)

Set the frame format code.

Supported values are [`WAVE_FORMAT_PCM`](#wave.WAVE_FORMAT_PCM) and
[`WAVE_FORMAT_IEEE_FLOAT`](#wave.WAVE_FORMAT_IEEE_FLOAT).

When setting [`WAVE_FORMAT_IEEE_FLOAT`](#wave.WAVE_FORMAT_IEEE_FLOAT), the sample width must be
4 or 8 bytes.

#### getformat()

Return the current frame format code.

#### setparams(tuple)

The *tuple* should be
`(nchannels, sampwidth, framerate, nframes, comptype, compname, format)`,
with values valid for the `set*()` methods. Sets all parameters.

For backwards compatibility, a 6-item tuple without *format* is also
accepted and defaults to [`WAVE_FORMAT_PCM`](#wave.WAVE_FORMAT_PCM).

For `format=WAVE_FORMAT_IEEE_FLOAT`, *sampwidth* must be 4 or 8.

#### getparams()

Return a [`namedtuple()`](collections.md#collections.namedtuple)
`(nchannels, sampwidth, framerate, nframes, comptype, compname)`
containing the current output parameters.

#### tell()

Return current position in the file, with the same disclaimer for the
[`Wave_read.tell()`](#wave.Wave_read.tell) and [`Wave_read.setpos()`](#wave.Wave_read.setpos) methods.

#### writeframesraw(data)

Write audio frames, without correcting *nframes*.

#### Versionchanged
Changed in version 3.4: Any [bytes-like object](../glossary.md#term-bytes-like-object) is now accepted.

#### writeframes(data)

Write audio frames and make sure *nframes* is correct.  It will raise an
error if the output stream is not seekable and the total number of frames
that have been written after *data* has been written does not match the
previously set value for *nframes*.

#### Versionchanged
Changed in version 3.4: Any [bytes-like object](../glossary.md#term-bytes-like-object) is now accepted.

Note that it is invalid to set any parameters after calling [`writeframes()`](#wave.Wave_write.writeframes)
or [`writeframesraw()`](#wave.Wave_write.writeframesraw), and any attempt to do so will raise
[`wave.Error`](#wave.Error).

For [`WAVE_FORMAT_IEEE_FLOAT`](#wave.WAVE_FORMAT_IEEE_FLOAT) output, a `fact` chunk is written as
required by the WAVE specification for non-PCM formats.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
