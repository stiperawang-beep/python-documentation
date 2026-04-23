<a id="expressions"></a>

# Expressions

<a id="index-0"></a>

This chapter explains the meaning of the elements of expressions in Python.

**Syntax Notes:** In this and the following chapters,
[grammar notation](introduction.md#notation) will be used to describe syntax,
not lexical analysis.

When (one alternative of) a syntax rule has the form:

and no semantics are given, the semantics of this form of `name` are the same
as for `othername`.

<a id="conversions"></a>

## Arithmetic conversions

<a id="index-1"></a>

When a description of an arithmetic operator below uses the phrase “the numeric
arguments are converted to a common real type”, this means that the operator
implementation for built-in numeric types works as described in the
[Numeric Types](../library/stdtypes.md#stdtypes-mixed-arithmetic) section of the standard
library documentation.

Some additional rules apply for certain operators and non-numeric operands
(for example, a string as a left argument to the `%` operator).
Extensions must define their own conversion behavior.

<a id="atoms"></a>

## Atoms

<a id="index-2"></a>

Atoms are the most basic elements of expressions.
The simplest atoms are [names](lexical_analysis.md#identifiers) or literals.
Forms enclosed in parentheses, brackets or braces are also categorized
syntactically as atoms.

Formally, the syntax for atoms is:

<a id="atom-singletons"></a>

### Built-in constants

The keywords `True`, `False`, and `None` name
[built-in constants](../library/constants.md#built-in-consts).
The token `...` names the [`Ellipsis`](../library/constants.md#Ellipsis) constant.

Evaluation of these atoms yields the corresponding value.

#### NOTE
Several more built-in constants are available as global variables,
but only the ones mentioned here are [keywords](lexical_analysis.md#keywords).
In particular, these names cannot be reassigned or used as attributes:

```pycon
>>> False = 123
  File "<input>", line 1
   False = 123
   ^^^^^
SyntaxError: cannot assign to False
```

<a id="atom-identifiers"></a>

### Identifiers (Names)

<a id="index-3"></a>

An identifier occurring as an atom is a name.  See section [Names (identifiers and keywords)](lexical_analysis.md#identifiers)
for lexical definition and section [Naming and binding](executionmodel.md#naming) for documentation of naming and
binding.

<a id="index-4"></a>

When the name is bound to an object, evaluation of the atom yields that object.
When a name is not bound, an attempt to evaluate it raises a [`NameError`](../library/exceptions.md#NameError)
exception.

<a id="private-name-mangling"></a>

<a id="index-5"></a>

#### Private name mangling

When an identifier that textually occurs in a class definition begins with two
or more underscore characters and does not end in two or more underscores, it
is considered a *private name* of that class.

#### SEE ALSO
The [class specifications](compound_stmts.md#class).

More precisely, private names are transformed to a longer form before code is
generated for them.  If the transformed name is longer than 255 characters,
implementation-defined truncation may happen.

The transformation is independent of the syntactical context in which the
identifier is used but only the following private identifiers are mangled:

- Any name used as the name of a variable that is assigned or read or any
  name of an attribute being accessed.

  The [`__name__`](../library/stdtypes.md#definition.__name__) attribute of nested functions, classes, and
  type aliases is however not mangled.
- The name of imported modules, e.g., `__spam` in `import __spam`.
  If the module is part of a package (i.e., its name contains a dot),
  the name is *not* mangled, e.g., the `__foo` in `import __foo.bar`
  is not mangled.
- The name of an imported member, e.g., `__f` in `from spam import __f`.

The transformation rule is defined as follows:

- The class name, with leading underscores removed and a single leading
  underscore inserted, is inserted in front of the identifier, e.g., the
  identifier `__spam` occurring in a class named `Foo`, `_Foo` or
  `__Foo` is transformed to `_Foo__spam`.
- If the class name consists only of underscores, the transformation is the
  identity, e.g., the identifier `__spam` occurring in a class named `_`
  or `__` is left as is.

<a id="atom-literals"></a>

### Literals

<a id="index-6"></a>

A *literal* is a textual representation of a value.
Python supports numeric, string and bytes literals.
[Format strings](lexical_analysis.md#f-strings) and [template strings](lexical_analysis.md#t-strings)
are treated as string literals.

Numeric literals consist of a single [`NUMBER`](lexical_analysis.md#grammar-token-python-grammar-NUMBER)
token, which names an integer, floating-point number, or an imaginary number.
See the [Numeric literals](lexical_analysis.md#numbers) section in Lexical analysis documentation for details.

String and bytes literals may consist of several tokens.
See section [String literal concatenation](#string-concatenation) for details.

Note that negative and complex numbers, like `-3` or `3+4.2j`,
are syntactically not literals, but [unary](#unary) or
[binary](#binary) arithmetic operations involving the `-` or `+`
operator.

Evaluation of a literal yields an object of the given type
([`int`](../library/functions.md#int), [`float`](../library/functions.md#float), [`complex`](../library/functions.md#complex), [`str`](../library/stdtypes.md#str),
[`bytes`](../library/stdtypes.md#bytes), or [`Template`](../library/string.templatelib.md#string.templatelib.Template)) with the given value.
The value may be approximated in the case of floating-point
and imaginary literals.

The formal grammar for literals is:

<a id="index-7"></a>

#### Literals and object identity

All literals correspond to immutable data types, and hence the object’s identity
is less important than its value.  Multiple evaluations of literals with the
same value (either the same occurrence in the program text or a different
occurrence) may obtain the same object or a different object with the same
value.

[Template strings](lexical_analysis.md#t-strings) are immutable but may reference mutable
objects as [`Interpolation`](../library/string.templatelib.md#string.templatelib.Interpolation) values.
For the purposes of this section, two t-strings have the “same value” if
both their structure and the *identity* of the values match.

**CPython implementation detail:** Currently, each evaluation of a template string results in
a different object.

<a id="string-concatenation"></a>

#### String literal concatenation

Multiple adjacent string or bytes literals, possibly
using different quoting conventions, are allowed, and their meaning is the same
as their concatenation:

```python3
>>> "hello" 'world'
"helloworld"
```

This feature is defined at the syntactical level, so it only works with literals.
To concatenate string expressions at run time, the ‘+’ operator may be used:

```python3
>>> greeting = "Hello"
>>> space = " "
>>> name = "Blaise"
>>> print(greeting + space + name)   # not: print(greeting space name)
Hello Blaise
```

Literal concatenation can freely mix raw strings, triple-quoted strings,
and formatted string literals.
For example:

```python3
>>> "Hello" r', ' f"{name}!"
"Hello, Blaise!"
```

This feature can be used to reduce the number of backslashes
needed, to split long strings conveniently across long lines, or even to add
comments to parts of strings. For example:

```python3
re.compile("[A-Za-z_]"       # letter or underscore
           "[A-Za-z0-9_]*"   # letter, digit or underscore
          )
```

However, bytes literals may only be combined with other byte literals;
not with string literals of any kind.
Also, template string literals may only be combined with other template
string literals:

```python3
>>> t"Hello" t"{name}!"
Template(strings=('Hello', '!'), interpolations=(...))
```

Formally:

<a id="parenthesized"></a>

### Parenthesized forms

<a id="index-8"></a>

A parenthesized form is an optional expression list enclosed in parentheses:

A parenthesized expression list yields whatever that expression list yields: if
the list contains at least one comma, it yields a tuple; otherwise, it yields
the single expression that makes up the expression list.

<a id="index-9"></a>

An empty pair of parentheses yields an empty tuple object.  Since tuples are
immutable, the same rules as for literals apply (i.e., two occurrences of the empty
tuple may or may not yield the same object).

<a id="index-10"></a>

Note that tuples are not formed by the parentheses, but rather by use of the
comma.  The exception is the empty tuple, for which parentheses *are*
required — allowing unparenthesized “nothing” in expressions would cause
ambiguities and allow common typos to pass uncaught.

<a id="comprehensions"></a>

### Displays for lists, sets and dictionaries

<a id="index-11"></a>

For constructing a list, a set or a dictionary Python provides special syntax
called “displays”, each of them in two flavors:

* either the container contents are listed explicitly, or
* they are computed via a set of looping and filtering instructions, called a
  *comprehension*.

<a id="index-12"></a>

Common syntax elements for comprehensions are:

The comprehension consists of a single expression followed by at least one
`for` clause and zero or more `for` or `if`
clauses.  In this case, the elements of the new container are those that would
be produced by considering each of the `for` or `if`
clauses a block, nesting from left to right, and evaluating the expression to
produce an element each time the innermost block is reached.  If the expression
is starred, the result will instead be unpacked to produce zero or more
elements.

However, aside from the iterable expression in the leftmost `for` clause,
the comprehension is executed in a separate implicitly nested scope. This ensures
that names assigned to in the target list don’t “leak” into the enclosing scope.

The iterable expression in the leftmost `for` clause is evaluated
directly in the enclosing scope and then passed as an argument to the implicitly
nested scope. Subsequent `for` clauses and any filter condition in the
leftmost `for` clause cannot be evaluated in the enclosing scope as
they may depend on the values obtained from the leftmost iterable. For example:
`[x*y for x in range(10) for y in range(x, x+10)]`.

To ensure the comprehension always results in a container of the appropriate
type, `yield` and `yield from` expressions are prohibited in the implicitly
nested scope.

<a id="index-13"></a>

Since Python 3.6, in an [`async def`](compound_stmts.md#async-def) function, an `async for`
clause may be used to iterate over a [asynchronous iterator](../glossary.md#term-asynchronous-iterator).
A comprehension in an `async def` function may consist of either a
`for` or `async for` clause following the leading
expression, may contain additional `for` or `async for`
clauses, and may also use [`await`](#await) expressions.

If a comprehension contains `async for` clauses, or if it contains
`await` expressions or other asynchronous comprehensions anywhere except
the iterable expression in the leftmost `for` clause, it is called an
*asynchronous comprehension*. An asynchronous comprehension may suspend the
execution of the coroutine function in which it appears.
See also [**PEP 530**](https://peps.python.org/pep-0530/).

#### Versionadded
Added in version 3.6: Asynchronous comprehensions were introduced.

#### Versionchanged
Changed in version 3.8: `yield` and `yield from` prohibited in the implicitly nested scope.

#### Versionchanged
Changed in version 3.11: Asynchronous comprehensions are now allowed inside comprehensions in
asynchronous functions. Outer comprehensions implicitly become
asynchronous.

#### Versionchanged
Changed in version 3.15: Unpacking with the `*` operator is now allowed in the expression.

<a id="lists"></a>

### List displays

<a id="index-15"></a>

A list display is a possibly empty series of expressions enclosed in square
brackets:

A list display yields a new list object, the contents being specified by either
a list of expressions or a comprehension.  When a comma-separated list of
expressions is supplied, its elements are evaluated from left to right and
placed into the list object in that order.  When a comprehension is supplied,
the list is constructed from the elements resulting from the comprehension.

<a id="set"></a>

### Set displays

<a id="index-16"></a>

A set display is denoted by curly braces and distinguishable from dictionary
displays by the lack of colons separating keys and values:

A set display yields a new mutable set object, the contents being specified by
either a sequence of expressions or a comprehension.  When a comma-separated
list of expressions is supplied, its elements are evaluated from left to right
and added to the set object.  When a comprehension is supplied, the set is
constructed from the elements resulting from the comprehension.

An empty set cannot be constructed with `{}`; this literal constructs an empty
dictionary.

<a id="dict"></a>

### Dictionary displays

<a id="index-17"></a>

A dictionary display is a possibly empty series of dict items (key/value pairs)
enclosed in curly braces:

A dictionary display yields a new dictionary object.

If a comma-separated sequence of dict items is given, they are evaluated
from left to right to define the entries of the dictionary: each key object is
used as a key into the dictionary to store the corresponding value.  This means
that you can specify the same key multiple times in the dict item list, and the
final dictionary’s value for that key will be the last one given.

<a id="index-18"></a>

A double asterisk `**` denotes *dictionary unpacking*.
Its operand must be a [mapping](../glossary.md#term-mapping).  Each mapping item is added
to the new dictionary.  Later values replace values already set by
earlier dict items and earlier dictionary unpackings.

#### Versionadded
Added in version 3.5: Unpacking into dictionary displays, originally proposed by [**PEP 448**](https://peps.python.org/pep-0448/).

A dict comprehension may take one of two forms:

- The first form  uses two expressions separated with a colon followed by the
  usual “for” and “if” clauses.  When the comprehension is run, the resulting
  key and value elements are inserted in the new dictionary in the order they
  are produced.
- The second form uses a single expression prefixed by the `**` dictionary
  unpacking operator followed by the usual “for” and “if” clauses.  When the
  comprehension is evaluated, the expression is evaluated and then unpacked,
  inserting zero or more key/value pairs into the new dictionary.

Both forms of dictionary comprehension retain the property that if the same key
is specified multiple times, the associated value in the resulting dictionary
will be the last one specified.

<a id="index-20"></a>

Restrictions on the types of the key values are listed earlier in section
[The standard type hierarchy](datamodel.md#types).  (To summarize, the key type should be [hashable](../glossary.md#term-hashable), which excludes
all mutable objects.)  Clashes between duplicate keys are not detected; the last
value (textually rightmost in the display) stored for a given key value
prevails.

#### Versionchanged
Changed in version 3.8: Prior to Python 3.8, in dict comprehensions, the evaluation order of key
and value was not well-defined.  In CPython, the value was evaluated before
the key.  Starting with 3.8, the key is evaluated before the value, as
proposed by [**PEP 572**](https://peps.python.org/pep-0572/).

#### Versionchanged
Changed in version 3.15: Unpacking with the `**` operator is now allowed in dictionary comprehensions.

<a id="genexpr"></a>

### Generator expressions

<a id="index-22"></a>

A generator expression is a compact generator notation in parentheses:

A generator expression yields a new generator object.  Its syntax is the same as
for comprehensions, except that it is enclosed in parentheses instead of
brackets or curly braces.

Variables used in the generator expression are evaluated lazily when the
[`__next__()`](#generator.__next__) method is called for the generator object (in the same
fashion as normal generators).  However, the iterable expression in the
leftmost `for` clause is immediately evaluated, and the
[iterator](../glossary.md#term-iterator) is immediately created for that iterable, so that an error
produced while creating the iterator will be emitted at the point where the generator expression
is defined, rather than at the point where the first value is retrieved.
Subsequent `for` clauses and any filter condition in the leftmost
`for` clause cannot be evaluated in the enclosing scope as they may
depend on the values obtained from the leftmost iterable. For example:
`(x*y for x in range(10) for y in range(x, x+10))`.

The parentheses can be omitted on calls with only one argument.  See section
[Calls](#calls) for details.

To avoid interfering with the expected operation of the generator expression
itself, `yield` and `yield from` expressions are prohibited in the
implicitly defined generator.

If a generator expression contains either `async for`
clauses or [`await`](#await) expressions it is called an
*asynchronous generator expression*.  An asynchronous generator
expression returns a new asynchronous generator object,
which is an asynchronous iterator (see [Asynchronous Iterators](datamodel.md#async-iterators)).

#### Versionadded
Added in version 3.6: Asynchronous generator expressions were introduced.

#### Versionchanged
Changed in version 3.7: Prior to Python 3.7, asynchronous generator expressions could
only appear in [`async def`](compound_stmts.md#async-def) coroutines.  Starting
with 3.7, any function can use asynchronous generator expressions.

#### Versionchanged
Changed in version 3.8: `yield` and `yield from` prohibited in the implicitly nested scope.

<a id="yieldexpr"></a>

### Yield expressions

<a id="index-23"></a>

The yield expression is used when defining a [generator](../glossary.md#term-generator) function
or an [asynchronous generator](../glossary.md#term-asynchronous-generator) function and
thus can only be used in the body of a function definition.  Using a yield
expression in a function’s body causes that function to be a generator function,
and using it in an [`async def`](compound_stmts.md#async-def) function’s body causes that
coroutine function to be an asynchronous generator function. For example:

```python3
def gen():  # defines a generator function
    yield 123

async def agen(): # defines an asynchronous generator function
    yield 123
```

Due to their side effects on the containing scope, `yield` expressions
are not permitted as part of the implicitly defined scopes used to
implement comprehensions and generator expressions.

#### Versionchanged
Changed in version 3.8: Yield expressions prohibited in the implicitly nested scopes used to
implement comprehensions and generator expressions.

Generator functions are described below, while asynchronous generator
functions are described separately in section
[Asynchronous generator functions](#asynchronous-generator-functions).

When a generator function is called, it returns an iterator known as a
generator.  That generator then controls the execution of the generator
function.  The execution starts when one of the generator’s methods is called.
At that time, the execution proceeds to the first yield expression, where it is
suspended again, returning the value of [`yield_list`](#grammar-token-python-grammar-yield_list)
to the generator’s caller,
or `None` if [`yield_list`](#grammar-token-python-grammar-yield_list) is omitted.
By suspended, we mean that all local state is
retained, including the current bindings of local variables, the instruction
pointer, the internal evaluation stack, and the state of any exception handling.
When the execution is resumed by calling one of the generator’s methods, the
function can proceed exactly as if the yield expression were just another
external call.  The value of the yield expression after resuming depends on the
method which resumed the execution.  If [`__next__()`](#generator.__next__) is used
(typically via either a [`for`](compound_stmts.md#for) or the [`next()`](../library/functions.md#next) builtin) then the
result is [`None`](../library/constants.md#None).  Otherwise, if [`send()`](#generator.send) is used, then
the result will be the value passed in to that method.

<a id="index-24"></a>

All of this makes generator functions quite similar to coroutines; they yield
multiple times, they have more than one entry point and their execution can be
suspended.  The only difference is that a generator function cannot control
where the execution should continue after it yields; the control is always
transferred to the generator’s caller.

Yield expressions are allowed anywhere in a [`try`](compound_stmts.md#try) construct.  If the
generator is not resumed before it is
finalized (by reaching a zero reference count or by being garbage collected),
the generator-iterator’s [`close()`](#generator.close) method will be called,
allowing any pending [`finally`](compound_stmts.md#finally) clauses to execute.

<a id="index-25"></a>

When `yield from <expr>` is used, the supplied expression must be an
iterable. The values produced by iterating that iterable are passed directly
to the caller of the current generator’s methods. Any values passed in with
[`send()`](#generator.send) and any exceptions passed in with
[`throw()`](#generator.throw) are passed to the underlying iterator if it has the
appropriate methods.  If this is not the case, then [`send()`](#generator.send)
will raise [`AttributeError`](../library/exceptions.md#AttributeError) or [`TypeError`](../library/exceptions.md#TypeError), while
[`throw()`](#generator.throw) will just raise the passed in exception immediately.

When the underlying iterator is complete, the [`value`](../library/exceptions.md#StopIteration.value)
attribute of the raised [`StopIteration`](../library/exceptions.md#StopIteration) instance becomes the value of
the yield expression. It can be either set explicitly when raising
[`StopIteration`](../library/exceptions.md#StopIteration), or automatically when the subiterator is a generator
(by returning a value from the subgenerator).

#### Versionchanged
Changed in version 3.3: Added `yield from <expr>` to delegate control flow to a subiterator.

The parentheses may be omitted when the yield expression is the sole expression
on the right hand side of an assignment statement.

#### SEE ALSO
[**PEP 255**](https://peps.python.org/pep-0255/) - Simple Generators
: The proposal for adding generators and the [`yield`](simple_stmts.md#yield) statement to Python.

[**PEP 342**](https://peps.python.org/pep-0342/) - Coroutines via Enhanced Generators
: The proposal to enhance the API and syntax of generators, making them
  usable as simple coroutines.

[**PEP 380**](https://peps.python.org/pep-0380/) - Syntax for Delegating to a Subgenerator
: The proposal to introduce the [`yield_from`](#grammar-token-python-grammar-yield_from) syntax,
  making delegation to subgenerators easy.

[**PEP 525**](https://peps.python.org/pep-0525/) - Asynchronous Generators
: The proposal that expanded on [**PEP 492**](https://peps.python.org/pep-0492/) by adding generator capabilities to
  coroutine functions.

<a id="index-31"></a>

<a id="generator-methods"></a>

#### Generator-iterator methods

This subsection describes the methods of a generator iterator.  They can
be used to control the execution of a generator function.

Note that calling any of the generator methods below when the generator
is already executing raises a [`ValueError`](../library/exceptions.md#ValueError) exception.

<a id="index-32"></a>

#### generator.\_\_next_\_()

Starts the execution of a generator function or resumes it at the last
executed yield expression.  When a generator function is resumed with a
[`__next__()`](#generator.__next__) method, the current yield expression always
evaluates to [`None`](../library/constants.md#None).  The execution then continues to the next yield
expression, where the generator is suspended again, and the value of the
[`yield_list`](#grammar-token-python-grammar-yield_list) is returned to [`__next__()`](#generator.__next__)’s
caller.  If the generator exits without yielding another value, a
[`StopIteration`](../library/exceptions.md#StopIteration) exception is raised.

This method is normally called implicitly, e.g. by a [`for`](compound_stmts.md#for) loop, or
by the built-in [`next()`](../library/functions.md#next) function.

#### generator.send(value)

Resumes the execution and “sends” a value into the generator function.  The
*value* argument becomes the result of the current yield expression.  The
[`send()`](#generator.send) method returns the next value yielded by the generator, or
raises [`StopIteration`](../library/exceptions.md#StopIteration) if the generator exits without yielding another
value.  When [`send()`](#generator.send) is called to start the generator, it must be called
with [`None`](../library/constants.md#None) as the argument, because there is no yield expression that
could receive the value.

#### generator.throw(value)

#### generator.throw(type)

Raises an exception at the point where the generator was paused,
and returns the next value yielded by the generator function.  If the generator
exits without yielding another value, a [`StopIteration`](../library/exceptions.md#StopIteration) exception is
raised.  If the generator function does not catch the passed-in exception, or
raises a different exception, then that exception propagates to the caller.

In typical use, this is called with a single exception instance similar to the
way the [`raise`](simple_stmts.md#raise) keyword is used.

For backwards compatibility, however, the second signature is
supported, following a convention from older versions of Python.
The *type* argument should be an exception class, and *value*
should be an exception instance. If the *value* is not provided, the
*type* constructor is called to get an instance. If *traceback*
is provided, it is set on the exception, otherwise any existing
[`__traceback__`](../library/exceptions.md#BaseException.__traceback__) attribute stored in *value* may
be cleared.

#### Versionchanged
Changed in version 3.12: The second signature (type[, value[, traceback]]) is deprecated and
may be removed in a future version of Python.

<a id="index-33"></a>

#### generator.close()

Raises a [`GeneratorExit`](../library/exceptions.md#GeneratorExit) exception at the point where the generator
function was paused (equivalent to calling `throw(GeneratorExit)`).
The exception is raised by the yield expression where the generator was paused.
If the generator function catches the exception and returns a
value, this value is returned from [`close()`](#generator.close).  If the generator function
is already closed, or raises [`GeneratorExit`](../library/exceptions.md#GeneratorExit) (by not catching the
exception), [`close()`](#generator.close) returns [`None`](../library/constants.md#None).  If the generator yields a
value, a [`RuntimeError`](../library/exceptions.md#RuntimeError) is raised.  If the generator raises any other
exception, it is propagated to the caller.  If the generator has already
exited due to an exception or normal exit, [`close()`](#generator.close) returns
[`None`](../library/constants.md#None) and has no other effect.

#### Versionchanged
Changed in version 3.13: If a generator returns a value upon being closed, the value is returned
by [`close()`](#generator.close).

<a id="index-34"></a>

#### Examples

Here is a simple example that demonstrates the behavior of generators and
generator functions:

```python3
>>> def echo(value=None):
...     print("Execution starts when 'next()' is called for the first time.")
...     try:
...         while True:
...             try:
...                 value = (yield value)
...             except Exception as e:
...                 value = e
...     finally:
...         print("Don't forget to clean up when 'close()' is called.")
...
>>> generator = echo(1)
>>> print(next(generator))
Execution starts when 'next()' is called for the first time.
1
>>> print(next(generator))
None
>>> print(generator.send(2))
2
>>> generator.throw(TypeError, "spam")
TypeError('spam',)
>>> generator.close()
Don't forget to clean up when 'close()' is called.
```

For examples using `yield from`, see [PEP 380: Syntax for Delegating to a Subgenerator](../whatsnew/3.3.md#pep-380) in “What’s New in
Python.”

<a id="asynchronous-generator-functions"></a>

#### Asynchronous generator functions

The presence of a yield expression in a function or method defined using
[`async def`](compound_stmts.md#async-def) further defines the function as an
[asynchronous generator](../glossary.md#term-asynchronous-generator) function.

When an asynchronous generator function is called, it returns an
asynchronous iterator known as an asynchronous generator object.
That object then controls the execution of the generator function.
An asynchronous generator object is typically used in an
[`async for`](compound_stmts.md#async-for) statement in a coroutine function analogously to
how a generator object would be used in a [`for`](compound_stmts.md#for) statement.

Calling one of the asynchronous generator’s methods returns an [awaitable](../glossary.md#term-awaitable)
object, and the execution starts when this object is awaited on. At that time,
the execution proceeds to the first yield expression, where it is suspended
again, returning the value of [`yield_list`](#grammar-token-python-grammar-yield_list) to the
awaiting coroutine. As with a generator, suspension means that all local state
is retained, including the current bindings of local variables, the instruction
pointer, the internal evaluation stack, and the state of any exception handling.
When the execution is resumed by awaiting on the next object returned by the
asynchronous generator’s methods, the function can proceed exactly as if the
yield expression were just another external call. The value of the yield
expression after resuming depends on the method which resumed the execution.  If
[`__anext__()`](#agen.__anext__) is used then the result is [`None`](../library/constants.md#None). Otherwise, if
[`asend()`](#agen.asend) is used, then the result will be the value passed in to that
method.

If an asynchronous generator happens to exit early by [`break`](simple_stmts.md#break), the caller
task being cancelled, or other exceptions, the generator’s async cleanup code
will run and possibly raise exceptions or access context variables in an
unexpected context–perhaps after the lifetime of tasks it depends, or
during the event loop shutdown when the async-generator garbage collection hook
is called.
To prevent this, the caller must explicitly close the async generator by calling
[`aclose()`](#agen.aclose) method to finalize the generator and ultimately detach it
from the event loop.

In an asynchronous generator function, yield expressions are allowed anywhere
in a [`try`](compound_stmts.md#try) construct. However, if an asynchronous generator is not
resumed before it is finalized (by reaching a zero reference count or by
being garbage collected), then a yield expression within a `try`
construct could result in a failure to execute pending [`finally`](compound_stmts.md#finally)
clauses.  In this case, it is the responsibility of the event loop or
scheduler running the asynchronous generator to call the asynchronous
generator-iterator’s [`aclose()`](#agen.aclose) method and run the resulting
coroutine object, thus allowing any pending `finally` clauses
to execute.

To take care of finalization upon event loop termination, an event loop should
define a *finalizer* function which takes an asynchronous generator-iterator and
presumably calls [`aclose()`](#agen.aclose) and executes the coroutine.
This  *finalizer* may be registered by calling [`sys.set_asyncgen_hooks()`](../library/sys.md#sys.set_asyncgen_hooks).
When first iterated over, an asynchronous generator-iterator will store the
registered *finalizer* to be called upon finalization. For a reference example
of a *finalizer* method see the implementation of
`asyncio.Loop.shutdown_asyncgens` in [Lib/asyncio/base_events.py](https://github.com/python/cpython/tree/main/Lib/asyncio/base_events.py).

The expression `yield from <expr>` is a syntax error when used in an
asynchronous generator function.

<a id="index-35"></a>

<a id="asynchronous-generator-methods"></a>

#### Asynchronous generator-iterator methods

This subsection describes the methods of an asynchronous generator iterator,
which are used to control the execution of a generator function.

<a id="index-36"></a>

#### *async* agen.\_\_anext_\_()

Returns an awaitable which when run starts to execute the asynchronous
generator or resumes it at the last executed yield expression.  When an
asynchronous generator function is resumed with an [`__anext__()`](#agen.__anext__)
method, the current yield expression always evaluates to [`None`](../library/constants.md#None) in the
returned awaitable, which when run will continue to the next yield
expression. The value of the [`yield_list`](#grammar-token-python-grammar-yield_list) of the
yield expression is the value of the [`StopIteration`](../library/exceptions.md#StopIteration) exception raised by
the completing coroutine.  If the asynchronous generator exits without
yielding another value, the awaitable instead raises a
[`StopAsyncIteration`](../library/exceptions.md#StopAsyncIteration) exception, signalling that the asynchronous
iteration has completed.

This method is normally called implicitly by a [`async for`](compound_stmts.md#async-for) loop.

#### *async* agen.asend(value)

Returns an awaitable which when run resumes the execution of the
asynchronous generator. As with the [`send()`](#generator.send) method for a
generator, this “sends” a value into the asynchronous generator function,
and the *value* argument becomes the result of the current yield expression.
The awaitable returned by the [`asend()`](#agen.asend) method will return the next
value yielded by the generator as the value of the raised
[`StopIteration`](../library/exceptions.md#StopIteration), or raises [`StopAsyncIteration`](../library/exceptions.md#StopAsyncIteration) if the
asynchronous generator exits without yielding another value.  When
[`asend()`](#agen.asend) is called to start the asynchronous
generator, it must be called with [`None`](../library/constants.md#None) as the argument,
because there is no yield expression that could receive the value.

#### *async* agen.athrow(value)

#### *async* agen.athrow(type)

Returns an awaitable that raises an exception of type `type` at the point
where the asynchronous generator was paused, and returns the next value
yielded by the generator function as the value of the raised
[`StopIteration`](../library/exceptions.md#StopIteration) exception.  If the asynchronous generator exits
without yielding another value, a [`StopAsyncIteration`](../library/exceptions.md#StopAsyncIteration) exception is
raised by the awaitable.
If the generator function does not catch the passed-in exception, or
raises a different exception, then when the awaitable is run that exception
propagates to the caller of the awaitable.

#### Versionchanged
Changed in version 3.12: The second signature (type[, value[, traceback]]) is deprecated and
may be removed in a future version of Python.

<a id="index-37"></a>

#### *async* agen.aclose()

Returns an awaitable that when run will throw a [`GeneratorExit`](../library/exceptions.md#GeneratorExit) into
the asynchronous generator function at the point where it was paused.
If the asynchronous generator function then exits gracefully, is already
closed, or raises [`GeneratorExit`](../library/exceptions.md#GeneratorExit) (by not catching the exception),
then the returned awaitable will raise a [`StopIteration`](../library/exceptions.md#StopIteration) exception.
Any further awaitables returned by subsequent calls to the asynchronous
generator will raise a [`StopAsyncIteration`](../library/exceptions.md#StopAsyncIteration) exception.  If the
asynchronous generator yields a value, a [`RuntimeError`](../library/exceptions.md#RuntimeError) is raised
by the awaitable.  If the asynchronous generator raises any other exception,
it is propagated to the caller of the awaitable.  If the asynchronous
generator has already exited due to an exception or normal exit, then
further calls to [`aclose()`](#agen.aclose) will return an awaitable that does nothing.

<a id="primaries"></a>

## Primaries

<a id="index-38"></a>

Primaries represent the most tightly bound operations of the language. Their
syntax is:

<a id="attribute-references"></a>

### Attribute references

<a id="index-39"></a>

An attribute reference is a primary followed by a period and a name:

<a id="index-40"></a>

The primary must evaluate to an object of a type that supports attribute
references, which most objects do.  This object is then asked to produce the
attribute whose name is the identifier. The type and value produced is
determined by the object.  Multiple evaluations of the same attribute
reference may yield different objects.

This production can be customized by overriding the
[`__getattribute__()`](datamodel.md#object.__getattribute__) method or the [`__getattr__()`](datamodel.md#object.__getattr__)
method.  The `__getattribute__()` method is called first and either
returns a value or raises [`AttributeError`](../library/exceptions.md#AttributeError) if the attribute is not
available.

If an [`AttributeError`](../library/exceptions.md#AttributeError) is raised and the object has a `__getattr__()`
method, that method is called as a fallback.

<a id="subscriptions"></a>

### Subscriptions and slicings

<a id="index-41"></a>

<a id="index-42"></a>

The *subscription* syntax is usually used for selecting an element from a
[container](datamodel.md#sequence-types) – for example, to get a value from
a [`dict`](../library/stdtypes.md#dict):

```python3
>>> digits_by_name = {'one': 1, 'two': 2}
>>> digits_by_name['two']  # Subscripting a dictionary using the key 'two'
2
```

In the subscription syntax, the object being subscribed – a
[primary](#primaries) – is followed by a *subscript* in
square brackets.
In the simplest case, the subscript is a single expression.

Depending on the type of the object being subscribed, the subscript is
sometimes called a [key](../glossary.md#term-key) (for mappings), [index](../glossary.md#term-index) (for sequences),
or *type argument* (for [generic types](../glossary.md#term-generic-type)).
Syntactically, these are all equivalent:

```python3
>>> colors = ['red', 'blue', 'green', 'black']
>>> colors[3]  # Subscripting a list using the index 3
'black'

>>> list[str]  # Parameterizing the list type using the type argument str
list[str]
```

At runtime, the interpreter will evaluate the primary and
the subscript, and call the primary’s [`__getitem__()`](datamodel.md#object.__getitem__) or
[`__class_getitem__()`](datamodel.md#object.__class_getitem__) [special method](../glossary.md#term-special-method) with the subscript
as argument.
For more details on which of these methods is called, see
[\_\_class_getitem_\_ versus \_\_getitem_\_](datamodel.md#classgetitem-versus-getitem).

To show how subscription works, we can define a custom object that
implements [`__getitem__()`](datamodel.md#object.__getitem__) and prints out the value of
the subscript:

```python3
>>> class SubscriptionDemo:
...     def __getitem__(self, key):
...         print(f'subscripted with: {key!r}')
...
>>> demo = SubscriptionDemo()
>>> demo[1]
subscripted with: 1
>>> demo['a' * 3]
subscripted with: 'aaa'
```

See [`__getitem__()`](datamodel.md#object.__getitem__) documentation for how built-in types handle
subscription.

Subscriptions may also be used as targets in [assignment](simple_stmts.md#assignment) or
[deletion](simple_stmts.md#del) statements.
In these cases, the interpreter will call the subscripted object’s
[`__setitem__()`](datamodel.md#object.__setitem__) or [`__delitem__()`](datamodel.md#object.__delitem__)
[special method](../glossary.md#term-special-method), respectively, instead of [`__getitem__()`](datamodel.md#object.__getitem__).

```python3
>>> colors = ['red', 'blue', 'green', 'black']
>>> colors[3] = 'white'  # Setting item at index
>>> colors
['red', 'blue', 'green', 'white']
>>> del colors[3]  # Deleting item at index 3
>>> colors
['red', 'blue', 'green']
```

All advanced forms of *subscript* documented in the following sections
are also usable for assignment and deletion.

<a id="index-43"></a>

<a id="index-44"></a>

<a id="slicings"></a>

#### Slicings

A more advanced form of subscription, *slicing*, is commonly used
to extract a portion of a [sequence](datamodel.md#datamodel-sequences).
In this form, the subscript is a [slice](../glossary.md#term-slice): up to three
expressions separated by colons.
Any of the expressions may be omitted, but a slice must contain at least one
colon:

```python3
>>> number_names = ['zero', 'one', 'two', 'three', 'four', 'five']
>>> number_names[1:3]
['one', 'two']
>>> number_names[1:]
['one', 'two', 'three', 'four', 'five']
>>> number_names[:3]
['zero', 'one', 'two']
>>> number_names[:]
['zero', 'one', 'two', 'three', 'four', 'five']
>>> number_names[::2]
['zero', 'two', 'four']
>>> number_names[:-3]
['zero', 'one', 'two']
>>> del number_names[4:]
>>> number_names
['zero', 'one', 'two', 'three']
```

When a slice is evaluated, the interpreter constructs a [`slice`](../library/functions.md#slice) object
whose [`start`](../library/functions.md#slice.start), [`stop`](../library/functions.md#slice.stop) and
[`step`](../library/functions.md#slice.step) attributes, respectively, are the results of the
expressions between the colons.
Any missing expression evaluates to [`None`](../library/constants.md#None).
This `slice` object is then passed to the [`__getitem__()`](datamodel.md#object.__getitem__)
or [`__class_getitem__()`](datamodel.md#object.__class_getitem__) [special method](../glossary.md#term-special-method), as above.

```python3
# continuing with the SubscriptionDemo instance defined above:
>>> demo[2:3]
subscripted with: slice(2, 3, None)
>>> demo[::'spam']
subscripted with: slice(None, None, 'spam')
```

#### Comma-separated subscripts

The subscript can also be given as two or more comma-separated expressions
or slices:

```python3
# continuing with the SubscriptionDemo instance defined above:
>>> demo[1, 2, 3]
subscripted with: (1, 2, 3)
>>> demo[1:2, 3]
subscripted with: (slice(1, 2, None), 3)
```

This form is commonly used with numerical libraries for slicing
multi-dimensional data.
In this case, the interpreter constructs a [`tuple`](../library/stdtypes.md#tuple) of the results of the
expressions or slices, and passes this tuple to the [`__getitem__()`](datamodel.md#object.__getitem__)
or [`__class_getitem__()`](datamodel.md#object.__class_getitem__) [special method](../glossary.md#term-special-method), as above.

The subscript may also be given as a single expression or slice followed
by a comma, to specify a one-element tuple:

```python3
>>> demo['spam',]
subscripted with: ('spam',)
```

#### “Starred” subscriptions

#### Versionadded
Added in version 3.11: Expressions in *tuple_slices* may be starred. See [**PEP 646**](https://peps.python.org/pep-0646/).

The subscript can also contain a starred expression.
In this case, the interpreter unpacks the result into a tuple, and passes
this tuple to [`__getitem__()`](datamodel.md#object.__getitem__) or [`__class_getitem__()`](datamodel.md#object.__class_getitem__):

```python3
# continuing with the SubscriptionDemo instance defined above:
>>> demo[*range(10)]
subscripted with: (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)
```

Starred expressions may be combined with comma-separated expressions
and slices:

```python3
>>> demo['a', 'b', *range(3), 'c']
subscripted with: ('a', 'b', 0, 1, 2, 'c')
```

#### Formal subscription grammar

Recall that the `|` operator [denotes ordered choice](introduction.md#notation).
Specifically, in `subscript`, if both alternatives would match, the
first (`single_subscript`) has priority.

<a id="index-46"></a>

<a id="calls"></a>

### Calls

A call calls a callable object (e.g., a [function](../glossary.md#term-function)) with a possibly empty
series of [arguments](../glossary.md#term-argument):

An optional trailing comma may be present after the positional and keyword arguments
but does not affect the semantics.

<a id="index-47"></a>

The primary must evaluate to a callable object (user-defined functions, built-in
functions, methods of built-in objects, class objects, methods of class
instances, and all objects having a [`__call__()`](datamodel.md#object.__call__) method are callable).  All
argument expressions are evaluated before the call is attempted.  Please refer
to section [Function definitions](compound_stmts.md#function) for the syntax of formal [parameter](../glossary.md#term-parameter) lists.

<!-- XXX update with kwonly args PEP -->

If keyword arguments are present, they are first converted to positional
arguments, as follows.  First, a list of unfilled slots is created for the
formal parameters.  If there are N positional arguments, they are placed in the
first N slots.  Next, for each keyword argument, the identifier is used to
determine the corresponding slot (if the identifier is the same as the first
formal parameter name, the first slot is used, and so on).  If the slot is
already filled, a [`TypeError`](../library/exceptions.md#TypeError) exception is raised. Otherwise, the
argument is placed in the slot, filling it (even if the expression is
`None`, it fills the slot).  When all arguments have been processed, the slots
that are still unfilled are filled with the corresponding default value from the
function definition.  (Default values are calculated, once, when the function is
defined; thus, a mutable object such as a list or dictionary used as default
value will be shared by all calls that don’t specify an argument value for the
corresponding slot; this should usually be avoided.)  If there are any unfilled
slots for which no default value is specified, a [`TypeError`](../library/exceptions.md#TypeError) exception is
raised.  Otherwise, the list of filled slots is used as the argument list for
the call.

**CPython implementation detail:** An implementation may provide built-in functions whose positional parameters
do not have names, even if they are ‘named’ for the purpose of documentation,
and which therefore cannot be supplied by keyword.  In CPython, this is the
case for functions implemented in C that use [`PyArg_ParseTuple()`](../c-api/arg.md#c.PyArg_ParseTuple) to
parse their arguments.

If there are more positional arguments than there are formal parameter slots, a
[`TypeError`](../library/exceptions.md#TypeError) exception is raised, unless a formal parameter using the syntax
`*identifier` is present; in this case, that formal parameter receives a tuple
containing the excess positional arguments (or an empty tuple if there were no
excess positional arguments).

If any keyword argument does not correspond to a formal parameter name, a
[`TypeError`](../library/exceptions.md#TypeError) exception is raised, unless a formal parameter using the syntax
`**identifier` is present; in this case, that formal parameter receives a
dictionary containing the excess keyword arguments (using the keywords as keys
and the argument values as corresponding values), or a (new) empty dictionary if
there were no excess keyword arguments.

<a id="index-48"></a>

If the syntax `*expression` appears in the function call, `expression` must
evaluate to an [iterable](../glossary.md#term-iterable).  Elements from these iterables are
treated as if they were additional positional arguments.  For the call
`f(x1, x2, *y, x3, x4)`, if *y* evaluates to a sequence *y1*, …, *yM*,
this is equivalent to a call with M+4 positional arguments *x1*, *x2*,
*y1*, …, *yM*, *x3*, *x4*.

A consequence of this is that although the `*expression` syntax may appear
*after* explicit keyword arguments, it is processed *before* the
keyword arguments (and any `**expression` arguments – see below).  So:

```python3
>>> def f(a, b):
...     print(a, b)
...
>>> f(b=1, *(2,))
2 1
>>> f(a=1, *(2,))
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: f() got multiple values for keyword argument 'a'
>>> f(1, *(2,))
1 2
```

It is unusual for both keyword arguments and the `*expression` syntax to be
used in the same call, so in practice this confusion does not often arise.

<a id="index-49"></a>

If the syntax `**expression` appears in the function call, `expression` must
evaluate to a [mapping](../glossary.md#term-mapping), the contents of which are treated as
additional keyword arguments. If a parameter matching a key has already been
given a value (by an explicit keyword argument, or from another unpacking),
a [`TypeError`](../library/exceptions.md#TypeError) exception is raised.

When `**expression` is used, each key in this mapping must be
a string.
Each value from the mapping is assigned to the first formal parameter
eligible for keyword assignment whose name is equal to the key.
A key need not be a Python identifier (e.g. `"max-temp °F"` is acceptable,
although it will not match any formal parameter that could be declared).
If there is no match to a formal parameter
the key-value pair is collected by the `**` parameter, if there is one,
or if there is not, a [`TypeError`](../library/exceptions.md#TypeError) exception is raised.

Formal parameters using the syntax `*identifier` or `**identifier` cannot be
used as positional argument slots or as keyword argument names.

#### Versionchanged
Changed in version 3.5: Function calls accept any number of `*` and `**` unpackings,
positional arguments may follow iterable unpackings (`*`),
and keyword arguments may follow dictionary unpackings (`**`).
Originally proposed by [**PEP 448**](https://peps.python.org/pep-0448/).

A call always returns some value, possibly `None`, unless it raises an
exception.  How this value is computed depends on the type of the callable
object.

If it is—

a user-defined function:
: <a id="index-51"></a>
  <br/>
  The code block for the function is executed, passing it the argument list.  The
  first thing the code block will do is bind the formal parameters to the
  arguments; this is described in section [Function definitions](compound_stmts.md#function).  When the code block
  executes a [`return`](simple_stmts.md#return) statement, this specifies the return value of the
  function call.  If execution reaches the end of the code block without
  executing a [`return`](simple_stmts.md#return) statement, the return value is `None`.

a built-in function or method:
: <a id="index-52"></a>
  <br/>
  The result is up to the interpreter; see [Built-in Functions](../library/functions.md#built-in-funcs) for the
  descriptions of built-in functions and methods.

a class object:
: <a id="index-53"></a>
  <br/>
  A new instance of that class is returned.

a class instance method:
: <a id="index-54"></a>
  <br/>
  The corresponding user-defined function is called, with an argument list that is
  one longer than the argument list of the call: the instance becomes the first
  argument.

a class instance:
: <a id="index-55"></a>
  <br/>
  The class must define a [`__call__()`](datamodel.md#object.__call__) method; the effect is then the same as
  if that method was called.

<a id="index-56"></a>

<a id="await"></a>

## Await expression

Suspend the execution of [coroutine](../glossary.md#term-coroutine) on an [awaitable](../glossary.md#term-awaitable) object.
Can only be used inside a [coroutine function](../glossary.md#term-coroutine-function).

#### Versionadded
Added in version 3.5.

<a id="power"></a>

## The power operator

<a id="index-57"></a>

The power operator binds more tightly than unary operators on its left; it binds
less tightly than unary operators on its right.  The syntax is:

Thus, in an unparenthesized sequence of power and unary operators, the operators
are evaluated from right to left (this does not constrain the evaluation order
for the operands): `-1**2` results in `-1`.

The power operator has the same semantics as the built-in [`pow()`](../library/functions.md#pow) function,
when called with two arguments: it yields its left argument raised to the power
of its right argument.
Numeric arguments are first [converted to a common type](../library/stdtypes.md#stdtypes-mixed-arithmetic),
and the result is of that type.

For int operands, the result has the same type as the operands unless the second
argument is negative; in that case, all arguments are converted to float and a
float result is delivered. For example, `10**2` returns `100`, but
`10**-2` returns `0.01`.

Raising `0.0` to a negative power results in a [`ZeroDivisionError`](../library/exceptions.md#ZeroDivisionError).
Raising a negative number to a fractional power results in a [`complex`](../library/functions.md#complex)
number. (In earlier versions it raised a [`ValueError`](../library/exceptions.md#ValueError).)

This operation can be customized using the special [`__pow__()`](datamodel.md#object.__pow__) and
[`__rpow__()`](datamodel.md#object.__rpow__) methods.

<a id="unary"></a>

## Unary arithmetic and bitwise operations

<a id="index-58"></a>

All unary arithmetic and bitwise operations have the same priority:

<a id="index-59"></a>

The unary `-` (minus) operator yields the negation of its numeric argument; the
operation can be overridden with the [`__neg__()`](datamodel.md#object.__neg__) special method.

<a id="index-60"></a>

The unary `+` (plus) operator yields its numeric argument unchanged; the
operation can be overridden with the [`__pos__()`](datamodel.md#object.__pos__) special method.

<a id="index-61"></a>

The unary `~` (invert) operator yields the bitwise inversion of its integer
argument.  The bitwise inversion of `x` is defined as `-(x+1)`.  It only
applies to integral numbers or to custom objects that override the
[`__invert__()`](datamodel.md#object.__invert__) special method.

<a id="index-62"></a>

In all three cases, if the argument does not have the proper type, a
[`TypeError`](../library/exceptions.md#TypeError) exception is raised.

<a id="binary"></a>

## Binary arithmetic operations

<a id="index-63"></a>

The binary arithmetic operations have the conventional priority levels.  Note
that some of these operations also apply to certain non-numeric types.  Apart
from the power operator, there are only two levels, one for multiplicative
operators and one for additive operators:

<a id="index-64"></a>

The `*` (multiplication) operator yields the product of its arguments.  The
arguments must either both be numbers, or one argument must be an integer and
the other must be a sequence. In the former case, the numbers are
[converted to a common real type](../library/stdtypes.md#stdtypes-mixed-arithmetic) and then
multiplied together.  In the latter case, sequence repetition is performed;
a negative repetition factor yields an empty sequence.

This operation can be customized using the special [`__mul__()`](datamodel.md#object.__mul__) and
[`__rmul__()`](datamodel.md#object.__rmul__) methods.

#### Versionchanged
Changed in version 3.14: If only one operand is a complex number, the other operand is converted
to a floating-point number.

<a id="index-65"></a>

The `@` (at) operator is intended to be used for matrix multiplication.  No
builtin Python types implement this operator.

This operation can be customized using the special [`__matmul__()`](datamodel.md#object.__matmul__) and
[`__rmatmul__()`](datamodel.md#object.__rmatmul__) methods.

#### Versionadded
Added in version 3.5.

<a id="index-66"></a>

The `/` (division) and `//` (floor division) operators yield the quotient of
their arguments.  The numeric arguments are first
[converted to a common type](../library/stdtypes.md#stdtypes-mixed-arithmetic).
Division of integers yields a float, while floor division of integers results in an
integer; the result is that of mathematical division with the ‘floor’ function
applied to the result.  Division by zero raises the [`ZeroDivisionError`](../library/exceptions.md#ZeroDivisionError)
exception.

The division operation can be customized using the special [`__truediv__()`](datamodel.md#object.__truediv__)
and [`__rtruediv__()`](datamodel.md#object.__rtruediv__) methods.
The floor division operation can be customized using the special
[`__floordiv__()`](datamodel.md#object.__floordiv__) and [`__rfloordiv__()`](datamodel.md#object.__rfloordiv__) methods.

<a id="index-67"></a>

The `%` (modulo) operator yields the remainder from the division of the first
argument by the second.  The numeric arguments are first
[converted to a common type](../library/stdtypes.md#stdtypes-mixed-arithmetic).
A zero right argument raises the [`ZeroDivisionError`](../library/exceptions.md#ZeroDivisionError) exception.  The
arguments may be floating-point numbers, e.g., `3.14%0.7` equals `0.34`
(since `3.14` equals `4*0.7 + 0.34`.)  The modulo operator always yields a
result with the same sign as its second operand (or zero); the absolute value of
the result is strictly smaller than the absolute value of the second operand
<sup>[1](#id18)</sup>.

The floor division and modulo operators are connected by the following
identity: `x == (x//y)*y + (x%y)`.  Floor division and modulo are also
connected with the built-in function [`divmod()`](../library/functions.md#divmod): `divmod(x, y) == (x//y,
x%y)`. <sup>[2](#id19)</sup>.

In addition to performing the modulo operation on numbers, the `%` operator is
also overloaded by string objects to perform old-style string formatting (also
known as interpolation).  The syntax for string formatting is described in the
Python Library Reference, section [printf-style String Formatting](../library/stdtypes.md#old-string-formatting).

The *modulo* operation can be customized using the special [`__mod__()`](datamodel.md#object.__mod__)
and [`__rmod__()`](datamodel.md#object.__rmod__) methods.

The floor division operator, the modulo operator, and the [`divmod()`](../library/functions.md#divmod)
function are not defined for complex numbers.  Instead, convert to a
floating-point number using the [`abs()`](../library/functions.md#abs) function if appropriate.

<a id="index-68"></a>

The `+` (addition) operator yields the sum of its arguments.  The arguments
must either both be numbers or both be sequences of the same type.  In the
former case, the numbers are
[converted to a common real type](../library/stdtypes.md#stdtypes-mixed-arithmetic) and then
added together.
In the latter case, the sequences are concatenated.

This operation can be customized using the special [`__add__()`](datamodel.md#object.__add__) and
[`__radd__()`](datamodel.md#object.__radd__) methods.

#### Versionchanged
Changed in version 3.14: If only one operand is a complex number, the other operand is converted
to a floating-point number.

<a id="index-69"></a>

The `-` (subtraction) operator yields the difference of its arguments.
The numeric arguments are first
[converted to a common real type](../library/stdtypes.md#stdtypes-mixed-arithmetic).

This operation can be customized using the special [`__sub__()`](datamodel.md#object.__sub__) and
[`__rsub__()`](datamodel.md#object.__rsub__) methods.

#### Versionchanged
Changed in version 3.14: If only one operand is a complex number, the other operand is converted
to a floating-point number.

<a id="shifting"></a>

## Shifting operations

<a id="index-70"></a>

The shifting operations have lower priority than the arithmetic operations:

These operators accept integers as arguments.  They shift the first argument to
the left or right by the number of bits given by the second argument.

The left shift operation can be customized using the special [`__lshift__()`](datamodel.md#object.__lshift__)
and [`__rlshift__()`](datamodel.md#object.__rlshift__) methods.
The right shift operation can be customized using the special [`__rshift__()`](datamodel.md#object.__rshift__)
and [`__rrshift__()`](datamodel.md#object.__rrshift__) methods.

<a id="index-71"></a>

A right shift by *n* bits is defined as floor division by `pow(2,n)`.  A left
shift by *n* bits is defined as multiplication with `pow(2,n)`.

<a id="bitwise"></a>

## Binary bitwise operations

<a id="index-72"></a>

Each of the three bitwise operations has a different priority level:

<a id="index-73"></a>

The `&` operator yields the bitwise AND of its arguments, which must be
integers or one of them must be a custom object overriding [`__and__()`](datamodel.md#object.__and__) or
[`__rand__()`](datamodel.md#object.__rand__) special methods.

<a id="index-74"></a>

The `^` operator yields the bitwise XOR (exclusive OR) of its arguments, which
must be integers or one of them must be a custom object overriding [`__xor__()`](datamodel.md#object.__xor__) or
[`__rxor__()`](datamodel.md#object.__rxor__) special methods.

<a id="index-75"></a>

The `|` operator yields the bitwise (inclusive) OR of its arguments, which
must be integers or one of them must be a custom object overriding [`__or__()`](datamodel.md#object.__or__) or
[`__ror__()`](datamodel.md#object.__ror__) special methods.

<a id="comparisons"></a>

## Comparisons

<a id="index-76"></a>

Unlike C, all comparison operations in Python have the same priority, which is
lower than that of any arithmetic, shifting or bitwise operation.  Also unlike
C, expressions like `a < b < c` have the interpretation that is conventional
in mathematics:

Comparisons yield boolean values: `True` or `False`. Custom
*rich comparison methods* may return non-boolean values. In this case
Python will call [`bool()`](../library/functions.md#bool) on such value in boolean contexts.

<a id="index-77"></a>

Comparisons can be chained arbitrarily, e.g., `x < y <= z` is equivalent to
`x < y and y <= z`, except that `y` is evaluated only once (but in both
cases `z` is not evaluated at all when `x < y` is found to be false).

Formally, if *a*, *b*, *c*, …, *y*, *z* are expressions and *op1*, *op2*, …,
*opN* are comparison operators, then `a op1 b op2 c ... y opN z` is equivalent
to `a op1 b and b op2 c and ... y opN z`, except that each expression is
evaluated at most once.

Note that `a op1 b op2 c` doesn’t imply any kind of comparison between *a* and
*c*, so that, e.g., `x < y > z` is perfectly legal (though perhaps not
pretty).

<a id="expressions-value-comparisons"></a>

### Value comparisons

The operators `<`, `>`, `==`, `>=`, `<=`, and `!=` compare the
values of two objects.  The objects do not need to have the same type.

Chapter [Objects, values and types](datamodel.md#objects) states that objects have a value (in addition to type
and identity).  The value of an object is a rather abstract notion in Python:
For example, there is no canonical access method for an object’s value.  Also,
there is no requirement that the value of an object should be constructed in a
particular way, e.g. comprised of all its data attributes. Comparison operators
implement a particular notion of what the value of an object is.  One can think
of them as defining the value of an object indirectly, by means of their
comparison implementation.

Because all types are (direct or indirect) subtypes of [`object`](../library/functions.md#object), they
inherit the default comparison behavior from [`object`](../library/functions.md#object).  Types can
customize their comparison behavior by implementing
*rich comparison methods* like [`__lt__()`](datamodel.md#object.__lt__), described in
[Basic customization](datamodel.md#customization).

The default behavior for equality comparison (`==` and `!=`) is based on
the identity of the objects.  Hence, equality comparison of instances with the
same identity results in equality, and equality comparison of instances with
different identities results in inequality.  A motivation for this default
behavior is the desire that all objects should be reflexive (i.e. `x is y`
implies `x == y`).

A default order comparison (`<`, `>`, `<=`, and `>=`) is not provided;
an attempt raises [`TypeError`](../library/exceptions.md#TypeError).  A motivation for this default behavior is
the lack of a similar invariant as for equality.

The behavior of the default equality comparison, that instances with different
identities are always unequal, may be in contrast to what types will need that
have a sensible definition of object value and value-based equality.  Such
types will need to customize their comparison behavior, and in fact, a number
of built-in types have done that.

The following list describes the comparison behavior of the most important
built-in types.

* Numbers of built-in numeric types ([Numeric Types — int, float, complex](../library/stdtypes.md#typesnumeric)) and of the standard
  library types [`fractions.Fraction`](../library/fractions.md#fractions.Fraction) and [`decimal.Decimal`](../library/decimal.md#decimal.Decimal) can be
  compared within and across their types, with the restriction that complex
  numbers do not support order comparison.  Within the limits of the types
  involved, they compare mathematically (algorithmically) correct without loss
  of precision.

  The not-a-number values `float('NaN')` and `decimal.Decimal('NaN')` are
  special.  Any ordered comparison of a number to a not-a-number value is false.
  A counter-intuitive implication is that not-a-number values are not equal to
  themselves.  For example, if `x = float('NaN')`, `3 < x`, `x < 3` and
  `x == x` are all false, while `x != x` is true.  This behavior is
  compliant with IEEE 754.
* `None` and [`NotImplemented`](../library/constants.md#NotImplemented) are singletons.  [**PEP 8**](https://peps.python.org/pep-0008/) advises that
  comparisons for singletons should always be done with `is` or `is not`,
  never the equality operators.
* Binary sequences (instances of [`bytes`](../library/stdtypes.md#bytes) or [`bytearray`](../library/stdtypes.md#bytearray)) can be
  compared within and across their types.  They compare lexicographically using
  the numeric values of their elements.
* Strings (instances of [`str`](../library/stdtypes.md#str)) compare lexicographically using the
  numerical Unicode code points (the result of the built-in function
  [`ord()`](../library/functions.md#ord)) of their characters. <sup>[3](#id20)</sup>

  Strings and binary sequences cannot be directly compared.
* Sequences (instances of [`tuple`](../library/stdtypes.md#tuple), [`list`](../library/stdtypes.md#list), or [`range`](../library/stdtypes.md#range)) can
  be compared only within each of their types, with the restriction that ranges
  do not support order comparison.  Equality comparison across these types
  results in inequality, and ordering comparison across these types raises
  [`TypeError`](../library/exceptions.md#TypeError).

  Sequences compare lexicographically using comparison of corresponding
  elements.  The built-in containers typically assume identical objects are
  equal to themselves.  That lets them bypass equality tests for identical
  objects to improve performance and to maintain their internal invariants.

  Lexicographical comparison between built-in collections works as follows:
  - For two collections to compare equal, they must be of the same type, have
    the same length, and each pair of corresponding elements must compare
    equal (for example, `[1,2] == (1,2)` is false because the type is not the
    same).
  - Collections that support order comparison are ordered the same as their
    first unequal elements (for example, `[1,2,x] <= [1,2,y]` has the same
    value as `x <= y`).  If a corresponding element does not exist, the
    shorter collection is ordered first (for example, `[1,2] < [1,2,3]` is
    true).
* Mappings (instances of [`dict`](../library/stdtypes.md#dict)) compare equal if and only if they have
  equal `(key, value)` pairs. Equality comparison of the keys and values
  enforces reflexivity.

  Order comparisons (`<`, `>`, `<=`, and `>=`) raise [`TypeError`](../library/exceptions.md#TypeError).
* Sets (instances of [`set`](../library/stdtypes.md#set) or [`frozenset`](../library/stdtypes.md#frozenset)) can be compared within
  and across their types.

  They define order
  comparison operators to mean subset and superset tests.  Those relations do
  not define total orderings (for example, the two sets `{1,2}` and `{2,3}`
  are not equal, nor subsets of one another, nor supersets of one
  another).  Accordingly, sets are not appropriate arguments for functions
  which depend on total ordering (for example, [`min()`](../library/functions.md#min), [`max()`](../library/functions.md#max), and
  [`sorted()`](../library/functions.md#sorted) produce undefined results given a list of sets as inputs).

  Comparison of sets enforces reflexivity of its elements.
* Most other built-in types have no comparison methods implemented, so they
  inherit the default comparison behavior.

User-defined classes that customize their comparison behavior should follow
some consistency rules, if possible:

* Equality comparison should be reflexive.
  In other words, identical objects should compare equal:
  > `x is y` implies `x == y`
* Comparison should be symmetric.
  In other words, the following expressions should have the same result:
  > `x == y` and `y == x`

  > `x != y` and `y != x`

  > `x < y` and `y > x`

  > `x <= y` and `y >= x`
* Comparison should be transitive.
  The following (non-exhaustive) examples illustrate that:
  > `x > y and y > z` implies `x > z`

  > `x < y and y <= z` implies `x < z`
* Inverse comparison should result in the boolean negation.
  In other words, the following expressions should have the same result:
  > `x == y` and `not x != y`

  > `x < y` and `not x >= y` (for total ordering)

  > `x > y` and `not x <= y` (for total ordering)

  The last two expressions apply to totally ordered collections (e.g. to
  sequences, but not to sets or mappings). See also the
  [`total_ordering()`](../library/functools.md#functools.total_ordering) decorator.
* The [`hash()`](../library/functions.md#hash) result should be consistent with equality.
  Objects that are equal should either have the same hash value,
  or be marked as unhashable.

Python does not enforce these consistency rules. In fact, the not-a-number
values are an example for not following these rules.

<a id="in"></a>

<a id="not-in"></a>

<a id="membership-test-details"></a>

### Membership test operations

The operators [`in`](#in) and [`not in`](#not-in) test for membership.  `x in
s` evaluates to `True` if *x* is a member of *s*, and `False` otherwise.
`x not in s` returns the negation of `x in s`.  All built-in sequences and
set types support this as well as dictionary, for which `in` tests
whether the dictionary has a given key. For container types such as list, tuple,
set, frozenset, dict, or collections.deque, the expression `x in y` is equivalent
to `any(x is e or x == e for e in y)`.

For the string and bytes types, `x in y` is `True` if and only if *x* is a
substring of *y*.  An equivalent test is `y.find(x) != -1`.  Empty strings are
always considered to be a substring of any other string, so `"" in "abc"` will
return `True`.

For user-defined classes which define the [`__contains__()`](datamodel.md#object.__contains__) method, `x in
y` returns `True` if `y.__contains__(x)` returns a true value, and
`False` otherwise.

For user-defined classes which do not define [`__contains__()`](datamodel.md#object.__contains__) but do define
[`__iter__()`](datamodel.md#object.__iter__), `x in y` is `True` if some value `z`, for which the
expression `x is z or x == z` is true, is produced while iterating over `y`.
If an exception is raised during the iteration, it is as if [`in`](#in) raised
that exception.

Lastly, the old-style iteration protocol is tried: if a class defines
[`__getitem__()`](datamodel.md#object.__getitem__), `x in y` is `True` if and only if there is a non-negative
integer index *i* such that `x is y[i] or x == y[i]`, and no lower integer index
raises the [`IndexError`](../library/exceptions.md#IndexError) exception.  (If any other exception is raised, it is as
if [`in`](#in) raised that exception).

<a id="index-79"></a>

The operator [`not in`](#not-in) is defined to have the inverse truth value of
[`in`](#in).

<a id="index-80"></a>

<a id="is"></a>

<a id="is-not"></a>

### Identity comparisons

The operators [`is`](#is) and [`is not`](#is-not) test for an object’s identity: `x
is y` is true if and only if *x* and *y* are the same object.  An Object’s identity
is determined using the [`id()`](../library/functions.md#id) function.  `x is not y` yields the inverse
truth value. <sup>[4](#id21)</sup>

<a id="booleans"></a>

<a id="and"></a>

<a id="or"></a>

<a id="not"></a>

## Boolean operations

<a id="index-81"></a>

In the context of Boolean operations, and also when expressions are used by
control flow statements, the following values are interpreted as false:
`False`, `None`, numeric zero of all types, and empty strings and containers
(including strings, tuples, lists, dictionaries, sets and frozensets).  All
other values are interpreted as true.  User-defined objects can customize their
truth value by providing a [`__bool__()`](datamodel.md#object.__bool__) method.

<a id="index-82"></a>

The operator [`not`](#not) yields `True` if its argument is false, `False`
otherwise.

<a id="index-83"></a>

The expression `x and y` first evaluates *x*; if *x* is false, its value is
returned; otherwise, *y* is evaluated and the resulting value is returned.

<a id="index-84"></a>

The expression `x or y` first evaluates *x*; if *x* is true, its value is
returned; otherwise, *y* is evaluated and the resulting value is returned.

Note that neither [`and`](#and) nor [`or`](#or) restrict the value and type
they return to `False` and `True`, but rather return the last evaluated
argument.  This is sometimes useful, e.g., if `s` is a string that should be
replaced by a default value if it is empty, the expression `s or 'foo'` yields
the desired value.  Because [`not`](#not) has to create a new value, it
returns a boolean value regardless of the type of its argument
(for example, `not 'foo'` produces `False` rather than `''`.)

<a id="index-85"></a>

<a id="assignment-expressions"></a>

## Assignment expressions

An assignment expression (sometimes also called a “named expression” or
“walrus”) assigns an [`expression`](#grammar-token-python-grammar-expression) to an
[`identifier`](lexical_analysis.md#grammar-token-python-grammar-identifier), while also returning the value of the
[`expression`](#grammar-token-python-grammar-expression).

One common use case is when handling matched regular expressions:

```python
if matching := pattern.search(data):
    do_something(matching)
```

Or, when processing a file stream in chunks:

```python
while chunk := file.read(9000):
    process(chunk)
```

Assignment expressions must be surrounded by parentheses when
used as expression statements and when used as sub-expressions in
slicing, conditional, lambda,
keyword-argument, and comprehension-if expressions and
in `assert`, `with`, and `assignment` statements.
In all other places where they can be used, parentheses are not required,
including in `if` and `while` statements.

#### Versionadded
Added in version 3.8: See [**PEP 572**](https://peps.python.org/pep-0572/) for more details about assignment expressions.

<a id="if-expr"></a>

## Conditional expressions

<a id="index-87"></a>

A conditional expression (sometimes called a “ternary operator”) is an
alternative to the if-else statement. As it is an expression, it returns a value
and can appear as a sub-expression.

The expression `x if C else y` first evaluates the condition, *C* rather than *x*.
If *C* is true, *x* is evaluated and its value is returned; otherwise, *y* is
evaluated and its value is returned.

See [**PEP 308**](https://peps.python.org/pep-0308/) for more details about conditional expressions.

<a id="lambdas"></a>

<a id="lambda"></a>

## Lambdas

<a id="index-89"></a>

Lambda expressions (sometimes called lambda forms) are used to create anonymous
functions. The expression `lambda parameters: expression` yields a function
object.  The unnamed object behaves like a function object defined with:

```none
def <lambda>(parameters):
    return expression
```

See section [Function definitions](compound_stmts.md#function) for the syntax of parameter lists.  Note that
functions created with lambda expressions cannot contain statements or
annotations.

<a id="exprlists"></a>

## Expression lists

<a id="index-90"></a>

<a id="index-91"></a>

Except when part of a list or set display, an expression list
containing at least one comma yields a tuple.  The length of
the tuple is the number of expressions in the list.  The expressions are
evaluated from left to right.

<a id="index-92"></a>

An asterisk `*` denotes *iterable unpacking*.  Its operand must be
an [iterable](../glossary.md#term-iterable).  The iterable is expanded into a sequence of items,
which are included in the new tuple, list, or set, at the site of
the unpacking.

#### Versionadded
Added in version 3.5: Iterable unpacking in expression lists, originally proposed by [**PEP 448**](https://peps.python.org/pep-0448/).

#### Versionadded
Added in version 3.11: Any item in an expression list may be starred. See [**PEP 646**](https://peps.python.org/pep-0646/).

<a id="index-95"></a>

A trailing comma is required only to create a one-item tuple,
such as `1,`; it is optional in all other cases.
A single expression without a
trailing comma doesn’t create a tuple, but rather yields the value of that
expression. (To create an empty tuple, use an empty pair of parentheses:
`()`.)

<a id="evalorder"></a>

## Evaluation order

<a id="index-96"></a>

Python evaluates expressions from left to right.  Notice that while evaluating
an assignment, the right-hand side is evaluated before the left-hand side.

In the following lines, expressions will be evaluated in the arithmetic order of
their suffixes:

```python3
expr1, expr2, expr3, expr4
(expr1, expr2, expr3, expr4)
{expr1: expr2, expr3: expr4}
expr1 + expr2 * (expr3 - expr4)
expr1(expr2, expr3, *expr4, **expr5)
expr3, expr4 = expr1, expr2
```

<a id="operator-summary"></a>

## Operator precedence

<a id="index-97"></a>

The following table summarizes the operator precedence in Python, from highest
precedence (most binding) to lowest precedence (least binding).  Operators in
the same box have the same precedence.  Unless the syntax is explicitly given,
operators are binary.  Operators in the same box group left to right (except for
exponentiation and conditional expressions, which group from right to left).

Note that comparisons, membership tests, and identity tests, all have the same
precedence and have a left-to-right chaining feature as described in the
[Comparisons](#comparisons) section.

| Operator                                                                                                     | Description                                                                                              |
|--------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `(expressions...)`,<br/><br/>`[expressions...]`,<br/>`{key: value...}`,<br/>`{expressions...}`               | Binding or parenthesized<br/>expression,<br/>list display,<br/>dictionary display,<br/>set display       |
| `x[index]`, `x[index:index]`<br/>`x(arguments...)`, `x.attribute`                                            | Subscription (including slicing),<br/>call, attribute reference                                          |
| [`await x`](#await)                                                                                          | Await expression                                                                                         |
| `**`                                                                                                         | Exponentiation <sup>[5](#id22)</sup>                                                                     |
| `+x`, `-x`, `~x`                                                                                             | Positive, negative, bitwise NOT                                                                          |
| `*`, `@`, `/`, `//`, `%`                                                                                     | Multiplication, matrix<br/>multiplication, division, floor<br/>division, remainder <sup>[6](#id23)</sup> |
| `+`, `-`                                                                                                     | Addition and subtraction                                                                                 |
| `<<`, `>>`                                                                                                   | Shifts                                                                                                   |
| `&`                                                                                                          | Bitwise AND                                                                                              |
| `^`                                                                                                          | Bitwise XOR                                                                                              |
| `|`                                                                                                          | Bitwise OR                                                                                               |
| [`in`](#in), [`not in`](#not-in),<br/>[`is`](#is), [`is not`](#is-not), `<`,<br/>`<=`, `>`, `>=`, `!=`, `==` | Comparisons, including membership<br/>tests and identity tests                                           |
| [`not x`](#not)                                                                                              | Boolean NOT                                                                                              |
| [`and`](#and)                                                                                                | Boolean AND                                                                                              |
| [`or`](#or)                                                                                                  | Boolean OR                                                                                               |
| [`if`](#if-expr) – `else`                                                                                    | Conditional expression                                                                                   |
| [`lambda`](#lambda)                                                                                          | Lambda expression                                                                                        |
| `:=`                                                                                                         | Assignment expression                                                                                    |

### Footnotes

* <a id='id18'>**[1]**</a> While `abs(x%y) < abs(y)` is true mathematically, for floats it may not be true numerically due to roundoff.  For example, and assuming a platform on which a Python float is an IEEE 754 double-precision number, in order that `-1e-100 % 1e100` have the same sign as `1e100`, the computed result is `-1e-100 + 1e100`, which is numerically exactly equal to `1e100`.  The function [`math.fmod()`](../library/math.md#math.fmod) returns a result whose sign matches the sign of the first argument instead, and so returns `-1e-100` in this case. Which approach is more appropriate depends on the application.
* <a id='id19'>**[2]**</a> If x is very close to an exact integer multiple of y, it’s possible for `x//y` to be one larger than `(x-x%y)//y` due to rounding.  In such cases, Python returns the latter result, in order to preserve that `divmod(x,y)[0] * y + x % y` be very close to `x`.
* <a id='id20'>**[3]**</a> The Unicode standard distinguishes between *code points* (e.g. U+0041) and *abstract characters* (e.g. “LATIN CAPITAL LETTER A”). While most abstract characters in Unicode are only represented using one code point, there is a number of abstract characters that can in addition be represented using a sequence of more than one code point.  For example, the abstract character “LATIN CAPITAL LETTER C WITH CEDILLA” can be represented as a single *precomposed character* at code position U+00C7, or as a sequence of a *base character* at code position U+0043 (LATIN CAPITAL LETTER C), followed by a *combining character* at code position U+0327 (COMBINING CEDILLA).  The comparison operators on strings compare at the level of Unicode code points. This may be counter-intuitive to humans.  For example, `"\u00C7" == "\u0043\u0327"` is `False`, even though both strings represent the same abstract character “LATIN CAPITAL LETTER C WITH CEDILLA”.  To compare strings at the level of abstract characters (that is, in a way intuitive to humans), use [`unicodedata.normalize()`](../library/unicodedata.md#unicodedata.normalize).
* <a id='id21'>**[4]**</a> Due to automatic garbage-collection, free lists, and the dynamic nature of descriptors, you may notice seemingly unusual behaviour in certain uses of the [`is`](#is) operator, like those involving comparisons between instance methods, or constants.  Check their documentation for more info.
* <a id='id22'>**[5]**</a> The power operator `**` binds less tightly than an arithmetic or bitwise unary operator on its right, that is, `2**-1` is `0.5`.
* <a id='id23'>**[6]**</a> The `%` operator is also used for string formatting; the same precedence applies.
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
