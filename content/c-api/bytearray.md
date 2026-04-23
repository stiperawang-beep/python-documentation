<a id="bytearrayobjects"></a>

# Byte Array Objects

<a id="index-0"></a>

### type PyByteArrayObject

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python bytearray object.

### [PyTypeObject](type.md#c.PyTypeObject) PyByteArray_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python bytearray type;
it is the same object as [`bytearray`](../library/stdtypes.md#bytearray) in the Python layer.

## Type check macros

### int PyByteArray_Check([PyObject](structures.md#c.PyObject) \*o)

Return true if the object *o* is a bytearray object or an instance of a
subtype of the bytearray type.  This function always succeeds.

### int PyByteArray_CheckExact([PyObject](structures.md#c.PyObject) \*o)

Return true if the object *o* is a bytearray object, but not an instance of a
subtype of the bytearray type.  This function always succeeds.

## Direct API functions

### [PyObject](structures.md#c.PyObject) \*PyByteArray_FromObject([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Return a new bytearray object from any object, *o*, that implements the
[buffer protocol](buffer.md#bufferobjects).

On failure, return `NULL` with an exception set.

#### NOTE
If the object implements the buffer protocol, then the buffer
must not be mutated while the bytearray object is being created.

### [PyObject](structures.md#c.PyObject) \*PyByteArray_FromStringAndSize(const char \*string, [Py_ssize_t](intro.md#c.Py_ssize_t) len)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Create a new bytearray object from *string* and its length, *len*.

On failure, return `NULL` with an exception set.

### [PyObject](structures.md#c.PyObject) \*PyByteArray_Concat([PyObject](structures.md#c.PyObject) \*a, [PyObject](structures.md#c.PyObject) \*b)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Concat bytearrays *a* and *b* and return a new bytearray with the result.

On failure, return `NULL` with an exception set.

#### NOTE
If the object implements the buffer protocol, then the buffer
must not be mutated while the bytearray object is being created.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyByteArray_Size([PyObject](structures.md#c.PyObject) \*bytearray)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return the size of *bytearray* after checking for a `NULL` pointer.

### char \*PyByteArray_AsString([PyObject](structures.md#c.PyObject) \*bytearray)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Return the contents of *bytearray* as a char array after checking for a
`NULL` pointer.  The returned array always has an extra
null byte appended.

#### NOTE
It is not thread-safe to mutate the bytearray object while using the returned char array.

### int PyByteArray_Resize([PyObject](structures.md#c.PyObject) \*bytearray, [Py_ssize_t](intro.md#c.Py_ssize_t) len)

 *Part of the [Stable ABI](stable.md#stable).*

Resize the internal buffer of *bytearray* to *len*.
Failure is a `-1` return with an exception set.

#### Versionchanged
Changed in version 3.14: A negative *len* will now result in an exception being set and -1 returned.

## Macros

These macros trade safety for speed and they don’t check pointers.

### char \*PyByteArray_AS_STRING([PyObject](structures.md#c.PyObject) \*bytearray)

 *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Similar to [`PyByteArray_AsString()`](#c.PyByteArray_AsString), but without error checking.

#### NOTE
It is not thread-safe to mutate the bytearray object while using the returned char array.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyByteArray_GET_SIZE([PyObject](structures.md#c.PyObject) \*bytearray)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Similar to [`PyByteArray_Size()`](#c.PyByteArray_Size), but without error checking.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
