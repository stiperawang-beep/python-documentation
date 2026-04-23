<a id="weakrefobjects"></a>

# Weak Reference Objects

Python supports *weak references* as first-class objects.  There are two
specific object types which directly implement weak references.  The first is a
simple reference object, and the second acts as a proxy for the original object
as much as it can.

### int PyWeakref_Check([PyObject](structures.md#c.PyObject) \*ob)

Return non-zero if *ob* is either a reference or proxy object.  This function
always succeeds.

### int PyWeakref_CheckRef([PyObject](structures.md#c.PyObject) \*ob)

Return non-zero if *ob* is a reference object or a subclass of the reference
type.  This function always succeeds.

### int PyWeakref_CheckRefExact([PyObject](structures.md#c.PyObject) \*ob)

Return non-zero if *ob* is a reference object, but not a subclass of the
reference type.  This function always succeeds.

### int PyWeakref_CheckProxy([PyObject](structures.md#c.PyObject) \*ob)

Return non-zero if *ob* is a proxy object.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyWeakref_NewRef([PyObject](structures.md#c.PyObject) \*ob, [PyObject](structures.md#c.PyObject) \*callback)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a weak reference object for the object *ob*.  This will always return
a new reference, but is not guaranteed to create a new object; an existing
reference object may be returned.  The second parameter, *callback*, can be a
callable object that receives notification when *ob* is garbage collected; it
should accept a single parameter, which will be the weak reference object
itself. *callback* may also be `None` or `NULL`.  If *ob* is not a
weakly referenceable object, or if *callback* is not callable, `None`, or
`NULL`, this will return `NULL` and raise [`TypeError`](../library/exceptions.md#TypeError).

#### SEE ALSO
[`PyType_SUPPORTS_WEAKREFS()`](type.md#c.PyType_SUPPORTS_WEAKREFS) for checking if *ob* is weakly
referenceable.

### [PyObject](structures.md#c.PyObject) \*PyWeakref_NewProxy([PyObject](structures.md#c.PyObject) \*ob, [PyObject](structures.md#c.PyObject) \*callback)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a weak reference proxy object for the object *ob*.  This will always
return a new reference, but is not guaranteed to create a new object; an
existing proxy object may be returned.  The second parameter, *callback*, can
be a callable object that receives notification when *ob* is garbage
collected; it should accept a single parameter, which will be the weak
reference object itself. *callback* may also be `None` or `NULL`.  If *ob*
is not a weakly referenceable object, or if *callback* is not callable,
`None`, or `NULL`, this will return `NULL` and raise [`TypeError`](../library/exceptions.md#TypeError).

#### SEE ALSO
[`PyType_SUPPORTS_WEAKREFS()`](type.md#c.PyType_SUPPORTS_WEAKREFS) for checking if *ob* is weakly
referenceable.

### int PyWeakref_GetRef([PyObject](structures.md#c.PyObject) \*ref, [PyObject](structures.md#c.PyObject) \*\*pobj)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Get a [strong reference](../glossary.md#term-strong-reference) to the referenced object from a weak
reference, *ref*, into  *\*pobj*.

* On success, set  *\*pobj* to a new [strong reference](../glossary.md#term-strong-reference) to the
  referenced object and return 1.
* If the reference is dead, set  *\*pobj* to `NULL` and return 0.
* On error, raise an exception and return -1.

#### Versionadded
Added in version 3.13.

### int PyWeakref_IsDead([PyObject](structures.md#c.PyObject) \*ref)

Test if the weak reference *ref* is dead. Returns 1 if the reference is
dead, 0 if it is alive, and -1 with an error set if *ref* is not a weak
reference object.

#### Versionadded
Added in version 3.14.

### void PyObject_ClearWeakRefs([PyObject](structures.md#c.PyObject) \*object)

 *Part of the [Stable ABI](stable.md#stable).*

This function is called by the [`tp_dealloc`](typeobj.md#c.PyTypeObject.tp_dealloc) handler
to clear weak references.

This iterates through the weak references for *object* and calls callbacks
for those references which have one. It returns when all callbacks have
been attempted.

### void PyUnstable_Object_ClearWeakRefsNoCallbacks([PyObject](structures.md#c.PyObject) \*object)

Clears the weakrefs for *object* without calling the callbacks.

This function is called by the [`tp_dealloc`](typeobj.md#c.PyTypeObject.tp_dealloc) handler
for types with finalizers (i.e., [`__del__()`](../reference/datamodel.md#object.__del__)).  The handler for
those objects first calls [`PyObject_ClearWeakRefs()`](#c.PyObject_ClearWeakRefs) to clear weakrefs
and call their callbacks, then the finalizer, and finally this function to
clear any weakrefs that may have been created by the finalizer.

In most circumstances, it’s more appropriate to use
[`PyObject_ClearWeakRefs()`](#c.PyObject_ClearWeakRefs) to clear weakrefs instead of this function.

#### Versionadded
Added in version 3.13.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
