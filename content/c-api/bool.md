<a id="boolobjects"></a>

# Boolean Objects

Booleans in Python are implemented as a subclass of integers.  There are only
two booleans, [`Py_False`](#c.Py_False) and [`Py_True`](#c.Py_True).  As such, the normal
creation and deletion functions don’t apply to booleans.  The following macros
are available, however.

### [PyTypeObject](type.md#c.PyTypeObject) PyBool_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python boolean type; it
is the same object as [`bool`](../library/functions.md#bool) in the Python layer.

### int PyBool_Check([PyObject](structures.md#c.PyObject) \*o)

Return true if *o* is of type [`PyBool_Type`](#c.PyBool_Type).  This function always
succeeds.

### [PyObject](structures.md#c.PyObject) \*Py_False

The Python `False` object.  This object has no methods and is
[immortal](../glossary.md#term-immortal).

#### Versionchanged
Changed in version 3.12: [`Py_False`](#c.Py_False) is [immortal](../glossary.md#term-immortal).

### [PyObject](structures.md#c.PyObject) \*Py_True

The Python `True` object.  This object has no methods and is
[immortal](../glossary.md#term-immortal).

#### Versionchanged
Changed in version 3.12: [`Py_True`](#c.Py_True) is [immortal](../glossary.md#term-immortal).

### Py_RETURN_FALSE

Return [`Py_False`](#c.Py_False) from a function.

### Py_RETURN_TRUE

Return [`Py_True`](#c.Py_True) from a function.

### [PyObject](structures.md#c.PyObject) \*PyBool_FromLong(long v)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return [`Py_True`](#c.Py_True) or [`Py_False`](#c.Py_False), depending on the truth value of *v*.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
