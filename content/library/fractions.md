# `fractions` — Rational numbers

**Source code:** [Lib/fractions.py](https://github.com/python/cpython/tree/main/Lib/fractions.py)

---

The `fractions` module provides support for rational number arithmetic.

A Fraction instance can be constructed from a pair of rational numbers, from
a single number, or from a string.

<a id="index-0"></a>

### *class* fractions.Fraction(numerator=0, denominator=1)

### *class* fractions.Fraction(number)

### *class* fractions.Fraction(string)

The first version requires that *numerator* and *denominator* are instances
of [`numbers.Rational`](numbers.md#numbers.Rational) and returns a new [`Fraction`](#fractions.Fraction) instance
with a value equal to `numerator/denominator`.
If *denominator* is zero, it raises a [`ZeroDivisionError`](exceptions.md#ZeroDivisionError).

The second version requires that *number* is an instance of
[`numbers.Rational`](numbers.md#numbers.Rational) or has the `as_integer_ratio()` method
(this includes [`float`](functions.md#float) and [`decimal.Decimal`](decimal.md#decimal.Decimal)).
It returns a [`Fraction`](#fractions.Fraction) instance with exactly the same value.
Assumed, that the `as_integer_ratio()` method returns a pair
of coprime integers and last one is positive.
Note that due to the
usual issues with binary point (see [Floating-Point Arithmetic:  Issues and Limitations](../tutorial/floatingpoint.md#tut-fp-issues)), the
argument to `Fraction(1.1)` is not exactly equal to 11/10, and so
`Fraction(1.1)` does *not* return `Fraction(11, 10)` as one might expect.
(But see the documentation for the [`limit_denominator()`](#fractions.Fraction.limit_denominator) method below.)

The last version of the constructor expects a string.
The usual form for this instance is:

```python3
[sign] numerator ['/' denominator]
```

where the optional `sign` may be either ‘+’ or ‘-’ and
`numerator` and `denominator` (if present) are strings of
decimal digits (underscores may be used to delimit digits as with
integral literals in code).  In addition, any string that represents a finite
value and is accepted by the [`float`](functions.md#float) constructor is also
accepted by the [`Fraction`](#fractions.Fraction) constructor.  In either form the
input string may also have leading and/or trailing whitespace.
Here are some examples:

```python3
>>> from fractions import Fraction
>>> Fraction(16, -10)
Fraction(-8, 5)
>>> Fraction(123)
Fraction(123, 1)
>>> Fraction()
Fraction(0, 1)
>>> Fraction('3/7')
Fraction(3, 7)
>>> Fraction(' -3/7 ')
Fraction(-3, 7)
>>> Fraction('1.414213 \t\n')
Fraction(1414213, 1000000)
>>> Fraction('-.125')
Fraction(-1, 8)
>>> Fraction('7e-6')
Fraction(7, 1000000)
>>> Fraction(2.25)
Fraction(9, 4)
>>> Fraction(1.1)
Fraction(2476979795053773, 2251799813685248)
>>> from decimal import Decimal
>>> Fraction(Decimal('1.1'))
Fraction(11, 10)
```

The [`Fraction`](#fractions.Fraction) class inherits from the abstract base class
[`numbers.Rational`](numbers.md#numbers.Rational), and implements all of the methods and
operations from that class.  [`Fraction`](#fractions.Fraction) instances are [hashable](../glossary.md#term-hashable),
and should be treated as immutable.  In addition,
[`Fraction`](#fractions.Fraction) has the following properties and methods:

#### Versionchanged
Changed in version 3.2: The [`Fraction`](#fractions.Fraction) constructor now accepts [`float`](functions.md#float) and
[`decimal.Decimal`](decimal.md#decimal.Decimal) instances.

#### Versionchanged
Changed in version 3.9: The [`math.gcd()`](math.md#math.gcd) function is now used to normalize the *numerator*
and *denominator*. [`math.gcd()`](math.md#math.gcd) always returns an [`int`](functions.md#int) type.
Previously, the GCD type depended on *numerator* and *denominator*.

#### Versionchanged
Changed in version 3.11: Underscores are now permitted when creating a [`Fraction`](#fractions.Fraction) instance
from a string, following [**PEP 515**](https://peps.python.org/pep-0515/) rules.

#### Versionchanged
Changed in version 3.11: [`Fraction`](#fractions.Fraction) implements `__int__` now to satisfy
`typing.SupportsInt` instance checks.

#### Versionchanged
Changed in version 3.12: Space is allowed around the slash for string inputs: `Fraction('2 / 3')`.

#### Versionchanged
Changed in version 3.12: [`Fraction`](#fractions.Fraction) instances now support float-style formatting, with
presentation types `"e"`, `"E"`, `"f"`, `"F"`, `"g"`, `"G"`
and `"%""`.

#### Versionchanged
Changed in version 3.13: Formatting of [`Fraction`](#fractions.Fraction) instances without a presentation type
now supports fill, alignment, sign handling, minimum width and grouping.

#### Versionchanged
Changed in version 3.14: The [`Fraction`](#fractions.Fraction) constructor now accepts any objects with the
`as_integer_ratio()` method.

#### numerator

Numerator of the Fraction in lowest term.

#### denominator

Denominator of the Fraction in lowest terms.
Guaranteed to be positive.

#### as_integer_ratio()

Return a tuple of two integers, whose ratio is equal
to the original Fraction.  The ratio is in lowest terms
and has a positive denominator.

#### Versionadded
Added in version 3.8.

#### is_integer()

Return `True` if the Fraction is an integer.

#### Versionadded
Added in version 3.12.

#### *classmethod* from_float(f)

Alternative constructor which only accepts instances of
[`float`](functions.md#float) or [`numbers.Integral`](numbers.md#numbers.Integral). Beware that
`Fraction.from_float(0.3)` is not the same value as `Fraction(3, 10)`.

#### NOTE
From Python 3.2 onwards, you can also construct a
[`Fraction`](#fractions.Fraction) instance directly from a [`float`](functions.md#float).

#### *classmethod* from_decimal(dec)

Alternative constructor which only accepts instances of
[`decimal.Decimal`](decimal.md#decimal.Decimal) or [`numbers.Integral`](numbers.md#numbers.Integral).

#### NOTE
From Python 3.2 onwards, you can also construct a
[`Fraction`](#fractions.Fraction) instance directly from a [`decimal.Decimal`](decimal.md#decimal.Decimal)
instance.

#### *classmethod* from_number(number)

Alternative constructor which only accepts instances of
[`numbers.Integral`](numbers.md#numbers.Integral), [`numbers.Rational`](numbers.md#numbers.Rational),
[`float`](functions.md#float) or [`decimal.Decimal`](decimal.md#decimal.Decimal), and objects with
the `as_integer_ratio()` method, but not strings.

#### Versionadded
Added in version 3.14.

#### limit_denominator(max_denominator=1000000)

Finds and returns the closest [`Fraction`](#fractions.Fraction) to `self` that has
denominator at most max_denominator.  This method is useful for finding
rational approximations to a given floating-point number:

```pycon
>>> from fractions import Fraction
>>> Fraction('3.1415926535897932').limit_denominator(1000)
Fraction(355, 113)
```

or for recovering a rational number that’s represented as a float:

```pycon
>>> from math import pi, cos
>>> Fraction(cos(pi/3))
Fraction(4503599627370497, 9007199254740992)
>>> Fraction(cos(pi/3)).limit_denominator()
Fraction(1, 2)
>>> Fraction(1.1).limit_denominator()
Fraction(11, 10)
```

#### \_\_floor_\_()

Returns the greatest [`int`](functions.md#int) `<= self`.  This method can
also be accessed through the [`math.floor()`](math.md#math.floor) function:

```pycon
>>> from math import floor
>>> floor(Fraction(355, 113))
3
```

#### \_\_ceil_\_()

Returns the least [`int`](functions.md#int) `>= self`.  This method can
also be accessed through the [`math.ceil()`](math.md#math.ceil) function.

#### \_\_round_\_()

#### \_\_round_\_(ndigits)

The first version returns the nearest [`int`](functions.md#int) to `self`,
rounding half to even. The second version rounds `self` to the
nearest multiple of `Fraction(1, 10**ndigits)` (logically, if
`ndigits` is negative), again rounding half toward even.  This
method can also be accessed through the [`round()`](functions.md#round) function.

#### \_\_format_\_(format_spec,)

Provides support for formatting of [`Fraction`](#fractions.Fraction) instances via the
[`str.format()`](stdtypes.md#str.format) method, the [`format()`](functions.md#format) built-in function, or
[Formatted string literals](../reference/lexical_analysis.md#f-strings).

If the `format_spec` format specification string does not end with one
of the presentation types `'e'`, `'E'`, `'f'`, `'F'`, `'g'`,
`'G'` or `'%'` then formatting follows the general rules for fill,
alignment, sign handling, minimum width, and grouping as described in the
[format specification mini-language](string.md#formatspec). The “alternate
form” flag `'#'` is supported: if present, it forces the output string
to always include an explicit denominator, even when the value being
formatted is an exact integer. The zero-fill flag `'0'` is not
supported.

If the `format_spec` format specification string ends with one of
the presentation types `'e'`, `'E'`, `'f'`, `'F'`, `'g'`,
`'G'` or `'%'` then formatting follows the rules outlined for the
[`float`](functions.md#float) type in the [Format specification mini-language](string.md#formatspec) section.

Here are some examples:

```python3
>>> from fractions import Fraction
>>> format(Fraction(103993, 33102), '_')
'103_993/33_102'
>>> format(Fraction(1, 7), '.^+10')
'...+1/7...'
>>> format(Fraction(3, 1), '')
'3'
>>> format(Fraction(3, 1), '#')
'3/1'
>>> format(Fraction(1, 7), '.40g')
'0.1428571428571428571428571428571428571429'
>>> format(Fraction('1234567.855'), '_.2f')
'1_234_567.86'
>>> f"{Fraction(355, 113):*>20.6e}"
'********3.141593e+00'
>>> old_price, new_price = 499, 672
>>> "{:.2%} price increase".format(Fraction(new_price, old_price) - 1)
'34.67% price increase'
```

#### SEE ALSO
Module [`numbers`](numbers.md#module-numbers)
: The abstract base classes making up the numeric tower.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
