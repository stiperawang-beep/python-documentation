<a id="sequence"></a>

# Sequence Protocol

### int PySequence_Check([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).*

Return `1` if the object provides the sequence protocol, and `0` otherwise.
Note that it returns `1` for Python classes with a [`__getitem__()`](../reference/datamodel.md#object.__getitem__)
method, unless they are [`dict`](../library/stdtypes.md#dict) subclasses, since in general it
is impossible to determine what type of keys the class supports.  This
function always succeeds.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PySequence_Size([PyObject](structures.md#c.PyObject) \*o)

### [Py_ssize_t](intro.md#c.Py_ssize_t) PySequence_Length([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-0"></a>

Returns the number of objects in sequence *o* on success, and `-1` on
failure.  This is equivalent to the Python expression `len(o)`.

### [PyObject](structures.md#c.PyObject) \*PySequence_Concat([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the concatenation of *o1* and *o2* on success, and `NULL` on failure.
This is the equivalent of the Python expression `o1 + o2`.

### [PyObject](structures.md#c.PyObject) \*PySequence_Repeat([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) count)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the result of repeating sequence object *o* *count* times, or `NULL` on
failure.  This is the equivalent of the Python expression `o * count`.

### [PyObject](structures.md#c.PyObject) \*PySequence_InPlaceConcat([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the concatenation of *o1* and *o2* on success, and `NULL` on failure.
The operation is done *in-place* when *o1* supports it.  This is the equivalent
of the Python expression `o1 += o2`.

### [PyObject](structures.md#c.PyObject) \*PySequence_InPlaceRepeat([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) count)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the result of repeating sequence object *o* *count* times, or `NULL` on
failure.  The operation is done *in-place* when *o* supports it.  This is the
equivalent of the Python expression `o *= count`.

### [PyObject](structures.md#c.PyObject) \*PySequence_GetItem([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) i)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the *i*th element of *o*, or `NULL` on failure. This is the equivalent of
the Python expression `o[i]`.

### [PyObject](structures.md#c.PyObject) \*PySequence_GetSlice([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) i1, [Py_ssize_t](intro.md#c.Py_ssize_t) i2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the slice of sequence object *o* between *i1* and *i2*, or `NULL` on
failure. This is the equivalent of the Python expression `o[i1:i2]`.

### int PySequence_SetItem([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) i, [PyObject](structures.md#c.PyObject) \*v)

 *Part of the [Stable ABI](stable.md#stable).*

Assign object *v* to the *i*th element of *o*.  Raise an exception
and return `-1` on failure; return `0` on success.  This
is the equivalent of the Python statement `o[i] = v`.  This function *does
not* steal a reference to *v*.

If *v* is `NULL`, the element is deleted, but this feature is
deprecated in favour of using [`PySequence_DelItem()`](#c.PySequence_DelItem).

### int PySequence_DelItem([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) i)

 *Part of the [Stable ABI](stable.md#stable).*

Delete the *i*th element of object *o*.  Returns `-1` on failure.  This is the
equivalent of the Python statement `del o[i]`.

### int PySequence_SetSlice([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) i1, [Py_ssize_t](intro.md#c.Py_ssize_t) i2, [PyObject](structures.md#c.PyObject) \*v)

 *Part of the [Stable ABI](stable.md#stable).*

Assign the sequence object *v* to the slice in sequence object *o* from *i1* to
*i2*.  This is the equivalent of the Python statement `o[i1:i2] = v`.

### int PySequence_DelSlice([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) i1, [Py_ssize_t](intro.md#c.Py_ssize_t) i2)

 *Part of the [Stable ABI](stable.md#stable).*

Delete the slice in sequence object *o* from *i1* to *i2*.  Returns `-1` on
failure.  This is the equivalent of the Python statement `del o[i1:i2]`.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PySequence_Count([PyObject](structures.md#c.PyObject) \*o, [PyObject](structures.md#c.PyObject) \*value)

 *Part of the [Stable ABI](stable.md#stable).*

Return the number of occurrences of *value* in *o*, that is, return the number
of keys for which `o[key] == value`.  On failure, return `-1`.  This is
equivalent to the Python expression `o.count(value)`.

### int PySequence_Contains([PyObject](structures.md#c.PyObject) \*o, [PyObject](structures.md#c.PyObject) \*value)

 *Part of the [Stable ABI](stable.md#stable).*

Determine if *o* contains *value*.  If an item in *o* is equal to *value*,
return `1`, otherwise return `0`. On error, return `-1`.  This is
equivalent to the Python expression `value in o`.

### int PySequence_In([PyObject](structures.md#c.PyObject) \*o, [PyObject](structures.md#c.PyObject) \*value)

 *Part of the [Stable ABI](stable.md#stable).*

Alias for [`PySequence_Contains()`](#c.PySequence_Contains).

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.14: The function should no longer be used to write new code.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PySequence_Index([PyObject](structures.md#c.PyObject) \*o, [PyObject](structures.md#c.PyObject) \*value)

 *Part of the [Stable ABI](stable.md#stable).*

Return the first index *i* for which `o[i] == value`.  On error, return
`-1`.    This is equivalent to the Python expression `o.index(value)`.

### [PyObject](structures.md#c.PyObject) \*PySequence_List([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a list object with the same contents as the sequence or iterable *o*,
or `NULL` on failure.  The returned list is guaranteed to be new.  This is
equivalent to the Python expression `list(o)`.

### [PyObject](structures.md#c.PyObject) \*PySequence_Tuple([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-1"></a>

Return a tuple object with the same contents as the sequence or iterable *o*,
or `NULL` on failure.  If *o* is a tuple, a new reference will be returned,
otherwise a tuple will be constructed with the appropriate contents.  This is
equivalent to the Python expression `tuple(o)`.

### [PyObject](structures.md#c.PyObject) \*PySequence_Fast([PyObject](structures.md#c.PyObject) \*o, const char \*m)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the sequence or iterable *o* as an object usable by the other
`PySequence_Fast*` family of functions. If the object is not a sequence or
iterable, raises [`TypeError`](../library/exceptions.md#TypeError) with *m* as the message text. Returns
`NULL` on failure.

The `PySequence_Fast*` functions are thus named because they assume
*o* is a [`PyTupleObject`](tuple.md#c.PyTupleObject) or a [`PyListObject`](list.md#c.PyListObject) and access
the data fields of *o* directly.

As a CPython implementation detail, if *o* is already a sequence or list, it
will be returned.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PySequence_Fast_GET_SIZE([PyObject](structures.md#c.PyObject) \*o)

Returns the length of *o*, assuming that *o* was returned by
[`PySequence_Fast()`](#c.PySequence_Fast) and that *o* is not `NULL`.  The size can also be
retrieved by calling [`PySequence_Size()`](#c.PySequence_Size) on *o*, but
[`PySequence_Fast_GET_SIZE()`](#c.PySequence_Fast_GET_SIZE) is faster because it can assume *o* is a
list or tuple.

### [PyObject](structures.md#c.PyObject) \*PySequence_Fast_GET_ITEM([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) i)

*Return value: Borrowed reference.*

Return the *i*th element of *o*, assuming that *o* was returned by
[`PySequence_Fast()`](#c.PySequence_Fast), *o* is not `NULL`, and that *i* is within bounds.

### [PyObject](structures.md#c.PyObject) \*\*PySequence_Fast_ITEMS([PyObject](structures.md#c.PyObject) \*o)

Return the underlying array of PyObject pointers.  Assumes that *o* was returned
by [`PySequence_Fast()`](#c.PySequence_Fast) and *o* is not `NULL`.

Note, if a list gets resized, the reallocation may relocate the items array.
So, only use the underlying array pointer in contexts where the sequence
cannot change.

### [PyObject](structures.md#c.PyObject) \*PySequence_ITEM([PyObject](structures.md#c.PyObject) \*o, [Py_ssize_t](intro.md#c.Py_ssize_t) i)

*Return value: New reference.*

Return the *i*th element of *o* or `NULL` on failure. Faster form of
[`PySequence_GetItem()`](#c.PySequence_GetItem) but without checking that
[`PySequence_Check()`](#c.PySequence_Check) on *o* is true and without adjustment for negative
indices.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
