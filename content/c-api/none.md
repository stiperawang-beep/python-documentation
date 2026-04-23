<a id="noneobject"></a>

# The `None` Object

<a id="index-0"></a>

Note that the [`PyTypeObject`](type.md#c.PyTypeObject) for `None` is not directly exposed in the
Python/C API.  Since `None` is a singleton, testing for object identity (using
`==` in C) is sufficient. There is no `PyNone_Check()` function for the
same reason.

### [PyObject](structures.md#c.PyObject) \*Py_None

The Python `None` object, denoting lack of value.  This object has no methods
and is [immortal](../glossary.md#term-immortal).

#### Versionchanged
Changed in version 3.12: [`Py_None`](#c.Py_None) is [immortal](../glossary.md#term-immortal).

### Py_RETURN_NONE

Return [`Py_None`](#c.Py_None) from a function.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
