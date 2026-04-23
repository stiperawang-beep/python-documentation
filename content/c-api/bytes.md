<a id="bytesobjects"></a>

# Bytes Objects

These functions raise [`TypeError`](../library/exceptions.md#TypeError) when expecting a bytes parameter and
called with a non-bytes parameter.

<a id="index-0"></a>

### type PyBytesObject

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python bytes object.

### [PyTypeObject](type.md#c.PyTypeObject) PyBytes_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python bytes type; it
is the same object as [`bytes`](../library/stdtypes.md#bytes) in the Python layer.

### int PyBytes_Check([PyObject](structures.md#c.PyObject) \*o)

Return true if the object *o* is a bytes object or an instance of a subtype
of the bytes type.  This function always succeeds.

### int PyBytes_CheckExact([PyObject](structures.md#c.PyObject) \*o)

Return true if the object *o* is a bytes object, but not an instance of a
subtype of the bytes type.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyBytes_FromString(const char \*v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a new bytes object with a copy of the string *v* as value on success,
and `NULL` on failure.  The parameter *v* must not be `NULL`; it will not be
checked.

### [PyObject](structures.md#c.PyObject) \*PyBytes_FromStringAndSize(const char \*v, [Py_ssize_t](intro.md#c.Py_ssize_t) len)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a new bytes object with a copy of the string *v* as value and length
*len* on success, and `NULL` on failure.  If *v* is `NULL`, the contents of
the bytes object are uninitialized.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.15: Use the [`PyBytesWriter`](#c.PyBytesWriter) API instead of
`PyBytes_FromStringAndSize(NULL, len)`.

### [PyObject](structures.md#c.PyObject) \*PyBytes_FromFormat(const char \*format, ...)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Take a C `printf()`-style *format* string and a variable number of
arguments, calculate the size of the resulting Python bytes object and return
a bytes object with the values formatted into it.  The variable arguments
must be C types and must correspond exactly to the format characters in the
*format* string.  The following format characters are allowed:

<!-- % XXX: This should be exactly the same as the table in PyErr_Format. -->
<!-- % One should just refer to the other. -->

| Format Characters   | Type                                  | Comment                                                                                                                                                                                                           |
|---------------------|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `%%`                | *n/a*                                 | The literal % character.                                                                                                                                                                                          |
| `%c`                | int                                   | A single byte,<br/>represented as a C int.                                                                                                                                                                        |
| `%d`                | int                                   | Equivalent to<br/>`printf("%d")`. <sup>[1](#id9)</sup>                                                                                                                                                            |
| `%u`                | unsigned int                          | Equivalent to<br/>`printf("%u")`. <sup>[1](#id9)</sup>                                                                                                                                                            |
| `%ld`               | long                                  | Equivalent to<br/>`printf("%ld")`. <sup>[1](#id9)</sup>                                                                                                                                                           |
| `%lu`               | unsigned long                         | Equivalent to<br/>`printf("%lu")`. <sup>[1](#id9)</sup>                                                                                                                                                           |
| `%zd`               | [`Py_ssize_t`](intro.md#c.Py_ssize_t) | Equivalent to<br/>`printf("%zd")`. <sup>[1](#id9)</sup>                                                                                                                                                           |
| `%zu`               | size_t                                | Equivalent to<br/>`printf("%zu")`. <sup>[1](#id9)</sup>                                                                                                                                                           |
| `%i`                | int                                   | Equivalent to<br/>`printf("%i")`. <sup>[1](#id9)</sup>                                                                                                                                                            |
| `%x`                | int                                   | Equivalent to<br/>`printf("%x")`. <sup>[1](#id9)</sup>                                                                                                                                                            |
| `%s`                | const char\*                          | A null-terminated C character<br/>array.                                                                                                                                                                          |
| `%p`                | const void\*                          | The hex representation of a C<br/>pointer. Mostly equivalent to<br/>`printf("%p")` except that<br/>it is guaranteed to start with<br/>the literal `0x` regardless<br/>of what the platform’s<br/>`printf` yields. |

An unrecognized format character causes all the rest of the format string to be
copied as-is to the result object, and any extra arguments discarded.

* <a id='id9'>**[1]**</a> For integer specifiers (d, u, ld, lu, zd, zu, i, x): the 0-conversion flag has effect even when a precision is given.

### [PyObject](structures.md#c.PyObject) \*PyBytes_FromFormatV(const char \*format, va_list vargs)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Identical to [`PyBytes_FromFormat()`](#c.PyBytes_FromFormat) except that it takes exactly two
arguments.

### [PyObject](structures.md#c.PyObject) \*PyBytes_FromObject([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Return the bytes representation of object *o* that implements the buffer
protocol.

#### NOTE
If the object implements the buffer protocol, then the buffer
must not be mutated while the bytes object is being created.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyBytes_Size([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return the length of the bytes in bytes object *o*.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyBytes_GET_SIZE([PyObject](structures.md#c.PyObject) \*o)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Similar to [`PyBytes_Size()`](#c.PyBytes_Size), but without error checking.

### char \*PyBytes_AsString([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Return a pointer to the contents of *o*.  The pointer
refers to the internal buffer of *o*, which consists of `len(o) + 1`
bytes.  The last byte in the buffer is always null, regardless of
whether there are any other null bytes.  The data must not be
modified in any way, unless the object was just created using
`PyBytes_FromStringAndSize(NULL, size)`. It must not be deallocated.  If
*o* is not a bytes object at all, [`PyBytes_AsString()`](#c.PyBytes_AsString) returns `NULL`
and raises [`TypeError`](../library/exceptions.md#TypeError).

### char \*PyBytes_AS_STRING([PyObject](structures.md#c.PyObject) \*string)

 *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Similar to [`PyBytes_AsString()`](#c.PyBytes_AsString), but without error checking.

### int PyBytes_AsStringAndSize([PyObject](structures.md#c.PyObject) \*obj, char \*\*buffer, [Py_ssize_t](intro.md#c.Py_ssize_t) \*length)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Return the null-terminated contents of the object *obj*
through the output variables *buffer* and *length*.
Returns `0` on success.

If *length* is `NULL`, the bytes object
may not contain embedded null bytes;
if it does, the function returns `-1` and a [`ValueError`](../library/exceptions.md#ValueError) is raised.

The buffer refers to an internal buffer of *obj*, which includes an
additional null byte at the end (not counted in *length*).  The data
must not be modified in any way, unless the object was just created using
`PyBytes_FromStringAndSize(NULL, size)`.  It must not be deallocated.  If
*obj* is not a bytes object at all, [`PyBytes_AsStringAndSize()`](#c.PyBytes_AsStringAndSize)
returns `-1` and raises [`TypeError`](../library/exceptions.md#TypeError).

#### Versionchanged
Changed in version 3.5: Previously, [`TypeError`](../library/exceptions.md#TypeError) was raised when embedded null bytes were
encountered in the bytes object.

### void PyBytes_Concat([PyObject](structures.md#c.PyObject) \*\*bytes, [PyObject](structures.md#c.PyObject) \*newpart)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Create a new bytes object in  *\*bytes* containing the contents of *newpart*
appended to *bytes*; the caller will own the new reference.  The reference to
the old value of *bytes* will be stolen.  If the new object cannot be
created, the old reference to *bytes* will still be discarded and the value
of  *\*bytes* will be set to `NULL`; the appropriate exception will be set.

#### NOTE
If *newpart* implements the buffer protocol, then the buffer
must not be mutated while the new bytes object is being created.

### void PyBytes_ConcatAndDel([PyObject](structures.md#c.PyObject) \*\*bytes, [PyObject](structures.md#c.PyObject) \*newpart)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Create a new bytes object in  *\*bytes* containing the contents of *newpart*
appended to *bytes*.  This version releases the [strong reference](../glossary.md#term-strong-reference)
to *newpart* (i.e. decrements its reference count).

#### NOTE
If *newpart* implements the buffer protocol, then the buffer
must not be mutated while the new bytes object is being created.

### [PyObject](structures.md#c.PyObject) \*PyBytes_Join([PyObject](structures.md#c.PyObject) \*sep, [PyObject](structures.md#c.PyObject) \*iterable)

 *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Similar to `sep.join(iterable)` in Python.

*sep* must be Python [`bytes`](../library/stdtypes.md#bytes) object.
(Note that [`PyUnicode_Join()`](unicode.md#c.PyUnicode_Join) accepts `NULL` separator and treats
it as a space, whereas [`PyBytes_Join()`](#c.PyBytes_Join) doesn’t accept `NULL`
separator.)

*iterable* must be an iterable object yielding objects that implement the
[buffer protocol](buffer.md#bufferobjects).

On success, return a new [`bytes`](../library/stdtypes.md#bytes) object.
On error, set an exception and return `NULL`.

#### Versionadded
Added in version 3.14.

#### NOTE
If *iterable* objects implement the buffer protocol, then the buffers
must not be mutated while the new bytes object is being created.

### int \_PyBytes_Resize([PyObject](structures.md#c.PyObject) \*\*bytes, [Py_ssize_t](intro.md#c.Py_ssize_t) newsize)

 *Thread safety: [Safe to call without external synchronization on distinct objects](../library/threadsafety.md#threadsafety-level-distinct).*

Resize a bytes object. *newsize* will be the new length of the bytes object.
You can think of it as creating a new bytes object and destroying the old
one, only more efficiently.
Pass the address of an
existing bytes object as an lvalue (it may be written into), and the new size
desired.  On success,  *\*bytes* holds the resized bytes object and `0` is
returned; the address in  *\*bytes* may differ from its input value.  If the
reallocation fails, the original bytes object at  *\*bytes* is deallocated,
 *\*bytes* is set to `NULL`, [`MemoryError`](../library/exceptions.md#MemoryError) is set, and `-1` is
returned.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.15: Use the [`PyBytesWriter`](#c.PyBytesWriter) API instead.

### [PyObject](structures.md#c.PyObject) \*PyBytes_Repr([PyObject](structures.md#c.PyObject) \*bytes, int smartquotes)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Get the string representation of *bytes*. This function is currently used to
implement `bytes.__repr__()` in Python.

This function does not do type checking; it is undefined behavior to pass
*bytes* as a non-bytes object or `NULL`.

If *smartquotes* is true, the representation will use a double-quoted string
instead of single-quoted string when single-quotes are present in *bytes*.
For example, the byte string `'Python'` would be represented as
`b"'Python'"` when *smartquotes* is true, or `b'\'Python\''` when it is
false.

On success, this function returns a [strong reference](../glossary.md#term-strong-reference) to a
[`str`](../library/stdtypes.md#str) object containing the representation. On failure, this
returns `NULL` with an exception set.

### [PyObject](structures.md#c.PyObject) \*PyBytes_DecodeEscape(const char \*s, [Py_ssize_t](intro.md#c.Py_ssize_t) len, const char \*errors, [Py_ssize_t](intro.md#c.Py_ssize_t) unicode, const char \*recode_encoding)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Unescape a backslash-escaped string *s*. *s* must not be `NULL`.
*len* must be the size of *s*.

*errors* must be one of `"strict"`, `"replace"`, or `"ignore"`. If
*errors* is `NULL`, then `"strict"` is used by default.

On success, this function returns a [strong reference](../glossary.md#term-strong-reference) to a Python
[`bytes`](../library/stdtypes.md#bytes) object containing the unescaped string. On failure, this
function returns `NULL` with an exception set.

#### Versionchanged
Changed in version 3.9: *unicode* and *recode_encoding* are now unused.

<a id="pybyteswriter"></a>

# PyBytesWriter

The [`PyBytesWriter`](#c.PyBytesWriter) API can be used to create a Python [`bytes`](../library/stdtypes.md#bytes)
object.

#### Versionadded
Added in version 3.15.

### type PyBytesWriter

A bytes writer instance.

The API is **not thread safe**: a writer should only be used by a single
thread at the same time.

The instance must be destroyed by [`PyBytesWriter_Finish()`](#c.PyBytesWriter_Finish) on
success, or [`PyBytesWriter_Discard()`](#c.PyBytesWriter_Discard) on error.

## Create, Finish, Discard

### [PyBytesWriter](#c.PyBytesWriter) \*PyBytesWriter_Create([Py_ssize_t](intro.md#c.Py_ssize_t) size)

Create a [`PyBytesWriter`](#c.PyBytesWriter) to write *size* bytes.

If *size* is greater than zero, allocate *size* bytes, and set the
writer size to *size*. The caller is responsible to write *size*
bytes using [`PyBytesWriter_GetData()`](#c.PyBytesWriter_GetData).
This function does not overallocate.

On error, set an exception and return `NULL`.

*size* must be positive or zero.

### [PyObject](structures.md#c.PyObject) \*PyBytesWriter_Finish([PyBytesWriter](#c.PyBytesWriter) \*writer)

Finish a [`PyBytesWriter`](#c.PyBytesWriter) created by
[`PyBytesWriter_Create()`](#c.PyBytesWriter_Create).

On success, return a Python [`bytes`](../library/stdtypes.md#bytes) object.
On error, set an exception and return `NULL`.

The writer instance is invalid after the call in any case.
No API can be called on the writer after [`PyBytesWriter_Finish()`](#c.PyBytesWriter_Finish).

### [PyObject](structures.md#c.PyObject) \*PyBytesWriter_FinishWithSize([PyBytesWriter](#c.PyBytesWriter) \*writer, [Py_ssize_t](intro.md#c.Py_ssize_t) size)

Similar to [`PyBytesWriter_Finish()`](#c.PyBytesWriter_Finish), but resize the writer
to *size* bytes before creating the [`bytes`](../library/stdtypes.md#bytes) object.

### [PyObject](structures.md#c.PyObject) \*PyBytesWriter_FinishWithPointer([PyBytesWriter](#c.PyBytesWriter) \*writer, void \*buf)

Similar to [`PyBytesWriter_Finish()`](#c.PyBytesWriter_Finish), but resize the writer
using *buf* pointer before creating the [`bytes`](../library/stdtypes.md#bytes) object.

Set an exception and return `NULL` if *buf* pointer is outside the
internal buffer bounds.

Function pseudo-code:

```c
Py_ssize_t size = (char*)buf - (char*)PyBytesWriter_GetData(writer);
return PyBytesWriter_FinishWithSize(writer, size);
```

### void PyBytesWriter_Discard([PyBytesWriter](#c.PyBytesWriter) \*writer)

Discard a [`PyBytesWriter`](#c.PyBytesWriter) created by [`PyBytesWriter_Create()`](#c.PyBytesWriter_Create).

Do nothing if *writer* is `NULL`.

The writer instance is invalid after the call.
No API can be called on the writer after [`PyBytesWriter_Discard()`](#c.PyBytesWriter_Discard).

## High-level API

### int PyBytesWriter_WriteBytes([PyBytesWriter](#c.PyBytesWriter) \*writer, const void \*bytes, [Py_ssize_t](intro.md#c.Py_ssize_t) size)

Grow the *writer* internal buffer by *size* bytes,
write *size* bytes of *bytes* at the *writer* end,
and add *size* to the *writer* size.

If *size* is equal to `-1`, call `strlen(bytes)` to get the
string length.

On success, return `0`.
On error, set an exception and return `-1`.

### int PyBytesWriter_Format([PyBytesWriter](#c.PyBytesWriter) \*writer, const char \*format, ...)

Similar to [`PyBytes_FromFormat()`](#c.PyBytes_FromFormat), but write the output directly at
the writer end. Grow the writer internal buffer on demand. Then add the
written size to the writer size.

On success, return `0`.
On error, set an exception and return `-1`.

## Getters

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyBytesWriter_GetSize([PyBytesWriter](#c.PyBytesWriter) \*writer)

Get the writer size.

The function cannot fail.

### void \*PyBytesWriter_GetData([PyBytesWriter](#c.PyBytesWriter) \*writer)

Get the writer data: start of the internal buffer.

The pointer is valid until [`PyBytesWriter_Finish()`](#c.PyBytesWriter_Finish) or
[`PyBytesWriter_Discard()`](#c.PyBytesWriter_Discard) is called on *writer*.

The function cannot fail.

## Low-level API

### int PyBytesWriter_Resize([PyBytesWriter](#c.PyBytesWriter) \*writer, [Py_ssize_t](intro.md#c.Py_ssize_t) size)

Resize the writer to *size* bytes. It can be used to enlarge or to
shrink the writer.
This function typically overallocates to achieve amortized performance when
resizing multiple times.

Newly allocated bytes are left uninitialized.

On success, return `0`.
On error, set an exception and return `-1`.

*size* must be positive or zero.

### int PyBytesWriter_Grow([PyBytesWriter](#c.PyBytesWriter) \*writer, [Py_ssize_t](intro.md#c.Py_ssize_t) grow)

Resize the writer by adding *grow* bytes to the current writer size.
This function typically overallocates to achieve amortized performance when
resizing multiple times.

Newly allocated bytes are left uninitialized.

On success, return `0`.
On error, set an exception and return `-1`.

*size* can be negative to shrink the writer.

### void \*PyBytesWriter_GrowAndUpdatePointer([PyBytesWriter](#c.PyBytesWriter) \*writer, [Py_ssize_t](intro.md#c.Py_ssize_t) size, void \*buf)

Similar to [`PyBytesWriter_Grow()`](#c.PyBytesWriter_Grow), but update also the *buf*
pointer.

The *buf* pointer is moved if the internal buffer is moved in memory.
The *buf* relative position within the internal buffer is left
unchanged.

On error, set an exception and return `NULL`.

*buf* must not be `NULL`.

Function pseudo-code:

```c
Py_ssize_t pos = (char*)buf - (char*)PyBytesWriter_GetData(writer);
if (PyBytesWriter_Grow(writer, size) < 0) {
    return NULL;
}
return (char*)PyBytesWriter_GetData(writer) + pos;
```

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
