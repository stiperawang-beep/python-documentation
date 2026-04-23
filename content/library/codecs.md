# `codecs` — Codec registry and base classes

**Source code:** [Lib/codecs.py](https://github.com/python/cpython/tree/main/Lib/codecs.py)

<a id="index-0"></a>

---

This module defines base classes for standard Python codecs (encoders and
decoders) and provides access to the internal Python codec registry, which
manages the codec and error handling lookup process. Most standard codecs
are [text encodings](../glossary.md#term-text-encoding), which encode text to bytes (and
decode bytes to text), but there are also codecs provided that encode text to
text, and bytes to bytes. Custom codecs may encode and decode between arbitrary
types, but some module features are restricted to be used specifically with
[text encodings](../glossary.md#term-text-encoding) or with codecs that encode to
[`bytes`](stdtypes.md#bytes).

The module defines the following functions for encoding and decoding with
any codec:

### codecs.encode(obj, encoding='utf-8', errors='strict')

Encodes *obj* using the codec registered for *encoding*.

*Errors* may be given to set the desired error handling scheme. The
default error handler is `'strict'` meaning that encoding errors raise
[`ValueError`](exceptions.md#ValueError) (or a more codec specific subclass, such as
[`UnicodeEncodeError`](exceptions.md#UnicodeEncodeError)). Refer to [Codec Base Classes](#codec-base-classes) for more
information on codec error handling.

### codecs.decode(obj, encoding='utf-8', errors='strict')

Decodes *obj* using the codec registered for *encoding*.

*Errors* may be given to set the desired error handling scheme. The
default error handler is `'strict'` meaning that decoding errors raise
[`ValueError`](exceptions.md#ValueError) (or a more codec specific subclass, such as
[`UnicodeDecodeError`](exceptions.md#UnicodeDecodeError)). Refer to [Codec Base Classes](#codec-base-classes) for more
information on codec error handling.

### codecs.charmap_build(string)

Return a mapping suitable for encoding with a custom single-byte encoding.
Given a [`str`](stdtypes.md#str) *string* of up to 256 characters representing a
decoding table, returns either a compact internal mapping object
`EncodingMap` or a [`dictionary`](stdtypes.md#dict) mapping character ordinals
to byte values. Raises a [`TypeError`](exceptions.md#TypeError) on invalid input.

The full details for each codec can also be looked up directly:

### codecs.lookup(encoding,)

Looks up the codec info in the Python codec registry and returns a
[`CodecInfo`](#codecs.CodecInfo) object as defined below.

This function first normalizes the *encoding*: all ASCII letters are
converted to lower case, spaces are replaced with hyphens.
Then encoding is looked up in the registry’s cache. If not found, the list of
registered search functions is scanned. If no [`CodecInfo`](#codecs.CodecInfo) object is
found, a [`LookupError`](exceptions.md#LookupError) is raised. Otherwise, the [`CodecInfo`](#codecs.CodecInfo) object
is stored in the cache and returned to the caller.

#### Versionchanged
Changed in version 3.9: Any characters except ASCII letters and digits and a dot are converted to underscore.

#### Versionchanged
Changed in version 3.15: No characters are converted to underscore anymore.
Spaces are converted to hyphens.

### *class* codecs.CodecInfo(encode, decode, streamreader=None, streamwriter=None, incrementalencoder=None, incrementaldecoder=None, name=None)

Codec details when looking up the codec registry. The constructor
arguments are stored in attributes of the same name:

#### name

The name of the encoding.

#### encode

#### decode

The stateless encoding and decoding functions. These must be
functions or methods which have the same interface as
the [`encode()`](#codecs.Codec.encode) and [`decode()`](#codecs.Codec.decode) methods of Codec
instances (see [Codec Interface](#codec-objects)).
The functions or methods are expected to work in a stateless mode.

#### incrementalencoder

#### incrementaldecoder

Incremental encoder and decoder classes or factory functions.
These have to provide the interface defined by the base classes
[`IncrementalEncoder`](#codecs.IncrementalEncoder) and [`IncrementalDecoder`](#codecs.IncrementalDecoder),
respectively. Incremental codecs can maintain state.

#### streamwriter

#### streamreader

Stream writer and reader classes or factory functions. These have to
provide the interface defined by the base classes
[`StreamWriter`](#codecs.StreamWriter) and [`StreamReader`](#codecs.StreamReader), respectively.
Stream codecs can maintain state.

To simplify access to the various codec components, the module provides
these additional functions which use [`lookup()`](#codecs.lookup) for the codec lookup:

### codecs.getencoder(encoding)

Look up the codec for the given encoding and return its encoder function.

Raises a [`LookupError`](exceptions.md#LookupError) in case the encoding cannot be found.

### codecs.getdecoder(encoding)

Look up the codec for the given encoding and return its decoder function.

Raises a [`LookupError`](exceptions.md#LookupError) in case the encoding cannot be found.

### codecs.getincrementalencoder(encoding)

Look up the codec for the given encoding and return its incremental encoder
class or factory function.

Raises a [`LookupError`](exceptions.md#LookupError) in case the encoding cannot be found or the codec
doesn’t support an incremental encoder.

### codecs.getincrementaldecoder(encoding)

Look up the codec for the given encoding and return its incremental decoder
class or factory function.

Raises a [`LookupError`](exceptions.md#LookupError) in case the encoding cannot be found or the codec
doesn’t support an incremental decoder.

### codecs.getreader(encoding)

Look up the codec for the given encoding and return its [`StreamReader`](#codecs.StreamReader)
class or factory function.

Raises a [`LookupError`](exceptions.md#LookupError) in case the encoding cannot be found.

### codecs.getwriter(encoding)

Look up the codec for the given encoding and return its [`StreamWriter`](#codecs.StreamWriter)
class or factory function.

Raises a [`LookupError`](exceptions.md#LookupError) in case the encoding cannot be found.

Custom codecs are made available by registering a suitable codec search
function:

### codecs.register(search_function,)

Register a codec search function. Search functions are expected to take one
argument, being the encoding name in all lower case letters with spaces
converted to hyphens, and return a [`CodecInfo`](#codecs.CodecInfo) object.
In case a search function cannot find a given encoding, it should return
`None`.

### codecs.unregister(search_function,)

Unregister a codec search function and clear the registry’s cache.
If the search function is not registered, do nothing.

#### Versionadded
Added in version 3.10.

While the builtin [`open()`](functions.md#open) and the associated [`io`](io.md#module-io) module are the
recommended approach for working with encoded text files, this module
provides additional utility functions and classes that allow the use of a
wider range of codecs when working with binary files:

### codecs.open(filename, mode='r', encoding=None, errors='strict', buffering=-1)

Open an encoded file using the given *mode* and return an instance of
[`StreamReaderWriter`](#codecs.StreamReaderWriter), providing transparent encoding/decoding.
The default file mode is `'r'`, meaning to open the file in read mode.

#### NOTE
If *encoding* is not `None`, then the
underlying encoded files are always opened in binary mode.
No automatic conversion of `'\n'` is done on reading and writing.
The *mode* argument may be any binary mode acceptable to the built-in
[`open()`](functions.md#open) function; the `'b'` is automatically added.

*encoding* specifies the encoding which is to be used for the file.
Any encoding that encodes to and decodes from bytes is allowed, and
the data types supported by the file methods depend on the codec used.

*errors* may be given to define the error handling. It defaults to `'strict'`
which causes a [`ValueError`](exceptions.md#ValueError) to be raised in case an encoding error occurs.

*buffering* has the same meaning as for the built-in [`open()`](functions.md#open) function.
It defaults to -1 which means that the default buffer size will be used.

#### Versionchanged
Changed in version 3.11: The `'U'` mode has been removed.

#### Deprecated
Deprecated since version 3.14: [`codecs.open()`](#codecs.open) has been superseded by [`open()`](functions.md#open).

### codecs.EncodedFile(file, data_encoding, file_encoding=None, errors='strict')

Return a [`StreamRecoder`](#codecs.StreamRecoder) instance, a wrapped version of *file*
which provides transparent transcoding. The original file is closed
when the wrapped version is closed.

Data written to the wrapped file is decoded according to the given
*data_encoding* and then written to the original file as bytes using
*file_encoding*. Bytes read from the original file are decoded
according to *file_encoding*, and the result is encoded
using *data_encoding*.

If *file_encoding* is not given, it defaults to *data_encoding*.

*errors* may be given to define the error handling. It defaults to
`'strict'`, which causes [`ValueError`](exceptions.md#ValueError) to be raised in case an encoding
error occurs.

### codecs.iterencode(iterator, encoding, errors='strict', \*\*kwargs)

Uses an incremental encoder to iteratively encode the input provided by
*iterator*. *iterator* must yield [`str`](stdtypes.md#str) objects.
This function is a [generator](../glossary.md#term-generator). The *errors* argument (as well as any
other keyword argument) is passed through to the incremental encoder.

This function requires that the codec accept text [`str`](stdtypes.md#str) objects
to encode. Therefore it does not support bytes-to-bytes encoders such as
`base64_codec`.

### codecs.iterdecode(iterator, encoding, errors='strict', \*\*kwargs)

Uses an incremental decoder to iteratively decode the input provided by
*iterator*. *iterator* must yield [`bytes`](stdtypes.md#bytes) objects.
This function is a [generator](../glossary.md#term-generator). The *errors* argument (as well as any
other keyword argument) is passed through to the incremental decoder.

This function requires that the codec accept [`bytes`](stdtypes.md#bytes) objects
to decode. Therefore it does not support text-to-text encoders such as
`rot_13`, although `rot_13` may be used equivalently with
[`iterencode()`](#codecs.iterencode).

### codecs.readbuffer_encode(buffer, errors=None,)

Return a [`tuple`](stdtypes.md#tuple) containing the raw bytes of *buffer*, a
[buffer-compatible object](../c-api/buffer.md#bufferobjects) or [`str`](stdtypes.md#str)
(encoded to UTF-8 before processing), and their length in bytes.

The *errors* argument is ignored.

```pycon
>>> codecs.readbuffer_encode(b"Zito")
(b'Zito', 4)
```

The module also provides the following constants which are useful for reading
and writing to platform dependent files:

### codecs.BOM

### codecs.BOM_BE

### codecs.BOM_LE

### codecs.BOM_UTF8

### codecs.BOM_UTF16

### codecs.BOM_UTF16_BE

### codecs.BOM_UTF16_LE

### codecs.BOM_UTF32

### codecs.BOM_UTF32_BE

### codecs.BOM_UTF32_LE

These constants define various byte sequences,
being Unicode byte order marks (BOMs) for several encodings. They are
used in UTF-16 and UTF-32 data streams to indicate the byte order used,
and in UTF-8 as a Unicode signature. [`BOM_UTF16`](#codecs.BOM_UTF16) is either
[`BOM_UTF16_BE`](#codecs.BOM_UTF16_BE) or [`BOM_UTF16_LE`](#codecs.BOM_UTF16_LE) depending on the platform’s
native byte order, [`BOM`](#codecs.BOM) is an alias for [`BOM_UTF16`](#codecs.BOM_UTF16),
[`BOM_LE`](#codecs.BOM_LE) for [`BOM_UTF16_LE`](#codecs.BOM_UTF16_LE) and [`BOM_BE`](#codecs.BOM_BE) for
[`BOM_UTF16_BE`](#codecs.BOM_UTF16_BE). The others represent the BOM in UTF-8 and UTF-32
encodings.

<a id="codec-base-classes"></a>

## Codec Base Classes

The `codecs` module defines a set of base classes which define the
interfaces for working with codec objects, and can also be used as the basis
for custom codec implementations.

Each codec has to define four interfaces to make it usable as codec in Python:
stateless encoder, stateless decoder, stream reader and stream writer. The
stream reader and writers typically reuse the stateless encoder/decoder to
implement the file protocols. Codec authors also need to define how the
codec will handle encoding and decoding errors.

<a id="surrogateescape"></a>

<a id="error-handlers"></a>

### Error Handlers

To simplify and standardize error handling, codecs may implement different
error handling schemes by accepting the *errors* string argument:

```pycon
>>> 'German ß, ♬'.encode(encoding='ascii', errors='backslashreplace')
b'German \\xdf, \\u266c'
>>> 'German ß, ♬'.encode(encoding='ascii', errors='xmlcharrefreplace')
b'German &#223;, &#9836;'
```

<a id="index-1"></a>

The following error handlers can be used with all Python
[Standard Encodings](#standard-encodings) codecs:

| Value                | Meaning                                                                                                                                                                                                                                                                                                                              |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `'strict'`           | Raise [`UnicodeError`](exceptions.md#UnicodeError) (or a subclass),<br/>this is the default. Implemented in<br/>[`strict_errors()`](#codecs.strict_errors).                                                                                                                                                                          |
| `'ignore'`           | Ignore the malformed data and continue without<br/>further notice. Implemented in<br/>[`ignore_errors()`](#codecs.ignore_errors).                                                                                                                                                                                                    |
| `'replace'`          | Replace with a replacement marker. On<br/>encoding, use `?` (ASCII character). On<br/>decoding, use `�` (U+FFFD, the official<br/>REPLACEMENT CHARACTER). Implemented in<br/>[`replace_errors()`](#codecs.replace_errors).                                                                                                           |
| `'backslashreplace'` | Replace with backslashed escape sequences.<br/>On encoding, use hexadecimal form of Unicode<br/>code point with formats `\x*hh*`<br/>`\u*xxxx*` `\U*xxxxxxxx*`.<br/>On decoding, use hexadecimal form of byte<br/>value with format `\x*hh*`.<br/>Implemented in<br/>[`backslashreplace_errors()`](#codecs.backslashreplace_errors). |
| `'surrogateescape'`  | On decoding, replace byte with individual<br/>surrogate code ranging from `U+DC80` to<br/>`U+DCFF`. This code will then be turned<br/>back into the same byte when the<br/>`'surrogateescape'` error handler is used<br/>when encoding the data. (See [**PEP 383**](https://peps.python.org/pep-0383/) for<br/>more.)                |

<a id="index-3"></a>

The following error handlers are only applicable to encoding (within
[text encodings](../glossary.md#term-text-encoding)):

| Value                 | Meaning                                                                                                                                                                                                                   |
|-----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `'xmlcharrefreplace'` | Replace with XML/HTML numeric character<br/>reference, which is a decimal form of Unicode<br/>code point with format `&#*num*;`.<br/>Implemented in<br/>[`xmlcharrefreplace_errors()`](#codecs.xmlcharrefreplace_errors). |
| `'namereplace'`       | Replace with `\N{...}` escape sequences,<br/>what appears in the braces is the Name<br/>property from Unicode Character Database.<br/>Implemented in [`namereplace_errors()`](#codecs.namereplace_errors).                |

<a id="index-4"></a>

In addition, the following error handler is specific to the given codecs:

| Value             | Codecs                                                                    | Meaning                                                                                                                                                                                                                 |
|-------------------|---------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `'surrogatepass'` | utf-8, utf-16, utf-32,<br/>utf-16-be, utf-16-le,<br/>utf-32-be, utf-32-le | Allow encoding and decoding surrogate code<br/>point (`U+D800` - `U+DFFF`) as normal<br/>code point. Otherwise these codecs treat<br/>the presence of surrogate code point in<br/>[`str`](stdtypes.md#str) as an error. |

#### Versionadded
Added in version 3.1: The `'surrogateescape'` and `'surrogatepass'` error handlers.

#### Versionchanged
Changed in version 3.4: The `'surrogatepass'` error handler now works with utf-16\* and utf-32\*
codecs.

#### Versionadded
Added in version 3.5: The `'namereplace'` error handler.

#### Versionchanged
Changed in version 3.5: The `'backslashreplace'` error handler now works with decoding and
translating.

The set of allowed values can be extended by registering a new named error
handler:

### codecs.register_error(name, error_handler,)

Register the error handling function *error_handler* under the name *name*.
The *error_handler* argument will be called during encoding and decoding
in case of an error, when *name* is specified as the errors parameter.

For encoding, *error_handler* will be called with a [`UnicodeEncodeError`](exceptions.md#UnicodeEncodeError)
instance, which contains information about the location of the error. The
error handler must either raise this or a different exception, or return a
tuple with a replacement for the unencodable part of the input and a position
where encoding should continue. The replacement may be either [`str`](stdtypes.md#str) or
[`bytes`](stdtypes.md#bytes). If the replacement is bytes, the encoder will simply copy
them into the output buffer. If the replacement is a string, the encoder will
encode the replacement. Encoding continues on original input at the
specified position. Negative position values will be treated as being
relative to the end of the input string. If the resulting position is out of
bound an [`IndexError`](exceptions.md#IndexError) will be raised.

Decoding and translating works similarly, except [`UnicodeDecodeError`](exceptions.md#UnicodeDecodeError) or
[`UnicodeTranslateError`](exceptions.md#UnicodeTranslateError) will be passed to the handler and that the
replacement from the error handler will be put into the output directly.

Previously registered error handlers (including the standard error handlers)
can be looked up by name:

### codecs.lookup_error(name,)

Return the error handler previously registered under the name *name*.

Raises a [`LookupError`](exceptions.md#LookupError) in case the handler cannot be found.

The following standard error handlers are also made available as module level
functions:

### codecs.strict_errors(exception)

Implements the `'strict'` error handling.

Each encoding or decoding error raises a [`UnicodeError`](exceptions.md#UnicodeError).

### codecs.ignore_errors(exception)

Implements the `'ignore'` error handling.

Malformed data is ignored; encoding or decoding is continued without
further notice.

### codecs.replace_errors(exception)

Implements the `'replace'` error handling.

Substitutes `?` (ASCII character) for encoding errors or `�` (U+FFFD,
the official REPLACEMENT CHARACTER) for decoding errors.

### codecs.backslashreplace_errors(exception)

Implements the `'backslashreplace'` error handling.

Malformed data is replaced by a backslashed escape sequence.
On encoding, use the hexadecimal form of Unicode code point with formats
`\x*hh*` `\u*xxxx*` `\U*xxxxxxxx*`.
On decoding, use the hexadecimal form of
byte value with format `\x*hh*`.

#### Versionchanged
Changed in version 3.5: Works with decoding and translating.

### codecs.xmlcharrefreplace_errors(exception)

Implements the `'xmlcharrefreplace'` error handling (for encoding within
[text encoding](../glossary.md#term-text-encoding) only).

The unencodable character is replaced by an appropriate XML/HTML numeric
character reference, which is a decimal form of Unicode code point with
format `&#*num*;` .

### codecs.namereplace_errors(exception)

Implements the `'namereplace'` error handling (for encoding within
[text encoding](../glossary.md#term-text-encoding) only).

The unencodable character is replaced by a `\N{...}` escape sequence. The
set of characters that appear in the braces is the Name property from
Unicode Character Database. For example, the German lowercase letter `'ß'`
will be converted to byte sequence `\N{LATIN SMALL LETTER SHARP S}` .

#### Versionadded
Added in version 3.5.

<a id="codec-objects"></a>

### Stateless Encoding and Decoding

The base [`Codec`](#codecs.Codec) class defines these methods which also define the
function interfaces of the stateless encoder and decoder:

### *class* codecs.Codec

#### encode(input, errors='strict')

Encodes the object *input* and returns a tuple (output object, length consumed).
For instance, [text encoding](../glossary.md#term-text-encoding) converts
a string object to a bytes object using a particular
character set encoding (e.g., `cp1252` or `iso-8859-1`).

The *errors* argument defines the error handling to apply.
It defaults to `'strict'` handling.

The method may not store state in the [`Codec`](#codecs.Codec) instance. Use
[`StreamWriter`](#codecs.StreamWriter) for codecs which have to keep state in order to make
encoding efficient.

The encoder must be able to handle zero length input and return an empty object
of the output object type in this situation.

#### decode(input, errors='strict')

Decodes the object *input* and returns a tuple (output object, length
consumed). For instance, for a [text encoding](../glossary.md#term-text-encoding), decoding converts
a bytes object encoded using a particular
character set encoding to a string object.

For text encodings and bytes-to-bytes codecs,
*input* must be a bytes object or one which provides the read-only
buffer interface – for example, buffer objects and memory mapped files.

The *errors* argument defines the error handling to apply.
It defaults to `'strict'` handling.

The method may not store state in the [`Codec`](#codecs.Codec) instance. Use
[`StreamReader`](#codecs.StreamReader) for codecs which have to keep state in order to make
decoding efficient.

The decoder must be able to handle zero length input and return an empty object
of the output object type in this situation.

### Incremental Encoding and Decoding

The [`IncrementalEncoder`](#codecs.IncrementalEncoder) and [`IncrementalDecoder`](#codecs.IncrementalDecoder) classes provide
the basic interface for incremental encoding and decoding. Encoding/decoding the
input isn’t done with one call to the stateless encoder/decoder function, but
with multiple calls to the
[`encode()`](#codecs.IncrementalEncoder.encode)/[`decode()`](#codecs.IncrementalDecoder.decode) method of
the incremental encoder/decoder. The incremental encoder/decoder keeps track of
the encoding/decoding process during method calls.

The joined output of calls to the
[`encode()`](#codecs.IncrementalEncoder.encode)/[`decode()`](#codecs.IncrementalDecoder.decode) method is
the same as if all the single inputs were joined into one, and this input was
encoded/decoded with the stateless encoder/decoder.

<a id="incremental-encoder-objects"></a>

#### IncrementalEncoder Objects

The [`IncrementalEncoder`](#codecs.IncrementalEncoder) class is used for encoding an input in multiple
steps. It defines the following methods which every incremental encoder must
define in order to be compatible with the Python codec registry.

### *class* codecs.IncrementalEncoder(errors='strict')

Constructor for an [`IncrementalEncoder`](#codecs.IncrementalEncoder) instance.

All incremental encoders must provide this constructor interface. They are free
to add additional keyword arguments, but only the ones defined here are used by
the Python codec registry.

The [`IncrementalEncoder`](#codecs.IncrementalEncoder) may implement different error handling schemes
by providing the *errors* keyword argument. See [Error Handlers](#error-handlers) for
possible values.

The *errors* argument will be assigned to an attribute of the same name.
Assigning to this attribute makes it possible to switch between different error
handling strategies during the lifetime of the [`IncrementalEncoder`](#codecs.IncrementalEncoder)
object.

#### encode(object, final=False)

Encodes *object* (taking the current state of the encoder into account)
and returns the resulting encoded object. If this is the last call to
[`encode()`](#codecs.encode) *final* must be true (the default is false).

#### reset()

Reset the encoder to the initial state. The output is discarded: call
`.encode(object, final=True)`, passing an empty byte or text string
if necessary, to reset the encoder and to get the output.

#### getstate()

Return the current state of the encoder which must be an integer. The
implementation should make sure that `0` is the most common
state. (States that are more complicated than integers can be converted
into an integer by marshaling/pickling the state and encoding the bytes
of the resulting string into an integer.)

#### setstate(state)

Set the state of the encoder to *state*. *state* must be an encoder state
returned by [`getstate()`](#codecs.IncrementalEncoder.getstate).

<a id="incremental-decoder-objects"></a>

#### IncrementalDecoder Objects

The [`IncrementalDecoder`](#codecs.IncrementalDecoder) class is used for decoding an input in multiple
steps. It defines the following methods which every incremental decoder must
define in order to be compatible with the Python codec registry.

### *class* codecs.IncrementalDecoder(errors='strict')

Constructor for an [`IncrementalDecoder`](#codecs.IncrementalDecoder) instance.

All incremental decoders must provide this constructor interface. They are free
to add additional keyword arguments, but only the ones defined here are used by
the Python codec registry.

The [`IncrementalDecoder`](#codecs.IncrementalDecoder) may implement different error handling schemes
by providing the *errors* keyword argument. See [Error Handlers](#error-handlers) for
possible values.

The *errors* argument will be assigned to an attribute of the same name.
Assigning to this attribute makes it possible to switch between different error
handling strategies during the lifetime of the [`IncrementalDecoder`](#codecs.IncrementalDecoder)
object.

#### decode(object, final=False)

Decodes *object* (taking the current state of the decoder into account)
and returns the resulting decoded object. If this is the last call to
[`decode()`](#codecs.decode) *final* must be true (the default is false). If *final* is
true the decoder must decode the input completely and must flush all
buffers. If this isn’t possible (e.g. because of incomplete byte sequences
at the end of the input) it must initiate error handling just like in the
stateless case (which might raise an exception).

#### reset()

Reset the decoder to the initial state.

#### getstate()

Return the current state of the decoder. This must be a tuple with two
items, the first must be the buffer containing the still undecoded
input. The second must be an integer and can be additional state
info. (The implementation should make sure that `0` is the most common
additional state info.) If this additional state info is `0` it must be
possible to set the decoder to the state which has no input buffered and
`0` as the additional state info, so that feeding the previously
buffered input to the decoder returns it to the previous state without
producing any output. (Additional state info that is more complicated than
integers can be converted into an integer by marshaling/pickling the info
and encoding the bytes of the resulting string into an integer.)

#### setstate(state)

Set the state of the decoder to *state*. *state* must be a decoder state
returned by [`getstate()`](#codecs.IncrementalDecoder.getstate).

### Stream Encoding and Decoding

The [`StreamWriter`](#codecs.StreamWriter) and [`StreamReader`](#codecs.StreamReader) classes provide generic
working interfaces which can be used to implement new encoding submodules very
easily. See `encodings.utf_8` for an example of how this is done.

<a id="stream-writer-objects"></a>

#### StreamWriter Objects

The [`StreamWriter`](#codecs.StreamWriter) class is a subclass of [`Codec`](#codecs.Codec) and defines the
following methods which every stream writer must define in order to be
compatible with the Python codec registry.

### *class* codecs.StreamWriter(stream, errors='strict')

Constructor for a [`StreamWriter`](#codecs.StreamWriter) instance.

All stream writers must provide this constructor interface. They are free to add
additional keyword arguments, but only the ones defined here are used by the
Python codec registry.

The *stream* argument must be a file-like object open for writing
text or binary data, as appropriate for the specific codec.

The [`StreamWriter`](#codecs.StreamWriter) may implement different error handling schemes by
providing the *errors* keyword argument. See [Error Handlers](#error-handlers) for
the standard error handlers the underlying stream codec may support.

The *errors* argument will be assigned to an attribute of the same name.
Assigning to this attribute makes it possible to switch between different error
handling strategies during the lifetime of the [`StreamWriter`](#codecs.StreamWriter) object.

#### write(object)

Writes the object’s contents encoded to the stream.

#### writelines(list)

Writes the concatenated iterable of strings to the stream (possibly by reusing
the [`write()`](#codecs.StreamWriter.write) method). Infinite or
very large iterables are not supported. The standard bytes-to-bytes codecs
do not support this method.

#### reset()

Resets the codec buffers used for keeping internal state.

Calling this method should ensure that the data on the output is put into
a clean state that allows appending of new fresh data without having to
rescan the whole stream to recover state.

In addition to the above methods, the [`StreamWriter`](#codecs.StreamWriter) must also inherit
all other methods and attributes from the underlying stream.

<a id="stream-reader-objects"></a>

#### StreamReader Objects

The [`StreamReader`](#codecs.StreamReader) class is a subclass of [`Codec`](#codecs.Codec) and defines the
following methods which every stream reader must define in order to be
compatible with the Python codec registry.

### *class* codecs.StreamReader(stream, errors='strict')

Constructor for a [`StreamReader`](#codecs.StreamReader) instance.

All stream readers must provide this constructor interface. They are free to add
additional keyword arguments, but only the ones defined here are used by the
Python codec registry.

The *stream* argument must be a file-like object open for reading
text or binary data, as appropriate for the specific codec.

The [`StreamReader`](#codecs.StreamReader) may implement different error handling schemes by
providing the *errors* keyword argument. See [Error Handlers](#error-handlers) for
the standard error handlers the underlying stream codec may support.

The *errors* argument will be assigned to an attribute of the same name.
Assigning to this attribute makes it possible to switch between different error
handling strategies during the lifetime of the [`StreamReader`](#codecs.StreamReader) object.

The set of allowed values for the *errors* argument can be extended with
[`register_error()`](#codecs.register_error).

#### read(size=-1, chars=-1, firstline=False)

Decodes data from the stream and returns the resulting object.

The *chars* argument indicates the number of decoded
code points or bytes to return. The [`read()`](#codecs.StreamReader.read) method will
never return more data than requested, but it might return less,
if there is not enough available.

The *size* argument indicates the approximate maximum
number of encoded bytes or code points to read
for decoding. The decoder can modify this setting as
appropriate. The default value -1 indicates to read and decode as much as
possible. This parameter is intended to
prevent having to decode huge files in one step.

The *firstline* flag indicates that
it would be sufficient to only return the first
line, if there are decoding errors on later lines.

The method should use a greedy read strategy meaning that it should read
as much data as is allowed within the definition of the encoding and the
given size, e.g.  if optional encoding endings or state markers are
available on the stream, these should be read too.

#### readline(size=None, keepends=True)

Read one line from the input stream and return the decoded data.

*size*, if given, is passed as size argument to the stream’s
[`read()`](#codecs.StreamReader.read) method.

If *keepends* is false line-endings will be stripped from the lines
returned.

#### readlines(sizehint=None, keepends=True)

Read all lines available on the input stream and return them as a list of
lines.

Line-endings are implemented using the codec’s [`decode()`](#codecs.decode) method and
are included in the list entries if *keepends* is true.

*sizehint*, if given, is passed as the *size* argument to the stream’s
[`read()`](#codecs.StreamReader.read) method.

#### reset()

Resets the codec buffers used for keeping internal state.

Note that no stream repositioning should take place. This method is
primarily intended to be able to recover from decoding errors.

In addition to the above methods, the [`StreamReader`](#codecs.StreamReader) must also inherit
all other methods and attributes from the underlying stream.

<a id="stream-reader-writer"></a>

#### StreamReaderWriter Objects

The [`StreamReaderWriter`](#codecs.StreamReaderWriter) is a convenience class that allows wrapping
streams which work in both read and write modes.

The design is such that one can use the factory functions returned by the
[`lookup()`](#codecs.lookup) function to construct the instance.

### *class* codecs.StreamReaderWriter(stream, Reader, Writer, errors='strict')

Creates a [`StreamReaderWriter`](#codecs.StreamReaderWriter) instance. *stream* must be a file-like
object. *Reader* and *Writer* must be factory functions or classes providing the
[`StreamReader`](#codecs.StreamReader) and [`StreamWriter`](#codecs.StreamWriter) interface resp. Error handling
is done in the same way as defined for the stream readers and writers.

[`StreamReaderWriter`](#codecs.StreamReaderWriter) instances define the combined interfaces of
[`StreamReader`](#codecs.StreamReader) and [`StreamWriter`](#codecs.StreamWriter) classes. They inherit all other
methods and attributes from the underlying stream.

<a id="stream-recoder-objects"></a>

#### StreamRecoder Objects

The [`StreamRecoder`](#codecs.StreamRecoder) translates data from one encoding to another,
which is sometimes useful when dealing with different encoding environments.

The design is such that one can use the factory functions returned by the
[`lookup()`](#codecs.lookup) function to construct the instance.

### *class* codecs.StreamRecoder(stream, encode, decode, Reader, Writer, errors='strict')

Creates a [`StreamRecoder`](#codecs.StreamRecoder) instance which implements a two-way conversion:
*encode* and *decode* work on the frontend — the data visible to
code calling [`read()`](#codecs.StreamReader.read) and [`write()`](#codecs.StreamWriter.write),
while *Reader* and *Writer*
work on the backend — the data in *stream*.

You can use these objects to do transparent transcodings, e.g., from Latin-1
to UTF-8 and back.

The *stream* argument must be a file-like object.

The *encode* and *decode* arguments must
adhere to the [`Codec`](#codecs.Codec) interface. *Reader* and
*Writer* must be factory functions or classes providing objects of the
[`StreamReader`](#codecs.StreamReader) and [`StreamWriter`](#codecs.StreamWriter) interface respectively.

Error handling is done in the same way as defined for the stream readers and
writers.

[`StreamRecoder`](#codecs.StreamRecoder) instances define the combined interfaces of
[`StreamReader`](#codecs.StreamReader) and [`StreamWriter`](#codecs.StreamWriter) classes. They inherit all other
methods and attributes from the underlying stream.

<a id="encodings-overview"></a>

## Encodings and Unicode

Strings are stored internally as sequences of code points in
range `U+0000`–`U+10FFFF`. (See [**PEP 393**](https://peps.python.org/pep-0393/) for
more details about the implementation.)
Once a string object is used outside of CPU and memory, endianness
and how these arrays are stored as bytes become an issue. As with other
codecs, serialising a string into a sequence of bytes is known as *encoding*,
and recreating the string from the sequence of bytes is known as *decoding*.
There are a variety of different text serialisation codecs, which are
collectivity referred to as [text encodings](../glossary.md#term-text-encoding).

The simplest text encoding (called `'latin-1'` or `'iso-8859-1'`) maps
the code points 0–255 to the bytes `0x0`–`0xff`, which means that a string
object that contains code points above `U+00FF` can’t be encoded with this
codec. Doing so will raise a [`UnicodeEncodeError`](exceptions.md#UnicodeEncodeError) that looks
like the following (although the details of the error message may differ):
`UnicodeEncodeError: 'latin-1' codec can't encode character '\u1234' in
position 3: ordinal not in range(256)`.

There’s another group of encodings (the so called charmap encodings) that choose
a different subset of all Unicode code points and how these code points are
mapped to the bytes `0x0`–`0xff`. To see how this is done simply open
e.g. `encodings/cp1252.py` (which is an encoding that is used primarily on
Windows). There’s a string constant with 256 characters that shows you which
character is mapped to which byte value.

All of these encodings can only encode 256 of the 1114112 code points
defined in Unicode. A simple and straightforward way that can store each Unicode
code point, is to store each code point as four consecutive bytes. There are two
possibilities: store the bytes in big endian or in little endian order. These
two encodings are called `UTF-32-BE` and `UTF-32-LE` respectively. Their
disadvantage is that if, for example, you use `UTF-32-BE` on a little endian
machine you will always have to swap bytes on encoding and decoding.
Python’s `UTF-16` and `UTF-32` codecs avoid this problem by using the
platform’s native byte order when no BOM is present.
Python follows prevailing platform
practice, so native-endian data round-trips without redundant byte swapping,
even though the Unicode Standard defaults to big-endian when the byte order is
unspecified. When these bytes are read by a CPU with a different endianness,
the bytes have to be swapped. To be able to detect the endianness of a
`UTF-16` or `UTF-32` byte sequence, a BOM (“Byte Order Mark”) is used.
This is the Unicode character `U+FEFF`. This character can be prepended to every
`UTF-16` or `UTF-32` byte sequence. The byte swapped version of this character
(`0xFFFE`) is an illegal character that may not appear in a Unicode text.
When the first character of a `UTF-16` or `UTF-32` byte sequence is
`U+FFFE`, the bytes have to be swapped on decoding.

Unfortunately the character `U+FEFF` had a second purpose as
a `ZERO WIDTH NO-BREAK SPACE`: a character that has no width and doesn’t allow
a word to be split. It can e.g. be used to give hints to a ligature algorithm.
With Unicode 4.0 using `U+FEFF` as a `ZERO WIDTH NO-BREAK SPACE` has been
deprecated (with `U+2060` (`WORD JOINER`) assuming this role). Nevertheless
Unicode software still must be able to handle `U+FEFF` in both roles: as a BOM
it’s a device to determine the storage layout of the encoded bytes, and vanishes
once the byte sequence has been decoded into a string; as a `ZERO WIDTH
NO-BREAK SPACE` it’s a normal character that will be decoded like any other.

There’s another encoding that is able to encode the full range of Unicode
characters: UTF-8. UTF-8 is an 8-bit encoding, which means there are no issues
with byte order in UTF-8. Each byte in a UTF-8 byte sequence consists of two
parts: marker bits (the most significant bits) and payload bits. The marker bits
are a sequence of zero to four `1` bits followed by a `0` bit. Unicode characters are
encoded like this (with x being payload bits, which when concatenated give the
Unicode character):

| Range                       | Encoding                            |
|-----------------------------|-------------------------------------|
| `U-00000000` … `U-0000007F` | 0xxxxxxx                            |
| `U-00000080` … `U-000007FF` | 110xxxxx 10xxxxxx                   |
| `U-00000800` … `U-0000FFFF` | 1110xxxx 10xxxxxx 10xxxxxx          |
| `U-00010000` … `U-0010FFFF` | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |

The least significant bit of the Unicode character is the rightmost x bit.

As UTF-8 is an 8-bit encoding no BOM is required and any `U+FEFF` character in
the decoded string (even if it’s the first character) is treated as a `ZERO
WIDTH NO-BREAK SPACE`.

Without external information it’s impossible to reliably determine which
encoding was used for encoding a string. Each charmap encoding can
decode any random byte sequence. However that’s not possible with UTF-8, as
UTF-8 byte sequences have a structure that doesn’t allow arbitrary byte
sequences. To increase the reliability with which a UTF-8 encoding can be
detected, Microsoft invented a variant of UTF-8 (that Python calls
`"utf-8-sig"`) for its Notepad program: Before any of the Unicode characters
is written to the file, a UTF-8 encoded BOM (which looks like this as a byte
sequence: `0xef`, `0xbb`, `0xbf`) is written. As it’s rather improbable
that any charmap encoded file starts with these byte values (which would e.g.
map to

> LATIN SMALL LETTER I WITH DIAERESIS
> <br/>
> RIGHT-POINTING DOUBLE ANGLE QUOTATION MARK
> <br/>
> INVERTED QUESTION MARK
> <br/>

in iso-8859-1), this increases the probability that a `utf-8-sig` encoding can be
correctly guessed from the byte sequence. So here the BOM is not used to be able
to determine the byte order used for generating the byte sequence, but as a
signature that helps in guessing the encoding. On encoding the utf-8-sig codec
will write `0xef`, `0xbb`, `0xbf` as the first three bytes to the file. On
decoding `utf-8-sig` will skip those three bytes if they appear as the first
three bytes in the file. In UTF-8, the use of the BOM is discouraged and
should generally be avoided.

<a id="standard-encodings"></a>

## Standard Encodings

Python comes with a number of codecs built-in, either implemented as C functions
or with dictionaries as mapping tables. The following table lists the codecs by
name, together with a few common aliases, and the languages for which the
encoding is likely used. Neither the list of aliases nor the list of languages
is meant to be exhaustive. Notice that spelling alternatives that only differ in
case or use a space or a hyphen instead of an underscore are also valid aliases
because they are equivalent when normalized by
[`normalize_encoding()`](#encodings.normalize_encoding). For example, `'utf-8'` is a valid
alias for the `'utf_8'` codec.

#### NOTE
The below table lists the most common aliases, for a complete list
refer to the source [aliases.py](https://github.com/python/cpython/tree/main/Lib/encodings/aliases.py) file.

On Windows, `cpXXX` codecs are available for all code pages.
But only codecs listed in the following table are guaranteed to exist on
other platforms.

**CPython implementation detail:** Some common encodings can bypass the codecs lookup machinery to
improve performance. These optimization opportunities are only
recognized by CPython for a limited set of (case insensitive)
aliases: utf-8, utf8, latin-1, latin1, iso-8859-1, iso8859-1, mbcs
(Windows only), ascii, us-ascii, utf-16, utf16, utf-32, utf32, and
the same using underscores instead of dashes. Using alternative
aliases for these encodings may result in slower execution.

#### Versionchanged
Changed in version 3.6: Optimization opportunity recognized for us-ascii.

Many of the character sets support the same languages. They vary in individual
characters (e.g. whether the EURO SIGN is supported or not), and in the
assignment of characters to code positions. For the European languages in
particular, the following variants typically exist:

* an ISO 8859 codeset
* a Microsoft Windows code page, which is typically derived from an 8859 codeset,
  but replaces control characters with additional graphic characters
* an IBM EBCDIC code page
* an IBM PC code page, which is ASCII compatible

| Codec           | Aliases                                                                                              | Languages                                                       |
|-----------------|------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| ascii           | 646, us-ascii                                                                                        | English                                                         |
| big5            | big5-tw, csbig5                                                                                      | Traditional Chinese                                             |
| big5hkscs       | big5-hkscs, hkscs                                                                                    | Traditional Chinese                                             |
| cp037           | IBM037, IBM039                                                                                       | English                                                         |
| cp273           | 273, IBM273, csIBM273                                                                                | German<br/><br/>#### Versionadded<br/>Added in version 3.4.     |
| cp424           | EBCDIC-CP-HE, IBM424                                                                                 | Hebrew                                                          |
| cp437           | 437, IBM437                                                                                          | English                                                         |
| cp500           | EBCDIC-CP-BE, EBCDIC-CP-CH,<br/>IBM500                                                               | Western Europe                                                  |
| cp720           |                                                                                                      | Arabic                                                          |
| cp737           |                                                                                                      | Greek                                                           |
| cp775           | IBM775                                                                                               | Baltic languages                                                |
| cp850           | 850, IBM850                                                                                          | Western Europe                                                  |
| cp852           | 852, IBM852                                                                                          | Central and Eastern Europe                                      |
| cp855           | 855, IBM855                                                                                          | Belarusian, Bulgarian,<br/>Macedonian, Russian, Serbian         |
| cp856           |                                                                                                      | Hebrew                                                          |
| cp857           | 857, IBM857                                                                                          | Turkish                                                         |
| cp858           | 858, IBM858                                                                                          | Western Europe                                                  |
| cp860           | 860, IBM860                                                                                          | Portuguese                                                      |
| cp861           | 861, CP-IS, IBM861                                                                                   | Icelandic                                                       |
| cp862           | 862, IBM862                                                                                          | Hebrew                                                          |
| cp863           | 863, IBM863                                                                                          | Canadian                                                        |
| cp864           | IBM864                                                                                               | Arabic                                                          |
| cp865           | 865, IBM865                                                                                          | Danish, Norwegian                                               |
| cp866           | 866, IBM866                                                                                          | Russian                                                         |
| cp869           | 869, CP-GR, IBM869                                                                                   | Greek                                                           |
| cp874           |                                                                                                      | Thai                                                            |
| cp875           |                                                                                                      | Greek                                                           |
| cp932           | 932, ms932, mskanji, ms-kanji,<br/>windows-31j                                                       | Japanese                                                        |
| cp949           | 949, ms949, uhc                                                                                      | Korean                                                          |
| cp950           | 950, ms950                                                                                           | Traditional Chinese                                             |
| cp1006          |                                                                                                      | Urdu                                                            |
| cp1026          | ibm1026                                                                                              | Turkish                                                         |
| cp1125          | 1125, ibm1125, cp866u, ruscii                                                                        | Ukrainian<br/><br/>#### Versionadded<br/>Added in version 3.4.  |
| cp1140          | ibm1140                                                                                              | Western Europe                                                  |
| cp1250          | windows-1250                                                                                         | Central and Eastern Europe                                      |
| cp1251          | windows-1251                                                                                         | Belarusian, Bulgarian,<br/>Macedonian, Russian, Serbian         |
| cp1252          | windows-1252                                                                                         | Western Europe                                                  |
| cp1253          | windows-1253                                                                                         | Greek                                                           |
| cp1254          | windows-1254                                                                                         | Turkish                                                         |
| cp1255          | windows-1255                                                                                         | Hebrew                                                          |
| cp1256          | windows-1256                                                                                         | Arabic                                                          |
| cp1257          | windows-1257                                                                                         | Baltic languages                                                |
| cp1258          | windows-1258                                                                                         | Vietnamese                                                      |
| euc_jp          | eucjp, ujis, u-jis                                                                                   | Japanese                                                        |
| euc_jis_2004    | jisx0213, eucjis2004                                                                                 | Japanese                                                        |
| euc_jisx0213    | eucjisx0213                                                                                          | Japanese                                                        |
| euc_kr          | euckr, korean, ksc5601,<br/>ks_c-5601, ks_c-5601-1987,<br/>ksx1001, ks_x-1001                        | Korean                                                          |
| gb2312          | chinese, csiso58gb231280,<br/>euc-cn, euccn, eucgb2312-cn,<br/>gb2312-1980, gb2312-80,<br/>iso-ir-58 | Simplified Chinese                                              |
| gbk             | 936, cp936, ms936                                                                                    | Unified Chinese                                                 |
| gb18030         | gb18030-2000                                                                                         | Unified Chinese                                                 |
| hz              | hzgb, hz-gb, hz-gb-2312                                                                              | Simplified Chinese                                              |
| iso2022_jp      | csiso2022jp, iso2022jp,<br/>iso-2022-jp                                                              | Japanese                                                        |
| iso2022_jp_1    | iso2022jp-1, iso-2022-jp-1                                                                           | Japanese                                                        |
| iso2022_jp_2    | iso2022jp-2, iso-2022-jp-2                                                                           | Japanese, Korean, Simplified<br/>Chinese, Western Europe, Greek |
| iso2022_jp_2004 | iso2022jp-2004,<br/>iso-2022-jp-2004                                                                 | Japanese                                                        |
| iso2022_jp_3    | iso2022jp-3, iso-2022-jp-3                                                                           | Japanese                                                        |
| iso2022_jp_ext  | iso2022jp-ext, iso-2022-jp-ext                                                                       | Japanese                                                        |
| iso2022_kr      | csiso2022kr, iso2022kr,<br/>iso-2022-kr                                                              | Korean                                                          |
| latin_1         | iso-8859-1, iso8859-1, 8859,<br/>cp819, latin, latin1, L1                                            | Western Europe                                                  |
| iso8859_2       | iso-8859-2, latin2, L2                                                                               | Central and Eastern Europe                                      |
| iso8859_3       | iso-8859-3, latin3, L3                                                                               | Esperanto, Maltese                                              |
| iso8859_4       | iso-8859-4, latin4, L4                                                                               | Northern Europe                                                 |
| iso8859_5       | iso-8859-5, cyrillic                                                                                 | Belarusian, Bulgarian,<br/>Macedonian, Russian, Serbian         |
| iso8859_6       | iso-8859-6, arabic                                                                                   | Arabic                                                          |
| iso8859_7       | iso-8859-7, greek, greek8                                                                            | Greek                                                           |
| iso8859_8       | iso-8859-8, hebrew                                                                                   | Hebrew                                                          |
| iso8859_9       | iso-8859-9, latin5, L5                                                                               | Turkish                                                         |
| iso8859_10      | iso-8859-10, latin6, L6                                                                              | Nordic languages                                                |
| iso8859_11      | iso-8859-11, thai                                                                                    | Thai languages                                                  |
| iso8859_13      | iso-8859-13, latin7, L7                                                                              | Baltic languages                                                |
| iso8859_14      | iso-8859-14, latin8, L8                                                                              | Celtic languages                                                |
| iso8859_15      | iso-8859-15, latin9, L9                                                                              | Western Europe                                                  |
| iso8859_16      | iso-8859-16, latin10, L10                                                                            | South-Eastern Europe                                            |
| johab           | cp1361, ms1361                                                                                       | Korean                                                          |
| koi8_r          |                                                                                                      | Russian                                                         |
| koi8_t          |                                                                                                      | Tajik<br/><br/>#### Versionadded<br/>Added in version 3.5.      |
| koi8_u          |                                                                                                      | Ukrainian                                                       |
| kz1048          | kz_1048, strk1048_2002, rk1048                                                                       | Kazakh<br/><br/>#### Versionadded<br/>Added in version 3.5.     |
| mac_cyrillic    | maccyrillic                                                                                          | Belarusian, Bulgarian,<br/>Macedonian, Russian, Serbian         |
| mac_greek       | macgreek                                                                                             | Greek                                                           |
| mac_iceland     | maciceland                                                                                           | Icelandic                                                       |
| mac_latin2      | maclatin2, maccentraleurope,<br/>mac_centeuro                                                        | Central and Eastern Europe                                      |
| mac_roman       | macroman, macintosh                                                                                  | Western Europe                                                  |
| mac_turkish     | macturkish                                                                                           | Turkish                                                         |
| ptcp154         | csptcp154, pt154, cp154,<br/>cyrillic-asian                                                          | Kazakh                                                          |
| shift_jis       | csshiftjis, shiftjis, sjis,<br/>s_jis                                                                | Japanese                                                        |
| shift_jis_2004  | shiftjis2004, sjis_2004,<br/>sjis2004                                                                | Japanese                                                        |
| shift_jisx0213  | shiftjisx0213, sjisx0213,<br/>s_jisx0213                                                             | Japanese                                                        |
| utf_32          | U32, utf32                                                                                           | all languages                                                   |
| utf_32_be       | UTF-32BE                                                                                             | all languages                                                   |
| utf_32_le       | UTF-32LE                                                                                             | all languages                                                   |
| utf_16          | U16, utf16                                                                                           | all languages                                                   |
| utf_16_be       | UTF-16BE                                                                                             | all languages                                                   |
| utf_16_le       | UTF-16LE                                                                                             | all languages                                                   |
| utf_7           | U7, unicode-1-1-utf-7                                                                                | all languages                                                   |
| utf_8           | U8, UTF, utf8, cp65001                                                                               | all languages                                                   |
| utf_8_sig       | utf8-sig                                                                                             | all languages                                                   |

#### Versionchanged
Changed in version 3.4: The utf-16\* and utf-32\* encoders no longer allow surrogate code points
(`U+D800`–`U+DFFF`) to be encoded.
The utf-32\* decoders no longer decode
byte sequences that correspond to surrogate code points.

#### Versionchanged
Changed in version 3.8: `cp65001` is now an alias to `utf_8`.

#### Versionchanged
Changed in version 3.14: On Windows, `cpXXX` codecs are now available for all code pages.

## Python Specific Encodings

A number of predefined codecs are specific to Python, so their codec names have
no meaning outside Python. These are listed in the tables below based on the
expected input and output types (note that while text encodings are the most
common use case for codecs, the underlying codec infrastructure supports
arbitrary data transforms rather than just text encodings). For asymmetric
codecs, the stated meaning describes the encoding direction.

### Text Encodings

The following codecs provide [`str`](stdtypes.md#str) to [`bytes`](stdtypes.md#bytes) encoding and
[bytes-like object](../glossary.md#term-bytes-like-object) to [`str`](stdtypes.md#str) decoding, similar to the Unicode text
encodings.

| Codec              | Aliases        | Meaning                                                                                                                                                                                                                                                             |
|--------------------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| idna               |                | Implement [**RFC 3490**](https://datatracker.ietf.org/doc/html/rfc3490.html),<br/>see also<br/>[`encodings.idna`](#module-encodings.idna).<br/>Only `errors='strict'`<br/>is supported.                                                                             |
| mbcs               | ansi,<br/>dbcs | Windows only: Encode the<br/>operand according to the<br/>ANSI codepage (CP_ACP).                                                                                                                                                                                   |
| oem                |                | Windows only: Encode the<br/>operand according to the<br/>OEM codepage (CP_OEMCP).<br/><br/>#### Versionadded<br/>Added in version 3.6.                                                                                                                             |
| palmos             |                | Encoding of PalmOS 3.5.                                                                                                                                                                                                                                             |
| punycode           |                | Implement [**RFC 3492**](https://datatracker.ietf.org/doc/html/rfc3492.html).<br/>Stateful codecs are not<br/>supported.                                                                                                                                            |
| raw_unicode_escape |                | Latin-1 encoding with<br/>`\u*XXXX*` and<br/>`\U*XXXXXXXX*`<br/>for other code points.<br/>Existing<br/>backslashes are not<br/>escaped in any way.<br/>It is used in the Python<br/>pickle protocol.                                                               |
| undefined          |                | This Codec should only<br/>be used for testing<br/>purposes.<br/><br/>Raise an exception for<br/>all conversions, even<br/>empty strings. The error<br/>handler is ignored.                                                                                         |
| unicode_escape     |                | Encoding suitable as the<br/>contents of a Unicode<br/>literal in ASCII-encoded<br/>Python source code,<br/>except that quotes are<br/>not escaped. Decode<br/>from Latin-1 source code.<br/>Beware that Python source<br/>code actually uses UTF-8<br/>by default. |

#### Versionchanged
Changed in version 3.8: “unicode_internal” codec is removed.

<a id="binary-transforms"></a>

### Binary Transforms

The following codecs provide binary transforms: [bytes-like object](../glossary.md#term-bytes-like-object)
to [`bytes`](stdtypes.md#bytes) mappings. They are not supported by [`bytes.decode()`](stdtypes.md#bytes.decode)
(which only produces [`str`](stdtypes.md#str) output).

| Codec                             | Aliases                                           | Meaning                                                                                                                                                                                                                                                                                 | Encoder / decoder                                                                                                         |
|-----------------------------------|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| base64_codec <sup>[1](#b64)</sup> | base64, base_64                                   | Convert the operand to<br/>multiline MIME base64 (the<br/>result always includes a<br/>trailing `'\n'`).<br/><br/>#### Versionchanged<br/>Changed in version 3.4: accepts any<br/>[bytes-like object](../glossary.md#term-bytes-like-object)<br/>as input for encoding and<br/>decoding | [`base64.encodebytes()`](base64.md#base64.encodebytes) /<br/>[`base64.decodebytes()`](base64.md#base64.decodebytes)       |
| bz2_codec                         | bz2                                               | Compress the operand using<br/>bz2.                                                                                                                                                                                                                                                     | [`bz2.compress()`](bz2.md#bz2.compress) /<br/>[`bz2.decompress()`](bz2.md#bz2.decompress)                                 |
| hex_codec                         | hex                                               | Convert the operand to<br/>hexadecimal<br/>representation, with two<br/>digits per byte.                                                                                                                                                                                                | [`binascii.b2a_hex()`](binascii.md#binascii.b2a_hex) /<br/>[`binascii.a2b_hex()`](binascii.md#binascii.a2b_hex)           |
| quopri_codec                      | quopri,<br/>quotedprintable,<br/>quoted_printable | Convert the operand to MIME<br/>quoted printable.                                                                                                                                                                                                                                       | [`quopri.encode()`](quopri.md#quopri.encode) with<br/>`quotetabs=True` /<br/>[`quopri.decode()`](quopri.md#quopri.decode) |
| uu_codec                          | uu                                                | Convert the operand using<br/>uuencode.                                                                                                                                                                                                                                                 |                                                                                                                           |
| zlib_codec                        | zip, zlib                                         | Compress the operand using<br/>gzip.                                                                                                                                                                                                                                                    | [`zlib.compress()`](zlib.md#zlib.compress) /<br/>[`zlib.decompress()`](zlib.md#zlib.decompress)                           |
* <a id='b64'>**[1]**</a> In addition to [bytes-like objects](../glossary.md#term-bytes-like-object), `'base64_codec'` also accepts ASCII-only instances of [`str`](stdtypes.md#str) for decoding

#### Versionadded
Added in version 3.2: Restoration of the binary transforms.

#### Versionchanged
Changed in version 3.4: Restoration of the aliases for the binary transforms.

<a id="standalone-codec-functions"></a>

### Standalone Codec Functions

The following functions provide encoding and decoding functionality similar to codecs,
but are not available as named codecs through [`codecs.encode()`](#codecs.encode) or [`codecs.decode()`](#codecs.decode).
They are used internally (for example, by [`pickle`](pickle.md#module-pickle)) and behave similarly to the
`string_escape` codec that was removed in Python 3.

#### codecs.escape_encode(input, errors=None)

Encode *input* using escape sequences. Similar to how [`repr()`](functions.md#repr) on bytes
produces escaped byte values.

*input* must be a [`bytes`](stdtypes.md#bytes) object.

Returns a tuple `(output, length)` where *output* is a [`bytes`](stdtypes.md#bytes)
object and *length* is the number of bytes consumed.

#### codecs.escape_decode(input, errors=None)

Decode *input* from escape sequences back to the original bytes.

*input* must be a [bytes-like object](../glossary.md#term-bytes-like-object).

Returns a tuple `(output, length)` where *output* is a [`bytes`](stdtypes.md#bytes)
object and *length* is the number of bytes consumed.

<a id="text-transforms"></a>

### Text Transforms

The following codec provides a text transform: a [`str`](stdtypes.md#str) to [`str`](stdtypes.md#str)
mapping. It is not supported by [`str.encode()`](stdtypes.md#str.encode) (which only produces
[`bytes`](stdtypes.md#bytes) output).

| Codec   | Aliases   | Meaning                                                     |
|---------|-----------|-------------------------------------------------------------|
| rot_13  | rot13     | Return the Caesar-cypher<br/>encryption of the<br/>operand. |

#### Versionadded
Added in version 3.2: Restoration of the `rot_13` text transform.

#### Versionchanged
Changed in version 3.4: Restoration of the `rot13` alias.

## `encodings` — Encodings package

This module implements the following functions:

### encodings.normalize_encoding(encoding)

Normalize encoding name *encoding*.

Normalization works as follows: all non-alphanumeric characters except the
dot used for Python package names are collapsed and replaced with a single
underscore, leading and trailing underscores are removed.
For example, `'  -;#'` becomes `'_'`.

Note that *encoding* should be ASCII only.

#### NOTE
The following functions should not be used directly, except for testing
purposes; [`codecs.lookup()`](#codecs.lookup) should be used instead.

### encodings.search_function(encoding)

Search for the codec module corresponding to the given encoding name
*encoding*.

This function first normalizes the *encoding* using
[`normalize_encoding()`](#encodings.normalize_encoding), then looks for a corresponding alias.
It attempts to import a codec module from the encodings package using either
the alias or the normalized name. If the module is found and defines a valid
`getregentry()` function that returns a [`codecs.CodecInfo`](#codecs.CodecInfo) object,
the codec is cached and returned.

If the codec module defines a `getaliases()` function any returned aliases
are registered for future use.

### encodings.win32_code_page_search_function(encoding)

Search for a Windows code page encoding *encoding* of the form `cpXXXX`.

If the code page is valid and supported, return a [`codecs.CodecInfo`](#codecs.CodecInfo)
object for it.

[Availability](intro.md#availability): Windows.

#### Versionadded
Added in version 3.14.

This module implements the following exception:

### *exception* encodings.CodecRegistryError

Raised when a codec is invalid or incompatible.

## `encodings.idna` — Internationalized Domain Names in Applications

This module implements [**RFC 3490**](https://datatracker.ietf.org/doc/html/rfc3490.html) (Internationalized Domain Names in
Applications) and [**RFC 3492**](https://datatracker.ietf.org/doc/html/rfc3492.html) (Nameprep: A Stringprep Profile for
Internationalized Domain Names (IDN)). It builds upon the `punycode` encoding
and [`stringprep`](stringprep.md#module-stringprep).

If you need the IDNA 2008 standard from [**RFC 5891**](https://datatracker.ietf.org/doc/html/rfc5891.html) and [**RFC 5895**](https://datatracker.ietf.org/doc/html/rfc5895.html), use the
third-party [idna](https://pypi.org/project/idna/) module.

These RFCs together define a protocol to support non-ASCII characters in domain
names. A domain name containing non-ASCII characters (such as
`www.Alliancefrançaise.nu`) is converted into an ASCII-compatible encoding
(ACE, such as `www.xn--alliancefranaise-npb.nu`). The ACE form of the domain
name is then used in all places where arbitrary characters are not allowed by
the protocol, such as DNS queries, HTTP *Host* fields, and so
on. This conversion is carried out in the application; if possible invisible to
the user: The application should transparently convert Unicode domain labels to
IDNA on the wire, and convert back ACE labels to Unicode before presenting them
to the user.

Python supports this conversion in several ways:  the `idna` codec performs
conversion between Unicode and ACE, separating an input string into labels
based on the separator characters defined in [**section 3.1 of RFC 3490**](https://datatracker.ietf.org/doc/html/rfc3490.html#section-3.1)
and converting each label to ACE as required, and conversely separating an input
byte string into labels based on the `.` separator and converting any ACE
labels found into unicode. Furthermore, the [`socket`](socket.md#module-socket) module
transparently converts Unicode host names to ACE, so that applications need not
be concerned about converting host names themselves when they pass them to the
socket module. On top of that, modules that have host names as function
parameters, such as [`http.client`](http.client.md#module-http.client) and [`ftplib`](ftplib.md#module-ftplib), accept Unicode host
names ([`http.client`](http.client.md#module-http.client) then also transparently sends an IDNA hostname in the
*Host* field if it sends that field at all).

When receiving host names from the wire (such as in reverse name lookup), no
automatic conversion to Unicode is performed: applications wishing to present
such host names to the user should decode them to Unicode.

The module `encodings.idna` also implements the nameprep procedure, which
performs certain normalizations on host names, to achieve case-insensitivity of
international domain names, and to unify similar characters. The nameprep
functions can be used directly if desired.

### encodings.idna.nameprep(label)

Return the nameprepped version of *label*. The implementation currently assumes
query strings, so `AllowUnassigned` is true.

### encodings.idna.ToASCII(label)

Convert a label to ASCII, as specified in [**RFC 3490**](https://datatracker.ietf.org/doc/html/rfc3490.html). `UseSTD3ASCIIRules` is
assumed to be false.

### encodings.idna.ToUnicode(label)

Convert a label to Unicode, as specified in [**RFC 3490**](https://datatracker.ietf.org/doc/html/rfc3490.html).

## `encodings.mbcs` — Windows ANSI codepage

This module implements the ANSI codepage (CP_ACP).

[Availability](intro.md#availability): Windows.

#### Versionchanged
Changed in version 3.2: Before 3.2, the *errors* argument was ignored; `'replace'` was always used
to encode, and `'ignore'` to decode.

#### Versionchanged
Changed in version 3.3: Support any error handler.

## `encodings.utf_8_sig` — UTF-8 codec with BOM signature

This module implements a variant of the UTF-8 codec. On encoding, a UTF-8 encoded
BOM will be prepended to the UTF-8 encoded bytes. For the stateful encoder this
is only done once (on the first write to the byte stream). On decoding, an
optional UTF-8 encoded BOM at the start of the data will be skipped.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
