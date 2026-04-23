# `bz2` — Support for **bzip2** compression

**Source code:** [Lib/bz2.py](https://github.com/python/cpython/tree/main/Lib/bz2.py)

---

This module provides a comprehensive interface for compressing and
decompressing data using the bzip2 compression algorithm.

The `bz2` module contains:

* The [`open()`](#bz2.open) function and [`BZ2File`](#bz2.BZ2File) class for reading and
  writing compressed files.
* The [`BZ2Compressor`](#bz2.BZ2Compressor) and [`BZ2Decompressor`](#bz2.BZ2Decompressor) classes for
  incremental (de)compression.
* The [`compress()`](#bz2.compress) and [`decompress()`](#bz2.decompress) functions for one-shot
  (de)compression.

This is an [optional module](../glossary.md#term-optional-module).
If it is missing from your copy of CPython,
look for documentation from your distributor (that is,
whoever provided Python to you).
If you are the distributor, see [Requirements for optional modules](../using/configure.md#optional-module-requirements).

<!-- Similar notes appear in the docs of the modules:
- zipfile
- tarfile -->

## (De)compression of files

### bz2.open(filename, mode='rb', compresslevel=9, encoding=None, errors=None, newline=None)

Open a bzip2-compressed file in binary or text mode, returning a [file
object](../glossary.md#term-file-object).

As with the constructor for [`BZ2File`](#bz2.BZ2File), the *filename* argument can be
an actual filename (a [`str`](stdtypes.md#str) or [`bytes`](stdtypes.md#bytes) object), or an existing
file object to read from or write to.

The *mode* argument can be any of `'r'`, `'rb'`, `'w'`, `'wb'`,
`'x'`, `'xb'`, `'a'` or `'ab'` for binary mode, or `'rt'`,
`'wt'`, `'xt'`, or `'at'` for text mode. The default is `'rb'`.

The *compresslevel* argument is an integer from 1 to 9, as for the
[`BZ2File`](#bz2.BZ2File) constructor.

For binary mode, this function is equivalent to the [`BZ2File`](#bz2.BZ2File)
constructor: `BZ2File(filename, mode, compresslevel=compresslevel)`. In
this case, the *encoding*, *errors* and *newline* arguments must not be
provided.

For text mode, a [`BZ2File`](#bz2.BZ2File) object is created, and wrapped in an
[`io.TextIOWrapper`](io.md#io.TextIOWrapper) instance with the specified encoding, error
handling behavior, and line ending(s).

#### Versionadded
Added in version 3.3.

#### Versionchanged
Changed in version 3.4: The `'x'` (exclusive creation) mode was added.

#### Versionchanged
Changed in version 3.6: Accepts a [path-like object](../glossary.md#term-path-like-object).

### *class* bz2.BZ2File(filename, mode='r', , compresslevel=9)

Open a bzip2-compressed file in binary mode.

If *filename* is a [`str`](stdtypes.md#str) or [`bytes`](stdtypes.md#bytes) object, open the named file
directly. Otherwise, *filename* should be a [file object](../glossary.md#term-file-object), which will
be used to read or write the compressed data.

The *mode* argument can be either `'r'` for reading (default), `'w'` for
overwriting, `'x'` for exclusive creation, or `'a'` for appending. These
can equivalently be given as `'rb'`, `'wb'`, `'xb'` and `'ab'`
respectively.

If *filename* is a file object (rather than an actual file name), a mode of
`'w'` does not truncate the file, and is instead equivalent to `'a'`.

If *mode* is `'w'` or `'a'`, *compresslevel* can be an integer between
`1` and `9` specifying the level of compression: `1` produces the
least compression, and `9` (default) produces the most compression.

If *mode* is `'r'`, the input file may be the concatenation of multiple
compressed streams.

[`BZ2File`](#bz2.BZ2File) provides all of the members specified by the
[`io.BufferedIOBase`](io.md#io.BufferedIOBase), except for [`detach()`](io.md#io.BufferedIOBase.detach)
and [`truncate()`](io.md#io.IOBase.truncate).
Iteration and the [`with`](../reference/compound_stmts.md#with) statement are supported.

[`BZ2File`](#bz2.BZ2File) also provides the following methods and attributes:

#### peek()

Return buffered data without advancing the file position. At least one
byte of data will be returned (unless at EOF). The exact number of bytes
returned is unspecified.

#### NOTE
While calling [`peek()`](#bz2.BZ2File.peek) does not change the file position of
the [`BZ2File`](#bz2.BZ2File), it may change the position of the underlying file
object (e.g. if the [`BZ2File`](#bz2.BZ2File) was constructed by passing a file
object for *filename*).

#### Versionadded
Added in version 3.3.

#### fileno()

Return the file descriptor for the underlying file.

#### Versionadded
Added in version 3.3.

#### readable()

Return whether the file was opened for reading.

#### Versionadded
Added in version 3.3.

#### seekable()

Return whether the file supports seeking.

#### Versionadded
Added in version 3.3.

#### writable()

Return whether the file was opened for writing.

#### Versionadded
Added in version 3.3.

#### read1(size=-1)

Read up to *size* uncompressed bytes, while trying to avoid
making multiple reads from the underlying stream. Reads up to a
buffer’s worth of data if size is negative.

Returns `b''` if the file is at EOF.

#### Versionadded
Added in version 3.3.

#### readinto(b)

Read bytes into *b*.

Returns the number of bytes read (0 for EOF).

#### Versionadded
Added in version 3.3.

#### mode

`'rb'` for reading and `'wb'` for writing.

#### Versionadded
Added in version 3.13.

#### name

The bzip2 file name.  Equivalent to the [`name`](io.md#io.FileIO.name)
attribute of the underlying [file object](../glossary.md#term-file-object).

#### Versionadded
Added in version 3.13.

#### Versionchanged
Changed in version 3.1: Support for the [`with`](../reference/compound_stmts.md#with) statement was added.

#### Versionchanged
Changed in version 3.3: Support was added for *filename* being a [file object](../glossary.md#term-file-object) instead of an
actual filename.

The `'a'` (append) mode was added, along with support for reading
multi-stream files.

#### Versionchanged
Changed in version 3.4: The `'x'` (exclusive creation) mode was added.

#### Versionchanged
Changed in version 3.5: The [`read()`](io.md#io.BufferedIOBase.read) method now accepts an argument of
`None`.

#### Versionchanged
Changed in version 3.6: Accepts a [path-like object](../glossary.md#term-path-like-object).

#### Versionchanged
Changed in version 3.9: The *buffering* parameter has been removed. It was ignored and deprecated
since Python 3.0. Pass an open file object to control how the file is
opened.

The *compresslevel* parameter became keyword-only.

#### Versionchanged
Changed in version 3.10: This class is thread unsafe in the face of multiple simultaneous
readers or writers, just like its equivalent classes in [`gzip`](gzip.md#module-gzip) and
[`lzma`](lzma.md#module-lzma) have always been.

## Incremental (de)compression

### *class* bz2.BZ2Compressor(compresslevel=9)

Create a new compressor object. This object may be used to compress data
incrementally. For one-shot compression, use the [`compress()`](#bz2.compress) function
instead.

*compresslevel*, if given, must be an integer between `1` and `9`. The
default is `9`.

#### compress(data)

Provide data to the compressor object. Returns a chunk of compressed data
if possible, or an empty byte string otherwise.

When you have finished providing data to the compressor, call the
[`flush()`](#bz2.BZ2Compressor.flush) method to finish the compression process.

#### flush()

Finish the compression process. Returns the compressed data left in
internal buffers.

The compressor object may not be used after this method has been called.

### *class* bz2.BZ2Decompressor

Create a new decompressor object. This object may be used to decompress data
incrementally. For one-shot compression, use the [`decompress()`](#bz2.decompress) function
instead.

#### NOTE
This class does not transparently handle inputs containing multiple
compressed streams, unlike [`decompress()`](#bz2.decompress) and [`BZ2File`](#bz2.BZ2File). If
you need to decompress a multi-stream input with [`BZ2Decompressor`](#bz2.BZ2Decompressor),
you must use a new decompressor for each stream.

#### decompress(data, max_length=-1)

Decompress *data* (a [bytes-like object](../glossary.md#term-bytes-like-object)), returning
uncompressed data as bytes. Some of *data* may be buffered
internally, for use in later calls to [`decompress()`](#bz2.decompress). The
returned data should be concatenated with the output of any
previous calls to [`decompress()`](#bz2.decompress).

If *max_length* is nonnegative, returns at most *max_length*
bytes of decompressed data. If this limit is reached and further
output can be produced, the [`needs_input`](#bz2.BZ2Decompressor.needs_input) attribute will
be set to `False`. In this case, the next call to
[`decompress()`](#bz2.BZ2Decompressor.decompress) may provide *data* as `b''` to obtain
more of the output.

If all of the input data was decompressed and returned (either
because this was less than *max_length* bytes, or because
*max_length* was negative), the [`needs_input`](#bz2.BZ2Decompressor.needs_input) attribute
will be set to `True`.

Attempting to decompress data after the end of stream is reached
raises an [`EOFError`](exceptions.md#EOFError).  Any data found after the end of the
stream is ignored and saved in the [`unused_data`](#bz2.BZ2Decompressor.unused_data) attribute.

#### Versionchanged
Changed in version 3.5: Added the *max_length* parameter.

#### eof

`True` if the end-of-stream marker has been reached.

#### Versionadded
Added in version 3.3.

#### unused_data

Data found after the end of the compressed stream.

If this attribute is accessed before the end of the stream has been
reached, its value will be `b''`.

#### needs_input

`False` if the [`decompress()`](#bz2.BZ2Decompressor.decompress) method can provide more
decompressed data before requiring new uncompressed input.

#### Versionadded
Added in version 3.5.

## One-shot (de)compression

### bz2.compress(data, compresslevel=9)

Compress *data*, a [bytes-like object](../glossary.md#term-bytes-like-object).

*compresslevel*, if given, must be an integer between `1` and `9`. The
default is `9`.

For incremental compression, use a [`BZ2Compressor`](#bz2.BZ2Compressor) instead.

### bz2.decompress(data)

Decompress *data*, a [bytes-like object](../glossary.md#term-bytes-like-object).

If *data* is the concatenation of multiple compressed streams, decompress
all of the streams.

For incremental decompression, use a [`BZ2Decompressor`](#bz2.BZ2Decompressor) instead.

#### Versionchanged
Changed in version 3.3: Support for multi-stream inputs was added.

<a id="bz2-usage-examples"></a>

## Examples of usage

Below are some examples of typical usage of the `bz2` module.

Using [`compress()`](#bz2.compress) and [`decompress()`](#bz2.decompress) to demonstrate round-trip compression:

```pycon
>>> import bz2
>>> data = b"""\
... Donec rhoncus quis sapien sit amet molestie. Fusce scelerisque vel augue
... nec ullamcorper. Nam rutrum pretium placerat. Aliquam vel tristique lorem,
... sit amet cursus ante. In interdum laoreet mi, sit amet ultrices purus
... pulvinar a. Nam gravida euismod magna, non varius justo tincidunt feugiat.
... Aliquam pharetra lacus non risus vehicula rutrum. Maecenas aliquam leo
... felis. Pellentesque semper nunc sit amet nibh ullamcorper, ac elementum
... dolor luctus. Curabitur lacinia mi ornare consectetur vestibulum."""
>>> c = bz2.compress(data)
>>> len(data) / len(c)  # Data compression ratio
1.513595166163142
>>> d = bz2.decompress(c)
>>> data == d  # Check equality to original object after round-trip
True
```

Using [`BZ2Compressor`](#bz2.BZ2Compressor) for incremental compression:

```pycon
>>> import bz2
>>> def gen_data(chunks=10, chunksize=1000):
...     """Yield incremental blocks of chunksize bytes."""
...     for _ in range(chunks):
...         yield b"z" * chunksize
...
>>> comp = bz2.BZ2Compressor()
>>> out = b""
>>> for chunk in gen_data():
...     # Provide data to the compressor object
...     out = out + comp.compress(chunk)
...
>>> # Finish the compression process.  Call this once you have
>>> # finished providing data to the compressor.
>>> out = out + comp.flush()
```

The example above uses a very “nonrandom” stream of data
(a stream of `b"z"` chunks).  Random data tends to compress poorly,
while ordered, repetitive data usually yields a high compression ratio.

Writing and reading a bzip2-compressed file in binary mode:

```pycon
>>> import bz2
>>> data = b"""\
... Donec rhoncus quis sapien sit amet molestie. Fusce scelerisque vel augue
... nec ullamcorper. Nam rutrum pretium placerat. Aliquam vel tristique lorem,
... sit amet cursus ante. In interdum laoreet mi, sit amet ultrices purus
... pulvinar a. Nam gravida euismod magna, non varius justo tincidunt feugiat.
... Aliquam pharetra lacus non risus vehicula rutrum. Maecenas aliquam leo
... felis. Pellentesque semper nunc sit amet nibh ullamcorper, ac elementum
... dolor luctus. Curabitur lacinia mi ornare consectetur vestibulum."""
>>> with bz2.open("myfile.bz2", "wb") as f:
...     # Write compressed data to file
...     unused = f.write(data)
...
>>> with bz2.open("myfile.bz2", "rb") as f:
...     # Decompress data from file
...     content = f.read()
...
>>> content == data  # Check equality to original object after round-trip
True
```

<!-- import os
os.remove("myfile.bz2") -->
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
