<a id="complexobjects"></a>

# Complex Number Objects

<a id="index-0"></a>

### type PyComplexObject

This subtype of [`PyObject`](structures.md#c.PyObject) represents a Python complex number object.

### [Py_complex](#c.Py_complex) cval

The complex number value, using the C [`Py_complex`](#c.Py_complex) representation.

#### Deprecated-removed
Deprecated since version 3.15, will be removed in version 3.20: Use [`PyComplex_AsCComplex()`](#c.PyComplex_AsCComplex) and
[`PyComplex_FromCComplex()`](#c.PyComplex_FromCComplex) to convert a
Python complex number to/from the C [`Py_complex`](#c.Py_complex)
representation.

### [PyTypeObject](type.md#c.PyTypeObject) PyComplex_Type

 *Part of the [Stable ABI](stable.md#stable).*

This instance of [`PyTypeObject`](type.md#c.PyTypeObject) represents the Python complex number
type. It is the same object as [`complex`](../library/functions.md#complex) in the Python layer.

### int PyComplex_Check([PyObject](structures.md#c.PyObject) \*p)

Return true if its argument is a [`PyComplexObject`](#c.PyComplexObject) or a subtype of
[`PyComplexObject`](#c.PyComplexObject).  This function always succeeds.

### int PyComplex_CheckExact([PyObject](structures.md#c.PyObject) \*p)

Return true if its argument is a [`PyComplexObject`](#c.PyComplexObject), but not a subtype of
[`PyComplexObject`](#c.PyComplexObject).  This function always succeeds.

### [PyObject](structures.md#c.PyObject) \*PyComplex_FromDoubles(double real, double imag)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a new [`PyComplexObject`](#c.PyComplexObject) object from *real* and *imag*.
Return `NULL` with an exception set on error.

### double PyComplex_RealAsDouble([PyObject](structures.md#c.PyObject) \*op)

 *Part of the [Stable ABI](stable.md#stable).*

Return the real part of *op* as a C .

If *op* is not a Python complex number object but has a
[`__complex__()`](../reference/datamodel.md#object.__complex__) method, this method will first be called to
convert *op* to a Python complex number object.  If `__complex__()` is
not defined then it falls back to call [`PyFloat_AsDouble()`](float.md#c.PyFloat_AsDouble) and
returns its result.

Upon failure, this method returns `-1.0` with an exception set, so one
should call [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to check for errors.

#### Versionchanged
Changed in version 3.13: Use [`__complex__()`](../reference/datamodel.md#object.__complex__) if available.

### double PyComplex_ImagAsDouble([PyObject](structures.md#c.PyObject) \*op)

 *Part of the [Stable ABI](stable.md#stable).*

Return the imaginary part of *op* as a C .

If *op* is not a Python complex number object but has a
[`__complex__()`](../reference/datamodel.md#object.__complex__) method, this method will first be called to
convert *op* to a Python complex number object.  If `__complex__()` is
not defined then it falls back to call [`PyFloat_AsDouble()`](float.md#c.PyFloat_AsDouble) and
returns `0.0` on success.

Upon failure, this method returns `-1.0` with an exception set, so one
should call [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to check for errors.

#### Versionchanged
Changed in version 3.13: Use [`__complex__()`](../reference/datamodel.md#object.__complex__) if available.

### type Py_complex

This C structure defines an export format for a Python complex
number object.

### double real

### double imag

The structure is defined as:

```c
typedef struct {
    double real;
    double imag;
} Py_complex;
```

### [PyObject](structures.md#c.PyObject) \*PyComplex_FromCComplex([Py_complex](#c.Py_complex) v)

*Return value: New reference.*

Create a new Python complex number object from a C [`Py_complex`](#c.Py_complex) value.
Return `NULL` with an exception set on error.

### [Py_complex](#c.Py_complex) PyComplex_AsCComplex([PyObject](structures.md#c.PyObject) \*op)

Return the [`Py_complex`](#c.Py_complex) value of the complex number *op*.

If *op* is not a Python complex number object but has a [`__complex__()`](../reference/datamodel.md#object.__complex__)
method, this method will first be called to convert *op* to a Python complex
number object.  If `__complex__()` is not defined then it falls back to
[`__float__()`](../reference/datamodel.md#object.__float__).  If `__float__()` is not defined then it falls back
to [`__index__()`](../reference/datamodel.md#object.__index__).

Upon failure, this method returns [`Py_complex`](#c.Py_complex)
with [`real`](#c.Py_complex.real) set to `-1.0` and with an exception set, so one
should call [`PyErr_Occurred()`](exceptions.md#c.PyErr_Occurred) to check for errors.

#### Versionchanged
Changed in version 3.8: Use [`__index__()`](../reference/datamodel.md#object.__index__) if available.

## Complex Numbers as C Structures

The API also provides functions for working with complex numbers, using the
[`Py_complex`](#c.Py_complex) representation.  Note that the functions which accept
these structures as parameters and return them as results do so *by value*
rather than dereferencing them through pointers.

Please note, that these functions are [soft deprecated](../glossary.md#term-soft-deprecated) since Python
3.15.  Avoid using this API in a new code to do complex arithmetic: either use
the [Number Protocol](number) API or use native complex types, like
.

### [Py_complex](#c.Py_complex) \_Py_c_sum([Py_complex](#c.Py_complex) left, [Py_complex](#c.Py_complex) right)

Return the sum of two complex numbers, using the C [`Py_complex`](#c.Py_complex)
representation.

#### Deprecated
Deprecated since version 3.15.

### [Py_complex](#c.Py_complex) \_Py_c_diff([Py_complex](#c.Py_complex) left, [Py_complex](#c.Py_complex) right)

Return the difference between two complex numbers, using the C
[`Py_complex`](#c.Py_complex) representation.

#### Deprecated
Deprecated since version 3.15.

### [Py_complex](#c.Py_complex) \_Py_c_neg([Py_complex](#c.Py_complex) num)

Return the negation of the complex number *num*, using the C
[`Py_complex`](#c.Py_complex) representation.

#### Deprecated
Deprecated since version 3.15.

### [Py_complex](#c.Py_complex) \_Py_c_prod([Py_complex](#c.Py_complex) left, [Py_complex](#c.Py_complex) right)

Return the product of two complex numbers, using the C [`Py_complex`](#c.Py_complex)
representation.

#### Deprecated
Deprecated since version 3.15.

### [Py_complex](#c.Py_complex) \_Py_c_quot([Py_complex](#c.Py_complex) dividend, [Py_complex](#c.Py_complex) divisor)

Return the quotient of two complex numbers, using the C [`Py_complex`](#c.Py_complex)
representation.

If *divisor* is null, this method returns zero and sets
`errno` to `EDOM`.

#### Deprecated
Deprecated since version 3.15.

### [Py_complex](#c.Py_complex) \_Py_c_pow([Py_complex](#c.Py_complex) num, [Py_complex](#c.Py_complex) exp)

Return the exponentiation of *num* by *exp*, using the C [`Py_complex`](#c.Py_complex)
representation.

If *num* is null and *exp* is not a positive real number,
this method returns zero and sets `errno` to `EDOM`.

Set `errno` to `ERANGE` on overflows.

#### Deprecated
Deprecated since version 3.15.

### double \_Py_c_abs([Py_complex](#c.Py_complex) num)

Return the absolute value of the complex number *num*.

Set `errno` to `ERANGE` on overflows.

#### Deprecated
Deprecated since version 3.15.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
