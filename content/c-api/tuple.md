<a id="tupleobjects"></a>

# Tuple Objects

<a id="index-0"></a>

### type PyTupleObject

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python tuple object.

### [PyTypeObject](type.md#c.PyTypeObject) PyTuple_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python tuple type; it
is the same object as [`tuple`](../library/stdtypes.md#tuple) in the Python layer.

### int PyTuple_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a tuple object or an instance of a subtype of the
tuple type.  This function always succeeds.

### int PyTuple_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a tuple object, but not an instance of a subtype of the
tuple type.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyTuple_New([Py_ssize_t](intro.md#c.Py_ssize_t) len)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a new tuple object of size *len*,
or `NULL` with an exception set on failure.

### [PyObject](structures.md#c.PyObject) \*PyTuple_FromArray([PyObject](structures.md#c.PyObject) \*const \*array, [Py_ssize_t](intro.md#c.Py_ssize_t) size)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Create a tuple of *size* items and copy references from *array* to the new
tuple.

*array* can be NULL if *size* is `0`.

On success, return a new reference.
On error, set an exception and return `NULL`.

#### Versionadded
Added in version 3.15.

### [PyObject](structures.md#c.PyObject) \*PyTuple_Pack([Py_ssize_t](intro.md#c.Py_ssize_t) n, ...)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a new tuple object of size *n*,
or `NULL` with an exception set on failure. The tuple values
are initialized to the subsequent *n* C arguments pointing to Python objects.
`PyTuple_Pack(2, a, b)` is equivalent to `Py_BuildValue("(OO)", a, b)`.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyTuple_Size([PyObject](structures.md#c.PyObject) \*p)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Take a pointer to a tuple object, and return the size of that tuple.
On error, return `-1` with an exception set.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyTuple_GET_SIZE([PyObject](structures.md#c.PyObject) \*p)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Like [`PyTuple_Size()`](#c.PyTuple_Size), but without error checking.

### [PyObject](structures.md#c.PyObject) \*PyTuple_GetItem([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) pos)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Return the object at position *pos* in the tuple pointed to by *p*.  If *pos* is
negative or out of bounds, return `NULL` and set an [`IndexError`](../library/exceptions.md#IndexError) exception.

The returned reference is borrowed from the tuple *p*
(that is: it is only valid as long as you hold a reference to *p*).
To get a [strong reference](../glossary.md#term-strong-reference), use
[`Py_NewRef(PyTuple_GetItem(...))`](refcounting.md#c.Py_NewRef)
or [`PySequence_GetItem()`](sequence.md#c.PySequence_GetItem).

### [PyObject](structures.md#c.PyObject) \*PyTuple_GET_ITEM([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) pos)

*Return value: Borrowed reference.* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Like [`PyTuple_GetItem()`](#c.PyTuple_GetItem), but does no checking of its arguments.

### [PyObject](structures.md#c.PyObject) \*PyTuple_GetSlice([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) low, [Py_ssize_t](intro.md#c.Py_ssize_t) high)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return the slice of the tuple pointed to by *p* between *low* and *high*,
or `NULL` with an exception set on failure.

This is the equivalent of the Python expression `p[low:high]`.
Indexing from the end of the tuple is not supported.

### int PyTuple_SetItem([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) pos, [PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Insert a reference to object *o* at position *pos* of the tuple pointed to by
*p*.  Return `0` on success.  If *pos* is out of bounds, return `-1`
and set an [`IndexError`](../library/exceptions.md#IndexError) exception. This function should only be used to fill in brand new tuples;
using it on an existing tuple is thread-unsafe.

#### NOTE
This function “steals” a reference to *o* and discards a reference to
an item already in the tuple at the affected position.

### void PyTuple_SET_ITEM([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) pos, [PyObject](structures.md#c.PyObject) \*o)

 *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Like [`PyTuple_SetItem()`](#c.PyTuple_SetItem), but does no error checking, and should *only* be
used to fill in brand new tuples, using it on an existing tuple is thread-unsafe.

Bounds checking is performed as an assertion if Python is built in
[debug mode](../using/configure.md#debug-build) or [`with assertions`](../using/configure.md#cmdoption-with-assertions).

#### NOTE
This function “steals” a reference to *o*, and, unlike
[`PyTuple_SetItem()`](#c.PyTuple_SetItem), does *not* discard a reference to any item that
is being replaced; any reference in the tuple at position *pos* will be
leaked.

#### WARNING
This macro should *only* be used on tuples that are newly created.
Using this macro on a tuple that is already in use (or in other words, has
a refcount > 1) could lead to undefined behavior.

### int \_PyTuple_Resize([PyObject](structures.md#c.PyObject) \*\*p, [Py_ssize_t](intro.md#c.Py_ssize_t) newsize)

 *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Can be used to resize a tuple.  *newsize* will be the new length of the tuple.
Because tuples are *supposed* to be immutable, this should only be used if there
is only one reference to the object.  Do *not* use this if the tuple may already
be known to some other part of the code.  The tuple will always grow or shrink
at the end.  Think of this as destroying the old tuple and creating a new one,
only more efficiently.  Returns `0` on success. Client code should never
assume that the resulting value of `*p` will be the same as before calling
this function. If the object referenced by `*p` is replaced, the original
`*p` is destroyed.  On failure, returns `-1` and sets `*p` to `NULL`, and
raises [`MemoryError`](../library/exceptions.md#MemoryError) or [`SystemError`](../library/exceptions.md#SystemError).

<a id="struct-sequence-objects"></a>

# Struct Sequence Objects

A struct sequence object is a [named tuple](../glossary.md#term-named-tuple), that is, a sequence
whose items can also be accessed through attributes.
It is similar to [`collections.namedtuple()`](../library/collections.md#collections.namedtuple), but provides a slightly
different interface.

To create a struct sequence, you first have to create a specific struct sequence
type.

### [PyTypeObject](type.md#c.PyTypeObject) \*PyStructSequence_NewType([PyStructSequence_Desc](#c.PyStructSequence_Desc) \*desc)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Create a new struct sequence type from the data in *desc*, described below. Instances
of the resulting type can be created with [`PyStructSequence_New()`](#c.PyStructSequence_New).

Return `NULL` with an exception set on failure.

### void PyStructSequence_InitType([PyTypeObject](type.md#c.PyTypeObject) \*type, [PyStructSequence_Desc](#c.PyStructSequence_Desc) \*desc)

 *Thread safety: [Safe to call without external synchronization on distinct objects](../library/threadsafety.md#threadsafety-level-distinct).*

Initializes a struct sequence type *type* from *desc* in place.

### int PyStructSequence_InitType2([PyTypeObject](type.md#c.PyTypeObject) \*type, [PyStructSequence_Desc](#c.PyStructSequence_Desc) \*desc)

 *Thread safety: [Safe to call without external synchronization on distinct objects](../library/threadsafety.md#threadsafety-level-distinct).*

Like [`PyStructSequence_InitType()`](#c.PyStructSequence_InitType), but returns `0` on success
and `-1` with an exception set on failure.

#### Versionadded
Added in version 3.4.

### type PyStructSequence_Desc

 *Part of the [Stable ABI](stable.md#stable) (including all members).*

Contains the meta information of a struct sequence type to create.

### const char \*name

Fully qualified name of the type; null-terminated UTF-8 encoded.
The name must contain the module name.

### const char \*doc

Pointer to docstring for the type or `NULL` to omit.

### [PyStructSequence_Field](#c.PyStructSequence_Field) \*fields

Pointer to `NULL`-terminated array with field names of the new type.

### int n_in_sequence

Number of fields visible to the Python side (if used as tuple).

### type PyStructSequence_Field

 *Part of the [Stable ABI](stable.md#stable) (including all members).*

Describes a field of a struct sequence. As a struct sequence is modeled as a
tuple, all fields are typed as .  The index in the
[`fields`](#c.PyStructSequence_Desc.fields) array of
the [`PyStructSequence_Desc`](#c.PyStructSequence_Desc) determines which
field of the struct sequence is described.

### const char \*name

Name for the field or `NULL` to end the list of named fields,
set to [`PyStructSequence_UnnamedField`](#c.PyStructSequence_UnnamedField) to leave unnamed.

### const char \*doc

Field docstring or `NULL` to omit.

### const char \*const PyStructSequence_UnnamedField

 *Part of the [Stable ABI](stable.md#stable) since version 3.11.*

Special value for a field name to leave it unnamed.

#### Versionchanged
Changed in version 3.9: The type was changed from `char *`.

### [PyObject](structures.md#c.PyObject) \*PyStructSequence_New([PyTypeObject](type.md#c.PyTypeObject) \*type)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Creates an instance of *type*, which must have been created with
[`PyStructSequence_NewType()`](#c.PyStructSequence_NewType).

Return `NULL` with an exception set on failure.

### [PyObject](structures.md#c.PyObject) \*PyStructSequence_GetItem([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) pos)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Return the object at position *pos* in the struct sequence pointed to by *p*.
The returned reference is borrowed from the struct sequence *p*
(that is: it is only valid as long as you hold a reference to *p*).

Bounds checking is performed as an assertion if Python is built in
[debug mode](../using/configure.md#debug-build) or [`with assertions`](../using/configure.md#cmdoption-with-assertions).

### [PyObject](structures.md#c.PyObject) \*PyStructSequence_GET_ITEM([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) pos)

*Return value: Borrowed reference.* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Alias to [`PyStructSequence_GetItem()`](#c.PyStructSequence_GetItem).

#### Versionchanged
Changed in version 3.13: Now implemented as an alias to [`PyStructSequence_GetItem()`](#c.PyStructSequence_GetItem).

### void PyStructSequence_SetItem([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) pos, [PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Sets the field at index *pos* of the struct sequence *p* to value *o*.  Like
[`PyTuple_SET_ITEM()`](#c.PyTuple_SET_ITEM), this should only be used to fill in brand new
instances.

Bounds checking is performed as an assertion if Python is built in
[debug mode](../using/configure.md#debug-build) or [`with assertions`](../using/configure.md#cmdoption-with-assertions).

#### NOTE
This function “steals” a reference to *o*.

### void PyStructSequence_SET_ITEM([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) \*pos, [PyObject](structures.md#c.PyObject) \*o)

 *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Alias to [`PyStructSequence_SetItem()`](#c.PyStructSequence_SetItem).

#### Versionchanged
Changed in version 3.13: Now implemented as an alias to [`PyStructSequence_SetItem()`](#c.PyStructSequence_SetItem).

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
