<a id="mapping"></a>

# Mapping Protocol

See also [`PyObject_GetItem()`](object.md#c.PyObject_GetItem), [`PyObject_SetItem()`](object.md#c.PyObject_SetItem) and
[`PyObject_DelItem()`](object.md#c.PyObject_DelItem).

### int PyMapping_Check([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).*

Return `1` if the object provides the mapping protocol or supports slicing,
and `0` otherwise.  Note that it returns `1` for Python classes with
a [`__getitem__()`](../reference/datamodel.md#object.__getitem__) method, since in general it is impossible to
determine what type of keys the class supports. This function always succeeds.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyMapping_Size([PyObject](structures.md#c.PyObject) \*o)

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyMapping_Length([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).*

<a id="index-0"></a>

Returns the number of keys in object *o* on success, and `-1` on failure.
This is equivalent to the Python expression `len(o)`.

### [PyObject](structures.md#c.PyObject) \*PyMapping_GetItemString([PyObject](structures.md#c.PyObject) \*o, const char \*key)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

This is the same as [`PyObject_GetItem()`](object.md#c.PyObject_GetItem), but *key* is
specified as a  UTF-8 encoded bytes string,
rather than a .

### int PyMapping_GetOptionalItem([PyObject](structures.md#c.PyObject) \*obj, [PyObject](structures.md#c.PyObject) \*key, [PyObject](structures.md#c.PyObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Variant of [`PyObject_GetItem()`](object.md#c.PyObject_GetItem) which doesn’t raise
[`KeyError`](../library/exceptions.md#KeyError) if the key is not found.

If the key is found, return `1` and set  *\*result* to a new
[strong reference](../glossary.md#term-strong-reference) to the corresponding value.
If the key is not found, return `0` and set  *\*result* to `NULL`;
the [`KeyError`](../library/exceptions.md#KeyError) is silenced.
If an error other than [`KeyError`](../library/exceptions.md#KeyError) is raised, return `-1` and
set  *\*result* to `NULL`.

#### Versionadded
Added in version 3.13.

### int PyMapping_GetOptionalItemString([PyObject](structures.md#c.PyObject) \*obj, const char \*key, [PyObject](structures.md#c.PyObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

This is the same as [`PyMapping_GetOptionalItem()`](#c.PyMapping_GetOptionalItem), but *key* is
specified as a  UTF-8 encoded bytes string,
rather than a .

#### Versionadded
Added in version 3.13.

### int PyMapping_SetItemString([PyObject](structures.md#c.PyObject) \*o, const char \*key, [PyObject](structures.md#c.PyObject) \*v)

 *Part of the [Stable ABI](stable.md#stable).*

This is the same as [`PyObject_SetItem()`](object.md#c.PyObject_SetItem), but *key* is
specified as a  UTF-8 encoded bytes string,
rather than a .

### int PyMapping_DelItem([PyObject](structures.md#c.PyObject) \*o, [PyObject](structures.md#c.PyObject) \*key)

This is an alias of [`PyObject_DelItem()`](object.md#c.PyObject_DelItem).

### int PyMapping_DelItemString([PyObject](structures.md#c.PyObject) \*o, const char \*key)

This is the same as [`PyObject_DelItem()`](object.md#c.PyObject_DelItem), but *key* is
specified as a  UTF-8 encoded bytes string,
rather than a .

### int PyMapping_HasKeyWithError([PyObject](structures.md#c.PyObject) \*o, [PyObject](structures.md#c.PyObject) \*key)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Return `1` if the mapping object has the key *key* and `0` otherwise.
This is equivalent to the Python expression `key in o`.
On failure, return `-1`.

#### Versionadded
Added in version 3.13.

### int PyMapping_HasKeyStringWithError([PyObject](structures.md#c.PyObject) \*o, const char \*key)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

This is the same as [`PyMapping_HasKeyWithError()`](#c.PyMapping_HasKeyWithError), but *key* is
specified as a  UTF-8 encoded bytes string,
rather than a .

#### Versionadded
Added in version 3.13.

### int PyMapping_HasKey([PyObject](structures.md#c.PyObject) \*o, [PyObject](structures.md#c.PyObject) \*key)

 *Part of the [Stable ABI](stable.md#stable).*

Return `1` if the mapping object has the key *key* and `0` otherwise.
This is equivalent to the Python expression `key in o`.
This function always succeeds.

#### NOTE
Exceptions which occur when this calls the [`__getitem__()`](../reference/datamodel.md#object.__getitem__)
method are silently ignored.
For proper error handling, use [`PyMapping_HasKeyWithError()`](#c.PyMapping_HasKeyWithError),
[`PyMapping_GetOptionalItem()`](#c.PyMapping_GetOptionalItem) or [`PyObject_GetItem()`](object.md#c.PyObject_GetItem) instead.

### int PyMapping_HasKeyString([PyObject](structures.md#c.PyObject) \*o, const char \*key)

 *Part of the [Stable ABI](stable.md#stable).*

This is the same as [`PyMapping_HasKey()`](#c.PyMapping_HasKey), but *key* is
specified as a  UTF-8 encoded bytes string,
rather than a .

#### NOTE
Exceptions that occur when this calls the [`__getitem__()`](../reference/datamodel.md#object.__getitem__)
method or while creating the temporary [`str`](../library/stdtypes.md#str)
object are silently ignored.
For proper error handling, use [`PyMapping_HasKeyStringWithError()`](#c.PyMapping_HasKeyStringWithError),
[`PyMapping_GetOptionalItemString()`](#c.PyMapping_GetOptionalItemString) or
[`PyMapping_GetItemString()`](#c.PyMapping_GetItemString) instead.

### [PyObject](structures.md#c.PyObject) \*PyMapping_Keys([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

On success, return a list of the keys in object *o*.  On failure, return
`NULL`.

#### Versionchanged
Changed in version 3.7: Previously, the function returned a list or a tuple.

### [PyObject](structures.md#c.PyObject) \*PyMapping_Values([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

On success, return a list of the values in object *o*.  On failure, return
`NULL`.

#### Versionchanged
Changed in version 3.7: Previously, the function returned a list or a tuple.

### [PyObject](structures.md#c.PyObject) \*PyMapping_Items([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

On success, return a list of the items in object *o*, where each item is a
tuple containing a key-value pair.  On failure, return `NULL`.

#### Versionchanged
Changed in version 3.7: Previously, the function returned a list or a tuple.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
