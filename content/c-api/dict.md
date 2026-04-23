<a id="dictobjects"></a>

# Dictionary objects

<a id="index-0"></a>

### type PyDictObject

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python dictionary object.

### [PyTypeObject](type.md#c.PyTypeObject) PyDict_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python dictionary
type.  This is the same object as [`dict`](../library/stdtypes.md#dict) in the Python layer.

### int PyDict_Check([PyObject](structures.md#c.PyObject) \*p)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return true if *p* is a dict object or an instance of a subtype of the dict
type.  This function always succeeds.

### int PyDict_CheckExact([PyObject](structures.md#c.PyObject) \*p)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return true if *p* is a dict object, but not an instance of a subtype of
the dict type.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyDict_New()

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a new empty dictionary, or `NULL` on failure.

### [PyObject](structures.md#c.PyObject) \*PyDictProxy_New([PyObject](structures.md#c.PyObject) \*mapping)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a [`types.MappingProxyType`](../library/types.md#types.MappingProxyType) object for a mapping which
enforces read-only behavior.  This is normally used to create a view to
prevent modification of the dictionary for non-dynamic class types.

The first argument can be a [`dict`](../library/stdtypes.md#dict), a [`frozendict`](../library/stdtypes.md#frozendict), or a
mapping.

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [PyTypeObject](type.md#c.PyTypeObject) PyDictProxy_Type

 *Part of the [Stable ABI](stable.md#stable).*

The type object for mapping proxy objects created by
[`PyDictProxy_New()`](#c.PyDictProxy_New) and for the read-only `__dict__` attribute
of many built-in types. A [`PyDictProxy_Type`](#c.PyDictProxy_Type) instance provides a
dynamic, read-only view of an underlying dictionary: changes to the
underlying dictionary are reflected in the proxy, but the proxy itself
does not support mutation operations. This corresponds to
[`types.MappingProxyType`](../library/types.md#types.MappingProxyType) in Python.

### void PyDict_Clear([PyObject](structures.md#c.PyObject) \*p)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Empty an existing dictionary of all key-value pairs.

Do nothing if the argument is not a [`dict`](../library/stdtypes.md#dict) or a `dict`
subclass.

### int PyDict_Contains([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Determine if dictionary *p* contains *key*.  If an item in *p* matches
*key*, return `1`, otherwise return `0`.  On error, return `-1`.
This is equivalent to the Python expression `key in p`.

The first argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### int PyDict_ContainsString([PyObject](structures.md#c.PyObject) \*p, const char \*key)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

This is the same as [`PyDict_Contains()`](#c.PyDict_Contains), but *key* is specified as a
 UTF-8 encoded bytes string, rather than a
.

The first argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

#### Versionadded
Added in version 3.13.

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [PyObject](structures.md#c.PyObject) \*PyDict_Copy([PyObject](structures.md#c.PyObject) \*p)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a new dictionary that contains the same key-value pairs as *p*.

### int PyDict_SetItem([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key, [PyObject](structures.md#c.PyObject) \*val)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Insert *val* into the dictionary *p* with a key of *key*.  *key* must be
[hashable](../glossary.md#term-hashable); if it isn’t, [`TypeError`](../library/exceptions.md#TypeError) will be raised. Return
`0` on success or `-1` on failure.  This function *does not* steal a
reference to *val*.

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

### int PyDict_SetItemString([PyObject](structures.md#c.PyObject) \*p, const char \*key, [PyObject](structures.md#c.PyObject) \*val)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

This is the same as [`PyDict_SetItem()`](#c.PyDict_SetItem), but *key* is
specified as a  UTF-8 encoded bytes string,
rather than a .

### int PyDict_DelItem([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Remove the entry in dictionary *p* with key *key*. *key* must be [hashable](../glossary.md#term-hashable);
if it isn’t, [`TypeError`](../library/exceptions.md#TypeError) is raised.
If *key* is not in the dictionary, [`KeyError`](../library/exceptions.md#KeyError) is raised.
Return `0` on success or `-1` on failure.

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

### int PyDict_DelItemString([PyObject](structures.md#c.PyObject) \*p, const char \*key)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

This is the same as [`PyDict_DelItem()`](#c.PyDict_DelItem), but *key* is
specified as a  UTF-8 encoded bytes string,
rather than a .

### int PyDict_GetItemRef([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key, [PyObject](structures.md#c.PyObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Return a new [strong reference](../glossary.md#term-strong-reference) to the object from dictionary *p*
which has a key *key*:

* If the key is present, set  *\*result* to a new [strong reference](../glossary.md#term-strong-reference)
  to the value and return `1`.
* If the key is missing, set  *\*result* to `NULL` and return `0`.
* On error, raise an exception and return `-1`.

The first argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

#### Versionadded
Added in version 3.13.

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

See also the [`PyObject_GetItem()`](object.md#c.PyObject_GetItem) function.

### [PyObject](structures.md#c.PyObject) \*PyDict_GetItem([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Return a [borrowed reference](../glossary.md#term-borrowed-reference) to the object from dictionary *p* which
has a key *key*.  Return `NULL` if the key *key* is missing *without*
setting an exception.

The first argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

#### NOTE
Exceptions that occur while this calls [`__hash__()`](../reference/datamodel.md#object.__hash__) and
[`__eq__()`](../reference/datamodel.md#object.__eq__) methods are silently ignored.
Prefer the [`PyDict_GetItemWithError()`](#c.PyDict_GetItemWithError) function instead.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), the returned
[borrowed reference](../glossary.md#term-borrowed-reference) may become invalid if another thread modifies
the dictionary concurrently. Prefer [`PyDict_GetItemRef()`](#c.PyDict_GetItemRef), which
returns a [strong reference](../glossary.md#term-strong-reference).

#### Versionchanged
Changed in version 3.10: Calling this API without an [attached thread state](../glossary.md#term-attached-thread-state) had been allowed for historical
reason. It is no longer allowed.

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [PyObject](structures.md#c.PyObject) \*PyDict_GetItemWithError([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Variant of [`PyDict_GetItem()`](#c.PyDict_GetItem) that does not suppress
exceptions. Return `NULL` **with** an exception set if an exception
occurred.  Return `NULL` **without** an exception set if the key
wasn’t present.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), the returned
[borrowed reference](../glossary.md#term-borrowed-reference) may become invalid if another thread modifies
the dictionary concurrently. Prefer [`PyDict_GetItemRef()`](#c.PyDict_GetItemRef), which
returns a [strong reference](../glossary.md#term-strong-reference).

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [PyObject](structures.md#c.PyObject) \*PyDict_GetItemString([PyObject](structures.md#c.PyObject) \*p, const char \*key)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

This is the same as [`PyDict_GetItem()`](#c.PyDict_GetItem), but *key* is specified as a
 UTF-8 encoded bytes string, rather than a
.

#### NOTE
Exceptions that occur while this calls [`__hash__()`](../reference/datamodel.md#object.__hash__) and
[`__eq__()`](../reference/datamodel.md#object.__eq__) methods or while creating the temporary [`str`](../library/stdtypes.md#str)
object are silently ignored.
Prefer using the [`PyDict_GetItemWithError()`](#c.PyDict_GetItemWithError) function with your own
[`PyUnicode_FromString()`](unicode.md#c.PyUnicode_FromString) *key* instead.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), the returned
[borrowed reference](../glossary.md#term-borrowed-reference) may become invalid if another thread modifies
the dictionary concurrently. Prefer [`PyDict_GetItemStringRef()`](#c.PyDict_GetItemStringRef),
which returns a [strong reference](../glossary.md#term-strong-reference).

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### int PyDict_GetItemStringRef([PyObject](structures.md#c.PyObject) \*p, const char \*key, [PyObject](structures.md#c.PyObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Similar to [`PyDict_GetItemRef()`](#c.PyDict_GetItemRef), but *key* is specified as a
 UTF-8 encoded bytes string, rather than a
.

#### Versionadded
Added in version 3.13.

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [PyObject](structures.md#c.PyObject) \*PyDict_SetDefault([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key, [PyObject](structures.md#c.PyObject) \*defaultobj)

*Return value: Borrowed reference.* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

This is the same as the Python-level [`dict.setdefault()`](../library/stdtypes.md#dict.setdefault).  If present, it
returns the value corresponding to *key* from the dictionary *p*.  If the key
is not in the dict, it is inserted with value *defaultobj* and *defaultobj*
is returned.  This function evaluates the hash function of *key* only once,
instead of evaluating it independently for the lookup and the insertion.

#### Versionadded
Added in version 3.4.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), the returned
[borrowed reference](../glossary.md#term-borrowed-reference) may become invalid if another thread modifies
the dictionary concurrently. Prefer [`PyDict_SetDefaultRef()`](#c.PyDict_SetDefaultRef),
which returns a [strong reference](../glossary.md#term-strong-reference).

### int PyDict_SetDefaultRef([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key, [PyObject](structures.md#c.PyObject) \*default_value, [PyObject](structures.md#c.PyObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Inserts *default_value* into the dictionary *p* with a key of *key* if the
key is not already present in the dictionary. If *result* is not `NULL`,
then  *\*result* is set to a [strong reference](../glossary.md#term-strong-reference) to either
*default_value*, if the key was not present, or the existing value, if *key*
was already present in the dictionary.
Returns `1` if the key was present and *default_value* was not inserted,
or `0` if the key was not present and *default_value* was inserted.
On failure, returns `-1`, sets an exception, and sets `*result`
to `NULL`.

For clarity: if you have a strong reference to *default_value* before
calling this function, then after it returns, you hold a strong reference
to both *default_value* and  *\*result* (if it’s not `NULL`).
These may refer to the same object: in that case you hold two separate
references to it.

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

#### Versionadded
Added in version 3.13.

### int PyDict_Pop([PyObject](structures.md#c.PyObject) \*p, [PyObject](structures.md#c.PyObject) \*key, [PyObject](structures.md#c.PyObject) \*\*result)

 *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Remove *key* from dictionary *p* and optionally return the removed value.
Do not raise [`KeyError`](../library/exceptions.md#KeyError) if the key is missing.

- If the key is present, set  *\*result* to a new reference to the removed
  value if *result* is not `NULL`, and return `1`.
- If the key is missing, set  *\*result* to `NULL` if *result* is not
  `NULL`, and return `0`.
- On error, raise an exception and return `-1`.

Similar to [`dict.pop()`](../library/stdtypes.md#dict.pop), but without the default value and
not raising [`KeyError`](../library/exceptions.md#KeyError) if the key is missing.

#### NOTE
The operation is atomic on [free threading](../glossary.md#term-free-threaded-build)
when *key* is [`str`](../library/stdtypes.md#str), [`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`bool`](../library/functions.md#bool) or [`bytes`](../library/stdtypes.md#bytes).

#### Versionadded
Added in version 3.13.

### int PyDict_PopString([PyObject](structures.md#c.PyObject) \*p, const char \*key, [PyObject](structures.md#c.PyObject) \*\*result)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Similar to [`PyDict_Pop()`](#c.PyDict_Pop), but *key* is specified as a
 UTF-8 encoded bytes string, rather than a
.

#### Versionadded
Added in version 3.13.

### [PyObject](structures.md#c.PyObject) \*PyDict_Items([PyObject](structures.md#c.PyObject) \*p)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a [`PyListObject`](list.md#c.PyListObject) containing all the items from the dictionary.

The first argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [PyObject](structures.md#c.PyObject) \*PyDict_Keys([PyObject](structures.md#c.PyObject) \*p)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a [`PyListObject`](list.md#c.PyListObject) containing all the keys from the dictionary.

The first argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [PyObject](structures.md#c.PyObject) \*PyDict_Values([PyObject](structures.md#c.PyObject) \*p)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Return a [`PyListObject`](list.md#c.PyListObject) containing all the values from the dictionary
*p*.

The first argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyDict_Size([PyObject](structures.md#c.PyObject) \*p)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

<a id="index-1"></a>

Return the number of items in the dictionary.  This is equivalent to
`len(p)` on a dictionary.

The argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyDict_GET_SIZE([PyObject](structures.md#c.PyObject) \*p)

 *Thread safety: [Atomic](../library/threadsafety.md#threadsafety-level-atomic).*

Similar to [`PyDict_Size()`](#c.PyDict_Size), but without error checking.

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### int PyDict_Next([PyObject](structures.md#c.PyObject) \*p, [Py_ssize_t](intro.md#c.Py_ssize_t) \*ppos, [PyObject](structures.md#c.PyObject) \*\*pkey, [PyObject](structures.md#c.PyObject) \*\*pvalue)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Iterate over all key-value pairs in the dictionary *p*.  The
[`Py_ssize_t`](intro.md#c.Py_ssize_t) referred to by *ppos* must be initialized to `0`
prior to the first call to this function to start the iteration; the
function returns true for each pair in the dictionary, and false once all
pairs have been reported.  The parameters *pkey* and *pvalue* should either
point to  variables that will be filled in with each key
and value, respectively, or may be `NULL`.  Any references returned through
them are borrowed.  *ppos* should not be altered during iteration. Its
value represents offsets within the internal dictionary structure, and
since the structure is sparse, the offsets are not consecutive.

The first argument can be a [`dict`](../library/stdtypes.md#dict) or a [`frozendict`](../library/stdtypes.md#frozendict).

For example:

```c
PyObject *key, *value;
Py_ssize_t pos = 0;

while (PyDict_Next(self->dict, &pos, &key, &value)) {
    /* do something interesting with the values... */
    ...
}
```

The dictionary *p* should not be mutated during iteration.  It is safe to
modify the values of the keys as you iterate over the dictionary, but only
so long as the set of keys does not change.  For example:

```c
PyObject *key, *value;
Py_ssize_t pos = 0;

while (PyDict_Next(self->dict, &pos, &key, &value)) {
    long i = PyLong_AsLong(value);
    if (i == -1 && PyErr_Occurred()) {
        return -1;
    }
    PyObject *o = PyLong_FromLong(i + 1);
    if (o == NULL)
        return -1;
    if (PyDict_SetItem(self->dict, key, o) < 0) {
        Py_DECREF(o);
        return -1;
    }
    Py_DECREF(o);
}
```

The function is not thread-safe in the [free-threaded](../glossary.md#term-free-threading)
build without external synchronization for a mutable [`dict`](../library/stdtypes.md#dict). You can use
[`Py_BEGIN_CRITICAL_SECTION`](synchronization.md#c.Py_BEGIN_CRITICAL_SECTION) to lock the dictionary while iterating
over it:

```c
Py_BEGIN_CRITICAL_SECTION(self->dict);
while (PyDict_Next(self->dict, &pos, &key, &value)) {
    ...
}
Py_END_CRITICAL_SECTION();
```

The function is thread-safe on a [`frozendict`](../library/stdtypes.md#frozendict).

#### NOTE
On the free-threaded build, this function can be used safely inside a
critical section. However, the references returned for *pkey* and *pvalue*
are [borrowed](../glossary.md#term-borrowed-reference) and are only valid while the
critical section is held. If you need to use these objects outside the
critical section or when the critical section can be suspended, create a
[strong reference](../glossary.md#term-strong-reference) (for example, using
[`Py_NewRef()`](refcounting.md#c.Py_NewRef)).

#### Versionchanged
Changed in version 3.15: Also accept [`frozendict`](../library/stdtypes.md#frozendict).

### int PyDict_Merge([PyObject](structures.md#c.PyObject) \*a, [PyObject](structures.md#c.PyObject) \*b, int override)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Iterate over mapping object *b* adding key-value pairs to dictionary *a*.
*b* may be a dictionary, or any object supporting [`PyMapping_Keys()`](mapping.md#c.PyMapping_Keys)
and [`PyObject_GetItem()`](object.md#c.PyObject_GetItem). If *override* is true, existing pairs in *a*
will be replaced if a matching key is found in *b*, otherwise pairs will
only be added if there is not a matching key in *a*. Return `0` on
success or `-1` if an exception was raised.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), when *b* is a
[`dict`](../library/stdtypes.md#dict) (with the standard iterator), both *a* and *b* are locked
for the duration of the operation. When *b* is a non-dict mapping, only
*a* is locked; *b* may be concurrently modified by another thread.

### int PyDict_Update([PyObject](structures.md#c.PyObject) \*a, [PyObject](structures.md#c.PyObject) \*b)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

This is the same as `PyDict_Merge(a, b, 1)` in C, and is similar to
`a.update(b)` in Python except that [`PyDict_Update()`](#c.PyDict_Update) doesn’t fall
back to the iterating over a sequence of key value pairs if the second
argument has no “keys” attribute.  Return `0` on success or `-1` if an
exception was raised.

#### NOTE
In the [free-threaded build](../glossary.md#term-free-threaded-build), when *b* is a
[`dict`](../library/stdtypes.md#dict) (with the standard iterator), both *a* and *b* are locked
for the duration of the operation. When *b* is a non-dict mapping, only
*a* is locked; *b* may be concurrently modified by another thread.

### int PyDict_MergeFromSeq2([PyObject](structures.md#c.PyObject) \*a, [PyObject](structures.md#c.PyObject) \*seq2, int override)

 *Part of the [Stable ABI](stable.md#stable).* *Thread safety: [Safe for concurrent use on the same object](../library/threadsafety.md#threadsafety-level-shared).*

Update or merge into dictionary *a*, from the key-value pairs in *seq2*.
*seq2* must be an iterable object producing iterable objects of length 2,
viewed as key-value pairs.  In case of duplicate keys, the last wins if
*override* is true, else the first wins. Return `0` on success or `-1`
if an exception was raised. Equivalent Python (except for the return
value):

```c
def PyDict_MergeFromSeq2(a, seq2, override):
    for key, value in seq2:
        if override or key not in a:
            a[key] = value
```

#### NOTE
In the [free-threaded](../glossary.md#term-free-threading) build, only *a* is locked.
The iteration over *seq2* is not synchronized; *seq2* may be concurrently
modified by another thread.

### int PyDict_AddWatcher([PyDict_WatchCallback](#c.PyDict_WatchCallback) callback)

 *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Register *callback* as a dictionary watcher. Return a non-negative integer
id which must be passed to future calls to [`PyDict_Watch()`](#c.PyDict_Watch). In case
of error (e.g. no more watcher IDs available), return `-1` and set an
exception.

#### NOTE
This function is not internally synchronized. In the
[free-threaded](../glossary.md#term-free-threading) build, callers should ensure no
concurrent calls to [`PyDict_AddWatcher()`](#c.PyDict_AddWatcher) or
[`PyDict_ClearWatcher()`](#c.PyDict_ClearWatcher) are in progress.

#### Versionadded
Added in version 3.12.

### int PyDict_ClearWatcher(int watcher_id)

 *Thread safety: [Safe to call from multiple threads with external synchronization only](../library/threadsafety.md#threadsafety-level-compatible).*

Clear watcher identified by *watcher_id* previously returned from
[`PyDict_AddWatcher()`](#c.PyDict_AddWatcher). Return `0` on success, `-1` on error (e.g.
if the given *watcher_id* was never registered.)

#### NOTE
This function is not internally synchronized. In the
[free-threaded](../glossary.md#term-free-threading) build, callers should ensure no
concurrent calls to [`PyDict_AddWatcher()`](#c.PyDict_AddWatcher) or
[`PyDict_ClearWatcher()`](#c.PyDict_ClearWatcher) are in progress.

#### Versionadded
Added in version 3.12.

### int PyDict_Watch(int watcher_id, [PyObject](structures.md#c.PyObject) \*dict)

 *Thread safety: [Safe to call without external synchronization on distinct objects](../library/threadsafety.md#threadsafety-level-distinct).*

Mark dictionary *dict* as watched. The callback granted *watcher_id* by
[`PyDict_AddWatcher()`](#c.PyDict_AddWatcher) will be called when *dict* is modified or
deallocated. Return `0` on success or `-1` on error.

#### Versionadded
Added in version 3.12.

### int PyDict_Unwatch(int watcher_id, [PyObject](structures.md#c.PyObject) \*dict)

 *Thread safety: [Safe to call without external synchronization on distinct objects](../library/threadsafety.md#threadsafety-level-distinct).*

Mark dictionary *dict* as no longer watched. The callback granted
*watcher_id* by [`PyDict_AddWatcher()`](#c.PyDict_AddWatcher) will no longer be called when
*dict* is modified or deallocated. The dict must previously have been
watched by this watcher. Return `0` on success or `-1` on error.

#### Versionadded
Added in version 3.12.

### type PyDict_WatchEvent

Enumeration of possible dictionary watcher events: `PyDict_EVENT_ADDED`,
`PyDict_EVENT_MODIFIED`, `PyDict_EVENT_DELETED`, `PyDict_EVENT_CLONED`,
`PyDict_EVENT_CLEARED`, or `PyDict_EVENT_DEALLOCATED`.

#### Versionadded
Added in version 3.12.

### typedef int (\*PyDict_WatchCallback)([PyDict_WatchEvent](#c.PyDict_WatchEvent) event, [PyObject](structures.md#c.PyObject) \*dict, [PyObject](structures.md#c.PyObject) \*key, [PyObject](structures.md#c.PyObject) \*new_value)

Type of a dict watcher callback function.

If *event* is `PyDict_EVENT_CLEARED` or `PyDict_EVENT_DEALLOCATED`, both
*key* and *new_value* will be `NULL`. If *event* is `PyDict_EVENT_ADDED`
or `PyDict_EVENT_MODIFIED`, *new_value* will be the new value for *key*.
If *event* is `PyDict_EVENT_DELETED`, *key* is being deleted from the
dictionary and *new_value* will be `NULL`.

`PyDict_EVENT_CLONED` occurs when *dict* was previously empty and another
dict is merged into it. To maintain efficiency of this operation, per-key
`PyDict_EVENT_ADDED` events are not issued in this case; instead a
single `PyDict_EVENT_CLONED` is issued, and *key* will be the source
dictionary.

The callback may inspect but must not modify *dict*; doing so could have
unpredictable effects, including infinite recursion. Do not trigger Python
code execution in the callback, as it could modify the dict as a side effect.

If *event* is `PyDict_EVENT_DEALLOCATED`, taking a new reference in the
callback to the about-to-be-destroyed dictionary will resurrect it and
prevent it from being freed at this time. When the resurrected object is
destroyed later, any watcher callbacks active at that time will be called
again.

Callbacks occur before the notified modification to *dict* takes place, so
the prior state of *dict* can be inspected.

If the callback sets an exception, it must return `-1`; this exception will
be printed as an unraisable exception using [`PyErr_WriteUnraisable()`](exceptions.md#c.PyErr_WriteUnraisable).
Otherwise it should return `0`.

There may already be a pending exception set on entry to the callback. In
this case, the callback should return `0` with the same exception still
set. This means the callback may not call any other API that can set an
exception unless it saves and clears the exception state first, and restores
it before returning.

#### Versionadded
Added in version 3.12.

## Dictionary view objects

### int PyDictViewSet_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if *op* is a view of a set inside a dictionary. This is currently
equivalent to . This
function always succeeds.

### [PyTypeObject](type.md#c.PyTypeObject) PyDictKeys_Type

 *Part of the [Stable ABI](stable.md#stable).*

Type object for a view of dictionary keys. In Python, this is the type of
the object returned by [`dict.keys()`](../library/stdtypes.md#dict.keys).

### int PyDictKeys_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if *op* is an instance of a dictionary keys view. This function
always succeeds.

### [PyTypeObject](type.md#c.PyTypeObject) PyDictValues_Type

 *Part of the [Stable ABI](stable.md#stable).*

Type object for a view of dictionary values. In Python, this is the type of
the object returned by [`dict.values()`](../library/stdtypes.md#dict.values).

### int PyDictValues_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if *op* is an instance of a dictionary values view. This function
always succeeds.

### [PyTypeObject](type.md#c.PyTypeObject) PyDictItems_Type

 *Part of the [Stable ABI](stable.md#stable).*

Type object for a view of dictionary items. In Python, this is the type of
the object returned by [`dict.items()`](../library/stdtypes.md#dict.items).

### int PyDictItems_Check([PyObject](structures.md#c.PyObject) \*op)

Return true if *op* is an instance of a dictionary items view. This function
always succeeds.

## Frozen dictionary objects

#### Versionadded
Added in version 3.15.

### [PyTypeObject](type.md#c.PyTypeObject) PyFrozenDict_Type

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python frozen
dictionary type.
This is the same object as [`frozendict`](../library/stdtypes.md#frozendict) in the Python layer.

### int PyAnyDict_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`dict`](../library/stdtypes.md#dict) object, a [`frozendict`](../library/stdtypes.md#frozendict) object,
or an instance of a subtype of the `dict` or `frozendict`
type.
This function always succeeds.

### int PyAnyDict_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`dict`](../library/stdtypes.md#dict) object or a [`frozendict`](../library/stdtypes.md#frozendict) object,
but not an instance of a subtype of the `dict` or
`frozendict` type.
This function always succeeds.

### int PyFrozenDict_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`frozendict`](../library/stdtypes.md#frozendict) object or an instance of a
subtype of the `frozendict` type.
This function always succeeds.

### int PyFrozenDict_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if *p* is a [`frozendict`](../library/stdtypes.md#frozendict) object, but not an instance of a
subtype of the `frozendict` type.
This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyFrozenDict_New([PyObject](structures.md#c.PyObject) \*iterable)

Return a new [`frozendict`](../library/stdtypes.md#frozendict) from an iterable, or `NULL` on failure
with an exception set.

Create an empty dictionary if *iterable* is `NULL`.

## Ordered dictionaries

Python’s C API provides interface for [`collections.OrderedDict`](../library/collections.md#collections.OrderedDict) from C.
Since Python 3.7, dictionaries are ordered by default, so there is usually
little need for these functions; prefer `PyDict*` where possible.

### [PyTypeObject](type.md#c.PyTypeObject) PyODict_Type

Type object for ordered dictionaries. This is the same object as
[`collections.OrderedDict`](../library/collections.md#collections.OrderedDict) in the Python layer.

### int PyODict_Check([PyObject](structures.md#c.PyObject) \*od)

Return true if *od* is an ordered dictionary object or an instance of a
subtype of the [`OrderedDict`](../library/collections.md#collections.OrderedDict) type.  This function
always succeeds.

### int PyODict_CheckExact([PyObject](structures.md#c.PyObject) \*od)

Return true if *od* is an ordered dictionary object, but not an instance of
a subtype of the [`OrderedDict`](../library/collections.md#collections.OrderedDict) type.
This function always succeeds.

### [PyTypeObject](type.md#c.PyTypeObject) PyODictKeys_Type

Analogous to [`PyDictKeys_Type`](#c.PyDictKeys_Type) for ordered dictionaries.

### [PyTypeObject](type.md#c.PyTypeObject) PyODictValues_Type

Analogous to [`PyDictValues_Type`](#c.PyDictValues_Type) for ordered dictionaries.

### [PyTypeObject](type.md#c.PyTypeObject) PyODictItems_Type

Analogous to [`PyDictItems_Type`](#c.PyDictItems_Type) for ordered dictionaries.

### [PyObject](structures.md#c.PyObject) \*PyODict_New(void)

Return a new empty ordered dictionary, or `NULL` on failure.

This is analogous to [`PyDict_New()`](#c.PyDict_New).

### int PyODict_SetItem([PyObject](structures.md#c.PyObject) \*od, [PyObject](structures.md#c.PyObject) \*key, [PyObject](structures.md#c.PyObject) \*value)

Insert *value* into the ordered dictionary *od* with a key of *key*.
Return `0` on success or `-1` with an exception set on failure.

This is analogous to [`PyDict_SetItem()`](#c.PyDict_SetItem).

### int PyODict_DelItem([PyObject](structures.md#c.PyObject) \*od, [PyObject](structures.md#c.PyObject) \*key)

Remove the entry in the ordered dictionary *od* with key *key*.
Return `0` on success or `-1` with an exception set on failure.

This is analogous to [`PyDict_DelItem()`](#c.PyDict_DelItem).

These are [soft deprecated](../glossary.md#term-soft-deprecated) aliases to `PyDict` APIs:

| `PyODict`                             | `PyDict`                                                  |
|---------------------------------------|-----------------------------------------------------------|
| ### PyODict_GetItem(od, key)          | [`PyDict_GetItem()`](#c.PyDict_GetItem)                   |
| ### PyODict_GetItemWithError(od, key) | [`PyDict_GetItemWithError()`](#c.PyDict_GetItemWithError) |
| ### PyODict_GetItemString(od, key)    | [`PyDict_GetItemString()`](#c.PyDict_GetItemString)       |
| ### PyODict_Contains(od, key)         | [`PyDict_Contains()`](#c.PyDict_Contains)                 |
| ### PyODict_Size(od)                  | [`PyDict_Size()`](#c.PyDict_Size)                         |
| ### PyODict_SIZE(od)                  | [`PyDict_GET_SIZE()`](#c.PyDict_GET_SIZE)                 |
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
