<a id="number"></a>

# Number Protocol

### int PyNumber_Check([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable).*

Returns `1` if the object *o* provides numeric protocols, and false otherwise.
This function always succeeds.

#### Versionchanged
Changed in version 3.8: Returns `1` if *o* is an index integer.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Add([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of adding *o1* and *o2*, or `NULL` on failure.  This is the
equivalent of the Python expression `o1 + o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Subtract([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of subtracting *o2* from *o1*, or `NULL` on failure.  This is
the equivalent of the Python expression `o1 - o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Multiply([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of multiplying *o1* and *o2*, or `NULL` on failure.  This is
the equivalent of the Python expression `o1 * o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_MatrixMultiply([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Returns the result of matrix multiplication on *o1* and *o2*, or `NULL` on
failure.  This is the equivalent of the Python expression `o1 @ o2`.

#### Versionadded
Added in version 3.5.

### [PyObject](structures.md#c.PyObject) \*PyNumber_FloorDivide([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return the floor of *o1* divided by *o2*, or `NULL` on failure.  This is
the equivalent of the Python expression `o1 // o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_TrueDivide([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a reasonable approximation for the mathematical value of *o1* divided by
*o2*, or `NULL` on failure.  The return value is “approximate” because binary
floating-point numbers are approximate; it is not possible to represent all real
numbers in base two.  This function can return a floating-point value when
passed two integers.  This is the equivalent of the Python expression `o1 / o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Remainder([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the remainder of dividing *o1* by *o2*, or `NULL` on failure.  This is
the equivalent of the Python expression `o1 % o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Divmod([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-0"></a>

See the built-in function [`divmod()`](../library/functions.md#divmod). Returns `NULL` on failure.  This is
the equivalent of the Python expression `divmod(o1, o2)`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Power([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2, [PyObject](structures.md#c.PyObject) \*o3)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-1"></a>

See the built-in function [`pow()`](../library/functions.md#pow). Returns `NULL` on failure.  This is the
equivalent of the Python expression `pow(o1, o2, o3)`, where *o3* is optional.
If *o3* is to be ignored, pass [`Py_None`](none.md#c.Py_None) in its place (passing `NULL` for
*o3* would cause an illegal memory access).

### [PyObject](structures.md#c.PyObject) \*PyNumber_Negative([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the negation of *o* on success, or `NULL` on failure. This is the
equivalent of the Python expression `-o`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Positive([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns *o* on success, or `NULL` on failure.  This is the equivalent of the
Python expression `+o`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Absolute([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-2"></a>

Returns the absolute value of *o*, or `NULL` on failure.  This is the equivalent
of the Python expression `abs(o)`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Invert([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the bitwise negation of *o* on success, or `NULL` on failure.  This is
the equivalent of the Python expression `~o`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Lshift([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of left shifting *o1* by *o2* on success, or `NULL` on
failure.  This is the equivalent of the Python expression `o1 << o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Rshift([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of right shifting *o1* by *o2* on success, or `NULL` on
failure.  This is the equivalent of the Python expression `o1 >> o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_And([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the “bitwise and” of *o1* and *o2* on success and `NULL` on failure.
This is the equivalent of the Python expression `o1 & o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Xor([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the “bitwise exclusive or” of *o1* by *o2* on success, or `NULL` on
failure.  This is the equivalent of the Python expression `o1 ^ o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Or([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the “bitwise or” of *o1* and *o2* on success, or `NULL` on failure.
This is the equivalent of the Python expression `o1 | o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceAdd([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of adding *o1* and *o2*, or `NULL` on failure.  The operation
is done *in-place* when *o1* supports it.  This is the equivalent of the Python
statement `o1 += o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceSubtract([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of subtracting *o2* from *o1*, or `NULL` on failure.  The
operation is done *in-place* when *o1* supports it.  This is the equivalent of
the Python statement `o1 -= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceMultiply([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of multiplying *o1* and *o2*, or `NULL` on failure.  The
operation is done *in-place* when *o1* supports it.  This is the equivalent of
the Python statement `o1 *= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceMatrixMultiply([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable) since version 3.7.*

Returns the result of matrix multiplication on *o1* and *o2*, or `NULL` on
failure.  The operation is done *in-place* when *o1* supports it.  This is
the equivalent of the Python statement `o1 @= o2`.

#### Versionadded
Added in version 3.5.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceFloorDivide([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the mathematical floor of dividing *o1* by *o2*, or `NULL` on failure.
The operation is done *in-place* when *o1* supports it.  This is the equivalent
of the Python statement `o1 //= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceTrueDivide([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Return a reasonable approximation for the mathematical value of *o1* divided by
*o2*, or `NULL` on failure.  The return value is “approximate” because binary
floating-point numbers are approximate; it is not possible to represent all real
numbers in base two.  This function can return a floating-point value when
passed two integers.  The operation is done *in-place* when *o1* supports it.
This is the equivalent of the Python statement `o1 /= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceRemainder([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the remainder of dividing *o1* by *o2*, or `NULL` on failure.  The
operation is done *in-place* when *o1* supports it.  This is the equivalent of
the Python statement `o1 %= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlacePower([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2, [PyObject](structures.md#c.PyObject) \*o3)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-3"></a>

See the built-in function [`pow()`](../library/functions.md#pow). Returns `NULL` on failure.  The operation
is done *in-place* when *o1* supports it.  This is the equivalent of the Python
statement `o1 **= o2` when o3 is [`Py_None`](none.md#c.Py_None), or an in-place variant of
`pow(o1, o2, o3)` otherwise. If *o3* is to be ignored, pass [`Py_None`](none.md#c.Py_None)
in its place (passing `NULL` for *o3* would cause an illegal memory access).

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceLshift([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of left shifting *o1* by *o2* on success, or `NULL` on
failure.  The operation is done *in-place* when *o1* supports it.  This is the
equivalent of the Python statement `o1 <<= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceRshift([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the result of right shifting *o1* by *o2* on success, or `NULL` on
failure.  The operation is done *in-place* when *o1* supports it.  This is the
equivalent of the Python statement `o1 >>= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceAnd([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the “bitwise and” of *o1* and *o2* on success and `NULL` on failure. The
operation is done *in-place* when *o1* supports it.  This is the equivalent of
the Python statement `o1 &= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceXor([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the “bitwise exclusive or” of *o1* by *o2* on success, or `NULL` on
failure.  The operation is done *in-place* when *o1* supports it.  This is the
equivalent of the Python statement `o1 ^= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_InPlaceOr([PyObject](structures.md#c.PyObject) \*o1, [PyObject](structures.md#c.PyObject) \*o2)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the “bitwise or” of *o1* and *o2* on success, or `NULL` on failure.  The
operation is done *in-place* when *o1* supports it.  This is the equivalent of
the Python statement `o1 |= o2`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Long([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-4"></a>

Returns the *o* converted to an integer object on success, or `NULL` on
failure.  This is the equivalent of the Python expression `int(o)`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Float([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

<a id="index-5"></a>

Returns the *o* converted to a float object on success, or `NULL` on failure.
This is the equivalent of the Python expression `float(o)`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_Index([PyObject](structures.md#c.PyObject) \*o)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the *o* converted to a Python int on success or `NULL` with a
[`TypeError`](../library/exceptions.md#TypeError) exception raised on failure.

#### Versionchanged
Changed in version 3.10: The result always has exact type [`int`](../library/functions.md#int).  Previously, the result
could have been an instance of a subclass of `int`.

### [PyObject](structures.md#c.PyObject) \*PyNumber_ToBase([PyObject](structures.md#c.PyObject) \*n, int base)

*Return value: New reference.* *Part of the [Stable ABI](stable.md#stable).*

Returns the integer *n* converted to base *base* as a string.  The *base*
argument must be one of 2, 8, 10, or 16.  For base 2, 8, or 16, the
returned string is prefixed with a base marker of `'0b'`, `'0o'`, or
`'0x'`, respectively.  If *n* is not a Python int, it is converted with
[`PyNumber_Index()`](#c.PyNumber_Index) first.

### [Py_ssize_t](intro.md#c.Py_ssize_t) PyNumber_AsSsize_t([PyObject](structures.md#c.PyObject) \*o, [PyObject](structures.md#c.PyObject) \*exc)

 *Part of the [Stable ABI](stable.md#stable).*

Returns *o* converted to a [`Py_ssize_t`](intro.md#c.Py_ssize_t) value if *o* can be interpreted as an
integer.  If the call fails, an exception is raised and `-1` is returned.

If *o* can be converted to a Python int but the attempt to
convert to a [`Py_ssize_t`](intro.md#c.Py_ssize_t) value would raise an [`OverflowError`](../library/exceptions.md#OverflowError), then the
*exc* argument is the type of exception that will be raised (usually
[`IndexError`](../library/exceptions.md#IndexError) or [`OverflowError`](../library/exceptions.md#OverflowError)).  If *exc* is `NULL`, then the
exception is cleared and the value is clipped to `PY_SSIZE_T_MIN` for a negative
integer or `PY_SSIZE_T_MAX` for a positive integer.

### int PyIndex_Check([PyObject](structures.md#c.PyObject) \*o)

 *Part of the [Stable ABI](stable.md#stable) since version 3.8.*

Returns `1` if *o* is an index integer (has the `nb_index` slot of the
`tp_as_number` structure filled in), and `0` otherwise.
This function always succeeds.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
