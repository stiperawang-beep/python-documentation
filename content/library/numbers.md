# `numbers` — Numeric abstract base classes

**Source code:** [Lib/numbers.py](https://github.com/python/cpython/tree/main/Lib/numbers.py)

---

The `numbers` module ([**PEP 3141**](https://peps.python.org/pep-3141/)) defines a hierarchy of numeric
[abstract base classes](../glossary.md#term-abstract-base-class) which progressively define
more operations.  None of the types defined in this module are intended to be instantiated.

### *class* numbers.Number

The root of the numeric hierarchy. If you just want to check if an argument
*x* is a number, without caring what kind, use `isinstance(x, Number)`.

## The numeric tower

### *class* numbers.Complex

Subclasses of this type describe complex numbers and include the operations
that work on the built-in [`complex`](functions.md#complex) type. These are: conversions to
[`complex`](functions.md#complex) and [`bool`](functions.md#bool), [`real`](#numbers.Complex.real), [`imag`](#numbers.Complex.imag), `+`,
`-`, `*`, `/`, `**`, [`abs()`](functions.md#abs), [`conjugate()`](#numbers.Complex.conjugate), `==`, and
`!=`. All except `-` and `!=` are abstract.

#### real

Abstract. Retrieves the real component of this number.

#### imag

Abstract. Retrieves the imaginary component of this number.

#### *abstractmethod* conjugate()

Abstract. Returns the complex conjugate. For example, `(1+3j).conjugate()
== (1-3j)`.

### *class* numbers.Real

To [`Complex`](#numbers.Complex), `Real` adds the operations that work on real
numbers.

In short, those are: a conversion to [`float`](functions.md#float), [`math.trunc()`](math.md#math.trunc),
[`round()`](functions.md#round), [`math.floor()`](math.md#math.floor), [`math.ceil()`](math.md#math.ceil), [`divmod()`](functions.md#divmod), `//`,
`%`, `<`, `<=`, `>`, and `>=`.

Real also provides defaults for [`complex()`](functions.md#complex), [`real`](#numbers.Complex.real),
[`imag`](#numbers.Complex.imag), and [`conjugate()`](#numbers.Complex.conjugate).

### *class* numbers.Rational

Subtypes [`Real`](#numbers.Real) and adds [`numerator`](#numbers.Rational.numerator) and
[`denominator`](#numbers.Rational.denominator) properties. It also provides a default for
[`float()`](functions.md#float).

The [`numerator`](#numbers.Rational.numerator) and [`denominator`](#numbers.Rational.denominator) values
should be instances of [`Integral`](#numbers.Integral) and should be in lowest terms with
[`denominator`](#numbers.Rational.denominator) positive.

#### numerator

Abstract.  The numerator of this rational number.

#### denominator

Abstract.  The denominator of this rational number.

### *class* numbers.Integral

Subtypes [`Rational`](#numbers.Rational) and adds a conversion to [`int`](functions.md#int).  Provides
defaults for [`float()`](functions.md#float), [`numerator`](#numbers.Rational.numerator), and
[`denominator`](#numbers.Rational.denominator).  Adds abstract methods for [`pow()`](functions.md#pow) with
modulus and bit-string operations: `<<`, `>>`, `&`, `^`, `|`,
`~`.

## Notes for type implementers

Implementers should be careful to make equal numbers equal and hash
them to the same values. This may be subtle if there are two different
extensions of the real numbers. For example, [`fractions.Fraction`](fractions.md#fractions.Fraction)
implements [`hash()`](functions.md#hash) as follows:

```python3
def __hash__(self):
    if self.denominator == 1:
        # Get integers right.
        return hash(self.numerator)
    # Expensive check, but definitely correct.
    if self == float(self):
        return hash(float(self))
    else:
        # Use tuple's hash to avoid a high collision rate on
        # simple fractions.
        return hash((self.numerator, self.denominator))
```

### Adding More Numeric ABCs

There are, of course, more possible ABCs for numbers, and this would
be a poor hierarchy if it precluded the possibility of adding
those. You can add `MyFoo` between [`Complex`](#numbers.Complex) and
[`Real`](#numbers.Real) with:

```python3
class MyFoo(Complex): ...
MyFoo.register(Real)
```

<a id="implementing-the-arithmetic-operations"></a>

### Implementing the arithmetic operations

We want to implement the arithmetic operations so that mixed-mode
operations either call an implementation whose author knew about the
types of both arguments, or convert both to the nearest built in type
and do the operation there. For subtypes of [`Integral`](#numbers.Integral), this
means that [`__add__()`](../reference/datamodel.md#object.__add__) and [`__radd__()`](../reference/datamodel.md#object.__radd__) should be
defined as:

```python3
class MyIntegral(Integral):

    def __add__(self, other):
        if isinstance(other, MyIntegral):
            return do_my_adding_stuff(self, other)
        elif isinstance(other, OtherTypeIKnowAbout):
            return do_my_other_adding_stuff(self, other)
        else:
            return NotImplemented

    def __radd__(self, other):
        if isinstance(other, MyIntegral):
            return do_my_adding_stuff(other, self)
        elif isinstance(other, OtherTypeIKnowAbout):
            return do_my_other_adding_stuff(other, self)
        elif isinstance(other, Integral):
            return int(other) + int(self)
        elif isinstance(other, Real):
            return float(other) + float(self)
        elif isinstance(other, Complex):
            return complex(other) + complex(self)
        else:
            return NotImplemented
```

There are 5 different cases for a mixed-type operation on subclasses
of [`Complex`](#numbers.Complex). I’ll refer to all of the above code that doesn’t
refer to `MyIntegral` and `OtherTypeIKnowAbout` as
“boilerplate”. `a` will be an instance of `A`, which is a subtype
of [`Complex`](#numbers.Complex) (`a : A <: Complex`), and `b : B <:
Complex`. I’ll consider `a + b`:

1. If `A` defines an [`__add__()`](../reference/datamodel.md#object.__add__) which accepts `b`, all is
   well.
2. If `A` falls back to the boilerplate code, and it were to
   return a value from [`__add__()`](../reference/datamodel.md#object.__add__), we’d miss the possibility
   that `B` defines a more intelligent [`__radd__()`](../reference/datamodel.md#object.__radd__), so the
   boilerplate should return [`NotImplemented`](constants.md#NotImplemented) from
   `__add__()`. (Or `A` may not implement `__add__()` at
   all.)
3. Then `B`’s [`__radd__()`](../reference/datamodel.md#object.__radd__) gets a chance. If it accepts
   `a`, all is well.
4. If it falls back to the boilerplate, there are no more possible
   methods to try, so this is where the default implementation
   should live.
5. If `B <: A`, Python tries `B.__radd__` before
   `A.__add__`. This is ok, because it was implemented with
   knowledge of `A`, so it can handle those instances before
   delegating to [`Complex`](#numbers.Complex).

If `A <: Complex` and `B <: Real` without sharing any other knowledge,
then the appropriate shared operation is the one involving the built
in [`complex`](functions.md#complex), and both [`__radd__()`](../reference/datamodel.md#object.__radd__) s land there, so `a+b
== b+a`.

Because most of the operations on any given type will be very similar,
it can be useful to define a helper function which generates the
forward and reverse instances of any given operator. For example,
[`fractions.Fraction`](fractions.md#fractions.Fraction) uses:

```python3
def _operator_fallbacks(monomorphic_operator, fallback_operator):
    def forward(a, b):
        if isinstance(b, (int, Fraction)):
            return monomorphic_operator(a, b)
        elif isinstance(b, float):
            return fallback_operator(float(a), b)
        elif isinstance(b, complex):
            return fallback_operator(complex(a), b)
        else:
            return NotImplemented
    forward.__name__ = '__' + fallback_operator.__name__ + '__'
    forward.__doc__ = monomorphic_operator.__doc__

    def reverse(b, a):
        if isinstance(a, Rational):
            # Includes ints.
            return monomorphic_operator(a, b)
        elif isinstance(a, Real):
            return fallback_operator(float(a), float(b))
        elif isinstance(a, Complex):
            return fallback_operator(complex(a), complex(b))
        else:
            return NotImplemented
    reverse.__name__ = '__r' + fallback_operator.__name__ + '__'
    reverse.__doc__ = monomorphic_operator.__doc__

    return forward, reverse

def _add(a, b):
    """a + b"""
    return Fraction(a.numerator * b.denominator +
                    b.numerator * a.denominator,
                    a.denominator * b.denominator)

__add__, __radd__ = _operator_fallbacks(_add, operator.add)

# ...
```

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
