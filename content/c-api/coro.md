<a id="coro-objects"></a>

# Coroutine Objects

#### Versionadded
Added in version 3.5.

Coroutine objects are what functions declared with an `async` keyword
return.

### type PyCoroObject

The C structure used for coroutine objects.

### [PyTypeObject](type.md#c.PyTypeObject) PyCoro_Type

The type object corresponding to coroutine objects.

### int PyCoro_CheckExact([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob*’s type is [`PyCoro_Type`](#c.PyCoro_Type); *ob* must not be `NULL`.
This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyCoro_New([PyFrameObject](frame.md#c.PyFrameObject) \*frame, [PyObject](structures.md#c.PyObject) \*name, [PyObject](structures.md#c.PyObject) \*qualname)

*Return value: New reference.*

Create and return a new coroutine object based on the *frame* object,
with `__name__` and `__qualname__` set to *name* and *qualname*.
A reference to *frame* is stolen by this function.  The *frame* argument
must not be `NULL`.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
