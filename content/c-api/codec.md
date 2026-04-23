<a id="codec-registry"></a>

# Codec registry and support functions

### int PyCodec_Register([PyObject](structures.md#c.PyObject) \*search_function)

 *Part of the [Stable ABI](stable.md#stable).*

Register a new codec search function.

As a side effect, this tries to load the `encodings` package, if not yet
done, to make sure that it is always first in the list of search functions.

### int PyCodec_Unregister([PyObject](structures.md#c.PyObject) \*search_function)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Unregister a codec search function and clear the registry’s cache.
If the search function is not registered, do nothing.
Return 0 on success. Raise an exception and return -1 on error.

#### Versionadded
Added in version 3.10.

### int PyCodec_KnownEncoding(const char \*encoding)

 *Part of the [Stable ABI](stable.md#stable).*

Return `1` or `0` depending on whether there is a registered codec for
the given *encoding*.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyCodec_Encode([PyObject](structures.md#c.PyObject) \*object, const char \*encoding, const char \*errors)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Generic codec based encoding API.

*object* is passed through the encoder function found for the given
*encoding* using the error handling method defined by *errors*.  *errors* may
be `NULL` to use the default method defined for the codec.  Raises a
[`LookupError`](../library/exceptions.md#LookupError) if no encoder can be found.

### [PyObject](structures.md#c.PyObject) \*PyCodec_Decode([PyObject](structures.md#c.PyObject) \*object, const char \*encoding, const char \*errors)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Generic codec based decoding API.

*object* is passed through the decoder function found for the given
*encoding* using the error handling method defined by *errors*.  *errors* may
be `NULL` to use the default method defined for the codec.  Raises a
[`LookupError`](../library/exceptions.md#LookupError) if no decoder can be found.

## Codec lookup API

In the following functions, the *encoding* string is looked up converted to all
lower-case characters, which makes encodings looked up through this mechanism
effectively case-insensitive.  If no codec is found, a [`KeyError`](../library/exceptions.md#KeyError) is set
and `NULL` returned.

### [PyObject](structures.md#c.PyObject) \*PyCodec_Encoder(const char \*encoding)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Get an encoder function for the given *encoding*.

### [PyObject](structures.md#c.PyObject) \*PyCodec_Decoder(const char \*encoding)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Get a decoder function for the given *encoding*.

### [PyObject](structures.md#c.PyObject) \*PyCodec_IncrementalEncoder(const char \*encoding, const char \*errors)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Get an [`IncrementalEncoder`](../library/codecs.md#codecs.IncrementalEncoder) object for the given *encoding*.

### [PyObject](structures.md#c.PyObject) \*PyCodec_IncrementalDecoder(const char \*encoding, const char \*errors)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Get an [`IncrementalDecoder`](../library/codecs.md#codecs.IncrementalDecoder) object for the given *encoding*.

### [PyObject](structures.md#c.PyObject) \*PyCodec_StreamReader(const char \*encoding, [PyObject](structures.md#c.PyObject) \*stream, const char \*errors)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Get a [`StreamReader`](../library/codecs.md#codecs.StreamReader) factory function for the given *encoding*.

### [PyObject](structures.md#c.PyObject) \*PyCodec_StreamWriter(const char \*encoding, [PyObject](structures.md#c.PyObject) \*stream, const char \*errors)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Get a [`StreamWriter`](../library/codecs.md#codecs.StreamWriter) factory function for the given *encoding*.

## Registry API for Unicode encoding error handlers

### int PyCodec_RegisterError(const char \*name, [PyObject](structures.md#c.PyObject) \*error)

 *Part of the [Stable ABI](stable.md#stable).*

Register the error handling callback function *error* under the given *name*.
This callback function will be called by a codec when it encounters
unencodable characters/undecodable bytes and *name* is specified as the error
parameter in the call to the encode/decode function.

The callback gets a single argument, an instance of
[`UnicodeEncodeError`](../library/exceptions.md#UnicodeEncodeError), [`UnicodeDecodeError`](../library/exceptions.md#UnicodeDecodeError) or
[`UnicodeTranslateError`](../library/exceptions.md#UnicodeTranslateError) that holds information about the problematic
sequence of characters or bytes and their offset in the original string (see
[Unicode Exception Objects](exceptions.md#unicodeexceptions) for functions to extract this information).  The
callback must either raise the given exception, or return a two-item tuple
containing the replacement for the problematic sequence, and an integer
giving the offset in the original string at which encoding/decoding should be
resumed.

Return `0` on success, `-1` on error.

### [PyObject](structures.md#c.PyObject) \*PyCodec_LookupError(const char \*name)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Lookup the error handling callback function registered under *name*.  As a
special case `NULL` can be passed, in which case the error handling callback
for “strict” will be returned.

### [PyObject](structures.md#c.PyObject) \*PyCodec_StrictErrors([PyObject](structures.md#c.PyObject) \*exc)

*Return value: Always NULL.* *Part of the [Stable ABI](stable.md#stable).*

Raise *exc* as an exception.

### [PyObject](structures.md#c.PyObject) \*PyCodec_IgnoreErrors([PyObject](structures.md#c.PyObject) \*exc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Ignore the unicode error, skipping the faulty input.

### [PyObject](structures.md#c.PyObject) \*PyCodec_ReplaceErrors([PyObject](structures.md#c.PyObject) \*exc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Replace the unicode encode error with `?` or `U+FFFD`.

### [PyObject](structures.md#c.PyObject) \*PyCodec_XMLCharRefReplaceErrors([PyObject](structures.md#c.PyObject) \*exc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Replace the unicode encode error with XML character references.

### [PyObject](structures.md#c.PyObject) \*PyCodec_BackslashReplaceErrors([PyObject](structures.md#c.PyObject) \*exc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Replace the unicode encode error with backslash escapes (`\x`, `\u` and
`\U`).

### [PyObject](structures.md#c.PyObject) \*PyCodec_NameReplaceErrors([PyObject](structures.md#c.PyObject) \*exc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Replace the unicode encode error with `\N{...}` escapes.

#### Versionadded
Added in version 3.5.

## Codec utility variables

### const char \*Py_hexdigits

A string constant containing the lowercase hexadecimal digits: `"0123456789abcdef"`.

#### Versionadded
Added in version 3.3.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
