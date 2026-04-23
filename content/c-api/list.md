<a id="listobjects"></a>

# List Objects

<a id="index-0"></a>

### type PyListObject

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python list object.

### [PyTypeObject](type.md#c.PyTypeObject) PyList_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python list type.
This is the same object as [`list`](../library/stdtypes.md#list) in the Python layer.

### int PyList_Check([PyObject](structures.md#c.PyObject) \*p)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return true if *p* is a list object or an instance of a subtype of the list
type.  This function always succeeds.

### int PyList_CheckExact([PyObject](structures.md#c.PyObject) \*p)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return true if *p* is a list object, but not an instance of a subtype of
the list type.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyList_New([Py_ssize_t](intro.md#c.Py_ssize_t) len)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a new list of length *len* on success, or `NULL` on failure.

#### NOTE
If *len* is greater than zero, the returned list object’s items are
set to `NULL`. Thus you cannot use abstract API functions such as
[`PySequence_SetItem()`](sequence.md#c.PySequence_SetItem) or expose the object to Python code before
setting all items to a real object with [`PyList_SetItem()`](#c.PyList_SetItem) or
[`PyList_SET_ITEM()`](#c.PyList_SET_ITEM). The following APIs are safe APIs before
the list is fully initialized: [`PyList_SetItem()`](#c.PyList_SetItem) and [`PyList_SET_ITEM()`](#c.PyList_SET_ITEM).

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyList_Size([PyObject](structures.md#c.PyObject) \*list)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

<a id="index-1"></a>

Return the length of the list object in *list*; this is equivalent to
`len(list)` on a list object.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyList_GET_SIZE([PyObject](structures.md#c.PyObject) \*list)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Similar to [`PyList_Size()`](#c.PyList_Size), but without error checking.

### [PyObject](structures.md#c.PyObject) \*PyList_GetItemRef([PyObject](structures.md#c.PyObject) \*list, [Py_ssize_t](intro.md#c.Py_ssize_t) index)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.13.* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return the object at position *index* in the list pointed to by *list*.  The
position must be non-negative; indexing from the end of the list is not
supported.  If *index* is out of bounds (`<0 or >=len(list)`),
return `NULL` and set an [`IndexError`](../library/exceptions.md#IndexError) exception.

#### Versionadded
Added in version 3.13.

### [PyObject](structures.md#c.PyObject) \*PyList_GetItem([PyObject](structures.md#c.PyObject) \*list, [Py_ssize_t](intro.md#c.Py_ssize_t) index)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Like [`PyList_GetItemRef()`](#c.PyList_GetItemRef), but returns a
[borrowed reference](../glossary.md#term-borrowed-reference) instead of a [strong reference](../glossary.md#term-strong-reference).

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), the returned
[borrowed reference](../glossary.md#term-borrowed-reference) may become invalid if another thread modifies
the list concurrently. Prefer [`PyList_GetItemRef()`](#c.PyList_GetItemRef), which returns
a [strong reference](../glossary.md#term-strong-reference).

### [PyObject](structures.md#c.PyObject) \*PyList_GET_ITEM([PyObject](structures.md#c.PyObject) \*list, [Py_ssize_t](intro.md#c.Py_ssize_t) i)

*Return value: Borrowed reference.* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Similar to [`PyList_GetItem()`](#c.PyList_GetItem), but without error checking.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), the returned
[borrowed reference](../glossary.md#term-borrowed-reference) may become invalid if another thread modifies
the list concurrently. Prefer [`PyList_GetItemRef()`](#c.PyList_GetItemRef), which returns
a [strong reference](../glossary.md#term-strong-reference).

### int PyList_SetItem([PyObject](structures.md#c.PyObject) \*list, [Py_ssize_t](intro.md#c.Py_ssize_t) index, [PyObject](structures.md#c.PyObject) \*item)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Set the item at index *index* in list to *item*.  Return `0` on success.
If *index* is out of bounds, return `-1` and set an [`IndexError`](../library/exceptions.md#IndexError)
exception.

#### NOTE
This function “steals” a reference to *item* and discards a reference to
an item already in the list at the affected position.

### void PyList_SET_ITEM([PyObject](structures.md#c.PyObject) \*list, [Py_ssize_t](intro.md#c.Py_ssize_t) i, [PyObject](structures.md#c.PyObject) \*o)

 *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Macro form of [`PyList_SetItem()`](#c.PyList_SetItem) without error checking. This is
normally only used to fill in new lists where there is no previous content.

Bounds checking is performed as an assertion if Python is built in
[debug mode](../using/configure.md#debug-build) or [`with assertions`](../using/configure.md#cmdoption-with-assertions).

#### NOTE
This macro “steals” a reference to *item*, and, unlike
[`PyList_SetItem()`](#c.PyList_SetItem), does *not* discard a reference to any item that
is being replaced; any reference in *list* at position *i* will be
leaked.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), this macro has no internal
synchronization. It is normally only used to fill in new lists where no
other thread has a reference to the list. If the list may be shared,
use [`PyList_SetItem()`](#c.PyList_SetItem) instead, which uses a [per-object
lock](../glossary.md#term-per-object-lock).

### int PyList_Insert([PyObject](structures.md#c.PyObject) \*list, [Py_ssize_t](intro.md#c.Py_ssize_t) index, [PyObject](structures.md#c.PyObject) \*item)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Insert the item *item* into list *list* in front of index *index*.  Return
`0` if successful; return `-1` and set an exception if unsuccessful.
Analogous to `list.insert(index, item)`.

### int PyList_Append([PyObject](structures.md#c.PyObject) \*list, [PyObject](structures.md#c.PyObject) \*item)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Append the object *item* at the end of list *list*. Return `0` if
successful; return `-1` and set an exception if unsuccessful.  Analogous
to `list.append(item)`.

### [PyObject](structures.md#c.PyObject) \*PyList_GetSlice([PyObject](structures.md#c.PyObject) \*list, [Py_ssize_t](intro.md#c.Py_ssize_t) low, [Py_ssize_t](intro.md#c.Py_ssize_t) high)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a list of the objects in *list* containing the objects *between* *low*
and *high*.  Return `NULL` and set an exception if unsuccessful.  Analogous
to `list[low:high]`.  Indexing from the end of the list is not supported.

### int PyList_SetSlice([PyObject](structures.md#c.PyObject) \*list, [Py_ssize_t](intro.md#c.Py_ssize_t) low, [Py_ssize_t](intro.md#c.Py_ssize_t) high, [PyObject](structures.md#c.PyObject) \*itemlist)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Set the slice of *list* between *low* and *high* to the contents of
*itemlist*.  Analogous to `list[low:high] = itemlist`. The *itemlist* may
be `NULL`, indicating the assignment of an empty list (slice deletion).
Return `0` on success, `-1` on failure.  Indexing from the end of the
list is not supported.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), when *itemlist* is a [`list`](../library/stdtypes.md#list),
both *list* and *itemlist* are locked for the duration of the operation.
For other iterables (or `NULL`), only *list* is locked.

### int PyList_Extend([PyObject](structures.md#c.PyObject) \*list, [PyObject](structures.md#c.PyObject) \*iterable)

 *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Extend *list* with the contents of *iterable*.  This is the same as
`PyList_SetSlice(list, PY_SSIZE_T_MAX, PY_SSIZE_T_MAX, iterable)`
and analogous to `list.extend(iterable)` or `list += iterable`.

Raise an exception and return `-1` if *list* is not a [`list`](../library/stdtypes.md#list)
object. Return 0 on success.

#### Versionadded
Added in version 3.13.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), when *iterable* is a [`list`](../library/stdtypes.md#list),
[`set`](../library/stdtypes.md#set), [`dict`](../library/stdtypes.md#dict), or dict view, both *list* and *iterable*
(or its underlying dict) are locked for the duration of the operation.
For other iterables, only *list* is locked; *iterable* may be
concurrently modified by another thread.

### int PyList_Clear([PyObject](structures.md#c.PyObject) \*list)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Remove all items from *list*.  This is the same as
`PyList_SetSlice(list, 0, PY_SSIZE_T_MAX, NULL)` and analogous to
`list.clear()` or `del list[:]`.

Raise an exception and return `-1` if *list* is not a [`list`](../library/stdtypes.md#list)
object.  Return 0 on success.

#### Versionadded
Added in version 3.13.

### int PyList_Sort([PyObject](structures.md#c.PyObject) \*list)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Sort the items of *list* in place.  Return `0` on success, `-1` on
failure.  This is equivalent to `list.sort()`.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), element comparison via
[`__lt__()`](../reference/datamodel.md#object.__lt__) can execute arbitrary Python code, during which
the [per-object lock](../glossary.md#term-per-object-lock) may be temporarily released. For built-in
types ([`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float)), the lock is not
released during comparison.

### int PyList_Reverse([PyObject](structures.md#c.PyObject) \*list)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Reverse the items of *list* in place.  Return `0` on success, `-1` on
failure.  This is the equivalent of `list.reverse()`.

### [PyObject](structures.md#c.PyObject) \*PyList_AsTuple([PyObject](structures.md#c.PyObject) \*list)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

<a id="index-2"></a>

Return a new tuple object containing the contents of *list*; equivalent to
`tuple(list)`.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
