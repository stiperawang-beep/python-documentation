<a id="longobjects"></a>

# Integer Objects

<a id="index-0"></a>

All integers are implemented as “long” integer objects of arbitrary size.

On error, most `PyLong_As*` APIs return `(return type)-1` which cannot be
distinguished from a number.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

### type PyLongObject

 *Part of the [Stable ABI](stable.md#stable) (as an opaque struct).*

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python integer object.

### [PyTypeObject](type.md#c.PyTypeObject) PyLong_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python integer type.
This is the same object as [`int`](../library/functions.md#int) in the Python layer.

### int PyLong_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if its argument is a [`PyLongObject`](#c.PyLongObject) or a subtype of
[`PyLongObject`](#c.PyLongObject).  This function always succeeds.

### int PyLong_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if its argument is a [`PyLongObject`](#c.PyLongObject), but not a subtype of
[`PyLongObject`](#c.PyLongObject).  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromLong(long v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyLongObject`](#c.PyLongObject) object from *v*, or `NULL` on failure.

**CPython implementation detail:** CPython keeps an array of integer objects for all integers
between `-5` and `1024`.  When you create an int in that range
you actually just get back a reference to the existing object.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromUnsignedLong(unsigned long v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyLongObject`](#c.PyLongObject) object from a C , or
`NULL` on failure.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromSsize_t([Py_ssize_t](intro.md#c.Py_ssize_t) v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyLongObject`](#c.PyLongObject) object from a C [`Py_ssize_t`](intro.md#c.Py_ssize_t), or
`NULL` on failure.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromSize_t(size_t v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyLongObject`](#c.PyLongObject) object from a C `size_t`, or
`NULL` on failure.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromLongLong(long long v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyLongObject`](#c.PyLongObject) object from a C , or `NULL`
on failure.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromInt32(int32_t value)

### [PyObject](structures.md#c.PyObject) \*PyLong_FromInt64(int64_t value)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Return a new [`PyLongObject`](#c.PyLongObject) object from a signed C
 or , or `NULL`
with an exception set on failure.

#### Versionadded
Added in version 3.14.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromUnsignedLongLong(unsigned long long v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyLongObject`](#c.PyLongObject) object from a C ,
or `NULL` on failure.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromUInt32(uint32_t value)

### [PyObject](structures.md#c.PyObject) \*PyLong_FromUInt64(uint64_t value)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Return a new [`PyLongObject`](#c.PyLongObject) object from an unsigned C
 or , or `NULL`
with an exception set on failure.

#### Versionadded
Added in version 3.14.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromDouble(double v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyLongObject`](#c.PyLongObject) object from the integer part of *v*, or
`NULL` on failure.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromString(const char \*str, char \*\*pend, int base)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyLongObject`](#c.PyLongObject) based on the string value in *str*, which
is interpreted according to the radix in *base*, or `NULL` on failure.  If
*pend* is non-`NULL`,  *\*pend* will point to the end of *str* on success or
to the first character that could not be processed on error.  If *base* is `0`,
*str* is interpreted using the [Integer literals](../reference/lexical_analysis.md#integers) definition; in this case, leading
zeros in a non-zero decimal number raises a [`ValueError`](../library/exceptions.md#ValueError).  If *base* is not
`0`, it must be between `2` and `36`, inclusive.  Leading and trailing
whitespace and single underscores after a base specifier and between digits are
ignored.  If there are no digits or *str* is not NULL-terminated following the
digits and trailing whitespace, [`ValueError`](../library/exceptions.md#ValueError) will be raised.

#### SEE ALSO
[`PyLong_AsNativeBytes()`](#c.PyLong_AsNativeBytes) and
[`PyLong_FromNativeBytes()`](#c.PyLong_FromNativeBytes) functions can be used to convert
a [`PyLongObject`](#c.PyLongObject) to/from an array of bytes in base `256`.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromUnicodeObject([PyObject](structures.md#c.PyObject) \*u, int base)

*Return value: New reference.*

Convert a sequence of Unicode digits in the string *u* to a Python integer
value.

#### Versionadded
Added in version 3.3.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromVoidPtr(void \*p)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Create a Python integer from the pointer *p*. The pointer value can be
retrieved from the resulting value using [`PyLong_AsVoidPtr()`](#c.PyLong_AsVoidPtr).

### [PyObject](structures.md#c.PyObject) \*PyLong_FromNativeBytes(const void \*buffer, size_t n_bytes, int flags)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Create a Python integer from the value contained in the first *n_bytes* of
*buffer*, interpreted as a two’s-complement signed number.

*flags* are as for [`PyLong_AsNativeBytes()`](#c.PyLong_AsNativeBytes). Passing `-1` will select
the native endian that CPython was compiled with and assume that the
most-significant bit is a sign bit. Passing
`Py_ASNATIVEBYTES_UNSIGNED_BUFFER` will produce the same result as calling
[`PyLong_FromUnsignedNativeBytes()`](#c.PyLong_FromUnsignedNativeBytes). Other flags are ignored.

#### Versionadded
Added in version 3.13.

### [PyObject](structures.md#c.PyObject) \*PyLong_FromUnsignedNativeBytes(const void \*buffer, size_t n_bytes, int flags)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Create a Python integer from the value contained in the first *n_bytes* of
*buffer*, interpreted as an unsigned number.

*flags* are as for [`PyLong_AsNativeBytes()`](#c.PyLong_AsNativeBytes). Passing `-1` will select
the native endian that CPython was compiled with and assume that the
most-significant bit is not a sign bit. Flags other than endian are ignored.

#### Versionadded
Added in version 3.13.

### PyLong_FromPid(pid)

Macro for creating a Python integer from a process identifier.

This can be defined as an alias to [`PyLong_FromLong()`](#c.PyLong_FromLong) or
[`PyLong_FromLongLong()`](#c.PyLong_FromLongLong), depending on the size of the system’s
PID type.

#### Versionadded
Added in version 3.2.

### long PyLong_AsLong([PyObject](structures.md#c.PyObject) \*obj)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-1"></a>

Return a C  representation of *obj*.  If *obj* is not an
instance of [`PyLongObject`](#c.PyLongObject), first call its [`__index__()`](../reference/datamodel.md#object.__index__) method
(if present) to convert it to a [`PyLongObject`](#c.PyLongObject).

Raise [`OverflowError`](../library/exceptions.md#OverflowError) if the value of *obj* is out of range for a
.

Returns `-1` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

#### Versionchanged
Changed in version 3.8: Use [`__index__()`](../reference/datamodel.md#object.__index__) if available.

#### Versionchanged
Changed in version 3.10: This function will no longer use [`__int__()`](../reference/datamodel.md#object.__int__).

### long PyLong_AS_LONG([PyObject](structures.md#c.PyObject) \*obj)

Exactly equivalent to the preferred `PyLong_AsLong`. In particular,
it can fail with [`OverflowError`](../library/exceptions.md#OverflowError) or another exception.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.14.

### int PyLong_AsInt([PyObject](structures.md#c.PyObject) \*obj)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Similar to [`PyLong_AsLong()`](#c.PyLong_AsLong), but store the result in a C
 instead of a C .

#### Versionadded
Added in version 3.13.

### long PyLong_AsLongAndOverflow([PyObject](structures.md#c.PyObject) \*obj, int \*overflow)

 *Part of the [Stable ABI](stable.md#stable).*

Return a C  representation of *obj*.  If *obj* is not an
instance of [`PyLongObject`](#c.PyLongObject), first call its [`__index__()`](../reference/datamodel.md#object.__index__)
method (if present) to convert it to a [`PyLongObject`](#c.PyLongObject).

If the value of *obj* is greater than `LONG_MAX` or less than
`LONG_MIN`, set  *\*overflow* to `1` or `-1`, respectively, and
return `-1`; otherwise, set  *\*overflow* to `0`.  If any other exception
occurs set  *\*overflow* to `0` and return `-1` as usual.

Returns `-1` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

#### Versionchanged
Changed in version 3.8: Use [`__index__()`](../reference/datamodel.md#object.__index__) if available.

#### Versionchanged
Changed in version 3.10: This function will no longer use [`__int__()`](../reference/datamodel.md#object.__int__).

### long long PyLong_AsLongLong([PyObject](structures.md#c.PyObject) \*obj)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-2"></a>

Return a C  representation of *obj*.  If *obj* is not an
instance of [`PyLongObject`](#c.PyLongObject), first call its [`__index__()`](../reference/datamodel.md#object.__index__) method
(if present) to convert it to a [`PyLongObject`](#c.PyLongObject).

Raise [`OverflowError`](../library/exceptions.md#OverflowError) if the value of *obj* is out of range for a
.

Returns `-1` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

#### Versionchanged
Changed in version 3.8: Use [`__index__()`](../reference/datamodel.md#object.__index__) if available.

#### Versionchanged
Changed in version 3.10: This function will no longer use [`__int__()`](../reference/datamodel.md#object.__int__).

### long long PyLong_AsLongLongAndOverflow([PyObject](structures.md#c.PyObject) \*obj, int \*overflow)

 *Part of the [Stable ABI](stable.md#stable).*

Return a C  representation of *obj*.  If *obj* is not an
instance of [`PyLongObject`](#c.PyLongObject), first call its [`__index__()`](../reference/datamodel.md#object.__index__) method
(if present) to convert it to a [`PyLongObject`](#c.PyLongObject).

If the value of *obj* is greater than `LLONG_MAX` or less than
`LLONG_MIN`, set  *\*overflow* to `1` or `-1`, respectively,
and return `-1`; otherwise, set  *\*overflow* to `0`.  If any other
exception occurs set  *\*overflow* to `0` and return `-1` as usual.

Returns `-1` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

#### Versionadded
Added in version 3.2.

#### Versionchanged
Changed in version 3.8: Use [`__index__()`](../reference/datamodel.md#object.__index__) if available.

#### Versionchanged
Changed in version 3.10: This function will no longer use [`__int__()`](../reference/datamodel.md#object.__int__).

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyLong_AsSsize_t([PyObject](structures.md#c.PyObject) \*pylong)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-3"></a>

Return a C [`Py_ssize_t`](intro.md#c.Py_ssize_t) representation of *pylong*.  *pylong* must
be an instance of [`PyLongObject`](#c.PyLongObject).

Raise [`OverflowError`](../library/exceptions.md#OverflowError) if the value of *pylong* is out of range for a
[`Py_ssize_t`](intro.md#c.Py_ssize_t).

Returns `-1` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

### unsigned long PyLong_AsUnsignedLong([PyObject](structures.md#c.PyObject) \*pylong)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-4"></a>

Return a C  representation of *pylong*.  *pylong*
must be an instance of [`PyLongObject`](#c.PyLongObject).

Raise [`OverflowError`](../library/exceptions.md#OverflowError) if the value of *pylong* is out of range for a
.

Returns `(unsigned long)-1` on error.
Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

### size_t PyLong_AsSize_t([PyObject](structures.md#c.PyObject) \*pylong)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-5"></a>

Return a C `size_t` representation of *pylong*.  *pylong* must be
an instance of [`PyLongObject`](#c.PyLongObject).

Raise [`OverflowError`](../library/exceptions.md#OverflowError) if the value of *pylong* is out of range for a
`size_t`.

Returns `(size_t)-1` on error.
Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

### unsigned long long PyLong_AsUnsignedLongLong([PyObject](structures.md#c.PyObject) \*pylong)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-6"></a>

Return a C  representation of *pylong*.  *pylong*
must be an instance of [`PyLongObject`](#c.PyLongObject).

Raise [`OverflowError`](../library/exceptions.md#OverflowError) if the value of *pylong* is out of range for an
.

Returns `(unsigned long long)-1` on error.
Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

#### Versionchanged
Changed in version 3.1: A negative *pylong* now raises [`OverflowError`](../library/exceptions.md#OverflowError), not [`TypeError`](../library/exceptions.md#TypeError).

### unsigned long PyLong_AsUnsignedLongMask([PyObject](structures.md#c.PyObject) \*obj)

 *Part of the [Stable ABI](stable.md#stable).*

Return a C  representation of *obj*.  If *obj* is not
an instance of [`PyLongObject`](#c.PyLongObject), first call its [`__index__()`](../reference/datamodel.md#object.__index__)
method (if present) to convert it to a [`PyLongObject`](#c.PyLongObject).

If the value of *obj* is out of range for an ,
return the reduction of that value modulo `ULONG_MAX + 1`.

Returns `(unsigned long)-1` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to
disambiguate.

#### Versionchanged
Changed in version 3.8: Use [`__index__()`](../reference/datamodel.md#object.__index__) if available.

#### Versionchanged
Changed in version 3.10: This function will no longer use [`__int__()`](../reference/datamodel.md#object.__int__).

### unsigned long long PyLong_AsUnsignedLongLongMask([PyObject](structures.md#c.PyObject) \*obj)

 *Part of the [Stable ABI](stable.md#stable).*

Return a C  representation of *obj*.  If *obj*
is not an instance of [`PyLongObject`](#c.PyLongObject), first call its
[`__index__()`](../reference/datamodel.md#object.__index__) method (if present) to convert it to a
[`PyLongObject`](#c.PyLongObject).

If the value of *obj* is out of range for an ,
return the reduction of that value modulo `ULLONG_MAX + 1`.

Returns `(unsigned long long)-1` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred)
to disambiguate.

#### Versionchanged
Changed in version 3.8: Use [`__index__()`](../reference/datamodel.md#object.__index__) if available.

#### Versionchanged
Changed in version 3.10: This function will no longer use [`__int__()`](../reference/datamodel.md#object.__int__).

### int PyLong_AsInt32([PyObject](structures.md#c.PyObject) \*obj, int32_t \*value)

### int PyLong_AsInt64([PyObject](structures.md#c.PyObject) \*obj, int64_t \*value)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Set  *\*value* to a signed C  or 
representation of *obj*.

If *obj* is not an instance of [`PyLongObject`](#c.PyLongObject), first call its
[`__index__()`](../reference/datamodel.md#object.__index__) method (if present) to convert it to a
[`PyLongObject`](#c.PyLongObject).

If the *obj* value is out of range, raise an [`OverflowError`](../library/exceptions.md#OverflowError).

Set  *\*value* and return `0` on success.
Set an exception and return `-1` on error.

*value* must not be `NULL`.

#### Versionadded
Added in version 3.14.

### int PyLong_AsUInt32([PyObject](structures.md#c.PyObject) \*obj, uint32_t \*value)

### int PyLong_AsUInt64([PyObject](structures.md#c.PyObject) \*obj, uint64_t \*value)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Set  *\*value* to an unsigned C  or 
representation of *obj*.

If *obj* is not an instance of [`PyLongObject`](#c.PyLongObject), first call its
[`__index__()`](../reference/datamodel.md#object.__index__) method (if present) to convert it to a
[`PyLongObject`](#c.PyLongObject).

* If *obj* is negative, raise a [`ValueError`](../library/exceptions.md#ValueError).
* If the *obj* value is out of range, raise an [`OverflowError`](../library/exceptions.md#OverflowError).

Set  *\*value* and return `0` on success.
Set an exception and return `-1` on error.

*value* must not be `NULL`.

#### Versionadded
Added in version 3.14.

### double PyLong_AsDouble([PyObject](structures.md#c.PyObject) \*pylong)

 *Part of the [Stable ABI](stable.md#stable).*

Return a C  representation of *pylong*.  *pylong* must be
an instance of [`PyLongObject`](#c.PyLongObject).

Raise [`OverflowError`](../library/exceptions.md#OverflowError) if the value of *pylong* is out of range for a
.

Returns `-1.0` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

### void \*PyLong_AsVoidPtr([PyObject](structures.md#c.PyObject) \*pylong)

 *Part of the [Stable ABI](stable.md#stable).*

Convert a Python integer *pylong* to a C  pointer.
If *pylong* cannot be converted, an [`OverflowError`](../library/exceptions.md#OverflowError) will be raised.  This
is only assured to produce a usable  pointer for values created
with [`PyLong_FromVoidPtr()`](#c.PyLong_FromVoidPtr).

Returns `NULL` on error.  Use [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to disambiguate.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyLong_AsNativeBytes([PyObject](structures.md#c.PyObject) \*pylong, void \*buffer, [Py_ssize_t](intro.md#c.Py_ssize_t) n_bytes, int flags)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Copy the Python integer value *pylong* to a native *buffer* of size
*n_bytes*. The *flags* can be set to `-1` to behave similarly to a C cast,
or to values documented below to control the behavior.

Returns `-1` with an exception raised on error.  This may happen if
*pylong* cannot be interpreted as an integer, or if *pylong* was negative
and the `Py_ASNATIVEBYTES_REJECT_NEGATIVE` flag was set.

Otherwise, returns the number of bytes required to store the value.
If this is equal to or less than *n_bytes*, the entire value was copied.
All *n_bytes* of the buffer are written: remaining bytes filled by
copies of the sign bit.

If the returned value is greater than *n_bytes*, the value was
truncated: as many of the lowest bits of the value as could fit are written,
and the higher bits are ignored. This matches the typical behavior
of a C-style downcast.

#### NOTE
Overflow is not considered an error. If the returned value
is larger than *n_bytes*, most significant bits were discarded.

`0` will never be returned.

Values are always copied as two’s-complement.

Usage example:

```c
int32_t value;
Py_ssize_t bytes = PyLong_AsNativeBytes(pylong, &value, sizeof(value), -1);
if (bytes < 0) {
    // Failed. A Python exception was set with the reason.
    return NULL;
}
else if (bytes <= (Py_ssize_t)sizeof(value)) {
    // Success!
}
else {
    // Overflow occurred, but 'value' contains the truncated
    // lowest bits of pylong.
}
```

Passing zero to *n_bytes* will return the size of a buffer that would
be large enough to hold the value. This may be larger than technically
necessary, but not unreasonably so. If *n_bytes=0*, *buffer* may be
`NULL`.

#### NOTE
Passing *n_bytes=0* to this function is not an accurate way to determine
the bit length of the value.

To get at the entire Python value of an unknown size, the function can be
called twice: first to determine the buffer size, then to fill it:

```c
// Ask how much space we need.
Py_ssize_t expected = PyLong_AsNativeBytes(pylong, NULL, 0, -1);
if (expected < 0) {
    // Failed. A Python exception was set with the reason.
    return NULL;
}
assert(expected != 0);  // Impossible per the API definition.
uint8_t *bignum = malloc(expected);
if (!bignum) {
    PyErr_SetString(PyExc_MemoryError, "bignum malloc failed.");
    return NULL;
}
// Safely get the entire value.
Py_ssize_t bytes = PyLong_AsNativeBytes(pylong, bignum, expected, -1);
if (bytes < 0) {  // Exception has been set.
    free(bignum);
    return NULL;
}
else if (bytes > expected) {  // This should not be possible.
    PyErr_SetString(PyExc_RuntimeError,
        "Unexpected bignum truncation after a size check.");
    free(bignum);
    return NULL;
}
// The expected success given the above pre-check.
// ... use bignum ...
free(bignum);
```

*flags* is either `-1` (`Py_ASNATIVEBYTES_DEFAULTS`) to select defaults
that behave most like a C cast, or a combination of the other flags in
the table below.
Note that `-1` cannot be combined with other flags.

Currently, `-1` corresponds to
`Py_ASNATIVEBYTES_NATIVE_ENDIAN | Py_ASNATIVEBYTES_UNSIGNED_BUFFER`.

| Flag                                                                                                            | Value   |
|-----------------------------------------------------------------------------------------------------------------|---------|
| ### Py_ASNATIVEBYTES_DEFAULTS<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.14.*        | `-1`    |
| ### Py_ASNATIVEBYTES_BIG_ENDIAN<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.14.*      | `0`     |
| ### Py_ASNATIVEBYTES_LITTLE_ENDIAN<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.14.*   | `1`     |
| ### Py_ASNATIVEBYTES_NATIVE_ENDIAN<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.14.*   | `3`     |
| ### Py_ASNATIVEBYTES_UNSIGNED_BUFFER<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.14.* | `4`     |
| ### Py_ASNATIVEBYTES_REJECT_NEGATIVE<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.14.* | `8`     |
| ### Py_ASNATIVEBYTES_ALLOW_INDEX<br/><br/> *Part of the [Stable ABI](stable.md#stable) since version 3.14.*     | `16`    |

Specifying `Py_ASNATIVEBYTES_NATIVE_ENDIAN` will override any other endian
flags. Passing `2` is reserved.

By default, sufficient buffer will be requested to include a sign bit.
For example, when converting 128 with *n_bytes=1*, the function will return
2 (or more) in order to store a zero sign bit.

If `Py_ASNATIVEBYTES_UNSIGNED_BUFFER` is specified, a zero sign bit
will be omitted from size calculations. This allows, for example, 128 to fit
in a single-byte buffer. If the destination buffer is later treated as
signed, a positive input value may become negative.
Note that the flag does not affect handling of negative values: for those,
space for a sign bit is always requested.

Specifying `Py_ASNATIVEBYTES_REJECT_NEGATIVE` causes an exception to be set
if *pylong* is negative. Without this flag, negative values will be copied
provided there is enough space for at least one sign bit, regardless of
whether `Py_ASNATIVEBYTES_UNSIGNED_BUFFER` was specified.

If `Py_ASNATIVEBYTES_ALLOW_INDEX` is specified and a non-integer value is
passed, its [`__index__()`](../reference/datamodel.md#object.__index__) method will be called first. This may
result in Python code executing and other threads being allowed to run, which
could cause changes to other objects or values in use. When *flags* is
`-1`, this option is not set, and non-integer values will raise
[`TypeError`](../library/exceptions.md#TypeError).

#### NOTE
With the default *flags* (`-1`, or *UNSIGNED_BUFFER*  without
*REJECT_NEGATIVE*), multiple Python integers can map to a single value
without overflow. For example, both `255` and `-1` fit a single-byte
buffer and set all its bits.
This matches typical C cast behavior.

#### Versionadded
Added in version 3.13.

### PyLong_AsPid(pid)

Macro for converting a Python integer into a process identifier.

This can be defined as an alias to [`PyLong_AsLong()`](#c.PyLong_AsLong),
[`PyLong_FromLongLong()`](#c.PyLong_FromLongLong), or [`PyLong_AsInt()`](#c.PyLong_AsInt), depending on the
size of the system’s PID type.

#### Versionadded
Added in version 3.2.

### int PyLong_GetSign([PyObject](structures.md#c.PyObject) \*obj, int \*sign)

Get the sign of the integer object *obj*.

On success, set  *\*sign* to the integer sign  (0, -1 or +1 for zero, negative or
positive integer, respectively) and return 0.

On failure, return -1 with an exception set.  This function always succeeds
if *obj* is a [`PyLongObject`](#c.PyLongObject) or its subtype.

#### Versionadded
Added in version 3.14.

### int PyLong_IsPositive([PyObject](structures.md#c.PyObject) \*obj)

Check if the integer object *obj* is positive (`obj > 0`).

If *obj* is an instance of [`PyLongObject`](#c.PyLongObject) or its subtype,
return `1` when it’s positive and `0` otherwise.  Else set an
exception and return `-1`.

#### Versionadded
Added in version 3.14.

### int PyLong_IsNegative([PyObject](structures.md#c.PyObject) \*obj)

Check if the integer object *obj* is negative (`obj < 0`).

If *obj* is an instance of [`PyLongObject`](#c.PyLongObject) or its subtype,
return `1` when it’s negative and `0` otherwise.  Else set an
exception and return `-1`.

#### Versionadded
Added in version 3.14.

### int PyLong_IsZero([PyObject](structures.md#c.PyObject) \*obj)

Check if the integer object *obj* is zero.

If *obj* is an instance of [`PyLongObject`](#c.PyLongObject) or its subtype,
return `1` when it’s zero and `0` otherwise.  Else set an
exception and return `-1`.

#### Versionadded
Added in version 3.14.

### [PyObject](structures.md#c.PyObject) \*PyLong_GetInfo(void)

 *Part of the [Stable ABI](stable.md#stable).*

On success, return a read only [named tuple](../glossary.md#term-named-tuple), that holds
information about Python’s internal representation of integers.
See [`sys.int_info`](../library/sys.md#sys.int_info) for description of individual fields.

On failure, return `NULL` with an exception set.

#### Versionadded
Added in version 3.1.

### int PyUnstable_Long_IsCompact(const [PyLongObject](#c.PyLongObject) \*op)

Return 1 if *op* is compact, 0 otherwise.

This function makes it possible for performance-critical code to implement
a “fast path” for small integers. For compact values use
[`PyUnstable_Long_CompactValue()`](#c.PyUnstable_Long_CompactValue); for others fall back to a
[`PyLong_As*`](#c.PyLong_AsSize_t) function or
[`PyLong_AsNativeBytes()`](#c.PyLong_AsNativeBytes).

The speedup is expected to be negligible for most users.

Exactly what values are considered compact is an implementation detail
and is subject to change.

#### Versionadded
Added in version 3.12.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyUnstable_Long_CompactValue(const [PyLongObject](#c.PyLongObject) \*op)

If *op* is compact, as determined by [`PyUnstable_Long_IsCompact()`](#c.PyUnstable_Long_IsCompact),
return its value.

Otherwise, the return value is undefined.

#### Versionadded
Added in version 3.12.

## Export API

#### Versionadded
Added in version 3.14.

### type PyLongLayout

 *Part of the [Stable ABI](stable.md#stable) (including all members) since version 3.15.*

Layout of an array of “digits” (“limbs” in the GMP terminology), used to
represent absolute value for arbitrary precision integers.

Use [`PyLong_GetNativeLayout()`](#c.PyLong_GetNativeLayout) to get the native layout of Python
[`int`](../library/functions.md#int) objects, used internally for integers with “big enough”
absolute value.

See also [`sys.int_info`](../library/sys.md#sys.int_info) which exposes similar information in Python.

### uint8_t bits_per_digit

Bits per digit. For example, a 15 bit digit means that bits 0-14 contain
meaningful information.

### uint8_t digit_size

Digit size in bytes. For example, a 15 bit digit will require at least 2
bytes.

### int8_t digits_order

Digits order:

- `1` for most significant digit first
- `-1` for least significant digit first

### int8_t digit_endianness

Digit endianness:

- `1` for most significant byte first (big endian)
- `-1` for least significant byte first (little endian)

### const [PyLongLayout](#c.PyLongLayout) \*PyLong_GetNativeLayout(void)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Get the native layout of Python [`int`](../library/functions.md#int) objects.

See the [`PyLongLayout`](#c.PyLongLayout) structure.

The function must not be called before Python initialization nor after
Python finalization. The returned layout is valid until Python is
finalized. The layout is the same for all Python sub-interpreters
in a process, and so it can be cached.

### type PyLongExport

 *Part of the [Stable ABI](stable.md#stable) (including all members) since version 3.15.*

Export of a Python [`int`](../library/functions.md#int) object.

There are two cases:

* If [`digits`](#c.PyLongExport.digits) is `NULL`, only use the [`value`](#c.PyLongExport.value) member.
* If [`digits`](#c.PyLongExport.digits) is not `NULL`, use [`negative`](#c.PyLongExport.negative),
  [`ndigits`](#c.PyLongExport.ndigits) and [`digits`](#c.PyLongExport.digits) members.

### int64_t value

The native integer value of the exported [`int`](../library/functions.md#int) object.
Only valid if [`digits`](#c.PyLongExport.digits) is `NULL`.

### uint8_t negative

`1` if the number is negative, `0` otherwise.
Only valid if [`digits`](#c.PyLongExport.digits) is not `NULL`.

### [Py_ssize_t](intro.md#c.Py_ssize_t) ndigits

Number of digits in [`digits`](#c.PyLongExport.digits) array.
Only valid if [`digits`](#c.PyLongExport.digits) is not `NULL`.

### const void \*digits

Read-only array of unsigned digits. Can be `NULL`.

### int PyLong_Export([PyObject](structures.md#c.PyObject) \*obj, [PyLongExport](#c.PyLongExport) \*export_long)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Export a Python [`int`](../library/functions.md#int) object.

*export_long* must point to a [`PyLongExport`](#c.PyLongExport) structure allocated
by the caller. It must not be `NULL`.

On success, fill in  *\*export_long* and return `0`.
On error, set an exception and return `-1`.

[`PyLong_FreeExport()`](#c.PyLong_FreeExport) must be called when the export is no longer
needed.

> **CPython implementation detail:** This function always succeeds if *obj* is a Python [`int`](../library/functions.md#int) object
> or a subclass.

### void PyLong_FreeExport([PyLongExport](#c.PyLongExport) \*export_long)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Release the export *export_long* created by [`PyLong_Export()`](#c.PyLong_Export).

**CPython implementation detail:** Calling [`PyLong_FreeExport()`](#c.PyLong_FreeExport) is optional if *export_long->digits*
is `NULL`.

## PyLongWriter API

The [`PyLongWriter`](#c.PyLongWriter) API can be used to import an integer.

#### Versionadded
Added in version 3.14.

### type PyLongWriter

 *Part of the [Stable ABI](stable.md#stable) (as an opaque struct) since version 3.15.*

A Python [`int`](../library/functions.md#int) writer instance.

The instance must be destroyed by [`PyLongWriter_Finish()`](#c.PyLongWriter_Finish) or
[`PyLongWriter_Discard()`](#c.PyLongWriter_Discard).

### [PyLongWriter](#c.PyLongWriter) \*PyLongWriter_Create(int negative, [Py_ssize_t](intro.md#c.Py_ssize_t) ndigits, void \*\*digits)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Create a [`PyLongWriter`](#c.PyLongWriter).

On success, allocate  *\*digits* and return a writer.
On error, set an exception and return `NULL`.

*negative* is `1` if the number is negative, or `0` otherwise.

*ndigits* is the number of digits in the *digits* array. It must be
greater than 0.

*digits* must not be NULL.

After a successful call to this function, the caller should fill in the
array of digits *digits* and then call [`PyLongWriter_Finish()`](#c.PyLongWriter_Finish) to get
a Python [`int`](../library/functions.md#int).
The layout of *digits* is described by [`PyLong_GetNativeLayout()`](#c.PyLong_GetNativeLayout).

Digits must be in the range [`0`; `(1 << bits_per_digit) - 1`]
(where the [`bits_per_digit`](#c.PyLongLayout.bits_per_digit) is the number of bits
per digit).
Any unused most significant digits must be set to `0`.

Alternately, call [`PyLongWriter_Discard()`](#c.PyLongWriter_Discard) to destroy the writer
instance without creating an [`int`](../library/functions.md#int) object.

### [PyObject](structures.md#c.PyObject) \*PyLongWriter_Finish([PyLongWriter](#c.PyLongWriter) \*writer)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Finish a [`PyLongWriter`](#c.PyLongWriter) created by [`PyLongWriter_Create()`](#c.PyLongWriter_Create).

On success, return a Python [`int`](../library/functions.md#int) object.
On error, set an exception and return `NULL`.

The function takes care of normalizing the digits and converts the object
to a compact integer if needed.

The writer instance and the *digits* array are invalid after the call.

### void PyLongWriter_Discard([PyLongWriter](#c.PyLongWriter) \*writer)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Discard a [`PyLongWriter`](#c.PyLongWriter) created by [`PyLongWriter_Create()`](#c.PyLongWriter_Create).

If *writer* is `NULL`, no operation is performed.

The writer instance and the *digits* array are invalid after the call.

## Deprecated API

These macros are [soft deprecated](../glossary.md#term-soft-deprecated). They describe parameters
of the internal representation of [`PyLongObject`](#c.PyLongObject) instances.

Use [`PyLong_GetNativeLayout()`](#c.PyLong_GetNativeLayout) instead, along with [`PyLong_Export()`](#c.PyLong_Export)
to read integer data or [`PyLongWriter`](#c.PyLongWriter) to write it.
These currently use the same layout, but are designed to continue working correctly
even if CPython’s internal integer representation changes.

### PyLong_SHIFT

This is equivalent to [`bits_per_digit`](#c.PyLongLayout.bits_per_digit) in
the output of [`PyLong_GetNativeLayout()`](#c.PyLong_GetNativeLayout).

### PyLong_BASE

This is currently equivalent to .

### PyLong_MASK

This is currently equivalent to 

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
