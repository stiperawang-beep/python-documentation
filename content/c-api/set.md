<a id="setobjects"></a>

# Set Objects

<a id="index-0"></a>

This section details the public API for [`set`](../library/stdtypes.md#set) and [`frozenset`](../library/stdtypes.md#frozenset)
objects.  Any functionality not listed below is best accessed using either
the abstract object protocol (including [`PyObject_CallMethod()`](call.md#c.PyObject_CallMethod),
[`PyObject_RichCompareBool()`](object.md#c.PyObject_RichCompareBool), [`PyObject_Hash()`](object.md#c.PyObject_Hash),
[`PyObject_Repr()`](object.md#c.PyObject_Repr), [`PyObject_IsTrue()`](object.md#c.PyObject_IsTrue), [`PyObject_Print()`](object.md#c.PyObject_Print), and
[`PyObject_GetIter()`](object.md#c.PyObject_GetIter)) or the abstract number protocol (including
[`PyNumber_And()`](number.md#c.PyNumber_And), [`PyNumber_Subtract()`](number.md#c.PyNumber_Subtract), [`PyNumber_Or()`](number.md#c.PyNumber_Or),
[`PyNumber_Xor()`](number.md#c.PyNumber_Xor), [`PyNumber_InPlaceAnd()`](number.md#c.PyNumber_InPlaceAnd),
[`PyNumber_InPlaceSubtract()`](number.md#c.PyNumber_InPlaceSubtract), [`PyNumber_InPlaceOr()`](number.md#c.PyNumber_InPlaceOr), and
[`PyNumber_InPlaceXor()`](number.md#c.PyNumber_InPlaceXor)).

### type PySetObject

This subtype of [`PyObject`](structures.md#c.PyObject) is used to hold the internal data for both
[`set`](../library/stdtypes.md#set) and [`frozenset`](../library/stdtypes.md#frozenset) objects.  It is like a [`PyDictObject`](dict.md#c.PyDictObject)
in that it is a fixed size for small sets (much like tuple storage) and will
point to a separate, variable sized block of memory for medium and large sized
sets (much like list storage). None of the fields of this structure should be
considered public and all are subject to change.  All access should be done through
the documented API rather than by manipulating the values in the structure.

### [PyTypeObject](type.md#c.PyTypeObject) PySet_Type

 *Part of the [Stable ABI](stable.md#stable).*

This is an instance of [`PyTypeObject`](type.md#c.PyTypeObject) representing the Python
[`set`](../library/stdtypes.md#set) type.

### [PyTypeObject](type.md#c.PyTypeObject) PyFrozenSet_Type

 *Part of the [Stable ABI](stable.md#stable).*

This is an instance of [`PyTypeObject`](type.md#c.PyTypeObject) representing the Python
[`frozenset`](../library/stdtypes.md#frozenset) type.

The following type check macros work on pointers to any Python object. Likewise,
the constructor functions work with any iterable Python object.

### int PySet_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`set`](../library/stdtypes.md#set) object or an instance of a subtype.
This function always succeeds.

### int PyFrozenSet_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`frozenset`](../library/stdtypes.md#frozenset) object or an instance of a
subtype.  This function always succeeds.

### int PyAnySet_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`set`](../library/stdtypes.md#set) object, a [`frozenset`](../library/stdtypes.md#frozenset) object, or an
instance of a subtype.  This function always succeeds.

### int PySet_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`set`](../library/stdtypes.md#set) object but not an instance of a
subtype.  This function always succeeds.

#### Versionadded
Added in version 3.10.

### int PyAnySet_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`set`](../library/stdtypes.md#set) object or a [`frozenset`](../library/stdtypes.md#frozenset) object but
not an instance of a subtype.  This function always succeeds.

### int PyFrozenSet_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`frozenset`](../library/stdtypes.md#frozenset) object but not an instance of a
subtype.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PySet_New([PyObject](structures.md#c.PyObject) \*iterable)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Return a new [`set`](../library/stdtypes.md#set) containing objects returned by the *iterable*.  The
*iterable* may be `NULL` to create a new empty set.  Return the new set on
success or `NULL` on failure.  Raise [`TypeError`](../library/exceptions.md#TypeError) if *iterable* is not
actually iterable.  The constructor is also useful for copying a set
(`c=set(s)`).

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *iterable* is a [`set`](../library/stdtypes.md#set), [`frozenset`](../library/stdtypes.md#frozenset), [`dict`](../library/stdtypes.md#dict) or [`frozendict`](../library/stdtypes.md#frozendict).

### [PyObject](structures.md#c.PyObject) \*PyFrozenSet_New([PyObject](structures.md#c.PyObject) \*iterable)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Return a new [`frozenset`](../library/stdtypes.md#frozenset) containing objects returned by the *iterable*.
The *iterable* may be `NULL` to create a new empty frozenset.  Return the new
set on success or `NULL` on failure.  Raise [`TypeError`](../library/exceptions.md#TypeError) if *iterable* is
not actually iterable.

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *iterable* is a [`set`](../library/stdtypes.md#set), [`frozenset`](../library/stdtypes.md#frozenset), [`dict`](../library/stdtypes.md#dict) or [`frozendict`](../library/stdtypes.md#frozendict).

The following functions and macros are available for instances of [`set`](../library/stdtypes.md#set)
or [`frozenset`](../library/stdtypes.md#frozenset) or instances of their subtypes.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PySet_Size([PyObject](structures.md#c.PyObject) \*anyset)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

<a id="index-1"></a>

Return the length of a [`set`](../library/stdtypes.md#set) or [`frozenset`](../library/stdtypes.md#frozenset) object. Equivalent to
`len(anyset)`.  Raises a [`SystemError`](../library/exceptions.md#SystemError) if *anyset* is not a
[`set`](../library/stdtypes.md#set), [`frozenset`](../library/stdtypes.md#frozenset), or an instance of a subtype.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PySet_GET_SIZE([PyObject](structures.md#c.PyObject) \*anyset)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Macro form of [`PySet_Size()`](#c.PySet_Size) without error checking.

### int PySet_Contains([PyObject](structures.md#c.PyObject) \*anyset, [PyObject](structures.md#c.PyObject) \*key)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Return `1` if found, `0` if not found, and `-1` if an error is encountered.  Unlike
the Python [`__contains__()`](../reference/datamodel.md#object.__contains__) method, this function does not automatically
convert unhashable sets into temporary frozensets.  Raise a [`TypeError`](../library/exceptions.md#TypeError) if
the *key* is unhashable. Raise [`SystemError`](../library/exceptions.md#SystemError) if *anyset* is not a
[`set`](../library/stdtypes.md#set), [`frozenset`](../library/stdtypes.md#frozenset), or an instance of a subtype.

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

### int PySet_Add([PyObject](structures.md#c.PyObject) \*set, [PyObject](structures.md#c.PyObject) \*key)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Add *key* to a [`set`](../library/stdtypes.md#set) instance.  Also works with [`frozenset`](../library/stdtypes.md#frozenset)
instances (like [`PyTuple_SetItem()`](tuple.md#c.PyTuple_SetItem) it can be used to fill in the values
of brand new frozensets before they are exposed to other code).  Return `0` on
success or `-1` on failure. Raise a [`TypeError`](../library/exceptions.md#TypeError) if the *key* is
unhashable. Raise a [`MemoryError`](../library/exceptions.md#MemoryError) if there is no room to grow.  Raise a
[`SystemError`](../library/exceptions.md#SystemError) if *set* is not an instance of [`set`](../library/stdtypes.md#set) or its
subtype.

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

The following functions are available for instances of [`set`](../library/stdtypes.md#set) or its
subtypes but not for instances of [`frozenset`](../library/stdtypes.md#frozenset) or its subtypes.

### int PySet_Discard([PyObject](structures.md#c.PyObject) \*set, [PyObject](structures.md#c.PyObject) \*key)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Return `1` if found and removed, `0` if not found (no action taken), and `-1` if an
error is encountered.  Does not raise [`KeyError`](../library/exceptions.md#KeyError) for missing keys.  Raise a
[`TypeError`](../library/exceptions.md#TypeError) if the *key* is unhashable.  Unlike the Python [`discard()`](../library/stdtypes.md#set.discard)
method, this function does not automatically convert unhashable sets into
temporary frozensets. Raise [`SystemError`](../library/exceptions.md#SystemError) if *set* is not an
instance of [`set`](../library/stdtypes.md#set) or its subtype.

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

### [PyObject](structures.md#c.PyObject) \*PySet_Pop([PyObject](structures.md#c.PyObject) \*set)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a new reference to an arbitrary object in the *set*, and removes the
object from the *set*.  Return `NULL` on failure.  Raise [`KeyError`](../library/exceptions.md#KeyError) if the
set is empty. Raise a [`SystemError`](../library/exceptions.md#SystemError) if *set* is not an instance of
[`set`](../library/stdtypes.md#set) or its subtype.

### int PySet_Clear([PyObject](structures.md#c.PyObject) \*set)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Empty an existing set of all elements. Return `0` on
success. Return `-1` and raise [`SystemError`](../library/exceptions.md#SystemError) if *set* is not an instance of
[`set`](../library/stdtypes.md#set) or its subtype.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), the set is emptied before its entries
are cleared, so other threads will observe an empty set rather than
intermediate states.

## Deprecated API

### PySet_MINSIZE

A constant representing the size of an internal
preallocated table inside [`PySetObject`](#c.PySetObject) instances.

This is documented solely for completeness, as there are no guarantees
that a given version of CPython uses preallocated tables with a fixed
size.
In code that does not deal with unstable set internals,
`PySet_MINSIZE` can be replaced with a small constant like `8`.

If looking for the size of a set, use [`PySet_Size()`](#c.PySet_Size) instead.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.14.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
