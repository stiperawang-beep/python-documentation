<a id="function-objects"></a>

# Function Objects

<a id="index-0"></a>

There are a few functions specific to Python functions.

### type PyFunctionObject

The C structure used for functions.

### [PyTypeObject](type.md#c.PyTypeObject) PyFunction_Type

<a id="index-1"></a>

This is an instance of [`PyTypeObject`](type.md#c.PyTypeObject) and represents the Python function
type.  It is exposed to Python programmers as `types.FunctionType`.

### int PyFunction_Check([PyObject](structures.md#c.PyObject) \*o)

Return true if *o* is a function object (has type [`PyFunction_Type`](#c.PyFunction_Type)).
The parameter must not be `NULL`.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyFunction_New([PyObject](structures.md#c.PyObject) \*code, [PyObject](structures.md#c.PyObject) \*globals)

*Return value: New reference.*

Return a new function object associated with the code object *code*. *globals*
must be a dictionary with the global variables accessible to the function.

The function’s docstring and name are retrieved from the code object.
[`__module__`](../reference/datamodel.md#function.__module__)
is retrieved from *globals*. The argument defaults, annotations and closure are
set to `NULL`. [`__qualname__`](../reference/datamodel.md#function.__qualname__) is set to the same value as
the code object’s [`co_qualname`](../reference/datamodel.md#codeobject.co_qualname) field.

### [PyObject](structures.md#c.PyObject) \*PyFunction_NewWithQualName([PyObject](structures.md#c.PyObject) \*code, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*qualname)

*Return value: New reference.*

As [`PyFunction_New()`](#c.PyFunction_New), but also allows setting the function object’s
[`__qualname__`](../reference/datamodel.md#function.__qualname__) attribute.
*qualname* should be a unicode object or `NULL`;
if `NULL`, the `__qualname__` attribute is set to the same value as
the code object’s [`co_qualname`](../reference/datamodel.md#codeobject.co_qualname) field.

#### Versionadded
Added in version 3.3.

### [PyObject](structures.md#c.PyObject) \*PyFunction_GetCode([PyObject](structures.md#c.PyObject) \*op)

*Return value: Borrowed reference.*

Return the code object associated with the function object *op*.

### [PyObject](structures.md#c.PyObject) \*PyFunction_GetGlobals([PyObject](structures.md#c.PyObject) \*op)

*Return value: Borrowed reference.*

Return the globals dictionary associated with the function object *op*.

### [PyObject](structures.md#c.PyObject) \*PyFunction_GetModule([PyObject](structures.md#c.PyObject) \*op)

*Return value: Borrowed reference.*

Return a [borrowed reference](../glossary.md#term-borrowed-reference) to the [`__module__`](../reference/datamodel.md#function.__module__)
attribute of the [function object](../reference/datamodel.md#user-defined-funcs) *op*.
It can be *NULL*.

This is normally a [`string`](../library/stdtypes.md#str) containing the module name,
but can be set to any other object by Python code.

### [PyObject](structures.md#c.PyObject) \*PyFunction_GetDefaults([PyObject](structures.md#c.PyObject) \*op)

*Return value: Borrowed reference.*

Return the argument default values of the function object *op*. This can be a
tuple of arguments or `NULL`.

### int PyFunction_SetDefaults([PyObject](structures.md#c.PyObject) \*op, [PyObject](structures.md#c.PyObject) \*defaults)

Set the argument default values for the function object *op*. *defaults* must be
`Py_None` or a tuple.

Raises [`SystemError`](../library/exceptions.md#SystemError) and returns `-1` on failure.

### void PyFunction_SetVectorcall([PyFunctionObject](#c.PyFunctionObject) \*func, [vectorcallfunc](call.md#c.vectorcallfunc) vectorcall)

Set the vectorcall field of a given function object *func*.

Warning: extensions using this API must preserve the behavior
of the unaltered (default) vectorcall function!

#### Versionadded
Added in version 3.12.

### [PyObject](structures.md#c.PyObject) \*PyFunction_GetKwDefaults([PyObject](structures.md#c.PyObject) \*op)

*Return value: Borrowed reference.*

Return the keyword-only argument default values of the function object *op*. This can be a
dictionary of arguments or `NULL`.

### int PyFunction_SetKwDefaults([PyObject](structures.md#c.PyObject) \*op, [PyObject](structures.md#c.PyObject) \*defaults)

Set the keyword-only argument default values of the function object *op*.
*defaults* must be a dictionary of keyword-only arguments or `Py_None`.

This function returns `0` on success, and returns `-1` with an exception
set on failure.

### [PyObject](structures.md#c.PyObject) \*PyFunction_GetClosure([PyObject](structures.md#c.PyObject) \*op)

*Return value: Borrowed reference.*

Return the closure associated with the function object *op*. This can be `NULL`
or a tuple of cell objects.

### int PyFunction_SetClosure([PyObject](structures.md#c.PyObject) \*op, [PyObject](structures.md#c.PyObject) \*closure)

Set the closure associated with the function object *op*. *closure* must be
`Py_None` or a tuple of cell objects.

Raises [`SystemError`](../library/exceptions.md#SystemError) and returns `-1` on failure.

### [PyObject](structures.md#c.PyObject) \*PyFunction_GetAnnotations([PyObject](structures.md#c.PyObject) \*op)

*Return value: Borrowed reference.*

Return the annotations of the function object *op*. This can be a
mutable dictionary or `NULL`.

### int PyFunction_SetAnnotations([PyObject](structures.md#c.PyObject) \*op, [PyObject](structures.md#c.PyObject) \*annotations)

Set the annotations for the function object *op*. *annotations*
must be a dictionary or `Py_None`.

Raises [`SystemError`](../library/exceptions.md#SystemError) and returns `-1` on failure.

### [PyObject](structures.md#c.PyObject) \*PyFunction_GET_CODE([PyObject](structures.md#c.PyObject) \*op)

### [PyObject](structures.md#c.PyObject) \*PyFunction_GET_GLOBALS([PyObject](structures.md#c.PyObject) \*op)

### [PyObject](structures.md#c.PyObject) \*PyFunction_GET_MODULE([PyObject](structures.md#c.PyObject) \*op)

### [PyObject](structures.md#c.PyObject) \*PyFunction_GET_DEFAULTS([PyObject](structures.md#c.PyObject) \*op)

### [PyObject](structures.md#c.PyObject) \*PyFunction_GET_KW_DEFAULTS([PyObject](structures.md#c.PyObject) \*op)

### [PyObject](structures.md#c.PyObject) \*PyFunction_GET_CLOSURE([PyObject](structures.md#c.PyObject) \*op)

### [PyObject](structures.md#c.PyObject) \*PyFunction_GET_ANNOTATIONS([PyObject](structures.md#c.PyObject) \*op)

*Return value: Borrowed reference.*

These functions are similar to their `PyFunction_Get*` counterparts, but
do not do type checking. Passing anything other than an instance of
[`PyFunction_Type`](#c.PyFunction_Type) is undefined behavior.

### int PyFunction_AddWatcher([PyFunction_WatchCallback](#c.PyFunction_WatchCallback) callback)

Register *callback* as a function watcher for the current interpreter.
Return an ID which may be passed to [`PyFunction_ClearWatcher()`](#c.PyFunction_ClearWatcher).
In case of error (e.g. no more watcher IDs available),
return `-1` and set an exception.

#### Versionadded
Added in version 3.12.

### int PyFunction_ClearWatcher(int watcher_id)

Clear watcher identified by *watcher_id* previously returned from
[`PyFunction_AddWatcher()`](#c.PyFunction_AddWatcher) for the current interpreter.
Return `0` on success, or `-1` and set an exception on error
(e.g.  if the given *watcher_id* was never registered.)

#### Versionadded
Added in version 3.12.

### type PyFunction_WatchEvent

> Enumeration of possible function watcher events:

> - `PyFunction_EVENT_CREATE`
> - `PyFunction_EVENT_DESTROY`
> - `PyFunction_EVENT_MODIFY_CODE`
> - `PyFunction_EVENT_MODIFY_DEFAULTS`
> - `PyFunction_EVENT_MODIFY_KWDEFAULTS`

#### Versionadded
Added in version 3.12: 

- `PyFunction_PYFUNC_EVENT_MODIFY_QUALNAME`

#### Versionadded
Added in version 3.15.

### typedef int (\*PyFunction_WatchCallback)([PyFunction_WatchEvent](#c.PyFunction_WatchEvent) event, [PyFunctionObject](#c.PyFunctionObject) \*func, [PyObject](structures.md#c.PyObject) \*new_value)

Type of a function watcher callback function.

If *event* is `PyFunction_EVENT_CREATE` or `PyFunction_EVENT_DESTROY`
then *new_value* will be `NULL`. Otherwise, *new_value* will hold a
[borrowed reference](../glossary.md#term-borrowed-reference) to the new value that is about to be stored in
*func* for the attribute that is being modified.

The callback may inspect but must not modify *func*; doing so could have
unpredictable effects, including infinite recursion.

If *event* is `PyFunction_EVENT_CREATE`, then the callback is invoked
after *func* has been fully initialized. Otherwise, the callback is invoked
before the modification to *func* takes place, so the prior state of *func*
can be inspected. The runtime is permitted to optimize away the creation of
function objects when possible. In such cases no event will be emitted.
Although this creates the possibility of an observable difference of
runtime behavior depending on optimization decisions, it does not change
the semantics of the Python code being executed.

If *event* is `PyFunction_EVENT_DESTROY`, taking a reference in the
callback to the about-to-be-destroyed function will resurrect it, preventing
it from being freed at this time. When the resurrected object is destroyed
later, any watcher callbacks active at that time will be called again.

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

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
