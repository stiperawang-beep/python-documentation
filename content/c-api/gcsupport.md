<a id="supporting-cycle-detection"></a>

# Supporting Cyclic Garbage Collection

Python’s support for detecting and collecting garbage which involves circular
references requires support from object types which are “containers” for other
objects which may also be containers.  Types which do not store references to
other objects, or which only store references to atomic types (such as numbers
or strings), do not need to provide any explicit support for garbage
collection.

To create a container type, the [`tp_flags`](typeobj.md#c.PyTypeObject.tp_flags) field of the type object must
include the [`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) and provide an implementation of the
[`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler.  If instances of the type are mutable, a
[`tp_clear`](typeobj.md#c.PyTypeObject.tp_clear) implementation must also be provided.

[`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC)
: Objects with a type with this flag set must conform with the rules
  documented here.  For convenience these objects will be referred to as
  container objects.

Constructors for container types must conform to two rules:

1. The memory for the object must be allocated using [`PyObject_GC_New`](#c.PyObject_GC_New)
   or [`PyObject_GC_NewVar`](#c.PyObject_GC_NewVar).
2. Once all the fields which may contain references to other containers are
   initialized, it must call [`PyObject_GC_Track()`](#c.PyObject_GC_Track).

Similarly, the deallocator for the object must conform to a similar pair of
rules:

1. Before fields which refer to other containers are invalidated,
   [`PyObject_GC_UnTrack()`](#c.PyObject_GC_UnTrack) must be called.
2. The object’s memory must be deallocated using [`PyObject_GC_Del()`](#c.PyObject_GC_Del).

   #### WARNING
   If a type adds the Py_TPFLAGS_HAVE_GC, then it *must* implement at least
   a [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler or explicitly use one
   from its subclass or subclasses.

   When calling [`PyType_Ready()`](type.md#c.PyType_Ready) or some of the APIs that indirectly
   call it like [`PyType_FromSpecWithBases()`](type.md#c.PyType_FromSpecWithBases) or
   [`PyType_FromSpec()`](type.md#c.PyType_FromSpec) the interpreter will automatically populate the
   [`tp_flags`](typeobj.md#c.PyTypeObject.tp_flags), [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse)
   and [`tp_clear`](typeobj.md#c.PyTypeObject.tp_clear) fields if the type inherits from a
   class that implements the garbage collector protocol and the child class
   does *not* include the [`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) flag.

### PyObject_GC_New(TYPE, typeobj)

Analogous to [`PyObject_New`](allocation.md#c.PyObject_New) but for container objects with the
[`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) flag set.

Do not call this directly to allocate memory for an object; call the type’s
[`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot instead.

When populating a type’s [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot,
[`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc) is preferred over a custom function that
simply calls this macro.

Memory allocated by this macro must be freed with
[`PyObject_GC_Del()`](#c.PyObject_GC_Del) (usually called via the object’s
[`tp_free`](typeobj.md#c.PyTypeObject.tp_free) slot).

#### SEE ALSO
* [`PyObject_GC_Del()`](#c.PyObject_GC_Del)
* [`PyObject_New`](allocation.md#c.PyObject_New)
* [`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc)
* [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc)

### PyObject_GC_NewVar(TYPE, typeobj, size)

Analogous to [`PyObject_NewVar`](allocation.md#c.PyObject_NewVar) but for container objects with the
[`Py_TPFLAGS_HAVE_GC`](typeobj.md#c.Py_TPFLAGS_HAVE_GC) flag set.

Do not call this directly to allocate memory for an object; call the type’s
[`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot instead.

When populating a type’s [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc) slot,
[`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc) is preferred over a custom function that
simply calls this macro.

Memory allocated by this macro must be freed with
[`PyObject_GC_Del()`](#c.PyObject_GC_Del) (usually called via the object’s
[`tp_free`](typeobj.md#c.PyTypeObject.tp_free) slot).

#### SEE ALSO
* [`PyObject_GC_Del()`](#c.PyObject_GC_Del)
* [`PyObject_NewVar`](allocation.md#c.PyObject_NewVar)
* [`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc)
* [`tp_alloc`](typeobj.md#c.PyTypeObject.tp_alloc)

### [PyObject](structures.md#c.PyObject) \*PyUnstable_Object_GC_NewWithExtraData([PyTypeObject](type.md#c.PyTypeObject) \*type, size_t extra_size)

Analogous to [`PyObject_GC_New`](#c.PyObject_GC_New) but allocates *extra_size*
bytes at the end of the object (at offset
[`tp_basicsize`](typeobj.md#c.PyTypeObject.tp_basicsize)).
The allocated memory is initialized to zeros,
except for the [`Python object header`](structures.md#c.PyObject).

The extra data will be deallocated with the object, but otherwise it is
not managed by Python.

Memory allocated by this function must be freed with
[`PyObject_GC_Del()`](#c.PyObject_GC_Del) (usually called via the object’s
[`tp_free`](typeobj.md#c.PyTypeObject.tp_free) slot).

#### WARNING
The function is marked as unstable because the final mechanism
for reserving extra data after an instance is not yet decided.
For allocating a variable number of fields, prefer using
[`PyVarObject`](structures.md#c.PyVarObject) and [`tp_itemsize`](typeobj.md#c.PyTypeObject.tp_itemsize)
instead.

#### Versionadded
Added in version 3.12.

### PyObject_GC_Resize(TYPE, op, newsize)

Resize an object allocated by [`PyObject_NewVar`](allocation.md#c.PyObject_NewVar).
Returns the resized object of type `TYPE*` (refers to any C type)
or `NULL` on failure.

*op* must be of type 
and must not be tracked by the collector yet.
*newsize* must be of type [`Py_ssize_t`](intro.md#c.Py_ssize_t).

### void PyObject_GC_Track([PyObject](structures.md#c.PyObject) \*op)

 *Part of the [Stable ABI](stable.md#stable).*

Adds the object *op* to the set of container objects tracked by the
collector.  The collector can run at unexpected times so objects must be
valid while being tracked.  This should be called once all the fields
followed by the [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler become valid, usually near the
end of the constructor.

### int PyObject_IS_GC([PyObject](structures.md#c.PyObject) \*obj)

Returns non-zero if the object implements the garbage collector protocol,
otherwise returns 0.

The object cannot be tracked by the garbage collector if this function returns 0.

### int PyObject_GC_IsTracked([PyObject](structures.md#c.PyObject) \*op)

 *Part of the [Stable ABI](stable.md#stable) since version 3.9.*

Returns 1 if the object type of *op* implements the GC protocol and *op* is being
currently tracked by the garbage collector and 0 otherwise.

This is analogous to the Python function [`gc.is_tracked()`](../library/gc.md#gc.is_tracked).

#### Versionadded
Added in version 3.9.

### int PyObject_GC_IsFinalized([PyObject](structures.md#c.PyObject) \*op)

 *Part of the [Stable ABI](stable.md#stable) since version 3.9.*

Returns 1 if the object type of *op* implements the GC protocol and *op* has been
already finalized by the garbage collector and 0 otherwise.

This is analogous to the Python function [`gc.is_finalized()`](../library/gc.md#gc.is_finalized).

#### Versionadded
Added in version 3.9.

### void PyObject_GC_Del(void \*op)

 *Part of the [Stable ABI](stable.md#stable).*

Releases memory allocated to an object using [`PyObject_GC_New`](#c.PyObject_GC_New) or
[`PyObject_GC_NewVar`](#c.PyObject_GC_NewVar).

Do not call this directly to free an object’s memory; call the type’s
[`tp_free`](typeobj.md#c.PyTypeObject.tp_free) slot instead.

Do not use this for memory allocated by [`PyObject_New`](allocation.md#c.PyObject_New),
[`PyObject_NewVar`](allocation.md#c.PyObject_NewVar), or related allocation functions; use
[`PyObject_Free()`](memory.md#c.PyObject_Free) instead.

#### SEE ALSO
* [`PyObject_Free()`](memory.md#c.PyObject_Free) is the non-GC equivalent of this function.
* [`PyObject_GC_New`](#c.PyObject_GC_New)
* [`PyObject_GC_NewVar`](#c.PyObject_GC_NewVar)
* [`PyType_GenericAlloc()`](type.md#c.PyType_GenericAlloc)
* [`tp_free`](typeobj.md#c.PyTypeObject.tp_free)

### void PyObject_GC_UnTrack(void \*op)

 *Part of the [Stable ABI](stable.md#stable).*

Remove the object *op* from the set of container objects tracked by the
collector.  Note that [`PyObject_GC_Track()`](#c.PyObject_GC_Track) can be called again on
this object to add it back to the set of tracked objects.  The deallocator
([`tp_dealloc`](typeobj.md#c.PyTypeObject.tp_dealloc) handler) should call this for the object before any of
the fields used by the [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler become invalid.

#### Versionchanged
Changed in version 3.8: The `_PyObject_GC_TRACK()` and `_PyObject_GC_UNTRACK()` macros
have been removed from the public C API.

The [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler accepts a function parameter of this type:

### typedef int (\*visitproc)([PyObject](structures.md#c.PyObject) \*object, void \*arg)

 *Part of the [Stable ABI](stable.md#stable).*

Type of the visitor function passed to the [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler.
The function should be called with an object to traverse as *object* and
the third parameter to the [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler as *arg*.  The
Python core uses several visitor functions to implement cyclic garbage
detection; it’s not expected that users will need to write their own
visitor functions.

The [`tp_clear`](typeobj.md#c.PyTypeObject.tp_clear) handler must be of the [`inquiry`](#c.inquiry) type, or `NULL`
if the object is immutable.

### typedef int (\*inquiry)([PyObject](structures.md#c.PyObject) \*self)

 *Part of the [Stable ABI](stable.md#stable).*

Drop references that may have created reference cycles.  Immutable objects
do not have to define this method since they can never directly create
reference cycles.  Note that the object must still be valid after calling
this method (don’t just call [`Py_DECREF()`](refcounting.md#c.Py_DECREF) on a reference).  The
collector will call this method if it detects that this object is involved
in a reference cycle.

<a id="gc-traversal"></a>

## Traversal

The [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler must have the following type:

### typedef int (\*traverseproc)([PyObject](structures.md#c.PyObject) \*self, [visitproc](#c.visitproc) visit, void \*arg)

 *Part of the [Stable ABI](stable.md#stable).*

Traversal function for a garbage-collected object, used by the garbage
collector to detect reference cycles.
Implementations must call the
*visit* function for each object directly contained by *self*, with the
parameters to *visit* being the contained object and the *arg* value passed
to the handler.  The *visit* function must not be called with a `NULL`
object argument.  If *visit* returns a non-zero value, that value should be
returned immediately.

A typical `tp_traverse` function calls the [`Py_VISIT()`](#c.Py_VISIT)
convenience macro on each of the instance’s members that are Python
objects that the instance owns.
For example, this is a (slightly outdated) traversal function for
the [`threading.local`](../library/threading.md#threading.local) class:

```c
static int
local_traverse(PyObject *op, visitproc visit, void *arg)
{
    localobject *self = (localobject *) op;
    Py_VISIT(Py_TYPE(self));
    Py_VISIT(self->args);
    Py_VISIT(self->kw);
    Py_VISIT(self->dict);
    return 0;
}
```

#### NOTE
[`Py_VISIT()`](#c.Py_VISIT) requires the *visit* and *arg* parameters to
`local_traverse()` to have these specific names; don’t name them just
anything.

Instances of [heap-allocated types](typeobj.md#heap-types) hold a reference to
their type. Their traversal function must therefore visit the type:

```c
Py_VISIT(Py_TYPE(self));
```

Alternately, the type may delegate this responsibility by
calling `tp_traverse` of a heap-allocated superclass (or another
heap-allocated type, if applicable).
If they do not, the type object may not be garbage-collected.

If the [`Py_TPFLAGS_MANAGED_DICT`](typeobj.md#c.Py_TPFLAGS_MANAGED_DICT) bit is set in the
[`tp_flags`](typeobj.md#c.PyTypeObject.tp_flags) field, the traverse function must call
[`PyObject_VisitManagedDict()`](object.md#c.PyObject_VisitManagedDict) like this:

```c
int err = PyObject_VisitManagedDict((PyObject*)self, visit, arg);
if (err) {
    return err;
}
```

Only the members that the instance *owns* (by having
[strong references](../glossary.md#term-strong-reference) to them) must be
visited. For instance, if an object supports weak references via the
[`tp_weaklist`](typeobj.md#c.PyTypeObject.tp_weaklist) slot, the pointer supporting
the linked list (what *tp_weaklist* points to) must **not** be
visited as the instance does not directly own the weak references to itself.

The traversal function has a limitation:

#### WARNING
The traversal function must not have any side effects.  Implementations
may not modify the reference counts of any Python objects nor create or
destroy any Python objects, directly or indirectly.

This means that *most* Python C API functions may not be used, since
they can raise a new exception, return a new reference to a result object,
have internal logic that uses side effects.
Also, unless documented otherwise, functions that happen to not have side
effects may start having them in future versions, without warning.

For a list of safe functions, see a
[separate section](#duringgc-functions) below.

#### NOTE
The [`Py_VISIT()`](#c.Py_VISIT) call may be skipped for those members that provably
cannot participate in reference cycles.
In the `local_traverse` example above, there is also a `self->key`
member, but it can only be `NULL` or a Python string and therefore
cannot be part of a reference cycle.

On the other hand, even if you know a member can never be part of a cycle,
as a debugging aid you may want to visit it anyway just so the [`gc`](../library/gc.md#module-gc)
module’s [`get_referents()`](../library/gc.md#gc.get_referents) function will include it.

#### NOTE
The [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) function can be called from any
thread.

**CPython implementation detail:** Garbage collection is a “stop-the-world” operation:
even in [free threading](../glossary.md#term-free-threading) builds, only one thread state is
[attached](../glossary.md#term-attached-thread-state) when `tp_traverse`
handlers run.

#### Versionchanged
Changed in version 3.9: Heap-allocated types are expected to visit `Py_TYPE(self)` in
`tp_traverse`.  In earlier versions of Python, due to
[bug 40217](https://bugs.python.org/issue40217), doing this
may lead to crashes in subclasses.

To simplify writing [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handlers,
a [`Py_VISIT()`](#c.Py_VISIT) macro is provided.
In order to use this macro, the [`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse)
implementation must name its arguments exactly *visit* and *arg*:

### Py_VISIT(o)

If the  *o* is not `NULL`, call the *visit*
callback, with arguments *o* and *arg*.
If *visit* returns a non-zero value, then return it.

This corresponds roughly to:

```c
#define Py_VISIT(o)                             \
   if (op) {                                    \
      int visit_result = visit(o, arg);         \
      if (visit_result != 0) {                  \
         return visit_result;                   \
      }                                         \
   }
```

### Traversal-safe functions

The following functions and macros are safe to use in a
[`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler:

* the *visit* function passed to `tp_traverse`
* [`Py_VISIT()`](#c.Py_VISIT)
* [`Py_SIZE()`](structures.md#c.Py_SIZE)
* [`Py_TYPE()`](structures.md#c.Py_TYPE): if called from a `tp_traverse` handler,
  `Py_TYPE()`’s result will be valid for the duration of the handler call
* [`PyObject_VisitManagedDict()`](object.md#c.PyObject_VisitManagedDict)
* [`PyObject_TypeCheck()`](object.md#c.PyObject_TypeCheck), [`PyType_IsSubtype()`](type.md#c.PyType_IsSubtype),
  [`PyType_HasFeature()`](type.md#c.PyType_HasFeature)
* `Py *<type>*_Check` and `Py *<type>*_CheckExact` – for example,
  [`PyTuple_Check()`](tuple.md#c.PyTuple_Check)
* [“DuringGC” functions](#duringgc-functions)

<a id="duringgc-functions"></a>

### “DuringGC” functions

The following functions should *only* be used in a
[`tp_traverse`](typeobj.md#c.PyTypeObject.tp_traverse) handler; calling them in other
contexts may have unintended consequences.

These functions act like their counterparts without the `_DuringGC` suffix,
but they are guaranteed to not have side effects, they do not set an exception
on failure, and they return/set [borrowed references](../glossary.md#term-borrowed-reference)
as detailed in the individual documentation.

Note that these functions may fail (return `NULL` or `-1`),
but as they do not set an exception, no error information is available.
In some cases, failure is not distinguishable from a successful `NULL` result.

### void \*PyObject_GetTypeData_DuringGC([PyObject](structures.md#c.PyObject) \*o, [PyTypeObject](type.md#c.PyTypeObject) \*cls)

### void \*PyObject_GetItemData_DuringGC([PyObject](structures.md#c.PyObject) \*o)

### void \*PyType_GetModuleState_DuringGC([PyTypeObject](type.md#c.PyTypeObject) \*type)

### void \*PyModule_GetState_DuringGC([PyObject](structures.md#c.PyObject) \*module)

### int PyModule_GetToken_DuringGC([PyObject](structures.md#c.PyObject) \*module, void \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

See [“DuringGC” functions](#duringgc-functions) for common information.

#### Versionadded
Added in version 3.15.0a8 (unreleased).

#### SEE ALSO
[`PyObject_GetTypeData()`](object.md#c.PyObject_GetTypeData),
[`PyObject_GetItemData()`](object.md#c.PyObject_GetItemData),
[`PyType_GetModuleState()`](type.md#c.PyType_GetModuleState),
[`PyModule_GetState()`](module.md#c.PyModule_GetState),
[`PyModule_GetToken()`](module.md#c.PyModule_GetToken),
[`PyType_GetBaseByToken()`](type.md#c.PyType_GetBaseByToken)

### int PyType_GetBaseByToken_DuringGC([PyTypeObject](type.md#c.PyTypeObject) \*type, void \*tp_token, [PyTypeObject](type.md#c.PyTypeObject) \*\*result)

 *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

See [“DuringGC” functions](#duringgc-functions) for common information.

Sets  *\*result* to a [borrowed reference](../glossary.md#term-borrowed-reference) rather than a strong one.
The reference is valid for the duration
of the `tp_traverse` handler call.

#### Versionadded
Added in version 3.15.0a8 (unreleased).

#### SEE ALSO
[`PyType_GetBaseByToken()`](type.md#c.PyType_GetBaseByToken)

### [PyObject](structures.md#c.PyObject) \*PyType_GetModule_DuringGC([PyTypeObject](type.md#c.PyTypeObject) \*type)

### [PyObject](structures.md#c.PyObject) \*PyType_GetModuleByToken_DuringGC([PyTypeObject](type.md#c.PyTypeObject) \*type, const void \*mod_token)

*Return value: Borrowed reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.15.*

See [“DuringGC” functions](#duringgc-functions) for common information.

These functions return a [borrowed reference](../glossary.md#term-borrowed-reference), which is
valid for the duration of the `tp_traverse` handler call.

#### Versionadded
Added in version 3.15.0a8 (unreleased).

#### SEE ALSO
[`PyType_GetModule()`](type.md#c.PyType_GetModule),
[`PyType_GetModuleByToken()`](type.md#c.PyType_GetModuleByToken)

## Controlling the Garbage Collector State

The C-API provides the following functions for controlling
garbage collection runs.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyGC_Collect(void)

 *Part of the [Stable ABI](stable.md#stable).*

Perform a full garbage collection, if the garbage collector is enabled.
(Note that [`gc.collect()`](../library/gc.md#gc.collect) runs it unconditionally.)

Returns the number of collected + unreachable objects which cannot
be collected.
If the garbage collector is disabled or already collecting,
returns `0` immediately.
Errors during garbage collection are passed to [`sys.unraisablehook`](../library/sys.md#sys.unraisablehook).
This function does not raise exceptions.

### int PyGC_Enable(void)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Enable the garbage collector: similar to [`gc.enable()`](../library/gc.md#gc.enable).
Returns the previous state, 0 for disabled and 1 for enabled.

#### Versionadded
Added in version 3.10.

### int PyGC_Disable(void)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Disable the garbage collector: similar to [`gc.disable()`](../library/gc.md#gc.disable).
Returns the previous state, 0 for disabled and 1 for enabled.

#### Versionadded
Added in version 3.10.

### int PyGC_IsEnabled(void)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Query the state of the garbage collector: similar to [`gc.isenabled()`](../library/gc.md#gc.isenabled).
Returns the current state, 0 for disabled and 1 for enabled.

#### Versionadded
Added in version 3.10.

## Querying Garbage Collector State

The C-API provides the following interface for querying information about
the garbage collector.

### void PyUnstable_GC_VisitObjects([gcvisitobjects_t](#c.gcvisitobjects_t) callback, void \*arg)

Run supplied *callback* on all live GC-capable objects. *arg* is passed through to
all invocations of *callback*.

#### WARNING
If new objects are (de)allocated by the callback it is undefined if they
will be visited.

Garbage collection is disabled during operation. Explicitly running a collection
in the callback may lead to undefined behaviour e.g. visiting the same objects
multiple times or not at all.

#### Versionadded
Added in version 3.12.

### typedef int (\*gcvisitobjects_t)([PyObject](structures.md#c.PyObject) \*object, void \*arg)

Type of the visitor function to be passed to [`PyUnstable_GC_VisitObjects()`](#c.PyUnstable_GC_VisitObjects).
*arg* is the same as the *arg* passed to `PyUnstable_GC_VisitObjects`.
Return `1` to continue iteration, return `0` to stop iteration. Other return
values are reserved for now so behavior on returning anything else is undefined.

#### Versionadded
Added in version 3.12.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
