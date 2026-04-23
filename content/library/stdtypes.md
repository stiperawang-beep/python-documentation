<!-- XXX: reference/datamodel and this have quite a few overlaps! -->

<a id="bltin-types"></a>

# Built-in Types

The following sections describe the standard types that are built into the
interpreter.

<a id="index-0"></a>

The principal built-in types are numerics, sequences, mappings, classes,
instances and exceptions.

Some collection classes are mutable.  The methods that add, subtract, or
rearrange their members in place, and don’t return a specific item, never return
the collection instance itself but `None`.

Some operations are supported by several object types; in particular,
practically all objects can be compared for equality, tested for truth
value, and converted to a string (with the [`repr()`](functions.md#repr) function or the
slightly different [`str()`](#str) function).  The latter function is implicitly
used when an object is written by the [`print()`](functions.md#print) function.

<a id="truth"></a>

## Truth Value Testing

<a id="index-1"></a>

Any object can be tested for truth value, for use in an [`if`](../reference/compound_stmts.md#if) or
[`while`](../reference/compound_stmts.md#while) condition or as operand of the Boolean operations below.

<a id="index-2"></a>

By default, an object is considered true unless its class defines either a
[`__bool__()`](../reference/datamodel.md#object.__bool__) method that returns `False` or a
[`__len__()`](../reference/datamodel.md#object.__len__) method that
returns zero, when called with the object. <sup>[1](#id12)</sup> If one of the methods raises an
exception when called, the exception is propagated and the object does
not have a truth value (for example, [`NotImplemented`](constants.md#NotImplemented)).
Here are most of the built-in objects considered false:

<a id="index-3"></a>
* constants defined to be false: `None` and `False`
* zero of any numeric type: `0`, `0.0`, `0j`, `Decimal(0)`,
  `Fraction(0, 1)`
* empty sequences and collections: `''`, `()`, `[]`, `{}`, `set()`,
  `range(0)`

<a id="index-4"></a>

Operations and built-in functions that have a Boolean result always return `0`
or `False` for false and `1` or `True` for true, unless otherwise stated.
(Important exception: the Boolean operations `or` and `and` always return
one of their operands.)

<a id="boolean"></a>

## Boolean Operations — `and`, `or`, `not`

<a id="index-5"></a>

These are the Boolean operations, ordered by ascending priority:

| Operation   | Result                                         | Notes   |
|-------------|------------------------------------------------|---------|
| `x or y`    | if *x* is true, then *x*, else<br/>*y*         | (1)     |
| `x and y`   | if *x* is false, then *x*, else<br/>*y*        | (2)     |
| `not x`     | if *x* is false, then `True`,<br/>else `False` | (3)     |

<a id="index-6"></a>

Notes:

1. This is a short-circuit operator, so it only evaluates the second
   argument if the first one is false.
2. This is a short-circuit operator, so it only evaluates the second
   argument if the first one is true.
3. `not` has a lower priority than non-Boolean operators, so `not a == b` is
   interpreted as `not (a == b)`, and `a == not b` is a syntax error.

<a id="stdcomparisons"></a>

## Comparisons

<a id="index-7"></a>

There are eight comparison operations in Python.  They all have the same
priority (which is higher than that of the Boolean operations).  Comparisons can
be chained arbitrarily; for example, `x < y <= z` is equivalent to `x < y and
y <= z`, except that *y* is evaluated only once (but in both cases *z* is not
evaluated at all when `x < y` is found to be false).

This table summarizes the comparison operations:

| Operation   | Meaning                 |
|-------------|-------------------------|
| `<`         | strictly less than      |
| `<=`        | less than or equal      |
| `>`         | strictly greater than   |
| `>=`        | greater than or equal   |
| `==`        | equal                   |
| `!=`        | not equal               |
| `is`        | object identity         |
| `is not`    | negated object identity |

<a id="index-8"></a>

Unless stated otherwise, objects of different types never compare equal.
The `==` operator is always defined but for some object types (for example,
class objects) is equivalent to [`is`](../reference/expressions.md#is). The `<`, `<=`, `>` and `>=`
operators are only defined where they make sense; for example, they raise a
[`TypeError`](exceptions.md#TypeError) exception when one of the arguments is a complex number.

<a id="index-9"></a>

Non-identical instances of a class normally compare as non-equal unless the
class defines the [`__eq__()`](../reference/datamodel.md#object.__eq__) method.

Instances of a class cannot be ordered with respect to other instances of the
same class, or other types of object, unless the class defines enough of the
methods [`__lt__()`](../reference/datamodel.md#object.__lt__), [`__le__()`](../reference/datamodel.md#object.__le__), [`__gt__()`](../reference/datamodel.md#object.__gt__), and
[`__ge__()`](../reference/datamodel.md#object.__ge__) (in general, [`__lt__()`](../reference/datamodel.md#object.__lt__) and
[`__eq__()`](../reference/datamodel.md#object.__eq__) are sufficient, if you want the conventional meanings of the
comparison operators).

The behavior of the [`is`](../reference/expressions.md#is) and [`is not`](../reference/expressions.md#is-not) operators cannot be
customized; also they can be applied to any two objects and never raise an
exception.

<a id="index-10"></a>

Two more operations with the same syntactic priority, [`in`](../reference/expressions.md#in) and
[`not in`](../reference/expressions.md#not-in), are supported by types that are [iterable](../glossary.md#term-iterable) or
implement the [`__contains__()`](../reference/datamodel.md#object.__contains__) method.

<a id="typesnumeric"></a>

## Numeric Types — [`int`](functions.md#int), [`float`](functions.md#float), [`complex`](functions.md#complex)

<a id="index-11"></a>

There are three distinct numeric types: *integers*, *floating-point
numbers*, and *complex numbers*.  In addition, Booleans are a
subtype of integers.  Integers have unlimited precision.  Floating-point
numbers are usually implemented using  in C; information
about the precision and internal representation of floating-point
numbers for the machine on which your program is running is available
in [`sys.float_info`](sys.md#sys.float_info).  Complex numbers have a real and imaginary
part, which are each a floating-point number.  To extract these parts
from a complex number *z*, use `z.real` and `z.imag`. (The standard
library includes the additional numeric types [`fractions.Fraction`](fractions.md#fractions.Fraction), for
rationals, and [`decimal.Decimal`](decimal.md#decimal.Decimal), for floating-point numbers with
user-definable precision.)

<a id="index-12"></a>

Numbers are created by numeric literals or as the result of built-in functions
and operators.  Unadorned integer literals (including hex, octal and binary
numbers) yield integers.  Numeric literals containing a decimal point or an
exponent sign yield floating-point numbers.  Appending `'j'` or `'J'` to a
numeric literal yields an imaginary number (a complex number with a zero real
part) which you can add to an integer or float to get a complex number with real
and imaginary parts.

The constructors [`int()`](functions.md#int), [`float()`](functions.md#float), and
[`complex()`](functions.md#complex) can be used to produce numbers of a specific type.

<a id="index-13"></a>

<a id="stdtypes-mixed-arithmetic"></a>

Python fully supports mixed arithmetic: when a binary arithmetic operator has
operands of different built-in numeric types, the operand with the “narrower”
type is widened to that of the other:

* If both arguments are complex numbers, no conversion is performed;
* if either argument is a complex or a floating-point number, the other is
  converted to a floating-point number;
* otherwise, both must be integers and no conversion is necessary.

Arithmetic with complex and real operands is defined by the usual mathematical
formula, for example:

```python3
x + complex(u, v) = complex(x + u, v)
x * complex(u, v) = complex(x * u, x * v)
```

A comparison between numbers of different types behaves as though the exact
values of those numbers were being compared. <sup>[2](#id13)</sup>

All numeric types (except complex) support the following operations (for priorities of
the operations, see [Operator precedence](../reference/expressions.md#operator-summary)):

| Operation         | Result                                                                                    | Notes   | Full documentation                  |
|-------------------|-------------------------------------------------------------------------------------------|---------|-------------------------------------|
| `x + y`           | sum of *x* and *y*                                                                        |         |                                     |
| `x - y`           | difference of *x* and *y*                                                                 |         |                                     |
| `x * y`           | product of *x* and *y*                                                                    |         |                                     |
| `x / y`           | quotient of *x* and *y*                                                                   |         |                                     |
| `x // y`          | floored quotient of *x* and<br/>*y*                                                       | (1)(2)  |                                     |
| `x % y`           | remainder of `x / y`                                                                      | (2)     |                                     |
| `-x`              | *x* negated                                                                               |         |                                     |
| `+x`              | *x* unchanged                                                                             |         |                                     |
| `abs(x)`          | absolute value or magnitude of<br/>*x*                                                    |         | [`abs()`](functions.md#abs)         |
| `int(x)`          | *x* converted to integer                                                                  | (3)(6)  | [`int()`](functions.md#int)         |
| `float(x)`        | *x* converted to floating point                                                           | (4)(6)  | [`float()`](functions.md#float)     |
| `complex(re, im)` | a complex number with real part<br/>*re*, imaginary part *im*.<br/>*im* defaults to zero. | (6)     | [`complex()`](functions.md#complex) |
| `c.conjugate()`   | conjugate of the complex number<br/>*c*                                                   |         |                                     |
| `divmod(x, y)`    | the pair `(x // y, x % y)`                                                                | (2)     | [`divmod()`](functions.md#divmod)   |
| `pow(x, y)`       | *x* to the power *y*                                                                      | (5)     | [`pow()`](functions.md#pow)         |
| `x ** y`          | *x* to the power *y*                                                                      | (5)     |                                     |

<a id="index-14"></a>

Notes:

1. Also referred to as integer division.  For operands of type [`int`](functions.md#int),
   the result has type [`int`](functions.md#int).  For operands of type [`float`](functions.md#float),
   the result has type [`float`](functions.md#float).  In general, the result is a whole
   integer, though the result’s type is not necessarily [`int`](functions.md#int).  The result is
   always rounded towards minus infinity: `1//2` is `0`, `(-1)//2` is
   `-1`, `1//(-2)` is `-1`, and `(-1)//(-2)` is `0`.
2. Not for complex numbers.  Instead convert to floats using [`abs()`](functions.md#abs) if
   appropriate.
3. <a id="index-15"></a>

   Conversion from [`float`](functions.md#float) to [`int`](functions.md#int) truncates, discarding the
   fractional part. See functions [`math.floor()`](math.md#math.floor) and [`math.ceil()`](math.md#math.ceil) for
   alternative conversions.
4. float also accepts the strings “nan” and “inf” with an optional prefix “+”
   or “-” for Not a Number (NaN) and positive or negative infinity.
5. Python defines `pow(0, 0)` and `0 ** 0` to be `1`, as is common for
   programming languages.
6. The numeric literals accepted include the digits `0` to `9` or any
   Unicode equivalent (code points with the `Nd` property).

   See [the Unicode Standard](https://unicode.org/Public/UNIDATA/extracted/DerivedNumericType.txt)
   for a complete list of code points with the `Nd` property.

All [`numbers.Real`](numbers.md#numbers.Real) types ([`int`](functions.md#int) and [`float`](functions.md#float)) also include
the following operations:

| Operation                                 | Result                                                                                         |
|-------------------------------------------|------------------------------------------------------------------------------------------------|
| [`math.trunc(x)`](math.md#math.trunc)     | *x* truncated to [`Integral`](numbers.md#numbers.Integral)                                     |
| [`round(x[,<br/>n])`](functions.md#round) | *x* rounded to *n* digits,<br/>rounding half to even. If *n* is<br/>omitted, it defaults to 0. |
| [`math.floor(x)`](math.md#math.floor)     | the greatest [`Integral`](numbers.md#numbers.Integral)<br/><= *x*                              |
| [`math.ceil(x)`](math.md#math.ceil)       | the least [`Integral`](numbers.md#numbers.Integral) >= *x*                                     |

For additional numeric operations see the [`math`](math.md#module-math) and [`cmath`](cmath.md#module-cmath)
modules.

<!-- XXXJH exceptions: overflow (when? what operations?) zerodivision -->

<a id="bitstring-ops"></a>

### Bitwise Operations on Integer Types

<a id="index-16"></a>

Bitwise operations only make sense for integers. The result of bitwise
operations is calculated as though carried out in two’s complement with an
infinite number of sign bits.

The priorities of the binary bitwise operations are all lower than the numeric
operations and higher than the comparisons; the unary operation `~` has the
same priority as the other unary numeric operations (`+` and `-`).

This table lists the bitwise operations sorted in ascending priority:

| Operation   | Result                                    | Notes   |
|-------------|-------------------------------------------|---------|
| `x | y`     | bitwise *or* of *x* and<br/>*y*           | (4)     |
| `x ^ y`     | bitwise *exclusive or* of<br/>*x* and *y* | (4)     |
| `x & y`     | bitwise *and* of *x* and<br/>*y*          | (4)     |
| `x << n`    | *x* shifted left by *n* bits              | (1)(2)  |
| `x >> n`    | *x* shifted right by *n* bits             | (1)(3)  |
| `~x`        | the bits of *x* inverted                  |         |

Notes:

1. Negative shift counts are illegal and cause a [`ValueError`](exceptions.md#ValueError) to be raised.
2. A left shift by *n* bits is equivalent to multiplication by `pow(2, n)`.
3. A right shift by *n* bits is equivalent to floor division by `pow(2, n)`.
4. Performing these calculations with at least one extra sign extension bit in
   a finite two’s complement representation (a working bit-width of
   `1 + max(x.bit_length(), y.bit_length())` or more) is sufficient to get the
   same result as if there were an infinite number of sign bits.

### Additional Methods on Integer Types

The int type implements the [`numbers.Integral`](numbers.md#numbers.Integral) [abstract base
class](../glossary.md#term-abstract-base-class). In addition, it provides a few more methods:

#### int.bit_length()

Return the number of bits necessary to represent an integer in binary,
excluding the sign and leading zeros:

```python3
>>> n = -37
>>> bin(n)
'-0b100101'
>>> n.bit_length()
6
```

More precisely, if `x` is nonzero, then `x.bit_length()` is the
unique positive integer `k` such that `2**(k-1) <= abs(x) < 2**k`.
Equivalently, when `abs(x)` is small enough to have a correctly
rounded logarithm, then `k = 1 + int(log(abs(x), 2))`.
If `x` is zero, then `x.bit_length()` returns `0`.

Equivalent to:

```python3
def bit_length(self):
    s = bin(self)       # binary representation:  bin(-37) --> '-0b100101'
    s = s.lstrip('-0b') # remove leading zeros and minus sign
    return len(s)       # len('100101') --> 6
```

#### Versionadded
Added in version 3.1.

#### int.bit_count()

Return the number of ones in the binary representation of the absolute
value of the integer. This is also known as the population count.
Example:

```python3
>>> n = 19
>>> bin(n)
'0b10011'
>>> n.bit_count()
3
>>> (-n).bit_count()
3
```

Equivalent to:

```python3
def bit_count(self):
    return bin(self).count("1")
```

#### Versionadded
Added in version 3.10.

#### int.to_bytes(length=1, byteorder='big', , signed=False)

Return an array of bytes representing an integer.

```pycon
>>> (1024).to_bytes(2, byteorder='big')
b'\x04\x00'
>>> (1024).to_bytes(10, byteorder='big')
b'\x00\x00\x00\x00\x00\x00\x00\x00\x04\x00'
>>> (-1024).to_bytes(10, byteorder='big', signed=True)
b'\xff\xff\xff\xff\xff\xff\xff\xff\xfc\x00'
>>> x = 1000
>>> x.to_bytes((x.bit_length() + 7) // 8, byteorder='little')
b'\xe8\x03'
```

The integer is represented using *length* bytes, and defaults to 1.  An
[`OverflowError`](exceptions.md#OverflowError) is raised if the integer is not representable with
the given number of bytes.

The *byteorder* argument determines the byte order used to represent the
integer, and defaults to `"big"`.  If *byteorder* is
`"big"`, the most significant byte is at the beginning of the byte
array.  If *byteorder* is `"little"`, the most significant byte is at
the end of the byte array.

The *signed* argument determines whether two’s complement is used to
represent the integer.  If *signed* is `False` and a negative integer is
given, an [`OverflowError`](exceptions.md#OverflowError) is raised. The default value for *signed*
is `False`.

The default values can be used to conveniently turn an integer into a
single byte object:

```python3
>>> (65).to_bytes()
b'A'
```

However, when using the default arguments, don’t try
to convert a value greater than 255 or you’ll get an [`OverflowError`](exceptions.md#OverflowError).

Equivalent to:

```python3
def to_bytes(n, length=1, byteorder='big', signed=False):
    if byteorder == 'little':
        order = range(length)
    elif byteorder == 'big':
        order = reversed(range(length))
    else:
        raise ValueError("byteorder must be either 'little' or 'big'")

    return bytes((n >> i*8) & 0xff for i in order)
```

#### Versionadded
Added in version 3.2.

#### Versionchanged
Changed in version 3.11: Added default argument values for `length` and `byteorder`.

#### *classmethod* int.from_bytes(bytes, byteorder='big', , signed=False)

Return the integer represented by the given array of bytes.

```pycon
>>> int.from_bytes(b'\x00\x10', byteorder='big')
16
>>> int.from_bytes(b'\x00\x10', byteorder='little')
4096
>>> int.from_bytes(b'\xfc\x00', byteorder='big', signed=True)
-1024
>>> int.from_bytes(b'\xfc\x00', byteorder='big', signed=False)
64512
>>> int.from_bytes([255, 0, 0], byteorder='big')
16711680
```

The argument *bytes* must either be a [bytes-like object](../glossary.md#term-bytes-like-object) or an
iterable producing bytes.

The *byteorder* argument determines the byte order used to represent the
integer, and defaults to `"big"`.  If *byteorder* is
`"big"`, the most significant byte is at the beginning of the byte
array.  If *byteorder* is `"little"`, the most significant byte is at
the end of the byte array.  To request the native byte order of the host
system, use [`sys.byteorder`](sys.md#sys.byteorder) as the byte order value.

The *signed* argument indicates whether two’s complement is used to
represent the integer.

Equivalent to:

```python3
def from_bytes(bytes, byteorder='big', signed=False):
    if byteorder == 'little':
        little_ordered = list(bytes)
    elif byteorder == 'big':
        little_ordered = list(reversed(bytes))
    else:
        raise ValueError("byteorder must be either 'little' or 'big'")

    n = sum(b << i*8 for i, b in enumerate(little_ordered))
    if signed and little_ordered and (little_ordered[-1] & 0x80):
        n -= 1 << 8*len(little_ordered)

    return n
```

#### Versionadded
Added in version 3.2.

#### Versionchanged
Changed in version 3.11: Added default argument value for `byteorder`.

#### int.as_integer_ratio()

Return a pair of integers whose ratio is equal to the original
integer and has a positive denominator.  The integer ratio of integers
(whole numbers) is always the integer as the numerator and `1` as the
denominator.

#### Versionadded
Added in version 3.8.

#### int.is_integer()

Returns `True`. Exists for duck type compatibility with [`float.is_integer()`](#float.is_integer).

#### Versionadded
Added in version 3.12.

### Additional Methods on Float

The float type implements the [`numbers.Real`](numbers.md#numbers.Real) [abstract base
class](../glossary.md#term-abstract-base-class). float also has the following additional methods.

#### *classmethod* float.from_number(x)

Class method to return a floating-point number constructed from a number *x*.

If the argument is an integer or a floating-point number, a
floating-point number with the same value (within Python’s floating-point
precision) is returned.  If the argument is outside the range of a Python
float, an [`OverflowError`](exceptions.md#OverflowError) will be raised.

For a general Python object `x`, `float.from_number(x)` delegates to
`x.__float__()`.
If [`__float__()`](../reference/datamodel.md#object.__float__) is not defined then it falls back
to [`__index__()`](../reference/datamodel.md#object.__index__).

#### Versionadded
Added in version 3.14.

#### float.as_integer_ratio()

Return a pair of integers whose ratio is exactly equal to the
original float. The ratio is in lowest terms and has a positive denominator.  Raises
[`OverflowError`](exceptions.md#OverflowError) on infinities and a [`ValueError`](exceptions.md#ValueError) on
NaNs.

#### float.is_integer()

Return `True` if the float instance is finite with integral
value, and `False` otherwise:

```python3
>>> (-2.0).is_integer()
True
>>> (3.2).is_integer()
False
```

Two methods support conversion to
and from hexadecimal strings.  Since Python’s floats are stored
internally as binary numbers, converting a float to or from a
*decimal* string usually involves a small rounding error.  In
contrast, hexadecimal strings allow exact representation and
specification of floating-point numbers.  This can be useful when
debugging, and in numerical work.

#### float.hex()

Return a representation of a floating-point number as a hexadecimal
string.  For finite floating-point numbers, this representation
will always include a leading `0x` and a trailing `p` and
exponent.

#### *classmethod* float.fromhex(s)

Class method to return the float represented by a hexadecimal
string *s*.  The string *s* may have leading and trailing
whitespace.

Note that [`float.hex()`](#float.hex) is an instance method, while
[`float.fromhex()`](#float.fromhex) is a class method.

A hexadecimal string takes the form:

```python3
[sign] ['0x'] integer ['.' fraction] ['p' exponent]
```

where the optional `sign` may by either `+` or `-`, `integer`
and `fraction` are strings of hexadecimal digits, and `exponent`
is a decimal integer with an optional leading sign.  Case is not
significant, and there must be at least one hexadecimal digit in
either the integer or the fraction.  This syntax is similar to the
syntax specified in section 6.4.4.2 of the C99 standard, and also to
the syntax used in Java 1.5 onwards.  In particular, the output of
[`float.hex()`](#float.hex) is usable as a hexadecimal floating-point literal in
C or Java code, and hexadecimal strings produced by C’s `%a` format
character or Java’s `Double.toHexString` are accepted by
[`float.fromhex()`](#float.fromhex).

Note that the exponent is written in decimal rather than hexadecimal,
and that it gives the power of 2 by which to multiply the coefficient.
For example, the hexadecimal string `0x3.a7p10` represents the
floating-point number `(3 + 10./16 + 7./16**2) * 2.0**10`, or
`3740.0`:

```python3
>>> float.fromhex('0x3.a7p10')
3740.0
```

Applying the reverse conversion to `3740.0` gives a different
hexadecimal string representing the same number:

```python3
>>> float.hex(3740.0)
'0x1.d380000000000p+11'
```

### Additional Methods on Complex

The `complex` type implements the [`numbers.Complex`](numbers.md#numbers.Complex)
[abstract base class](../glossary.md#term-abstract-base-class).
`complex` also has the following additional methods.

#### *classmethod* complex.from_number(x)

Class method to convert a number to a complex number.

For a general Python object `x`, `complex.from_number(x)` delegates to
`x.__complex__()`.  If [`__complex__()`](../reference/datamodel.md#object.__complex__) is not defined then it falls back
to [`__float__()`](../reference/datamodel.md#object.__float__).  If `__float__()` is not defined then it falls back
to [`__index__()`](../reference/datamodel.md#object.__index__).

#### Versionadded
Added in version 3.14.

<a id="numeric-hash"></a>

### Hashing of numeric types

For numbers `x` and `y`, possibly of different types, it’s a requirement
that `hash(x) == hash(y)` whenever `x == y` (see the [`__hash__()`](../reference/datamodel.md#object.__hash__)
method documentation for more details).  For ease of implementation and
efficiency across a variety of numeric types (including [`int`](functions.md#int),
[`float`](functions.md#float), [`decimal.Decimal`](decimal.md#decimal.Decimal) and [`fractions.Fraction`](fractions.md#fractions.Fraction))
Python’s hash for numeric types is based on a single mathematical function
that’s defined for any rational number, and hence applies to all instances of
[`int`](functions.md#int) and [`fractions.Fraction`](fractions.md#fractions.Fraction), and all finite instances of
[`float`](functions.md#float) and [`decimal.Decimal`](decimal.md#decimal.Decimal).  Essentially, this function is
given by reduction modulo `P` for a fixed prime `P`.  The value of `P` is
made available to Python as the [`modulus`](sys.md#sys.hash_info.modulus) attribute of
[`sys.hash_info`](sys.md#sys.hash_info).

**CPython implementation detail:** Currently, the prime used is `P = 2**31 - 1` on machines with 32-bit C
longs and `P = 2**61 - 1` on machines with 64-bit C longs.

Here are the rules in detail:

- If `x = m / n` is a nonnegative rational number and `n` is not divisible
  by `P`, define `hash(x)` as `m * invmod(n, P) % P`, where `invmod(n,
  P)` gives the inverse of `n` modulo `P`.
- If `x = m / n` is a nonnegative rational number and `n` is
  divisible by `P` (but `m` is not) then `n` has no inverse
  modulo `P` and the rule above doesn’t apply; in this case define
  `hash(x)` to be the constant value `sys.hash_info.inf`.
- If `x = m / n` is a negative rational number define `hash(x)`
  as `-hash(-x)`.  If the resulting hash is `-1`, replace it with
  `-2`.
- The particular values `sys.hash_info.inf` and `-sys.hash_info.inf`
  are used as hash values for positive
  infinity or negative infinity (respectively).
- For a [`complex`](functions.md#complex) number `z`, the hash values of the real
  and imaginary parts are combined by computing `hash(z.real) +
  sys.hash_info.imag * hash(z.imag)`, reduced modulo
  `2**sys.hash_info.width` so that it lies in
  `range(-2**(sys.hash_info.width - 1), 2**(sys.hash_info.width -
  1))`.  Again, if the result is `-1`, it’s replaced with `-2`.

To clarify the above rules, here’s some example Python code,
equivalent to the built-in hash, for computing the hash of a rational
number, [`float`](functions.md#float), or [`complex`](functions.md#complex):

```python3
import sys, math

def hash_fraction(m, n):
    """Compute the hash of a rational number m / n.

    Assumes m and n are integers, with n positive.
    Equivalent to hash(fractions.Fraction(m, n)).

    """
    P = sys.hash_info.modulus
    # Remove common factors of P.  (Unnecessary if m and n already coprime.)
    while m % P == n % P == 0:
        m, n = m // P, n // P

    if n % P == 0:
        hash_value = sys.hash_info.inf
    else:
        # Fermat's Little Theorem: pow(n, P-1, P) is 1, so
        # pow(n, P-2, P) gives the inverse of n modulo P.
        hash_value = (abs(m) % P) * pow(n, P - 2, P) % P
    if m < 0:
        hash_value = -hash_value
    if hash_value == -1:
        hash_value = -2
    return hash_value

def hash_float(x):
    """Compute the hash of a float x."""

    if math.isnan(x):
        return object.__hash__(x)
    elif math.isinf(x):
        return sys.hash_info.inf if x > 0 else -sys.hash_info.inf
    else:
        return hash_fraction(*x.as_integer_ratio())

def hash_complex(z):
    """Compute the hash of a complex number z."""

    hash_value = hash_float(z.real) + sys.hash_info.imag * hash_float(z.imag)
    # do a signed reduction modulo 2**sys.hash_info.width
    M = 2**(sys.hash_info.width - 1)
    hash_value = (hash_value & (M - 1)) - (hash_value & M)
    if hash_value == -1:
        hash_value = -2
    return hash_value
```

<a id="bltin-boolean-values"></a>

<a id="typebool"></a>

## Boolean Type - [`bool`](functions.md#bool)

Booleans represent truth values. The [`bool`](functions.md#bool) type has exactly two
constant instances: `True` and `False`.

<a id="index-17"></a>

The built-in function [`bool()`](functions.md#bool)  converts any value to a boolean, if the
value can be interpreted as a truth value (see section [Truth Value Testing](#truth) above).

For logical operations, use the [boolean operators](#boolean) `and`,
`or` and `not`.
When applying the bitwise operators `&`, `|`, `^` to two booleans, they
return a bool equivalent to the logical operations “and”, “or”, “xor”. However,
the logical operators `and`, `or` and `!=` should be preferred
over `&`, `|` and `^`.

#### Deprecated
Deprecated since version 3.12: The use of the bitwise inversion operator `~` is deprecated and will
raise an error in Python 3.16.

[`bool`](functions.md#bool) is a subclass of [`int`](functions.md#int) (see [Numeric Types — int, float, complex](#typesnumeric)). In
many numeric contexts, `False` and `True` behave like the integers 0 and 1, respectively.
However, relying on this is discouraged; explicitly convert using [`int()`](functions.md#int)
instead.

<a id="typeiter"></a>

## Iterator Types

<a id="index-18"></a>

Python supports a concept of iteration over containers.  This is implemented
using two distinct methods; these are used to allow user-defined classes to
support iteration.  Sequences, described below in more detail, always support
the iteration methods.

One method needs to be defined for container objects to provide [iterable](../glossary.md#term-iterable)
support:

<!-- XXX duplicated in reference/datamodel! -->

#### container.\_\_iter_\_()

Return an [iterator](../glossary.md#term-iterator) object.  The object is required to support the
iterator protocol described below.  If a container supports different types
of iteration, additional methods can be provided to specifically request
iterators for those iteration types.  (An example of an object supporting
multiple forms of iteration would be a tree structure which supports both
breadth-first and depth-first traversal.)  This method corresponds to the
[`tp_iter`](../c-api/typeobj.md#c.PyTypeObject.tp_iter) slot of the type structure for Python
objects in the Python/C API.

The iterator objects themselves are required to support the following two
methods, which together form the *iterator protocol*:

#### iterator.\_\_iter_\_()

Return the [iterator](../glossary.md#term-iterator) object itself.  This is required to allow both
containers and iterators to be used with the [`for`](../reference/compound_stmts.md#for) and
[`in`](../reference/expressions.md#in) statements.  This method corresponds to the
[`tp_iter`](../c-api/typeobj.md#c.PyTypeObject.tp_iter) slot of the type structure for Python
objects in the Python/C API.

#### iterator.\_\_next_\_()

Return the next item from the [iterator](../glossary.md#term-iterator).  If there are no further
items, raise the [`StopIteration`](exceptions.md#StopIteration) exception.  This method corresponds to
the [`tp_iternext`](../c-api/typeobj.md#c.PyTypeObject.tp_iternext) slot of the type structure for
Python objects in the Python/C API.

Python defines several iterator objects to support iteration over general and
specific sequence types, dictionaries, and other more specialized forms.  The
specific types are not important beyond their implementation of the iterator
protocol.

Once an iterator’s [`__next__()`](#iterator.__next__) method raises
[`StopIteration`](exceptions.md#StopIteration), it must continue to do so on subsequent calls.
Implementations that do not obey this property are deemed broken.

<a id="generator-types"></a>

### Generator Types

Python’s [generator](../glossary.md#term-generator)s provide a convenient way to implement the iterator
protocol.  If a container object’s [`__iter__()`](../reference/datamodel.md#object.__iter__) method is implemented as a
generator, it will automatically return an iterator object (technically, a
generator object) supplying the [`__iter__()`](#iterator.__iter__) and [`__next__()`](../reference/expressions.md#generator.__next__)
methods.
More information about generators can be found in [the documentation for
the yield expression](../reference/expressions.md#yieldexpr).

<a id="typesseq"></a>

## Sequence Types — [`list`](#list), [`tuple`](#tuple), [`range`](#range)

There are three basic sequence types: lists, tuples, and range objects.
Additional sequence types tailored for processing of
[binary data](#binaryseq) and [text strings](#textseq) are
described in dedicated sections.

<a id="typesseq-common"></a>

### Common Sequence Operations

<a id="index-19"></a>

The operations in the following table are supported by most sequence types,
both mutable and immutable. The [`collections.abc.Sequence`](collections.abc.md#collections.abc.Sequence) ABC is
provided to make it easier to correctly implement these operations on
custom sequence types.

This table lists the sequence operations sorted in ascending priority.  In the
table, *s* and *t* are sequences of the same type, *n*, *i*, *j* and *k* are
integers and *x* is an arbitrary object that meets any type and value
restrictions imposed by *s*.

The `in` and `not in` operations have the same priorities as the
comparison operations. The `+` (concatenation) and `*` (repetition)
operations have the same priority as the corresponding numeric operations. <sup>[3](#id14)</sup>

<a id="index-20"></a>

| Operation              | Result                                                     | Notes   |
|------------------------|------------------------------------------------------------|---------|
| `x in s`               | `True` if an item of *s* is<br/>equal to *x*, else `False` | (1)     |
| `x not in s`           | `False` if an item of *s* is<br/>equal to *x*, else `True` | (1)     |
| `s + t`                | the concatenation of *s* and<br/>*t*                       | (6)(7)  |
| `s * n` or<br/>`n * s` | equivalent to adding *s* to<br/>itself *n* times           | (2)(7)  |
| `s[i]`                 | *i*th item of *s*, origin 0                                | (3)(8)  |
| `s[i:j]`               | slice of *s* from *i* to *j*                               | (3)(4)  |
| `s[i:j:k]`             | slice of *s* from *i* to *j*<br/>with step *k*             | (3)(5)  |
| `len(s)`               | length of *s*                                              |         |
| `min(s)`               | smallest item of *s*                                       |         |
| `max(s)`               | largest item of *s*                                        |         |

Sequences of the same type also support comparisons.  In particular, tuples
and lists are compared lexicographically by comparing corresponding elements.
This means that to compare equal, every element must compare equal and the
two sequences must be of the same type and have the same length.  (For full
details see [Comparisons](../reference/expressions.md#comparisons) in the language reference.)

<a id="index-21"></a>

Forward and reversed iterators over mutable sequences access values using an
index.  That index will continue to march forward (or backward) even if the
underlying sequence is mutated.  The iterator terminates only when an
[`IndexError`](exceptions.md#IndexError) or a [`StopIteration`](exceptions.md#StopIteration) is encountered (or when the index
drops below zero).

Notes:

1. While the `in` and `not in` operations are used only for simple
   containment testing in the general case, some specialised sequences
   (such as [`str`](#str), [`bytes`](#bytes) and [`bytearray`](#bytearray)) also use
   them for subsequence testing:
   ```python3
   >>> "gg" in "eggs"
   True
   ```
2. Values of *n* less than `0` are treated as `0` (which yields an empty
   sequence of the same type as *s*).  Note that items in the sequence *s*
   are not copied; they are referenced multiple times.  This often haunts
   new Python programmers; consider:
   ```python3
   >>> lists = [[]] * 3
   >>> lists
   [[], [], []]
   >>> lists[0].append(3)
   >>> lists
   [[3], [3], [3]]
   ```

   What has happened is that `[[]]` is a one-element list containing an empty
   list, so all three elements of `[[]] * 3` are references to this single empty
   list.  Modifying any of the elements of `lists` modifies this single list.
   You can create a list of different lists this way:
   ```python3
   >>> lists = [[] for i in range(3)]
   >>> lists[0].append(3)
   >>> lists[1].append(5)
   >>> lists[2].append(7)
   >>> lists
   [[3], [5], [7]]
   ```

   Further explanation is available in the FAQ entry
   [How do I create a multidimensional list?](../faq/programming.md#faq-multidimensional-list).
3. If *i* or *j* is negative, the index is relative to the end of sequence *s*:
   `len(s) + i` or `len(s) + j` is substituted.  But note that `-0` is
   still `0`.
4. The slice of *s* from *i* to *j* is defined as the sequence of items with
   index *k* such that `i <= k < j`.
   * If *i* is omitted or `None`, use `0`.
   * If *j* is omitted or `None`, use `len(s)`.
   * If *i* or *j* is less than `-len(s)`, use `0`.
   * If *i* or *j* is greater than `len(s)`, use `len(s)`.
   * If *i* is greater than or equal to *j*, the slice is empty.
5. The slice of *s* from *i* to *j* with step *k* is defined as the sequence of
   items with index  `x = i + n*k` such that `0 <= n < (j-i)/k`.  In other words,
   the indices are `i`, `i+k`, `i+2*k`, `i+3*k` and so on, stopping when
   *j* is reached (but never including *j*).  When *k* is positive,
   *i* and *j* are reduced to `len(s)` if they are greater.
   When *k* is negative, *i* and *j* are reduced to `len(s) - 1` if
   they are greater.  If *i* or *j* are omitted or `None`, they become
   “end” values (which end depends on the sign of *k*).  Note, *k* cannot be zero.
   If *k* is `None`, it is treated like `1`.
6. Concatenating immutable sequences always results in a new object.  This
   means that building up a sequence by repeated concatenation will have a
   quadratic runtime cost in the total sequence length.  To get a linear
   runtime cost, you must switch to one of the alternatives below:
   * if concatenating [`str`](#str) objects, you can build a list and use
     [`str.join()`](#str.join) at the end or else write to an [`io.StringIO`](io.md#io.StringIO)
     instance and retrieve its value when complete
   * if concatenating [`bytes`](#bytes) objects, you can similarly use
     [`bytes.join()`](#bytes.join) or [`io.BytesIO`](io.md#io.BytesIO), or you can do in-place
     concatenation with a [`bytearray`](#bytearray) object.  [`bytearray`](#bytearray)
     objects are mutable and have an efficient overallocation mechanism
   * if concatenating [`tuple`](#tuple) objects, extend a [`list`](#list) instead
   * for other types, investigate the relevant class documentation
7. Some sequence types (such as [`range`](#range)) only support item sequences
   that follow specific patterns, and hence don’t support sequence
   concatenation or repetition.
8. An [`IndexError`](exceptions.md#IndexError) is raised if *i* is outside the sequence range.

### Sequence Methods

Sequence types also support the following methods:

<a id="list.count"></a>

#### sequence.count(value,)

Return the total number of occurrences of *value* in *sequence*.

<a id="list.index"></a>

#### sequence.index(value)

Return the index of the first occurrence of *value* in *sequence*.

Raises [`ValueError`](exceptions.md#ValueError) if *value* is not found in *sequence*.

The *start* or *stop* arguments allow for efficient searching
of subsections of the sequence, beginning at *start* and ending at *stop*.
This is roughly equivalent to `start + sequence[start:stop].index(value)`,
only without copying any data.

<a id="typesseq-immutable"></a>

### Immutable Sequence Types

<a id="index-22"></a>

The only operation that immutable sequence types generally implement that is
not also implemented by mutable sequence types is support for the [`hash()`](functions.md#hash)
built-in.

This support allows immutable sequences, such as [`tuple`](#tuple) instances, to
be used as [`dict`](#dict) keys and stored in [`set`](#set) and [`frozenset`](#frozenset)
instances.

Attempting to hash an immutable sequence that contains unhashable values will
result in [`TypeError`](exceptions.md#TypeError).

<a id="typesseq-mutable"></a>

### Mutable Sequence Types

<a id="index-23"></a>

The operations in the following table are defined on mutable sequence types.
The [`collections.abc.MutableSequence`](collections.abc.md#collections.abc.MutableSequence) ABC is provided to make it
easier to correctly implement these operations on custom sequence types.

In the table *s* is an instance of a mutable sequence type, *t* is any
iterable object and *x* is an arbitrary object that meets any type
and value restrictions imposed by *s* (for example, [`bytearray`](#bytearray) only
accepts integers that meet the value restriction `0 <= x <= 255`).

<a id="index-24"></a>

| Operation      | Result                                                                                                  | Notes   |
|----------------|---------------------------------------------------------------------------------------------------------|---------|
| `s[i] = x`     | item *i* of *s* is replaced by<br/>*x*                                                                  |         |
| `del s[i]`     | removes item *i* of *s*                                                                                 |         |
| `s[i:j] = t`   | slice of *s* from *i* to *j*<br/>is replaced by the contents of<br/>the iterable *t*                    |         |
| `del s[i:j]`   | removes the elements of<br/>`s[i:j]` from the list<br/>(same as `s[i:j] = []`)                          |         |
| `s[i:j:k] = t` | the elements of `s[i:j:k]`<br/>are replaced by those of *t*                                             | (1)     |
| `del s[i:j:k]` | removes the elements of<br/>`s[i:j:k]` from the list                                                    |         |
| `s += t`       | extends *s* with the<br/>contents of *t* (for the<br/>most part the same as<br/>`s[len(s):len(s)] = t`) |         |
| `s *= n`       | updates *s* with its contents<br/>repeated *n* times                                                    | (2)     |

Notes:

1. If *k* is not equal to `1`, *t* must have the same length as the slice it is replacing.
2. The value *n* is an integer, or an object implementing
   [`__index__()`](../reference/datamodel.md#object.__index__).  Zero and negative values of *n* clear
   the sequence.  Items in the sequence are not copied; they are referenced
   multiple times, as explained for `s * n` under [Common Sequence Operations](#typesseq-common).

### Mutable Sequence Methods

Mutable sequence types also support the following methods:

<a id="bytearray.append"></a>

#### sequence.append(value,)

Append *value* to the end of the sequence.
This is equivalent to writing `seq[len(seq):len(seq)] = [value]`.

<a id="bytearray.clear"></a>

#### sequence.clear()

#### Versionadded
Added in version 3.3.

Remove all items from *sequence*.
This is equivalent to writing `del sequence[:]`.

<a id="bytearray.copy"></a>

#### sequence.copy()

#### Versionadded
Added in version 3.3.

Create a shallow copy of *sequence*.
This is equivalent to writing `sequence[:]`.

#### HINT
The `copy()` method is not part of the
[`MutableSequence`](collections.abc.md#collections.abc.MutableSequence) [`ABC`](abc.md#abc.ABC),
but most concrete mutable sequence types provide it.

<a id="bytearray.extend"></a>

#### sequence.extend(iterable,)

Extend *sequence* with the contents of *iterable*.
For the most part, this is the same as writing
`seq[len(seq):len(seq)] = iterable`.

<a id="bytearray.insert"></a>

#### sequence.insert(index, value,)

Insert *value* into *sequence* at the given *index*.
This is equivalent to writing `sequence[index:index] = [value]`.

<a id="bytearray.pop"></a>

#### sequence.pop(index=-1,)

Retrieve the item at *index* and also removes it from *sequence*.
By default, the last item in *sequence* is removed and returned.

<a id="bytearray.remove"></a>

#### sequence.remove(value,)

Remove the first item from *sequence* where `sequence[i] == value`.

Raises [`ValueError`](exceptions.md#ValueError) if *value* is not found in *sequence*.

<a id="bytearray.reverse"></a>

#### sequence.reverse()

Reverse the items of *sequence* in place.
This method maintains economy of space when reversing a large sequence.
To remind users that it operates by side-effect, it returns `None`.

<a id="typesseq-list"></a>

### Lists

<a id="index-25"></a>

Lists are mutable sequences, typically used to store collections of
homogeneous items (where the precise degree of similarity will vary by
application).

### *class* list(iterable=(),)

Lists may be constructed in several ways:

* Using a pair of square brackets to denote the empty list: `[]`
* Using square brackets, separating items with commas: `[a]`, `[a, b, c]`
* Using a list comprehension: `[x for x in iterable]`
* Using the type constructor: `list()` or `list(iterable)`

The constructor builds a list whose items are the same and in the same
order as *iterable*’s items.  *iterable* may be either a sequence, a
container that supports iteration, or an iterator object.  If *iterable*
is already a list, a copy is made and returned, similar to `iterable[:]`.
For example, `list('abc')` returns `['a', 'b', 'c']` and
`list( (1, 2, 3) )` returns `[1, 2, 3]`.
If no argument is given, the constructor creates a new empty list, `[]`.

Many other operations also produce lists, including the [`sorted()`](functions.md#sorted)
built-in.

Lists implement all of the [common](#typesseq-common) and
[mutable](#typesseq-mutable) sequence operations. Lists also provide the
following additional method:

#### sort(, key=None, reverse=False)

This method sorts the list in place, using only `<` comparisons
between items. Exceptions are not suppressed - if any comparison operations
fail, the entire sort operation will fail (and the list will likely be left
in a partially modified state).

[`sort()`](#list.sort) accepts two arguments that can only be passed by keyword
([keyword-only arguments](../glossary.md#keyword-only-parameter)):

*key* specifies a function of one argument that is used to extract a
comparison key from each list element (for example, `key=str.lower`).
The key corresponding to each item in the list is calculated once and
then used for the entire sorting process. The default value of `None`
means that list items are sorted directly without calculating a separate
key value.

The [`functools.cmp_to_key()`](functools.md#functools.cmp_to_key) utility is available to convert a 2.x
style *cmp* function to a *key* function.

*reverse* is a boolean value.  If set to `True`, then the list elements
are sorted as if each comparison were reversed.

This method modifies the sequence in place for economy of space when
sorting a large sequence.  To remind users that it operates by side
effect, it does not return the sorted sequence (use [`sorted()`](functions.md#sorted) to
explicitly request a new sorted list instance).

The [`sort()`](#list.sort) method is guaranteed to be stable.  A sort is stable if it
guarantees not to change the relative order of elements that compare equal
— this is helpful for sorting in multiple passes (for example, sort by
department, then by salary grade).

For sorting examples and a brief sorting tutorial, see [Sorting Techniques](../howto/sorting.md#sortinghowto).

**CPython implementation detail:** While a list is being sorted, the effect of attempting to mutate, or even
inspect, the list is undefined.  The C implementation of Python makes the
list appear empty for the duration, and raises [`ValueError`](exceptions.md#ValueError) if it can
detect that the list has been mutated during a sort.

#### SEE ALSO
For detailed information on thread-safety guarantees for [`list`](#list)
objects, see [Thread safety for list objects](threadsafety.md#thread-safety-list).

<a id="typesseq-tuple"></a>

### Tuples

<a id="index-26"></a>

Tuples are immutable sequences, typically used to store collections of
heterogeneous data (such as the 2-tuples produced by the [`enumerate()`](functions.md#enumerate)
built-in). Tuples are also used for cases where an immutable sequence of
homogeneous data is needed (such as allowing storage in a [`set`](#set) or
[`dict`](#dict) instance).

### *class* tuple(iterable=(),)

Tuples may be constructed in a number of ways:

* Using a pair of parentheses to denote the empty tuple: `()`
* Using a trailing comma for a singleton tuple: `a,` or `(a,)`
* Separating items with commas: `a, b, c` or `(a, b, c)`
* Using the [`tuple()`](#tuple) built-in: `tuple()` or `tuple(iterable)`

The constructor builds a tuple whose items are the same and in the same
order as *iterable*’s items.  *iterable* may be either a sequence, a
container that supports iteration, or an iterator object.  If *iterable*
is already a tuple, it is returned unchanged. For example,
`tuple('abc')` returns `('a', 'b', 'c')` and
`tuple( [1, 2, 3] )` returns `(1, 2, 3)`.
If no argument is given, the constructor creates a new empty tuple, `()`.

Note that it is actually the comma which makes a tuple, not the parentheses.
The parentheses are optional, except in the empty tuple case, or
when they are needed to avoid syntactic ambiguity. For example,
`f(a, b, c)` is a function call with three arguments, while
`f((a, b, c))` is a function call with a 3-tuple as the sole argument.

Tuples implement all of the [common](#typesseq-common) sequence
operations.

For heterogeneous collections of data where access by name is clearer than
access by index, [`collections.namedtuple()`](collections.md#collections.namedtuple) may be a more appropriate
choice than a simple tuple object.

<a id="typesseq-range"></a>

### Ranges

<a id="index-27"></a>

The [`range`](#range) type represents an immutable sequence of numbers and is
commonly used for looping a specific number of times in [`for`](../reference/compound_stmts.md#for)
loops.

### *class* range(stop,)

### *class* range(start, stop, step=1,)

The arguments to the range constructor must be integers (either built-in
[`int`](functions.md#int) or any object that implements the [`__index__()`](../reference/datamodel.md#object.__index__) special
method).  If the *step* argument is omitted, it defaults to `1`.
If the *start* argument is omitted, it defaults to `0`.
If *step* is zero, [`ValueError`](exceptions.md#ValueError) is raised.

For a positive *step*, the contents of a range `r` are determined by the
formula `r[i] = start + step*i` where `i >= 0` and
`r[i] < stop`.

For a negative *step*, the contents of the range are still determined by
the formula `r[i] = start + step*i`, but the constraints are `i >= 0`
and `r[i] > stop`.

A range object will be empty if `r[0]` does not meet the value
constraint. Ranges do support negative indices, but these are interpreted
as indexing from the end of the sequence determined by the positive
indices.

Ranges containing absolute values larger than [`sys.maxsize`](sys.md#sys.maxsize) are
permitted but some features (such as [`len()`](functions.md#len)) may raise
[`OverflowError`](exceptions.md#OverflowError).

Range examples:

```python3
>>> list(range(10))
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
>>> list(range(1, 11))
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
>>> list(range(0, 30, 5))
[0, 5, 10, 15, 20, 25]
>>> list(range(0, 10, 3))
[0, 3, 6, 9]
>>> list(range(0, -10, -1))
[0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
>>> list(range(0))
[]
>>> list(range(1, 0))
[]
```

Ranges implement all of the [common](#typesseq-common) sequence operations
except concatenation and repetition (due to the fact that range objects can
only represent sequences that follow a strict pattern and repetition and
concatenation will usually violate that pattern).

#### start

The value of the *start* parameter (or `0` if the parameter was
not supplied)

#### stop

The value of the *stop* parameter

#### step

The value of the *step* parameter (or `1` if the parameter was
not supplied)

The advantage of the [`range`](#range) type over a regular [`list`](#list) or
[`tuple`](#tuple) is that a [`range`](#range) object will always take the same
(small) amount of memory, no matter the size of the range it represents (as it
only stores the `start`, `stop` and `step` values, calculating individual
items and subranges as needed).

Range objects implement the [`collections.abc.Sequence`](collections.abc.md#collections.abc.Sequence) ABC, and provide
features such as containment tests, element index lookup, slicing and
support for negative indices (see [Sequence Types — list, tuple, range](#typesseq)):

```pycon
>>> r = range(0, 20, 2)
>>> r
range(0, 20, 2)
>>> 11 in r
False
>>> 10 in r
True
>>> r.index(10)
5
>>> r[5]
10
>>> r[:5]
range(0, 10, 2)
>>> r[-1]
18
```

Testing range objects for equality with `==` and `!=` compares
them as sequences.  That is, two range objects are considered equal if
they represent the same sequence of values.  (Note that two range
objects that compare equal might have different [`start`](#range.start),
[`stop`](#range.stop) and [`step`](#range.step) attributes, for example
`range(0) == range(2, 1, 3)` or `range(0, 3, 2) == range(0, 4, 2)`.)

#### Versionchanged
Changed in version 3.2: Implement the Sequence ABC.
Support slicing and negative indices.
Test [`int`](functions.md#int) objects for membership in constant time instead of
iterating through all items.

#### Versionchanged
Changed in version 3.3: Define ‘==’ and ‘!=’ to compare range objects based on the
sequence of values they define (instead of comparing based on
object identity).

Added the [`start`](#range.start), [`stop`](#range.stop) and [`step`](#range.step)
attributes.

#### SEE ALSO
* The [linspace recipe](https://code.activestate.com/recipes/579000-equally-spaced-numbers-linspace/)
  shows how to implement a lazy version of range suitable for floating-point
  applications.

<a id="index-28"></a>

<a id="text-methods-summary"></a>

## Text and Binary Sequence Type Methods Summary

The following table summarizes the text and binary sequence types methods by
category.

| Category                                                 | [`str`](#str) methods                              | [`bytes`](#bytes) and [`bytearray`](#bytearray) methods   |
|----------------------------------------------------------|----------------------------------------------------|-----------------------------------------------------------|
| Formatting                                               | [`str.format()`](#str.format)                      |                                                           |
| [`str.format_map()`](#str.format_map)                    |                                                    |                                                           |
| [f-strings](../reference/lexical_analysis.md#f-strings)  |                                                    |                                                           |
| [printf-style String Formatting](#old-string-formatting) | [printf-style Bytes Formatting](#bytes-formatting) |                                                           |
| Searching and Replacing                                  | [`str.find()`](#str.find)                          | [`str.rfind()`](#str.rfind)                               |
| [`str.index()`](#str.index)                              | [`str.rindex()`](#str.rindex)                      | [`bytes.index()`](#bytes.index)                           |
| [`str.startswith()`](#str.startswith)                    | [`bytes.startswith()`](#bytes.startswith)          |                                                           |
| [`str.endswith()`](#str.endswith)                        | [`bytes.endswith()`](#bytes.endswith)              |                                                           |
| [`str.count()`](#str.count)                              | [`bytes.count()`](#bytes.count)                    |                                                           |
| [`str.replace()`](#str.replace)                          | [`bytes.replace()`](#bytes.replace)                |                                                           |
| Splitting and Joining                                    | [`str.split()`](#str.split)                        | [`str.rsplit()`](#str.rsplit)                             |
| [`str.splitlines()`](#str.splitlines)                    | [`bytes.splitlines()`](#bytes.splitlines)          |                                                           |
| [`str.partition()`](#str.partition)                      | [`bytes.partition()`](#bytes.partition)            |                                                           |
| [`str.rpartition()`](#str.rpartition)                    | [`bytes.rpartition()`](#bytes.rpartition)          |                                                           |
| [`str.join()`](#str.join)                                | [`bytes.join()`](#bytes.join)                      |                                                           |
| String Classification                                    | [`str.isalpha()`](#str.isalpha)                    | [`bytes.isalpha()`](#bytes.isalpha)                       |
| [`str.isdecimal()`](#str.isdecimal)                      |                                                    |                                                           |
| [`str.isdigit()`](#str.isdigit)                          | [`bytes.isdigit()`](#bytes.isdigit)                |                                                           |
| [`str.isnumeric()`](#str.isnumeric)                      |                                                    |                                                           |
| [`str.isalnum()`](#str.isalnum)                          | [`bytes.isalnum()`](#bytes.isalnum)                |                                                           |
| [`str.isidentifier()`](#str.isidentifier)                |                                                    |                                                           |
| [`str.islower()`](#str.islower)                          | [`bytes.islower()`](#bytes.islower)                |                                                           |
| [`str.isupper()`](#str.isupper)                          | [`bytes.isupper()`](#bytes.isupper)                |                                                           |
| [`str.istitle()`](#str.istitle)                          | [`bytes.istitle()`](#bytes.istitle)                |                                                           |
| [`str.isspace()`](#str.isspace)                          | [`bytes.isspace()`](#bytes.isspace)                |                                                           |
| [`str.isprintable()`](#str.isprintable)                  |                                                    |                                                           |
| Case Manipulation                                        | [`str.lower()`](#str.lower)                        | [`bytes.lower()`](#bytes.lower)                           |
| [`str.upper()`](#str.upper)                              | [`bytes.upper()`](#bytes.upper)                    |                                                           |
| [`str.casefold()`](#str.casefold)                        |                                                    |                                                           |
| [`str.capitalize()`](#str.capitalize)                    | [`bytes.capitalize()`](#bytes.capitalize)          |                                                           |
| [`str.title()`](#str.title)                              | [`bytes.title()`](#bytes.title)                    |                                                           |
| [`str.swapcase()`](#str.swapcase)                        | [`bytes.swapcase()`](#bytes.swapcase)              |                                                           |
| Padding and Stripping                                    | [`str.ljust()`](#str.ljust)                        | [`str.rjust()`](#str.rjust)                               |
| [`str.center()`](#str.center)                            | [`bytes.center()`](#bytes.center)                  |                                                           |
| [`str.expandtabs()`](#str.expandtabs)                    | [`bytes.expandtabs()`](#bytes.expandtabs)          |                                                           |
| [`str.strip()`](#str.strip)                              | [`bytes.strip()`](#bytes.strip)                    |                                                           |
| [`str.lstrip()`](#str.lstrip)                            | [`str.rstrip()`](#str.rstrip)                      | [`bytes.lstrip()`](#bytes.lstrip)                         |
| Translation and Encoding                                 | [`str.translate()`](#str.translate)                | [`bytes.translate()`](#bytes.translate)                   |
| [`str.maketrans()`](#str.maketrans)                      | [`bytes.maketrans()`](#bytes.maketrans)            |                                                           |
| [`str.encode()`](#str.encode)                            |                                                    |                                                           |
|                                                          | [`bytes.decode()`](#bytes.decode)                  |                                                           |

<a id="textseq"></a>

## Text Sequence Type — [`str`](#str)

Textual data in Python is handled with [`str`](#str) objects, or *strings*.
Strings are immutable
[sequences](#typesseq) of Unicode code points.  String literals are
written in a variety of ways:

* Single quotes: `'allows embedded "double" quotes'`
* Double quotes: `"allows embedded 'single' quotes"`
* Triple quoted: `'''Three single quotes'''`, `"""Three double quotes"""`

Triple quoted strings may span multiple lines - all associated whitespace will
be included in the string literal.

String literals that are part of a single expression and have only whitespace
between them will be implicitly converted to a single string literal. That
is, `("spam " "eggs") == "spam eggs"`.

See [String and Bytes literals](../reference/lexical_analysis.md#strings) for more about the various forms of string literal,
including supported [escape sequences](../reference/lexical_analysis.md#escape-sequences), and the `r` (“raw”) prefix that
disables most escape sequence processing.

Strings may also be created from other objects using the [`str`](#str)
constructor.

Since there is no separate “character” type, indexing a string produces
strings of length 1. That is, for a non-empty string *s*, `s[0] == s[0:1]`.

<a id="index-29"></a>

There is also no mutable string type, but [`str.join()`](#str.join) or
[`io.StringIO`](io.md#io.StringIO) can be used to efficiently construct strings from
multiple fragments.

#### Versionchanged
Changed in version 3.3: For backwards compatibility with the Python 2 series, the `u` prefix is
once again permitted on string literals. It has no effect on the meaning
of string literals and cannot be combined with the `r` prefix.

<a id="index-30"></a>

### *class* str(, encoding='utf-8', errors='strict')

### *class* str(object)

### *class* str(object, encoding, errors='strict')

### *class* str(object, , errors)

Return a [string](#textseq) version of *object*.  If *object* is not
provided, returns the empty string.  Otherwise, the behavior of `str()`
depends on whether *encoding* or *errors* is given, as follows.

If neither *encoding* nor *errors* is given, `str(object)` returns
[`type(object).__str__(object)`](../reference/datamodel.md#object.__str__),
which is the “informal” or nicely
printable string representation of *object*.  For string objects, this is
the string itself.  If *object* does not have a [`__str__()`](../reference/datamodel.md#object.__str__)
method, then [`str()`](#str) falls back to returning
[`repr(object)`](functions.md#repr).

<a id="index-31"></a>

If at least one of *encoding* or *errors* is given, *object* should be a
[bytes-like object](../glossary.md#term-bytes-like-object) (e.g. [`bytes`](#bytes) or [`bytearray`](#bytearray)).  In
this case, if *object* is a [`bytes`](#bytes) (or [`bytearray`](#bytearray)) object,
then `str(bytes, encoding, errors)` is equivalent to
[`bytes.decode(encoding, errors)`](#bytes.decode).  Otherwise, the bytes
object underlying the buffer object is obtained before calling
[`bytes.decode()`](#bytes.decode).  See [Binary Sequence Types — bytes, bytearray, memoryview](#binaryseq) and
[Buffer Protocol](../c-api/buffer.md#bufferobjects) for information on buffer objects.

Passing a [`bytes`](#bytes) object to [`str()`](#str) without the *encoding*
or *errors* arguments falls under the first case of returning the informal
string representation (see also the [`-b`](../using/cmdline.md#cmdoption-b) command-line option to
Python).  For example:

```python3
>>> str(b'Zoot!')
"b'Zoot!'"
```

For more information on the `str` class and its methods, see
[Text Sequence Type — str](#textseq) and the [String Methods](#string-methods) section below.  To output
formatted strings, see the [f-strings](../reference/lexical_analysis.md#f-strings) and [Format string syntax](string.md#formatstrings)
sections.  In addition, see the [Text Processing Services](text.md#stringservices) section.

<a id="index-32"></a>

<a id="string-methods"></a>

### String Methods

<a id="index-33"></a>

Strings implement all of the [common](#typesseq-common) sequence
operations, along with the additional methods described below.

Strings also support two styles of string formatting, one providing a large
degree of flexibility and customization (see [`str.format()`](#str.format),
[Format string syntax](string.md#formatstrings) and [Custom string formatting](string.md#string-formatting)) and the other based on C
`printf` style formatting that handles a narrower range of types and is
slightly harder to use correctly, but is often faster for the cases it can
handle ([printf-style String Formatting](#old-string-formatting)).

The [Text Processing Services](text.md#textservices) section of the standard library covers a number of
other modules that provide various text related utilities (including regular
expression support in the [`re`](re.md#module-re) module).

#### str.capitalize()

Return a copy of the string with its first character capitalized and the
rest lowercased.

#### Versionchanged
Changed in version 3.8: The first character is now put into titlecase rather than uppercase.
This means that characters like digraphs will only have their first
letter capitalized, instead of the full character.

#### str.casefold()

Return a casefolded copy of the string. Casefolded strings may be used for
caseless matching.

Casefolding is similar to lowercasing but more aggressive because it is
intended to remove all case distinctions in a string. For example, the German
lowercase letter `'ß'` is equivalent to `"ss"`. Since it is already
lowercase, [`lower()`](#str.lower) would do nothing to `'ß'`; [`casefold()`](#str.casefold)
converts it to `"ss"`.
For example:

```pycon
>>> 'straße'.lower()
'straße'
>>> 'straße'.casefold()
'strasse'
```

The casefolding algorithm is [described in section 3.13.3 ‘Default Case
Folding’ of the Unicode Standard](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/#G53253).

#### Versionadded
Added in version 3.3.

#### str.center(width, fillchar=' ',)

Return centered in a string of length *width*. Padding is done using the
specified *fillchar* (default is an ASCII space). The original string is
returned if *width* is less than or equal to `len(s)`.  For example:

```python3
>>> 'Python'.center(10)
'  Python  '
>>> 'Python'.center(10, '-')
'--Python--'
>>> 'Python'.center(4)
'Python'
```

#### str.count(sub)

Return the number of non-overlapping occurrences of substring *sub* in the
range [*start*, *end*].  Optional arguments *start* and *end* are
interpreted as in slice notation.

If *sub* is empty, returns the number of empty strings between characters
which is the length of the string plus one. For example:

```python3
>>> 'spam, spam, spam'.count('spam')
3
>>> 'spam, spam, spam'.count('spam', 5)
2
>>> 'spam, spam, spam'.count('spam', 5, 10)
1
>>> 'spam, spam, spam'.count('eggs')
0
>>> 'spam, spam, spam'.count('')
17
```

#### str.encode(encoding='utf-8', errors='strict')

Return the string encoded to [`bytes`](#bytes).

*encoding* defaults to `'utf-8'`;
see [Standard Encodings](codecs.md#standard-encodings) for possible values.

*errors* controls how encoding errors are handled.
If `'strict'` (the default), a [`UnicodeError`](exceptions.md#UnicodeError) exception is raised.
Other possible values are `'ignore'`,
`'replace'`, `'xmlcharrefreplace'`, `'backslashreplace'` and any
other name registered via [`codecs.register_error()`](codecs.md#codecs.register_error).
See [Error Handlers](codecs.md#error-handlers) for details.

For performance reasons, the value of *errors* is not checked for validity
unless an encoding error actually occurs,
[Python Development Mode](devmode.md#devmode) is enabled
or a [debug build](../using/configure.md#debug-build) is used.
For example:

```python3
>>> encoded_str_to_bytes = 'Python'.encode()
>>> type(encoded_str_to_bytes)
<class 'bytes'>
>>> encoded_str_to_bytes
b'Python'
```

#### Versionchanged
Changed in version 3.1: Added support for keyword arguments.

#### Versionchanged
Changed in version 3.9: The value of the *errors* argument is now checked in [Python Development Mode](devmode.md#devmode) and
in [debug mode](../using/configure.md#debug-build).

#### str.endswith(suffix)

Return `True` if the string ends with the specified *suffix*, otherwise return
`False`.  *suffix* can also be a tuple of suffixes to look for.  With optional
*start*, test beginning at that position.  With optional *end*, stop comparing
at that position. Using *start* and *end* is equivalent to
`str[start:end].endswith(suffix)`. For example:

```python3
>>> 'Python'.endswith('on')
True
>>> 'a tuple of suffixes'.endswith(('at', 'in'))
False
>>> 'a tuple of suffixes'.endswith(('at', 'es'))
True
>>> 'Python is amazing'.endswith('is', 0, 9)
True
```

See also [`startswith()`](#str.startswith) and [`removesuffix()`](#str.removesuffix).

#### str.expandtabs(tabsize=8)

Return a copy of the string where all tab characters are replaced by one or
more spaces, depending on the current column and the given tab size.  Tab
positions occur every *tabsize* characters (default is 8, giving tab
positions at columns 0, 8, 16 and so on).  To expand the string, the current
column is set to zero and the string is examined character by character.  If
the character is a tab (`\t`), one or more space characters are inserted
in the result until the current column is equal to the next tab position.
(The tab character itself is not copied.)  If the character is a newline
(`\n`) or return (`\r`), it is copied and the current column is reset to
zero.  Any other character is copied unchanged and the current column is
incremented by one regardless of how the character is represented when
printed. For example:

```python3
>>> '01\t012\t0123\t01234'.expandtabs()
'01      012     0123    01234'
>>> '01\t012\t0123\t01234'.expandtabs(4)
'01  012 0123    01234'
>>> print('01\t012\n0123\t01234'.expandtabs(4))
01  012
0123    01234
```

#### str.find(sub)

Return the lowest index in the string where substring *sub* is found within
the slice `s[start:end]`.  Optional arguments *start* and *end* are
interpreted as in slice notation.  Return `-1` if *sub* is not found.
For example:

```python3
>>> 'spam, spam, spam'.find('sp')
0
>>> 'spam, spam, spam'.find('sp', 5)
6
```

See also [`rfind()`](#str.rfind) and [`index()`](#str.index).

#### NOTE
The [`find()`](#str.find) method should be used only if you need to know the
position of *sub*.  To check if *sub* is a substring or not, use the
[`in`](../reference/expressions.md#in) operator:

```python3
>>> 'Py' in 'Python'
True
```

#### str.format(\*args, \*\*kwargs)

Perform a string formatting operation.  The string on which this method is
called can contain literal text or replacement fields delimited by braces
`{}`.  Each replacement field contains either the numeric index of a
positional argument, or the name of a keyword argument.  Returns a copy of
the string where each replacement field is replaced with the string value of
the corresponding argument. For example:

```pycon
>>> "The sum of 1 + 2 is {0}".format(1+2)
'The sum of 1 + 2 is 3'
>>> "The sum of {a} + {b} is {answer}".format(answer=1+2, a=1, b=2)
'The sum of 1 + 2 is 3'
>>> "{1} expects the {0} Inquisition!".format("Spanish", "Nobody")
'Nobody expects the Spanish Inquisition!'
```

See [Format string syntax](string.md#formatstrings) for a description of the various formatting options
that can be specified in format strings.

#### NOTE
When formatting a number ([`int`](functions.md#int), [`float`](functions.md#float), [`complex`](functions.md#complex),
[`decimal.Decimal`](decimal.md#decimal.Decimal) and subclasses) with the `n` type
(ex: `'{:n}'.format(1234)`), the function temporarily sets the
`LC_CTYPE` locale to the `LC_NUMERIC` locale to decode
`decimal_point` and `thousands_sep` fields of `localeconv()` if
they are non-ASCII or longer than 1 byte, and the `LC_NUMERIC` locale is
different than the `LC_CTYPE` locale.  This temporary change affects
other threads.

#### Versionchanged
Changed in version 3.7: When formatting a number with the `n` type, the function sets
temporarily the `LC_CTYPE` locale to the `LC_NUMERIC` locale in some
cases.

#### str.format_map(mapping,)

Similar to `str.format(**mapping)`, except that `mapping` is
used directly and not copied to a [`dict`](#dict).  This is useful
if for example `mapping` is a dict subclass:

```pycon
>>> class Default(dict):
...     def __missing__(self, key):
...         return key
...
>>> '{name} was born in {country}'.format_map(Default(name='Guido'))
'Guido was born in country'
```

#### Versionadded
Added in version 3.2.

#### str.index(sub)

Like [`find()`](#str.find), but raise [`ValueError`](exceptions.md#ValueError) when the substring is
not found. For example:

```pycon
>>> 'spam, spam, spam'.index('spam')
0
>>> 'spam, spam, spam'.index('eggs')
Traceback (most recent call last):
  File "<python-input-0>", line 1, in <module>
    'spam, spam, spam'.index('eggs')
    ~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^
ValueError: substring not found
```

See also [`rindex()`](#str.rindex).

#### str.isalnum()

Return `True` if all characters in the string are alphanumeric and there is at
least one character, `False` otherwise.  A character `c` is alphanumeric if one
of the following returns `True`: `c.isalpha()`, `c.isdecimal()`,
`c.isdigit()`, or `c.isnumeric()`. For example:

```pycon
>>> 'abc123'.isalnum()
True
>>> 'abc123!@#'.isalnum()
False
>>> ''.isalnum()
False
>>> ' '.isalnum()
False
```

#### str.isalpha()

Return `True` if all characters in the string are alphabetic and there is at least
one character, `False` otherwise.  Alphabetic characters are those characters defined
in the Unicode character database as “Letter”, i.e., those with general category
property being one of “Lm”, “Lt”, “Lu”, “Ll”, or “Lo”.  Note that this is different
from the [Alphabetic property defined in the section 4.10 ‘Letters, Alphabetic, and
Ideographic’ of the Unicode Standard](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-4/#G91002).
For example:

```pycon
>>> 'Letters and spaces'.isalpha()
False
>>> 'LettersOnly'.isalpha()
True
>>> 'µ'.isalpha()  # non-ASCII characters can be considered alphabetical too
True
```

See [Unicode Properties](../howto/unicode.md#unicode-properties).

#### str.isascii()

Return `True` if the string is empty or all characters in the string are ASCII,
`False` otherwise.
ASCII characters have code points in the range U+0000-U+007F. For example:

```pycon
>>> 'ASCII characters'.isascii()
True
>>> 'µ'.isascii()
False
```

#### Versionadded
Added in version 3.7.

#### str.isdecimal()

Return `True` if all characters in the string are decimal
characters and there is at least one character, `False`
otherwise. Decimal characters are those that can be used to form
numbers in base 10, such as U+0660, ARABIC-INDIC DIGIT
ZERO.  Formally a decimal character is a character in the Unicode
General Category “Nd”. For example:

```pycon
>>> '0123456789'.isdecimal()
True
>>> '٠١٢٣٤٥٦٧٨٩'.isdecimal()  # Arabic-Indic digits zero to nine
True
>>> 'alphabetic'.isdecimal()
False
```

#### str.isdigit()

Return `True` if all characters in the string are digits and there is at least one
character, `False` otherwise.  Digits include decimal characters and digits that need
special handling, such as the compatibility superscript digits.
This covers digits which cannot be used to form numbers in base 10,
like the Kharosthi numbers.  Formally, a digit is a character that has the
property value Numeric_Type=Digit or Numeric_Type=Decimal.

#### str.isidentifier()

Return `True` if the string is a valid identifier according to the language
definition, section [Names (identifiers and keywords)](../reference/lexical_analysis.md#identifiers).

[`keyword.iskeyword()`](keyword.md#keyword.iskeyword) can be used to test whether string `s` is a reserved
identifier, such as [`def`](../reference/compound_stmts.md#def) and [`class`](../reference/compound_stmts.md#class).

Example:

```python3
>>> from keyword import iskeyword

>>> 'hello'.isidentifier(), iskeyword('hello')
(True, False)
>>> 'def'.isidentifier(), iskeyword('def')
(True, True)
```

#### str.islower()

Return `True` if all cased characters <sup>[4](#id15)</sup> in the string are lowercase and
there is at least one cased character, `False` otherwise.

#### str.isnumeric()

Return `True` if all characters in the string are numeric
characters, and there is at least one character, `False`
otherwise. Numeric characters include digit characters, and all characters
that have the Unicode numeric value property, e.g. U+2155,
VULGAR FRACTION ONE FIFTH.  Formally, numeric characters are those with the property
value Numeric_Type=Digit, Numeric_Type=Decimal or Numeric_Type=Numeric.
For example:

```pycon
>>> '0123456789'.isnumeric()
True
>>> '٠١٢٣٤٥٦٧٨٩'.isnumeric()  # Arabic-indic digit zero to nine
True
>>> '⅕'.isnumeric()  # Vulgar fraction one fifth
True
>>> '²'.isdecimal(), '²'.isdigit(),  '²'.isnumeric()
(False, True, True)
```

See also [`isdecimal()`](#str.isdecimal) and [`isdigit()`](#str.isdigit). Numeric characters are
a superset of decimal numbers.

#### str.isprintable()

Return `True` if all characters in the string are printable, `False` if it
contains at least one non-printable character.

Here “printable” means the character is suitable for [`repr()`](functions.md#repr) to use in
its output; “non-printable” means that [`repr()`](functions.md#repr) on built-in types will
hex-escape the character.  It has no bearing on the handling of strings
written to [`sys.stdout`](sys.md#sys.stdout) or [`sys.stderr`](sys.md#sys.stderr).

The printable characters are those which in the Unicode character database
(see [`unicodedata`](unicodedata.md#module-unicodedata)) have a general category in group Letter, Mark,
Number, Punctuation, or Symbol (L, M, N, P, or S); plus the ASCII space 0x20.
Nonprintable characters are those in group Separator or Other (Z or C),
except the ASCII space.

For example:

```pycon
>>> ''.isprintable(), ' '.isprintable()
(True, True)
>>> '\t'.isprintable(), '\n'.isprintable()
(False, False)
```

See also [`isspace()`](#str.isspace).

#### str.isspace()

Return `True` if there are only whitespace characters in the string and there is
at least one character, `False` otherwise.

For example:

```pycon
>>> ''.isspace()
False
>>> ' '.isspace()
True
>>> '\t\n'.isspace() # TAB and BREAK LINE
True
>>> '\u3000'.isspace() # IDEOGRAPHIC SPACE
True
```

A character is *whitespace* if in the Unicode character database
(see [`unicodedata`](unicodedata.md#module-unicodedata)), either its general category is `Zs`
(“Separator, space”), or its bidirectional class is one of `WS`,
`B`, or `S`.

See also [`isprintable()`](#str.isprintable).

#### str.istitle()

Return `True` if the string is a titlecased string and there is at least one
character, for example uppercase characters may only follow uncased characters
and lowercase characters only cased ones.  Return `False` otherwise.

For example:

```pycon
>>> 'Spam, Spam, Spam'.istitle()
True
>>> 'spam, spam, spam'.istitle()
False
>>> 'SPAM, SPAM, SPAM'.istitle()
False
```

See also [`title()`](#str.title).

#### str.isupper()

Return `True` if all cased characters <sup>[4](#id15)</sup> in the string are uppercase and
there is at least one cased character, `False` otherwise.

```pycon
>>> 'BANANA'.isupper()
True
>>> 'banana'.isupper()
False
>>> 'baNana'.isupper()
False
>>> ' '.isupper()
False
```

<a id="meth-str-join"></a>

#### str.join(iterable,)

Return a string which is the concatenation of the strings in *iterable*.
A [`TypeError`](exceptions.md#TypeError) will be raised if there are any non-string values in
*iterable*, including [`bytes`](#bytes) objects.  The separator between
elements is the string providing this method. For example:

```pycon
>>> ', '.join(['spam', 'spam', 'spam'])
'spam, spam, spam'
>>> '-'.join('Python')
'P-y-t-h-o-n'
```

See also [`split()`](#str.split).

#### str.ljust(width, fillchar=' ',)

Return the string left justified in a string of length *width*. Padding is
done using the specified *fillchar* (default is an ASCII space). The
original string is returned if *width* is less than or equal to `len(s)`.

For example:

```pycon
>>> 'Python'.ljust(10)
'Python    '
>>> 'Python'.ljust(10, '.')
'Python....'
>>> 'Monty Python'.ljust(10, '.')
'Monty Python'
```

See also [`rjust()`](#str.rjust).

#### str.lower()

Return a copy of the string with all the cased characters <sup>[4](#id15)</sup> converted to
lowercase. For example:

```pycon
>>> 'Lower Method Example'.lower()
'lower method example'
```

The lowercasing algorithm used is [described in section 3.13.2 ‘Default Case
Conversion’ of the Unicode Standard](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/#G34078).

#### str.lstrip(chars=None,)

Return a copy of the string with leading characters removed.  The *chars*
argument is a string specifying the set of characters to be removed.  If omitted
or `None`, the *chars* argument defaults to removing whitespace.  The *chars*
argument is not a prefix; rather, all combinations of its values are stripped:

```python3
>>> '   spacious   '.lstrip()
'spacious   '
>>> 'www.example.com'.lstrip('cmowz.')
'example.com'
```

See [`str.removeprefix()`](#str.removeprefix) for a method that will remove a single prefix
string rather than all of a set of characters.  For example:

```python3
>>> 'Arthur: three!'.lstrip('Arthur: ')
'ee!'
>>> 'Arthur: three!'.removeprefix('Arthur: ')
'three!'
```

#### *static* str.maketrans(dict,)

#### *static* str.maketrans(from, to, remove='', /)

This static method returns a translation table usable for [`str.translate()`](#str.translate).

If there is only one argument, it must be a dictionary mapping Unicode
ordinals (integers) or characters (strings of length 1) to Unicode ordinals,
strings (of arbitrary lengths) or `None`.  Character keys will then be
converted to ordinals.

If there are two arguments, they must be strings of equal length, and in the
resulting dictionary, each character in *from* will be mapped to the character at
the same position in *to*.  If there is a third argument, it must be a string,
whose characters will be mapped to `None` in the result.

#### Versionchanged
Changed in version 3.15: *dict* can now be a [`frozendict`](#frozendict).

#### str.partition(sep,)

Split the string at the first occurrence of *sep*, and return a 3-tuple
containing the part before the separator, the separator itself, and the part
after the separator.  If the separator is not found, return a 3-tuple containing
the string itself, followed by two empty strings.

For example:

```pycon
>>> 'Monty Python'.partition(' ')
('Monty', ' ', 'Python')
>>> "Monty Python's Flying Circus".partition(' ')
('Monty', ' ', "Python's Flying Circus")
>>> 'Monty Python'.partition('-')
('Monty Python', '', '')
```

See also [`rpartition()`](#str.rpartition).

#### str.removeprefix(prefix,)

If the string starts with the *prefix* string, return
`string[len(prefix):]`. Otherwise, return a copy of the original
string:

```pycon
>>> 'TestHook'.removeprefix('Test')
'Hook'
>>> 'BaseTestCase'.removeprefix('Test')
'BaseTestCase'
```

#### Versionadded
Added in version 3.9.

See also [`removesuffix()`](#str.removesuffix) and [`startswith()`](#str.startswith).

#### str.removesuffix(suffix,)

If the string ends with the *suffix* string and that *suffix* is not empty,
return `string[:-len(suffix)]`. Otherwise, return a copy of the
original string:

```pycon
>>> 'MiscTests'.removesuffix('Tests')
'Misc'
>>> 'TmpDirMixin'.removesuffix('Tests')
'TmpDirMixin'
```

#### Versionadded
Added in version 3.9.

See also [`removeprefix()`](#str.removeprefix) and [`endswith()`](#str.endswith).

#### str.replace(old, new, , count=-1)

Return a copy of the string with all occurrences of substring *old* replaced by
*new*.  If *count* is given, only the first *count* occurrences are replaced.
If *count* is not specified or `-1`, then all occurrences are replaced.
For example:

```pycon
>>> 'spam, spam, spam'.replace('spam', 'eggs')
'eggs, eggs, eggs'
>>> 'spam, spam, spam'.replace('spam', 'eggs', 1)
'eggs, spam, spam'
```

#### Versionchanged
Changed in version 3.13: *count* is now supported as a keyword argument.

#### str.rfind(sub)

Return the highest index in the string where substring *sub* is found, such
that *sub* is contained within `s[start:end]`.  Optional arguments *start*
and *end* are interpreted as in slice notation.  Return `-1` on failure.
For example:

```pycon
>>> 'spam, spam, spam'.rfind('sp')
12
>>> 'spam, spam, spam'.rfind('sp', 0, 10)
6
```

See also [`find()`](#str.find) and [`rindex()`](#str.rindex).

#### str.rindex(sub)

Like [`rfind()`](#str.rfind) but raises [`ValueError`](exceptions.md#ValueError) when the substring *sub* is not
found.
For example:

```pycon
>>> 'spam, spam, spam'.rindex('spam')
12
>>> 'spam, spam, spam'.rindex('eggs')
Traceback (most recent call last):
  File "<stdin-0>", line 1, in <module>
    'spam, spam, spam'.rindex('eggs')
    ~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^
ValueError: substring not found
```

See also [`index()`](#str.index) and [`find()`](#str.find).

#### str.rjust(width, fillchar=' ',)

Return the string right justified in a string of length *width*. Padding is
done using the specified *fillchar* (default is an ASCII space). The
original string is returned if *width* is less than or equal to `len(s)`.

For example:

```pycon
>>> 'Python'.rjust(10)
'    Python'
>>> 'Python'.rjust(10, '.')
'....Python'
>>> 'Monty Python'.rjust(10, '.')
'Monty Python'
```

See also [`ljust()`](#str.ljust) and [`zfill()`](#str.zfill).

#### str.rpartition(sep,)

Split the string at the last occurrence of *sep*, and return a 3-tuple
containing the part before the separator, the separator itself, and the part
after the separator.  If the separator is not found, return a 3-tuple containing
two empty strings, followed by the string itself.

For example:

```pycon
>>> 'Monty Python'.rpartition(' ')
('Monty', ' ', 'Python')
>>> "Monty Python's Flying Circus".rpartition(' ')
("Monty Python's Flying", ' ', 'Circus')
>>> 'Monty Python'.rpartition('-')
('', '', 'Monty Python')
```

See also [`partition()`](#str.partition).

#### str.rsplit(sep=None, maxsplit=-1)

Return a list of the words in the string, using *sep* as the delimiter string.
If *maxsplit* is given, at most *maxsplit* splits are done, the *rightmost*
ones.  If *sep* is not specified or `None`, any whitespace string is a
separator.  Except for splitting from the right, [`rsplit()`](#str.rsplit) behaves like
[`split()`](#str.split) which is described in detail below.

#### str.rstrip(chars=None,)

Return a copy of the string with trailing characters removed.  The *chars*
argument is a string specifying the set of characters to be removed.  If omitted
or `None`, the *chars* argument defaults to removing whitespace.  The *chars*
argument is not a suffix; rather, all combinations of its values are stripped.
For example:

```pycon
>>> '   spacious   '.rstrip()
'   spacious'
>>> 'mississippi'.rstrip('ipz')
'mississ'
```

See [`removesuffix()`](#str.removesuffix) for a method that will remove a single suffix
string rather than all of a set of characters.  For example:

```python3
>>> 'Monty Python'.rstrip(' Python')
'M'
>>> 'Monty Python'.removesuffix(' Python')
'Monty'
```

See also [`strip()`](#str.strip).

#### str.split(sep=None, maxsplit=-1)

Return a list of the words in the string, using *sep* as the delimiter
string.  If *maxsplit* is given, at most *maxsplit* splits are done (thus,
the list will have at most `maxsplit+1` elements).  If *maxsplit* is not
specified or `-1`, then there is no limit on the number of splits
(all possible splits are made).

If *sep* is given, consecutive delimiters are not grouped together and are
deemed to delimit empty strings (for example, `'1,,2'.split(',')` returns
`['1', '', '2']`).  The *sep* argument may consist of multiple characters
as a single delimiter (to split with multiple delimiters, use
[`re.split()`](re.md#re.split)). Splitting an empty string with a specified separator
returns `['']`.

For example:

```python3
>>> '1,2,3'.split(',')
['1', '2', '3']
>>> '1,2,3'.split(',', maxsplit=1)
['1', '2,3']
>>> '1,2,,3,'.split(',')
['1', '2', '', '3', '']
>>> '1<>2<>3<4'.split('<>')
['1', '2', '3<4']
```

If *sep* is not specified or is `None`, a different splitting algorithm is
applied: runs of consecutive whitespace are regarded as a single separator,
and the result will contain no empty strings at the start or end if the
string has leading or trailing whitespace.  Consequently, splitting an empty
string or a string consisting of just whitespace with a `None` separator
returns `[]`.

For example:

```python3
>>> '1 2 3'.split()
['1', '2', '3']
>>> '1 2 3'.split(maxsplit=1)
['1', '2 3']
>>> '   1   2   3   '.split()
['1', '2', '3']
```

If *sep* is not specified or is `None` and  *maxsplit* is `0`, only
leading runs of consecutive whitespace are considered.

For example:

```python3
>>> "".split(None, 0)
[]
>>> "   ".split(None, 0)
[]
>>> "   foo   ".split(maxsplit=0)
['foo   ']
```

See also [`join()`](#str.join).

<a id="index-34"></a>

#### str.splitlines(keepends=False)

Return a list of the lines in the string, breaking at line boundaries.  Line
breaks are not included in the resulting list unless *keepends* is given and
true.

This method splits on the following line boundaries.  In particular, the
boundaries are a superset of [universal newlines](../glossary.md#term-universal-newlines).

| Representation   | Description                 |
|------------------|-----------------------------|
| `\n`             | Line Feed                   |
| `\r`             | Carriage Return             |
| `\r\n`           | Carriage Return + Line Feed |
| `\v` or `\x0b`   | Line Tabulation             |
| `\f` or `\x0c`   | Form Feed                   |
| `\x1c`           | File Separator              |
| `\x1d`           | Group Separator             |
| `\x1e`           | Record Separator            |
| `\x85`           | Next Line (C1 Control Code) |
| `\u2028`         | Line Separator              |
| `\u2029`         | Paragraph Separator         |

#### Versionchanged
Changed in version 3.2: `\v` and `\f` added to list of line boundaries.

For example:

```python3
>>> 'ab c\n\nde fg\rkl\r\n'.splitlines()
['ab c', '', 'de fg', 'kl']
>>> 'ab c\n\nde fg\rkl\r\n'.splitlines(keepends=True)
['ab c\n', '\n', 'de fg\r', 'kl\r\n']
```

Unlike [`split()`](#str.split) when a delimiter string *sep* is given, this
method returns an empty list for the empty string, and a terminal line
break does not result in an extra line:

```python3
>>> "".splitlines()
[]
>>> "One line\n".splitlines()
['One line']
```

For comparison, `split('\n')` gives:

```python3
>>> ''.split('\n')
['']
>>> 'Two lines\n'.split('\n')
['Two lines', '']
```

#### str.startswith(prefix)

Return `True` if string starts with the *prefix*, otherwise return `False`.
*prefix* can also be a tuple of prefixes to look for.  With optional *start*,
test string beginning at that position.  With optional *end*, stop comparing
string at that position.

For example:

```pycon
>>> 'Python'.startswith('Py')
True
>>> 'a tuple of prefixes'.startswith(('at', 'a'))
True
>>> 'Python is amazing'.startswith('is', 7)
True
```

See also [`endswith()`](#str.endswith) and [`removeprefix()`](#str.removeprefix).

#### str.strip(chars=None,)

Return a copy of the string with the leading and trailing characters removed.
The *chars* argument is a string specifying the set of characters to be removed.
If omitted or `None`, the *chars* argument defaults to removing whitespace.
The *chars* argument is not a prefix or suffix; rather, all combinations of its
values are stripped.

For example:

```pycon
>>> '   spacious   '.strip()
'spacious'
>>> 'www.example.com'.strip('cmowz.')
'example'
```

The outermost leading and trailing *chars* argument values are stripped
from the string. Characters are removed from the leading end until
reaching a string character that is not contained in the set of
characters in *chars*. A similar action takes place on the trailing end.

For example:

```pycon
>>> comment_string = '#....... Section 3.2.1 Issue #32 .......'
>>> comment_string.strip('.#! ')
'Section 3.2.1 Issue #32'
```

See also [`rstrip()`](#str.rstrip).

#### str.swapcase()

Return a copy of the string with uppercase characters converted to lowercase and
vice versa. For example:

```pycon
>>> 'Hello World'.swapcase()
'hELLO wORLD'
```

Note that it is not necessarily true that `s.swapcase().swapcase() == s`.
For example:

```pycon
>>> 'straße'.swapcase().swapcase()
'strasse'
```

See also [`str.lower()`](#str.lower) and [`str.upper()`](#str.upper).

#### str.title()

Return a titlecased version of the string where words start with an uppercase
character and the remaining characters are lowercase.

For example:

```python3
>>> 'Hello world'.title()
'Hello World'
```

The algorithm uses a simple language-independent definition of a word as
groups of consecutive letters.  The definition works in many contexts but
it means that apostrophes in contractions and possessives form word
boundaries, which may not be the desired result:

```python3
>>> "they're bill's friends from the UK".title()
"They'Re Bill'S Friends From The Uk"
```

The [`string.capwords()`](string.md#string.capwords) function does not have this problem, as it
splits words on spaces only.

Alternatively, a workaround for apostrophes can be constructed using regular
expressions:

```python3
>>> import re
>>> def titlecase(s):
...     return re.sub(r"[A-Za-z]+('[A-Za-z]+)?",
...                   lambda mo: mo.group(0).capitalize(),
...                   s)
...
>>> titlecase("they're bill's friends.")
"They're Bill's Friends."
```

See also [`istitle()`](#str.istitle).

#### str.translate(table,)

Return a copy of the string in which each character has been mapped through
the given translation table.  The table must be an object that implements
indexing via [`__getitem__()`](../reference/datamodel.md#object.__getitem__), typically a [mapping](../glossary.md#term-mapping) or
[sequence](../glossary.md#term-sequence).  When indexed by a Unicode ordinal (an integer), the
table object can do any of the following: return a Unicode ordinal or a
string, to map the character to one or more other characters; return
`None`, to delete the character from the return string; or raise a
[`LookupError`](exceptions.md#LookupError) exception, to map the character to itself.

You can use [`str.maketrans()`](#str.maketrans) to create a translation map from
character-to-character mappings in different formats.

The following example uses a mapping to replace `'a'` with `'X'`,
`'b'` with `'Y'`, and delete `'c'`:

```pycon
>>> 'abc123'.translate({ord('a'): 'X', ord('b'): 'Y', ord('c'): None})
'XY123'
```

See also the [`codecs`](codecs.md#module-codecs) module for a more flexible approach to custom
character mappings.

#### str.upper()

Return a copy of the string with all the cased characters <sup>[4](#id15)</sup> converted to
uppercase.  Note that `s.upper().isupper()` might be `False` if `s`
contains uncased characters or if the Unicode category of the resulting
character(s) is not “Lu” (Letter, uppercase), but e.g. “Lt” (Letter,
titlecase).

The uppercasing algorithm used is [described in section 3.13.2 ‘Default Case
Conversion’ of the Unicode Standard](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/#G34078).

#### str.zfill(width,)

Return a copy of the string left filled with ASCII `'0'` digits to
make a string of length *width*. A leading sign prefix (`'+'`/`'-'`)
is handled by inserting the padding *after* the sign character rather
than before. The original string is returned if *width* is less than
or equal to `len(s)`.

For example:

```pycon
>>> "42".zfill(5)
'00042'
>>> "-42".zfill(5)
'-0042'
```

See also [`rjust()`](#str.rjust).

<a id="index-35"></a>

<a id="stdtypes-fstrings"></a>

### Formatted String Literals (f-strings)

#### Versionadded
Added in version 3.6.

#### Versionchanged
Changed in version 3.7: The [`await`](../reference/expressions.md#await) and [`async for`](../reference/compound_stmts.md#async-for) can be used in expressions
within f-strings.

#### Versionchanged
Changed in version 3.8: Added the debug specifier (`=`)

#### Versionchanged
Changed in version 3.12: Many restrictions on expressions within f-strings have been removed.
Notably, nested strings, comments, and backslashes are now permitted.

An *f-string* (formally a *formatted string literal*) is
a string literal that is prefixed with `f` or `F`.
This type of string literal allows embedding the results of arbitrary Python
expressions within *replacement fields*, which are delimited by curly
brackets (`{}`).
Each replacement field must contain an expression, optionally followed by:

* a *debug specifier* – an equal sign (`=`);
* a *conversion specifier* – `!s`, `!r` or `!a`; and/or
* a *format specifier* prefixed with a colon (`:`).

See the [Lexical Analysis section on f-strings](../reference/lexical_analysis.md#f-strings) for details
on the syntax of these fields.

#### Debug specifier

#### Versionadded
Added in version 3.8.

If a debug specifier – an equal sign (`=`) – appears after the replacement
field expression, the resulting f-string will contain the expression’s source,
the equal sign, and the value of the expression.
This is often useful for debugging:

```python3
>>> number = 14.3
>>> f'{number=}'
'number=14.3'
```

Whitespace before, inside and after the expression, as well as whitespace
after the equal sign, is significant — it is retained in the result:

```python3
>>> f'{ number  -  4  = }'
' number  -  4  = 10.3'
```

#### Conversion specifier

By default, the value of a replacement field expression is converted to
a string using [`str()`](#str):

```python3
>>> from fractions import Fraction
>>> one_third = Fraction(1, 3)
>>> f'{one_third}'
'1/3'
```

When a debug specifier but no format specifier is used, the default conversion
instead uses [`repr()`](functions.md#repr):

```python3
>>> f'{one_third = }'
'one_third = Fraction(1, 3)'
```

The conversion can be specified explicitly using one of these specifiers:

* `!s` for [`str()`](#str)
* `!r` for [`repr()`](functions.md#repr)
* `!a` for [`ascii()`](functions.md#ascii)

For example:

```python3
>>> str(one_third)
'1/3'
>>> repr(one_third)
'Fraction(1, 3)'

>>> f'{one_third!s} is {one_third!r}'
'1/3 is Fraction(1, 3)'

>>> string = "¡kočka 😸!"
>>> ascii(string)
"'\\xa1ko\\u010dka \\U0001f638!'"

>>> f'{string = !a}'
"string = '\\xa1ko\\u010dka \\U0001f638!'"
```

#### Format specifier

After the expression has been evaluated, and possibly converted using an
explicit conversion specifier, it is formatted using the [`format()`](functions.md#format) function.
If the replacement field includes a *format specifier* introduced by a colon
(`:`), the specifier is passed to `format()` as the second argument.
The result of `format()` is then used as the final value for the
replacement field. For example:

```python3
>>> from fractions import Fraction
>>> one_third = Fraction(1, 3)
>>> f'{one_third:.6f}'
'0.333333'
>>> f'{one_third:_^+10}'
'___+1/3___'
>>> >>> f'{one_third!r:_^20}'
'___Fraction(1, 3)___'
>>> f'{one_third = :~>10}~'
'one_third = ~~~~~~~1/3~'
```

<a id="stdtypes-tstrings"></a>

### Template String Literals (t-strings)

An *t-string* (formally a *template string literal*) is
a string literal that is prefixed with `t` or `T`.

These strings follow the same syntax and evaluation rules as
[formatted string literals](#stdtypes-fstrings),
with for the following differences:

* Rather than evaluating to a `str` object, template string literals evaluate
  to a [`string.templatelib.Template`](string.templatelib.md#string.templatelib.Template) object.
* The [`format()`](functions.md#format) protocol is not used.
  Instead, the format specifier and conversions (if any) are passed to
  a new [`Interpolation`](string.templatelib.md#string.templatelib.Interpolation) object that is created
  for each evaluated expression.
  It is up to code that processes the resulting [`Template`](string.templatelib.md#string.templatelib.Template)
  object to decide how to handle format specifiers and conversions.
* Format specifiers containing nested replacement fields are evaluated eagerly,
  prior to being passed to the [`Interpolation`](string.templatelib.md#string.templatelib.Interpolation) object.
  For instance, an interpolation of the form `{amount:.{precision}f}` will
  evaluate the inner expression `{precision}` to determine the value of the
  `format_spec` attribute.
  If `precision` were to be `2`, the resulting format specifier
  would be `'.2f'`.
* When the equals sign `'='` is provided in an interpolation expression,
  the text of the expression is appended to the literal string that precedes
  the relevant interpolation.
  This includes the equals sign and any surrounding whitespace.
  The `Interpolation` instance for the expression will be created as
  normal, except that [`conversion`](string.templatelib.md#string.templatelib.Interpolation.conversion) will
  be set to ‘`r`’ ([`repr()`](functions.md#repr)) by default.
  If an explicit conversion or format specifier are provided,
  this will override the default behaviour.

<a id="old-string-formatting"></a>

### `printf`-style String Formatting

<a id="index-36"></a>

#### NOTE
The formatting operations described here exhibit a variety of quirks that
lead to a number of common errors (such as failing to display tuples and
dictionaries correctly).

Using [formatted string literals](../reference/lexical_analysis.md#f-strings), the [`str.format()`](#str.format)
interface, or [`string.Template`](string.md#string.Template) may help avoid these errors.
Each of these alternatives provides their own trade-offs and benefits of
simplicity, flexibility, and/or extensibility.

String objects have one unique built-in operation: the `%` operator (modulo).
This is also known as the string *formatting* or *interpolation* operator.
Given `format % values` (where *format* is a string), `%` conversion
specifications in *format* are replaced with zero or more elements of *values*.
The effect is similar to using the `sprintf()` function in the C language.
For example:

```pycon
>>> print('%s has %d quote types.' % ('Python', 2))
Python has 2 quote types.
```

If *format* requires a single argument, *values* may be a single non-tuple
object. <sup>[5](#id16)</sup>  Otherwise, *values* must be a tuple with exactly the number of
items specified by the format string, or a single mapping object (for example, a
dictionary).

<a id="index-37"></a>

A conversion specifier contains two or more characters and has the following
components, which must occur in this order:

1. The `'%'` character, which marks the start of the specifier.
2. Mapping key (optional), consisting of a parenthesised sequence of characters
   (for example, `(somename)`).
3. Conversion flags (optional), which affect the result of some conversion
   types.
4. Minimum field width (optional).  If specified as an `'*'` (asterisk), the
   actual width is read from the next element of the tuple in *values*, and the
   object to convert comes after the minimum field width and optional precision.
5. Precision (optional), given as a `'.'` (dot) followed by the precision.  If
   specified as `'*'` (an asterisk), the actual precision is read from the next
   element of the tuple in *values*, and the value to convert comes after the
   precision.
6. Length modifier (optional).
7. Conversion type.

When the right argument is a dictionary (or other mapping type), then the
formats in the string *must* include a parenthesised mapping key into that
dictionary inserted immediately after the `'%'` character. The mapping key
selects the value to be formatted from the mapping.  For example:

```pycon
>>> print('%(language)s has %(number)03d quote types.' %
...       {'language': "Python", "number": 2})
Python has 002 quote types.
```

In this case no `*` specifiers may occur in a format (since they require a
sequential parameter list).

The conversion flag characters are:

<a id="index-38"></a>

| Flag   | Meaning                                                                                                          |
|--------|------------------------------------------------------------------------------------------------------------------|
| `'#'`  | The value conversion will use the “alternate form” (where defined<br/>below).                                    |
| `'0'`  | The conversion will be zero padded for numeric values.                                                           |
| `'-'`  | The converted value is left adjusted (overrides the `'0'`<br/>conversion if both are given).                     |
| `' '`  | (a space) A blank should be left before a positive number (or empty<br/>string) produced by a signed conversion. |
| `'+'`  | A sign character (`'+'` or `'-'`) will precede the conversion<br/>(overrides a “space” flag).                    |

A length modifier (`h`, `l`, or `L`) may be present, but is ignored as it
is not necessary for Python – so e.g. `%ld` is identical to `%d`.

The conversion types are:

| Conversion   | Meaning                                                                                                                                            | Notes   |
|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `'d'`        | Signed integer decimal.                                                                                                                            |         |
| `'i'`        | Signed integer decimal.                                                                                                                            |         |
| `'o'`        | Signed octal value.                                                                                                                                | (1)     |
| `'u'`        | Obsolete type – it is identical to `'d'`.                                                                                                          | (6)     |
| `'x'`        | Signed hexadecimal (lowercase).                                                                                                                    | (2)     |
| `'X'`        | Signed hexadecimal (uppercase).                                                                                                                    | (2)     |
| `'e'`        | Floating-point exponential format (lowercase).                                                                                                     | (3)     |
| `'E'`        | Floating-point exponential format (uppercase).                                                                                                     | (3)     |
| `'f'`        | Floating-point decimal format.                                                                                                                     | (3)     |
| `'F'`        | Floating-point decimal format.                                                                                                                     | (3)     |
| `'g'`        | Floating-point format. Uses lowercase exponential<br/>format if exponent is less than -4 or not less than<br/>precision, decimal format otherwise. | (4)     |
| `'G'`        | Floating-point format. Uses uppercase exponential<br/>format if exponent is less than -4 or not less than<br/>precision, decimal format otherwise. | (4)     |
| `'c'`        | Single character (accepts integer or single<br/>character string).                                                                                 |         |
| `'r'`        | String (converts any Python object using<br/>[`repr()`](functions.md#repr)).                                                                       | (5)     |
| `'s'`        | String (converts any Python object using<br/>[`str()`](#str)).                                                                                     | (5)     |
| `'a'`        | String (converts any Python object using<br/>[`ascii()`](functions.md#ascii)).                                                                     | (5)     |
| `'%'`        | No argument is converted, results in a `'%'`<br/>character in the result.                                                                          |         |

For floating-point formats, the result should be correctly rounded to a given
precision `p` of digits after the decimal point.  The rounding mode matches
that of the [`round()`](functions.md#round) builtin.

Notes:

1. The alternate form causes a leading octal specifier (`'0o'`) to be
   inserted before the first digit.
2. The alternate form causes a leading `'0x'` or `'0X'` (depending on whether
   the `'x'` or `'X'` format was used) to be inserted before the first digit.
3. The alternate form causes the result to always contain a decimal point, even if
   no digits follow it.

   The precision determines the number of digits after the decimal point and
   defaults to 6.
4. The alternate form causes the result to always contain a decimal point, and
   trailing zeroes are not removed as they would otherwise be.

   The precision determines the number of significant digits before and after the
   decimal point and defaults to 6.
5. If precision is `N`, the output is truncated to `N` characters.
6. See [**PEP 237**](https://peps.python.org/pep-0237/).

Since Python strings have an explicit length, `%s` conversions do not assume
that `'\0'` is the end of the string.

<!-- XXX Examples? -->

#### Versionchanged
Changed in version 3.1: `%f` conversions for numbers whose absolute value is over 1e50 are no
longer replaced by `%g` conversions.

<a id="index-40"></a>

<a id="binaryseq"></a>

## Binary Sequence Types — [`bytes`](#bytes), [`bytearray`](#bytearray), [`memoryview`](#memoryview)

<a id="index-41"></a>

The core built-in types for manipulating binary data are [`bytes`](#bytes) and
[`bytearray`](#bytearray). They are supported by [`memoryview`](#memoryview) which uses
the [buffer protocol](../c-api/buffer.md#bufferobjects) to access the memory of other
binary objects without needing to make a copy.

The [`array`](array.md#module-array) module supports efficient storage of basic data types like
32-bit integers and IEEE754 double-precision floating values.

<a id="typebytes"></a>

### Bytes Objects

<a id="index-42"></a>

Bytes objects are immutable sequences of single bytes. Since many major
binary protocols are based on the ASCII text encoding, bytes objects offer
several methods that are only valid when working with ASCII compatible
data and are closely related to string objects in a variety of other ways.

### *class* bytes(source=b'')

### *class* bytes(source, encoding, errors='strict')

Firstly, the syntax for bytes literals is largely the same as that for string
literals, except that a `b` prefix is added:

* Single quotes: `b'still allows embedded "double" quotes'`
* Double quotes: `b"still allows embedded 'single' quotes"`
* Triple quoted: `b'''3 single quotes'''`, `b"""3 double quotes"""`

Only ASCII characters are permitted in bytes literals (regardless of the
declared source code encoding). Any binary values over 127 must be entered
into bytes literals using the appropriate escape sequence.

As with string literals, bytes literals may also use a `r` prefix to disable
processing of escape sequences. See [String and Bytes literals](../reference/lexical_analysis.md#strings) for more about the various
forms of bytes literal, including supported escape sequences.

While bytes literals and representations are based on ASCII text, bytes
objects actually behave like immutable sequences of integers, with each
value in the sequence restricted such that `0 <= x < 256` (attempts to
violate this restriction will trigger [`ValueError`](exceptions.md#ValueError)). This is done
deliberately to emphasise that while many binary formats include ASCII based
elements and can be usefully manipulated with some text-oriented algorithms,
this is not generally the case for arbitrary binary data (blindly applying
text processing algorithms to binary data formats that are not ASCII
compatible will usually lead to data corruption).

In addition to the literal forms, bytes objects can be created in a number of
other ways:

* A zero-filled bytes object of a specified length: `bytes(10)`
* From an iterable of integers: `bytes(range(20))`
* Copying existing binary data via the buffer protocol:  `bytes(obj)`

Also see the [bytes](functions.md#func-bytes) built-in.

Since 2 hexadecimal digits correspond precisely to a single byte, hexadecimal
numbers are a commonly used format for describing binary data. Accordingly,
the bytes type has an additional class method to read data in that format:

#### *classmethod* fromhex(string,)

This [`bytes`](#bytes) class method returns a bytes object, decoding the
given string object.  The string must contain two hexadecimal digits per
byte, with ASCII whitespace being ignored.

```pycon
>>> bytes.fromhex('2Ef0 F1f2  ')
b'.\xf0\xf1\xf2'
```

#### Versionchanged
Changed in version 3.7: [`bytes.fromhex()`](#bytes.fromhex) now skips all ASCII whitespace in the string,
not just spaces.

#### Versionchanged
Changed in version 3.14: [`bytes.fromhex()`](#bytes.fromhex) now accepts ASCII [`bytes`](#bytes) and
[bytes-like objects](../glossary.md#term-bytes-like-object) as input.

A reverse conversion function exists to transform a bytes object into its
hexadecimal representation.

#### hex(, bytes_per_sep=1)

#### hex(sep, bytes_per_sep=1)

Return a string object containing two hexadecimal digits for each
byte in the instance.

```pycon
>>> b'\xf0\xf1\xf2'.hex()
'f0f1f2'
```

If you want to make the hex string easier to read, you can specify a
single character separator *sep* parameter to include in the output.
By default, this separator will be included between each byte.
A second optional *bytes_per_sep* parameter controls the spacing.
Positive values calculate the separator position from the right,
negative values from the left.

```pycon
>>> value = b'\xf0\xf1\xf2'
>>> value.hex('-')
'f0-f1-f2'
>>> value.hex('_', 2)
'f0_f1f2'
>>> b'UUDDLRLRAB'.hex(' ', -4)
'55554444 4c524c52 4142'
```

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.8: [`bytes.hex()`](#bytes.hex) now supports optional *sep* and *bytes_per_sep*
parameters to insert separators between bytes in the hex output.

Since bytes objects are sequences of integers (akin to a tuple), for a bytes
object *b*, `b[0]` will be an integer, while `b[0:1]` will be a bytes
object of length 1.  (This contrasts with text strings, where both indexing
and slicing will produce a string of length 1)

The representation of bytes objects uses the literal format (`b'...'`)
since it is often more useful than e.g. `bytes([46, 46, 46])`.  You can
always convert a bytes object into a list of integers using `list(b)`.

<a id="typebytearray"></a>

### Bytearray Objects

<a id="index-43"></a>

[`bytearray`](#bytearray) objects are a mutable counterpart to [`bytes`](#bytes)
objects.

### *class* bytearray(source=b'')

### *class* bytearray(source, encoding, errors='strict')

There is no dedicated literal syntax for bytearray objects, instead
they are always created by calling the constructor:

* Creating an empty instance: `bytearray()`
* Creating a zero-filled instance with a given length: `bytearray(10)`
* From an iterable of integers: `bytearray(range(20))`
* Copying existing binary data via the buffer protocol:  `bytearray(b'Hi!')`

As bytearray objects are mutable, they support the
[mutable](#typesseq-mutable) sequence operations in addition to the
common bytes and bytearray operations described in [Bytes and Bytearray Operations](#bytes-methods).

Also see the [bytearray](functions.md#func-bytearray) built-in.

Since 2 hexadecimal digits correspond precisely to a single byte, hexadecimal
numbers are a commonly used format for describing binary data. Accordingly,
the bytearray type has an additional class method to read data in that format:

#### *classmethod* fromhex(string,)

This [`bytearray`](#bytearray) class method returns bytearray object, decoding
the given string object.  The string must contain two hexadecimal digits
per byte, with ASCII whitespace being ignored.

```pycon
>>> bytearray.fromhex('2Ef0 F1f2  ')
bytearray(b'.\xf0\xf1\xf2')
```

#### Versionchanged
Changed in version 3.7: [`bytearray.fromhex()`](#bytearray.fromhex) now skips all ASCII whitespace in the string,
not just spaces.

#### Versionchanged
Changed in version 3.14: [`bytearray.fromhex()`](#bytearray.fromhex) now accepts ASCII [`bytes`](#bytes) and
[bytes-like objects](../glossary.md#term-bytes-like-object) as input.

A reverse conversion function exists to transform a bytearray object into its
hexadecimal representation.

#### hex(, bytes_per_sep=1)

#### hex(sep, bytes_per_sep=1)

Return a string object containing two hexadecimal digits for each
byte in the instance.

```pycon
>>> bytearray(b'\xf0\xf1\xf2').hex()
'f0f1f2'
```

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.8: Similar to [`bytes.hex()`](#bytes.hex), [`bytearray.hex()`](#bytearray.hex) now supports
optional *sep* and *bytes_per_sep* parameters to insert separators
between bytes in the hex output.

#### resize(size,)

Resize the [`bytearray`](#bytearray) to contain *size* bytes. *size* must be
greater than or equal to 0.

If the [`bytearray`](#bytearray) needs to shrink, bytes beyond *size* are truncated.

If the [`bytearray`](#bytearray) needs to grow, all new bytes, those beyond *size*,
will be set to null bytes.

This is equivalent to:

```pycon
>>> def resize(ba, size):
...     if len(ba) > size:
...         del ba[size:]
...     else:
...         ba += b'\0' * (size - len(ba))
```

Examples:

```pycon
>>> shrink = bytearray(b'abc')
>>> shrink.resize(1)
>>> (shrink, len(shrink))
(bytearray(b'a'), 1)
>>> grow = bytearray(b'abc')
>>> grow.resize(5)
>>> (grow, len(grow))
(bytearray(b'abc\x00\x00'), 5)
```

#### Versionadded
Added in version 3.14.

#### take_bytes(n=None,)

Remove the first *n* bytes from the bytearray and return them as an immutable
[`bytes`](#bytes).
By default (if *n* is `None`), return all bytes and clear the bytearray.

If *n* is negative, index from the end and take the first [`len()`](functions.md#len)
plus *n* bytes. If *n* is out of bounds, raise [`IndexError`](exceptions.md#IndexError).

Taking less than the full length will leave remaining bytes in the
[`bytearray`](#bytearray), which requires a copy. If the remaining bytes should be
discarded, use [`resize()`](#bytearray.resize) or [`del`](../reference/simple_stmts.md#del) to truncate
then [`take_bytes()`](#bytearray.take_bytes) without a size.

**CPython implementation detail:** Taking all bytes is a zero-copy operation.

#### Versionadded
Added in version 3.15: See the [What’s New](../whatsnew/3.15.md#whatsnew315-bytearray-take-bytes) entry for
common code patterns which can be optimized with
[`bytearray.take_bytes()`](#bytearray.take_bytes).

Since bytearray objects are sequences of integers (akin to a list), for a
bytearray object *b*, `b[0]` will be an integer, while `b[0:1]` will be
a bytearray object of length 1.  (This contrasts with text strings, where
both indexing and slicing will produce a string of length 1)

The representation of bytearray objects uses the bytes literal format
(`bytearray(b'...')`) since it is often more useful than e.g.
`bytearray([46, 46, 46])`.  You can always convert a bytearray object into
a list of integers using `list(b)`.

#### SEE ALSO
For detailed information on thread-safety guarantees for [`bytearray`](#bytearray)
objects, see [Thread safety for bytearray objects](threadsafety.md#thread-safety-bytearray).

<a id="bytes-methods"></a>

### Bytes and Bytearray Operations

<a id="index-44"></a>

Both bytes and bytearray objects support the [common](#typesseq-common)
sequence operations. They interoperate not just with operands of the same
type, but with any [bytes-like object](../glossary.md#term-bytes-like-object). Due to this flexibility, they can be
freely mixed in operations without causing errors. However, the return type
of the result may depend on the order of operands.

#### NOTE
The methods on bytes and bytearray objects don’t accept strings as their
arguments, just as the methods on strings don’t accept bytes as their
arguments.  For example, you have to write:

```python3
a = "abc"
b = a.replace("a", "f")
```

and:

```python3
a = b"abc"
b = a.replace(b"a", b"f")
```

Some bytes and bytearray operations assume the use of ASCII compatible
binary formats, and hence should be avoided when working with arbitrary
binary data. These restrictions are covered below.

#### NOTE
Using these ASCII based operations to manipulate binary data that is not
stored in an ASCII based format may lead to data corruption.

The following methods on bytes and bytearray objects can be used with
arbitrary binary data.

#### bytes.count(sub)

#### bytearray.count(sub)

Return the number of non-overlapping occurrences of subsequence *sub* in
the range [*start*, *end*].  Optional arguments *start* and *end* are
interpreted as in slice notation.

The subsequence to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object) or an
integer in the range 0 to 255.

If *sub* is empty, returns the number of empty slices between characters
which is the length of the bytes object plus one.

#### Versionchanged
Changed in version 3.3: Also accept an integer in the range 0 to 255 as the subsequence.

#### bytes.removeprefix(prefix,)

#### bytearray.removeprefix(prefix,)

If the binary data starts with the *prefix* string, return
`bytes[len(prefix):]`. Otherwise, return a copy of the original
binary data:

```python3
>>> b'TestHook'.removeprefix(b'Test')
b'Hook'
>>> b'BaseTestCase'.removeprefix(b'Test')
b'BaseTestCase'
```

The *prefix* may be any [bytes-like object](../glossary.md#term-bytes-like-object).

#### NOTE
The bytearray version of this method does *not* operate in place -
it always produces a new object, even if no changes were made.

#### Versionadded
Added in version 3.9.

#### bytes.removesuffix(suffix,)

#### bytearray.removesuffix(suffix,)

If the binary data ends with the *suffix* string and that *suffix* is
not empty, return `bytes[:-len(suffix)]`.  Otherwise, return a copy of
the original binary data:

```python3
>>> b'MiscTests'.removesuffix(b'Tests')
b'Misc'
>>> b'TmpDirMixin'.removesuffix(b'Tests')
b'TmpDirMixin'
```

The *suffix* may be any [bytes-like object](../glossary.md#term-bytes-like-object).

#### NOTE
The bytearray version of this method does *not* operate in place -
it always produces a new object, even if no changes were made.

#### Versionadded
Added in version 3.9.

#### bytes.decode(encoding='utf-8', errors='strict')

#### bytearray.decode(encoding='utf-8', errors='strict')

Return the bytes decoded to a [`str`](#str).

*encoding* defaults to `'utf-8'`;
see [Standard Encodings](codecs.md#standard-encodings) for possible values.

*errors* controls how decoding errors are handled.
If `'strict'` (the default), a [`UnicodeError`](exceptions.md#UnicodeError) exception is raised.
Other possible values are `'ignore'`, `'replace'`,
and any other name registered via [`codecs.register_error()`](codecs.md#codecs.register_error).
See [Error Handlers](codecs.md#error-handlers) for details.

For performance reasons, the value of *errors* is not checked for validity
unless a decoding error actually occurs,
[Python Development Mode](devmode.md#devmode) is enabled or a [debug build](../using/configure.md#debug-build) is used.

#### NOTE
Passing the *encoding* argument to [`str`](#str) allows decoding any
[bytes-like object](../glossary.md#term-bytes-like-object) directly, without needing to make a temporary
`bytes` or `bytearray` object.

#### Versionchanged
Changed in version 3.1: Added support for keyword arguments.

#### Versionchanged
Changed in version 3.9: The value of the *errors* argument is now checked in [Python Development Mode](devmode.md#devmode) and
in [debug mode](../using/configure.md#debug-build).

#### bytes.endswith(suffix)

#### bytearray.endswith(suffix)

Return `True` if the binary data ends with the specified *suffix*,
otherwise return `False`.  *suffix* can also be a tuple of suffixes to
look for.  With optional *start*, test beginning at that position.  With
optional *end*, stop comparing at that position.

The suffix(es) to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object).

#### bytes.find(sub)

#### bytearray.find(sub)

Return the lowest index in the data where the subsequence *sub* is found,
such that *sub* is contained in the slice `s[start:end]`.  Optional
arguments *start* and *end* are interpreted as in slice notation.  Return
`-1` if *sub* is not found.

The subsequence to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object) or an
integer in the range 0 to 255.

#### NOTE
The [`find()`](#bytes.find) method should be used only if you need to know the
position of *sub*.  To check if *sub* is a substring or not, use the
[`in`](../reference/expressions.md#in) operator:

```python3
>>> b'Py' in b'Python'
True
```

#### Versionchanged
Changed in version 3.3: Also accept an integer in the range 0 to 255 as the subsequence.

#### bytes.index(sub)

#### bytearray.index(sub)

Like [`find()`](#bytes.find), but raise [`ValueError`](exceptions.md#ValueError) when the
subsequence is not found.

The subsequence to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object) or an
integer in the range 0 to 255.

#### Versionchanged
Changed in version 3.3: Also accept an integer in the range 0 to 255 as the subsequence.

#### bytes.join(iterable,)

#### bytearray.join(iterable,)

Return a bytes or bytearray object which is the concatenation of the
binary data sequences in *iterable*.  A [`TypeError`](exceptions.md#TypeError) will be raised
if there are any values in *iterable* that are not [bytes-like
objects](../glossary.md#term-bytes-like-object), including [`str`](#str) objects.  The
separator between elements is the contents of the bytes or
bytearray object providing this method.

#### *static* bytes.maketrans(from, to, /)

#### *static* bytearray.maketrans(from, to, /)

This static method returns a translation table usable for
[`bytes.translate()`](#bytes.translate) that will map each character in *from* into the
character at the same position in *to*; *from* and *to* must both be
[bytes-like objects](../glossary.md#term-bytes-like-object) and have the same length.

#### Versionadded
Added in version 3.1.

#### bytes.partition(sep,)

#### bytearray.partition(sep,)

Split the sequence at the first occurrence of *sep*, and return a 3-tuple
containing the part before the separator, the separator itself or its
bytearray copy, and the part after the separator.
If the separator is not found, return a 3-tuple
containing a copy of the original sequence, followed by two empty bytes or
bytearray objects.

The separator to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object).

#### bytes.replace(old, new, , count=-1)

#### bytearray.replace(old, new, , count=-1)

Return a copy of the sequence with all occurrences of subsequence *old*
replaced by *new*.  If *count* is given, only the first *count* occurrences
are replaced.  If *count* is not specified or `-1`, then all occurrences
are replaced.

The subsequence to search for and its replacement may be any
[bytes-like object](../glossary.md#term-bytes-like-object).

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

#### Versionchanged
Changed in version 3.15: *count* is now supported as a keyword argument.

#### bytes.rfind(sub)

#### bytearray.rfind(sub)

Return the highest index in the sequence where the subsequence *sub* is
found, such that *sub* is contained within `s[start:end]`.  Optional
arguments *start* and *end* are interpreted as in slice notation. Return
`-1` on failure.

The subsequence to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object) or an
integer in the range 0 to 255.

#### Versionchanged
Changed in version 3.3: Also accept an integer in the range 0 to 255 as the subsequence.

#### bytes.rindex(sub)

#### bytearray.rindex(sub)

Like [`rfind()`](#bytes.rfind) but raises [`ValueError`](exceptions.md#ValueError) when the
subsequence *sub* is not found.

The subsequence to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object) or an
integer in the range 0 to 255.

#### Versionchanged
Changed in version 3.3: Also accept an integer in the range 0 to 255 as the subsequence.

#### bytes.rpartition(sep,)

#### bytearray.rpartition(sep,)

Split the sequence at the last occurrence of *sep*, and return a 3-tuple
containing the part before the separator, the separator itself or its
bytearray copy, and the part after the separator.
If the separator is not found, return a 3-tuple
containing two empty bytes or bytearray objects, followed by a copy of the
original sequence.

The separator to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object).

#### bytes.startswith(prefix)

#### bytearray.startswith(prefix)

Return `True` if the binary data starts with the specified *prefix*,
otherwise return `False`.  *prefix* can also be a tuple of prefixes to
look for.  With optional *start*, test beginning at that position.  With
optional *end*, stop comparing at that position.

The prefix(es) to search for may be any [bytes-like object](../glossary.md#term-bytes-like-object).

#### bytes.translate(table, , delete=b'')

#### bytearray.translate(table, , delete=b'')

Return a copy of the bytes or bytearray object where all bytes occurring in
the optional argument *delete* are removed, and the remaining bytes have
been mapped through the given translation table, which must be a bytes
object of length 256.

You can use the [`bytes.maketrans()`](#bytes.maketrans) method to create a translation
table.

Set the *table* argument to `None` for translations that only delete
characters:

```python3
>>> b'read this short text'.translate(None, b'aeiou')
b'rd ths shrt txt'
```

#### Versionchanged
Changed in version 3.6: *delete* is now supported as a keyword argument.

The following methods on bytes and bytearray objects have default behaviours
that assume the use of ASCII compatible binary formats, but can still be used
with arbitrary binary data by passing appropriate arguments. Note that all of
the bytearray methods in this section do *not* operate in place, and instead
produce new objects.

#### bytes.center(width, fillbyte=b' ',)

#### bytearray.center(width, fillbyte=b' ',)

Return a copy of the object centered in a sequence of length *width*.
Padding is done using the specified *fillbyte* (default is an ASCII
space). For [`bytes`](#bytes) objects, the original sequence is returned if
*width* is less than or equal to `len(s)`.

#### NOTE
The bytearray version of this method does *not* operate in place -
it always produces a new object, even if no changes were made.

#### bytes.ljust(width, fillbyte=b' ',)

#### bytearray.ljust(width, fillbyte=b' ',)

Return a copy of the object left justified in a sequence of length *width*.
Padding is done using the specified *fillbyte* (default is an ASCII
space). For [`bytes`](#bytes) objects, the original sequence is returned if
*width* is less than or equal to `len(s)`.

#### NOTE
The bytearray version of this method does *not* operate in place -
it always produces a new object, even if no changes were made.

#### bytes.lstrip(bytes=None,)

#### bytearray.lstrip(bytes=None,)

Return a copy of the sequence with specified leading bytes removed.  The
*bytes* argument is a binary sequence specifying the set of byte values to
be removed.  If omitted or `None`, the *bytes* argument defaults
to removing ASCII whitespace.  The *bytes* argument is not a prefix;
rather, all combinations of its values are stripped:

```python3
>>> b'   spacious   '.lstrip()
b'spacious   '
>>> b'www.example.com'.lstrip(b'cmowz.')
b'example.com'
```

The binary sequence of byte values to remove may be any
[bytes-like object](../glossary.md#term-bytes-like-object). See [`removeprefix()`](#bytes.removeprefix) for a method
that will remove a single prefix string rather than all of a set of
characters.  For example:

```python3
>>> b'Arthur: three!'.lstrip(b'Arthur: ')
b'ee!'
>>> b'Arthur: three!'.removeprefix(b'Arthur: ')
b'three!'
```

#### NOTE
The bytearray version of this method does *not* operate in place -
it always produces a new object, even if no changes were made.

#### bytes.rjust(width, fillbyte=b' ',)

#### bytearray.rjust(width, fillbyte=b' ',)

Return a copy of the object right justified in a sequence of length *width*.
Padding is done using the specified *fillbyte* (default is an ASCII
space). For [`bytes`](#bytes) objects, the original sequence is returned if
*width* is less than or equal to `len(s)`.

#### NOTE
The bytearray version of this method does *not* operate in place -
it always produces a new object, even if no changes were made.

#### bytes.rsplit(sep=None, maxsplit=-1)

#### bytearray.rsplit(sep=None, maxsplit=-1)

Split the binary sequence into subsequences of the same type, using *sep*
as the delimiter string. If *maxsplit* is given, at most *maxsplit* splits
are done, the *rightmost* ones.  If *sep* is not specified or `None`,
any subsequence consisting solely of ASCII whitespace is a separator.
Except for splitting from the right, [`rsplit()`](#bytearray.rsplit) behaves like
[`split()`](#bytearray.split) which is described in detail below.

#### bytes.rstrip(bytes=None,)

#### bytearray.rstrip(bytes=None,)

Return a copy of the sequence with specified trailing bytes removed.  The
*bytes* argument is a binary sequence specifying the set of byte values to
be removed.  If omitted or `None`, the *bytes* argument defaults to
removing ASCII whitespace.  The *bytes* argument is not a suffix; rather,
all combinations of its values are stripped:

```python3
>>> b'   spacious   '.rstrip()
b'   spacious'
>>> b'mississippi'.rstrip(b'ipz')
b'mississ'
```

The binary sequence of byte values to remove may be any
[bytes-like object](../glossary.md#term-bytes-like-object). See [`removesuffix()`](#bytes.removesuffix) for a method
that will remove a single suffix string rather than all of a set of
characters.  For example:

```python3
>>> b'Monty Python'.rstrip(b' Python')
b'M'
>>> b'Monty Python'.removesuffix(b' Python')
b'Monty'
```

#### NOTE
The bytearray version of this method does *not* operate in place -
it always produces a new object, even if no changes were made.

#### bytes.split(sep=None, maxsplit=-1)

#### bytearray.split(sep=None, maxsplit=-1)

Split the binary sequence into subsequences of the same type, using *sep*
as the delimiter string. If *maxsplit* is given and non-negative, at most
*maxsplit* splits are done (thus, the list will have at most `maxsplit+1`
elements).  If *maxsplit* is not specified or is `-1`, then there is no
limit on the number of splits (all possible splits are made).

If *sep* is given, consecutive delimiters are not grouped together and are
deemed to delimit empty subsequences (for example, `b'1,,2'.split(b',')`
returns `[b'1', b'', b'2']`).  The *sep* argument may consist of a
multibyte sequence as a single delimiter. Splitting an empty sequence with
a specified separator returns `[b'']` or `[bytearray(b'')]` depending
on the type of object being split.  The *sep* argument may be any
[bytes-like object](../glossary.md#term-bytes-like-object).

For example:

```python3
>>> b'1,2,3'.split(b',')
[b'1', b'2', b'3']
>>> b'1,2,3'.split(b',', maxsplit=1)
[b'1', b'2,3']
>>> b'1,2,,3,'.split(b',')
[b'1', b'2', b'', b'3', b'']
>>> b'1<>2<>3<4'.split(b'<>')
[b'1', b'2', b'3<4']
```

If *sep* is not specified or is `None`, a different splitting algorithm
is applied: runs of consecutive ASCII whitespace are regarded as a single
separator, and the result will contain no empty strings at the start or
end if the sequence has leading or trailing whitespace.  Consequently,
splitting an empty sequence or a sequence consisting solely of ASCII
whitespace without a specified separator returns `[]`.

For example:

```python3
>>> b'1 2 3'.split()
[b'1', b'2', b'3']
>>> b'1 2 3'.split(maxsplit=1)
[b'1', b'2 3']
>>> b'   1   2   3   '.split()
[b'1', b'2', b'3']
```

#### bytes.strip(bytes=None,)

#### bytearray.strip(bytes=None,)

Return a copy of the sequence with specified leading and trailing bytes
removed. The *bytes* argument is a binary sequence specifying the set of
byte values to be removed.  If omitted or `None`, the *bytes*
argument defaults to removing ASCII whitespace. The *bytes* argument is
not a prefix or suffix; rather, all combinations of its values are
stripped:

```python3
>>> b'   spacious   '.strip()
b'spacious'
>>> b'www.example.com'.strip(b'cmowz.')
b'example'
```

The binary sequence of byte values to remove may be any
[bytes-like object](../glossary.md#term-bytes-like-object).

#### NOTE
The bytearray version of this method does *not* operate in place -
it always produces a new object, even if no changes were made.

The following methods on bytes and bytearray objects assume the use of ASCII
compatible binary formats and should not be applied to arbitrary binary data.
Note that all of the bytearray methods in this section do *not* operate in
place, and instead produce new objects.

#### bytes.capitalize()

#### bytearray.capitalize()

Return a copy of the sequence with each byte interpreted as an ASCII
character, and the first byte capitalized and the rest lowercased.
Non-ASCII byte values are passed through unchanged.

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

#### bytes.expandtabs(tabsize=8)

#### bytearray.expandtabs(tabsize=8)

Return a copy of the sequence where all ASCII tab characters are replaced
by one or more ASCII spaces, depending on the current column and the given
tab size.  Tab positions occur every *tabsize* bytes (default is 8,
giving tab positions at columns 0, 8, 16 and so on).  To expand the
sequence, the current column is set to zero and the sequence is examined
byte by byte.  If the byte is an ASCII tab character (`b'\t'`), one or
more space characters are inserted in the result until the current column
is equal to the next tab position. (The tab character itself is not
copied.)  If the current byte is an ASCII newline (`b'\n'`) or
carriage return (`b'\r'`), it is copied and the current column is reset
to zero.  Any other byte value is copied unchanged and the current column
is incremented by one regardless of how the byte value is represented when
printed:

```python3
>>> b'01\t012\t0123\t01234'.expandtabs()
b'01      012     0123    01234'
>>> b'01\t012\t0123\t01234'.expandtabs(4)
b'01  012 0123    01234'
```

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

#### bytes.isalnum()

#### bytearray.isalnum()

Return `True` if all bytes in the sequence are alphabetical ASCII characters
or ASCII decimal digits and the sequence is not empty, `False` otherwise.
Alphabetic ASCII characters are those byte values in the sequence
`b'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'`. ASCII decimal
digits are those byte values in the sequence `b'0123456789'`.

For example:

```python3
>>> b'ABCabc1'.isalnum()
True
>>> b'ABC abc1'.isalnum()
False
```

#### bytes.isalpha()

#### bytearray.isalpha()

Return `True` if all bytes in the sequence are alphabetic ASCII characters
and the sequence is not empty, `False` otherwise.  Alphabetic ASCII
characters are those byte values in the sequence
`b'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'`.

For example:

```python3
>>> b'ABCabc'.isalpha()
True
>>> b'ABCabc1'.isalpha()
False
```

#### bytes.isascii()

#### bytearray.isascii()

Return `True` if the sequence is empty or all bytes in the sequence are ASCII,
`False` otherwise.
ASCII bytes are in the range 0-0x7F.

#### Versionadded
Added in version 3.7.

#### bytes.isdigit()

#### bytearray.isdigit()

Return `True` if all bytes in the sequence are ASCII decimal digits
and the sequence is not empty, `False` otherwise. ASCII decimal digits are
those byte values in the sequence `b'0123456789'`.

For example:

```python3
>>> b'1234'.isdigit()
True
>>> b'1.23'.isdigit()
False
```

#### bytes.islower()

#### bytearray.islower()

Return `True` if there is at least one lowercase ASCII character
in the sequence and no uppercase ASCII characters, `False` otherwise.

For example:

```python3
>>> b'hello world'.islower()
True
>>> b'Hello world'.islower()
False
```

Lowercase ASCII characters are those byte values in the sequence
`b'abcdefghijklmnopqrstuvwxyz'`. Uppercase ASCII characters
are those byte values in the sequence `b'ABCDEFGHIJKLMNOPQRSTUVWXYZ'`.

#### bytes.isspace()

#### bytearray.isspace()

Return `True` if all bytes in the sequence are ASCII whitespace and the
sequence is not empty, `False` otherwise.  ASCII whitespace characters are
those byte values in the sequence `b' \t\n\r\x0b\f'` (space, tab, newline,
carriage return, vertical tab, form feed).

#### bytes.istitle()

#### bytearray.istitle()

Return `True` if the sequence is ASCII titlecase and the sequence is not
empty, `False` otherwise. See [`bytes.title()`](#bytes.title) for more details on the
definition of “titlecase”.

For example:

```python3
>>> b'Hello World'.istitle()
True
>>> b'Hello world'.istitle()
False
```

#### bytes.isupper()

#### bytearray.isupper()

Return `True` if there is at least one uppercase alphabetic ASCII character
in the sequence and no lowercase ASCII characters, `False` otherwise.

For example:

```python3
>>> b'HELLO WORLD'.isupper()
True
>>> b'Hello world'.isupper()
False
```

Lowercase ASCII characters are those byte values in the sequence
`b'abcdefghijklmnopqrstuvwxyz'`. Uppercase ASCII characters
are those byte values in the sequence `b'ABCDEFGHIJKLMNOPQRSTUVWXYZ'`.

#### bytes.lower()

#### bytearray.lower()

Return a copy of the sequence with all the uppercase ASCII characters
converted to their corresponding lowercase counterpart.

For example:

```python3
>>> b'Hello World'.lower()
b'hello world'
```

Lowercase ASCII characters are those byte values in the sequence
`b'abcdefghijklmnopqrstuvwxyz'`. Uppercase ASCII characters
are those byte values in the sequence `b'ABCDEFGHIJKLMNOPQRSTUVWXYZ'`.

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

<a id="index-45"></a>

#### bytes.splitlines(keepends=False)

#### bytearray.splitlines(keepends=False)

Return a list of the lines in the binary sequence, breaking at ASCII
line boundaries. This method uses the [universal newlines](../glossary.md#term-universal-newlines) approach
to splitting lines. Line breaks are not included in the resulting list
unless *keepends* is given and true.

For example:

```python3
>>> b'ab c\n\nde fg\rkl\r\n'.splitlines()
[b'ab c', b'', b'de fg', b'kl']
>>> b'ab c\n\nde fg\rkl\r\n'.splitlines(keepends=True)
[b'ab c\n', b'\n', b'de fg\r', b'kl\r\n']
```

Unlike [`split()`](#bytes.split) when a delimiter string *sep* is given, this
method returns an empty list for the empty string, and a terminal line
break does not result in an extra line:

```python3
>>> b"".split(b'\n'), b"Two lines\n".split(b'\n')
([b''], [b'Two lines', b''])
>>> b"".splitlines(), b"One line\n".splitlines()
([], [b'One line'])
```

#### bytes.swapcase()

#### bytearray.swapcase()

Return a copy of the sequence with all the lowercase ASCII characters
converted to their corresponding uppercase counterpart and vice-versa.

For example:

```python3
>>> b'Hello World'.swapcase()
b'hELLO wORLD'
```

Lowercase ASCII characters are those byte values in the sequence
`b'abcdefghijklmnopqrstuvwxyz'`. Uppercase ASCII characters
are those byte values in the sequence `b'ABCDEFGHIJKLMNOPQRSTUVWXYZ'`.

Unlike [`str.swapcase()`](#str.swapcase), it is always the case that
`bin.swapcase().swapcase() == bin` for the binary versions. Case
conversions are symmetrical in ASCII, even though that is not generally
true for arbitrary Unicode code points.

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

#### bytes.title()

#### bytearray.title()

Return a titlecased version of the binary sequence where words start with
an uppercase ASCII character and the remaining characters are lowercase.
Uncased byte values are left unmodified.

For example:

```python3
>>> b'Hello world'.title()
b'Hello World'
```

Lowercase ASCII characters are those byte values in the sequence
`b'abcdefghijklmnopqrstuvwxyz'`. Uppercase ASCII characters
are those byte values in the sequence `b'ABCDEFGHIJKLMNOPQRSTUVWXYZ'`.
All other byte values are uncased.

The algorithm uses a simple language-independent definition of a word as
groups of consecutive letters.  The definition works in many contexts but
it means that apostrophes in contractions and possessives form word
boundaries, which may not be the desired result:

```python3
>>> b"they're bill's friends from the UK".title()
b"They'Re Bill'S Friends From The Uk"
```

A workaround for apostrophes can be constructed using regular expressions:

```python3
>>> import re
>>> def titlecase(s):
...     return re.sub(rb"[A-Za-z]+('[A-Za-z]+)?",
...                   lambda mo: mo.group(0)[0:1].upper() +
...                              mo.group(0)[1:].lower(),
...                   s)
...
>>> titlecase(b"they're bill's friends.")
b"They're Bill's Friends."
```

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

#### bytes.upper()

#### bytearray.upper()

Return a copy of the sequence with all the lowercase ASCII characters
converted to their corresponding uppercase counterpart.

For example:

```python3
>>> b'Hello World'.upper()
b'HELLO WORLD'
```

Lowercase ASCII characters are those byte values in the sequence
`b'abcdefghijklmnopqrstuvwxyz'`. Uppercase ASCII characters
are those byte values in the sequence `b'ABCDEFGHIJKLMNOPQRSTUVWXYZ'`.

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

#### bytes.zfill(width,)

#### bytearray.zfill(width,)

Return a copy of the sequence left filled with ASCII `b'0'` digits to
make a sequence of length *width*. A leading sign prefix (`b'+'`/
`b'-'`) is handled by inserting the padding *after* the sign character
rather than before. For [`bytes`](#bytes) objects, the original sequence is
returned if *width* is less than or equal to `len(seq)`.

For example:

```python3
>>> b"42".zfill(5)
b'00042'
>>> b"-42".zfill(5)
b'-0042'
```

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

<a id="bytes-formatting"></a>

### `printf`-style Bytes Formatting

<a id="index-46"></a>

#### NOTE
The formatting operations described here exhibit a variety of quirks that
lead to a number of common errors (such as failing to display tuples and
dictionaries correctly).  If the value being printed may be a tuple or
dictionary, wrap it in a tuple.

Bytes objects (`bytes`/`bytearray`) have one unique built-in operation:
the `%` operator (modulo).
This is also known as the bytes *formatting* or *interpolation* operator.
Given `format % values` (where *format* is a bytes object), `%` conversion
specifications in *format* are replaced with zero or more elements of *values*.
The effect is similar to using the `sprintf()` in the C language.

If *format* requires a single argument, *values* may be a single non-tuple
object. <sup>[5](#id16)</sup>  Otherwise, *values* must be a tuple with exactly the number of
items specified by the format bytes object, or a single mapping object (for
example, a dictionary).

<a id="index-47"></a>

A conversion specifier contains two or more characters and has the following
components, which must occur in this order:

1. The `'%'` character, which marks the start of the specifier.
2. Mapping key (optional), consisting of a parenthesised sequence of characters
   (for example, `(somename)`).
3. Conversion flags (optional), which affect the result of some conversion
   types.
4. Minimum field width (optional).  If specified as an `'*'` (asterisk), the
   actual width is read from the next element of the tuple in *values*, and the
   object to convert comes after the minimum field width and optional precision.
5. Precision (optional), given as a `'.'` (dot) followed by the precision.  If
   specified as `'*'` (an asterisk), the actual precision is read from the next
   element of the tuple in *values*, and the value to convert comes after the
   precision.
6. Length modifier (optional).
7. Conversion type.

When the right argument is a dictionary (or other mapping type), then the
formats in the bytes object *must* include a parenthesised mapping key into that
dictionary inserted immediately after the `'%'` character. The mapping key
selects the value to be formatted from the mapping.  For example:

```pycon
>>> print(b'%(language)s has %(number)03d quote types.' %
...       {b'language': b"Python", b"number": 2})
b'Python has 002 quote types.'
```

In this case no `*` specifiers may occur in a format (since they require a
sequential parameter list).

The conversion flag characters are:

<a id="index-48"></a>

| Flag   | Meaning                                                                                                          |
|--------|------------------------------------------------------------------------------------------------------------------|
| `'#'`  | The value conversion will use the “alternate form” (where defined<br/>below).                                    |
| `'0'`  | The conversion will be zero padded for numeric values.                                                           |
| `'-'`  | The converted value is left adjusted (overrides the `'0'`<br/>conversion if both are given).                     |
| `' '`  | (a space) A blank should be left before a positive number (or empty<br/>string) produced by a signed conversion. |
| `'+'`  | A sign character (`'+'` or `'-'`) will precede the conversion<br/>(overrides a “space” flag).                    |

A length modifier (`h`, `l`, or `L`) may be present, but is ignored as it
is not necessary for Python – so e.g. `%ld` is identical to `%d`.

The conversion types are:

| Conversion   | Meaning                                                                                                                                                             | Notes   |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `'d'`        | Signed integer decimal.                                                                                                                                             |         |
| `'i'`        | Signed integer decimal.                                                                                                                                             |         |
| `'o'`        | Signed octal value.                                                                                                                                                 | (1)     |
| `'u'`        | Obsolete type – it is identical to `'d'`.                                                                                                                           | (8)     |
| `'x'`        | Signed hexadecimal (lowercase).                                                                                                                                     | (2)     |
| `'X'`        | Signed hexadecimal (uppercase).                                                                                                                                     | (2)     |
| `'e'`        | Floating-point exponential format (lowercase).                                                                                                                      | (3)     |
| `'E'`        | Floating-point exponential format (uppercase).                                                                                                                      | (3)     |
| `'f'`        | Floating-point decimal format.                                                                                                                                      | (3)     |
| `'F'`        | Floating-point decimal format.                                                                                                                                      | (3)     |
| `'g'`        | Floating-point format. Uses lowercase exponential<br/>format if exponent is less than -4 or not less than<br/>precision, decimal format otherwise.                  | (4)     |
| `'G'`        | Floating-point format. Uses uppercase exponential<br/>format if exponent is less than -4 or not less than<br/>precision, decimal format otherwise.                  | (4)     |
| `'c'`        | Single byte (accepts integer or single<br/>byte objects).                                                                                                           |         |
| `'b'`        | Bytes (any object that follows the<br/>[buffer protocol](../c-api/buffer.md#bufferobjects) or has<br/>[`__bytes__()`](../reference/datamodel.md#object.__bytes__)). | (5)     |
| `'s'`        | `'s'` is an alias for `'b'` and should only<br/>be used for Python2/3 code bases.                                                                                   | (6)     |
| `'a'`        | Bytes (converts any Python object using<br/>`repr(obj).encode('ascii', 'backslashreplace')`).                                                                       | (5)     |
| `'r'`        | `'r'` is an alias for `'a'` and should only<br/>be used for Python2/3 code bases.                                                                                   | (7)     |
| `'%'`        | No argument is converted, results in a `'%'`<br/>character in the result.                                                                                           |         |

Notes:

1. The alternate form causes a leading octal specifier (`'0o'`) to be
   inserted before the first digit.
2. The alternate form causes a leading `'0x'` or `'0X'` (depending on whether
   the `'x'` or `'X'` format was used) to be inserted before the first digit.
3. The alternate form causes the result to always contain a decimal point, even if
   no digits follow it.

   The precision determines the number of digits after the decimal point and
   defaults to 6.
4. The alternate form causes the result to always contain a decimal point, and
   trailing zeroes are not removed as they would otherwise be.

   The precision determines the number of significant digits before and after the
   decimal point and defaults to 6.
5. If precision is `N`, the output is truncated to `N` characters.
6. `b'%s'` is deprecated, but will not be removed during the 3.x series.
7. `b'%r'` is deprecated, but will not be removed during the 3.x series.
8. See [**PEP 237**](https://peps.python.org/pep-0237/).

#### NOTE
The bytearray version of this method does *not* operate in place - it
always produces a new object, even if no changes were made.

#### SEE ALSO
[**PEP 461**](https://peps.python.org/pep-0461/) - Adding % formatting to bytes and bytearray

#### Versionadded
Added in version 3.5.

<a id="typememoryview"></a>

### Memory Views

[`memoryview`](#memoryview) objects allow Python code to access the internal data
of an object that supports the [buffer protocol](../c-api/buffer.md#bufferobjects) without
copying.

### *class* memoryview(object)

Create a [`memoryview`](#memoryview) that references *object*.  *object* must
support the buffer protocol.  Built-in objects that support the buffer
protocol include [`bytes`](#bytes) and [`bytearray`](#bytearray).

A [`memoryview`](#memoryview) has the notion of an *element*, which is the
atomic memory unit handled by the originating *object*.  For many simple
types such as [`bytes`](#bytes) and [`bytearray`](#bytearray), an element is a single
byte, but other types such as [`array.array`](array.md#array.array) may have bigger elements.

`len(view)` is equal to the length of [`tolist()`](#memoryview.tolist), which
is the nested list representation of the view. If `view.ndim = 1`,
this is equal to the number of elements in the view.

#### Versionchanged
Changed in version 3.12: If `view.ndim == 0`, `len(view)` now raises [`TypeError`](exceptions.md#TypeError) instead of returning 1.

The [`itemsize`](#memoryview.itemsize) attribute will give you the number of
bytes in a single element.

A [`memoryview`](#memoryview) supports slicing and indexing to expose its data.
One-dimensional slicing will result in a subview:

```python3
>>> v = memoryview(b'abcefg')
>>> v[1]
98
>>> v[-1]
103
>>> v[1:4]
<memory at 0x7f3ddc9f4350>
>>> bytes(v[1:4])
b'bce'
```

If [`format`](#memoryview.format) is one of the native format specifiers
from the [`struct`](struct.md#module-struct) module, indexing with an integer or a tuple of
integers is also supported and returns a single *element* with
the correct type.  One-dimensional memoryviews can be indexed
with an integer or a one-integer tuple.  Multi-dimensional memoryviews
can be indexed with tuples of exactly *ndim* integers where *ndim* is
the number of dimensions.  Zero-dimensional memoryviews can be indexed
with the empty tuple.

Here is an example with a non-byte format:

```python3
>>> import array
>>> a = array.array('l', [-11111111, 22222222, -33333333, 44444444])
>>> m = memoryview(a)
>>> m[0]
-11111111
>>> m[-1]
44444444
>>> m[::2].tolist()
[-11111111, -33333333]
```

If the underlying object is writable, the memoryview supports
one-dimensional slice assignment. Resizing is not allowed:

```python3
>>> data = bytearray(b'abcefg')
>>> v = memoryview(data)
>>> v.readonly
False
>>> v[0] = ord(b'z')
>>> data
bytearray(b'zbcefg')
>>> v[1:4] = b'123'
>>> data
bytearray(b'z123fg')
>>> v[2:3] = b'spam'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: memoryview assignment: lvalue and rvalue have different structures
>>> v[2:6] = b'spam'
>>> data
bytearray(b'z1spam')
```

One-dimensional memoryviews of [hashable](../glossary.md#term-hashable) (read-only) types with formats
‘B’, ‘b’ or ‘c’ are also hashable. The hash is defined as
`hash(m) == hash(m.tobytes())`:

```python3
>>> v = memoryview(b'abcefg')
>>> hash(v) == hash(b'abcefg')
True
>>> hash(v[2:4]) == hash(b'ce')
True
>>> hash(v[::-2]) == hash(b'abcefg'[::-2])
True
```

#### Versionchanged
Changed in version 3.3: One-dimensional memoryviews can now be sliced.
One-dimensional memoryviews with formats ‘B’, ‘b’ or ‘c’ are now [hashable](../glossary.md#term-hashable).

#### Versionchanged
Changed in version 3.4: memoryview is now registered automatically with
[`collections.abc.Sequence`](collections.abc.md#collections.abc.Sequence)

#### Versionchanged
Changed in version 3.5: memoryviews can now be indexed with tuple of integers.

#### Versionchanged
Changed in version 3.14: memoryview is now a [generic type](../glossary.md#term-generic-type).

[`memoryview`](#memoryview) has several methods:

#### \_\_eq_\_(exporter)

A memoryview and a [**PEP 3118**](https://peps.python.org/pep-3118/) exporter are equal if their shapes are
equivalent and if all corresponding values are equal when the operands’
respective format codes are interpreted using [`struct`](struct.md#module-struct) syntax.

For the subset of [`struct`](struct.md#module-struct) format strings currently supported by
[`tolist()`](#memoryview.tolist), `v` and `w` are equal if `v.tolist() == w.tolist()`:

```python3
>>> import array
>>> a = array.array('I', [1, 2, 3, 4, 5])
>>> b = array.array('d', [1.0, 2.0, 3.0, 4.0, 5.0])
>>> c = array.array('b', [5, 3, 1])
>>> x = memoryview(a)
>>> y = memoryview(b)
>>> x == a == y == b
True
>>> x.tolist() == a.tolist() == y.tolist() == b.tolist()
True
>>> z = y[::-2]
>>> z == c
True
>>> z.tolist() == c.tolist()
True
```

If either format string is not supported by the [`struct`](struct.md#module-struct) module,
then the objects will always compare as unequal (even if the format
strings and buffer contents are identical):

```python3
>>> from ctypes import BigEndianStructure, c_long
>>> class BEPoint(BigEndianStructure):
...     _fields_ = [("x", c_long), ("y", c_long)]
...
>>> point = BEPoint(100, 200)
>>> a = memoryview(point)
>>> b = memoryview(point)
>>> a == point
False
>>> a == b
False
```

Note that, as with floating-point numbers, `v is w` does *not* imply
`v == w` for memoryview objects.

#### Versionchanged
Changed in version 3.3: Previous versions compared the raw memory disregarding the item format
and the logical array structure.

#### tobytes(order='C')

Return the data in the buffer as a bytestring.  This is equivalent to
calling the [`bytes`](#bytes) constructor on the memoryview.

```python3
>>> m = memoryview(b"abc")
>>> m.tobytes()
b'abc'
>>> bytes(m)
b'abc'
```

For non-contiguous arrays the result is equal to the flattened list
representation with all elements converted to bytes. [`tobytes()`](#memoryview.tobytes)
supports all format strings, including those that are not in
[`struct`](struct.md#module-struct) module syntax.

#### Versionadded
Added in version 3.8: *order* can be {‘C’, ‘F’, ‘A’}.  When *order* is ‘C’ or ‘F’, the data
of the original array is converted to C or Fortran order. For contiguous
views, ‘A’ returns an exact copy of the physical memory. In particular,
in-memory Fortran order is preserved. For non-contiguous views, the
data is converted to C first. *order=None* is the same as *order=’C’*.

#### hex(, bytes_per_sep=1)

#### hex(sep, bytes_per_sep=1)

Return a string object containing two hexadecimal digits for each
byte in the buffer.

```python3
>>> m = memoryview(b"abc")
>>> m.hex()
'616263'
```

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.8: Similar to [`bytes.hex()`](#bytes.hex), [`memoryview.hex()`](#memoryview.hex) now supports
optional *sep* and *bytes_per_sep* parameters to insert separators
between bytes in the hex output.

#### tolist()

Return the data in the buffer as a list of elements.

```python3
>>> memoryview(b'abc').tolist()
[97, 98, 99]
>>> import array
>>> a = array.array('d', [1.1, 2.2, 3.3])
>>> m = memoryview(a)
>>> m.tolist()
[1.1, 2.2, 3.3]
```

#### Versionchanged
Changed in version 3.3: [`tolist()`](#memoryview.tolist) now supports all single character native formats in
[`struct`](struct.md#module-struct) module syntax as well as multi-dimensional
representations.

#### toreadonly()

Return a readonly version of the memoryview object.  The original
memoryview object is unchanged.

```python3
>>> m = memoryview(bytearray(b'abc'))
>>> mm = m.toreadonly()
>>> mm.tolist()
[97, 98, 99]
>>> mm[0] = 42
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: cannot modify read-only memory
>>> m[0] = 43
>>> mm.tolist()
[43, 98, 99]
```

#### Versionadded
Added in version 3.8.

#### release()

Release the underlying buffer exposed by the memoryview object.  Many
objects take special actions when a view is held on them (for example,
a [`bytearray`](#bytearray) would temporarily forbid resizing); therefore,
calling release() is handy to remove these restrictions (and free any
dangling resources) as soon as possible.

After this method has been called, any further operation on the view
raises a [`ValueError`](exceptions.md#ValueError) (except [`release()`](#memoryview.release) itself which can
be called multiple times):

```python3
>>> m = memoryview(b'abc')
>>> m.release()
>>> m[0]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: operation forbidden on released memoryview object
```

The context management protocol can be used for a similar effect,
using the `with` statement:

```python3
>>> with memoryview(b'abc') as m:
...     m[0]
...
97
>>> m[0]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: operation forbidden on released memoryview object
```

#### Versionadded
Added in version 3.2.

#### cast(format,)

#### cast(format, shape,)

Cast a memoryview to a new format or shape. *shape* defaults to
`[byte_length//new_itemsize]`, which means that the result view
will be one-dimensional. The return value is a new memoryview, but
the buffer itself is not copied. Supported casts are 1D -> C-[contiguous](../glossary.md#term-contiguous)
and C-contiguous -> 1D.

The destination format is restricted to a single element native format in
[`struct`](struct.md#module-struct) syntax. One of the formats must be a byte format
(‘B’, ‘b’ or ‘c’). The byte length of the result must be the same
as the original length.
Note that all byte lengths may depend on the operating system.

Cast 1D/long to 1D/unsigned bytes:

```python3
>>> import array
>>> a = array.array('l', [1,2,3])
>>> x = memoryview(a)
>>> x.format
'l'
>>> x.itemsize
8
>>> len(x)
3
>>> x.nbytes
24
>>> y = x.cast('B')
>>> y.format
'B'
>>> y.itemsize
1
>>> len(y)
24
>>> y.nbytes
24
```

Cast 1D/unsigned bytes to 1D/char:

```python3
>>> b = bytearray(b'zyz')
>>> x = memoryview(b)
>>> x[0] = b'a'
Traceback (most recent call last):
  ...
TypeError: memoryview: invalid type for format 'B'
>>> y = x.cast('c')
>>> y[0] = b'a'
>>> b
bytearray(b'ayz')
```

Cast 1D/bytes to 3D/ints to 1D/signed char:

```python3
>>> import struct
>>> buf = struct.pack("i"*12, *list(range(12)))
>>> x = memoryview(buf)
>>> y = x.cast('i', shape=[2,2,3])
>>> y.tolist()
[[[0, 1, 2], [3, 4, 5]], [[6, 7, 8], [9, 10, 11]]]
>>> y.format
'i'
>>> y.itemsize
4
>>> len(y)
2
>>> y.nbytes
48
>>> z = y.cast('b')
>>> z.format
'b'
>>> z.itemsize
1
>>> len(z)
48
>>> z.nbytes
48
```

Cast 1D/unsigned long to 2D/unsigned long:

```python3
>>> buf = struct.pack("L"*6, *list(range(6)))
>>> x = memoryview(buf)
>>> y = x.cast('L', shape=[2,3])
>>> len(y)
2
>>> y.nbytes
48
>>> y.tolist()
[[0, 1, 2], [3, 4, 5]]
```

#### Versionadded
Added in version 3.3.

#### Versionchanged
Changed in version 3.5: The source format is no longer restricted when casting to a byte view.

#### count(value,)

Count the number of occurrences of *value*.

#### Versionadded
Added in version 3.14.

#### index(value, start=0, stop=sys.maxsize,)

Return the index of the first occurrence of *value* (at or after
index *start* and before index *stop*).

Raises a [`ValueError`](exceptions.md#ValueError) if *value* cannot be found.

#### Versionadded
Added in version 3.14.

There are also several readonly attributes available:

#### obj

The underlying object of the memoryview:

```python3
>>> b  = bytearray(b'xyz')
>>> m = memoryview(b)
>>> m.obj is b
True
```

#### Versionadded
Added in version 3.3.

#### nbytes

`nbytes == product(shape) * itemsize == len(m.tobytes())`. This is
the amount of space in bytes that the array would use in a contiguous
representation. It is not necessarily equal to `len(m)`:

```python3
>>> import array
>>> a = array.array('i', [1,2,3,4,5])
>>> m = memoryview(a)
>>> len(m)
5
>>> m.nbytes
20
>>> y = m[::2]
>>> len(y)
3
>>> y.nbytes
12
>>> len(y.tobytes())
12
```

Multi-dimensional arrays:

```python3
>>> import struct
>>> buf = struct.pack("d"*12, *[1.5*x for x in range(12)])
>>> x = memoryview(buf)
>>> y = x.cast('d', shape=[3,4])
>>> y.tolist()
[[0.0, 1.5, 3.0, 4.5], [6.0, 7.5, 9.0, 10.5], [12.0, 13.5, 15.0, 16.5]]
>>> len(y)
3
>>> y.nbytes
96
```

#### Versionadded
Added in version 3.3.

#### readonly

A bool indicating whether the memory is read only.

#### format

A string containing the format (in [`struct`](struct.md#module-struct) module style) for each
element in the view. A memoryview can be created from exporters with
arbitrary format strings, but some methods (e.g. [`tolist()`](#memoryview.tolist)) are
restricted to native single element formats.

#### Versionchanged
Changed in version 3.3: format `'B'` is now handled according to the struct module syntax.
This means that `memoryview(b'abc')[0] == b'abc'[0] == 97`.

#### itemsize

The size in bytes of each element of the memoryview:

```python3
>>> import array, struct
>>> m = memoryview(array.array('H', [32000, 32001, 32002]))
>>> m.itemsize
2
>>> m[0]
32000
>>> struct.calcsize('H') == m.itemsize
True
```

#### ndim

An integer indicating how many dimensions of a multi-dimensional array the
memory represents.

#### shape

A tuple of integers the length of [`ndim`](#memoryview.ndim) giving the shape of the
memory as an N-dimensional array.

#### Versionchanged
Changed in version 3.3: An empty tuple instead of `None` when ndim = 0.

#### strides

A tuple of integers the length of [`ndim`](#memoryview.ndim) giving the size in bytes to
access each element for each dimension of the array.

#### Versionchanged
Changed in version 3.3: An empty tuple instead of `None` when ndim = 0.

#### suboffsets

Used internally for PIL-style arrays. The value is informational only.

#### c_contiguous

A bool indicating whether the memory is C-[contiguous](../glossary.md#term-contiguous).

#### Versionadded
Added in version 3.3.

#### f_contiguous

A bool indicating whether the memory is Fortran [contiguous](../glossary.md#term-contiguous).

#### Versionadded
Added in version 3.3.

#### contiguous

A bool indicating whether the memory is [contiguous](../glossary.md#term-contiguous).

#### Versionadded
Added in version 3.3.

For information on the thread safety of [`memoryview`](#memoryview) objects in
the [free-threaded build](../glossary.md#term-free-threaded-build), see [Thread safety for memoryview objects](threadsafety.md#thread-safety-memoryview).

<a id="types-set"></a>

## Set Types — [`set`](#set), [`frozenset`](#frozenset)

<a id="index-52"></a>

A *set* object is an unordered collection of distinct [hashable](../glossary.md#term-hashable) objects.
Common uses include membership testing, removing duplicates from a sequence, and
computing mathematical operations such as intersection, union, difference, and
symmetric difference.
(For other containers see the built-in [`dict`](#dict), [`list`](#list),
and [`tuple`](#tuple) classes, and the [`collections`](collections.md#module-collections) module.)

Like other collections, sets support `x in set`, `len(set)`, and `for x in
set`.  Being an unordered collection, sets do not record element position or
order of insertion.  Accordingly, sets do not support indexing, slicing, or
other sequence-like behavior.

There are currently two built-in set types, [`set`](#set) and [`frozenset`](#frozenset).
The [`set`](#set) type is mutable — the contents can be changed using methods
like [`add()`](#set.add) and [`remove()`](#set.remove).
Since it is mutable, it has no hash value and cannot be used as
either a dictionary key or as an element of another set.
The [`frozenset`](#frozenset) type is immutable and [hashable](../glossary.md#term-hashable) —
its contents cannot be altered after it is created;
it can therefore be used as a dictionary key or as an element of another set.

Non-empty sets (not frozensets) can be created by placing a comma-separated list
of elements within braces, for example: `{'jack', 'sjoerd'}`, in addition to the
[`set`](#set) constructor.

The constructors for both classes work the same:

### *class* set(iterable=(),)

### *class* frozenset(iterable=(),)

Return a new set or frozenset object whose elements are taken from
*iterable*.  The elements of a set must be [hashable](../glossary.md#term-hashable).  To
represent sets of sets, the inner sets must be [`frozenset`](#frozenset)
objects.  If *iterable* is not specified, a new empty set is
returned.

Sets can be created by several means:

* Use a comma-separated list of elements within braces: `{'jack', 'sjoerd'}`
* Use a set comprehension: `{c for c in 'abracadabra' if c not in 'abc'}`
* Use the type constructor: `set()`, `set('foobar')`, `set(['a', 'b', 'foo'])`

Instances of [`set`](#set) and [`frozenset`](#frozenset) provide the following
operations:

### len(s)

Return the number of elements in set *s* (cardinality of *s*).

### x in s

Test *x* for membership in *s*.

### x not in s

Test *x* for non-membership in *s*.

#### frozenset.isdisjoint(other,)

#### set.isdisjoint(other,)

Return `True` if the set has no elements in common with *other*.  Sets are
disjoint if and only if their intersection is the empty set.

#### frozenset.issubset(other,)

#### set.issubset(other,)

### set <= other

Test whether every element in the set is in *other*.

### set < other

Test whether the set is a proper subset of *other*, that is,
`set <= other and set != other`.

#### frozenset.issuperset(other,)

#### set.issuperset(other,)

### set >= other

Test whether every element in *other* is in the set.

### set > other

Test whether the set is a proper superset of *other*, that is, `set >=
other and set != other`.

#### frozenset.union(\*others)

#### set.union(\*others)

### set | other | ...

Return a new set with elements from the set and all others.

#### frozenset.intersection(\*others)

#### set.intersection(\*others)

### set & other & ...

Return a new set with elements common to the set and all others.

#### frozenset.difference(\*others)

#### set.difference(\*others)

### set - other - ...

Return a new set with elements in the set that are not in the others.

#### frozenset.symmetric_difference(other,)

#### set.symmetric_difference(other,)

### set ^ other

Return a new set with elements in either the set or *other* but not both.

#### frozenset.copy()

#### set.copy()

Return a shallow copy of the set.

Note, the non-operator versions of [`union()`](#frozenset.union),
[`intersection()`](#frozenset.intersection), [`difference()`](#frozenset.difference), [`symmetric_difference()`](#frozenset.symmetric_difference), [`issubset()`](#frozenset.issubset), and
[`issuperset()`](#frozenset.issuperset) methods will accept any iterable as an argument.  In
contrast, their operator based counterparts require their arguments to be
sets.  This precludes error-prone constructions like `set('abc') & 'cbs'`
in favor of the more readable `set('abc').intersection('cbs')`.

Both [`set`](#set) and [`frozenset`](#frozenset) support set to set comparisons. Two
sets are equal if and only if every element of each set is contained in the
other (each is a subset of the other). A set is less than another set if and
only if the first set is a proper subset of the second set (is a subset, but
is not equal). A set is greater than another set if and only if the first set
is a proper superset of the second set (is a superset, but is not equal).

Instances of [`set`](#set) are compared to instances of [`frozenset`](#frozenset)
based on their members.  For example, `set('abc') == frozenset('abc')`
returns `True` and so does `set('abc') in set([frozenset('abc')])`.

The subset and equality comparisons do not generalize to a total ordering
function.  For example, any two nonempty disjoint sets are not equal and are not
subsets of each other, so *all* of the following return `False`: `a<b`,
`a==b`, or `a>b`.

Since sets only define partial ordering (subset relationships), the output of
the [`list.sort()`](#list.sort) method is undefined for lists of sets.

Set elements, like dictionary keys, must be [hashable](../glossary.md#term-hashable).

Binary operations that mix [`set`](#set) instances with [`frozenset`](#frozenset)
return the type of the first operand.  For example: `frozenset('ab') |
set('bc')` returns an instance of [`frozenset`](#frozenset).

The following table lists operations available for [`set`](#set) that do not
apply to immutable instances of [`frozenset`](#frozenset):

#### set.update(\*others)

### set |= other | ...

Update the set, adding elements from all others.

#### set.intersection_update(\*others)

### set &= other & ...

Update the set, keeping only elements found in it and all others.

#### set.difference_update(\*others)

### set -= other | ...

Update the set, removing elements found in others.

#### set.symmetric_difference_update(other,)

### set ^= other

Update the set, keeping only elements found in either set, but not in both.

#### set.add(elem,)

Add element *elem* to the set.

#### set.remove(elem,)

Remove element *elem* from the set.  Raises [`KeyError`](exceptions.md#KeyError) if *elem* is
not contained in the set.

#### set.discard(elem,)

Remove element *elem* from the set if it is present.

#### set.pop()

Remove and return an arbitrary element from the set.  Raises
[`KeyError`](exceptions.md#KeyError) if the set is empty.

#### set.clear()

Remove all elements from the set.

Note, the non-operator versions of the [`update()`](#set.update),
[`intersection_update()`](#set.intersection_update), [`difference_update()`](#set.difference_update), and
[`symmetric_difference_update()`](#set.symmetric_difference_update) methods will accept any iterable as an
argument.

Note, the *elem* argument to the [`__contains__()`](../reference/datamodel.md#object.__contains__),
[`remove()`](#set.remove), and
[`discard()`](#set.discard) methods may be a set.  To support searching for an equivalent
frozenset, a temporary one is created from *elem*.

#### SEE ALSO
For detailed information on thread-safety guarantees for [`set`](#set)
objects, see [Thread safety for set objects](threadsafety.md#thread-safety-set).

<a id="typesmapping"></a>

## Mapping types — `dict`, `frozendict`

<a id="index-53"></a>

A [mapping](../glossary.md#term-mapping) object maps [hashable](../glossary.md#term-hashable) values to arbitrary objects.
There are currently two standard mapping types, the *dictionary* and
[`frozendict`](#frozendict).
(For other containers see the built-in
[`list`](#list), [`set`](#set), and [`tuple`](#tuple) classes, and the
[`collections`](collections.md#module-collections) module.)

A dictionary’s keys are *almost* arbitrary values.  Values that are not
[hashable](../glossary.md#term-hashable), that is, values containing lists, dictionaries or other
mutable types (that are compared by value rather than by object identity) may
not be used as keys.
Values that compare equal (such as `1`, `1.0`, and `True`)
can be used interchangeably to index the same dictionary entry.

### *class* dict(\*\*kwargs)

### *class* dict(mapping, , \*\*kwargs)

### *class* dict(iterable, , \*\*kwargs)

Return a new dictionary initialized from an optional positional argument
and a possibly empty set of keyword arguments.

Dictionaries can be created by several means:

* Use a comma-separated list of `key: value` pairs within braces:
  `{'jack': 4098, 'sjoerd': 4127}` or `{4098: 'jack', 4127: 'sjoerd'}`
* Use a dict comprehension: `{}`, `{x: x ** 2 for x in range(10)}`
* Use the type constructor: `dict()`,
  `dict([('foo', 100), ('bar', 200)])`, `dict(foo=100, bar=200)`

If no positional argument is given, an empty dictionary is created.
If a positional argument is given and it defines a `keys()` method, a
dictionary is created by calling [`__getitem__()`](../reference/datamodel.md#object.__getitem__) on the argument with
each returned key from the method.  Otherwise, the positional argument must be an
[iterable](../glossary.md#term-iterable) object.  Each item in the iterable must itself be an iterable
with exactly two elements.  The first element of each item becomes a key in the
new dictionary, and the second element the corresponding value.  If a key occurs
more than once, the last value for that key becomes the corresponding value in
the new dictionary.

If keyword arguments are given, the keyword arguments and their values are
added to the dictionary created from the positional argument.  If a key
being added is already present, the value from the keyword argument
replaces the value from the positional argument.

Dictionaries compare equal if and only if they have the same `(key,
value)` pairs (regardless of ordering). Order comparisons (‘<’, ‘<=’, ‘>=’, ‘>’) raise
[`TypeError`](exceptions.md#TypeError).  To illustrate dictionary creation and equality,
the following examples all return a dictionary equal to
`{"one": 1, "two": 2, "three": 3}`:

```python3
>>> a = dict(one=1, two=2, three=3)
>>> b = {'one': 1, 'two': 2, 'three': 3}
>>> c = dict(zip(['one', 'two', 'three'], [1, 2, 3]))
>>> d = dict([('two', 2), ('one', 1), ('three', 3)])
>>> e = dict({'three': 3, 'one': 1, 'two': 2})
>>> f = dict({'one': 1, 'three': 3}, two=2)
>>> a == b == c == d == e == f
True
```

Providing keyword arguments as in the first example only works for keys that
are valid Python identifiers.  Otherwise, any valid keys can be used.

Dictionaries preserve insertion order.  Note that updating a key does not
affect the order.  Keys added after deletion are inserted at the end.

```python3
>>> d = {"one": 1, "two": 2, "three": 3, "four": 4}
>>> d
{'one': 1, 'two': 2, 'three': 3, 'four': 4}
>>> list(d)
['one', 'two', 'three', 'four']
>>> list(d.values())
[1, 2, 3, 4]
>>> d["one"] = 42
>>> d
{'one': 42, 'two': 2, 'three': 3, 'four': 4}
>>> del d["two"]
>>> d["two"] = None
>>> d
{'one': 42, 'three': 3, 'four': 4, 'two': None}
```

#### Versionchanged
Changed in version 3.7: Dictionary order is guaranteed to be insertion order.  This behavior was
an implementation detail of CPython from 3.6.

These are the operations that dictionaries support (and therefore, custom
mapping types should support too):

### list(d)

Return a list of all the keys used in the dictionary *d*.

### len(d)

Return the number of items in the dictionary *d*.

### d[key]

Return the item of *d* with key *key*.  Raises a [`KeyError`](exceptions.md#KeyError) if *key* is
not in the map.

<a id="index-54"></a>

If a subclass of dict defines a method [`__missing__()`](../reference/datamodel.md#object.__missing__) and *key*
is not present, the `d[key]` operation calls that method with the key *key*
as argument.  The `d[key]` operation then returns or raises whatever is
returned or raised by the `__missing__(key)` call.
No other operations or methods invoke [`__missing__()`](../reference/datamodel.md#object.__missing__). If
[`__missing__()`](../reference/datamodel.md#object.__missing__) is not defined, [`KeyError`](exceptions.md#KeyError) is raised.
[`__missing__()`](../reference/datamodel.md#object.__missing__) must be a method; it cannot be an instance variable:

```python3
>>> class Counter(dict):
...     def __missing__(self, key):
...         return 0
...
>>> c = Counter()
>>> c['red']
0
>>> c['red'] += 1
>>> c['red']
1
```

The example above shows part of the implementation of
[`collections.Counter`](collections.md#collections.Counter).
A different `__missing__()` method is used
by [`collections.defaultdict`](collections.md#collections.defaultdict).

### d[key] = value

Set `d[key]` to *value*.

### del d[key]

Remove `d[key]` from *d*.  Raises a [`KeyError`](exceptions.md#KeyError) if *key* is not in the
map.

### key in d

Return `True` if *d* has a key *key*, else `False`.

### key not in d

Equivalent to `not key in d`.

### iter(d)

Return an iterator over the keys of the dictionary.  This is a shortcut
for `iter(d.keys())`.

#### clear()

Remove all items from the dictionary.

#### copy()

Return a shallow copy of the dictionary.

#### *classmethod* fromkeys(iterable, value=None,)

Create a new dictionary with keys from *iterable* and values set to *value*.

[`fromkeys()`](#dict.fromkeys) is a class method that returns a new dictionary. *value*
defaults to `None`.  All of the values refer to just a single instance,
so it generally doesn’t make sense for *value* to be a mutable object
such as an empty list.  To get distinct values, use a [dict
comprehension](../reference/expressions.md#dict) instead.

#### get(key, default=None,)

Return the value for *key* if *key* is in the dictionary, else *default*.
If *default* is not given, it defaults to `None`, so that this method
never raises a [`KeyError`](exceptions.md#KeyError).

#### items()

Return a new view of the dictionary’s items (`(key, value)` pairs).
See the [documentation of view objects](#dict-views).

#### keys()

Return a new view of the dictionary’s keys.  See the [documentation
of view objects](#dict-views).

#### pop(key,)

#### pop(key, default,)

If *key* is in the dictionary, remove it and return its value, else return
*default*.  If *default* is not given and *key* is not in the dictionary,
a [`KeyError`](exceptions.md#KeyError) is raised.

#### popitem()

Remove and return a `(key, value)` pair from the dictionary.
Pairs are returned in  order.

[`popitem()`](#dict.popitem) is useful to destructively iterate over a dictionary, as
often used in set algorithms.  If the dictionary is empty, calling
[`popitem()`](#dict.popitem) raises a [`KeyError`](exceptions.md#KeyError).

#### Versionchanged
Changed in version 3.7: LIFO order is now guaranteed. In prior versions, [`popitem()`](#dict.popitem) would
return an arbitrary key/value pair.

### reversed(d)

Return a reverse iterator over the keys of the dictionary. This is a
shortcut for `reversed(d.keys())`.

#### Versionadded
Added in version 3.8.

#### setdefault(key, default=None,)

If *key* is in the dictionary, return its value.  If not, insert *key*
with a value of *default* and return *default*.  *default* defaults to
`None`.

#### update(\*\*kwargs)

#### update(mapping, , \*\*kwargs)

#### update(iterable, , \*\*kwargs)

Update the dictionary with the key/value pairs from *mapping* or *iterable* and *kwargs*, overwriting
existing keys.  Return `None`.

[`update()`](#dict.update) accepts either another object with a `keys()` method (in
which case [`__getitem__()`](../reference/datamodel.md#object.__getitem__) is called with every key returned from
the method) or an iterable of key/value pairs (as tuples or other iterables
of length two). If keyword arguments are specified, the dictionary is then
updated with those key/value pairs: `d.update(red=1, blue=2)`.

#### values()

Return a new view of the dictionary’s values.  See the
[documentation of view objects](#dict-views).

An equality comparison between one `dict.values()` view and another
will always return `False`. This also applies when comparing
`dict.values()` to itself:

```python3
>>> d = {'a': 1}
>>> d.values() == d.values()
False
```

### d | other

Create a new dictionary with the merged keys and values of *d* and
*other*, which must both be dictionaries. The values of *other* take
priority when *d* and *other* share keys.

#### Versionadded
Added in version 3.9.

### d |= other

Update the dictionary *d* with keys and values from *other*, which may be
either a [mapping](../glossary.md#term-mapping) or an [iterable](../glossary.md#term-iterable) of key/value pairs. The
values of *other* take priority when *d* and *other* share keys.

#### Versionadded
Added in version 3.9.

Dictionaries and dictionary views are reversible.

```python3
>>> d = {"one": 1, "two": 2, "three": 3, "four": 4}
>>> d
{'one': 1, 'two': 2, 'three': 3, 'four': 4}
>>> list(reversed(d))
['four', 'three', 'two', 'one']
>>> list(reversed(d.values()))
[4, 3, 2, 1]
>>> list(reversed(d.items()))
[('four', 4), ('three', 3), ('two', 2), ('one', 1)]
```

#### Versionchanged
Changed in version 3.8: Dictionaries are now reversible.

#### SEE ALSO
[`frozendict`](#frozendict) and [`types.MappingProxyType`](types.md#types.MappingProxyType) can be used to
create a read-only view of a [`dict`](#dict).

#### SEE ALSO
For detailed information on thread-safety guarantees for [`dict`](#dict)
objects, see [Thread safety for dict objects](threadsafety.md#thread-safety-dict).

<a id="dict-views"></a>

### Dictionary view objects

The objects returned by [`dict.keys()`](#dict.keys), [`dict.values()`](#dict.values) and
[`dict.items()`](#dict.items) are *view objects*.  They provide a dynamic view on the
dictionary’s entries, which means that when the dictionary changes, the view
reflects these changes.

Dictionary views can be iterated over to yield their respective data, and
support membership tests:

### len(dictview)

Return the number of entries in the dictionary.

### iter(dictview)

Return an iterator over the keys, values or items (represented as tuples of
`(key, value)`) in the dictionary.

Keys and values are iterated over in insertion order.
This allows the creation of `(value, key)` pairs
using [`zip()`](functions.md#zip): `pairs = zip(d.values(), d.keys())`.  Another way to
create the same list is `pairs = [(v, k) for (k, v) in d.items()]`.

Iterating views while adding or deleting entries in the dictionary may raise
a [`RuntimeError`](exceptions.md#RuntimeError) or fail to iterate over all entries.

#### Versionchanged
Changed in version 3.7: Dictionary order is guaranteed to be insertion order.

### x in dictview

Return `True` if *x* is in the underlying dictionary’s keys, values or
items (in the latter case, *x* should be a `(key, value)` tuple).

### reversed(dictview)

Return a reverse iterator over the keys, values or items of the dictionary.
The view will be iterated in reverse order of the insertion.

#### Versionchanged
Changed in version 3.8: Dictionary views are now reversible.

### dictview.mapping

Return a [`types.MappingProxyType`](types.md#types.MappingProxyType) that wraps the original
dictionary to which the view refers.

#### Versionadded
Added in version 3.10.

Keys views are set-like since their entries are unique and [hashable](../glossary.md#term-hashable).
Items views also have set-like operations since the (key, value) pairs
are unique and the keys are hashable.
If all values in an items view are hashable as well,
then the items view can interoperate with other sets.
(Values views are not treated as set-like
since the entries are generally not unique.)  For set-like views, all of the
operations defined for the abstract base class [`collections.abc.Set`](collections.abc.md#collections.abc.Set) are
available (for example, `==`, `<`, or `^`).  While using set operators,
set-like views accept any iterable as the other operand,
unlike sets which only accept sets as the input.

An example of dictionary view usage:

```python3
>>> dishes = {'eggs': 2, 'sausage': 1, 'bacon': 1, 'spam': 500}
>>> keys = dishes.keys()
>>> values = dishes.values()

>>> # iteration
>>> n = 0
>>> for val in values:
...     n += val
...
>>> print(n)
504

>>> # keys and values are iterated over in the same order (insertion order)
>>> list(keys)
['eggs', 'sausage', 'bacon', 'spam']
>>> list(values)
[2, 1, 1, 500]

>>> # view objects are dynamic and reflect dict changes
>>> del dishes['eggs']
>>> del dishes['sausage']
>>> list(keys)
['bacon', 'spam']

>>> # set operations
>>> keys & {'eggs', 'bacon', 'salad'}
{'bacon'}
>>> keys ^ {'sausage', 'juice'} == {'juice', 'sausage', 'bacon', 'spam'}
True
>>> keys | ['juice', 'juice', 'juice'] == {'bacon', 'spam', 'juice'}
True

>>> # get back a read-only proxy for the original dictionary
>>> values.mapping
mappingproxy({'bacon': 1, 'spam': 500})
>>> values.mapping['spam']
500
```

### Frozen dictionaries

### *class* frozendict(\*\*kwargs)

### *class* frozendict(mapping, , \*\*kwargs)

### *class* frozendict(iterable, , \*\*kwargs)

Return a new frozen dictionary initialized from an optional positional
argument and a possibly empty set of keyword arguments.

A `frozendict` has a similar API to the [`dict`](#dict) API, with the
following differences:

* `dict` has more methods than `frozendict`:
  > * `__delitem__()`
  > * `__setitem__()`
  > * [`clear()`](#dict.clear)
  > * [`pop()`](#dict.pop)
  > * [`popitem()`](#dict.popitem)
  > * [`setdefault()`](#dict.setdefault)
  > * [`update()`](#dict.update)
* A `frozendict` can be hashed with `hash(frozendict)` if all keys and
  values can be hashed.
* `frozendict |= other` does not modify the `frozendict` in-place but
  creates a new frozen dictionary.

`frozendict` is not a `dict` subclass but inherits directly
from `object`.

#### Versionadded
Added in version 3.15.

<a id="typecontextmanager"></a>

## Context Manager Types

<a id="index-55"></a>

Python’s [`with`](../reference/compound_stmts.md#with) statement supports the concept of a runtime context
defined by a context manager.  This is implemented using a pair of methods
that allow user-defined classes to define a runtime context that is entered
before the statement body is executed and exited when the statement ends:

#### contextmanager.\_\_enter_\_()

Enter the runtime context and return either this object or another object
related to the runtime context. The value returned by this method is bound to
the identifier in the `as` clause of [`with`](../reference/compound_stmts.md#with) statements using
this context manager.

An example of a context manager that returns itself is a [file object](../glossary.md#term-file-object).
File objects return themselves from \_\_enter_\_() to allow [`open()`](functions.md#open) to be
used as the context expression in a [`with`](../reference/compound_stmts.md#with) statement.

An example of a context manager that returns a related object is the one
returned by [`decimal.localcontext()`](decimal.md#decimal.localcontext). These managers set the active
decimal context to a copy of the original decimal context and then return the
copy. This allows changes to be made to the current decimal context in the body
of the [`with`](../reference/compound_stmts.md#with) statement without affecting code outside the
`with` statement.

#### contextmanager.\_\_exit_\_(exc_type, exc_val, exc_tb)

Exit the runtime context and return a Boolean flag indicating if any exception
that occurred should be suppressed. If an exception occurred while executing the
body of the [`with`](../reference/compound_stmts.md#with) statement, the arguments contain the exception type,
value and traceback information. Otherwise, all three arguments are `None`.

Returning a true value from this method will cause the [`with`](../reference/compound_stmts.md#with) statement
to suppress the exception and continue execution with the statement immediately
following the `with` statement. Otherwise the exception continues
propagating after this method has finished executing.

If this method raises an exception while handling an earlier exception from the
[`with`](../reference/compound_stmts.md#with) block, the new exception is raised, and the original exception
is stored in its [`__context__`](exceptions.md#BaseException.__context__) attribute.

The exception passed in should never be reraised explicitly - instead, this
method should return a false value to indicate that the method completed
successfully and does not want to suppress the raised exception. This allows
context management code to easily detect whether or not an [`__exit__()`](../reference/datamodel.md#object.__exit__)
method has actually failed.

Python defines several context managers to support easy thread synchronisation,
prompt closure of files or other objects, and simpler manipulation of the active
decimal arithmetic context. The specific types are not treated specially beyond
their implementation of the context management protocol. See the
[`contextlib`](contextlib.md#module-contextlib) module for some examples.

Python’s [generator](../glossary.md#term-generator)s and the [`contextlib.contextmanager`](contextlib.md#contextlib.contextmanager) decorator
provide a convenient way to implement these protocols.  If a generator function is
decorated with the [`contextlib.contextmanager`](contextlib.md#contextlib.contextmanager) decorator, it will return a
context manager implementing the necessary [`__enter__()`](#contextmanager.__enter__) and
[`__exit__()`](#contextmanager.__exit__) methods, rather than the iterator produced by an
undecorated generator function.

Note that there is no specific slot for any of these methods in the type
structure for Python objects in the Python/C API. Extension types wanting to
define these methods must provide them as a normal Python accessible method.
Compared to the overhead of setting up the runtime context, the overhead of a
single class dictionary lookup is negligible.

## Type Annotation Types — [Generic Alias](#types-genericalias), [Union](#types-union)

<a id="index-56"></a>

The core built-in types for [type annotations](../glossary.md#term-annotation) are
[Generic Alias](#types-genericalias) and [Union](#types-union).

<a id="types-genericalias"></a>

### Generic Alias Type

<a id="index-57"></a>

`GenericAlias` objects are generally created by
[subscripting](../reference/expressions.md#subscriptions) a class. They are most often used with
[container classes](../reference/datamodel.md#sequence-types), such as [`list`](#list) or
[`dict`](#dict). For example, `list[int]` is a `GenericAlias` object created
by subscripting the `list` class with the argument [`int`](functions.md#int).
`GenericAlias` objects are intended primarily for use with
[type annotations](../glossary.md#term-annotation).

#### NOTE
It is generally only possible to subscript a class if the class implements
the special method [`__class_getitem__()`](../reference/datamodel.md#object.__class_getitem__).

A `GenericAlias` object acts as a proxy for a [generic type](../glossary.md#term-generic-type),
implementing *parameterized generics*.

For a container class, the
argument(s) supplied to a [subscription](../reference/expressions.md#subscriptions) of the class may
indicate the type(s) of the elements an object contains. For example,
`set[bytes]` can be used in type annotations to signify a [`set`](#set) in
which all the elements are of type [`bytes`](#bytes).

For a class which defines [`__class_getitem__()`](../reference/datamodel.md#object.__class_getitem__) but is not a
container, the argument(s) supplied to a subscription of the class will often
indicate the return type(s) of one or more methods defined on an object. For
example, [`regular expressions`](re.md#module-re) can be used on both the [`str`](#str) data
type and the [`bytes`](#bytes) data type:

* If `x = re.search('foo', 'foo')`, `x` will be a
  [re.Match](re.md#match-objects) object where the return values of
  `x.group(0)` and `x[0]` will both be of type [`str`](#str). We can
  represent this kind of object in type annotations with the `GenericAlias`
  `re.Match[str]`.
* If `y = re.search(b'bar', b'bar')`, (note the `b` for [`bytes`](#bytes)),
  `y` will also be an instance of `re.Match`, but the return
  values of `y.group(0)` and `y[0]` will both be of type
  [`bytes`](#bytes). In type annotations, we would represent this
  variety of [re.Match](re.md#match-objects) objects with `re.Match[bytes]`.

`GenericAlias` objects are instances of the class
[`types.GenericAlias`](types.md#types.GenericAlias), which can also be used to create `GenericAlias`
objects directly.

### T[X, Y, ...]

Creates a `GenericAlias` representing a type `T` parameterized by types
*X*, *Y*, and more depending on the `T` used.
For example, a function expecting a [`list`](#list) containing
[`float`](functions.md#float) elements:

```python3
def average(values: list[float]) -> float:
    return sum(values) / len(values)
```

Another example for [mapping](../glossary.md#term-mapping) objects, using a [`dict`](#dict), which
is a generic type expecting two type parameters representing the key type
and the value type.  In this example, the function expects a `dict` with
keys of type [`str`](#str) and values of type [`int`](functions.md#int):

```python3
def send_post_request(url: str, body: dict[str, int]) -> None:
    ...
```

The builtin functions [`isinstance()`](functions.md#isinstance) and [`issubclass()`](functions.md#issubclass) do not accept
`GenericAlias` types for their second argument:

```python3
>>> isinstance([1, 2], list[str])
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: isinstance() argument 2 cannot be a parameterized generic
```

The Python runtime does not enforce [type annotations](../glossary.md#term-annotation).
This extends to generic types and their type parameters. When creating
a container object from a `GenericAlias`, the elements in the container are not checked
against their type. For example, the following code is discouraged, but will
run without errors:

```python3
>>> t = list[str]
>>> t([1, 2, 3])
[1, 2, 3]
```

Furthermore, parameterized generics erase type parameters during object
creation:

```python3
>>> t = list[str]
>>> type(t)
<class 'types.GenericAlias'>

>>> l = t()
>>> type(l)
<class 'list'>
```

Calling [`repr()`](functions.md#repr) or [`str()`](#str) on a generic shows the parameterized type:

```python3
>>> repr(list[int])
'list[int]'

>>> str(list[int])
'list[int]'
```

The [`__getitem__()`](../reference/datamodel.md#object.__getitem__) method of generic containers will raise an
exception to disallow mistakes like `dict[str][str]`:

```python3
>>> dict[str][str]
Traceback (most recent call last):
  ...
TypeError: dict[str] is not a generic class
```

However, such expressions are valid when [type variables](typing.md#generics) are
used.  The index must have as many elements as there are type variable items
in the `GenericAlias` object’s [`__args__`](#genericalias.__args__).

```python3
>>> from typing import TypeVar
>>> Y = TypeVar('Y')
>>> dict[str, Y][int]
dict[str, int]
```

#### Standard Generic Classes

The following standard library classes support parameterized generics. This
list is non-exhaustive.

* [`tuple`](#tuple)
* [`list`](#list)
* [`dict`](#dict)
* [`set`](#set)
* [`frozendict`](#frozendict)
* [`frozenset`](#frozenset)
* [`type`](functions.md#type)
* [`asyncio.Future`](asyncio-future.md#asyncio.Future)
* [`asyncio.Task`](asyncio-task.md#asyncio.Task)
* [`collections.deque`](collections.md#collections.deque)
* [`collections.defaultdict`](collections.md#collections.defaultdict)
* [`collections.OrderedDict`](collections.md#collections.OrderedDict)
* [`collections.Counter`](collections.md#collections.Counter)
* [`collections.ChainMap`](collections.md#collections.ChainMap)
* [`collections.abc.Awaitable`](collections.abc.md#collections.abc.Awaitable)
* [`collections.abc.Coroutine`](collections.abc.md#collections.abc.Coroutine)
* [`collections.abc.AsyncIterable`](collections.abc.md#collections.abc.AsyncIterable)
* [`collections.abc.AsyncIterator`](collections.abc.md#collections.abc.AsyncIterator)
* [`collections.abc.AsyncGenerator`](collections.abc.md#collections.abc.AsyncGenerator)
* [`collections.abc.Iterable`](collections.abc.md#collections.abc.Iterable)
* [`collections.abc.Iterator`](collections.abc.md#collections.abc.Iterator)
* [`collections.abc.Generator`](collections.abc.md#collections.abc.Generator)
* [`collections.abc.Reversible`](collections.abc.md#collections.abc.Reversible)
* [`collections.abc.Container`](collections.abc.md#collections.abc.Container)
* [`collections.abc.Collection`](collections.abc.md#collections.abc.Collection)
* [`collections.abc.Callable`](collections.abc.md#collections.abc.Callable)
* [`collections.abc.Set`](collections.abc.md#collections.abc.Set)
* [`collections.abc.MutableSet`](collections.abc.md#collections.abc.MutableSet)
* [`collections.abc.Mapping`](collections.abc.md#collections.abc.Mapping)
* [`collections.abc.MutableMapping`](collections.abc.md#collections.abc.MutableMapping)
* [`collections.abc.Sequence`](collections.abc.md#collections.abc.Sequence)
* [`collections.abc.MutableSequence`](collections.abc.md#collections.abc.MutableSequence)
* [`collections.abc.ByteString`](collections.abc.md#collections.abc.ByteString)
* [`collections.abc.MappingView`](collections.abc.md#collections.abc.MappingView)
* [`collections.abc.KeysView`](collections.abc.md#collections.abc.KeysView)
* [`collections.abc.ItemsView`](collections.abc.md#collections.abc.ItemsView)
* [`collections.abc.ValuesView`](collections.abc.md#collections.abc.ValuesView)
* [`contextlib.AbstractContextManager`](contextlib.md#contextlib.AbstractContextManager)
* [`contextlib.AbstractAsyncContextManager`](contextlib.md#contextlib.AbstractAsyncContextManager)
* [`dataclasses.Field`](dataclasses.md#dataclasses.Field)
* [`functools.cached_property`](functools.md#functools.cached_property)
* [`functools.partialmethod`](functools.md#functools.partialmethod)
* [`os.PathLike`](os.md#os.PathLike)
* [`queue.LifoQueue`](queue.md#queue.LifoQueue)
* [`queue.Queue`](queue.md#queue.Queue)
* [`queue.PriorityQueue`](queue.md#queue.PriorityQueue)
* [`queue.SimpleQueue`](queue.md#queue.SimpleQueue)
* [re.Pattern](re.md#re-objects)
* [re.Match](re.md#match-objects)
* [`shelve.BsdDbShelf`](shelve.md#shelve.BsdDbShelf)
* [`shelve.DbfilenameShelf`](shelve.md#shelve.DbfilenameShelf)
* [`shelve.Shelf`](shelve.md#shelve.Shelf)
* [`types.MappingProxyType`](types.md#types.MappingProxyType)
* [`weakref.WeakKeyDictionary`](weakref.md#weakref.WeakKeyDictionary)
* [`weakref.WeakMethod`](weakref.md#weakref.WeakMethod)
* [`weakref.WeakSet`](weakref.md#weakref.WeakSet)
* [`weakref.WeakValueDictionary`](weakref.md#weakref.WeakValueDictionary)

#### Special Attributes of `GenericAlias` objects

All parameterized generics implement special read-only attributes.

#### genericalias.\_\_origin_\_

This attribute points at the non-parameterized generic class:

```python3
>>> list[int].__origin__
<class 'list'>
```

#### genericalias.\_\_args_\_

This attribute is a [`tuple`](#tuple) (possibly of length 1) of generic
types passed to the original [`__class_getitem__()`](../reference/datamodel.md#object.__class_getitem__) of the
generic class:

```python3
>>> dict[str, list[int]].__args__
(<class 'str'>, list[int])
```

#### genericalias.\_\_parameters_\_

This attribute is a lazily computed tuple (possibly empty) of unique type
variables found in `__args__`:

```python3
>>> from typing import TypeVar

>>> T = TypeVar('T')
>>> list[T].__parameters__
(~T,)
```

#### NOTE
A `GenericAlias` object with [`typing.ParamSpec`](typing.md#typing.ParamSpec) parameters may not
have correct `__parameters__` after substitution because
[`typing.ParamSpec`](typing.md#typing.ParamSpec) is intended primarily for static type checking.

#### genericalias.\_\_unpacked_\_

A boolean that is true if the alias has been unpacked using the
`*` operator (see [`TypeVarTuple`](typing.md#typing.TypeVarTuple)).

#### Versionadded
Added in version 3.11.

#### SEE ALSO
[**PEP 484**](https://peps.python.org/pep-0484/) - Type Hints
: Introducing Python’s framework for type annotations.

[**PEP 585**](https://peps.python.org/pep-0585/) - Type Hinting Generics In Standard Collections
: Introducing the ability to natively parameterize standard-library
  classes, provided they implement the special class method
  [`__class_getitem__()`](../reference/datamodel.md#object.__class_getitem__).

[Generics](typing.md#generics), [user-defined generics](typing.md#user-defined-generics) and [`typing.Generic`](typing.md#typing.Generic)
: Documentation on how to implement generic classes that can be
  parameterized at runtime and understood by static type-checkers.

#### Versionadded
Added in version 3.9.

<a id="types-union"></a>

### Union Type

<a id="index-60"></a>

A union object holds the value of the `|` (bitwise or) operation on
multiple [type objects](#bltin-type-objects).  These types are intended
primarily for [type annotations](../glossary.md#term-annotation). The union type expression
enables cleaner type hinting syntax compared to subscripting [`typing.Union`](typing.md#typing.Union).

### X | Y | ...

Defines a union object which holds types *X*, *Y*, and so forth. `X | Y`
means either X or Y.  It is equivalent to `typing.Union[X, Y]`.
For example, the following function expects an argument of type
[`int`](functions.md#int) or [`float`](functions.md#float):

```python3
def square(number: int | float) -> int | float:
    return number ** 2
```

#### NOTE
The `|` operand cannot be used at runtime to define unions where one or
more members is a forward reference. For example, `int | "Foo"`, where
`"Foo"` is a reference to a class not yet defined, will fail at
runtime. For unions which include forward references, present the
whole expression as a string, e.g. `"int | Foo"`.

### union_object == other

Union objects can be tested for equality with other union objects.  Details:

* Unions of unions are flattened:
  ```python3
  (int | str) | float == int | str | float
  ```
* Redundant types are removed:
  ```python3
  int | str | int == int | str
  ```
* When comparing unions, the order is ignored:
  ```python3
  int | str == str | int
  ```
* It creates instances of [`typing.Union`](typing.md#typing.Union):
  ```python3
  int | str == typing.Union[int, str]
  type(int | str) is typing.Union
  ```
* Optional types can be spelled as a union with `None`:
  ```python3
  str | None == typing.Optional[str]
  ```

### isinstance(obj, union_object)

### issubclass(obj, union_object)

Calls to [`isinstance()`](functions.md#isinstance) and [`issubclass()`](functions.md#issubclass) are also supported with a
union object:

```python3
>>> isinstance("", int | str)
True
```

However, [parameterized generics](#types-genericalias) in
union objects cannot be checked:

```python3
>>> isinstance(1, int | list[int])  # short-circuit evaluation
True
>>> isinstance([1], int | list[int])
Traceback (most recent call last):
  ...
TypeError: isinstance() argument 2 cannot be a parameterized generic
```

The user-exposed type for the union object can be accessed from
[`typing.Union`](typing.md#typing.Union) and used for [`isinstance()`](functions.md#isinstance) checks:

```python3
>>> import typing
>>> isinstance(int | str, typing.Union)
True
>>> typing.Union()
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: cannot create 'typing.Union' instances
```

#### NOTE
The `__or__()` method for type objects was added to support the syntax
`X | Y`.  If a metaclass implements `__or__()`, the Union may
override it:

```pycon
>>> class M(type):
...     def __or__(self, other):
...         return "Hello"
...
>>> class C(metaclass=M):
...     pass
...
>>> C | int
'Hello'
>>> int | C
int | C
```

#### SEE ALSO
[**PEP 604**](https://peps.python.org/pep-0604/) – PEP proposing the `X | Y` syntax and the Union type.

#### Versionadded
Added in version 3.10.

#### Versionchanged
Changed in version 3.14: Union objects are now instances of [`typing.Union`](typing.md#typing.Union). Previously, they were instances
of [`types.UnionType`](types.md#types.UnionType), which remains an alias for [`typing.Union`](typing.md#typing.Union).

<a id="typesother"></a>

## Other Built-in Types

The interpreter supports several other kinds of objects. Most of these support
only one or two operations.

<a id="typesmodules"></a>

### Modules

The only special operation on a module is attribute access: `m.name`, where
*m* is a module and *name* accesses a name defined in *m*’s symbol table.
Module attributes can be assigned to.  (Note that the [`import`](../reference/simple_stmts.md#import)
statement is not, strictly speaking, an operation on a module object; `import
foo` does not require a module object named *foo* to exist, rather it requires
an (external) *definition* for a module named *foo* somewhere.)

A special attribute of every module is [`__dict__`](../reference/datamodel.md#object.__dict__). This is the
dictionary containing the module’s symbol table. Modifying this dictionary will
actually change the module’s symbol table, but direct assignment to the
[`__dict__`](../reference/datamodel.md#object.__dict__) attribute is not possible (you can write
`m.__dict__['a'] = 1`, which defines `m.a` to be `1`, but you can’t write
`m.__dict__ = {}`).  Modifying [`__dict__`](../reference/datamodel.md#object.__dict__) directly is
not recommended.

Modules built into the interpreter are written like this: `<module 'sys'
(built-in)>`.  If loaded from a file, they are written as `<module 'os' from
'/usr/local/lib/pythonX.Y/os.pyc'>`.

<a id="typesobjects"></a>

### Classes and Class Instances

See [Objects, values and types](../reference/datamodel.md#objects) and [Class definitions](../reference/compound_stmts.md#class) for these.

<a id="typesfunctions"></a>

### Functions

Function objects are created by function definitions.  The only operation on a
function object is to call it: `func(argument-list)`.

There are really two flavors of function objects: built-in functions and
user-defined functions.  Both support the same operation (to call the function),
but the implementation is different, hence the different object types.

See [Function definitions](../reference/compound_stmts.md#function) for more information.

<a id="typesmethods"></a>

### Methods

<a id="index-62"></a>

Methods are functions that are called using the attribute notation.
There are two flavors: [built-in methods](../reference/datamodel.md#builtin-methods)
(such as [`append()`](#list.append) on lists)
and [class instance method](../reference/datamodel.md#instance-methods).
Built-in methods are described with the types that support them.

If you access a method (a function defined in a class namespace) through an
instance, you get a special object: a *bound method* (also called
[instance method](../reference/datamodel.md#instance-methods)) object. When called, it will add
the `self` argument
to the argument list.  Bound methods have two special read-only attributes:
[`m.__self__`](../reference/datamodel.md#method.__self__) is the object on which the method
operates, and [`m.__func__`](../reference/datamodel.md#method.__func__) is
the function implementing the method.  Calling `m(arg-1, arg-2, ..., arg-n)`
is completely equivalent to calling `m.__func__(m.__self__, arg-1, arg-2, ...,
arg-n)`.

Like [function objects](../reference/datamodel.md#user-defined-funcs), bound method objects support
getting arbitrary
attributes.  However, since method attributes are actually stored on the
underlying function object ([`method.__func__`](../reference/datamodel.md#method.__func__)), setting method attributes on
bound methods is disallowed.  Attempting to set an attribute on a method
results in an [`AttributeError`](exceptions.md#AttributeError) being raised.  In order to set a method
attribute, you need to explicitly set it on the underlying function object:

```pycon
>>> class C:
...     def method(self):
...         pass
...
>>> c = C()
>>> c.method.whoami = 'my name is method'  # can't set on the method
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
AttributeError: 'method' object has no attribute 'whoami'
>>> c.method.__func__.whoami = 'my name is method'
>>> c.method.whoami
'my name is method'
```

See [Instance methods](../reference/datamodel.md#instance-methods) for more information.

<a id="index-63"></a>

<a id="bltin-code-objects"></a>

### Code Objects

<a id="index-64"></a>

Code objects are used by the implementation to represent “pseudo-compiled”
executable Python code such as a function body. They differ from function
objects because they don’t contain a reference to their global execution
environment.  Code objects are returned by the built-in [`compile()`](functions.md#compile) function
and can be extracted from function objects through their
[`__code__`](../reference/datamodel.md#function.__code__) attribute. See also the [`code`](code.md#module-code) module.

Accessing [`__code__`](../reference/datamodel.md#function.__code__) raises an [auditing event](sys.md#auditing)
`object.__getattr__` with arguments `obj` and `"__code__"`.

<a id="index-65"></a>

A code object can be executed or evaluated by passing it (instead of a source
string) to the [`exec()`](functions.md#exec) or [`eval()`](functions.md#eval)  built-in functions.

See [The standard type hierarchy](../reference/datamodel.md#types) for more information.

<a id="bltin-type-objects"></a>

### Type Objects

<a id="index-66"></a>

Type objects represent the various object types.  An object’s type is accessed
by the built-in function [`type()`](functions.md#type).  There are no special operations on
types.  The standard module [`types`](types.md#module-types) defines names for all standard built-in
types.

Types are written like this: `<class 'int'>`.

<a id="bltin-null-object"></a>

### The Null Object

This object is returned by functions that don’t explicitly return a value.  It
supports no special operations.  There is exactly one null object, named
`None` (a built-in name).  `type(None)()` produces the same singleton.

It is written as `None`.

<a id="index-67"></a>

<a id="bltin-ellipsis-object"></a>

### The Ellipsis Object

This object is commonly used to indicate that something is omitted.
It supports no special operations.  There is exactly one ellipsis object, named
[`Ellipsis`](constants.md#Ellipsis) (a built-in name).  `type(Ellipsis)()` produces the
[`Ellipsis`](constants.md#Ellipsis) singleton.

It is written as `Ellipsis` or `...`.

In typical use, `...` as the `Ellipsis` object appears in a few different
places, for instance:

- In type annotations, such as [callable arguments](typing.md#annotating-callables)
  or [tuple elements](typing.md#annotating-tuples).
- As the body of a function instead of a [pass statement](../tutorial/controlflow.md#tut-pass).
- In third-party libraries, such as [Numpy’s slicing and striding](https://numpy.org/doc/stable/user/basics.indexing.html#slicing-and-striding).

Python also uses three dots in ways that are not `Ellipsis` objects, for instance:

- Doctest’s [`ELLIPSIS`](doctest.md#doctest.ELLIPSIS), as a pattern for missing content.
- The default Python prompt of the [interactive](../glossary.md#term-interactive) shell when partial input is incomplete.

Lastly, the Python documentation often uses three dots in conventional English
usage to mean omitted content, even in code examples that also use them as the
`Ellipsis`.

<a id="bltin-notimplemented-object"></a>

### The NotImplemented Object

This object is returned from comparisons and binary operations when they are
asked to operate on types they don’t support. See [Comparisons](../reference/expressions.md#comparisons) for more
information.  There is exactly one [`NotImplemented`](constants.md#NotImplemented) object.
`type(NotImplemented)()` produces the singleton instance.

It is written as `NotImplemented`.

<a id="typesinternal"></a>

### Internal Objects

See [The standard type hierarchy](../reference/datamodel.md#types) for this information.  It describes
[stack frame objects](../reference/datamodel.md#frame-objects),
[traceback objects](../reference/datamodel.md#traceback-objects), and slice objects.

<a id="specialattrs"></a>

## Special Attributes

The implementation adds a few special read-only attributes to several object
types, where they are relevant.  Some of these are not reported by the
[`dir()`](functions.md#dir) built-in function.

#### definition.\_\_name_\_

The name of the class, function, method, descriptor, or
generator instance.

#### definition.\_\_qualname_\_

The [qualified name](../glossary.md#term-qualified-name) of the class, function, method, descriptor,
or generator instance.

#### Versionadded
Added in version 3.3.

#### definition.\_\_module_\_

The name of the module in which a class or function was defined.

#### definition.\_\_doc_\_

The documentation string of a class or function, or `None` if undefined.

#### definition.\_\_type_params_\_

The [type parameters](../reference/compound_stmts.md#type-params) of generic classes, functions,
and [type aliases](typing.md#type-aliases). For classes and functions that
are not generic, this will be an empty tuple.

#### Versionadded
Added in version 3.12.

<a id="int-max-str-digits"></a>

## Integer string conversion length limitation

CPython has a global limit for converting between [`int`](functions.md#int) and [`str`](#str)
to mitigate denial of service attacks. This limit *only* applies to decimal or
other non-power-of-two number bases. Hexadecimal, octal, and binary conversions
are unlimited. The limit can be configured.

The [`int`](functions.md#int) type in CPython is an arbitrary length number stored in binary
form (commonly known as a “bignum”). There exists no algorithm that can convert
a string to a binary integer or a binary integer to a string in linear time,
*unless* the base is a power of 2. Even the best known algorithms for base 10
have sub-quadratic complexity. Converting a large value such as `int('1' *
500_000)` can take over a second on a fast CPU.

Limiting conversion size offers a practical way to avoid [**CVE 2020-10735**](https://www.cve.org/CVERecord?id=CVE-2020-10735).

The limit is applied to the number of digit characters in the input or output
string when a non-linear conversion algorithm would be involved.  Underscores
and the sign are not counted towards the limit.

When an operation would exceed the limit, a [`ValueError`](exceptions.md#ValueError) is raised:

```pycon
>>> import sys
>>> sys.set_int_max_str_digits(4300)  # Illustrative, this is the default.
>>> _ = int('2' * 5432)
Traceback (most recent call last):
...
ValueError: Exceeds the limit (4300 digits) for integer string conversion: value has 5432 digits; use sys.set_int_max_str_digits() to increase the limit
>>> i = int('2' * 4300)
>>> len(str(i))
4300
>>> i_squared = i*i
>>> len(str(i_squared))
Traceback (most recent call last):
...
ValueError: Exceeds the limit (4300 digits) for integer string conversion; use sys.set_int_max_str_digits() to increase the limit
>>> len(hex(i_squared))
7144
>>> assert int(hex(i_squared), base=16) == i*i  # Hexadecimal is unlimited.
```

The default limit is 4300 digits as provided in
[`sys.int_info.default_max_str_digits`](sys.md#sys.int_info).
The lowest limit that can be configured is 640 digits as provided in
[`sys.int_info.str_digits_check_threshold`](sys.md#sys.int_info).

Verification:

```pycon
>>> import sys
>>> assert sys.int_info.default_max_str_digits == 4300, sys.int_info
>>> assert sys.int_info.str_digits_check_threshold == 640, sys.int_info
>>> msg = int('578966293710682886880994035146873798396722250538762761564'
...           '9252925514383915483333812743580549779436104706260696366600'
...           '571186405732').to_bytes(53, 'big')
...
```

#### Versionadded
Added in version 3.11.

### Affected APIs

The limitation only applies to potentially slow conversions between [`int`](functions.md#int)
and [`str`](#str) or [`bytes`](#bytes):

* `int(string)` with default base 10.
* `int(string, base)` for all bases that are not a power of 2.
* `str(integer)`.
* `repr(integer)`.
* any other string conversion to base 10, for example `f"{integer}"`,
  `"{}".format(integer)`, or `b"%d" % integer`.

The limitations do not apply to functions with a linear algorithm:

* `int(string, base)` with base 2, 4, 8, 16, or 32.
* [`int.from_bytes()`](#int.from_bytes) and [`int.to_bytes()`](#int.to_bytes).
* [`hex()`](functions.md#hex), [`oct()`](functions.md#oct), [`bin()`](functions.md#bin).
* [Format specification mini-language](string.md#formatspec) for hex, octal, and binary numbers.
* [`str`](#str) to [`float`](functions.md#float).
* [`str`](#str) to [`decimal.Decimal`](decimal.md#decimal.Decimal).

### Configuring the limit

Before Python starts up you can use an environment variable or an interpreter
command line flag to configure the limit:

* [`PYTHONINTMAXSTRDIGITS`](../using/cmdline.md#envvar-PYTHONINTMAXSTRDIGITS), e.g.
  `PYTHONINTMAXSTRDIGITS=640 python3` to set the limit to 640 or
  `PYTHONINTMAXSTRDIGITS=0 python3` to disable the limitation.
* [`-X int_max_str_digits`](../using/cmdline.md#cmdoption-X), e.g.
  `python3 -X int_max_str_digits=640`
* [`sys.flags.int_max_str_digits`](sys.md#sys.flags.int_max_str_digits) contains the value of
  [`PYTHONINTMAXSTRDIGITS`](../using/cmdline.md#envvar-PYTHONINTMAXSTRDIGITS) or [`-X int_max_str_digits`](../using/cmdline.md#cmdoption-X).
  If both the env var and the `-X` option are set, the `-X` option takes
  precedence. A value of  *-1* indicates that both were unset, thus a value of
  [`sys.int_info.default_max_str_digits`](sys.md#sys.int_info.default_max_str_digits) was used during initialization.

From code, you can inspect the current limit and set a new one using these
[`sys`](sys.md#module-sys) APIs:

* [`sys.get_int_max_str_digits()`](sys.md#sys.get_int_max_str_digits) and [`sys.set_int_max_str_digits()`](sys.md#sys.set_int_max_str_digits) are
  a getter and setter for the interpreter-wide limit. Subinterpreters have
  their own limit.

Information about the default and minimum can be found in [`sys.int_info`](sys.md#sys.int_info):

* [`sys.int_info.default_max_str_digits`](sys.md#sys.int_info) is the compiled-in
  default limit.
* [`sys.int_info.str_digits_check_threshold`](sys.md#sys.int_info) is the lowest
  accepted value for the limit (other than 0 which disables it).

#### Versionadded
Added in version 3.11.

### Recommended configuration

The default [`sys.int_info.default_max_str_digits`](sys.md#sys.int_info.default_max_str_digits) is expected to be
reasonable for most applications. If your application requires a different
limit, set it from your main entry point using Python version agnostic code as
these APIs were added in security patch releases in versions before 3.12.

Example:

```python3
>>> import sys
>>> if hasattr(sys, "set_int_max_str_digits"):
...     upper_bound = 68000
...     lower_bound = 4004
...     current_limit = sys.get_int_max_str_digits()
...     if current_limit == 0 or current_limit > upper_bound:
...         sys.set_int_max_str_digits(upper_bound)
...     elif current_limit < lower_bound:
...         sys.set_int_max_str_digits(lower_bound)
```

If you need to disable it entirely, set it to `0`.

### Footnotes

* <a id='id12'>**[1]**</a> Additional information on these special methods may be found in the Python Reference Manual ([Basic customization](../reference/datamodel.md#customization)).
* <a id='id13'>**[2]**</a> As a consequence, the list `[1, 2]` is considered equal to `[1.0, 2.0]`, and similarly for tuples.
* <a id='id14'>**[3]**</a> They must have since the parser can’t tell the type of the operands.
* <a id='id15'>**[4]**</a> Cased characters are those with general category property being one of “Lu” (Letter, uppercase), “Ll” (Letter, lowercase), or “Lt” (Letter, titlecase).
* <a id='id16'>**[5]**</a> To format only a tuple you should therefore provide a singleton tuple whose only element is the tuple to be formatted.
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
