# `base64` — Base16, Base32, Base64, Base85 Data Encodings

**Source code:** [Lib/base64.py](https://github.com/python/cpython/tree/main/Lib/base64.py)

<a id="index-0"></a>

---

This module provides functions for encoding binary data to printable
ASCII characters and decoding such encodings back to binary data.
This includes the [encodings specified in](#base64-rfc-4648)
[**RFC 4648**](https://datatracker.ietf.org/doc/html/rfc4648.html) (Base64, Base32 and Base16)
and the non-standard [Base85 encodings](#base64-base-85).

There are two interfaces provided by this module.  The modern interface
supports encoding [bytes-like objects](../glossary.md#term-bytes-like-object) to ASCII
[`bytes`](stdtypes.md#bytes), and decoding [bytes-like objects](../glossary.md#term-bytes-like-object) or
strings containing ASCII to [`bytes`](stdtypes.md#bytes).  Both base-64 alphabets
defined in [**RFC 4648**](https://datatracker.ietf.org/doc/html/rfc4648.html) (normal, and URL- and filesystem-safe) are supported.

The [legacy interface](#base64-legacy) does not support decoding from strings, but it does
provide functions for encoding and decoding to and from [file objects](../glossary.md#term-file-object).  It only supports the Base64 standard alphabet, and it adds
newlines every 76 characters as per [**RFC 2045**](https://datatracker.ietf.org/doc/html/rfc2045.html).  Note that if you are looking
for [**RFC 2045**](https://datatracker.ietf.org/doc/html/rfc2045.html) support you probably want to be looking at the [`email`](email.md#module-email)
package instead.

#### Versionchanged
Changed in version 3.3: ASCII-only Unicode strings are now accepted by the decoding functions of
the modern interface.

#### Versionchanged
Changed in version 3.4: Any [bytes-like objects](../glossary.md#term-bytes-like-object) are now accepted by all
encoding and decoding functions in this module.  Ascii85/Base85 support added.

<a id="base64-rfc-4648"></a>

## RFC 4648 Encodings

The [**RFC 4648**](https://datatracker.ietf.org/doc/html/rfc4648.html) encodings are suitable for encoding binary data so that it can be
safely sent by email, used as parts of URLs, or included as part of an HTTP
POST request.

### base64.b64encode(s, altchars=None, , padded=True, wrapcol=0)

Encode the [bytes-like object](../glossary.md#term-bytes-like-object) *s* using Base64 and return the encoded
[`bytes`](stdtypes.md#bytes).

Optional *altchars* must be a [bytes-like object](../glossary.md#term-bytes-like-object) of length 2 which
specifies an alternative alphabet for the `+` and `/` characters.
This allows an application to e.g. generate URL or filesystem safe Base64
strings.  The default is `None`, for which the standard Base64 alphabet is used.

If *padded* is true (default), pad the encoded data with the ‘=’
character to a size multiple of 4.
If *padded* is false, do not add the pad characters.

If *wrapcol* is non-zero, insert a newline (`b'\n'`) character
after at most every *wrapcol* characters.
If *wrapcol* is zero (default), do not insert any newlines.

#### Versionchanged
Changed in version 3.15: Added the *padded* and *wrapcol* parameters.

### base64.b64decode(s, altchars=None, validate=False, , padded=True)

### base64.b64decode(s, altchars=None, validate=True, , ignorechars, padded=True)

Decode the Base64 encoded [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string
*s* and return the decoded [`bytes`](stdtypes.md#bytes).

Optional *altchars* must be a [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string
of length 2 which specifies the alternative alphabet used instead of the
`+` and `/` characters.

If *padded* is true, the last group of 4 base 64 alphabet characters must
be padded with the ‘=’ character.
If *padded* is false, padding is neither required nor recognized:
the ‘=’ character is not treated as padding but as a non-alphabet
character, which means it is silently discarded when *validate* is false,
or causes an [`Error`](binascii.md#binascii.Error) when *validate* is true unless
b’=’ is included in *ignorechars*.

A [`binascii.Error`](binascii.md#binascii.Error) exception is raised
if *s* is incorrectly padded.

If *ignorechars* is specified, it should be a [bytes-like object](../glossary.md#term-bytes-like-object)
containing characters to ignore from the input when *validate* is true.
If *ignorechars* contains the pad character `'='`,  the pad characters
presented before the end of the encoded data and the excess pad characters
will be ignored.
The default value of *validate* is `True` if *ignorechars* is specified,
`False` otherwise.

If *validate* is false, characters that are neither
in the normal base-64 alphabet nor (if *ignorechars* is not specified)
the alternative alphabet are
discarded prior to the padding check, but the `+` and `/` characters
keep their meaning if they are not in *altchars* (they will be discarded
in future Python versions).

If *validate* is true, these non-alphabet characters in the input
result in a [`binascii.Error`](binascii.md#binascii.Error).

For more information about the strict base64 check, see [`binascii.a2b_base64()`](binascii.md#binascii.a2b_base64)

#### Versionchanged
Changed in version 3.15: Added the *ignorechars* and *padded* parameters.

#### Deprecated
Deprecated since version 3.15: Accepting the `+` and `/` characters with an alternative alphabet
is now deprecated.

### base64.standard_b64encode(s)

Encode [bytes-like object](../glossary.md#term-bytes-like-object) *s* using the standard Base64 alphabet
and return the encoded [`bytes`](stdtypes.md#bytes).

### base64.standard_b64decode(s)

Decode [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string *s* using the standard
Base64 alphabet and return the decoded [`bytes`](stdtypes.md#bytes).

### base64.urlsafe_b64encode(s, , padded=True)

Encode [bytes-like object](../glossary.md#term-bytes-like-object) *s* using the
URL- and filesystem-safe alphabet, which
substitutes `-` instead of `+` and `_` instead of `/` in the
standard Base64 alphabet, and return the encoded [`bytes`](stdtypes.md#bytes).  The result
can still contain `=` if *padded* is true (default).

#### Versionchanged
Changed in version 3.15: Added the *padded* parameter.

### base64.urlsafe_b64decode(s, , padded=False)

Decode [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string *s*
using the URL- and filesystem-safe
alphabet, which substitutes `-` instead of `+` and `_` instead of
`/` in the standard Base64 alphabet, and return the decoded
[`bytes`](stdtypes.md#bytes).

#### Versionchanged
Changed in version 3.15: Added the *padded* parameter.
Padding of input is no longer required by default.

#### Deprecated
Deprecated since version 3.15: Accepting the `+` and `/` characters is now deprecated.

### base64.b32encode(s, , padded=True, wrapcol=0)

Encode the [bytes-like object](../glossary.md#term-bytes-like-object) *s* using Base32 and return the
encoded [`bytes`](stdtypes.md#bytes).

If *padded* is true (default), pad the encoded data with the ‘=’
character to a size multiple of 8.
If *padded* is false, do not add the pad characters.

If *wrapcol* is non-zero, insert a newline (`b'\n'`) character
after at most every *wrapcol* characters.
If *wrapcol* is zero (default), do not add any newlines.

#### Versionchanged
Changed in version 3.15: Added the *padded* and *wrapcol* parameters.

### base64.b32decode(s, casefold=False, map01=None, , padded=True, ignorechars=b'')

Decode the Base32 encoded [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string *s* and
return the decoded [`bytes`](stdtypes.md#bytes).

Optional *casefold* is a flag specifying
whether a lowercase alphabet is acceptable as input.  For security purposes,
the default is `False`.

[**RFC 4648**](https://datatracker.ietf.org/doc/html/rfc4648.html) allows for optional mapping of the digit 0 (zero) to the letter O
(oh), and for optional mapping of the digit 1 (one) to either the letter I (eye)
or letter L (el).  The optional argument *map01* when not `None`, specifies
which letter the digit 1 should be mapped to (when *map01* is not `None`, the
digit 0 is always mapped to the letter O).  For security purposes the default is
`None`, so that 0 and 1 are not allowed in the input.

If *padded* is true, the last group of 8 base 32 alphabet characters must
be padded with the ‘=’ character.
If *padded* is false, padding is neither required nor recognized:
the ‘=’ character is not treated as padding but as a non-alphabet
character, which means it raises an [`Error`](binascii.md#binascii.Error) unless
b’=’ is included in *ignorechars*.

*ignorechars* should be a [bytes-like object](../glossary.md#term-bytes-like-object) containing characters
to ignore from the input.

A [`binascii.Error`](binascii.md#binascii.Error) is raised if *s* is
incorrectly padded or if there are non-alphabet characters present in the
input.

#### Versionchanged
Changed in version 3.15: Added the *ignorechars* and *padded* parameters.

### base64.b32hexencode(s, , padded=True, wrapcol=0)

Similar to [`b32encode()`](#base64.b32encode) but uses the Extended Hex Alphabet, as defined in
[**RFC 4648**](https://datatracker.ietf.org/doc/html/rfc4648.html).

#### Versionadded
Added in version 3.10.

#### Versionchanged
Changed in version 3.15: Added the *padded* and *wrapcol* parameters.

### base64.b32hexdecode(s, casefold=False, , padded=True, ignorechars=b'')

Similar to [`b32decode()`](#base64.b32decode) but uses the Extended Hex Alphabet, as defined in
[**RFC 4648**](https://datatracker.ietf.org/doc/html/rfc4648.html).

This version does not allow the digit 0 (zero) to the letter O (oh) and digit
1 (one) to either the letter I (eye) or letter L (el) mappings, all these
characters are included in the Extended Hex Alphabet and are not
interchangeable.

#### Versionadded
Added in version 3.10.

#### Versionchanged
Changed in version 3.15: Added the *ignorechars* and *padded* parameters.

### base64.b16encode(s, , wrapcol=0)

Encode the [bytes-like object](../glossary.md#term-bytes-like-object) *s* using Base16 and return the
encoded [`bytes`](stdtypes.md#bytes).

If *wrapcol* is non-zero, insert a newline (`b'\n'`) character
after at most every *wrapcol* characters.
If *wrapcol* is zero (default), do not add any newlines.

#### Versionchanged
Changed in version 3.15: Added the *wrapcol* parameter.

### base64.b16decode(s, casefold=False, , ignorechars=b'')

Decode the Base16 encoded [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string *s* and
return the decoded [`bytes`](stdtypes.md#bytes).

Optional *casefold* is a flag specifying whether a
lowercase alphabet is acceptable as input.  For security purposes, the default
is `False`.

*ignorechars* should be a [bytes-like object](../glossary.md#term-bytes-like-object) containing characters
to ignore from the input.

A [`binascii.Error`](binascii.md#binascii.Error) is raised if *s* is
incorrectly padded or if there are non-alphabet characters present in the
input.

#### Versionchanged
Changed in version 3.15: Added the *ignorechars* parameter.

<a id="base64-base-85"></a>

## Base85 Encodings

Base85 encoding is not formally specified but rather a de facto standard,
thus different systems perform the encoding differently.

The [`a85encode()`](#base64.a85encode) and [`b85encode()`](#base64.b85encode) functions in this module are two implementations of
the de facto standard. You should call the function with the Base85
implementation used by the software you intend to work with.

The two functions present in this module differ in how they handle the following:

* Whether to include enclosing `<~` and `~>` markers
* Whether to include newline characters
* The set of ASCII characters used for encoding
* Handling of null bytes

Refer to the documentation of the individual functions for more information.

### base64.a85encode(b, , foldspaces=False, wrapcol=0, pad=False, adobe=False)

Encode the [bytes-like object](../glossary.md#term-bytes-like-object) *b* using Ascii85 and return the
encoded [`bytes`](stdtypes.md#bytes).

*foldspaces* is an optional flag that uses the special short sequence ‘y’
instead of 4 consecutive spaces (ASCII 0x20) as supported by ‘btoa’. This
feature is not supported by the “standard” Ascii85 encoding.

If *wrapcol* is non-zero, insert a newline (`b'\n'`) character
after at most every *wrapcol* characters.
If *wrapcol* is zero (default), do not insert any newlines.

If *pad* is true, the input is padded with `b'\0'` so its length is a
multiple of 4 bytes before encoding.
Note that the `btoa` implementation always pads.

*adobe* controls whether the encoded byte sequence is framed with `<~`
and `~>`, which is used by the Adobe implementation.

#### Versionadded
Added in version 3.4.

### base64.a85decode(b, , foldspaces=False, adobe=False, ignorechars=b' \\t\\n\\r\\x0b')

Decode the Ascii85 encoded [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string *b* and
return the decoded [`bytes`](stdtypes.md#bytes).

*foldspaces* is a flag that specifies whether the ‘y’ short sequence
should be accepted as shorthand for 4 consecutive spaces (ASCII 0x20).
This feature is not supported by the “standard” Ascii85 encoding.

*adobe* controls whether the input sequence is in Adobe Ascii85 format
(i.e. is framed with <~ and ~>).

*ignorechars* should be a [bytes-like object](../glossary.md#term-bytes-like-object) containing characters
to ignore from the input.
This should only contain whitespace characters, and by
default contains all whitespace characters in ASCII.

#### Versionadded
Added in version 3.4.

### base64.b85encode(b, pad=False, , wrapcol=0)

Encode the [bytes-like object](../glossary.md#term-bytes-like-object) *b* using base85 (as used in e.g.
git-style binary diffs) and return the encoded [`bytes`](stdtypes.md#bytes).

If *pad* is true, the input is padded with `b'\0'` so its length is a
multiple of 4 bytes before encoding.

If *wrapcol* is non-zero, insert a newline (`b'\n'`) character
after at most every *wrapcol* characters.
If *wrapcol* is zero (default), do not add any newlines.

#### Versionadded
Added in version 3.4.

#### Versionchanged
Changed in version 3.15: Added the *wrapcol* parameter.

### base64.b85decode(b, , ignorechars=b'')

Decode the base85-encoded [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string *b* and
return the decoded [`bytes`](stdtypes.md#bytes).  Padding is implicitly removed, if
necessary.

*ignorechars* should be a [bytes-like object](../glossary.md#term-bytes-like-object) containing characters
to ignore from the input.

#### Versionadded
Added in version 3.4.

#### Versionchanged
Changed in version 3.15: Added the *ignorechars* parameter.

### base64.z85encode(s, pad=False, , wrapcol=0)

Encode the [bytes-like object](../glossary.md#term-bytes-like-object) *s* using Z85 (as used in ZeroMQ)
and return the encoded [`bytes`](stdtypes.md#bytes).  See [Z85  specification](https://rfc.zeromq.org/spec/32/) for more information.

If *pad* is true, the input is padded with `b'\0'` so its length is a
multiple of 4 bytes before encoding.

If *wrapcol* is non-zero, insert a newline (`b'\n'`) character
after at most every *wrapcol* characters.
If *wrapcol* is zero (default), do not add any newlines.

#### Versionadded
Added in version 3.13.

#### Versionchanged
Changed in version 3.15: The *pad* parameter was added.

#### Versionchanged
Changed in version 3.15: Added the *wrapcol* parameter.

### base64.z85decode(s, , ignorechars=b'')

Decode the Z85-encoded [bytes-like object](../glossary.md#term-bytes-like-object) or ASCII string *s* and
return the decoded [`bytes`](stdtypes.md#bytes).  See [Z85  specification](https://rfc.zeromq.org/spec/32/) for more information.

*ignorechars* should be a [bytes-like object](../glossary.md#term-bytes-like-object) containing characters
to ignore from the input.

#### Versionadded
Added in version 3.13.

#### Versionchanged
Changed in version 3.15: Added the *ignorechars* parameter.

<a id="base64-legacy"></a>

## Legacy Interface

### base64.decode(input, output)

Decode the contents of the binary *input* file and write the resulting binary
data to the *output* file. *input* and *output* must be [file objects](../glossary.md#term-file-object). *input* will be read until `input.readline()` returns an
empty bytes object.

### base64.decodebytes(s)

Decode the [bytes-like object](../glossary.md#term-bytes-like-object) *s*, which must contain one or more
lines of base64 encoded data, and return the decoded [`bytes`](stdtypes.md#bytes).

#### Versionadded
Added in version 3.1.

### base64.encode(input, output)

Encode the contents of the binary *input* file and write the resulting base64
encoded data to the *output* file. *input* and *output* must be [file
objects](../glossary.md#term-file-object). *input* will be read until `input.read()` returns
an empty bytes object. [`encode()`](#base64.encode) inserts a newline character (`b'\n'`)
after every 76 bytes of the output, as well as ensuring that the output
always ends with a newline, as per [**RFC 2045**](https://datatracker.ietf.org/doc/html/rfc2045.html) (MIME).

### base64.encodebytes(s)

Encode the [bytes-like object](../glossary.md#term-bytes-like-object) *s*, which can contain arbitrary binary
data, and return [`bytes`](stdtypes.md#bytes) containing the base64-encoded data, with newlines
(`b'\n'`) inserted after every 76 bytes of output, and ensuring that
there is a trailing newline, as per [**RFC 2045**](https://datatracker.ietf.org/doc/html/rfc2045.html) (MIME).

#### Versionadded
Added in version 3.1.

An example usage of the module:

```pycon
>>> import base64
>>> encoded = base64.b64encode(b'data to be encoded')
>>> encoded
b'ZGF0YSB0byBiZSBlbmNvZGVk'
>>> data = base64.b64decode(encoded)
>>> data
b'data to be encoded'
```

<a id="base64-security"></a>

## Security Considerations

A new security considerations section was added to [**RFC 4648**](https://datatracker.ietf.org/doc/html/rfc4648.html) (section 12); it’s
recommended to review the security section for any code deployed to production.

#### SEE ALSO
Module [`binascii`](binascii.md#module-binascii)
: Support module containing ASCII-to-binary and binary-to-ASCII conversions.

[**RFC 1521**](https://datatracker.ietf.org/doc/html/rfc1521.html) - MIME (Multipurpose Internet Mail Extensions) Part One: Mechanisms for Specifying and Describing the Format of Internet Message Bodies
: Section 5.2, “Base64 Content-Transfer-Encoding,” provides the definition of the
  base64 encoding.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
