# Frame objects

### type PyFrameObject

 *Part of the [Stable ABI](stable.md#stable) (as an opaque struct).*

The C structure of the objects used to describe frame objects.

There are no public members in this structure.

#### Versionchanged
Changed in version 3.11: The members of this structure were removed from the public C API.
Refer to the [What’s New entry](../whatsnew/3.11.md#pyframeobject-3-11-hiding)
for details.

The [`PyEval_GetFrame()`](reflection.md#c.PyEval_GetFrame) and [`PyThreadState_GetFrame()`](threads.md#c.PyThreadState_GetFrame) functions
can be used to get a frame object.

See also [Reflection](reflection.md#reflection).

### [PyTypeObject](type.md#c.PyTypeObject) PyFrame_Type

The type of frame objects.
It is the same object as [`types.FrameType`](../library/types.md#types.FrameType) in the Python layer.

#### Versionchanged
Changed in version 3.11: Previously, this type was only available after including
`<frameobject.h>`.

### [PyFrameObject](#c.PyFrameObject) \*PyFrame_New([PyThreadState](threads.md#c.PyThreadState) \*tstate, [PyCodeObject](code.md#c.PyCodeObject) \*code, [PyObject](structures.md#c.PyObject) \*globals, [PyObject](structures.md#c.PyObject) \*locals)

Create a new frame object. This function returns a [strong reference](../glossary.md#term-strong-reference)
to the new frame object on success, and returns `NULL` with an exception
set on failure.

### int PyFrame_Check([PyObject](structures.md#c.PyObject) \*obj)

Return non-zero if *obj* is a frame object.

#### Versionchanged
Changed in version 3.11: Previously, this function was only available after including
`<frameobject.h>`.

### [PyFrameObject](#c.PyFrameObject) \*PyFrame_GetBack([PyFrameObject](#c.PyFrameObject) \*frame)

*Return value: New reference.*

Get the *frame* next outer frame.

Return a [strong reference](../glossary.md#term-strong-reference), or `NULL` if *frame* has no outer
frame.
This raises no exceptions.

#### Versionadded
Added in version 3.9.

### [PyObject](structures.md#c.PyObject) \*PyFrame_GetBuiltins([PyFrameObject](#c.PyFrameObject) \*frame)

*Return value: New reference.*

Get the *frame*’s [`f_builtins`](../reference/datamodel.md#frame.f_builtins) attribute.

Return a [strong reference](../glossary.md#term-strong-reference). The result cannot be `NULL`.

#### Versionadded
Added in version 3.11.

### [PyCodeObject](code.md#c.PyCodeObject) \*PyFrame_GetCode([PyFrameObject](#c.PyFrameObject) \*frame)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Get the *frame* code.

Return a [strong reference](../glossary.md#term-strong-reference).

The result (frame code) cannot be `NULL`.

#### Versionadded
Added in version 3.9.

### [PyObject](structures.md#c.PyObject) \*PyFrame_GetGenerator([PyFrameObject](#c.PyFrameObject) \*frame)

*Return value: New reference.*

Get the generator, coroutine, or async generator that owns this frame,
or `NULL` if this frame is not owned by a generator.
Does not raise an exception, even if the return value is `NULL`.

Return a [strong reference](../glossary.md#term-strong-reference), or `NULL`.

#### Versionadded
Added in version 3.11.

### [PyObject](structures.md#c.PyObject) \*PyFrame_GetGlobals([PyFrameObject](#c.PyFrameObject) \*frame)

*Return value: New reference.*

Get the *frame*’s [`f_globals`](../reference/datamodel.md#frame.f_globals) attribute.

Return a [strong reference](../glossary.md#term-strong-reference). The result cannot be `NULL`.

#### Versionadded
Added in version 3.11.

### int PyFrame_GetLasti([PyFrameObject](#c.PyFrameObject) \*frame)

Get the *frame*’s [`f_lasti`](../reference/datamodel.md#frame.f_lasti) attribute.

Returns -1 if `frame.f_lasti` is `None`.

#### Versionadded
Added in version 3.11.

### [PyObject](structures.md#c.PyObject) \*PyFrame_GetVar([PyFrameObject](#c.PyFrameObject) \*frame, [PyObject](structures.md#c.PyObject) \*name)

*Return value: New reference.*

Get the variable *name* of *frame*.

* Return a [strong reference](../glossary.md#term-strong-reference) to the variable value on success.
* Raise [`NameError`](../library/exceptions.md#NameError) and return `NULL` if the variable does not exist.
* Raise an exception and return `NULL` on error.

*name* type must be a [`str`](../library/stdtypes.md#str).

#### Versionadded
Added in version 3.12.

### [PyObject](structures.md#c.PyObject) \*PyFrame_GetVarString([PyFrameObject](#c.PyFrameObject) \*frame, const char \*name)

*Return value: New reference.*

Similar to [`PyFrame_GetVar()`](#c.PyFrame_GetVar), but the variable name is a C string
encoded in UTF-8.

#### Versionadded
Added in version 3.12.

### [PyObject](structures.md#c.PyObject) \*PyFrame_GetLocals([PyFrameObject](#c.PyFrameObject) \*frame)

*Return value: New reference.*

Get the *frame*’s [`f_locals`](../reference/datamodel.md#frame.f_locals) attribute.
If the frame refers to an [optimized scope](../glossary.md#term-optimized-scope), this returns a
write-through proxy object that allows modifying the locals.
In all other cases (classes, modules, [`exec()`](../library/functions.md#exec), [`eval()`](../library/functions.md#eval)) it returns
the mapping representing the frame locals directly (as described for
[`locals()`](../library/functions.md#locals)).

Return a [strong reference](../glossary.md#term-strong-reference).

#### Versionadded
Added in version 3.11.

#### Versionchanged
Changed in version 3.13: As part of [**PEP 667**](https://peps.python.org/pep-0667/), return an instance of [`PyFrameLocalsProxy_Type`](#c.PyFrameLocalsProxy_Type).

### int PyFrame_GetLineNumber([PyFrameObject](#c.PyFrameObject) \*frame)

 *Part of the [Stable ABI](stable.md#stable) since version 3.10.*

Return the line number that *frame* is currently executing.

## Frame locals proxies

#### Versionadded
Added in version 3.13.

The [`f_locals`](../reference/datamodel.md#frame.f_locals) attribute on a [frame object](../reference/datamodel.md#frame-objects)
is an instance of a “frame-locals proxy”. The proxy object exposes a
write-through view of the underlying locals dictionary for the frame. This
ensures that the variables exposed by `f_locals` are always up to date with
the live local variables in the frame itself.

See [**PEP 667**](https://peps.python.org/pep-0667/) for more information.

### [PyTypeObject](type.md#c.PyTypeObject) PyFrameLocalsProxy_Type

The type of frame [`locals()`](../library/functions.md#locals) proxy objects.

### int PyFrameLocalsProxy_Check([PyObject](structures.md#c.PyObject) \*obj)

Return non-zero if *obj* is a frame [`locals()`](../library/functions.md#locals) proxy.

## Legacy local variable APIs

These APIs are [soft deprecated](../glossary.md#term-soft-deprecated). As of Python 3.13, they do nothing.
They exist solely for backwards compatibility.

### void PyFrame_LocalsToFast([PyFrameObject](#c.PyFrameObject) \*f, int clear)

Prior to Python 3.13, this function would copy the [`f_locals`](../reference/datamodel.md#frame.f_locals)
attribute of *f* to the internal “fast” array of local variables, allowing
changes in frame objects to be visible to the interpreter. If *clear* was
true, this function would process variables that were unset in the locals
dictionary.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.13: This function now does nothing.

### void PyFrame_FastToLocals([PyFrameObject](#c.PyFrameObject) \*f)

Prior to Python 3.13, this function would copy the internal “fast” array
of local variables (which is used by the interpreter) to the
[`f_locals`](../reference/datamodel.md#frame.f_locals) attribute of *f*, allowing changes in local
variables to be visible to frame objects.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.13: This function now does nothing.

### int PyFrame_FastToLocalsWithError([PyFrameObject](#c.PyFrameObject) \*f)

Prior to Python 3.13, this function was similar to
[`PyFrame_FastToLocals()`](#c.PyFrame_FastToLocals), but would return `0` on success, and
`-1` with an exception set on failure.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.13: This function now does nothing.

#### SEE ALSO
[**PEP 667**](https://peps.python.org/pep-0667/)

## Internal frames

Unless using [**PEP 523**](https://peps.python.org/pep-0523/), you will not need this.

### struct \_PyInterpreterFrame

The interpreter’s internal frame representation.

#### Versionadded
Added in version 3.11.

### [PyObject](structures.md#c.PyObject) \*PyUnstable_InterpreterFrame_GetCode(struct [\_PyInterpreterFrame](#c._PyInterpreterFrame) \*frame);

> Return a [strong reference](../glossary.md#term-strong-reference) to the code object for the frame.

#### Versionadded
Added in version 3.12.

### int PyUnstable_InterpreterFrame_GetLasti(struct [\_PyInterpreterFrame](#c._PyInterpreterFrame) \*frame);

Return the byte offset into the last executed instruction.

#### Versionadded
Added in version 3.12.

### int PyUnstable_InterpreterFrame_GetLine(struct [\_PyInterpreterFrame](#c._PyInterpreterFrame) \*frame);

Return the currently executing line number, or -1 if there is no line number.

#### Versionadded
Added in version 3.12.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
