<a id="gen-objects"></a>

# Generator Objects

Generator objects are what Python uses to implement generator iterators. They
are normally created by iterating over a function that yields values, rather
than explicitly calling [`PyGen_New()`](#c.PyGen_New) or [`PyGen_NewWithQualName()`](#c.PyGen_NewWithQualName).

### type PyGenObject

The C structure used for generator objects.

### [PyTypeObject](type.md#c.PyTypeObject) PyGen_Type

The type object corresponding to generator objects.

### int PyGen_Check([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob* is a generator object; *ob* must not be `NULL`.  This
function always succeeds.

### int PyGen_CheckExact([PyObject](structures.md#c.PyObject) \*ob)

Return true if *ob*’s type is [`PyGen_Type`](#c.PyGen_Type); *ob* must not be
`NULL`.  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyGen_New([PyFrameObject](frame.md#c.PyFrameObject) \*frame)

*Return value: New reference.*

Create and return a new generator object based on the *frame* object.
A reference to *frame* is stolen by this function. The argument must not be
`NULL`.

### [PyObject](structures.md#c.PyObject) \*PyGen_NewWithQualName([PyFrameObject](frame.md#c.PyFrameObject) \*frame, [PyObject](structures.md#c.PyObject) \*name, [PyObject](structures.md#c.PyObject) \*qualname)

*Return value: New reference.*

Create and return a new generator object based on the *frame* object,
with `__name__` and `__qualname__` set to *name* and *qualname*.
A reference to *frame* is stolen by this function.  The *frame* argument
must not be `NULL`.

### [PyCodeObject](code.md#c.PyCodeObject) \*PyGen_GetCode([PyGenObject](#c.PyGenObject) \*gen)

Return a new [strong reference](../glossary.md#term-strong-reference) to the code object wrapped by *gen*.
This function always succeeds.

## Asynchronous Generator Objects

#### SEE ALSO
[**PEP 525**](https://peps.python.org/pep-0525/)

### [PyTypeObject](type.md#c.PyTypeObject) PyAsyncGen_Type

The type object corresponding to asynchronous generator objects. This is
available as [`types.AsyncGeneratorType`](../library/types.md#types.AsyncGeneratorType) in the Python layer.

#### Versionadded
Added in version 3.6.

### [PyObject](structures.md#c.PyObject) \*PyAsyncGen_New([PyFrameObject](frame.md#c.PyFrameObject) \*frame, [PyObject](structures.md#c.PyObject) \*name, [PyObject](structures.md#c.PyObject) \*qualname)

Create a new asynchronous generator wrapping *frame*, with `__name__` and
`__qualname__` set to *name* and *qualname*. *frame* is stolen by this
function and must not be `NULL`.

On success, this function returns a [strong reference](../glossary.md#term-strong-reference) to the
new asynchronous generator. On failure, this function returns `NULL`
with an exception set.

#### Versionadded
Added in version 3.6.

### int PyAsyncGen_CheckExact([PyObject](structures.md#c.PyObject) \*op)

Return true if *op* is an asynchronous generator object, false otherwise.
This function always succeeds.

#### Versionadded
Added in version 3.6.

## Deprecated API

### PyAsyncGenASend_CheckExact(op)

This is an API that was included in Python’s C API
by mistake.

It is solely here for completeness; do not use this API.

#### Soft-deprecated
[Soft deprecated](../glossary.md#term-soft-deprecated) since version 3.14.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
