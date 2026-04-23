<a id="typeobjects"></a>

# Type Objects

<a id="index-0"></a>

### type PyTypeObject

 *Part of the [Stable ABI](stable.md#stable) (as an opaque struct).*

The C structure of the objects used to describe built-in types.

### [PyTypeObject](#c.PyTypeObject) PyType_Type

 *Part of the [Stable ABI](stable.md#stable).*

This is the type object for type objects; it is the same object as
[`type`](../library/functions.md#type) in the Python layer.

### int PyType_Check([PyObject](structures.md#c.PyObject) \*o)

Return non-zero if the object *o* is a type object, including instances of
types derived from the standard type object.  Return 0 in all other cases.
This function always succeeds.

### int PyType_CheckExact([PyObject](structures.md#c.PyObject) \*o)

Return non-zero if the object *o* is a type object, but not a subtype of
the standard type object.  Return 0 in all other cases.  This function
always succeeds.

### unsigned int PyType_ClearCache()

 *Part of the [Stable ABI](stable.md#stable).*

Clear the internal lookup cache. Return the current version tag.

### unsigned long PyType_GetFlags([PyTypeObject](#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable).*

Return the [`tp_flags`](typeobj.md#c.PyTypeObject.tp_flags) member of *type*. This function is primarily
meant for use with `Py_LIMITED_API`; the individual flag bits are
guaranteed to be stable across Python releases, but access to
[`tp_flags`](typeobj.md#c.PyTypeObject.tp_flags) itself is not part of the [limited API](stable.md#limited-c-api).

#### Versionadded
Added in version 3.2.

#### Versionchanged
Changed in version 3.4: The return type is now `unsigned long` rather than `long`.

### [PyObject](structures.md#c.PyObject) \*PyType_GetDict([PyTypeObject](#c.PyTypeObject) \*type)

Return the type object’s internal namespace, which is otherwise only
exposed via a read-only proxy ([`cls.__dict__`](../reference/datamodel.md#type.__dict__)).
This is a
replacement for accessing [`tp_dict`](typeobj.md#c.PyTypeObject.tp_dict) directly.
The returned dictionary must be treated as read-only.

This function is meant for specific embedding and language-binding cases,
where direct access to the dict is necessary and indirect access
(e.g. via the proxy or [`PyObject_GetAttr()`](object.md#c.PyObject_GetAttr)) isn’t adequate.

Extension modules should continue to use `tp_dict`,
directly or indirectly, when setting up their own types.

#### Versionadded
Added in version 3.12.

### void PyType_Modified([PyTypeObject](#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable).*

Invalidate the internal lookup cache for the type and all of its
subtypes.  This function must be called after any manual
modification of the attributes or base classes of the type.

### int PyType_AddWatcher([PyType_WatchCallback](#c.PyType_WatchCallback) callback)

Register *callback* as a type watcher. Return a non-negative integer ID
which must be passed to future calls to [`PyType_Watch()`](#c.PyType_Watch). In case of
error (e.g. no more watcher IDs available), return `-1` and set an
exception.

In free-threaded builds, [`PyType_AddWatcher()`](#c.PyType_AddWatcher) is not thread-safe,
so it must be called at start up (before spawning the first thread).

#### Versionadded
Added in version 3.12.

### int PyType_ClearWatcher(int watcher_id)

Clear watcher identified by *watcher_id* (previously returned from
[`PyType_AddWatcher()`](#c.PyType_AddWatcher)). Return `0` on success, `-1` on error (e.g.
if *watcher_id* was never registered.)

An extension should never call `PyType_ClearWatcher` with a *watcher_id*
that was not returned to it by a previous call to
[`PyType_AddWatcher()`](#c.PyType_AddWatcher).

#### Versionadded
Added in version 3.12.

### int PyType_Watch(int watcher_id, [PyObject](structures.md#c.PyObject) \*type)

Mark *type* as watched. The callback granted *watcher_id* by
[`PyType_AddWatcher()`](#c.PyType_AddWatcher) will be called whenever
[`PyType_Modified()`](#c.PyType_Modified) reports a change to *type*. (The callback may be
called only once for a series of consecutive modifications to *type*, if
`_PyType_Lookup()` is not called on *type* between the modifications;
this is an implementation detail and subject to change.)

An extension should never call `PyType_Watch` with a *watcher_id* that was
not returned to it by a previous call to [`PyType_AddWatcher()`](#c.PyType_AddWatcher).

#### Versionadded
Added in version 3.12.

### int PyType_Unwatch(int watcher_id, [PyObject](structures.md#c.PyObject) \*type)

Mark *type* as not watched. This undoes a previous call to
[`PyType_Watch()`](#c.PyType_Watch). *type* must not be `NULL`.

An extension should never call this function with a *watcher_id* that was
not returned to it by a previous call to [`PyType_AddWatcher()`](#c.PyType_AddWatcher).

On success, this function returns `0`. On failure, this function returns
`-1` with an exception set.

#### Versionadded
Added in version 3.12.

### typedef int (\*PyType_WatchCallback)([PyObject](structures.md#c.PyObject) \*type)

Type of a type-watcher callback function.

The callback must not modify *type* or cause [`PyType_Modified()`](#c.PyType_Modified) to be
called on *type* or any type in its MRO; violating this rule could cause
infinite recursion.

#### Versionadded
Added in version 3.12.

### int PyType_HasFeature([PyTypeObject](#c.PyTypeObject) \*o, int feature)

Return non-zero if the type object *o* sets the feature *feature*.
Type features are denoted by single bit flags.

### int PyType_FastSubclass([PyTypeObject](#c.PyTypeObject) \*type, int flag)

Return non-zero if the type object *type* sets the subclass flag *flag*.
Subclass flags are denoted by
[`Py_TPFLAGS_*_SUBCLASS`](typeobj.md#c.Py_TPFLAGS_LONG_SUBCLASS).
This function is used by many `_Check` functions for common types.

#### SEE ALSO
[`PyObject_TypeCheck()`](object.md#c.PyObject_TypeCheck), which is used as a slower alternative in
`_Check` functions for types that don’t come with subclass flags.

### int PyType_IS_GC([PyTypeObject](#c.PyTypeObject) \*o)

Return true if the type object includes support for the cycle detector; this
tests the type flag [`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC).

### int PyType_IsSubtype([PyTypeObject](#c.PyTypeObject) \*a, [PyTypeObject](#c.PyTypeObject) \*b)

 *Part of the [Stable ABI](stable.md#stable).*

Return true if *a* is a subtype of *b*.

This function only checks for actual subtypes, which means that
[`__subclasscheck__()`](../reference/datamodel.md#type.__subclasscheck__) is not called on *b*.  Call
[`PyObject_IsSubclass()`](object.md#c.PyObject_IsSubclass) to do the same check that [`issubclass()`](../library/functions.md#issubclass)
would do.

### [PyObject](structures.md#c.PyObject) \*PyType_GenericAlloc([PyTypeObject](#c.PyTypeObject) \*type, [Py_ssize_t](intro.md#c.Py_ssize_t) nitems)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Generic handler for the [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot of a type
object.  Uses Python’s default memory allocation mechanism to allocate memory
for a new instance, zeros the memory, then initializes the memory as if by
calling [`PyObject_Init()`](allocation.md#c.PyObject_Init) or [`PyObject_InitVar()`](allocation.md#c.PyObject_InitVar).

Do not call this directly to allocate memory for an object; call the type’s
[`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot instead.

For types that support garbage collection (i.e., the
[`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) flag is set), this function behaves like
[`PyObject_GC_New`](gcsupport.md#c.PyObject_GC_New) or [`PyObject_GC_NewVar`](gcsupport.md#c.PyObject_GC_NewVar) (except the
memory is guaranteed to be zeroed before initialization), and should be
paired with [`PyObject_GC_Del()`](gcsupport.md#c.PyObject_GC_Del) in [`tp_free`](typeobj.md#c.PyTypeObject.tp_free).
Otherwise, it behaves like [`PyObject_New`](allocation.md#c.PyObject_New) or
[`PyObject_NewVar`](allocation.md#c.PyObject_NewVar) (except the memory is guaranteed to be zeroed
before initialization) and should be paired with [`PyObject_Free()`](memory.md#c.PyObject_Free) in
[`tp_free`](typeobj.md#c.PyTypeObject.tp_free).

### [PyObject](structures.md#c.PyObject) \*PyType_GenericNew([PyTypeObject](#c.PyTypeObject) \*type, [PyObject](structures.md#c.PyObject) \*args, [PyObject](structures.md#c.PyObject) \*kwds)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Generic handler for the [`tp_new`](typeobj.md#c.PyTypeObject.tp_new) slot of a type
object.  Creates a new instance using the type’s
[`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot and returns the resulting object.

### int PyType_Ready([PyTypeObject](#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable).*

Finalize a type object.  This should be called on all type objects to finish
their initialization.  This function is responsible for adding inherited slots
from a type’s base class.  Return `0` on success, or return `-1` and sets an
exception on error.

#### NOTE
If some of the base classes implements the GC protocol and the provided
type does not include the [`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) in its flags, then
the GC protocol will be automatically implemented from its parents. On
the contrary, if the type being created does include
[`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) in its flags then it **must** implement the
GC protocol itself by at least implementing the
[`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handle.

### [PyObject](structures.md#c.PyObject) \*PyType_GetName([PyTypeObject](#c.PyTypeObject) \*type)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.11.*

Return the type’s name. Equivalent to getting the type’s
[`__name__`](../reference/datamodel.md#type.__name__) attribute.

#### Versionadded
Added in version 3.11.

### [PyObject](structures.md#c.PyObject) \*PyType_GetQualName([PyTypeObject](#c.PyTypeObject) \*type)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.11.*

Return the type’s qualified name. Equivalent to getting the
type’s [`__qualname__`](../reference/datamodel.md#type.__qualname__) attribute.

#### Versionadded
Added in version 3.11.

### [PyObject](structures.md#c.PyObject) \*PyType_GetFullyQualifiedName([PyTypeObject](#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Return the type’s fully qualified name. Equivalent to
`f"{type.__module__}.{type.__qualname__}"`, or [`type.__qualname__`](../reference/datamodel.md#type.__qualname__)
if [`type.__module__`](../reference/datamodel.md#type.__module__) is not a string or is equal to `"builtins"`.

#### Versionadded
Added in version 3.13.

### [PyObject](structures.md#c.PyObject) \*PyType_GetModuleName([PyTypeObject](#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Return the type’s module name. Equivalent to getting the
[`type.__module__`](../reference/datamodel.md#type.__module__) attribute.

#### Versionadded
Added in version 3.13.

### void \*PyType_GetSlot([PyTypeObject](#c.PyTypeObject) \*type, int slot)

 *Part of the [Stable ABI](stable.md#stable) since version 3.4.*

Return the function pointer stored in the given slot. If the
result is `NULL`, this indicates that either the slot is `NULL`,
or that the function was called with invalid parameters.
Callers will typically cast the result pointer into the appropriate
function type.

See [`PyType_Slot.slot`](#c.PyType_Slot.slot) for possible values of the *slot* argument.

#### Versionadded
Added in version 3.4.

#### Versionchanged
Changed in version 3.10: [`PyType_GetSlot()`](#c.PyType_GetSlot) can now accept all types.
Previously, it was limited to [heap types](typeobj.md#heap-types).

### [PyObject](structures.md#c.PyObject) \*PyType_GetModule([PyTypeObject](#c.PyTypeObject) \*type)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Return the module object associated with the given type when the type was
created using [`PyType_FromModuleAndSpec()`](#c.PyType_FromModuleAndSpec).

The returned reference is [borrowed](../glossary.md#term-borrowed-reference) from *type*,
and will be valid as long as you hold a reference to *type*.
Do not release it with [`Py_DECREF()`](refcounting.md#c.Py_DECREF) or similar.

If no module is associated with the given type, sets [`TypeError`](../library/exceptions.md#TypeError)
and returns `NULL`.

This function is usually used to get the module in which a method is defined.
Note that in such a method, `PyType_GetModule(Py_TYPE(self))`
may not return the intended result.
`Py_TYPE(self)` may be a *subclass* of the intended class, and subclasses
are not necessarily defined in the same module as their superclass.
See [`PyCMethod`](structures.md#c.PyCMethod) to get the class that defines the method.
See [`PyType_GetModuleByToken()`](#c.PyType_GetModuleByToken) for cases when `PyCMethod`
cannot be used.

#### Versionadded
Added in version 3.9.

### void \*PyType_GetModuleState([PyTypeObject](#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Return the state of the module object associated with the given type.
This is a shortcut for calling [`PyModule_GetState()`](module.md#c.PyModule_GetState) on the result
of [`PyType_GetModule()`](#c.PyType_GetModule).

If no module is associated with the given type, sets [`TypeError`](../library/exceptions.md#TypeError)
and returns `NULL`.

If the *type* has an associated module but its state is `NULL`,
returns `NULL` without setting an exception.

#### Versionadded
Added in version 3.9.

### [PyObject](structures.md#c.PyObject) \*PyType_GetModuleByToken([PyTypeObject](#c.PyTypeObject) \*type, const void \*mod_token)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

Find the first superclass whose module has the given
[module token](module.md#ext-module-token), and return that module.

If no module is found, raises a [`TypeError`](../library/exceptions.md#TypeError) and returns `NULL`.

This function is intended to be used together with
[`PyModule_GetState()`](module.md#c.PyModule_GetState) to get module state from slot methods (such as
[`tp_init`](typeobj.md#c.PyTypeObject.tp_init) or [`nb_add`](typeobj.md#c.PyNumberMethods.nb_add))
and other places where a method’s defining class cannot be passed using the
[`PyCMethod`](structures.md#c.PyCMethod) calling convention.

#### Versionadded
Added in version 3.15.

### [PyObject](structures.md#c.PyObject) \*PyType_GetModuleByDef([PyTypeObject](#c.PyTypeObject) \*type, struct [PyModuleDef](module.md#c.PyModuleDef) \*def)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.13.*

Find the first superclass whose module was created from the given
[`PyModuleDef`](module.md#c.PyModuleDef) *def*, or whose [module token](module.md#ext-module-token)
is equal to *def*, and return that module.

Note that modules created from a [`PyModuleDef`](module.md#c.PyModuleDef) always have their
token set to the [`PyModuleDef`](module.md#c.PyModuleDef)’s address.
In other words, this function is equivalent to
[`PyType_GetModuleByToken()`](#c.PyType_GetModuleByToken), except that it:

- returns a borrowed reference, and
- has a non-`void*` argument type (which is a cosmetic difference in C).

The returned reference is [borrowed](../glossary.md#term-borrowed-reference) from *type*,
and will be valid as long as you hold a reference to *type*.
Do not release it with [`Py_DECREF()`](refcounting.md#c.Py_DECREF) or similar.

#### Versionadded
Added in version 3.11.

### int PyType_GetBaseByToken([PyTypeObject](#c.PyTypeObject) \*type, void \*tp_token, [PyTypeObject](#c.PyTypeObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Find the first superclass in *type*’s [method resolution order](../glossary.md#term-method-resolution-order) whose
[`Py_tp_token`](#c.Py_tp_token) token is equal to *tp_token*.

* If found, set  *\*result* to a new [strong reference](../glossary.md#term-strong-reference)
  to it and return `1`.
* If not found, set  *\*result* to `NULL` and return `0`.
* On error, set  *\*result* to `NULL` and return `-1` with an
  exception set.

The *result* argument may be `NULL`, in which case  *\*result* is not set.
Use this if you need only the return value.

The *tp_token* argument may not be `NULL`.

#### Versionadded
Added in version 3.14.

### int PyUnstable_Type_AssignVersionTag([PyTypeObject](#c.PyTypeObject) \*type)

Attempt to assign a version tag to the given type.

Returns 1 if the type already had a valid version tag or a new one was
assigned, or 0 if a new tag could not be assigned.

#### Versionadded
Added in version 3.12.

### int PyType_SUPPORTS_WEAKREFS([PyTypeObject](#c.PyTypeObject) \*type)

Return true if instances of *type* support creating weak references, false
otherwise. This function always succeeds. *type* must not be `NULL`.

#### SEE ALSO
* [Weak Reference Objects](weakref.md#weakrefobjects)
* [`weakref`](../library/weakref.md#module-weakref)

## Creating Heap-Allocated Types

The following functions and structs are used to create
[heap types](typeobj.md#heap-types).

### [PyObject](structures.md#c.PyObject) \*PyType_FromMetaclass([PyTypeObject](#c.PyTypeObject) \*metaclass, [PyObject](structures.md#c.PyObject) \*module, [PyType_Spec](#c.PyType_Spec) \*spec, [PyObject](structures.md#c.PyObject) \*bases)

 *Part of the [Stable ABI](stable.md#stable) since version 3.12.*

Create and return a [heap type](typeobj.md#heap-types) from the *spec*
(see [`Py_TPFLAGS_HEAPTYPE`](typeobj.md#c.Py_TPFLAGS_HEAPTYPE)).

The metaclass *metaclass* is used to construct the resulting type object.
When *metaclass* is `NULL`, the metaclass is derived from *bases*
(or *Py_tp_base[s]* slots if *bases* is `NULL`, see below).

Metaclasses that override [`tp_new`](typeobj.md#c.PyTypeObject.tp_new) are not
supported, except if `tp_new` is `NULL`.

The *bases* argument can be used to specify base classes; it can either
be only one class or a tuple of classes.
If *bases* is `NULL`, the [`Py_tp_bases`](typeobj.md#c.Py_tp_bases) slot is used instead.
If that also is `NULL`, the [`Py_tp_base`](typeobj.md#c.Py_tp_base) slot is used instead.
If that also is `NULL`, the new type derives from [`object`](../library/functions.md#object).

The *module* argument can be used to record the module in which the new
class is defined. It must be a module object or `NULL`.
If not `NULL`, the module is associated with the new type and can later be
retrieved with [`PyType_GetModule()`](#c.PyType_GetModule).
The associated module is not inherited by subclasses; it must be specified
for each class individually.

This function calls [`PyType_Ready()`](#c.PyType_Ready) on the new type.

Note that this function does *not* fully match the behavior of
calling [`type()`](../library/functions.md#type) or using the [`class`](../reference/compound_stmts.md#class) statement.
With user-provided base types or metaclasses, prefer
[calling](call.md#capi-call) [`type`](../library/functions.md#type) (or the metaclass)
over `PyType_From*` functions.
Specifically:

* [`__new__()`](../reference/datamodel.md#object.__new__) is not called on the new class
  (and it must be set to `type.__new__`).
* [`__init__()`](../reference/datamodel.md#object.__init__) is not called on the new class.
* [`__init_subclass__()`](../reference/datamodel.md#object.__init_subclass__) is not called on any bases.
* [`__set_name__()`](../reference/datamodel.md#object.__set_name__) is not called on new descriptors.

#### Versionadded
Added in version 3.12.

### [PyObject](structures.md#c.PyObject) \*PyType_FromModuleAndSpec([PyObject](structures.md#c.PyObject) \*module, [PyType_Spec](#c.PyType_Spec) \*spec, [PyObject](structures.md#c.PyObject) \*bases)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Equivalent to `PyType_FromMetaclass(NULL, module, spec, bases)`.

#### Versionadded
Added in version 3.9.

#### Versionchanged
Changed in version 3.10: The function now accepts a single class as the *bases* argument and
`NULL` as the `tp_doc` slot.

#### Versionchanged
Changed in version 3.12: The function now finds and uses a metaclass corresponding to the provided
base classes.  Previously, only [`type`](../library/functions.md#type) instances were returned.

The [`tp_new`](typeobj.md#c.PyTypeObject.tp_new) of the metaclass is *ignored*.
which may result in incomplete initialization.
Creating classes whose metaclass overrides
[`tp_new`](typeobj.md#c.PyTypeObject.tp_new) is deprecated.

#### Versionchanged
Changed in version 3.14: Creating classes whose metaclass overrides
[`tp_new`](typeobj.md#c.PyTypeObject.tp_new) is no longer allowed.

### [PyObject](structures.md#c.PyObject) \*PyType_FromSpecWithBases([PyType_Spec](#c.PyType_Spec) \*spec, [PyObject](structures.md#c.PyObject) \*bases)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.3.*

Equivalent to `PyType_FromMetaclass(NULL, NULL, spec, bases)`.

#### Versionadded
Added in version 3.3.

#### Versionchanged
Changed in version 3.12: The function now finds and uses a metaclass corresponding to the provided
base classes.  Previously, only [`type`](../library/functions.md#type) instances were returned.

The [`tp_new`](typeobj.md#c.PyTypeObject.tp_new) of the metaclass is *ignored*.
which may result in incomplete initialization.
Creating classes whose metaclass overrides
[`tp_new`](typeobj.md#c.PyTypeObject.tp_new) is deprecated.

#### Versionchanged
Changed in version 3.14: Creating classes whose metaclass overrides
[`tp_new`](typeobj.md#c.PyTypeObject.tp_new) is no longer allowed.

### [PyObject](structures.md#c.PyObject) \*PyType_FromSpec([PyType_Spec](#c.PyType_Spec) \*spec)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Equivalent to `PyType_FromMetaclass(NULL, NULL, spec, NULL)`.

#### Versionchanged
Changed in version 3.12: The function now finds and uses a metaclass corresponding to the
base classes provided in *Py_tp_base[s]* slots.
Previously, only [`type`](../library/functions.md#type) instances were returned.

The [`tp_new`](typeobj.md#c.PyTypeObject.tp_new) of the metaclass is *ignored*.
which may result in incomplete initialization.
Creating classes whose metaclass overrides
[`tp_new`](typeobj.md#c.PyTypeObject.tp_new) is deprecated.

#### Versionchanged
Changed in version 3.14: Creating classes whose metaclass overrides
[`tp_new`](typeobj.md#c.PyTypeObject.tp_new) is no longer allowed.

### int PyType_Freeze([PyTypeObject](#c.PyTypeObject) \*type)

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Make a type immutable: set the [`Py_TPFLAGS_IMMUTABLETYPE`](typeobj.md#c.Py_TPFLAGS_IMMUTABLETYPE) flag.

All base classes of *type* must be immutable.

On success, return `0`.
On error, set an exception and return `-1`.

The type must not be used before it’s made immutable. For example, type
instances must not be created before the type is made immutable.

#### Versionadded
Added in version 3.14.

<!-- Keep old URL fragments working (see gh-97908) -->
<span id='c.PyType_Spec.PyType_Spec.name'></span>
<span id='c.PyType_Spec.PyType_Spec.basicsize'></span>
<span id='c.PyType_Spec.PyType_Spec.itemsize'></span>
<span id='c.PyType_Spec.PyType_Spec.flags'></span>
<span id='c.PyType_Spec.PyType_Spec.slots'></span>

### type PyType_Spec

 *Part of the [Stable ABI](stable.md#stable) (including all members).*

Structure defining a type’s behavior.

### const char \*name

Name of the type, used to set [`PyTypeObject.tp_name`](typeobj.md#c.PyTypeObject.tp_name).

### int basicsize

If positive, specifies the size of the instance in bytes.
It is used to set [`PyTypeObject.tp_basicsize`](typeobj.md#c.PyTypeObject.tp_basicsize).

If zero, specifies that [`tp_basicsize`](typeobj.md#c.PyTypeObject.tp_basicsize)
should be inherited.

If negative, the absolute value specifies how much space instances of the
class need *in addition* to the superclass.
Use [`PyObject_GetTypeData()`](object.md#c.PyObject_GetTypeData) to get a pointer to subclass-specific
memory reserved this way.
For negative `basicsize`, Python will insert padding when
needed to meet [`tp_basicsize`](typeobj.md#c.PyTypeObject.tp_basicsize)’s alignment
requirements.

#### Versionchanged
Changed in version 3.12: Previously, this field could not be negative.

### int itemsize

Size of one element of a variable-size type, in bytes.
Used to set [`PyTypeObject.tp_itemsize`](typeobj.md#c.PyTypeObject.tp_itemsize).
See `tp_itemsize` documentation for caveats.

If zero, [`tp_itemsize`](typeobj.md#c.PyTypeObject.tp_itemsize) is inherited.
Extending arbitrary variable-sized classes is dangerous,
since some types use a fixed offset for variable-sized memory,
which can then overlap fixed-sized memory used by a subclass.
To help prevent mistakes, inheriting `itemsize` is only possible
in the following situations:

- The base is not variable-sized (its
  [`tp_itemsize`](typeobj.md#c.PyTypeObject.tp_itemsize)).
- The requested [`PyType_Spec.basicsize`](#c.PyType_Spec.basicsize) is positive,
  suggesting that the memory layout of the base class is known.
- The requested [`PyType_Spec.basicsize`](#c.PyType_Spec.basicsize) is zero,
  suggesting that the subclass does not access the instance’s memory
  directly.
- With the [`Py_TPFLAGS_ITEMS_AT_END`](typeobj.md#c.Py_TPFLAGS_ITEMS_AT_END) flag.

### unsigned int flags

Type flags, used to set [`PyTypeObject.tp_flags`](typeobj.md#c.PyTypeObject.tp_flags).

If the `Py_TPFLAGS_HEAPTYPE` flag is not set,
[`PyType_FromSpecWithBases()`](#c.PyType_FromSpecWithBases) sets it automatically.

### [PyType_Slot](#c.PyType_Slot) \*slots

Array of [`PyType_Slot`](#c.PyType_Slot) structures.
Terminated by the special slot value `{0, NULL}`.

Each slot ID should be specified at most once.

<!-- Keep old URL fragments working (see gh-97908) -->
<span id='c.PyType_Slot.PyType_Slot.slot'></span>
<span id='c.PyType_Slot.PyType_Slot.pfunc'></span>

### type PyType_Slot

 *Part of the [Stable ABI](stable.md#stable) (including all members).*

Structure defining optional functionality of a type, containing a slot ID
and a value pointer.

### int slot

A slot ID.

Slot IDs are named like the field names of the structures
[`PyTypeObject`](#c.PyTypeObject), [`PyNumberMethods`](typeobj.md#c.PyNumberMethods),
[`PySequenceMethods`](typeobj.md#c.PySequenceMethods), [`PyMappingMethods`](typeobj.md#c.PyMappingMethods) and
[`PyAsyncMethods`](typeobj.md#c.PyAsyncMethods) with an added `Py_` prefix.
For example, use:

* [`Py_tp_dealloc`](typeobj.md#c.Py_tp_dealloc) to set [`PyTypeObject.tp_dealloc`](typeobj.md#c.PyTypeObject.tp_dealloc)
* [`Py_nb_add`](typeobj.md#c.Py_nb_add) to set [`PyNumberMethods.nb_add`](typeobj.md#c.PyNumberMethods.nb_add)
* [`Py_sq_length`](typeobj.md#c.Py_sq_length) to set [`PySequenceMethods.sq_length`](typeobj.md#c.PySequenceMethods.sq_length)

An additional slot is supported that does not correspond to a
`PyTypeObject` struct field:

* [`Py_tp_token`](#c.Py_tp_token)

The following “offset” fields cannot be set using [`PyType_Slot`](#c.PyType_Slot):

* [`tp_weaklistoffset`](typeobj.md#c.PyTypeObject.tp_weaklistoffset)
  (use [`Py_TPFLAGS_MANAGED_WEAKREF`](typeobj.md#c.Py_TPFLAGS_MANAGED_WEAKREF) instead if possible)
* [`tp_dictoffset`](typeobj.md#c.PyTypeObject.tp_dictoffset)
  (use [`Py_TPFLAGS_MANAGED_DICT`](typeobj.md#c.Py_TPFLAGS_MANAGED_DICT) instead if possible)
* [`tp_vectorcall_offset`](typeobj.md#c.PyTypeObject.tp_vectorcall_offset)
  (use `"__vectorcalloffset__"` in
  [PyMemberDef](structures.md#pymemberdef-offsets))

If it is not possible to switch to a `MANAGED` flag (for example,
for vectorcall or to support Python older than 3.12), specify the
offset in [`Py_tp_members`](typeobj.md#c.Py_tp_members).
See [PyMemberDef documentation](structures.md#pymemberdef-offsets)
for details.

The following internal fields cannot be set at all when creating a heap
type:

* [`tp_dict`](typeobj.md#c.PyTypeObject.tp_dict),
  [`tp_mro`](typeobj.md#c.PyTypeObject.tp_mro),
  [`tp_cache`](typeobj.md#c.PyTypeObject.tp_cache),
  [`tp_subclasses`](typeobj.md#c.PyTypeObject.tp_subclasses), and
  [`tp_weaklist`](typeobj.md#c.PyTypeObject.tp_weaklist).

Setting [`Py_tp_bases`](typeobj.md#c.Py_tp_bases) or [`Py_tp_base`](typeobj.md#c.Py_tp_base) may be
problematic on some platforms.
To avoid issues, use the *bases* argument of
[`PyType_FromSpecWithBases()`](#c.PyType_FromSpecWithBases) instead.

#### Versionchanged
Changed in version 3.9: Slots in [`PyBufferProcs`](typeobj.md#c.PyBufferProcs) may be set in the unlimited API.

#### Versionchanged
Changed in version 3.11: [`bf_getbuffer`](typeobj.md#c.PyBufferProcs.bf_getbuffer) and
[`bf_releasebuffer`](typeobj.md#c.PyBufferProcs.bf_releasebuffer) are now available
under the [limited API](stable.md#limited-c-api).

#### Versionchanged
Changed in version 3.14: The field [`tp_vectorcall`](typeobj.md#c.PyTypeObject.tp_vectorcall) can now be set
using [`Py_tp_vectorcall`](typeobj.md#c.Py_tp_vectorcall).  See the field’s documentation
for details.

### void \*pfunc

The desired value of the slot. In most cases, this is a pointer
to a function.

*pfunc* values may not be `NULL`, except for the following slots:

* [`Py_tp_doc`](typeobj.md#c.Py_tp_doc)
* [`Py_tp_token`](#c.Py_tp_token) (for clarity, prefer [`Py_TP_USE_SPEC`](#c.Py_TP_USE_SPEC)
  rather than `NULL`)

### Py_tp_token

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

A [`slot`](#c.PyType_Slot.slot) that records a static memory layout ID
for a class.

If the [`PyType_Spec`](#c.PyType_Spec) of the class is statically
allocated, the token can be set to the spec using the special value
[`Py_TP_USE_SPEC`](#c.Py_TP_USE_SPEC):

```c
static PyType_Slot foo_slots[] = {
   {Py_tp_token, Py_TP_USE_SPEC},
```

It can also be set to an arbitrary pointer, but you must ensure that:

* The pointer outlives the class, so it’s not reused for something else
  while the class exists.
* It “belongs” to the extension module where the class lives, so it will not
  clash with other extensions.

Use [`PyType_GetBaseByToken()`](#c.PyType_GetBaseByToken) to check if a class’s superclass has
a given token – that is, check whether the memory layout is compatible.

To get the token for a given class (without considering superclasses),
use [`PyType_GetSlot()`](#c.PyType_GetSlot) with `Py_tp_token`.

#### Versionadded
Added in version 3.14.

### Py_TP_USE_SPEC

 *Part of the [Stable ABI](stable.md#stable) since version 3.14.*

Used as a value with [`Py_tp_token`](#c.Py_tp_token) to set the token to the
class’s [`PyType_Spec`](#c.PyType_Spec).
Expands to `NULL`.

#### Versionadded
Added in version 3.14.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
