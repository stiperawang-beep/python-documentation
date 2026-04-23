<a id="datamodel"></a>

# Data model

<a id="objects"></a>

## Objects, values and types

<a id="index-0"></a>

*Objects* are Python’s abstraction for data.  All data in a Python program
is represented by objects or by relations between objects. Even code is
represented by objects.

<a id="index-1"></a>

Every object has an identity, a type and a value.  An object’s *identity* never
changes once it has been created; you may think of it as the object’s address in
memory.  The [`is`](expressions.md#is) operator compares the identity of two objects; the
[`id()`](../library/functions.md#id) function returns an integer representing its identity.

**CPython implementation detail:** For CPython, `id(x)` is the memory address where `x` is stored.

An object’s type determines the operations that the object supports (e.g., “does
it have a length?”) and also defines the possible values for objects of that
type.  The [`type()`](../library/functions.md#type) function returns an object’s type (which is an object
itself).  Like its identity, an object’s *type* is also unchangeable.
<sup>[1](#id20)</sup>

The *value* of some objects can change.  Objects whose value can
change are said to be *mutable*; objects whose value is unchangeable once they
are created are called *immutable*. (The value of an immutable container object
that contains a reference to a mutable object can change when the latter’s value
is changed; however the container is still considered immutable, because the
collection of objects it contains cannot be changed.  So, immutability is not
strictly the same as having an unchangeable value, it is more subtle.) An
object’s mutability is determined by its type; for instance, numbers, strings
and tuples are immutable, while dictionaries and lists are mutable.

<a id="index-2"></a>

Objects are never explicitly destroyed; however, when they become unreachable
they may be garbage-collected.  An implementation is allowed to postpone garbage
collection or omit it altogether — it is a matter of implementation quality
how garbage collection is implemented, as long as no objects are collected that
are still reachable.

**CPython implementation detail:** CPython currently uses a reference-counting scheme with (optional) delayed
detection of cyclically linked garbage, which collects most objects as soon
as they become unreachable, but is not guaranteed to collect garbage
containing circular references.  See the documentation of the [`gc`](../library/gc.md#module-gc)
module for information on controlling the collection of cyclic garbage.
Other implementations act differently and CPython may change.
Do not depend on immediate finalization of objects when they become
unreachable (so you should always close files explicitly).

Note that the use of the implementation’s tracing or debugging facilities may
keep objects alive that would normally be collectable. Also note that catching
an exception with a [`try`](compound_stmts.md#try)…[`except`](compound_stmts.md#except) statement may keep
objects alive.

Some objects contain references to “external” resources such as open files or
windows.  It is understood that these resources are freed when the object is
garbage-collected, but since garbage collection is not guaranteed to happen,
such objects also provide an explicit way to release the external resource,
usually a `close()` method. Programs are strongly recommended to explicitly
close such objects.  The [`try`](compound_stmts.md#try)…[`finally`](compound_stmts.md#finally) statement
and the [`with`](compound_stmts.md#with) statement provide convenient ways to do this.

<a id="index-3"></a>

Some objects contain references to other objects; these are called *containers*.
Examples of containers are tuples, lists and dictionaries.  The references are
part of a container’s value.  In most cases, when we talk about the value of a
container, we imply the values, not the identities of the contained objects;
however, when we talk about the mutability of a container, only the identities
of the immediately contained objects are implied.  So, if an immutable container
(like a tuple) contains a reference to a mutable object, its value changes if
that mutable object is changed.

Types affect almost all aspects of object behavior.  Even the importance of
object identity is affected in some sense: for immutable types, operations that
compute new values may actually return a reference to any existing object with
the same type and value, while for mutable objects this is not allowed.
For example, after `a = 1; b = 1`, *a* and *b* may or may not refer to
the same object with the value one, depending on the implementation.
This is because [`int`](../library/functions.md#int) is an immutable type, so the reference to `1`
can be reused. This behaviour depends on the implementation used, so should
not be relied upon, but is something to be aware of when making use of object
identity tests.
However, after `c = []; d = []`, *c* and *d* are guaranteed to refer to two
different, unique, newly created empty lists. (Note that `e = f = []` assigns
the *same* object to both *e* and *f*.)

<a id="types"></a>

## The standard type hierarchy

<a id="index-4"></a>

Below is a list of the types that are built into Python.  Extension modules
(written in C, Java, or other languages, depending on the implementation) can
define additional types.  Future versions of Python may add types to the type
hierarchy (e.g., rational numbers, efficiently stored arrays of integers, etc.),
although such additions will often be provided via the standard library instead.

<a id="index-5"></a>

Some of the type descriptions below contain a paragraph listing ‘special
attributes.’  These are attributes that provide access to the implementation and
are not intended for general use.  Their definition may change in the future.

### None

<a id="index-6"></a>

This type has a single value.  There is a single object with this value. This
object is accessed through the built-in name `None`. It is used to signify the
absence of a value in many situations, e.g., it is returned from functions that
don’t explicitly return anything. Its truth value is false.

### NotImplemented

<a id="index-7"></a>

This type has a single value.  There is a single object with this value. This
object is accessed through the built-in name [`NotImplemented`](../library/constants.md#NotImplemented). Numeric methods
and rich comparison methods should return this value if they do not implement the
operation for the operands provided.  (The interpreter will then try the
reflected operation, or some other fallback, depending on the operator.)  It
should not be evaluated in a boolean context.

See
[Implementing the arithmetic operations](../library/numbers.md#implementing-the-arithmetic-operations)
for more details.

#### Versionchanged
Changed in version 3.9: Evaluating [`NotImplemented`](../library/constants.md#NotImplemented) in a boolean context was deprecated.

#### Versionchanged
Changed in version 3.14: Evaluating [`NotImplemented`](../library/constants.md#NotImplemented) in a boolean context now raises a [`TypeError`](../library/exceptions.md#TypeError).
It previously evaluated to [`True`](../library/constants.md#True) and emitted a [`DeprecationWarning`](../library/exceptions.md#DeprecationWarning)
since Python 3.9.

### Ellipsis

<a id="index-8"></a>

This type has a single value.  There is a single object with this value. This
object is accessed through the literal `...` or the built-in name
`Ellipsis`.  Its truth value is true.

### [`numbers.Number`](../library/numbers.md#numbers.Number)

<a id="index-9"></a>

These are created by numeric literals and returned as results by arithmetic
operators and arithmetic built-in functions.  Numeric objects are immutable;
once created their value never changes.  Python numbers are of course strongly
related to mathematical numbers, but subject to the limitations of numerical
representation in computers.

The string representations of the numeric classes, computed by
[`__repr__()`](#object.__repr__) and [`__str__()`](#object.__str__), have the following
properties:

* They are valid numeric literals which, when passed to their
  class constructor, produce an object having the value of the
  original numeric.
* The representation is in base 10, when possible.
* Leading zeros, possibly excepting a single zero before a
  decimal point, are not shown.
* Trailing zeros, possibly excepting a single zero after a
  decimal point, are not shown.
* A sign is shown only when the number is negative.

Python distinguishes between integers, floating-point numbers, and complex
numbers:

#### [`numbers.Integral`](../library/numbers.md#numbers.Integral)

<a id="index-10"></a>

These represent elements from the mathematical set of integers (positive and
negative).

#### NOTE
<a id="index-11"></a>

The rules for integer representation are intended to give the most meaningful
interpretation of shift and mask operations involving negative integers.

There are two types of integers:

Integers ([`int`](../library/functions.md#int))
: These represent numbers in an unlimited range, subject to available (virtual)
  memory only.  For the purpose of shift and mask operations, a binary
  representation is assumed, and negative numbers are represented in a variant of
  2’s complement which gives the illusion of an infinite string of sign bits
  extending to the left.

Booleans ([`bool`](../library/functions.md#bool))
: <a id="index-12"></a>
  <br/>
  These represent the truth values False and True.  The two objects representing
  the values `False` and `True` are the only Boolean objects. The Boolean type is a
  subtype of the integer type, and Boolean values behave like the values 0 and 1,
  respectively, in almost all contexts, the exception being that when converted to
  a string, the strings `"False"` or `"True"` are returned, respectively.

<a id="datamodel-float"></a>

#### [`numbers.Real`](../library/numbers.md#numbers.Real) ([`float`](../library/functions.md#float))

<a id="index-13"></a>

These represent machine-level double precision floating-point numbers. You are
at the mercy of the underlying machine architecture (and C or Java
implementation) for the accepted range and handling of overflow. Python does not
support single-precision floating-point numbers; the savings in processor and
memory usage that are usually the reason for using these are dwarfed by the
overhead of using objects in Python, so there is no reason to complicate the
language with two kinds of floating-point numbers.

#### [`numbers.Complex`](../library/numbers.md#numbers.Complex) ([`complex`](../library/functions.md#complex))

<a id="index-14"></a>

These represent complex numbers as a pair of machine-level double precision
floating-point numbers.  The same caveats apply as for floating-point numbers.
The real and imaginary parts of a complex number `z` can be retrieved through
the read-only attributes `z.real` and `z.imag`.

<a id="datamodel-sequences"></a>

### Sequences

<a id="index-15"></a>

These represent finite ordered sets indexed by non-negative numbers. The
built-in function [`len()`](../library/functions.md#len) returns the number of items of a sequence. When
the length of a sequence is *n*, the index set contains the numbers 0, 1,
…, *n*-1.  Item *i* of sequence *a* is selected by `a[i]`. Some sequences,
including built-in sequences, interpret negative subscripts by adding the
sequence length. For example, `a[-2]` equals `a[n-2]`, the second to last
item of sequence a with length `n`.

The resulting value must be a nonnegative integer less than the number of items
in the sequence. If it is not, an [`IndexError`](../library/exceptions.md#IndexError) is raised.

<a id="index-16"></a>

Sequences also support slicing: `a[start:stop]` selects all items with index *k* such
that *start* `<=` *k* `<` *stop*.  When used as an expression, a slice is a
sequence of the same type. The comment above about negative subscripts also applies
to negative slice positions.
Note that no error is raised if a slice position is less than zero or larger
than the length of the sequence.

If *start* is missing or [`None`](../library/constants.md#None), slicing behaves as if *start* was zero.
If *stop* is missing or `None`, slicing behaves as if *stop* was equal to
the length of the sequence.

Some sequences also support “extended slicing” with a third “step” parameter:
`a[i:j:k]` selects all items of *a* with index *x* where `x = i + n*k`, *n*
`>=` `0` and *i* `<=` *x* `<` *j*.

Sequences are distinguished according to their mutability:

#### Immutable sequences

<a id="index-17"></a>

An object of an immutable sequence type cannot change once it is created.  (If
the object contains references to other objects, these other objects may be
mutable and may be changed; however, the collection of objects directly
referenced by an immutable object cannot change.)

The following types are immutable sequences:

<a id="index-18"></a>

Strings
: <a id="index-19"></a>
  <br/>
  A string ([`str`](../library/stdtypes.md#str)) is a sequence of values that represent
  *characters*, or more formally, *Unicode code points*.
  All the code points in the range `0` to `0x10FFFF` can be
  represented in a string.
  <br/>
  Python doesn’t have a dedicated *character* type.
  Instead, every code point in the string is represented as a string
  object with length `1`.
  <br/>
  The built-in function [`ord()`](../library/functions.md#ord)
  converts a code point from its string form to an integer in the
  range `0` to `0x10FFFF`; [`chr()`](../library/functions.md#chr) converts an integer in the range
  `0` to `0x10FFFF` to the corresponding length `1` string object.
  [`str.encode()`](../library/stdtypes.md#str.encode) can be used to convert a [`str`](../library/stdtypes.md#str) to
  [`bytes`](../library/stdtypes.md#bytes) using the given text encoding, and
  [`bytes.decode()`](../library/stdtypes.md#bytes.decode) can be used to achieve the opposite.

Tuples
: <a id="index-20"></a>
  <br/>
  The items of a [`tuple`](../library/stdtypes.md#tuple) are arbitrary Python objects. Tuples of two or
  more items are formed by comma-separated lists of expressions.  A tuple
  of one item (a ‘singleton’) can be formed by affixing a comma to an
  expression (an expression by itself does not create a tuple, since
  parentheses must be usable for grouping of expressions).  An empty
  tuple can be formed by an empty pair of parentheses.

Bytes
: <a id="index-21"></a>
  <br/>
  A [`bytes`](../library/stdtypes.md#bytes) object is an immutable array.  The items are 8-bit bytes,
  represented by integers in the range 0 <= x < 256.  Bytes literals
  (like `b'abc'`) and the built-in [`bytes()`](../library/stdtypes.md#bytes) constructor
  can be used to create bytes objects.  Also, bytes objects can be
  decoded to strings via the [`decode()`](../library/stdtypes.md#bytes.decode) method.

#### Mutable sequences

<a id="index-22"></a>

Mutable sequences can be changed after they are created.  The subscription and
slicing notations can be used as the target of assignment and [`del`](simple_stmts.md#del)
(delete) statements.

#### NOTE
<a id="index-23"></a>

<a id="index-24"></a>

The [`collections`](../library/collections.md#module-collections) and [`array`](../library/array.md#module-array) module provide
additional examples of mutable sequence types.

There are currently two intrinsic mutable sequence types:

Lists
: <a id="index-25"></a>
  <br/>
  The items of a list are arbitrary Python objects.  Lists are formed by
  placing a comma-separated list of expressions in square brackets. (Note
  that there are no special cases needed to form lists of length 0 or 1.)

Byte Arrays
: <a id="index-26"></a>
  <br/>
  A bytearray object is a mutable array. They are created by the built-in
  [`bytearray()`](../library/stdtypes.md#bytearray) constructor.  Aside from being mutable
  (and hence unhashable), byte arrays otherwise provide the same interface
  and functionality as immutable [`bytes`](../library/stdtypes.md#bytes) objects.

### Set types

<a id="index-27"></a>

These represent unordered, finite sets of unique, immutable objects. As such,
they cannot be indexed by any subscript. However, they can be iterated over, and
the built-in function [`len()`](../library/functions.md#len) returns the number of items in a set. Common
uses for sets are fast membership testing, removing duplicates from a sequence,
and computing mathematical operations such as intersection, union, difference,
and symmetric difference.

For set elements, the same immutability rules apply as for dictionary keys. Note
that numeric types obey the normal rules for numeric comparison: if two numbers
compare equal (e.g., `1` and `1.0`), only one of them can be contained in a
set.

There are currently two intrinsic set types:

Sets
: <a id="index-28"></a>
  <br/>
  These represent a mutable set. They are created by the built-in [`set()`](../library/stdtypes.md#set)
  constructor and can be modified afterwards by several methods, such as
  [`add()`](../library/stdtypes.md#set.add).

Frozen sets
: <a id="index-29"></a>
  <br/>
  These represent an immutable set.  They are created by the built-in
  [`frozenset()`](../library/stdtypes.md#frozenset) constructor.  As a frozenset is immutable and
  [hashable](../glossary.md#term-hashable), it can be used again as an element of another set, or as
  a dictionary key.

<a id="datamodel-mappings"></a>

### Mappings

<a id="index-30"></a>

These represent finite sets of objects indexed by arbitrary index sets. The
subscript notation `a[k]` selects the item indexed by `k` from the mapping
`a`; this can be used in expressions and as the target of assignments or
[`del`](simple_stmts.md#del) statements. The built-in function [`len()`](../library/functions.md#len) returns the number
of items in a mapping.

There is currently a single intrinsic mapping type:

#### Dictionaries

<a id="index-31"></a>

These represent finite sets of objects indexed by nearly arbitrary values.  The
only types of values not acceptable as keys are values containing lists or
dictionaries or other mutable types that are compared by value rather than by
object identity, the reason being that the efficient implementation of
dictionaries requires a key’s hash value to remain constant. Numeric types used
for keys obey the normal rules for numeric comparison: if two numbers compare
equal (e.g., `1` and `1.0`) then they can be used interchangeably to index
the same dictionary entry.

Dictionaries preserve insertion order, meaning that keys will be produced
in the same order they were added sequentially over the dictionary.
Replacing an existing key does not change the order, however removing a key
and re-inserting it will add it to the end instead of keeping its old place.

Dictionaries are mutable; they can be created by the `{}` notation (see
section [Dictionary displays](expressions.md#dict)).

<a id="index-32"></a>

The extension modules [`dbm.ndbm`](../library/dbm.md#module-dbm.ndbm) and [`dbm.gnu`](../library/dbm.md#module-dbm.gnu) provide
additional examples of mapping types, as does the [`collections`](../library/collections.md#module-collections)
module.

#### Versionchanged
Changed in version 3.7: Dictionaries did not preserve insertion order in versions of Python before 3.6.
In CPython 3.6, insertion order was preserved, but it was considered
an implementation detail at that time rather than a language guarantee.

### Callable types

<a id="index-33"></a>

These are the types to which the function call operation (see section
[Calls](expressions.md#calls)) can be applied:

<a id="user-defined-funcs"></a>

#### User-defined functions

<a id="index-34"></a>

A user-defined function object is created by a function definition (see
section [Function definitions](compound_stmts.md#function)).  It should be called with an argument list
containing the same number of items as the function’s formal parameter
list.

##### Special read-only attributes

<a id="index-35"></a>

| Attribute                     | Meaning                                                                                                                                                                                                                                                                                                                                                                    |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #### function.\_\_builtins_\_ | A reference to the [`dictionary`](../library/stdtypes.md#dict) that holds the function’s<br/>builtins namespace.<br/><br/>#### Versionadded<br/>Added in version 3.10.                                                                                                                                                                                                     |
| #### function.\_\_globals_\_  | A reference to the [`dictionary`](../library/stdtypes.md#dict) that holds the function’s<br/>[global variables](executionmodel.md#naming) – the global namespace of the module<br/>in which the function was defined.                                                                                                                                                      |
| #### function.\_\_closure_\_  | `None` or a [`tuple`](../library/stdtypes.md#tuple) of cells that contain bindings for the names specified<br/>in the [`co_freevars`](#codeobject.co_freevars) attribute of the function’s<br/>[`code object`](#function.__code__).<br/><br/>A cell object has the attribute `cell_contents`.<br/>This can be used to get the value of the cell, as well as set the value. |

##### Special writable attributes

<a id="index-36"></a>

Most of these attributes check the type of the assigned value:

| Attribute                        | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #### function.\_\_doc_\_         | The function’s documentation string, or `None` if unavailable.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| #### function.\_\_name_\_        | The function’s name.<br/>See also: [`__name__ attributes`](../library/stdtypes.md#definition.__name__).                                                                                                                                                                                                                                                                                                                                                                                                       |
| #### function.\_\_qualname_\_    | The function’s [qualified name](../glossary.md#term-qualified-name).<br/>See also: [`__qualname__ attributes`](../library/stdtypes.md#definition.__qualname__).<br/><br/>#### Versionadded<br/>Added in version 3.3.                                                                                                                                                                                                                                                                                          |
| #### function.\_\_module_\_      | The name of the module the function was defined in,<br/>or `None` if unavailable.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| #### function.\_\_defaults_\_    | A [`tuple`](../library/stdtypes.md#tuple) containing default [parameter](../glossary.md#term-parameter) values<br/>for those parameters that have defaults,<br/>or `None` if no parameters have a default value.                                                                                                                                                                                                                                                                                              |
| #### function.\_\_code_\_        | The [code object](#code-objects) representing<br/>the compiled function body.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| #### function.\_\_dict_\_        | The namespace supporting arbitrary function attributes.<br/>See also: [`__dict__ attributes`](#object.__dict__).                                                                                                                                                                                                                                                                                                                                                                                              |
| #### function.\_\_annotations_\_ | A [`dictionary`](../library/stdtypes.md#dict) containing annotations of<br/>[parameters](../glossary.md#term-parameter).<br/>The keys of the dictionary are the parameter names,<br/>and `'return'` for the return annotation, if provided.<br/>See also: [`object.__annotations__`](#object.__annotations__).<br/><br/>#### Versionchanged<br/>Changed in version 3.14: Annotations are now [lazily evaluated](executionmodel.md#lazy-evaluation).<br/>See [**PEP 649**](https://peps.python.org/pep-0649/). |
| #### function.\_\_annotate_\_    | The [annotate function](../glossary.md#term-annotate-function) for this function, or `None`<br/>if the function has no annotations. See [`object.__annotate__`](#object.__annotate__).<br/><br/>#### Versionadded<br/>Added in version 3.14.                                                                                                                                                                                                                                                                  |
| #### function.\_\_kwdefaults_\_  | A [`dictionary`](../library/stdtypes.md#dict) containing defaults for keyword-only<br/>[parameters](../glossary.md#term-parameter).                                                                                                                                                                                                                                                                                                                                                                           |
| #### function.\_\_type_params_\_ | A [`tuple`](../library/stdtypes.md#tuple) containing the [type parameters](compound_stmts.md#type-params) of<br/>a [generic function](compound_stmts.md#generic-functions).<br/><br/>#### Versionadded<br/>Added in version 3.12.                                                                                                                                                                                                                                                                             |

Function objects also support getting and setting arbitrary attributes, which
can be used, for example, to attach metadata to functions.  Regular attribute
dot-notation is used to get and set such attributes.

**CPython implementation detail:** CPython’s current implementation only supports function attributes
on user-defined functions. Function attributes on
[built-in functions](#builtin-functions) may be supported in the
future.

Additional information about a function’s definition can be retrieved from its
[code object](#code-objects)
(accessible via the [`__code__`](#function.__code__) attribute).

<a id="instance-methods"></a>

#### Instance methods

<a id="index-38"></a>

An instance method object combines a class, a class instance and any
callable object (normally a user-defined function).

<a id="index-39"></a>

Special read-only attributes:

| #### method.\_\_self_\_   | Refers to the class instance object to which the method is<br/>[bound](#method-binding)                                                                                                          |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #### method.\_\_func_\_   | Refers to the original [function object](#user-defined-funcs)                                                                                                                                    |
| #### method.\_\_doc_\_    | The method’s documentation<br/>(same as [`method.__func__.__doc__`](#function.__doc__)).<br/>A [`string`](../library/stdtypes.md#str) if the original function had a docstring, else<br/>`None`. |
| #### method.\_\_name_\_   | The name of the method<br/>(same as [`method.__func__.__name__`](#function.__name__))                                                                                                            |
| #### method.\_\_module_\_ | The name of the module the method was defined in, or `None` if<br/>unavailable.                                                                                                                  |

Methods also support accessing (but not setting) the arbitrary function
attributes on the underlying [function object](#user-defined-funcs).

User-defined method objects may be created when getting an attribute of a
class (perhaps via an instance of that class), if that attribute is a
user-defined [function object](#user-defined-funcs) or a
[`classmethod`](../library/functions.md#classmethod) object.

<a id="method-binding"></a>

When an instance method object is created by retrieving a user-defined
[function object](#user-defined-funcs) from a class via one of its
instances, its [`__self__`](#method.__self__) attribute is the instance, and the
method object is said to be *bound*.  The new method’s [`__func__`](#method.__func__)
attribute is the original function object.

When an instance method object is created by retrieving a [`classmethod`](../library/functions.md#classmethod)
object from a class or instance, its [`__self__`](#method.__self__) attribute is the
class itself, and its [`__func__`](#method.__func__) attribute is the function object
underlying the class method.

When an instance method object is called, the underlying function
([`__func__`](#method.__func__)) is called, inserting the class instance
([`__self__`](#method.__self__)) in front of the argument list.  For instance, when
`C` is a class which contains a definition for a function
`f()`, and `x` is an instance of `C`, calling `x.f(1)` is
equivalent to calling `C.f(x, 1)`.

When an instance method object is derived from a [`classmethod`](../library/functions.md#classmethod) object, the
“class instance” stored in [`__self__`](#method.__self__) will actually be the class
itself, so that calling either `x.f(1)` or `C.f(1)` is equivalent to
calling `f(C,1)` where `f` is the underlying function.

It is important to note that user-defined functions
which are attributes of a class instance are not converted to bound
methods; this *only* happens when the function is an attribute of the
class.

#### Generator functions

<a id="index-40"></a>

A function or method which uses the [`yield`](simple_stmts.md#yield) statement (see section
[The yield statement](simple_stmts.md#yield)) is called a *generator function*.  Such a function, when
called, always returns an [iterator](../glossary.md#term-iterator) object which can be used to
execute the body of the function:  calling the iterator’s
[`iterator.__next__()`](../library/stdtypes.md#iterator.__next__) method will cause the function to execute until
it provides a value using the `yield` statement.  When the
function executes a [`return`](simple_stmts.md#return) statement or falls off the end, a
[`StopIteration`](../library/exceptions.md#StopIteration) exception is raised and the iterator will have
reached the end of the set of values to be returned.

#### Coroutine functions

<a id="index-41"></a>

A function or method which is defined using [`async def`](compound_stmts.md#async-def) is called
a *coroutine function*.  Such a function, when called, returns a
[coroutine](../glossary.md#term-coroutine) object.  It may contain [`await`](expressions.md#await) expressions,
as well as [`async with`](compound_stmts.md#async-with) and [`async for`](compound_stmts.md#async-for) statements. See
also the [Coroutine Objects](#coroutine-objects) section.

#### Asynchronous generator functions

<a id="index-42"></a>

A function or method which is defined using [`async def`](compound_stmts.md#async-def) and
which uses the [`yield`](simple_stmts.md#yield) statement is called a
*asynchronous generator function*.  Such a function, when called,
returns an [asynchronous iterator](../glossary.md#term-asynchronous-iterator) object which can be used in an
[`async for`](compound_stmts.md#async-for) statement to execute the body of the function.

Calling the asynchronous iterator’s
[`aiterator.__anext__`](#object.__anext__) method
will return an [awaitable](../glossary.md#term-awaitable) which when awaited
will execute until it provides a value using the [`yield`](simple_stmts.md#yield)
expression.  When the function executes an empty [`return`](simple_stmts.md#return)
statement or falls off the end, a [`StopAsyncIteration`](../library/exceptions.md#StopAsyncIteration) exception
is raised and the asynchronous iterator will have reached the end of
the set of values to be yielded.

<a id="builtin-functions"></a>

#### Built-in functions

<a id="index-43"></a>

A built-in function object is a wrapper around a C function.  Examples of
built-in functions are [`len()`](../library/functions.md#len) and [`math.sin()`](../library/math.md#math.sin) ([`math`](../library/math.md#module-math) is a
standard built-in module). The number and type of the arguments are
determined by the C function. Special read-only attributes:

* `__doc__` is the function’s documentation string, or `None` if
  unavailable. See [`function.__doc__`](#function.__doc__).
* `__name__` is the function’s name. See [`function.__name__`](#function.__name__).
* `__self__` is set to `None` (but see the next item).
* `__module__` is the name of
  the module the function was defined in or `None` if unavailable.
  See [`function.__module__`](#function.__module__).

<a id="builtin-methods"></a>

#### Built-in methods

<a id="index-44"></a>

This is really a different disguise of a built-in function, this time containing
an object passed to the C function as an implicit extra argument.  An example of
a built-in method is `alist.append()`, assuming *alist* is a list object. In
this case, the special read-only attribute `__self__` is set to the object
denoted by *alist*. (The attribute has the same semantics as it does with
[`other instance methods`](#method.__self__).)

<a id="classes"></a>

#### Classes

Classes are callable.  These objects normally act as factories for new
instances of themselves, but variations are possible for class types that
override [`__new__()`](#object.__new__).  The arguments of the call are passed to
`__new__()` and, in the typical case, to [`__init__()`](#object.__init__) to
initialize the new instance.

#### Class Instances

Instances of arbitrary classes can be made callable by defining a
[`__call__()`](#object.__call__) method in their class.

<a id="module-objects"></a>

### Modules

<a id="index-45"></a>

Modules are a basic organizational unit of Python code, and are created by
the [import system](import.md#importsystem) as invoked either by the
[`import`](simple_stmts.md#import) statement, or by calling
functions such as [`importlib.import_module()`](../library/importlib.md#importlib.import_module) and built-in
[`__import__()`](../library/functions.md#import__).  A module object has a namespace implemented by a
[`dictionary`](../library/stdtypes.md#dict) object (this is the dictionary referenced by the
[`__globals__`](#function.__globals__)
attribute of functions defined in the module).  Attribute references are
translated to lookups in this dictionary, e.g., `m.x` is equivalent to
`m.__dict__["x"]`. A module object does not contain the code object used
to initialize the module (since it isn’t needed once the initialization is
done).

Attribute assignment updates the module’s namespace dictionary, e.g.,
`m.x = 1` is equivalent to `m.__dict__["x"] = 1`.

<a id="index-46"></a>

<a id="import-mod-attrs"></a>

#### Import-related attributes on module objects

Module objects have the following attributes that relate to the
[import system](import.md#importsystem). When a module is created using the machinery associated
with the import system, these attributes are filled in based on the module’s
[spec](../glossary.md#term-module-spec), before the [loader](../glossary.md#term-loader) executes and loads the
module.

To create a module dynamically rather than using the import system,
it’s recommended to use [`importlib.util.module_from_spec()`](../library/importlib.md#importlib.util.module_from_spec),
which will set the various import-controlled attributes to appropriate values.
It’s also possible to use the [`types.ModuleType`](../library/types.md#types.ModuleType) constructor to create
modules directly, but this technique is more error-prone, as most attributes
must be manually set on the module object after it has been created when using
this approach.

#### module.\_\_name_\_

The name used to uniquely identify the module in the import system.
For a directly executed module, this will be set to `"__main__"`.

This attribute must be set to the fully qualified name of the module.
It is expected to match the value of
[`module.__spec__.name`](../library/importlib.md#importlib.machinery.ModuleSpec.name).

#### module.\_\_spec_\_

A record of the module’s import-system-related state.

Set to the [`module spec`](../library/importlib.md#importlib.machinery.ModuleSpec) that was
used when importing the module. See [Module specs](import.md#module-specs) for more details.

#### Versionadded
Added in version 3.4.

#### module.\_\_package_\_

The [package](../glossary.md#term-package) a module belongs to.

If the module is top-level (that is, not a part of any specific package)
then the attribute should be set to `''` (the empty string). Otherwise,
it should be set to the name of the module’s package (which can be equal to
[`module.__name__`](#module.__name__) if the module itself is a package). See [**PEP 366**](https://peps.python.org/pep-0366/)
for further details.

This attribute is used instead of [`__name__`](#module.__name__) to calculate
explicit relative imports for main modules. It defaults to `None` for
modules created dynamically using the [`types.ModuleType`](../library/types.md#types.ModuleType) constructor;
use [`importlib.util.module_from_spec()`](../library/importlib.md#importlib.util.module_from_spec) instead to ensure the attribute
is set to a [`str`](../library/stdtypes.md#str).

It is **strongly** recommended that you use
[`module.__spec__.parent`](../library/importlib.md#importlib.machinery.ModuleSpec.parent)
instead of `module.__package__`. [`__package__`](#module.__package__) is now only used
as a fallback if `__spec__.parent` is not set, and this fallback
path is deprecated.

#### Versionchanged
Changed in version 3.4: This attribute now defaults to `None` for modules created dynamically
using the [`types.ModuleType`](../library/types.md#types.ModuleType) constructor.
Previously the attribute was optional.

#### Versionchanged
Changed in version 3.6: The value of `__package__` is expected to be the same as
[`__spec__.parent`](../library/importlib.md#importlib.machinery.ModuleSpec.parent).
[`__package__`](#module.__package__) is now only used as a fallback during import
resolution if `__spec__.parent` is not defined.

#### Versionchanged
Changed in version 3.10: [`ImportWarning`](../library/exceptions.md#ImportWarning) is raised if an import resolution falls back to
`__package__` instead of
[`__spec__.parent`](../library/importlib.md#importlib.machinery.ModuleSpec.parent).

#### Versionchanged
Changed in version 3.12: Raise [`DeprecationWarning`](../library/exceptions.md#DeprecationWarning) instead of [`ImportWarning`](../library/exceptions.md#ImportWarning) when
falling back to `__package__` during import resolution.

#### Deprecated-removed
Deprecated since version 3.13, removed in version 3.15: `__package__` will cease to be set or taken into consideration
by the import system or standard library.

#### module.\_\_loader_\_

The [loader](../glossary.md#term-loader) object that the import machinery used to load the module.

This attribute is mostly useful for introspection, but can be used for
additional loader-specific functionality, for example getting data
associated with a loader.

`__loader__` defaults to `None` for modules created dynamically
using the [`types.ModuleType`](../library/types.md#types.ModuleType) constructor;
use [`importlib.util.module_from_spec()`](../library/importlib.md#importlib.util.module_from_spec) instead to ensure the attribute
is set to a [loader](../glossary.md#term-loader) object.

It is **strongly** recommended that you use
[`module.__spec__.loader`](../library/importlib.md#importlib.machinery.ModuleSpec.loader)
instead of `module.__loader__`.

#### Versionchanged
Changed in version 3.4: This attribute now defaults to `None` for modules created dynamically
using the [`types.ModuleType`](../library/types.md#types.ModuleType) constructor.
Previously the attribute was optional.

#### Deprecated-removed
Deprecated since version 3.12, will be removed in version 3.16: Setting `__loader__` on a module while failing to set
`__spec__.loader` is deprecated. In Python 3.16,
`__loader__` will cease to be set or taken into consideration by
the import system or the standard library.

#### module.\_\_path_\_

A (possibly empty) [sequence](../glossary.md#term-sequence) of strings enumerating the locations
where the package’s submodules will be found. Non-package modules should
not have a `__path__` attribute. See [\_\_path_\_ attributes on modules](import.md#package-path-rules) for
more details.

It is **strongly** recommended that you use
[`module.__spec__.submodule_search_locations`](../library/importlib.md#importlib.machinery.ModuleSpec.submodule_search_locations)
instead of `module.__path__`.

#### module.\_\_file_\_

`__file__` is an optional attribute that
may or may not be set. Both attributes should be a [`str`](../library/stdtypes.md#str) when they
are available.

An optional attribute, `__file__` indicates the pathname of the file
from which the module was loaded (if loaded from a file), or the pathname of
the shared library file for extension modules loaded dynamically from a
shared library. It might be missing for certain types of modules, such as C
modules that are statically linked into the interpreter, and the
[import system](import.md#importsystem) may opt to leave it unset if it
has no semantic meaning (for example, a module loaded from a database).

#### Deprecated-removed
Deprecated since version 3.13, removed in version 3.15: Setting `__cached__` on a module while failing to set
`__spec__.cached` is deprecated. In Python 3.15,
`__cached__` will cease to be set or taken into consideration by
the import system or standard library.

#### Versionchanged
Changed in version 3.15: `__cached__` is no longer set.

#### Other writable attributes on module objects

As well as the import-related attributes listed above, module objects also have
the following writable attributes:

#### module.\_\_doc_\_

The module’s documentation string, or `None` if unavailable.
See also: [`__doc__ attributes`](../library/stdtypes.md#definition.__doc__).

#### module.\_\_annotations_\_

A dictionary containing [variable annotations](../glossary.md#term-variable-annotation)
collected during module body execution.  For best practices on working with
`__annotations__`, see [`annotationlib`](../library/annotationlib.md#module-annotationlib).

#### Versionchanged
Changed in version 3.14: Annotations are now [lazily evaluated](executionmodel.md#lazy-evaluation).
See [**PEP 649**](https://peps.python.org/pep-0649/).

#### module.\_\_annotate_\_

The [annotate function](../glossary.md#term-annotate-function) for this module, or `None` if the module has
no annotations. See also: [`__annotate__`](#object.__annotate__) attributes.

#### Versionadded
Added in version 3.14.

#### Module dictionaries

Module objects also have the following special read-only attribute:

<a id="index-49"></a>

#### module.\_\_dict_\_

The module’s namespace as a dictionary object. Uniquely among the attributes
listed here, `__dict__` cannot be accessed as a global variable from
within a module; it can only be accessed as an attribute on module objects.

**CPython implementation detail:** Because of the way CPython clears module dictionaries, the module
dictionary will be cleared when the module falls out of scope even if the
dictionary still has live references.  To avoid this, copy the dictionary
or keep the module around while using its dictionary directly.

<a id="class-attrs-and-methods"></a>

### Custom classes

Custom class types are typically created by class definitions (see section
[Class definitions](compound_stmts.md#class)).  A class has a namespace implemented by a dictionary object.
Class attribute references are translated to lookups in this dictionary, e.g.,
`C.x` is translated to `C.__dict__["x"]` (although there are a number of
hooks which allow for other means of locating attributes). When the attribute
name is not found there, the attribute search continues in the base classes.
This search of the base classes uses the C3 method resolution order which
behaves correctly even in the presence of ‘diamond’ inheritance structures
where there are multiple inheritance paths leading back to a common ancestor.
Additional details on the C3 MRO used by Python can be found at
[The Python 2.3 Method Resolution Order](../howto/mro.md#python-2-3-mro).

<a id="index-50"></a>

When a class attribute reference (for class `C`, say) would yield a
class method object, it is transformed into an instance method object whose
[`__self__`](#method.__self__) attribute is `C`.
When it would yield a [`staticmethod`](../library/functions.md#staticmethod) object,
it is transformed into the object wrapped by the static method
object. See section [Implementing Descriptors](#descriptors) for another way in which attributes
retrieved from a class may differ from those actually contained in its
[`__dict__`](#object.__dict__).

<a id="index-51"></a>

Class attribute assignments update the class’s dictionary, never the dictionary
of a base class.

<a id="index-52"></a>

A class object can be called (see above) to yield a class instance (see below).

#### Special attributes

<a id="index-53"></a>

| Attribute                          | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #### type.\_\_name_\_              | The class’s name.<br/>See also: [`__name__ attributes`](../library/stdtypes.md#definition.__name__).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| #### type.\_\_qualname_\_          | The class’s [qualified name](../glossary.md#term-qualified-name).<br/>See also: [`__qualname__ attributes`](../library/stdtypes.md#definition.__qualname__).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| #### type.\_\_module_\_            | The name of the module in which the class was defined.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| #### type.\_\_dict_\_              | A [`mapping proxy`](../library/types.md#types.MappingProxyType)<br/>providing a read-only view of the class’s namespace.<br/>See also: [`__dict__ attributes`](#object.__dict__).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| #### type.\_\_bases_\_             | A [`tuple`](../library/stdtypes.md#tuple) containing the class’s bases.<br/>In most cases, for a class defined as `class X(A, B, C)`,<br/>`X.__bases__` will be exactly equal to `(A, B, C)`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| #### type.\_\_base_\_              | **CPython implementation detail:** The single base class in the inheritance chain that is responsible<br/>for the memory layout of instances. This attribute corresponds to<br/>[`tp_base`](../c-api/typeobj.md#c.PyTypeObject.tp_base) at the C level.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| #### type.\_\_doc_\_               | The class’s documentation string, or `None` if undefined.<br/>Not inherited by subclasses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| #### type.\_\_annotations_\_       | A dictionary containing<br/>[variable annotations](../glossary.md#term-variable-annotation)<br/>collected during class body execution. See also:<br/>[`__annotations__ attributes`](#object.__annotations__).<br/><br/>For best practices on working with [`__annotations__`](#object.__annotations__),<br/>please see [`annotationlib`](../library/annotationlib.md#module-annotationlib). Use<br/>[`annotationlib.get_annotations()`](../library/annotationlib.md#annotationlib.get_annotations) instead of accessing this<br/>attribute directly.<br/><br/>#### WARNING<br/>Accessing the `__annotations__` attribute directly<br/>on a class object may return annotations for the wrong class, specifically<br/>in certain cases where the class, its base class, or a metaclass<br/>is defined under `from __future__ import annotations`.<br/>See [**749**](https://peps.python.org/pep-0749/#pep749-metaclasses) for details.<br/><br/>This attribute does not exist on certain builtin classes. On<br/>user-defined classes without `__annotations__`, it is an<br/>empty dictionary.<br/><br/>#### Versionchanged<br/>Changed in version 3.14: Annotations are now [lazily evaluated](executionmodel.md#lazy-evaluation).<br/>See [**PEP 649**](https://peps.python.org/pep-0649/). |
| #### type.\_\_annotate_\_()        | The [annotate function](../glossary.md#term-annotate-function) for this class, or `None`<br/>if the class has no annotations.<br/>See also: [`__annotate__ attributes`](#object.__annotate__).<br/><br/>#### Versionadded<br/>Added in version 3.14.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| #### type.\_\_type_params_\_       | A [`tuple`](../library/stdtypes.md#tuple) containing the [type parameters](compound_stmts.md#type-params) of<br/>a [generic class](compound_stmts.md#generic-classes).<br/><br/>#### Versionadded<br/>Added in version 3.12.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| #### type.\_\_static_attributes_\_ | A [`tuple`](../library/stdtypes.md#tuple) containing names of attributes of this class which are<br/>assigned through `self.X` from any function in its body.<br/><br/>#### Versionadded<br/>Added in version 3.13.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| #### type.\_\_firstlineno_\_       | The line number of the first line of the class definition,<br/>including decorators.<br/>Setting the [`__module__`](#type.__module__) attribute removes the<br/>`__firstlineno__` item from the type’s dictionary.<br/><br/>#### Versionadded<br/>Added in version 3.13.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| #### type.\_\_mro_\_               | The [`tuple`](../library/stdtypes.md#tuple) of classes that are considered when looking for<br/>base classes during method resolution.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

#### Special methods

In addition to the special attributes described above, all Python classes also
have the following two methods available:

#### type.mro()

This method can be overridden by a metaclass to customize the method
resolution order for its instances.  It is called at class instantiation,
and its result is stored in [`__mro__`](#type.__mro__).

#### type.\_\_subclasses_\_()

Each class keeps a list of weak references to its immediate subclasses. This
method returns a list of all those references still alive. The list is in
definition order. Example:

```pycon
>>> class A: pass
>>> class B(A): pass
>>> A.__subclasses__()
[<class 'B'>]
```

### Class instances

<a id="index-56"></a>

A class instance is created by calling a class object (see above).  A class
instance has a namespace implemented as a dictionary which is the first place
in which attribute references are searched.  When an attribute is not found
there, and the instance’s class has an attribute by that name, the search
continues with the class attributes.  If a class attribute is found that is a
user-defined function object, it is transformed into an instance method
object whose [`__self__`](#method.__self__) attribute is the instance.  Static method and
class method objects are also transformed; see above under “Classes”.  See
section [Implementing Descriptors](#descriptors) for another way in which attributes of a class
retrieved via its instances may differ from the objects actually stored in
the class’s [`__dict__`](#object.__dict__).  If no class attribute is found, and the
object’s class has a [`__getattr__()`](#object.__getattr__) method, that is called to satisfy
the lookup.

<a id="index-57"></a>

Attribute assignments and deletions update the instance’s dictionary, never a
class’s dictionary.  If the class has a [`__setattr__()`](#object.__setattr__) or
[`__delattr__()`](#object.__delattr__) method, this is called instead of updating the instance
dictionary directly.

<a id="index-58"></a>

Class instances can pretend to be numbers, sequences, or mappings if they have
methods with certain special names.  See section [Special method names](#specialnames).

#### Special attributes

<a id="index-59"></a>

#### object.\_\_class_\_

The class to which a class instance belongs.

#### object.\_\_dict_\_

A dictionary or other mapping object used to store an object’s (writable)
attributes. Not all instances have a `__dict__` attribute; see the
section on [\_\_slots_\_](#slots) for more details.

### I/O objects (also known as file objects)

<a id="index-60"></a>

A [file object](../glossary.md#term-file-object) represents an open file.  Various shortcuts are
available to create file objects: the [`open()`](../library/functions.md#open) built-in function, and
also [`os.popen()`](../library/os.md#os.popen), [`os.fdopen()`](../library/os.md#os.fdopen), and the
[`makefile()`](../library/socket.md#socket.socket.makefile) method of socket objects (and perhaps by
other functions or methods provided by extension modules).

File objects implement common methods, listed below, to simplify usage in
generic code. They are expected to be [With Statement Context Managers](#context-managers).

The objects `sys.stdin`, `sys.stdout` and `sys.stderr` are
initialized to file objects corresponding to the interpreter’s standard
input, output and error streams; they are all open in text mode and
therefore follow the interface defined by the [`io.TextIOBase`](../library/io.md#io.TextIOBase)
abstract class.

#### file.read(size=-1,)

Retrieve up to *size* data from the file. As a convenience if *size* is
unspecified or -1 retrieve all data available.

#### file.write(data,)

Store *data* to the file.

#### file.close()

Flush any buffers and close the underlying file.

### Internal types

<a id="index-61"></a>

A few types used internally by the interpreter are exposed to the user. Their
definitions may change with future versions of the interpreter, but they are
mentioned here for completeness.

<a id="code-objects"></a>

#### Code objects

<a id="index-62"></a>

Code objects represent *byte-compiled* executable Python code, or [bytecode](../glossary.md#term-bytecode).
The difference between a code object and a function object is that the function
object contains an explicit reference to the function’s globals (the module in
which it was defined), while a code object contains no context; also the default
argument values are stored in the function object, not in the code object
(because they represent values calculated at run-time).  Unlike function
objects, code objects are immutable and contain no references (directly or
indirectly) to mutable objects.

<a id="index-63"></a>

##### Special read-only attributes

| #### codeobject.co_name            | The function name                                                                                                                                                                                                                                                                                                                                                    |
|------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #### codeobject.co_qualname        | The fully qualified function name<br/><br/>#### Versionadded<br/>Added in version 3.11.                                                                                                                                                                                                                                                                              |
| #### codeobject.co_argcount        | The total number of positional [parameters](../glossary.md#term-parameter)<br/>(including positional-only parameters and parameters with default values)<br/>that the function has                                                                                                                                                                                   |
| #### codeobject.co_posonlyargcount | The number of positional-only [parameters](../glossary.md#term-parameter)<br/>(including arguments with default values) that the function has                                                                                                                                                                                                                        |
| #### codeobject.co_kwonlyargcount  | The number of keyword-only [parameters](../glossary.md#term-parameter)<br/>(including arguments with default values) that the function has                                                                                                                                                                                                                           |
| #### codeobject.co_nlocals         | The number of [local variables](executionmodel.md#naming) used by the function<br/>(including parameters)                                                                                                                                                                                                                                                            |
| #### codeobject.co_varnames        | A [`tuple`](../library/stdtypes.md#tuple) containing the names of the local variables in the<br/>function (starting with the parameter names)                                                                                                                                                                                                                        |
| #### codeobject.co_cellvars        | A [`tuple`](../library/stdtypes.md#tuple) containing the names of [local variables](executionmodel.md#naming)<br/>that are referenced from at least one [nested scope](../glossary.md#term-nested-scope) inside the function                                                                                                                                         |
| #### codeobject.co_freevars        | A [`tuple`](../library/stdtypes.md#tuple) containing the names of<br/>[free (closure) variables](../glossary.md#term-closure-variable) that a [nested scope](../glossary.md#term-nested-scope)<br/>references in an outer scope. See also [`function.__closure__`](#function.__closure__).<br/><br/>Note: references to global and builtin names are *not* included. |
| #### codeobject.co_code            | A string representing the sequence of [bytecode](../glossary.md#term-bytecode) instructions in<br/>the function                                                                                                                                                                                                                                                      |
| #### codeobject.co_consts          | A [`tuple`](../library/stdtypes.md#tuple) containing the literals used by the [bytecode](../glossary.md#term-bytecode) in<br/>the function                                                                                                                                                                                                                           |
| #### codeobject.co_names           | A [`tuple`](../library/stdtypes.md#tuple) containing the names used by the [bytecode](../glossary.md#term-bytecode) in<br/>the function                                                                                                                                                                                                                              |
| #### codeobject.co_filename        | The name of the file from which the code was compiled                                                                                                                                                                                                                                                                                                                |
| #### codeobject.co_firstlineno     | The line number of the first line of the function                                                                                                                                                                                                                                                                                                                    |
| #### codeobject.co_lnotab          | A string encoding the mapping from [bytecode](../glossary.md#term-bytecode) offsets to line<br/>numbers. For details, see the source code of the interpreter.<br/><br/>#### Deprecated<br/>Deprecated since version 3.12: This attribute of code objects is deprecated, and may be removed in<br/>Python 3.15.                                                       |
| #### codeobject.co_stacksize       | The required stack size of the code object                                                                                                                                                                                                                                                                                                                           |
| #### codeobject.co_flags           | An [`integer`](../library/functions.md#int) encoding a number of flags for the<br/>interpreter.                                                                                                                                                                                                                                                                      |

<a id="index-64"></a>

The following flag bits are defined for [`co_flags`](#codeobject.co_flags):
bit `0x04` is set if
the function uses the `*arguments` syntax to accept an arbitrary number of
positional arguments; bit `0x08` is set if the function uses the
`**keywords` syntax to accept arbitrary keyword arguments; bit `0x20` is set
if the function is a generator. See [Code Objects Bit Flags](../library/inspect.md#inspect-module-co-flags) for details
on the semantics of each flags that might be present.

Future feature declarations (for example, `from __future__ import division`) also use bits
in [`co_flags`](#codeobject.co_flags) to indicate whether a code object was compiled with a
particular feature enabled. See [`compiler_flag`](../library/__future__.md#future__._Feature.compiler_flag).

Other bits in [`co_flags`](#codeobject.co_flags) are reserved for internal use.

<a id="index-65"></a>

If a code object represents a function and has a docstring,
the [`CO_HAS_DOCSTRING`](../library/inspect.md#inspect.CO_HAS_DOCSTRING) bit is set in [`co_flags`](#codeobject.co_flags)
and the first item in [`co_consts`](#codeobject.co_consts) is
the docstring of the function.

##### Methods on code objects

#### codeobject.co_positions()

Returns an iterable over the source code positions of each [bytecode](../glossary.md#term-bytecode)
instruction in the code object.

The iterator returns [`tuple`](../library/stdtypes.md#tuple)s containing the `(start_line, end_line,
start_column, end_column)`. The *i-th* tuple corresponds to the
position of the source code that compiled to the *i-th* code unit.
Column information is 0-indexed utf-8 byte offsets on the given source
line.

This positional information can be missing. A non-exhaustive lists of
cases where this may happen:

- Running the interpreter with [`-X`](../using/cmdline.md#cmdoption-X) `no_debug_ranges`.
- Loading a pyc file compiled while using [`-X`](../using/cmdline.md#cmdoption-X) `no_debug_ranges`.
- Position tuples corresponding to artificial instructions.
- Line and column numbers that can’t be represented due to
  implementation specific limitations.

When this occurs, some or all of the tuple elements can be
[`None`](../library/constants.md#None).

#### Versionadded
Added in version 3.11.

#### NOTE
This feature requires storing column positions in code objects which may
result in a small increase of disk usage of compiled Python files or
interpreter memory usage. To avoid storing the extra information and/or
deactivate printing the extra traceback information, the
[`-X`](../using/cmdline.md#cmdoption-X) `no_debug_ranges` command line flag or the [`PYTHONNODEBUGRANGES`](../using/cmdline.md#envvar-PYTHONNODEBUGRANGES)
environment variable can be used.

#### codeobject.co_lines()

Returns an iterator that yields information about successive ranges of
[bytecode](../glossary.md#term-bytecode)s. Each item yielded is a `(start, end, lineno)`
[`tuple`](../library/stdtypes.md#tuple):

* `start` (an [`int`](../library/functions.md#int)) represents the offset (inclusive) of the start
  of the [bytecode](../glossary.md#term-bytecode) range
* `end` (an [`int`](../library/functions.md#int)) represents the offset (exclusive) of the end of
  the [bytecode](../glossary.md#term-bytecode) range
* `lineno` is an [`int`](../library/functions.md#int) representing the line number of the
  [bytecode](../glossary.md#term-bytecode) range, or `None` if the bytecodes in the given range
  have no line number

The items yielded will have the following properties:

* The first range yielded will have a `start` of 0.
* The `(start, end)` ranges will be non-decreasing and consecutive. That
  is, for any pair of [`tuple`](../library/stdtypes.md#tuple)s, the `start` of the second will be
  equal to the `end` of the first.
* No range will be backwards: `end >= start` for all triples.
* The last [`tuple`](../library/stdtypes.md#tuple) yielded will have `end` equal to the size of the
  [bytecode](../glossary.md#term-bytecode).

Zero-width ranges, where `start == end`, are allowed. Zero-width ranges
are used for lines that are present in the source code, but have been
eliminated by the [bytecode](../glossary.md#term-bytecode) compiler.

#### Versionadded
Added in version 3.10.

#### SEE ALSO
[**PEP 626**](https://peps.python.org/pep-0626/) - Precise line numbers for debugging and other tools.
: The PEP that introduced the `co_lines()` method.

#### codeobject.replace(\*\*kwargs)

Return a copy of the code object with new values for the specified fields.

Code objects are also supported by the generic function [`copy.replace()`](../library/copy.md#copy.replace).

#### Versionadded
Added in version 3.8.

<a id="frame-objects"></a>

#### Frame objects

<a id="index-68"></a>

Frame objects represent execution frames.  They may occur in
[traceback objects](#traceback-objects),
and are also passed to registered trace functions.

<a id="index-69"></a>

##### Special read-only attributes

| #### frame.f_back      | Points to the previous stack frame (towards the caller),<br/>or `None` if this is the bottom stack frame                                                                                                                                                                                                                         |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #### frame.f_code      | The [code object](#code-objects) being executed in this frame.<br/>Accessing this attribute raises an [auditing event](../library/sys.md#auditing)<br/>`object.__getattr__` with arguments `obj` and `"f_code"`.                                                                                                                 |
| #### frame.f_locals    | The mapping used by the frame to look up<br/>[local variables](executionmodel.md#naming).<br/>If the frame refers to an [optimized scope](../glossary.md#term-optimized-scope),<br/>this may return a write-through proxy object.<br/><br/>#### Versionchanged<br/>Changed in version 3.13: Return a proxy for optimized scopes. |
| #### frame.f_globals   | The dictionary used by the frame to look up<br/>[global variables](executionmodel.md#naming)                                                                                                                                                                                                                                     |
| #### frame.f_builtins  | The dictionary used by the frame to look up<br/>[built-in (intrinsic) names](executionmodel.md#naming)                                                                                                                                                                                                                           |
| #### frame.f_lasti     | The “precise instruction” of the frame object<br/>(this is an index into the [bytecode](../glossary.md#term-bytecode) string of the<br/>[code object](#code-objects))                                                                                                                                                            |
| #### frame.f_generator | The [generator](../glossary.md#term-generator) or [coroutine](../glossary.md#term-coroutine) object that owns this frame,<br/>or `None` if the frame is a normal function.<br/><br/>#### Versionadded<br/>Added in version 3.14.                                                                                                 |

<a id="index-70"></a>

##### Special writable attributes

| #### frame.f_trace         | If not `None`, this is a function called for various events during<br/>code execution (this is used by debuggers). Normally an event is<br/>triggered for each new source line (see [`f_trace_lines`](#frame.f_trace_lines)).                                   |
|----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #### frame.f_trace_lines   | Set this attribute to [`False`](../library/constants.md#False) to disable triggering a tracing<br/>event for each source line.                                                                                                                                  |
| #### frame.f_trace_opcodes | Set this attribute to [`True`](../library/constants.md#True) to allow per-opcode events to be<br/>requested. Note that this may lead to<br/>undefined interpreter behaviour if exceptions raised by the trace<br/>function escape to the function being traced. |
| #### frame.f_lineno        | The current line number of the frame – writing to this<br/>from within a trace function jumps to the given line (only for the bottom-most<br/>frame).  A debugger can implement a Jump command (aka Set Next Statement)<br/>by writing to this attribute.       |

##### Frame object methods

Frame objects support one method:

#### frame.clear()

This method clears all references to [local variables](executionmodel.md#naming) held by the
frame.  Also, if the frame belonged to a [generator](../glossary.md#term-generator), the generator
is finalized.  This helps break reference cycles involving frame
objects (for example when catching an [exception](../library/exceptions.md#bltin-exceptions)
and storing its [traceback](#traceback-objects) for later use).

[`RuntimeError`](../library/exceptions.md#RuntimeError) is raised if the frame is currently executing
or suspended.

#### Versionadded
Added in version 3.4.

#### Versionchanged
Changed in version 3.13: Attempting to clear a suspended frame raises [`RuntimeError`](../library/exceptions.md#RuntimeError)
(as has always been the case for executing frames).

<a id="traceback-objects"></a>

#### Traceback objects

<a id="index-71"></a>

Traceback objects represent the stack trace of an [exception](../tutorial/errors.md#tut-errors).
A traceback object
is implicitly created when an exception occurs, and may also be explicitly
created by calling [`types.TracebackType`](../library/types.md#types.TracebackType).

#### Versionchanged
Changed in version 3.7: Traceback objects can now be explicitly instantiated from Python code.

For implicitly created tracebacks, when the search for an exception handler
unwinds the execution stack, at each unwound level a traceback object is
inserted in front of the current traceback.  When an exception handler is
entered, the stack trace is made available to the program. (See section
[The try statement](compound_stmts.md#try).) It is accessible as the third item of the
tuple returned by [`sys.exc_info()`](../library/sys.md#sys.exc_info), and as the
[`__traceback__`](../library/exceptions.md#BaseException.__traceback__) attribute
of the caught exception.

When the program contains no suitable
handler, the stack trace is written (nicely formatted) to the standard error
stream; if the interpreter is interactive, it is also made available to the user
as [`sys.last_traceback`](../library/sys.md#sys.last_traceback).

For explicitly created tracebacks, it is up to the creator of the traceback
to determine how the [`tb_next`](#traceback.tb_next) attributes should be linked to
form a full stack trace.

<a id="index-72"></a>

Special read-only attributes:

| #### traceback.tb_frame   | Points to the execution [frame](#frame-objects) of the current<br/>level.<br/><br/>Accessing this attribute raises an<br/>[auditing event](../library/sys.md#auditing) `object.__getattr__` with arguments<br/>`obj` and `"tb_frame"`.   |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| #### traceback.tb_lineno  | Gives the line number where the exception occurred                                                                                                                                                                                       |
| #### traceback.tb_lasti   | Indicates the “precise instruction”.                                                                                                                                                                                                     |

The line number and last instruction in the traceback may differ from the
line number of its [frame object](#frame-objects) if the exception
occurred in a
[`try`](compound_stmts.md#try) statement with no matching except clause or with a
[`finally`](compound_stmts.md#finally) clause.

<a id="index-73"></a>

#### traceback.tb_next

The special writable attribute `tb_next` is the next level in the
stack trace (towards the frame where the exception occurred), or `None` if
there is no next level.

#### Versionchanged
Changed in version 3.7: This attribute is now writable

#### Slice objects

<a id="index-74"></a>

Slice objects are used to represent slices for
[`__getitem__()`](#object.__getitem__)
methods.  They are also created by the built-in [`slice()`](../library/functions.md#slice) function.

#### Versionadded
Added in version 3.15: The [`slice()`](../library/functions.md#slice) type now supports [subscription](expressions.md#subscriptions). For
example, `slice[float]` may be used in type annotations to indicate a slice
containing [`float`](../library/functions.md#float) objects.

<a id="index-75"></a>

Special read-only attributes: [`start`](../library/functions.md#slice.start) is the lower bound;
[`stop`](../library/functions.md#slice.stop) is the upper bound; [`step`](../library/functions.md#slice.step) is the step
value; each is `None` if omitted.  These attributes can have any type.

Slice objects support one method:

#### slice.indices(self, length)

This method takes a single integer argument *length* and computes
information about the slice that the slice object would describe if
applied to a sequence of *length* items.  It returns a tuple of three
integers; respectively these are the *start* and *stop* indices and the
*step* or stride length of the slice. Missing or out-of-bounds indices
are handled in a manner consistent with regular slices.

#### Static method objects

Static method objects provide a way of defeating the transformation of function
objects to method objects described above. A static method object is a wrapper
around any other object, usually a user-defined method object. When a static
method object is retrieved from a class or a class instance, the object actually
returned is the wrapped object, which is not subject to any further
transformation. Static method objects are also callable. Static method
objects are created by the built-in [`staticmethod()`](../library/functions.md#staticmethod) constructor.

#### Class method objects

A class method object, like a static method object, is a wrapper around another
object that alters the way in which that object is retrieved from classes and
class instances. The behaviour of class method objects upon such retrieval is
described above, under [“instance methods”](#instance-methods). Class method objects are created
by the built-in [`classmethod()`](../library/functions.md#classmethod) constructor.

<a id="specialnames"></a>

## Special method names

<a id="index-76"></a>

A class can implement certain operations that are invoked by special syntax
(such as arithmetic operations or subscripting and slicing) by defining methods
with special names. This is Python’s approach to *operator overloading*,
allowing classes to define their own behavior with respect to language
operators.  For instance, if a class defines a method named
[`__getitem__()`](#object.__getitem__),
and `x` is an instance of this class, then `x[i]` is roughly equivalent
to `type(x).__getitem__(x, i)`.  Except where mentioned, attempts to execute an
operation raise an exception when no appropriate method is defined (typically
[`AttributeError`](../library/exceptions.md#AttributeError) or [`TypeError`](../library/exceptions.md#TypeError)).

Setting a special method to `None` indicates that the corresponding
operation is not available.  For example, if a class sets
[`__iter__()`](#object.__iter__) to `None`, the class is not iterable, so calling
[`iter()`](../library/functions.md#iter) on its instances will raise a [`TypeError`](../library/exceptions.md#TypeError) (without
falling back to [`__getitem__()`](#object.__getitem__)). <sup>[2](#id21)</sup>

When implementing a class that emulates any built-in type, it is important that
the emulation only be implemented to the degree that it makes sense for the
object being modelled.  For example, some sequences may work well with retrieval
of individual elements, but extracting a slice may not make sense.
(One example of this is the [NodeList](../library/xml.dom.md#dom-nodelist-objects) interface
in the W3C’s Document Object Model.)

<a id="customization"></a>

### Basic customization

#### object.\_\_new_\_(cls)

<a id="index-77"></a>

Called to create a new instance of class *cls*.  [`__new__()`](#object.__new__) is a static
method (special-cased so you need not declare it as such) that takes the class
of which an instance was requested as its first argument.  The remaining
arguments are those passed to the object constructor expression (the call to the
class).  The return value of [`__new__()`](#object.__new__) should be the new object instance
(usually an instance of *cls*).

Typical implementations create a new instance of the class by invoking the
superclass’s [`__new__()`](#object.__new__) method using `super().__new__(cls[, ...])`
with appropriate arguments and then modifying the newly created instance
as necessary before returning it.

If [`__new__()`](#object.__new__) is invoked during object construction and it returns an
instance of *cls*, then the new instance’s [`__init__()`](#object.__init__) method
will be invoked like `__init__(self[, ...])`, where *self* is the new instance
and the remaining arguments are the same as were passed to the object constructor.

If [`__new__()`](#object.__new__) does not return an instance of *cls*, then the new instance’s
[`__init__()`](#object.__init__) method will not be invoked.

[`__new__()`](#object.__new__) is intended mainly to allow subclasses of immutable types (like
int, str, or tuple) to customize instance creation.  It is also commonly
overridden in custom metaclasses in order to customize class creation.

#### object.\_\_init_\_(self)

<a id="index-78"></a>

Called after the instance has been created (by [`__new__()`](#object.__new__)), but before
it is returned to the caller.  The arguments are those passed to the
class constructor expression.  If a base class has an [`__init__()`](#object.__init__)
method, the derived class’s [`__init__()`](#object.__init__) method, if any, must explicitly
call it to ensure proper initialization of the base class part of the
instance; for example: `super().__init__([args...])`.

Because [`__new__()`](#object.__new__) and [`__init__()`](#object.__init__) work together in constructing
objects ([`__new__()`](#object.__new__) to create it, and [`__init__()`](#object.__init__) to customize it),
no non-`None` value may be returned by [`__init__()`](#object.__init__); doing so will
cause a [`TypeError`](../library/exceptions.md#TypeError) to be raised at runtime.

#### object.\_\_del_\_(self)

<a id="index-79"></a>

Called when the instance is about to be destroyed.  This is also called a
finalizer or (improperly) a destructor.  If a base class has a
[`__del__()`](#object.__del__) method, the derived class’s [`__del__()`](#object.__del__) method,
if any, must explicitly call it to ensure proper deletion of the base
class part of the instance.

It is possible (though not recommended!) for the [`__del__()`](#object.__del__) method
to postpone destruction of the instance by creating a new reference to
it.  This is called object *resurrection*.  It is implementation-dependent
whether [`__del__()`](#object.__del__) is called a second time when a resurrected object
is about to be destroyed; the current [CPython](../glossary.md#term-CPython) implementation
only calls it once.

It is not guaranteed that [`__del__()`](#object.__del__) methods are called for objects
that still exist when the interpreter exits.
[`weakref.finalize`](../library/weakref.md#weakref.finalize) provides a straightforward way to register
a cleanup function to be called when an object is garbage collected.

#### NOTE
`del x` doesn’t directly call `x.__del__()` — the former decrements
the reference count for `x` by one, and the latter is only called when
`x`’s reference count reaches zero.

**CPython implementation detail:** It is possible for a reference cycle to prevent the reference count
of an object from going to zero.  In this case, the cycle will be
later detected and deleted by the [cyclic garbage collector](../glossary.md#term-garbage-collection).  A common cause of reference cycles is when
an exception has been caught in a local variable.  The frame’s
locals then reference the exception, which references its own
traceback, which references the locals of all frames caught in the
traceback.

#### SEE ALSO
Documentation for the [`gc`](../library/gc.md#module-gc) module.

#### WARNING
Due to the precarious circumstances under which [`__del__()`](#object.__del__) methods are
invoked, exceptions that occur during their execution are ignored, and a warning
is printed to `sys.stderr` instead.  In particular:

* [`__del__()`](#object.__del__) can be invoked when arbitrary code is being executed,
  including from any arbitrary thread.  If [`__del__()`](#object.__del__) needs to take
  a lock or invoke any other blocking resource, it may deadlock as
  the resource may already be taken by the code that gets interrupted
  to execute [`__del__()`](#object.__del__).
* [`__del__()`](#object.__del__) can be executed during interpreter shutdown.  As a
  consequence, the global variables it needs to access (including other
  modules) may already have been deleted or set to `None`. Python
  guarantees that globals whose name begins with a single underscore
  are deleted from their module before other globals are deleted; if
  no other references to such globals exist, this may help in assuring
  that imported modules are still available at the time when the
  [`__del__()`](#object.__del__) method is called.

#### object.\_\_repr_\_(self)

Called by the [`repr()`](../library/functions.md#repr) built-in function to compute the “official” string
representation of an object.  If at all possible, this should look like a
valid Python expression that could be used to recreate an object with the
same value (given an appropriate environment).  If this is not possible, a
string of the form `<...some useful description...>` should be returned.
The return value must be a string object. If a class defines [`__repr__()`](#object.__repr__)
but not [`__str__()`](#object.__str__), then [`__repr__()`](#object.__repr__) is also used when an
“informal” string representation of instances of that class is required.

This is typically used for debugging, so it is important that the representation
is information-rich and unambiguous. A default implementation is provided by the
[`object`](../library/functions.md#object) class itself.

#### object.\_\_str_\_(self)

Called by [`str(object)`](../library/stdtypes.md#str), the default [`__format__()`](#object.__format__) implementation,
and the built-in function [`print()`](../library/functions.md#print), to compute the “informal” or nicely
printable string representation of an object.  The return value must be a
[str](../library/stdtypes.md#textseq) object.

This method differs from [`object.__repr__()`](#object.__repr__) in that there is no
expectation that [`__str__()`](#object.__str__) return a valid Python expression: a more
convenient or concise representation can be used.

The default implementation defined by the built-in type [`object`](../library/functions.md#object)
calls [`object.__repr__()`](#object.__repr__).

<!-- XXX what about subclasses of string? -->

#### object.\_\_bytes_\_(self)

<a id="index-82"></a>

Called by [bytes](../library/functions.md#func-bytes) to compute a byte-string representation
of an object. This should return a [`bytes`](../library/stdtypes.md#bytes) object. The [`object`](../library/functions.md#object)
class itself does not provide this method.

#### object.\_\_format_\_(self, format_spec)

Called by the [`format()`](../library/functions.md#format) built-in function,
and by extension, evaluation of [formatted string literals](lexical_analysis.md#f-strings) and the [`str.format()`](../library/stdtypes.md#str.format) method, to produce a “formatted”
string representation of an object. The *format_spec* argument is
a string that contains a description of the formatting options desired.
The interpretation of the *format_spec* argument is up to the type
implementing [`__format__()`](#object.__format__), however most classes will either
delegate formatting to one of the built-in types, or use a similar
formatting option syntax.

See [Format specification mini-language](../library/string.md#formatspec) for a description of the standard formatting syntax.

The return value must be a string object.

The default implementation by the [`object`](../library/functions.md#object) class should be given
an empty *format_spec* string. It delegates to [`__str__()`](#object.__str__).

#### Versionchanged
Changed in version 3.4: The \_\_format_\_ method of `object` itself raises a [`TypeError`](../library/exceptions.md#TypeError)
if passed any non-empty string.

#### Versionchanged
Changed in version 3.7: `object.__format__(x, '')` is now equivalent to `str(x)` rather
than `format(str(x), '')`.

<a id="richcmpfuncs"></a>

#### object.\_\_lt_\_(self, other)

#### object.\_\_le_\_(self, other)

#### object.\_\_eq_\_(self, other)

#### object.\_\_ne_\_(self, other)

#### object.\_\_gt_\_(self, other)

#### object.\_\_ge_\_(self, other)

<a id="index-84"></a>

These are the so-called “rich comparison” methods. The correspondence between
operator symbols and method names is as follows: `x<y` calls `x.__lt__(y)`,
`x<=y` calls `x.__le__(y)`, `x==y` calls `x.__eq__(y)`, `x!=y` calls
`x.__ne__(y)`, `x>y` calls `x.__gt__(y)`, and `x>=y` calls
`x.__ge__(y)`.

A rich comparison method may return the singleton [`NotImplemented`](../library/constants.md#NotImplemented) if it does
not implement the operation for a given pair of arguments. By convention,
`False` and `True` are returned for a successful comparison. However, these
methods can return any value, so if the comparison operator is used in a Boolean
context (e.g., in the condition of an `if` statement), Python will call
[`bool()`](../library/functions.md#bool) on the value to determine if the result is true or false.

By default, `object` implements [`__eq__()`](#object.__eq__) by using `is`, returning
[`NotImplemented`](../library/constants.md#NotImplemented) in the case of a false comparison:
`True if x is y else NotImplemented`. For [`__ne__()`](#object.__ne__), by default it
delegates to [`__eq__()`](#object.__eq__) and inverts the result unless it is
`NotImplemented`.  There are no other implied relationships among the
comparison operators or default implementations; for example, the truth of
`(x<y or x==y)` does not imply `x<=y`. To automatically generate ordering
operations from a single root operation, see [`functools.total_ordering()`](../library/functools.md#functools.total_ordering).

By default, the [`object`](../library/functions.md#object) class provides implementations consistent
with [Value comparisons](expressions.md#expressions-value-comparisons): equality compares according to
object identity, and order comparisons raise [`TypeError`](../library/exceptions.md#TypeError). Each default
method may generate these results directly, but may also return
[`NotImplemented`](../library/constants.md#NotImplemented).

See the paragraph on [`__hash__()`](#object.__hash__) for
some important notes on creating [hashable](../glossary.md#term-hashable) objects which support
custom comparison operations and are usable as dictionary keys.

There are no swapped-argument versions of these methods (to be used when the
left argument does not support the operation but the right argument does);
rather, [`__lt__()`](#object.__lt__) and [`__gt__()`](#object.__gt__) are each other’s reflection,
[`__le__()`](#object.__le__) and [`__ge__()`](#object.__ge__) are each other’s reflection, and
[`__eq__()`](#object.__eq__) and [`__ne__()`](#object.__ne__) are their own reflection.
If the operands are of different types, and the right operand’s type is
a direct or indirect subclass of the left operand’s type,
the reflected method of the right operand has priority, otherwise
the left operand’s method has priority.  Virtual subclassing is
not considered.

When no appropriate method returns any value other than [`NotImplemented`](../library/constants.md#NotImplemented), the
`==` and `!=` operators will fall back to `is` and `is not`, respectively.

#### object.\_\_hash_\_(self)

<a id="index-85"></a>

Called by built-in function [`hash()`](../library/functions.md#hash) and for operations on members of
hashed collections including [`set`](../library/stdtypes.md#set), [`frozenset`](../library/stdtypes.md#frozenset), and
[`dict`](../library/stdtypes.md#dict).  The `__hash__()` method should return an integer. The only required
property is that objects which compare equal have the same hash value; it is
advised to mix together the hash values of the components of the object that
also play a part in comparison of objects by packing them into a tuple and
hashing the tuple. Example:

```python3
def __hash__(self):
    return hash((self.name, self.nick, self.color))
```

#### NOTE
[`hash()`](../library/functions.md#hash) truncates the value returned from an object’s custom
[`__hash__()`](#object.__hash__) method to the size of a [`Py_ssize_t`](../c-api/intro.md#c.Py_ssize_t).  This is
typically 8 bytes on 64-bit builds and 4 bytes on 32-bit builds.  If an
object’s   [`__hash__()`](#object.__hash__) must interoperate on builds of different bit
sizes, be sure to check the width on all supported builds.  An easy way
to do this is with
`python -c "import sys; print(sys.hash_info.width)"`.

If a class does not define an [`__eq__()`](#object.__eq__) method it should not define a
[`__hash__()`](#object.__hash__) operation either; if it defines [`__eq__()`](#object.__eq__) but not
[`__hash__()`](#object.__hash__), its instances will not be usable as items in hashable
collections.  If a class defines mutable objects and implements an
[`__eq__()`](#object.__eq__) method, it should not implement [`__hash__()`](#object.__hash__), since the
implementation of [hashable](../glossary.md#term-hashable) collections requires that a key’s hash value is
immutable (if the object’s hash value changes, it will be in the wrong hash
bucket).

User-defined classes have [`__eq__()`](#object.__eq__) and [`__hash__()`](#object.__hash__) methods
by default (inherited from the [`object`](../library/functions.md#object) class); with them, all objects compare
unequal (except with themselves) and `x.__hash__()` returns an appropriate
value such that `x == y` implies both that `x is y` and `hash(x) == hash(y)`.

A class that overrides [`__eq__()`](#object.__eq__) and does not define [`__hash__()`](#object.__hash__)
will have its [`__hash__()`](#object.__hash__) implicitly set to `None`.  When the
[`__hash__()`](#object.__hash__) method of a class is `None`, instances of the class will
raise an appropriate [`TypeError`](../library/exceptions.md#TypeError) when a program attempts to retrieve
their hash value, and will also be correctly identified as unhashable when
checking `isinstance(obj, collections.abc.Hashable)`.

If a class that overrides [`__eq__()`](#object.__eq__) needs to retain the implementation
of [`__hash__()`](#object.__hash__) from a parent class, the interpreter must be told this
explicitly by setting `__hash__ = <ParentClass>.__hash__`.

If a class that does not override [`__eq__()`](#object.__eq__) wishes to suppress hash
support, it should include `__hash__ = None` in the class definition.
A class which defines its own [`__hash__()`](#object.__hash__) that explicitly raises
a [`TypeError`](../library/exceptions.md#TypeError) would be incorrectly identified as hashable by
an `isinstance(obj, collections.abc.Hashable)` call.

#### NOTE
By default, the [`__hash__()`](#object.__hash__) values of str and bytes objects are
“salted” with an unpredictable random value.  Although they
remain constant within an individual Python process, they are not
predictable between repeated invocations of Python.

This is intended to provide protection against a denial-of-service caused
by carefully chosen inputs that exploit the worst case performance of a
dict insertion, *O*(*n*<sub>2</sub>) complexity.  See
[https://ocert.org/advisories/ocert-2011-003.html](https://ocert.org/advisories/ocert-2011-003.html) for details.

Changing hash values affects the iteration order of sets.
Python has never made guarantees about this ordering
(and it typically varies between 32-bit and 64-bit builds).

See also [`PYTHONHASHSEED`](../using/cmdline.md#envvar-PYTHONHASHSEED).

#### Versionchanged
Changed in version 3.3: Hash randomization is enabled by default.

#### object.\_\_bool_\_(self)

<a id="index-87"></a>

Called to implement truth value testing and the built-in operation
`bool()`; should return `False` or `True`.  When this method is not
defined, [`__len__()`](#object.__len__) is called, if it is defined, and the object is
considered true if its result is nonzero.  If a class defines neither
`__len__()` nor `__bool__()` (which is true of the [`object`](../library/functions.md#object)
class itself), all its instances are considered true.

<a id="attribute-access"></a>

### Customizing attribute access

The following methods can be defined to customize the meaning of attribute
access (use of, assignment to, or deletion of `x.name`) for class instances.

<!-- XXX explain how descriptors interfere here! -->

#### object.\_\_getattr_\_(self, name)

Called when the default attribute access fails with an [`AttributeError`](../library/exceptions.md#AttributeError)
(either [`__getattribute__()`](#object.__getattribute__) raises an [`AttributeError`](../library/exceptions.md#AttributeError) because
*name* is not an instance attribute or an attribute in the class tree
for `self`; or [`__get__()`](#object.__get__) of a *name* property raises
[`AttributeError`](../library/exceptions.md#AttributeError)).  This method should either return the (computed)
attribute value or raise an [`AttributeError`](../library/exceptions.md#AttributeError) exception.
The [`object`](../library/functions.md#object) class itself does not provide this method.

Note that if the attribute is found through the normal mechanism,
[`__getattr__()`](#object.__getattr__) is not called.  (This is an intentional asymmetry between
[`__getattr__()`](#object.__getattr__) and [`__setattr__()`](#object.__setattr__).) This is done both for efficiency
reasons and because otherwise [`__getattr__()`](#object.__getattr__) would have no way to access
other attributes of the instance.  Note that at least for instance variables,
you can take total control by not inserting any values in the instance attribute
dictionary (but instead inserting them in another object).  See the
[`__getattribute__()`](#object.__getattribute__) method below for a way to actually get total control
over attribute access.

#### object.\_\_getattribute_\_(self, name)

Called unconditionally to implement attribute accesses for instances of the
class. If the class also defines [`__getattr__()`](#object.__getattr__), the latter will not be
called unless [`__getattribute__()`](#object.__getattribute__) either calls it explicitly or raises an
[`AttributeError`](../library/exceptions.md#AttributeError). This method should return the (computed) attribute value
or raise an [`AttributeError`](../library/exceptions.md#AttributeError) exception. In order to avoid infinite
recursion in this method, its implementation should always call the base class
method with the same name to access any attributes it needs, for example,
`object.__getattribute__(self, name)`.

#### NOTE
This method may still be bypassed when looking up special methods as the
result of implicit invocation via language syntax or
[built-in functions](#builtin-functions).
See [Special method lookup](#special-lookup).

For certain sensitive attribute accesses, raises an
[auditing event](../library/sys.md#auditing) `object.__getattr__` with arguments
`obj` and `name`.

#### object.\_\_setattr_\_(self, name, value)

Called when an attribute assignment is attempted.  This is called instead of
the normal mechanism (i.e. store the value in the instance dictionary).
*name* is the attribute name, *value* is the value to be assigned to it.

If [`__setattr__()`](#object.__setattr__) wants to assign to an instance attribute, it should
call the base class method with the same name, for example,
`object.__setattr__(self, name, value)`.

For certain sensitive attribute assignments, raises an
[auditing event](../library/sys.md#auditing) `object.__setattr__` with arguments
`obj`, `name`, `value`.

#### object.\_\_delattr_\_(self, name)

Like [`__setattr__()`](#object.__setattr__) but for attribute deletion instead of assignment.  This
should only be implemented if `del obj.name` is meaningful for the object.

For certain sensitive attribute deletions, raises an
[auditing event](../library/sys.md#auditing) `object.__delattr__` with arguments
`obj` and `name`.

#### object.\_\_dir_\_(self)

Called when [`dir()`](../library/functions.md#dir) is called on the object. An iterable must be
returned. [`dir()`](../library/functions.md#dir) converts the returned iterable to a list and sorts it.

#### Customizing module attribute access

<a id="index-88"></a>

#### module.\_\_getattr_\_()

#### module.\_\_dir_\_()

Special names `__getattr__` and `__dir__` can be also used to customize
access to module attributes. The `__getattr__` function at the module level
should accept one argument which is the name of an attribute and return the
computed value or raise an [`AttributeError`](../library/exceptions.md#AttributeError). If an attribute is
not found on a module object through the normal lookup, i.e.
[`object.__getattribute__()`](#object.__getattribute__), then `__getattr__` is searched in
the module `__dict__` before raising an [`AttributeError`](../library/exceptions.md#AttributeError). If found,
it is called with the attribute name and the result is returned.

The `__dir__` function should accept no arguments, and return an iterable of
strings that represents the names accessible on module. If present, this
function overrides the standard [`dir()`](../library/functions.md#dir) search on a module.

#### module.\_\_class_\_

For a more fine grained customization of the module behavior (setting
attributes, properties, etc.), one can set the `__class__` attribute of
a module object to a subclass of [`types.ModuleType`](../library/types.md#types.ModuleType). For example:

```python3
import sys
from types import ModuleType

class VerboseModule(ModuleType):
    def __repr__(self):
        return f'Verbose {self.__name__}'

    def __setattr__(self, attr, value):
        print(f'Setting {attr}...')
        super().__setattr__(attr, value)

sys.modules[__name__].__class__ = VerboseModule
```

#### NOTE
Defining module `__getattr__` and setting module `__class__` only
affect lookups made using the attribute access syntax – directly accessing
the module globals (whether by code within the module, or via a reference
to the module’s globals dictionary) is unaffected.

#### Versionchanged
Changed in version 3.5: `__class__` module attribute is now writable.

#### Versionadded
Added in version 3.7: `__getattr__` and `__dir__` module attributes.

#### SEE ALSO
[**PEP 562**](https://peps.python.org/pep-0562/) - Module \_\_getattr_\_ and \_\_dir_\_
: Describes the `__getattr__` and `__dir__` functions on modules.

<a id="descriptors"></a>

#### Implementing Descriptors

The following methods only apply when an instance of the class containing the
method (a so-called *descriptor* class) appears in an *owner* class (the
descriptor must be in either the owner’s class dictionary or in the class
dictionary for one of its parents).  In the examples below, “the attribute”
refers to the attribute whose name is the key of the property in the owner
class’ [`__dict__`](#object.__dict__).  The [`object`](../library/functions.md#object) class itself does not
implement any of these protocols.

#### object.\_\_get_\_(self, instance, owner=None)

Called to get the attribute of the owner class (class attribute access) or
of an instance of that class (instance attribute access). The optional
*owner* argument is the owner class, while *instance* is the instance that
the attribute was accessed through, or `None` when the attribute is
accessed through the *owner*.

This method should return the computed attribute value or raise an
[`AttributeError`](../library/exceptions.md#AttributeError) exception.

[**PEP 252**](https://peps.python.org/pep-0252/) specifies that [`__get__()`](#object.__get__) is callable with one or two
arguments.  Python’s own built-in descriptors support this specification;
however, it is likely that some third-party tools have descriptors
that require both arguments.  Python’s own [`__getattribute__()`](#object.__getattribute__)
implementation always passes in both arguments whether they are required
or not.

#### object.\_\_set_\_(self, instance, value)

Called to set the attribute on an instance *instance* of the owner class to a
new value, *value*.

Note, adding [`__set__()`](#object.__set__) or [`__delete__()`](#object.__delete__) changes the kind of
descriptor to a “data descriptor”.  See [Invoking Descriptors](#descriptor-invocation) for
more details.

#### object.\_\_delete_\_(self, instance)

Called to delete the attribute on an instance *instance* of the owner class.

Instances of descriptors may also have the `__objclass__` attribute
present:

#### object.\_\_objclass_\_

The attribute `__objclass__` is interpreted by the [`inspect`](../library/inspect.md#module-inspect) module
as specifying the class where this object was defined (setting this
appropriately can assist in runtime introspection of dynamic class attributes).
For callables, it may indicate that an instance of the given type (or a
subclass) is expected or required as the first positional argument (for example,
CPython sets this attribute for unbound methods that are implemented in C).

<a id="descriptor-invocation"></a>

#### Invoking Descriptors

In general, a descriptor is an object attribute with “binding behavior”, one
whose attribute access has been overridden by methods in the descriptor
protocol:  [`__get__()`](#object.__get__), [`__set__()`](#object.__set__), and
[`__delete__()`](#object.__delete__). If any of
those methods are defined for an object, it is said to be a descriptor.

The default behavior for attribute access is to get, set, or delete the
attribute from an object’s dictionary. For instance, `a.x` has a lookup chain
starting with `a.__dict__['x']`, then `type(a).__dict__['x']`, and
continuing through the base classes of `type(a)` excluding metaclasses.

However, if the looked-up value is an object defining one of the descriptor
methods, then Python may override the default behavior and invoke the descriptor
method instead.  Where this occurs in the precedence chain depends on which
descriptor methods were defined and how they were called.

The starting point for descriptor invocation is a binding, `a.x`. How the
arguments are assembled depends on `a`:

Direct Call
: The simplest and least common call is when user code directly invokes a
  descriptor method:    `x.__get__(a)`.

Instance Binding
: If binding to an object instance, `a.x` is transformed into the call:
  `type(a).__dict__['x'].__get__(a, type(a))`.

Class Binding
: If binding to a class, `A.x` is transformed into the call:
  `A.__dict__['x'].__get__(None, A)`.

Super Binding
: A dotted lookup such as `super(A, a).x` searches
  `a.__class__.__mro__` for a base class `B` following `A` and then
  returns `B.__dict__['x'].__get__(a, A)`.  If not a descriptor, `x` is
  returned unchanged.

<!-- class Desc:
    def __get__(*args):
        return args

class B:

    x = Desc()

class A(B):

    x = 999

    def m(self):
        'Demonstrate these two descriptor invocations are equivalent'
        result1 = super(A, self).x
        result2 = B.__dict__['x'].__get__(self, A)
        return result1 == result2 -->
<!-- >>> a = A()
>>> a.__class__.__mro__.index(B) > a.__class__.__mro__.index(A)
True
>>> super(A, a).x == B.__dict__['x'].__get__(a, A)
True
>>> a.m()
True -->

For instance bindings, the precedence of descriptor invocation depends on
which descriptor methods are defined.  A descriptor can define any combination
of [`__get__()`](#object.__get__), [`__set__()`](#object.__set__) and
[`__delete__()`](#object.__delete__).  If it does not
define `__get__()`, then accessing the attribute will return the descriptor
object itself unless there is a value in the object’s instance dictionary.  If
the descriptor defines `__set__()` and/or `__delete__()`, it is a data
descriptor; if it defines neither, it is a non-data descriptor.  Normally, data
descriptors define both `__get__()` and `__set__()`, while non-data
descriptors have just the `__get__()` method.  Data descriptors with
`__get__()` and `__set__()` (and/or `__delete__()`) defined
always override a redefinition in an
instance dictionary.  In contrast, non-data descriptors can be overridden by
instances.

Python methods (including those decorated with
[`@staticmethod`](../library/functions.md#staticmethod) and [`@classmethod`](../library/functions.md#classmethod)) are
implemented as non-data descriptors.  Accordingly, instances can redefine and
override methods.  This allows individual instances to acquire behaviors that
differ from other instances of the same class.

The [`property()`](../library/functions.md#property) function is implemented as a data descriptor. Accordingly,
instances cannot override the behavior of a property.

<a id="slots"></a>

#### \_\_slots_\_

 *\_\_slots_\_* allow us to explicitly declare data members (like
properties) and deny the creation of [`__dict__`](#object.__dict__) and  *\_\_weakref_\_*
(unless explicitly declared in  *\_\_slots_\_* or available in a parent.)

The space saved over using [`__dict__`](#object.__dict__) can be significant.
Attribute lookup speed can be significantly improved as well.

#### object.\_\_slots_\_

This class variable can be assigned a string, iterable, or sequence of
strings with variable names used by instances.   *\_\_slots_\_* reserves space
for the declared variables and prevents the automatic creation of
[`__dict__`](#object.__dict__)
and  *\_\_weakref_\_* for each instance.

<a id="datamodel-note-slots"></a>

Notes on using  *\_\_slots_\_*:

* When inheriting from a class without  *\_\_slots_\_*, the
  [`__dict__`](#object.__dict__) and
   *\_\_weakref_\_* attribute of the instances will always be accessible.
* Without a [`__dict__`](#object.__dict__) variable, instances cannot be assigned new
  variables not
  listed in the  *\_\_slots_\_* definition.  Attempts to assign to an unlisted
  variable name raises [`AttributeError`](../library/exceptions.md#AttributeError). If dynamic assignment of new
  variables is desired, then add `'__dict__'` to the sequence of strings in
  the  *\_\_slots_\_* declaration.
* Without a  *\_\_weakref_\_* variable for each instance, classes defining
   *\_\_slots_\_* do not support [`weak references`](../library/weakref.md#module-weakref) to its instances.
  If weak reference
  support is needed, then add `'__weakref__'` to the sequence of strings in the
   *\_\_slots_\_* declaration.
*  *\_\_slots_\_* are implemented at the class level by creating [descriptors](#descriptors)
  for each variable name.  As a result, class attributes
  cannot be used to set default values for instance variables defined by
   *\_\_slots_\_*; otherwise, the class attribute would overwrite the descriptor
  assignment.
* The action of a  *\_\_slots_\_* declaration is not limited to the class
  where it is defined.   *\_\_slots_\_* declared in parents are available in
  child classes. However, instances of a child subclass will get a
  [`__dict__`](#object.__dict__) and  *\_\_weakref_\_* unless the subclass also defines
   *\_\_slots_\_* (which should only contain names of any *additional* slots).
* If a class defines a slot also defined in a base class, the instance variable
  defined by the base class slot is inaccessible (except by retrieving its
  descriptor directly from the base class). This renders the meaning of the
  program undefined.  In the future, a check may be added to prevent this.
* [`TypeError`](../library/exceptions.md#TypeError) will be raised if  *\_\_slots_\_* other than  *\_\_dict_\_* and
   *\_\_weakref_\_* are defined for a class derived from a
  [`"variable-length" built-in type`](../c-api/typeobj.md#c.PyTypeObject.tp_itemsize) such as
  [`int`](../library/functions.md#int), [`bytes`](../library/stdtypes.md#bytes), and [`type`](../library/functions.md#type), except [`tuple`](../library/stdtypes.md#tuple).
* Any non-string [iterable](../glossary.md#term-iterable) may be assigned to  *\_\_slots_\_*.
* If a [`dictionary`](../library/stdtypes.md#dict) is used to assign  *\_\_slots_\_*, the dictionary
  keys will be used as the slot names. The values of the dictionary can be used
  to provide per-attribute docstrings that will be recognised by
  [`inspect.getdoc()`](../library/inspect.md#inspect.getdoc) and displayed in the output of [`help()`](../library/functions.md#help).
* [`__class__`](#object.__class__) assignment works only if both classes have the
  same  *\_\_slots_\_*.
* [Multiple inheritance](compound_stmts.md#multiple-inheritance) with multiple slotted parent
  classes can be used,
  but only one parent is allowed to have attributes created by slots
  (the other bases must have empty slot layouts) - violations raise
  [`TypeError`](../library/exceptions.md#TypeError).
* If an [iterator](../glossary.md#term-iterator) is used for  *\_\_slots_\_* then a [descriptor](../glossary.md#term-descriptor) is
  created for each
  of the iterator’s values. However, the  *\_\_slots_\_* attribute will be an empty
  iterator.

#### Versionchanged
Changed in version 3.15: Allowed defining the  *\_\_dict_\_* and  *\_\_weakref_\_*  *\_\_slots_\_* for any class.
Allowed defining any  *\_\_slots_\_* for a class derived from [`tuple`](../library/stdtypes.md#tuple).

<a id="class-customization"></a>

### Customizing class creation

Whenever a class inherits from another class, [`__init_subclass__()`](#object.__init_subclass__) is
called on the parent class. This way, it is possible to write classes which
change the behavior of subclasses. This is closely related to class
decorators, but where class decorators only affect the specific class they’re
applied to, `__init_subclass__` solely applies to future subclasses of the
class defining the method.

#### *classmethod* object.\_\_init_subclass_\_(cls)

This method is called whenever the containing class is subclassed.
*cls* is then the new subclass. If defined as a normal instance method,
this method is implicitly converted to a class method.

Keyword arguments which are given to a new class are passed to
the parent class’s `__init_subclass__`. For compatibility with
other classes using `__init_subclass__`, one should take out the
needed keyword arguments and pass the others over to the base
class, as in:

```python3
class Philosopher:
    def __init_subclass__(cls, /, default_name, **kwargs):
        super().__init_subclass__(**kwargs)
        cls.default_name = default_name

class AustralianPhilosopher(Philosopher, default_name="Bruce"):
    pass
```

The default implementation `object.__init_subclass__` does
nothing, but raises an error if it is called with any arguments.

#### NOTE
The metaclass hint `metaclass` is consumed by the rest of the type
machinery, and is never passed to `__init_subclass__` implementations.
The actual metaclass (rather than the explicit hint) can be accessed as
`type(cls)`.

#### Versionadded
Added in version 3.6.

When a class is created, `type.__new__()` scans the class variables
and makes callbacks to those with a [`__set_name__()`](#object.__set_name__) hook.

#### object.\_\_set_name_\_(self, owner, name)

Automatically called at the time the owning class *owner* is
created. The object has been assigned to *name* in that class:

```python3
class A:
    x = C()  # Automatically calls: x.__set_name__(A, 'x')
```

If the class variable is assigned after the class is created,
[`__set_name__()`](#object.__set_name__) will not be called automatically.
If needed, [`__set_name__()`](#object.__set_name__) can be called directly:

```python3
class A:
   pass

c = C()
A.x = c                  # The hook is not called
c.__set_name__(A, 'x')   # Manually invoke the hook
```

See [Creating the class object](#class-object-creation) for more details.

#### Versionadded
Added in version 3.6.

<a id="metaclasses"></a>

#### Metaclasses

<a id="index-91"></a>

By default, classes are constructed using [`type()`](../library/functions.md#type). The class body is
executed in a new namespace and the class name is bound locally to the
result of `type(name, bases, namespace)`.

The class creation process can be customized by passing the `metaclass`
keyword argument in the class definition line, or by inheriting from an
existing class that included such an argument. In the following example,
both `MyClass` and `MySubclass` are instances of `Meta`:

```python3
class Meta(type):
    pass

class MyClass(metaclass=Meta):
    pass

class MySubclass(MyClass):
    pass
```

Any other keyword arguments that are specified in the class definition are
passed through to all metaclass operations described below.

When a class definition is executed, the following steps occur:

* MRO entries are resolved;
* the appropriate metaclass is determined;
* the class namespace is prepared;
* the class body is executed;
* the class object is created.

#### Resolving MRO entries

#### object.\_\_mro_entries_\_(self, bases)

If a base that appears in a class definition is not an instance of
[`type`](../library/functions.md#type), then an `__mro_entries__()` method is searched on the base.
If an `__mro_entries__()` method is found, the base is substituted with the
result of a call to `__mro_entries__()` when creating the class.
The method is called with the original bases tuple
passed to the *bases* parameter, and must return a tuple
of classes that will be used instead of the base. The returned tuple may be
empty: in these cases, the original base is ignored.

#### SEE ALSO
[`types.resolve_bases()`](../library/types.md#types.resolve_bases)
: Dynamically resolve bases that are not instances of [`type`](../library/functions.md#type).

[`types.get_original_bases()`](../library/types.md#types.get_original_bases)
: Retrieve a class’s “original bases” prior to modifications by
  [`__mro_entries__()`](#object.__mro_entries__).

[**PEP 560**](https://peps.python.org/pep-0560/)
: Core support for typing module and generic types.

<a id="metaclass-determination"></a>

#### Determining the appropriate metaclass

<a id="index-93"></a>

The appropriate metaclass for a class definition is determined as follows:

* if no bases and no explicit metaclass are given, then [`type()`](../library/functions.md#type) is used;
* if an explicit metaclass is given and it is *not* an instance of
  [`type()`](../library/functions.md#type), then it is used directly as the metaclass;
* if an instance of [`type()`](../library/functions.md#type) is given as the explicit metaclass, or
  bases are defined, then the most derived metaclass is used.

The most derived metaclass is selected from the explicitly specified
metaclass (if any) and the metaclasses (i.e. `type(cls)`) of all specified
base classes. The most derived metaclass is one which is a subtype of *all*
of these candidate metaclasses. If none of the candidate metaclasses meets
that criterion, then the class definition will fail with `TypeError`.

<a id="prepare"></a>

#### Preparing the class namespace

<a id="index-94"></a>

Once the appropriate metaclass has been identified, then the class namespace
is prepared. If the metaclass has a `__prepare__` attribute, it is called
as `namespace = metaclass.__prepare__(name, bases, **kwds)` (where the
additional keyword arguments, if any, come from the class definition). The
`__prepare__` method should be implemented as a
[`classmethod`](../library/functions.md#classmethod). The
namespace returned by `__prepare__` is passed in to `__new__`, but when
the final class object is created the namespace is copied into a new `dict`.

If the metaclass has no `__prepare__` attribute, then the class namespace
is initialised as an empty ordered mapping.

#### SEE ALSO
[**PEP 3115**](https://peps.python.org/pep-3115/) - Metaclasses in Python 3000
: Introduced the `__prepare__` namespace hook

#### Executing the class body

<a id="index-96"></a>

The class body is executed (approximately) as
`exec(body, globals(), namespace)`. The key difference from a normal
call to [`exec()`](../library/functions.md#exec) is that lexical scoping allows the class body (including
any methods) to reference names from the current and outer scopes when the
class definition occurs inside a function.

However, even when the class definition occurs inside the function, methods
defined inside the class still cannot see names defined at the class scope.
Class variables must be accessed through the first parameter of instance or
class methods, or through the implicit lexically scoped `__class__` reference
described in the next section.

<a id="class-object-creation"></a>

#### Creating the class object

<a id="index-97"></a>

Once the class namespace has been populated by executing the class body,
the class object is created by calling
`metaclass(name, bases, namespace, **kwds)` (the additional keywords
passed here are the same as those passed to `__prepare__`).

This class object is the one that will be referenced by the zero-argument
form of [`super()`](../library/functions.md#super). `__class__` is an implicit closure reference
created by the compiler if any methods in a class body refer to either
`__class__` or `super`. This allows the zero argument form of
[`super()`](../library/functions.md#super) to correctly identify the class being defined based on
lexical scoping, while the class or instance that was used to make the
current call is identified based on the first argument passed to the method.

**CPython implementation detail:** In CPython 3.6 and later, the `__class__` cell is passed to the metaclass
as a `__classcell__` entry in the class namespace. If present, this must
be propagated up to the `type.__new__` call in order for the class to be
initialised correctly.
Failing to do so will result in a [`RuntimeError`](../library/exceptions.md#RuntimeError) in Python 3.8.

When using the default metaclass [`type`](../library/functions.md#type), or any metaclass that ultimately
calls `type.__new__`, the following additional customization steps are
invoked after creating the class object:

1. The `type.__new__` method collects all of the attributes in the class
   namespace that define a [`__set_name__()`](#object.__set_name__) method;
2. Those `__set_name__` methods are called with the class
   being defined and the assigned name of that particular attribute;
3. The [`__init_subclass__()`](#object.__init_subclass__) hook is called on the
   immediate parent of the new class in its method resolution order.

After the class object is created, it is passed to the class decorators
included in the class definition (if any) and the resulting object is bound
in the local namespace as the defined class.

When a new class is created by `type.__new__`, the object provided as the
namespace parameter is copied to a new ordered mapping and the original
object is discarded. The new copy is wrapped in a read-only proxy, which
becomes the [`__dict__`](#type.__dict__) attribute of the class object.

#### SEE ALSO
[**PEP 3135**](https://peps.python.org/pep-3135/) - New super
: Describes the implicit `__class__` closure reference

#### Uses for metaclasses

The potential uses for metaclasses are boundless. Some ideas that have been
explored include enum, logging, interface checking, automatic delegation,
automatic property creation, proxies, frameworks, and automatic resource
locking/synchronization.

### Customizing instance and subclass checks

The following methods are used to override the default behavior of the
[`isinstance()`](../library/functions.md#isinstance) and [`issubclass()`](../library/functions.md#issubclass) built-in functions.

In particular, the metaclass [`abc.ABCMeta`](../library/abc.md#abc.ABCMeta) implements these methods in
order to allow the addition of Abstract Base Classes (ABCs) as “virtual base
classes” to any class or type (including built-in types), including other
ABCs.

#### type.\_\_instancecheck_\_(self, instance)

Return true if *instance* should be considered a (direct or indirect)
instance of *class*. If defined, called to implement `isinstance(instance,
class)`.

#### type.\_\_subclasscheck_\_(self, subclass)

Return true if *subclass* should be considered a (direct or indirect)
subclass of *class*.  If defined, called to implement `issubclass(subclass,
class)`.

Note that these methods are looked up on the type (metaclass) of a class.  They
cannot be defined as class methods in the actual class.  This is consistent with
the lookup of special methods that are called on instances, only in this
case the instance is itself a class.

#### SEE ALSO
[**PEP 3119**](https://peps.python.org/pep-3119/) - Introducing Abstract Base Classes
: Includes the specification for customizing [`isinstance()`](../library/functions.md#isinstance) and
  [`issubclass()`](../library/functions.md#issubclass) behavior through [`__instancecheck__()`](#type.__instancecheck__) and
  [`__subclasscheck__()`](#type.__subclasscheck__), with motivation for this functionality
  in the context of adding Abstract Base Classes (see the [`abc`](../library/abc.md#module-abc)
  module) to the language.

### Emulating generic types

When using [type annotations](../glossary.md#term-annotation), it is often useful to
*parameterize* a [generic type](../glossary.md#term-generic-type) using Python’s square-brackets notation.
For example, the annotation `list[int]` might be used to signify a
[`list`](../library/stdtypes.md#list) in which all the elements are of type [`int`](../library/functions.md#int).

#### SEE ALSO
[**PEP 484**](https://peps.python.org/pep-0484/) - Type Hints
: Introducing Python’s framework for type annotations

[Generic Alias Types](../library/stdtypes.md#types-genericalias)
: Documentation for objects representing parameterized generic classes

[Generics](../library/typing.md#generics), [user-defined generics](../library/typing.md#user-defined-generics) and [`typing.Generic`](../library/typing.md#typing.Generic)
: Documentation on how to implement generic classes that can be
  parameterized at runtime and understood by static type-checkers.

A class can *generally* only be parameterized if it defines the special
class method `__class_getitem__()`.

#### *classmethod* object.\_\_class_getitem_\_(cls, key)

Return an object representing the specialization of a generic class
by type arguments found in *key*.

When defined on a class, `__class_getitem__()` is automatically a class
method. As such, there is no need for it to be decorated with
[`@classmethod`](../library/functions.md#classmethod) when it is defined.

#### The purpose of  *\_\_class_getitem_\_*

The purpose of [`__class_getitem__()`](#object.__class_getitem__) is to allow runtime
parameterization of standard-library generic classes in order to more easily
apply [type hints](../glossary.md#term-type-hint) to these classes.

To implement custom generic classes that can be parameterized at runtime and
understood by static type-checkers, users should either inherit from a standard
library class that already implements [`__class_getitem__()`](#object.__class_getitem__), or
inherit from [`typing.Generic`](../library/typing.md#typing.Generic), which has its own implementation of
`__class_getitem__()`.

Custom implementations of [`__class_getitem__()`](#object.__class_getitem__) on classes defined
outside of the standard library may not be understood by third-party
type-checkers such as mypy. Using `__class_getitem__()` on any class for
purposes other than type hinting is discouraged.

<a id="classgetitem-versus-getitem"></a>

#### *\_\_class_getitem_\_* versus  *\_\_getitem_\_*

Usually, the [subscription](expressions.md#subscriptions) of an object using square
brackets will call the [`__getitem__()`](#object.__getitem__) instance method defined on
the object’s class. However, if the object being subscribed is itself a class,
the class method [`__class_getitem__()`](#object.__class_getitem__) may be called instead.
`__class_getitem__()` should return a [GenericAlias](../library/stdtypes.md#types-genericalias)
object if it is properly defined.

Presented with the [expression](../glossary.md#term-expression) `obj[x]`, the Python interpreter
follows something like the following process to decide whether
[`__getitem__()`](#object.__getitem__) or [`__class_getitem__()`](#object.__class_getitem__) should be
called:

```python3
from inspect import isclass

def subscribe(obj, x):
    """Return the result of the expression 'obj[x]'"""

    class_of_obj = type(obj)

    # If the class of obj defines __getitem__,
    # call class_of_obj.__getitem__(obj, x)
    if hasattr(class_of_obj, '__getitem__'):
        return class_of_obj.__getitem__(obj, x)

    # Else, if obj is a class and defines __class_getitem__,
    # call obj.__class_getitem__(x)
    elif isclass(obj) and hasattr(obj, '__class_getitem__'):
        return obj.__class_getitem__(x)

    # Else, raise an exception
    else:
        raise TypeError(
            f"'{class_of_obj.__name__}' object is not subscriptable"
        )
```

In Python, all classes are themselves instances of other classes. The class of
a class is known as that class’s [metaclass](../glossary.md#term-metaclass), and most classes have the
[`type`](../library/functions.md#type) class as their metaclass. [`type`](../library/functions.md#type) does not define
[`__getitem__()`](#object.__getitem__), meaning that expressions such as `list[int]`,
`dict[str, float]` and `tuple[str, bytes]` all result in
[`__class_getitem__()`](#object.__class_getitem__) being called:

```python3
>>> # list has class "type" as its metaclass, like most classes:
>>> type(list)
<class 'type'>
>>> type(dict) == type(list) == type(tuple) == type(str) == type(bytes)
True
>>> # "list[int]" calls "list.__class_getitem__(int)"
>>> list[int]
list[int]
>>> # list.__class_getitem__ returns a GenericAlias object:
>>> type(list[int])
<class 'types.GenericAlias'>
```

However, if a class has a custom metaclass that defines
[`__getitem__()`](#object.__getitem__), subscribing the class may result in different
behaviour. An example of this can be found in the [`enum`](../library/enum.md#module-enum) module:

```python3
>>> from enum import Enum
>>> class Menu(Enum):
...     """A breakfast menu"""
...     SPAM = 'spam'
...     BACON = 'bacon'
...
>>> # Enum classes have a custom metaclass:
>>> type(Menu)
<class 'enum.EnumMeta'>
>>> # EnumMeta defines __getitem__,
>>> # so __class_getitem__ is not called,
>>> # and the result is not a GenericAlias object:
>>> Menu['SPAM']
<Menu.SPAM: 'spam'>
>>> type(Menu['SPAM'])
<enum 'Menu'>
```

#### SEE ALSO
[**PEP 560**](https://peps.python.org/pep-0560/) - Core Support for typing module and generic types
: Introducing [`__class_getitem__()`](#object.__class_getitem__), and outlining when a
  [subscription](expressions.md#subscriptions) results in `__class_getitem__()`
  being called instead of [`__getitem__()`](#object.__getitem__)

<a id="id15"></a>

### Emulating callable objects

#### object.\_\_call_\_(self)

<a id="index-102"></a>

Called when the instance is “called” as a function; if this method is defined,
`x(arg1, arg2, ...)` roughly translates to `type(x).__call__(x, arg1, ...)`.
The [`object`](../library/functions.md#object) class itself does not provide this method.

<a id="sequence-types"></a>

### Emulating container types

The following methods can be defined to implement container objects. None of them
are provided by the [`object`](../library/functions.md#object) class itself. Containers usually are
[sequences](../glossary.md#term-sequence) (such as [`lists`](../library/stdtypes.md#list) or
[`tuples`](../library/stdtypes.md#tuple)) or [mappings](../glossary.md#term-mapping) (like
[dictionaries](../glossary.md#term-dictionary)),
but can represent other containers as well.  The first set of methods is used
either to emulate a sequence or to emulate a mapping; the difference is that for
a sequence, the allowable keys should be the integers *k* for which `0 <= k <
N` where *N* is the length of the sequence, or [`slice`](../library/functions.md#slice) objects, which define a
range of items.  It is also recommended that mappings provide the methods
`keys()`, `values()`, `items()`, `get()`, `clear()`,
`setdefault()`, `pop()`, `popitem()`, `copy()`, and
`update()` behaving similar to those for Python’s standard [`dictionary`](../library/stdtypes.md#dict)
objects.  The [`collections.abc`](../library/collections.abc.md#module-collections.abc) module provides a
[`MutableMapping`](../library/collections.abc.md#collections.abc.MutableMapping)
[abstract base class](../glossary.md#term-abstract-base-class) to help create those methods from a base set of
[`__getitem__()`](#object.__getitem__), [`__setitem__()`](#object.__setitem__),
[`__delitem__()`](#object.__delitem__), and `keys()`.

Mutable sequences should provide methods
[`append()`](../library/stdtypes.md#sequence.append), [`clear()`](../library/stdtypes.md#sequence.clear), [`count()`](../library/stdtypes.md#sequence.count),
[`extend()`](../library/stdtypes.md#sequence.extend), [`index()`](../library/stdtypes.md#sequence.index), [`insert()`](../library/stdtypes.md#sequence.insert),
[`pop()`](../library/stdtypes.md#sequence.pop), [`remove()`](../library/stdtypes.md#sequence.remove), and [`reverse()`](../library/stdtypes.md#sequence.reverse),
like Python standard [`list`](../library/stdtypes.md#list) objects.
Finally, sequence types should implement addition (meaning concatenation) and
multiplication (meaning repetition) by defining the methods
[`__add__()`](#object.__add__), [`__radd__()`](#object.__radd__), [`__iadd__()`](#object.__iadd__),
[`__mul__()`](#object.__mul__), [`__rmul__()`](#object.__rmul__) and [`__imul__()`](#object.__imul__)
described below; they should not define other numerical
operators.

It is recommended that both mappings and sequences implement the
[`__contains__()`](#object.__contains__) method to allow efficient use of the `in`
operator; for
mappings, `in` should search the mapping’s keys; for sequences, it should
search through the values.  It is further recommended that both mappings and
sequences implement the [`__iter__()`](#object.__iter__) method to allow efficient iteration
through the container; for mappings, `__iter__()` should iterate
through the object’s keys; for sequences, it should iterate through the values.

#### object.\_\_len_\_(self)

<a id="index-103"></a>

Called to implement the built-in function [`len()`](../library/functions.md#len).  Should return the length
of the object, an integer `>=` 0.  Also, an object that doesn’t define a
[`__bool__()`](#object.__bool__) method and whose `__len__()` method returns zero is
considered to be false in a Boolean context.

**CPython implementation detail:** In CPython, the length is required to be at most [`sys.maxsize`](../library/sys.md#sys.maxsize).
If the length is larger than `sys.maxsize` some features (such as
[`len()`](../library/functions.md#len)) may raise [`OverflowError`](../library/exceptions.md#OverflowError).  To prevent raising
`OverflowError` by truth value testing, an object must define a
[`__bool__()`](#object.__bool__) method.

#### object.\_\_length_hint_\_(self)

Called to implement [`operator.length_hint()`](../library/operator.md#operator.length_hint). Should return an estimated
length for the object (which may be greater or less than the actual length).
The length must be an integer `>=` 0. The return value may also be
[`NotImplemented`](../library/constants.md#NotImplemented), which is treated the same as if the
`__length_hint__` method didn’t exist at all. This method is purely an
optimization and is never required for correctness.

#### Versionadded
Added in version 3.4.

#### object.\_\_getitem_\_(self, subscript)

Called to implement *subscription*, that is, `self[subscript]`.
See [Subscriptions and slicings](expressions.md#subscriptions) for details on the syntax.

There are two types of built-in objects that support subscription
via `__getitem__()`:

- **sequences**, where *subscript* (also called
  [index](../glossary.md#term-index)) should be an integer or a [`slice`](../library/functions.md#slice) object.
  See the [sequence documentation](#datamodel-sequences) for the expected
  behavior, including handling [`slice`](../library/functions.md#slice) objects and negative indices.
- **mappings**, where *subscript* is also called the [key](../glossary.md#term-key).
  See [mapping documentation](#datamodel-mappings) for the expected
  behavior.

If *subscript* is of an inappropriate type, `__getitem__()`
should raise [`TypeError`](../library/exceptions.md#TypeError).
If *subscript* has an inappropriate value, `__getitem__()`
should raise an [`LookupError`](../library/exceptions.md#LookupError) or one of its subclasses
([`IndexError`](../library/exceptions.md#IndexError) for sequences; [`KeyError`](../library/exceptions.md#KeyError) for mappings).

<a id="index-104"></a>

#### NOTE
Slicing is handled by `__getitem__()`, [`__setitem__()`](#object.__setitem__),
and [`__delitem__()`](#object.__delitem__).
A call like

```python3
a[1:2] = b
```

is translated to

```python3
a[slice(1, 2, None)] = b
```

and so forth. Missing slice items are always filled in with `None`.

#### NOTE
The sequence iteration protocol (used, for example, in [`for`](compound_stmts.md#for)
loops), expects that an [`IndexError`](../library/exceptions.md#IndexError) will be raised for illegal
indexes to allow proper detection of the end of a sequence.

#### NOTE
When [subscripting](expressions.md#subscriptions) a *class*, the special
class method [`__class_getitem__()`](#object.__class_getitem__) may be called instead of
`__getitem__()`. See [\_\_class_getitem_\_ versus \_\_getitem_\_](#classgetitem-versus-getitem) for more
details.

#### object.\_\_setitem_\_(self, key, value)

Called to implement assignment to `self[key]`.  Same note as for
[`__getitem__()`](#object.__getitem__).  This should only be implemented for mappings if the
objects support changes to the values for keys, or if new keys can be added, or
for sequences if elements can be replaced.  The same exceptions should be raised
for improper *key* values as for the [`__getitem__()`](#object.__getitem__) method.

#### object.\_\_delitem_\_(self, key)

Called to implement deletion of `self[key]`.  Same note as for
[`__getitem__()`](#object.__getitem__).  This should only be implemented for mappings if the
objects support removal of keys, or for sequences if elements can be removed
from the sequence.  The same exceptions should be raised for improper *key*
values as for the [`__getitem__()`](#object.__getitem__) method.

#### object.\_\_missing_\_(self, key)

Called by [`dict`](../library/stdtypes.md#dict).[`__getitem__()`](#object.__getitem__) to implement `self[key]` for dict subclasses
when key is not in the dictionary.

#### object.\_\_iter_\_(self)

This method is called when an [iterator](../glossary.md#term-iterator) is required for a container.
This method should return a new iterator object that can iterate over all the
objects in the container.  For mappings, it should iterate over the keys of
the container.

#### object.\_\_reversed_\_(self)

Called (if present) by the [`reversed()`](../library/functions.md#reversed) built-in to implement
reverse iteration.  It should return a new iterator object that iterates
over all the objects in the container in reverse order.

If the [`__reversed__()`](#object.__reversed__) method is not provided, the [`reversed()`](../library/functions.md#reversed)
built-in will fall back to using the sequence protocol ([`__len__()`](#object.__len__) and
[`__getitem__()`](#object.__getitem__)).  Objects that support the sequence protocol should
only provide [`__reversed__()`](#object.__reversed__) if they can provide an implementation
that is more efficient than the one provided by [`reversed()`](../library/functions.md#reversed).

The membership test operators ([`in`](expressions.md#in) and [`not in`](expressions.md#not-in)) are normally
implemented as an iteration through a container. However, container objects can
supply the following special method with a more efficient implementation, which
also does not require the object be iterable.

#### object.\_\_contains_\_(self, item)

Called to implement membership test operators.  Should return true if *item*
is in *self*, false otherwise.  For mapping objects, this should consider the
keys of the mapping rather than the values or the key-item pairs.

For objects that don’t define [`__contains__()`](#object.__contains__), the membership test first
tries iteration via [`__iter__()`](#object.__iter__), then the old sequence iteration
protocol via [`__getitem__()`](#object.__getitem__), see [this section in the language
reference](expressions.md#membership-test-details).

<a id="numeric-types"></a>

### Emulating numeric types

The following methods can be defined to emulate numeric objects. Methods
corresponding to operations that are not supported by the particular kind of
number implemented (e.g., bitwise operations for non-integral numbers) should be
left undefined.

#### object.\_\_add_\_(self, other)

#### object.\_\_sub_\_(self, other)

#### object.\_\_mul_\_(self, other)

#### object.\_\_matmul_\_(self, other)

#### object.\_\_truediv_\_(self, other)

#### object.\_\_floordiv_\_(self, other)

#### object.\_\_mod_\_(self, other)

#### object.\_\_divmod_\_(self, other)

#### object.\_\_pow_\_(self, other)

#### object.\_\_lshift_\_(self, other)

#### object.\_\_rshift_\_(self, other)

#### object.\_\_and_\_(self, other)

#### object.\_\_xor_\_(self, other)

#### object.\_\_or_\_(self, other)

<a id="index-105"></a>

These methods are called to implement the binary arithmetic operations
(`+`, `-`, `*`, `@`, `/`, `//`, `%`, [`divmod()`](../library/functions.md#divmod),
[`pow()`](../library/functions.md#pow), `**`, `<<`, `>>`, `&`, `^`, `|`).  For instance, to
evaluate the expression `x + y`, where *x* is an instance of a class that
has an [`__add__()`](#object.__add__) method, `type(x).__add__(x, y)` is called.  The
[`__divmod__()`](#object.__divmod__) method should be the equivalent to using
[`__floordiv__()`](#object.__floordiv__) and [`__mod__()`](#object.__mod__); it should not be related to
[`__truediv__()`](#object.__truediv__).  Note that [`__pow__()`](#object.__pow__) should be defined to accept
an optional third argument if the three-argument version of the built-in [`pow()`](../library/functions.md#pow)
function is to be supported.

If one of those methods does not support the operation with the supplied
arguments, it should return [`NotImplemented`](../library/constants.md#NotImplemented).

#### object.\_\_radd_\_(self, other)

#### object.\_\_rsub_\_(self, other)

#### object.\_\_rmul_\_(self, other)

#### object.\_\_rmatmul_\_(self, other)

#### object.\_\_rtruediv_\_(self, other)

#### object.\_\_rfloordiv_\_(self, other)

#### object.\_\_rmod_\_(self, other)

#### object.\_\_rdivmod_\_(self, other)

#### object.\_\_rpow_\_(self, other)

#### object.\_\_rlshift_\_(self, other)

#### object.\_\_rrshift_\_(self, other)

#### object.\_\_rand_\_(self, other)

#### object.\_\_rxor_\_(self, other)

#### object.\_\_ror_\_(self, other)

<a id="index-106"></a>

These methods are called to implement the binary arithmetic operations
(`+`, `-`, `*`, `@`, `/`, `//`, `%`, [`divmod()`](../library/functions.md#divmod),
[`pow()`](../library/functions.md#pow), `**`, `<<`, `>>`, `&`, `^`, `|`) with reflected
(swapped) operands.  These functions are only called if the operands
are of different types, when the left operand does not support the corresponding
operation <sup>[3](#id22)</sup>, or the right operand’s class is derived from the left operand’s
class. <sup>[4](#id23)</sup> For instance, to evaluate the expression `x - y`, where *y* is
an instance of a class that has an [`__rsub__()`](#object.__rsub__) method, `type(y).__rsub__(y, x)`
is called if `type(x).__sub__(x, y)` returns [`NotImplemented`](../library/constants.md#NotImplemented) or `type(y)`
is a subclass of `type(x)`. <sup>[5](#id24)</sup>

Note that [`__rpow__()`](#object.__rpow__) should be defined to accept an optional third
argument if the three-argument version of the built-in [`pow()`](../library/functions.md#pow) function
is to be supported.

#### Versionchanged
Changed in version 3.14: Three-argument [`pow()`](../library/functions.md#pow) now try calling [`__rpow__()`](#object.__rpow__) if necessary.
Previously it was only called in two-argument `pow()` and the binary
power operator.

#### NOTE
If the right operand’s type is a subclass of the left operand’s type and
that subclass provides a different implementation of the reflected method
for the operation, this method will be called before the left operand’s
non-reflected method. This behavior allows subclasses to override their
ancestors’ operations.

#### object.\_\_iadd_\_(self, other)

#### object.\_\_isub_\_(self, other)

#### object.\_\_imul_\_(self, other)

#### object.\_\_imatmul_\_(self, other)

#### object.\_\_itruediv_\_(self, other)

#### object.\_\_ifloordiv_\_(self, other)

#### object.\_\_imod_\_(self, other)

#### object.\_\_ipow_\_(self, other)

#### object.\_\_ilshift_\_(self, other)

#### object.\_\_irshift_\_(self, other)

#### object.\_\_iand_\_(self, other)

#### object.\_\_ixor_\_(self, other)

#### object.\_\_ior_\_(self, other)

These methods are called to implement the augmented arithmetic assignments
(`+=`, `-=`, `*=`, `@=`, `/=`, `//=`, `%=`, `**=`, `<<=`,
`>>=`, `&=`, `^=`, `|=`).  These methods should attempt to do the
operation in-place (modifying *self*) and return the result (which could be,
but does not have to be, *self*).  If a specific method is not defined, or if
that method returns [`NotImplemented`](../library/constants.md#NotImplemented), the
augmented assignment falls back to the normal methods.  For instance, if *x*
is an instance of a class with an [`__iadd__()`](#object.__iadd__) method, `x += y` is
equivalent to `x = x.__iadd__(y)` . If [`__iadd__()`](#object.__iadd__) does not exist, or if `x.__iadd__(y)`
returns `NotImplemented`, `x.__add__(y)` and
`y.__radd__(x)` are considered, as with the evaluation of `x + y`. In
certain situations, augmented assignment can result in unexpected errors (see
[Why does a_tuple[i] += [‘item’] raise an exception when the addition works?](../faq/programming.md#faq-augmented-assignment-tuple-error)), but this behavior is in fact
part of the data model.

#### object.\_\_neg_\_(self)

#### object.\_\_pos_\_(self)

#### object.\_\_abs_\_(self)

#### object.\_\_invert_\_(self)

<a id="index-107"></a>

Called to implement the unary arithmetic operations (`-`, `+`, [`abs()`](../library/functions.md#abs)
and `~`).

#### object.\_\_complex_\_(self)

#### object.\_\_int_\_(self)

#### object.\_\_float_\_(self)

<a id="index-108"></a>

Called to implement the built-in functions [`complex()`](../library/functions.md#complex),
[`int()`](../library/functions.md#int) and [`float()`](../library/functions.md#float).  Should return a value
of the appropriate type.

#### object.\_\_index_\_(self)

Called to implement [`operator.index()`](../library/operator.md#operator.index), and whenever Python needs to
losslessly convert the numeric object to an integer object (such as in
slicing, or in the built-in [`bin()`](../library/functions.md#bin), [`hex()`](../library/functions.md#hex) and [`oct()`](../library/functions.md#oct)
functions). Presence of this method indicates that the numeric object is
an integer type.  Must return an integer.

If [`__int__()`](#object.__int__), [`__float__()`](#object.__float__) and [`__complex__()`](#object.__complex__) are not
defined then corresponding built-in functions [`int()`](../library/functions.md#int), [`float()`](../library/functions.md#float)
and [`complex()`](../library/functions.md#complex) fall back to [`__index__()`](#object.__index__).

#### object.\_\_round_\_(self)

#### object.\_\_trunc_\_(self)

#### object.\_\_floor_\_(self)

#### object.\_\_ceil_\_(self)

<a id="index-109"></a>

Called to implement the built-in function [`round()`](../library/functions.md#round) and [`math`](../library/math.md#module-math)
functions [`trunc()`](../library/math.md#math.trunc), [`floor()`](../library/math.md#math.floor) and [`ceil()`](../library/math.md#math.ceil).
Unless *ndigits* is passed to `__round__()` all these methods should
return the value of the object truncated to an [`Integral`](../library/numbers.md#numbers.Integral)
(typically an [`int`](../library/functions.md#int)).

#### Versionchanged
Changed in version 3.14: [`int()`](../library/functions.md#int) no longer delegates to the [`__trunc__()`](#object.__trunc__) method.

<a id="context-managers"></a>

### With Statement Context Managers

A *context manager* is an object that defines the runtime context to be
established when executing a [`with`](compound_stmts.md#with) statement. The context manager
handles the entry into, and the exit from, the desired runtime context for the
execution of the block of code.  Context managers are normally invoked using the
`with` statement (described in section [The with statement](compound_stmts.md#with)), but can also be
used by directly invoking their methods.

<a id="index-110"></a>

Typical uses of context managers include saving and restoring various kinds of
global state, locking and unlocking resources, closing opened files, etc.

For more information on context managers, see [Context Manager Types](../library/stdtypes.md#typecontextmanager).
The [`object`](../library/functions.md#object) class itself does not provide the context manager methods.

#### object.\_\_enter_\_(self)

Enter the runtime context related to this object. The [`with`](compound_stmts.md#with) statement
will bind this method’s return value to the target(s) specified in the
`as` clause of the statement, if any.

#### object.\_\_exit_\_(self, exc_type, exc_value, traceback)

Exit the runtime context related to this object. The parameters describe the
exception that caused the context to be exited. If the context was exited
without an exception, all three arguments will be [`None`](../library/constants.md#None).

If an exception is supplied, and the method wishes to suppress the exception
(i.e., prevent it from being propagated), it should return a true value.
Otherwise, the exception will be processed normally upon exit from this method.

Note that [`__exit__()`](#object.__exit__) methods should not reraise the passed-in exception;
this is the caller’s responsibility.

#### SEE ALSO
[**PEP 343**](https://peps.python.org/pep-0343/) - The “with” statement
: The specification, background, and examples for the Python [`with`](compound_stmts.md#with)
  statement.

<a id="class-pattern-matching"></a>

### Customizing positional arguments in class pattern matching

When using a class name in a pattern, positional arguments in the pattern are not
allowed by default, i.e. `case MyClass(x, y)` is typically invalid without special
support in `MyClass`. To be able to use that kind of pattern, the class needs to
define a  *\_\_match_args_\_* attribute.

#### object.\_\_match_args_\_

This class variable can be assigned a tuple of strings. When this class is
used in a class pattern with positional arguments, each positional argument will
be converted into a keyword argument, using the corresponding value in
 *\_\_match_args_\_* as the keyword. The absence of this attribute is equivalent to
setting it to `()`.

For example, if `MyClass.__match_args__` is `("left", "center", "right")` that means
that `case MyClass(x, y)` is equivalent to `case MyClass(left=x, center=y)`. Note
that the number of arguments in the pattern must be smaller than or equal to the number
of elements in  *\_\_match_args_\_*; if it is larger, the pattern match attempt will raise
a [`TypeError`](../library/exceptions.md#TypeError).

#### Versionadded
Added in version 3.10.

#### SEE ALSO
[**PEP 634**](https://peps.python.org/pep-0634/) - Structural Pattern Matching
: The specification for the Python `match` statement.

<a id="python-buffer-protocol"></a>

### Emulating buffer types

The [buffer protocol](../c-api/buffer.md#bufferobjects) provides a way for Python
objects to expose efficient access to a low-level memory array. This protocol
is implemented by builtin types such as [`bytes`](../library/stdtypes.md#bytes) and [`memoryview`](../library/stdtypes.md#memoryview),
and third-party libraries may define additional buffer types.

While buffer types are usually implemented in C, it is also possible to
implement the protocol in Python.

#### object.\_\_buffer_\_(self, flags)

Called when a buffer is requested from *self* (for example, by the
[`memoryview`](../library/stdtypes.md#memoryview) constructor). The *flags* argument is an integer
representing the kind of buffer requested, affecting for example whether
the returned buffer is read-only or writable. [`inspect.BufferFlags`](../library/inspect.md#inspect.BufferFlags)
provides a convenient way to interpret the flags. The method must return
a [`memoryview`](../library/stdtypes.md#memoryview) object.

**Thread safety:** In [free-threaded](../glossary.md#term-free-threading) Python,
implementations must manage any internal export counter using atomic
operations. The method must be safe to call concurrently from multiple
threads, and the returned buffer’s underlying data must remain valid
until the corresponding [`__release_buffer__()`](#object.__release_buffer__) call
completes. See [Thread safety for memoryview objects](../library/threadsafety.md#thread-safety-memoryview) for details.

#### object.\_\_release_buffer_\_(self, buffer)

Called when a buffer is no longer needed. The *buffer* argument is a
[`memoryview`](../library/stdtypes.md#memoryview) object that was previously returned by
[`__buffer__()`](#object.__buffer__). The method must release any resources associated
with the buffer. This method should return `None`.

**Thread safety:** In [free-threaded](../glossary.md#term-free-threading) Python,
any export counter decrement must use atomic operations. Resource
cleanup must be thread-safe, as the final release may race with
concurrent releases from other threads.

Buffer objects that do not need to perform any cleanup are not required
to implement this method.

#### Versionadded
Added in version 3.12.

#### SEE ALSO
[**PEP 688**](https://peps.python.org/pep-0688/) - Making the buffer protocol accessible in Python
: Introduces the Python `__buffer__` and `__release_buffer__` methods.

[`collections.abc.Buffer`](../library/collections.abc.md#collections.abc.Buffer)
: ABC for buffer types.

### Annotations

Functions, classes, and modules may contain [annotations](../glossary.md#term-annotation),
which are a way to associate information (usually [type hints](../glossary.md#term-type-hint))
with a symbol.

#### object.\_\_annotations_\_

This attribute contains the annotations for an object. It is
[lazily evaluated](executionmodel.md#lazy-evaluation), so accessing the attribute may
execute arbitrary code and raise exceptions. If evaluation is successful, the
attribute is set to a dictionary mapping from variable names to annotations.

#### Versionchanged
Changed in version 3.14: Annotations are now lazily evaluated.

#### object.\_\_annotate_\_(format)

An [annotate function](../glossary.md#term-annotate-function).
Returns a new dictionary object mapping attribute/parameter names to their annotation values.

Takes a format parameter specifying the format in which annotations values should be provided.
It must be a member of the [`annotationlib.Format`](../library/annotationlib.md#annotationlib.Format) enum, or an integer with
a value corresponding to a member of the enum.

If an annotate function doesn’t support the requested format, it must raise
[`NotImplementedError`](../library/exceptions.md#NotImplementedError). Annotate functions must always support
[`VALUE`](../library/annotationlib.md#annotationlib.Format.VALUE) format; they must not raise
[`NotImplementedError()`](../library/exceptions.md#NotImplementedError) when called with this format.

When called with  [`VALUE`](../library/annotationlib.md#annotationlib.Format.VALUE) format, an annotate function may raise
[`NameError`](../library/exceptions.md#NameError); it must not raise `NameError` when called requesting any other format.

If an object does not have any annotations, [`__annotate__`](#object.__annotate__) should preferably be set
to `None` (it can’t be deleted), rather than set to a function that returns an empty dict.

#### Versionadded
Added in version 3.14.

#### SEE ALSO
[**PEP 649**](https://peps.python.org/pep-0649/) — Deferred evaluation of annotation using descriptors
: Introduces lazy evaluation of annotations and the `__annotate__` function.

<a id="special-lookup"></a>

### Special method lookup

For custom classes, implicit invocations of special methods are only guaranteed
to work correctly if defined on an object’s type, not in the object’s instance
dictionary.  That behaviour is the reason why the following code raises an
exception:

```python3
>>> class C:
...     pass
...
>>> c = C()
>>> c.__len__ = lambda: 5
>>> len(c)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: object of type 'C' has no len()
```

The rationale behind this behaviour lies with a number of special methods such
as [`__hash__()`](#object.__hash__) and [`__repr__()`](#object.__repr__) that are implemented
by all objects,
including type objects. If the implicit lookup of these methods used the
conventional lookup process, they would fail when invoked on the type object
itself:

```python3
>>> 1 .__hash__() == hash(1)
True
>>> int.__hash__() == hash(int)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: descriptor '__hash__' of 'int' object needs an argument
```

Incorrectly attempting to invoke an unbound method of a class in this way is
sometimes referred to as ‘metaclass confusion’, and is avoided by bypassing
the instance when looking up special methods:

```python3
>>> type(1).__hash__(1) == hash(1)
True
>>> type(int).__hash__(int) == hash(int)
True
```

In addition to bypassing any instance attributes in the interest of
correctness, implicit special method lookup generally also bypasses the
[`__getattribute__()`](#object.__getattribute__) method even of the object’s metaclass:

```python3
>>> class Meta(type):
...     def __getattribute__(*args):
...         print("Metaclass getattribute invoked")
...         return type.__getattribute__(*args)
...
>>> class C(object, metaclass=Meta):
...     def __len__(self):
...         return 10
...     def __getattribute__(*args):
...         print("Class getattribute invoked")
...         return object.__getattribute__(*args)
...
>>> c = C()
>>> c.__len__()                 # Explicit lookup via instance
Class getattribute invoked
10
>>> type(c).__len__(c)          # Explicit lookup via type
Metaclass getattribute invoked
10
>>> len(c)                      # Implicit lookup
10
```

Bypassing the [`__getattribute__()`](#object.__getattribute__) machinery in this fashion
provides significant scope for speed optimisations within the
interpreter, at the cost of some flexibility in the handling of
special methods (the special method *must* be set on the class
object itself in order to be consistently invoked by the interpreter).

<a id="index-115"></a>

## Coroutines

### Awaitable Objects

An [awaitable](../glossary.md#term-awaitable) object generally implements an [`__await__()`](#object.__await__) method.
[Coroutine objects](../glossary.md#term-coroutine) returned from [`async def`](compound_stmts.md#async-def) functions
are awaitable.

#### NOTE
The [generator iterator](../glossary.md#term-generator-iterator) objects returned from generators
decorated with [`types.coroutine()`](../library/types.md#types.coroutine)
are also awaitable, but they do not implement [`__await__()`](#object.__await__).

#### object.\_\_await_\_(self)

Must return an [iterator](../glossary.md#term-iterator).  Should be used to implement
[awaitable](../glossary.md#term-awaitable) objects.  For instance, [`asyncio.Future`](../library/asyncio-future.md#asyncio.Future) implements
this method to be compatible with the [`await`](expressions.md#await) expression.
The [`object`](../library/functions.md#object) class itself is not awaitable and does not provide
this method.

#### NOTE
The language doesn’t place any restriction on the type or value of the
objects yielded by the iterator returned by `__await__`, as this is
specific to the implementation of the asynchronous execution framework
(e.g. [`asyncio`](../library/asyncio.md#module-asyncio)) that will be managing the [awaitable](../glossary.md#term-awaitable) object.

#### Versionadded
Added in version 3.5.

#### SEE ALSO
[**PEP 492**](https://peps.python.org/pep-0492/) for additional information about awaitable objects.

<a id="coroutine-objects"></a>

### Coroutine Objects

[Coroutine objects](../glossary.md#term-coroutine) are [awaitable](../glossary.md#term-awaitable) objects.
A coroutine’s execution can be controlled by calling [`__await__()`](#object.__await__) and
iterating over the result.  When the coroutine has finished executing and
returns, the iterator raises [`StopIteration`](../library/exceptions.md#StopIteration), and the exception’s
[`value`](../library/exceptions.md#StopIteration.value) attribute holds the return value.  If the
coroutine raises an exception, it is propagated by the iterator.  Coroutines
should not directly raise unhandled [`StopIteration`](../library/exceptions.md#StopIteration) exceptions.

Coroutines also have the methods listed below, which are analogous to
those of generators (see [Generator-iterator methods](expressions.md#generator-methods)).  However, unlike
generators, coroutines do not directly support iteration.

#### Versionchanged
Changed in version 3.5.2: It is a [`RuntimeError`](../library/exceptions.md#RuntimeError) to await on a coroutine more than once.

#### coroutine.send(value)

Starts or resumes execution of the coroutine.  If *value* is `None`,
this is equivalent to advancing the iterator returned by
[`__await__()`](#object.__await__).  If *value* is not `None`, this method delegates
to the [`send()`](expressions.md#generator.send) method of the iterator that caused
the coroutine to suspend.  The result (return value,
[`StopIteration`](../library/exceptions.md#StopIteration), or other exception) is the same as when
iterating over the `__await__()` return value, described above.

#### coroutine.throw(value)

#### coroutine.throw(type)

Raises the specified exception in the coroutine.  This method delegates
to the [`throw()`](expressions.md#generator.throw) method of the iterator that caused
the coroutine to suspend, if it has such a method.  Otherwise,
the exception is raised at the suspension point.  The result
(return value, [`StopIteration`](../library/exceptions.md#StopIteration), or other exception) is the same as
when iterating over the [`__await__()`](#object.__await__) return value, described
above.  If the exception is not caught in the coroutine, it propagates
back to the caller.

#### Versionchanged
Changed in version 3.12: The second signature (type[, value[, traceback]]) is deprecated and
may be removed in a future version of Python.

#### coroutine.close()

Causes the coroutine to clean itself up and exit.  If the coroutine
is suspended, this method first delegates to the [`close()`](expressions.md#generator.close)
method of the iterator that caused the coroutine to suspend, if it
has such a method.  Then it raises [`GeneratorExit`](../library/exceptions.md#GeneratorExit) at the
suspension point, causing the coroutine to immediately clean itself up.
Finally, the coroutine is marked as having finished executing, even if
it was never started.

Coroutine objects are automatically closed using the above process when
they are about to be destroyed.

<a id="async-iterators"></a>

### Asynchronous Iterators

An *asynchronous iterator* can call asynchronous code in
its `__anext__` method.

Asynchronous iterators can be used in an [`async for`](compound_stmts.md#async-for) statement.

The [`object`](../library/functions.md#object) class itself does not provide these methods.

#### object.\_\_aiter_\_(self)

Must return an *asynchronous iterator* object.

#### object.\_\_anext_\_(self)

Must return an *awaitable* resulting in a next value of the iterator.  Should
raise a [`StopAsyncIteration`](../library/exceptions.md#StopAsyncIteration) error when the iteration is over.

An example of an asynchronous iterable object:

```python3
class Reader:
    async def readline(self):
        ...

    def __aiter__(self):
        return self

    async def __anext__(self):
        val = await self.readline()
        if val == b'':
            raise StopAsyncIteration
        return val
```

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.7: Prior to Python 3.7, [`__aiter__()`](#object.__aiter__) could return an *awaitable*
that would resolve to an
[asynchronous iterator](../glossary.md#term-asynchronous-iterator).

Starting with Python 3.7, [`__aiter__()`](#object.__aiter__) must return an
asynchronous iterator object.  Returning anything else
will result in a [`TypeError`](../library/exceptions.md#TypeError) error.

<a id="async-context-managers"></a>

### Asynchronous Context Managers

An *asynchronous context manager* is a *context manager* that is able to
suspend execution in its `__aenter__` and `__aexit__` methods.

Asynchronous context managers can be used in an [`async with`](compound_stmts.md#async-with) statement.

The [`object`](../library/functions.md#object) class itself does not provide these methods.

#### object.\_\_aenter_\_(self)

Semantically similar to [`__enter__()`](#object.__enter__), the only
difference being that it must return an *awaitable*.

#### object.\_\_aexit_\_(self, exc_type, exc_value, traceback)

Semantically similar to [`__exit__()`](#object.__exit__), the only
difference being that it must return an *awaitable*.

An example of an asynchronous context manager class:

```python3
class AsyncContextManager:
    async def __aenter__(self):
        await log('entering context')

    async def __aexit__(self, exc_type, exc, tb):
        await log('exiting context')
```

#### Versionadded
Added in version 3.5.

### Footnotes

* <a id='id20'>**[1]**</a> It *is* possible in some cases to change an object’s type, under certain controlled conditions. It generally isn’t a good idea though, since it can lead to some very strange behaviour if it is handled incorrectly.
* <a id='id21'>**[2]**</a> The [`__hash__()`](#object.__hash__), [`__iter__()`](#object.__iter__), [`__reversed__()`](#object.__reversed__), [`__contains__()`](#object.__contains__), [`__class_getitem__()`](#object.__class_getitem__) and [`__fspath__()`](../library/os.md#os.PathLike.__fspath__) methods have special handling for this. Others will still raise a [`TypeError`](../library/exceptions.md#TypeError), but may do so by relying on the behavior that `None` is not callable.
* <a id='id22'>**[3]**</a> “Does not support” here means that the class has no such method, or the method returns [`NotImplemented`](../library/constants.md#NotImplemented).  Do not set the method to `None` if you want to force fallback to the right operand’s reflected method—that will instead have the opposite effect of explicitly *blocking* such fallback.
* <a id='id23'>**[4]**</a> For operands of the same type, it is assumed that if the non-reflected method (such as [`__add__()`](#object.__add__)) fails then the operation is not supported, which is why the reflected method is not called.
* <a id='id24'>**[5]**</a> If the right operand’s type is a subclass of the left operand’s type, the reflected method having precedence allows subclasses to override their ancestors’ operations.
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
