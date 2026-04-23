<a id="compound"></a>

# Compound statements

<a id="index-0"></a>

Compound statements contain (groups of) other statements; they affect or control
the execution of those other statements in some way.  In general, compound
statements span multiple lines, although in simple incarnations a whole compound
statement may be contained in one line.

The [`if`](#if), [`while`](#while) and [`for`](#for) statements implement
traditional control flow constructs.  [`try`](#try) specifies exception
handlers and/or cleanup code for a group of statements, while the
[`with`](#with) statement allows the execution of initialization and
finalization code around a block of code.  Function and class definitions are
also syntactically compound statements.

<a id="index-1"></a>

A compound statement consists of one or more ‘clauses.’  A clause consists of a
header and a ‘suite.’  The clause headers of a particular compound statement are
all at the same indentation level. Each clause header begins with a uniquely
identifying keyword and ends with a colon.  A suite is a group of statements
controlled by a clause.  A suite can be one or more semicolon-separated simple
statements on the same line as the header, following the header’s colon, or it
can be one or more indented statements on subsequent lines.  Only the latter
form of a suite can contain nested compound statements; the following is illegal,
mostly because it wouldn’t be clear to which [`if`](#if) clause a following
[`else`](#else) clause would belong:

```python3
if test1: if test2: print(x)
```

Also note that the semicolon binds tighter than the colon in this context, so
that in the following example, either all or none of the [`print()`](../library/functions.md#print) calls are
executed:

```python3
if x < y < z: print(x); print(y); print(z)
```

Summarizing:

<a id="index-2"></a>

Note that statements always end in a `NEWLINE` possibly followed by a
`DEDENT`.  Also note that optional continuation clauses always begin with a
keyword that cannot start a statement, thus there are no ambiguities (the
‘dangling [`else`](#else)’ problem is solved in Python by requiring nested
[`if`](#if) statements to be indented).

The formatting of the grammar rules in the following sections places each clause
on a separate line for clarity.

<a id="if"></a>

<a id="elif"></a>

<a id="else"></a>

## The `if` statement

<a id="index-3"></a>

The [`if`](#if) statement is used for conditional execution:

It selects exactly one of the suites by evaluating the expressions one by one
until one is found to be true (see section [Boolean operations](expressions.md#booleans) for the definition of
true and false); then that suite is executed (and no other part of the
[`if`](#if) statement is executed or evaluated).  If all expressions are
false, the suite of the [`else`](#else) clause, if present, is executed.

<a id="while"></a>

## The `while` statement

<a id="index-4"></a>

The [`while`](#while) statement is used for repeated execution as long as an
expression is true:

This repeatedly tests the expression and, if it is true, executes the first
suite; if the expression is false (which may be the first time it is tested) the
suite of the `else` clause, if present, is executed and the loop
terminates.

<a id="index-5"></a>

A [`break`](simple_stmts.md#break) statement executed in the first suite terminates the loop
without executing the `else` clause’s suite.  A [`continue`](simple_stmts.md#continue)
statement executed in the first suite skips the rest of the suite and goes back
to testing the expression.

<a id="for"></a>

## The `for` statement

<a id="index-6"></a>

The [`for`](#for) statement is used to iterate over the elements of a sequence
(such as a string, tuple or list) or other iterable object:

The [`starred_expression_list`](expressions.md#grammar-token-python-grammar-starred_expression_list) expression is evaluated
once; it should yield an [iterable](../glossary.md#term-iterable) object. An [iterator](../glossary.md#term-iterator) is
created for that iterable. The first item provided by the iterator is then
assigned to the target list using the standard rules for assignments
(see [Assignment statements](simple_stmts.md#assignment)), and the suite is executed. This repeats for each
item provided by the iterator. When the iterator is exhausted,
the suite in the `else` clause,
if present, is executed, and the loop terminates.

<a id="index-7"></a>

A [`break`](simple_stmts.md#break) statement executed in the first suite terminates the loop
without executing the `else` clause’s suite.  A [`continue`](simple_stmts.md#continue)
statement executed in the first suite skips the rest of the suite and continues
with the next item, or with the `else` clause if there is no next
item.

The for-loop makes assignments to the variables in the target list.
This overwrites all previous assignments to those variables including
those made in the suite of the for-loop:

```python3
for i in range(10):
    print(i)
    i = 5             # this will not affect the for-loop
                      # because i will be overwritten with the next
                      # index in the range
```

<a id="index-8"></a>

Names in the target list are not deleted when the loop is finished, but if the
sequence is empty, they will not have been assigned to at all by the loop.  Hint:
the built-in type [`range()`](../library/stdtypes.md#range) represents immutable arithmetic sequences of integers.
For instance, iterating `range(3)` successively yields 0, 1, and then 2.

#### Versionchanged
Changed in version 3.11: Starred elements are now allowed in the expression list.

<a id="try"></a>

## The `try` statement

<a id="index-9"></a>

The `try` statement specifies exception handlers and/or cleanup code
for a group of statements:

Additional information on exceptions can be found in section [Exceptions](executionmodel.md#exceptions),
and information on using the [`raise`](simple_stmts.md#raise) statement to generate exceptions
may be found in section [The raise statement](simple_stmts.md#raise).

#### Versionchanged
Changed in version 3.14: Support for optionally dropping grouping parentheses when using multiple exception types. See [**PEP 758**](https://peps.python.org/pep-0758/).

<a id="except"></a>

### `except` clause

The `except` clause(s) specify one or more exception handlers. When no
exception occurs in the [`try`](#try) clause, no exception handler is executed.
When an exception occurs in the `try` suite, a search for an exception
handler is started. This search inspects the `except` clauses in turn
until one is found that matches the exception.
An expression-less `except` clause, if present, must be last;
it matches any exception.

For an `except` clause with an expression, the
expression must evaluate to an exception type or a tuple of exception types. Parentheses
can be dropped if multiple exception types are provided and the `as` clause is not used.
The raised exception matches an `except` clause whose expression evaluates
to the class or a [non-virtual base class](../glossary.md#term-abstract-base-class) of the exception object,
or to a tuple that contains such a class.

If no `except` clause matches the exception,
the search for an exception handler
continues in the surrounding code and on the invocation stack.  <sup>[1](#id22)</sup>

If the evaluation of an expression
in the header of an `except` clause raises an exception,
the original search for a handler is canceled and a search starts for
the new exception in the surrounding code and on the call stack (it is treated
as if the entire [`try`](#try) statement raised the exception).

<a id="index-11"></a>

When a matching `except` clause is found,
the exception is assigned to the target
specified after the `as` keyword in that `except` clause,
if present, and the `except` clause’s suite is executed.
All `except` clauses must have an executable block.
When the end of this block is reached, execution continues
normally after the entire [`try`](#try) statement.
(This means that if two nested handlers exist for the same exception,
and the exception occurs in the `try` clause of the inner handler,
the outer handler will not handle the exception.)

When an exception has been assigned using `as target`, it is cleared at the
end of the `except` clause.  This is as if

```python3
except E as N:
    foo
```

was translated to

```python3
except E as N:
    try:
        foo
    finally:
        del N
```

This means the exception must be assigned to a different name to be able to
refer to it after the `except` clause.
Exceptions are cleared because with the
traceback attached to them, they form a reference cycle with the stack frame,
keeping all locals in that frame alive until the next garbage collection occurs.

<a id="index-12"></a>

Before an `except` clause’s suite is executed,
the exception is stored in the [`sys`](../library/sys.md#module-sys) module, where it can be accessed
from within the body of the `except` clause by calling
[`sys.exception()`](../library/sys.md#sys.exception). When leaving an exception handler, the exception
stored in the [`sys`](../library/sys.md#module-sys) module is reset to its previous value:

```python3
>>> print(sys.exception())
None
>>> try:
...     raise TypeError
... except:
...     print(repr(sys.exception()))
...     try:
...          raise ValueError
...     except:
...         print(repr(sys.exception()))
...     print(repr(sys.exception()))
...
TypeError()
ValueError()
TypeError()
>>> print(sys.exception())
None
```

<a id="index-13"></a>

<a id="except-star"></a>

### `except*` clause

The `except*` clause(s) specify one or more handlers for groups of
exceptions ([`BaseExceptionGroup`](../library/exceptions.md#BaseExceptionGroup) instances). A [`try`](#try) statement
can have either [`except`](#except) or `except*` clauses, but not both.
The exception type for matching is mandatory in the case of `except*`,
so `except*:` is a syntax error. The type is interpreted as in the case of
`except`, but matching is performed on the exceptions contained in the
group that is being handled. An [`TypeError`](../library/exceptions.md#TypeError) is raised if a matching
type is a subclass of `BaseExceptionGroup`, because that would have
ambiguous semantics.

When an exception group is raised in the try block, each `except*`
clause splits (see [`split()`](../library/exceptions.md#BaseExceptionGroup.split)) it into the subgroups
of matching and non-matching exceptions. If the matching subgroup is not empty,
it becomes the handled exception (the value returned from [`sys.exception()`](../library/sys.md#sys.exception))
and assigned to the target of the `except*` clause (if there is one).
Then, the body of the `except*` clause executes. If the non-matching
subgroup is not empty, it is processed by the next `except*` in the
same manner. This continues until all exceptions in the group have been matched,
or the last `except*` clause has run.

After all `except*` clauses execute, the group of unhandled exceptions
is merged with any exceptions that were raised or re-raised from within
`except*` clauses. This merged exception group propagates on.:

```python3
>>> try:
...     raise ExceptionGroup("eg",
...         [ValueError(1), TypeError(2), OSError(3), OSError(4)])
... except* TypeError as e:
...     print(f'caught {type(e)} with nested {e.exceptions}')
... except* OSError as e:
...     print(f'caught {type(e)} with nested {e.exceptions}')
...
caught <class 'ExceptionGroup'> with nested (TypeError(2),)
caught <class 'ExceptionGroup'> with nested (OSError(3), OSError(4))
  + Exception Group Traceback (most recent call last):
  |   File "<doctest default[0]>", line 2, in <module>
  |     raise ExceptionGroup("eg",
  |         [ValueError(1), TypeError(2), OSError(3), OSError(4)])
  | ExceptionGroup: eg (1 sub-exception)
  +-+---------------- 1 ----------------
    | ValueError: 1
    +------------------------------------
```

If the exception raised from the [`try`](#try) block is not an exception group
and its type matches one of the `except*` clauses, it is caught and
wrapped by an exception group with an empty message string. This ensures that the
type of the target `e` is consistently [`BaseExceptionGroup`](../library/exceptions.md#BaseExceptionGroup):

```python3
>>> try:
...     raise BlockingIOError
... except* BlockingIOError as e:
...     print(repr(e))
...
ExceptionGroup('', (BlockingIOError(),))
```

[`break`](simple_stmts.md#break), [`continue`](simple_stmts.md#continue) and [`return`](simple_stmts.md#return)
cannot appear in an `except*` clause.

<a id="index-14"></a>

<a id="except-else"></a>

### `else` clause

The optional `else` clause is executed if the control flow leaves the
[`try`](#try) suite, no exception was raised, and no [`return`](simple_stmts.md#return),
[`continue`](simple_stmts.md#continue), or [`break`](simple_stmts.md#break) statement was executed.  Exceptions in
the `else` clause are not handled by the preceding [`except`](#except)
clauses.

<a id="index-15"></a>

<a id="finally"></a>

### `finally` clause

If `finally` is present, it specifies a ‘cleanup’ handler.  The
[`try`](#try) clause is executed, including any [`except`](#except)
and [`else`](#except-else) clauses.
If an exception occurs in any of the clauses and is not handled,
the exception is temporarily saved.
The `finally` clause is executed.  If there is a saved exception
it is re-raised at the end of the `finally` clause.
If the `finally` clause raises another exception, the saved exception
is set as the context of the new exception.
If the `finally` clause executes a [`return`](simple_stmts.md#return), [`break`](simple_stmts.md#break)
or [`continue`](simple_stmts.md#continue) statement, the saved exception is discarded. For example,
this function returns 42.

```python3
def f():
    try:
        1/0
    finally:
        return 42
```

The exception information is not available to the program during execution of
the `finally` clause.

<a id="index-16"></a>

When a [`return`](simple_stmts.md#return), [`break`](simple_stmts.md#break) or [`continue`](simple_stmts.md#continue) statement is
executed in the [`try`](#try) suite of a `try`…`finally`
statement, the `finally` clause is also executed ‘on the way out.’

The return value of a function is determined by the last [`return`](simple_stmts.md#return)
statement executed.  Since the `finally` clause always executes, a
`return` statement executed in the `finally` clause will
always be the last one executed. The following function returns ‘finally’.

```python3
def foo():
    try:
        return 'try'
    finally:
        return 'finally'
```

#### Versionchanged
Changed in version 3.8: Prior to Python 3.8, a [`continue`](simple_stmts.md#continue) statement was illegal in the
`finally` clause due to a problem with the implementation.

#### Versionchanged
Changed in version 3.14: The compiler emits a [`SyntaxWarning`](../library/exceptions.md#SyntaxWarning) when a [`return`](simple_stmts.md#return),
[`break`](simple_stmts.md#break) or [`continue`](simple_stmts.md#continue) appears in a `finally`
block (see [**PEP 765**](https://peps.python.org/pep-0765/)).

<a id="with"></a>

<a id="as"></a>

## The `with` statement

<a id="index-18"></a>

The [`with`](#with) statement is used to wrap the execution of a block with
methods defined by a context manager (see section [With Statement Context Managers](datamodel.md#context-managers)).
This allows common [`try`](#try)…[`except`](#except)…[`finally`](#finally)
usage patterns to be encapsulated for convenient reuse.

The execution of the [`with`](#with) statement with one “item” proceeds as follows:

1. The context expression (the expression given in the
   [`with_item`](#grammar-token-python-grammar-with_item)) is evaluated to obtain a context manager.
2. The context manager’s [`__enter__()`](datamodel.md#object.__enter__) is loaded for later use.
3. The context manager’s [`__exit__()`](datamodel.md#object.__exit__) is loaded for later use.
4. The context manager’s [`__enter__()`](datamodel.md#object.__enter__) method is invoked.
5. If a target was included in the [`with`](#with) statement, the return value
   from [`__enter__()`](datamodel.md#object.__enter__) is assigned to it.

   #### NOTE
   The [`with`](#with) statement guarantees that if the [`__enter__()`](datamodel.md#object.__enter__)
   method returns without an error, then [`__exit__()`](datamodel.md#object.__exit__) will always be
   called. Thus, if an error occurs during the assignment to the target list,
   it will be treated the same as an error occurring within the suite would
   be. See step 7 below.
6. The suite is executed.
7. The context manager’s [`__exit__()`](datamodel.md#object.__exit__) method is invoked.  If an exception
   caused the suite to be exited, its type, value, and traceback are passed as
   arguments to [`__exit__()`](datamodel.md#object.__exit__). Otherwise, three [`None`](../library/constants.md#None) arguments are
   supplied.

   If the suite was exited due to an exception, and the return value from the
   [`__exit__()`](datamodel.md#object.__exit__) method was false, the exception is reraised.  If the return
   value was true, the exception is suppressed, and execution continues with the
   statement following the [`with`](#with) statement.

   If the suite was exited for any reason other than an exception, the return
   value from [`__exit__()`](datamodel.md#object.__exit__) is ignored, and execution proceeds at the normal
   location for the kind of exit that was taken.

The following code:

```python3
with EXPRESSION as TARGET:
    SUITE
```

is semantically equivalent to:

```python3
manager = (EXPRESSION)
enter = manager.__enter__
exit = manager.__exit__
value = enter()
hit_except = False

try:
    TARGET = value
    SUITE
except:
    hit_except = True
    if not exit(*sys.exc_info()):
        raise
finally:
    if not hit_except:
        exit(None, None, None)
```

except that implicit [special method lookup](datamodel.md#special-lookup) is used
for [`__enter__()`](datamodel.md#object.__enter__) and [`__exit__()`](datamodel.md#object.__exit__).

With more than one item, the context managers are processed as if multiple
[`with`](#with) statements were nested:

```python3
with A() as a, B() as b:
    SUITE
```

is semantically equivalent to:

```python3
with A() as a:
    with B() as b:
        SUITE
```

You can also write multi-item context managers in multiple lines if
the items are surrounded by parentheses. For example:

```python3
with (
    A() as a,
    B() as b,
):
    SUITE
```

#### Versionchanged
Changed in version 3.1: Support for multiple context expressions.

#### Versionchanged
Changed in version 3.10: Support for using grouping parentheses to break the statement in multiple lines.

#### SEE ALSO
[**PEP 343**](https://peps.python.org/pep-0343/) - The “with” statement
: The specification, background, and examples for the Python [`with`](#with)
  statement.

<a id="match"></a>

<a id="case"></a>

## The `match` statement

<a id="index-20"></a>

#### Versionadded
Added in version 3.10.

The match statement is used for pattern matching.  Syntax:

#### NOTE
This section uses single quotes to denote
[soft keywords](lexical_analysis.md#soft-keywords).

Pattern matching takes a pattern as input (following `case`) and a subject
value (following `match`).  The pattern (which may contain subpatterns) is
matched against the subject value.  The outcomes are:

* A match success or failure (also termed a pattern success or failure).
* Possible binding of matched values to a name.  The prerequisites for this are
  further discussed below.

The `match` and `case` keywords are [soft keywords](lexical_analysis.md#soft-keywords).

#### SEE ALSO
* [**PEP 634**](https://peps.python.org/pep-0634/) – Structural Pattern Matching: Specification
* [**PEP 636**](https://peps.python.org/pep-0636/) – Structural Pattern Matching: Tutorial

### Overview

Here’s an overview of the logical flow of a match statement:

1. The subject expression `subject_expr` is evaluated and a resulting subject
   value obtained. If the subject expression contains a comma, a tuple is
   constructed using [the standard rules](../library/stdtypes.md#typesseq-tuple).
2. Each pattern in a `case_block` is attempted to match with the subject value. The
   specific rules for success or failure are described below. The match attempt can also
   bind some or all of the standalone names within the pattern. The precise
   pattern binding rules vary per pattern type and are
   specified below.  **Name bindings made during a successful pattern match
   outlive the executed block and can be used after the match statement**.

   #### NOTE
   During failed pattern matches, some subpatterns may succeed.  Do not
   rely on bindings being made for a failed match.  Conversely, do not
   rely on variables remaining unchanged after a failed match.  The exact
   behavior is dependent on implementation and may vary.  This is an
   intentional decision made to allow different implementations to add
   optimizations.
3. If the pattern succeeds, the corresponding guard (if present) is evaluated. In
   this case all name bindings are guaranteed to have happened.
   * If the guard evaluates as true or is missing, the `block` inside
     `case_block` is executed.
   * Otherwise, the next `case_block` is attempted as described above.
   * If there are no further case blocks, the match statement is completed.

#### NOTE
Users should generally never rely on a pattern being evaluated.  Depending on
implementation, the interpreter may cache values or use other optimizations
which skip repeated evaluations.

A sample match statement:

```python3
>>> flag = False
>>> match (100, 200):
...    case (100, 300):  # Mismatch: 200 != 300
...        print('Case 1')
...    case (100, 200) if flag:  # Successful match, but guard fails
...        print('Case 2')
...    case (100, y):  # Matches and binds y to 200
...        print(f'Case 3, y: {y}')
...    case _:  # Pattern not attempted
...        print('Case 4, I match anything!')
...
Case 3, y: 200
```

In this case, `if flag` is a guard.  Read more about that in the next section.

### Guards

<a id="index-23"></a>

A `guard` (which is part of the `case`) must succeed for code inside
the `case` block to execute.  It takes the form: [`if`](#if) followed by an
expression.

The logical flow of a `case` block with a `guard` follows:

1. Check that the pattern in the `case` block succeeded.  If the pattern
   failed, the `guard` is not evaluated and the next `case` block is
   checked.
2. If the pattern succeeded, evaluate the `guard`.
   * If the `guard` condition evaluates as true, the case block is
     selected.
   * If the `guard` condition evaluates as false, the case block is not
     selected.
   * If the `guard` raises an exception during evaluation, the exception
     bubbles up.

Guards are allowed to have side effects as they are expressions.  Guard
evaluation must proceed from the first to the last case block, one at a time,
skipping case blocks whose pattern(s) don’t all succeed. (I.e.,
guard evaluation must happen in order.) Guard evaluation must stop once a case
block is selected.

<a id="irrefutable-case"></a>

### Irrefutable Case Blocks

<a id="index-24"></a>

An irrefutable case block is a match-all case block.  A match statement may have
at most one irrefutable case block, and it must be last.

A case block is considered irrefutable if it has no guard and its pattern is
irrefutable.  A pattern is considered irrefutable if we can prove from its
syntax alone that it will always succeed.  Only the following patterns are
irrefutable:

* [AS Patterns](#as-patterns) whose left-hand side is irrefutable
* [OR Patterns](#or-patterns) containing at least one irrefutable pattern
* [Capture Patterns](#capture-patterns)
* [Wildcard Patterns](#wildcard-patterns)
* parenthesized irrefutable patterns

### Patterns

<a id="index-25"></a>

#### NOTE
This section uses grammar notations beyond standard EBNF:

* the notation `SEP.RULE+` is shorthand for `RULE (SEP RULE)*`
* the notation `!RULE` is shorthand for a negative lookahead assertion

The top-level syntax for `patterns` is:

The descriptions below will include a description “in simple terms” of what a pattern
does for illustration purposes (credits to Raymond Hettinger for a document that
inspired most of the descriptions). Note that these descriptions are purely for
illustration purposes and **may not** reflect
the underlying implementation.  Furthermore, they do not cover all valid forms.

<a id="or-patterns"></a>

#### OR Patterns

An OR pattern is two or more patterns separated by vertical
bars `|`.  Syntax:

Only the final subpattern may be [irrefutable](#irrefutable-case), and each
subpattern must bind the same set of names to avoid ambiguity.

An OR pattern matches each of its subpatterns in turn to the subject value,
until one succeeds.  The OR pattern is then considered successful.  Otherwise,
if none of the subpatterns succeed, the OR pattern fails.

In simple terms, `P1 | P2 | ...` will try to match `P1`, if it fails it will try to
match `P2`, succeeding immediately if any succeeds, failing otherwise.

<a id="as-patterns"></a>

#### AS Patterns

An AS pattern matches an OR pattern on the left of the [`as`](#as)
keyword against a subject.  Syntax:

If the OR pattern fails, the AS pattern fails.  Otherwise, the AS pattern binds
the subject to the name on the right of the as keyword and succeeds.
`capture_pattern` cannot be a `_`.

In simple terms `P as NAME` will match with `P`, and on success it will
set `NAME = <subject>`.

<a id="literal-patterns"></a>

#### Literal Patterns

A literal pattern corresponds to most
[literals](lexical_analysis.md#literals) in Python.  Syntax:

The rule `strings` and the token `NUMBER` are defined in the
[standard Python grammar](grammar.md).  Triple-quoted strings are
supported.  Raw strings and byte strings are supported.  [f-strings](lexical_analysis.md#f-strings)
and [t-strings](lexical_analysis.md#t-strings) are not supported.

The forms `signed_number '+' NUMBER` and `signed_number '-' NUMBER` are
for expressing [complex numbers](lexical_analysis.md#imaginary); they require a real number
on the left and an imaginary number on the right. E.g. `3 + 4j`.

In simple terms, `LITERAL` will succeed only if `<subject> == LITERAL`. For
the singletons `None`, `True` and `False`, the [`is`](expressions.md#is) operator is used.

<a id="capture-patterns"></a>

#### Capture Patterns

A capture pattern binds the subject value to a name.
Syntax:

A single underscore `_` is not a capture pattern (this is what `!'_'`
expresses). It is instead treated as a
[`wildcard_pattern`](#grammar-token-python-grammar-wildcard_pattern).

In a given pattern, a given name can only be bound once.  E.g.
`case x, x: ...` is invalid while `case [x] | x: ...` is allowed.

Capture patterns always succeed.  The binding follows scoping rules
established by the assignment expression operator in [**PEP 572**](https://peps.python.org/pep-0572/); the
name becomes a local variable in the closest containing function scope unless
there’s an applicable [`global`](simple_stmts.md#global) or [`nonlocal`](simple_stmts.md#nonlocal) statement.

In simple terms `NAME` will always succeed and it will set `NAME = <subject>`.

<a id="wildcard-patterns"></a>

#### Wildcard Patterns

A wildcard pattern always succeeds (matches anything)
and binds no name.  Syntax:

`_` is a [soft keyword](lexical_analysis.md#soft-keywords) within any pattern,
but only within patterns.  It is an identifier, as usual, even within
`match` subject expressions, `guard`s, and `case` blocks.

In simple terms, `_` will always succeed.

<a id="value-patterns"></a>

#### Value Patterns

A value pattern represents a named value in Python.
Syntax:

The dotted name in the pattern is looked up using standard Python
[name resolution rules](executionmodel.md#resolve-names).  The pattern succeeds if the
value found compares equal to the subject value (using the `==` equality
operator).

In simple terms `NAME1.NAME2` will succeed only if `<subject> == NAME1.NAME2`

#### NOTE
If the same value occurs multiple times in the same match statement, the
interpreter may cache the first value found and reuse it rather than repeat
the same lookup.  This cache is strictly tied to a given execution of a
given match statement.

<a id="group-patterns"></a>

#### Group Patterns

A group pattern allows users to add parentheses around patterns to
emphasize the intended grouping.  Otherwise, it has no additional syntax.
Syntax:

In simple terms `(P)` has the same effect as `P`.

<a id="sequence-patterns"></a>

#### Sequence Patterns

A sequence pattern contains several subpatterns to be matched against sequence elements.
The syntax is similar to the unpacking of a list or tuple.

There is no difference if parentheses  or square brackets
are used for sequence patterns (i.e. `(...)` vs `[...]` ).

#### NOTE
A single pattern enclosed in parentheses without a trailing comma
(e.g. `(3 | 4)`) is a [group pattern](#group-patterns).
While a single pattern enclosed in square brackets (e.g. `[3 | 4]`) is
still a sequence pattern.

At most one star subpattern may be in a sequence pattern.  The star subpattern
may occur in any position. If no star subpattern is present, the sequence
pattern is a fixed-length sequence pattern; otherwise it is a variable-length
sequence pattern.

The following is the logical flow for matching a sequence pattern against a
subject value:

1. If the subject value is not a sequence <sup>[2](#id23)</sup>, the sequence pattern
   fails.
2. If the subject value is an instance of `str`, `bytes` or `bytearray`
   the sequence pattern fails.
3. The subsequent steps depend on whether the sequence pattern is fixed or
   variable-length.

   If the sequence pattern is fixed-length:
   1. If the length of the subject sequence is not equal to the number of
      subpatterns, the sequence pattern fails
   2. Subpatterns in the sequence pattern are matched to their corresponding
      items in the subject sequence from left to right.  Matching stops as soon
      as a subpattern fails.  If all subpatterns succeed in matching their
      corresponding item, the sequence pattern succeeds.

   Otherwise, if the sequence pattern is variable-length:
   1. If the length of the subject sequence is less than the number of non-star
      subpatterns, the sequence pattern fails.
   2. The leading non-star subpatterns are matched to their corresponding items
      as for fixed-length sequences.
   3. If the previous step succeeds, the star subpattern matches a list formed
      of the remaining subject items, excluding the remaining items
      corresponding to non-star subpatterns following the star subpattern.
   4. Remaining non-star subpatterns are matched to their corresponding subject
      items, as for a fixed-length sequence.

   #### NOTE
   The length of the subject sequence is obtained via
   [`len()`](../library/functions.md#len) (i.e. via the [`__len__()`](datamodel.md#object.__len__) protocol).
   This length may be cached by the interpreter in a similar manner as
   [value patterns](#value-patterns).

In simple terms `[P1, P2, P3,` … `, P<N>]` matches only if all the following
happens:

* check `<subject>` is a sequence
* `len(subject) == <N>`
* `P1` matches `<subject>[0]` (note that this match can also bind names)
* `P2` matches `<subject>[1]` (note that this match can also bind names)
* … and so on for the corresponding pattern/element.

<a id="mapping-patterns"></a>

#### Mapping Patterns

A mapping pattern contains one or more key-value patterns.  The syntax is
similar to the construction of a dictionary.
Syntax:

At most one double star pattern may be in a mapping pattern.  The double star
pattern must be the last subpattern in the mapping pattern.

Duplicate keys in mapping patterns are disallowed. Duplicate literal keys will
raise a [`SyntaxError`](../library/exceptions.md#SyntaxError). Two keys that otherwise have the same value will
raise a [`ValueError`](../library/exceptions.md#ValueError) at runtime.

The following is the logical flow for matching a mapping pattern against a
subject value:

1. If the subject value is not a mapping <sup>[3](#id24)</sup>,the mapping pattern fails.
2. If every key given in the mapping pattern is present in the subject mapping,
   and the pattern for each key matches the corresponding item of the subject
   mapping, the mapping pattern succeeds.
3. If duplicate keys are detected in the mapping pattern, the pattern is
   considered invalid. A [`SyntaxError`](../library/exceptions.md#SyntaxError) is raised for duplicate literal
   values; or a [`ValueError`](../library/exceptions.md#ValueError) for named keys of the same value.

#### NOTE
Key-value pairs are matched using the two-argument form of the mapping
subject’s `get()` method.  Matched key-value pairs must already be present
in the mapping, and not created on-the-fly via [`__missing__()`](datamodel.md#object.__missing__)
or [`__getitem__()`](datamodel.md#object.__getitem__).

In simple terms `{KEY1: P1, KEY2: P2, ... }` matches only if all the following
happens:

* check `<subject>` is a mapping
* `KEY1 in <subject>`
* `P1` matches `<subject>[KEY1]`
* … and so on for the corresponding KEY/pattern pair.

<a id="class-patterns"></a>

#### Class Patterns

A class pattern represents a class and its positional and keyword arguments
(if any).  Syntax:

The same keyword should not be repeated in class patterns.

The following is the logical flow for matching a class pattern against a
subject value:

1. If `name_or_attr` is not an instance of the builtin [`type`](../library/functions.md#type) , raise
   [`TypeError`](../library/exceptions.md#TypeError).
2. If the subject value is not an instance of `name_or_attr` (tested via
   [`isinstance()`](../library/functions.md#isinstance)), the class pattern fails.
3. If no pattern arguments are present, the pattern succeeds.  Otherwise,
   the subsequent steps depend on whether keyword or positional argument patterns
   are present.

   For a number of built-in types (specified below), a single positional
   subpattern is accepted which will match the entire subject; for these types
   keyword patterns also work as for other types.

   If only keyword patterns are present, they are processed as follows,
   one by one:
   1. The keyword is looked up as an attribute on the subject.
      * If this raises an exception other than [`AttributeError`](../library/exceptions.md#AttributeError), the
        exception bubbles up.
      * If this raises [`AttributeError`](../library/exceptions.md#AttributeError), the class pattern has failed.
      * Else, the subpattern associated with the keyword pattern is matched
        against the subject’s attribute value.  If this fails, the class
        pattern fails; if this succeeds, the match proceeds to the next keyword.
   2. If all keyword patterns succeed, the class pattern succeeds.

   If any positional patterns are present, they are converted to keyword
   patterns using the [`__match_args__`](datamodel.md#object.__match_args__) attribute on the class
   `name_or_attr` before matching:
   1. The equivalent of `getattr(cls, "__match_args__", ())` is called.
      * If this raises an exception, the exception bubbles up.
      * If the returned value is not a tuple, the conversion fails and
        [`TypeError`](../library/exceptions.md#TypeError) is raised.
      * If there are more positional patterns than `len(cls.__match_args__)`,
        [`TypeError`](../library/exceptions.md#TypeError) is raised.
      * Otherwise, positional pattern `i` is converted to a keyword pattern
        using `__match_args__[i]` as the keyword.  `__match_args__[i]` must
        be a string; if not [`TypeError`](../library/exceptions.md#TypeError) is raised.
      * If there are duplicate keywords, [`TypeError`](../library/exceptions.md#TypeError) is raised.

      #### SEE ALSO
      [Customizing positional arguments in class pattern matching](datamodel.md#class-pattern-matching)
   2. Once all positional patterns have been converted to keyword patterns,
      the match proceeds as if there were only keyword patterns.

   For the following built-in types the handling of positional subpatterns is
   different:
   * [`bool`](../library/functions.md#bool)
   * [`bytearray`](../library/stdtypes.md#bytearray)
   * [`bytes`](../library/stdtypes.md#bytes)
   * [`dict`](../library/stdtypes.md#dict)
   * [`float`](../library/functions.md#float)
   * [`frozenset`](../library/stdtypes.md#frozenset)
   * [`int`](../library/functions.md#int)
   * [`list`](../library/stdtypes.md#list)
   * [`set`](../library/stdtypes.md#set)
   * [`str`](../library/stdtypes.md#str)
   * [`tuple`](../library/stdtypes.md#tuple)

   These classes accept a single positional argument, and the pattern there is matched
   against the whole object rather than an attribute. For example `int(0|1)` matches
   the value `0`, but not the value `0.0`.

In simple terms `CLS(P1, attr=P2)` matches only if the following happens:

* `isinstance(<subject>, CLS)`
* convert `P1` to a keyword pattern using `CLS.__match_args__`
* For each keyword argument `attr=P2`:
  * `hasattr(<subject>, "attr")`
  * `P2` matches `<subject>.attr`
* … and so on for the corresponding keyword argument/pattern pair.

#### SEE ALSO
* [**PEP 634**](https://peps.python.org/pep-0634/) – Structural Pattern Matching: Specification
* [**PEP 636**](https://peps.python.org/pep-0636/) – Structural Pattern Matching: Tutorial

<a id="index-29"></a>

<a id="function"></a>

<a id="def"></a>

## Function definitions

<a id="index-30"></a>

A function definition defines a user-defined function object (see section
[The standard type hierarchy](datamodel.md#types)):

A function definition is an executable statement.  Its execution binds the
function name in the current local namespace to a function object (a wrapper
around the executable code for the function).  This function object contains a
reference to the current global namespace as the global namespace to be used
when the function is called.

The function definition does not execute the function body; this gets executed
only when the function is called. <sup>[4](#id25)</sup>

<a id="index-31"></a>

A function definition may be wrapped by one or more [decorator](../glossary.md#term-decorator) expressions.
Decorator expressions are evaluated when the function is defined, in the scope
that contains the function definition.  The result must be a callable, which is
invoked with the function object as the only argument. The returned value is
bound to the function name instead of the function object.  Multiple decorators
are applied in nested fashion. For example, the following code

```python3
@f1(arg)
@f2
def func(): pass
```

is roughly equivalent to

```python3
def func(): pass
func = f1(arg)(f2(func))
```

except that the original function is not temporarily bound to the name `func`.

#### Versionchanged
Changed in version 3.9: Functions may be decorated with any valid
[`assignment_expression`](expressions.md#grammar-token-python-grammar-assignment_expression). Previously, the grammar was
much more restrictive; see [**PEP 614**](https://peps.python.org/pep-0614/) for details.

A list of [type parameters](#type-params) may be given in square brackets
between the function’s name and the opening parenthesis for its parameter list.
This indicates to static type checkers that the function is generic. At runtime,
the type parameters can be retrieved from the function’s
[`__type_params__`](datamodel.md#function.__type_params__)
attribute. See [Generic functions](#generic-functions) for more.

#### Versionchanged
Changed in version 3.12: Type parameter lists are new in Python 3.12.

<a id="index-33"></a>

When one or more [parameters](../glossary.md#term-parameter) have the form *parameter* `=`
*expression*, the function is said to have “default parameter values.”  For a
parameter with a default value, the corresponding [argument](../glossary.md#term-argument) may be
omitted from a call, in which
case the parameter’s default value is substituted.  If a parameter has a default
value, all following parameters up until the “`*`” must also have a default
value — this is a syntactic restriction that is not expressed by the grammar.

**Default parameter values are evaluated from left to right when the function
definition is executed.** This means that the expression is evaluated once, when
the function is defined, and that the same “pre-computed” value is used for each
call.  This is especially important to understand when a default parameter value is a
mutable object, such as a list or a dictionary: if the function modifies the
object (e.g. by appending an item to a list), the default parameter value is in effect
modified.  This is generally not what was intended.  A way around this is to use
`None` as the default, and explicitly test for it in the body of the function,
e.g.:

```python3
def whats_on_the_telly(penguin=None):
    if penguin is None:
        penguin = []
    penguin.append("property of the zoo")
    return penguin
```

<a id="index-34"></a>

Function call semantics are described in more detail in section [Calls](expressions.md#calls). A
function call always assigns values to all parameters mentioned in the parameter
list, either from positional arguments, from keyword arguments, or from default
values.  If the form “`*identifier`” is present, it is initialized to a tuple
receiving any excess positional parameters, defaulting to the empty tuple.
If the form “`**identifier`” is present, it is initialized to a new
ordered mapping receiving any excess keyword arguments, defaulting to a
new empty mapping of the same type.  Parameters after “`*`” or
“`*identifier`” are keyword-only parameters and may only be passed
by keyword arguments.  Parameters before “`/`” are positional-only parameters
and may only be passed by positional arguments.

#### Versionchanged
Changed in version 3.8: The `/` function parameter syntax may be used to indicate positional-only
parameters. See [**PEP 570**](https://peps.python.org/pep-0570/) for details.

<a id="index-36"></a>

Parameters may have an [annotation](../glossary.md#term-function-annotation) of the form “`: expression`”
following the parameter name.  Any parameter may have an annotation, even those of the form
`*identifier` or `**identifier`. (As a special case, parameters of the form
`*identifier` may have an annotation “`: *expression`”.) Functions may have “return” annotation of
the form “`-> expression`” after the parameter list.  These annotations can be
any valid Python expression.  The presence of annotations does not change the
semantics of a function. See [Annotations](#annotations) for more information on annotations.

#### Versionchanged
Changed in version 3.11: Parameters of the form “`*identifier`” may have an annotation
“`: *expression`”. See [**PEP 646**](https://peps.python.org/pep-0646/).

<a id="index-38"></a>

It is also possible to create anonymous functions (functions not bound to a
name), for immediate use in expressions.  This uses lambda expressions, described in
section [Lambdas](expressions.md#lambda).  Note that the lambda expression is merely a shorthand for a
simplified function definition; a function defined in a “[`def`](#def)”
statement can be passed around or assigned to another name just like a function
defined by a lambda expression.  The “`def`” form is actually more powerful
since it allows the execution of multiple statements and annotations.

**Programmer’s note:** Functions are first-class objects.  A “`def`” statement
executed inside a function definition defines a local function that can be
returned or passed around.  Free variables used in the nested function can
access the local variables of the function containing the def.  See section
[Naming and binding](executionmodel.md#naming) for details.

#### SEE ALSO
[**PEP 3107**](https://peps.python.org/pep-3107/) - Function Annotations
: The original specification for function annotations.

[**PEP 484**](https://peps.python.org/pep-0484/) - Type Hints
: Definition of a standard meaning for annotations: type hints.

[**PEP 526**](https://peps.python.org/pep-0526/) - Syntax for Variable Annotations
: Ability to type hint variable declarations, including class
  variables and instance variables.

[**PEP 563**](https://peps.python.org/pep-0563/) - Postponed Evaluation of Annotations
: Support for forward references within annotations by preserving
  annotations in a string form at runtime instead of eager evaluation.

[**PEP 318**](https://peps.python.org/pep-0318/) - Decorators for Functions and Methods
: Function and method decorators were introduced.
  Class decorators were introduced in [**PEP 3129**](https://peps.python.org/pep-3129/).

<a id="class"></a>

## Class definitions

<a id="index-45"></a>

A class definition defines a class object (see section [The standard type hierarchy](datamodel.md#types)):

A class definition is an executable statement.  The inheritance list usually
gives a list of base classes (see [Metaclasses](datamodel.md#metaclasses) for more advanced uses), so
each item in the list should evaluate to a class object which allows
subclassing.  Classes without an inheritance list inherit, by default, from the
base class [`object`](../library/functions.md#object); hence,

```python3
class Foo:
    pass
```

is equivalent to

```python3
class Foo(object):
    pass
```

There may be one or more base classes; see [Multiple inheritance](#multiple-inheritance) below for more
information.

The class’s suite is then executed in a new execution frame (see [Naming and binding](executionmodel.md#naming)),
using a newly created local namespace and the original global namespace.
(Usually, the suite contains mostly function definitions.)  When the class’s
suite finishes execution, its execution frame is discarded but its local
namespace is saved. <sup>[5](#id26)</sup> A class object is then created using the inheritance
list for the base classes and the saved local namespace for the attribute
dictionary.  The class name is bound to this class object in the original local
namespace.

The order in which attributes are defined in the class body is preserved
in the new class’s [`__dict__`](datamodel.md#type.__dict__).  Note that this is reliable only right
after the class is created and only for classes that were defined using
the definition syntax.

Class creation can be customized heavily using [metaclasses](datamodel.md#metaclasses).

<a id="index-46"></a>

Classes can also be decorated: just like when decorating functions,

```python3
@f1(arg)
@f2
class Foo: pass
```

is roughly equivalent to

```python3
class Foo: pass
Foo = f1(arg)(f2(Foo))
```

The evaluation rules for the decorator expressions are the same as for function
decorators.  The result is then bound to the class name.

#### Versionchanged
Changed in version 3.9: Classes may be decorated with any valid
[`assignment_expression`](expressions.md#grammar-token-python-grammar-assignment_expression). Previously, the grammar was
much more restrictive; see [**PEP 614**](https://peps.python.org/pep-0614/) for details.

A list of [type parameters](#type-params) may be given in square brackets
immediately after the class’s name.
This indicates to static type checkers that the class is generic. At runtime,
the type parameters can be retrieved from the class’s
[`__type_params__`](datamodel.md#type.__type_params__) attribute. See [Generic classes](#generic-classes) for more.

#### Versionchanged
Changed in version 3.12: Type parameter lists are new in Python 3.12.

**Programmer’s note:** Variables defined in the class definition are class
attributes; they are shared by instances.  Instance attributes can be set in a
method with `self.name = value`.  Both class and instance attributes are
accessible through the notation “`self.name`”, and an instance attribute hides
a class attribute with the same name when accessed in this way.  Class
attributes can be used as defaults for instance attributes, but using mutable
values there can lead to unexpected results.  [Descriptors](datamodel.md#descriptors)
can be used to create instance variables with different implementation details.

#### SEE ALSO
[**PEP 3115**](https://peps.python.org/pep-3115/) - Metaclasses in Python 3000
: The proposal that changed the declaration of metaclasses to the current
  syntax, and the semantics for how classes with metaclasses are
  constructed.

[**PEP 3129**](https://peps.python.org/pep-3129/) - Class Decorators
: The proposal that added class decorators.  Function and method decorators
  were introduced in [**PEP 318**](https://peps.python.org/pep-0318/).

<a id="multiple-inheritance"></a>

### Multiple inheritance

Python classes may have multiple base classes, a technique known as
*multiple inheritance*.  The base classes are specified in the class definition
by listing them in parentheses after the class name, separated by commas.
For example, the following class definition:

```pycon
>>> class A: pass
>>> class B: pass
>>> class C(A, B): pass
```

defines a class `C` that inherits from classes `A` and `B`.

The [method resolution order](../glossary.md#term-method-resolution-order) (MRO) is the order in which base classes are
searched when looking up an attribute on a class. See [The Python 2.3 Method Resolution Order](../howto/mro.md#python-2-3-mro) for a
description of how Python determines the MRO for a class.

Multiple inheritance is not always allowed. Attempting to define a class with multiple
inheritance will raise an error if one of the bases does not allow subclassing, if a consistent MRO
cannot be created, if no valid metaclass can be determined, or if there is an instance
layout conflict. We’ll discuss each of these in turn.

First, all base classes must allow subclassing. While most classes allow subclassing,
some built-in classes do not, such as [`bool`](../library/functions.md#bool):

```pycon
>>> class SubBool(bool):  # TypeError
...    pass
Traceback (most recent call last):
   ...
TypeError: type 'bool' is not an acceptable base type
```

In the resolved MRO of a class, the class’s bases appear in the order they were
specified in the class’s bases list. Additionally, the MRO always lists a child
class before any of its bases. A class definition will fail if it is impossible to
resolve a consistent MRO that satisfies these rules from the list of bases provided:

```pycon
>>> class Base: pass
>>> class Child(Base): pass
>>> class Grandchild(Base, Child): pass  # TypeError
Traceback (most recent call last):
   ...
TypeError: Cannot create a consistent method resolution order (MRO) for bases Base, Child
```

In the MRO of `Grandchild`, `Base` must appear before `Child` because it is first
in the base class list, but it must also appear after `Child` because it is a parent of
`Child`. This is a contradiction, so the class cannot be defined.

If some of the bases have a custom [metaclass](../glossary.md#term-metaclass), the metaclass of the resulting class
is chosen among the metaclasses of the bases and the explicitly specified metaclass of the
child class. It must be a metaclass that is a subclass of
all other candidate metaclasses. If no such metaclass exists among the candidates,
the class cannot be created, as explained in [Determining the appropriate metaclass](datamodel.md#metaclass-determination).

Finally, the instance layouts of the bases must be compatible. This means that it must be
possible to compute a *solid base* for the class. Exactly which classes are solid bases
depends on the Python implementation.

**CPython implementation detail:** In CPython, a class is a solid base if it has a
nonempty [`__slots__`](datamodel.md#object.__slots__) definition.
Many but not all classes defined in C are also solid bases, including most
builtins (such as [`int`](../library/functions.md#int) or [`BaseException`](../library/exceptions.md#BaseException))
but excluding most concrete [`Exception`](../library/exceptions.md#Exception) classes. Generally, a C class
is a solid base if its underlying struct is different in size from its base class.

Every class has a solid base. [`object`](../library/functions.md#object), the base class, has itself as its solid base.
If there is a single base, the child class’s solid base is that class if it is a solid base,
or else the base class’s solid base. If there are multiple bases, we first find the solid base
for each base class to produce a list of candidate solid bases. If there is a unique solid base
that is a subclass of all others, then that class is the solid base. Otherwise, class creation
fails.

Example:

```pycon
>>> class Solid1:
...    __slots__ = ("solid1",)
>>>
>>> class Solid2:
...    __slots__ = ("solid2",)
>>>
>>> class SolidChild(Solid1):
...    __slots__ = ("solid_child",)
>>>
>>> class C1:  # solid base is `object`
...    pass
>>>
>>> # OK: solid bases are `Solid1` and `object`, and `Solid1` is a subclass of `object`.
>>> class C2(Solid1, C1):  # solid base is `Solid1`
...    pass
>>>
>>> # OK: solid bases are `SolidChild` and `Solid1`, and `SolidChild` is a subclass of `Solid1`.
>>> class C3(SolidChild, Solid1):  # solid base is `SolidChild`
...    pass
>>>
>>> # Error: solid bases are `Solid1` and `Solid2`, but neither is a subclass of the other.
>>> class C4(Solid1, Solid2):  # error: no single solid base
...    pass
Traceback (most recent call last):
  ...
TypeError: multiple bases have instance lay-out conflict
```

<a id="async"></a>

## Coroutines

#### Versionadded
Added in version 3.5.

<a id="index-51"></a>

<a id="async-def"></a>

### Coroutine function definition

<a id="index-52"></a>

Execution of Python coroutines can be suspended and resumed at many points
(see [coroutine](../glossary.md#term-coroutine)). [`await`](expressions.md#await) expressions, [`async for`](#async-for) and
[`async with`](#async-with) can only be used in the body of a coroutine function.

Functions defined with `async def` syntax are always coroutine functions,
even if they do not contain `await` or `async` keywords.

It is a [`SyntaxError`](../library/exceptions.md#SyntaxError) to use a `yield from` expression inside the body
of a coroutine function.

An example of a coroutine function:

```python3
async def func(param1, param2):
    do_stuff()
    await some_coroutine()
```

#### Versionchanged
Changed in version 3.7: `await` and `async` are now keywords; previously they were only
treated as such inside the body of a coroutine function.

<a id="index-53"></a>

<a id="async-for"></a>

### The `async for` statement

An [asynchronous iterable](../glossary.md#term-asynchronous-iterable) provides an `__aiter__` method that directly
returns an [asynchronous iterator](../glossary.md#term-asynchronous-iterator), which can call asynchronous code in
its `__anext__` method.

The `async for` statement allows convenient iteration over asynchronous
iterables.

The following code:

```python3
async for TARGET in ITER:
    SUITE
else:
    SUITE2
```

Is semantically equivalent to:

```python3
iter = (ITER).__aiter__()
running = True

while running:
    try:
        TARGET = await iter.__anext__()
    except StopAsyncIteration:
        running = False
    else:
        SUITE
else:
    SUITE2
```

except that implicit [special method lookup](datamodel.md#special-lookup) is used
for [`__aiter__()`](datamodel.md#object.__aiter__) and [`__anext__()`](datamodel.md#object.__anext__).

It is a [`SyntaxError`](../library/exceptions.md#SyntaxError) to use an `async for` statement outside the
body of a coroutine function.

<a id="index-54"></a>

<a id="async-with"></a>

### The `async with` statement

An [asynchronous context manager](../glossary.md#term-asynchronous-context-manager) is a [context manager](../glossary.md#term-context-manager) that is
able to suspend execution in its *enter* and *exit* methods.

The following code:

```python3
async with EXPRESSION as TARGET:
    SUITE
```

is semantically equivalent to:

```python3
manager = (EXPRESSION)
aenter = manager.__aenter__
aexit = manager.__aexit__
value = await aenter()
hit_except = False

try:
    TARGET = value
    SUITE
except:
    hit_except = True
    if not await aexit(*sys.exc_info()):
        raise
finally:
    if not hit_except:
        await aexit(None, None, None)
```

except that implicit [special method lookup](datamodel.md#special-lookup) is used
for [`__aenter__()`](datamodel.md#object.__aenter__) and [`__aexit__()`](datamodel.md#object.__aexit__).

It is a [`SyntaxError`](../library/exceptions.md#SyntaxError) to use an `async with` statement outside the
body of a coroutine function.

#### SEE ALSO
[**PEP 492**](https://peps.python.org/pep-0492/) - Coroutines with async and await syntax
: The proposal that made coroutines a proper standalone concept in Python,
  and added supporting syntax.

<a id="type-params"></a>

## Type parameter lists

#### Versionadded
Added in version 3.12.

#### Versionchanged
Changed in version 3.13: Support for default values was added (see [**PEP 696**](https://peps.python.org/pep-0696/)).

<a id="index-57"></a>

[Functions](#def) (including [coroutines](#async-def)),
[classes](#class) and [type aliases](simple_stmts.md#type) may
contain a type parameter list:

```python3
def max[T](args: list[T]) -> T:
    ...

async def amax[T](args: list[T]) -> T:
    ...

class Bag[T]:
    def __iter__(self) -> Iterator[T]:
        ...

    def add(self, arg: T) -> None:
        ...

type ListOrSet[T] = list[T] | set[T]
```

Semantically, this indicates that the function, class, or type alias is
generic over a type variable. This information is primarily used by static
type checkers, and at runtime, generic objects behave much like their
non-generic counterparts.

Type parameters are declared in square brackets (`[]`) immediately
after the name of the function, class, or type alias. The type parameters
are accessible within the scope of the generic object, but not elsewhere.
Thus, after a declaration `def func[T](): pass`, the name `T` is not available in
the module scope. Below, the semantics of generic objects are described
with more precision. The scope of type parameters is modeled with a special
function (technically, an [annotation scope](executionmodel.md#annotation-scopes)) that
wraps the creation of the generic object.

Generic functions, classes, and type aliases have a
[`__type_params__`](../library/stdtypes.md#definition.__type_params__) attribute listing their type parameters.

Type parameters come in three kinds:

* [`typing.TypeVar`](../library/typing.md#typing.TypeVar), introduced by a plain name (e.g., `T`). Semantically, this
  represents a single type to a type checker.
* [`typing.TypeVarTuple`](../library/typing.md#typing.TypeVarTuple), introduced by a name prefixed with a single
  asterisk (e.g., `*Ts`). Semantically, this stands for a tuple of any
  number of types.
* [`typing.ParamSpec`](../library/typing.md#typing.ParamSpec), introduced by a name prefixed with two asterisks
  (e.g., `**P`). Semantically, this stands for the parameters of a callable.

[`typing.TypeVar`](../library/typing.md#typing.TypeVar) declarations can define *bounds* and *constraints* with
a colon (`:`) followed by an expression. A single expression after the colon
indicates a bound (e.g. `T: int`). Semantically, this means
that the `typing.TypeVar` can only represent types that are a subtype of
this bound. A parenthesized tuple of expressions after the colon indicates a
set of constraints (e.g. `T: (str, bytes)`). Each member of the tuple should be a
type (again, this is not enforced at runtime). Constrained type variables can only
take on one of the types in the list of constraints.

For `typing.TypeVar`s declared using the type parameter list syntax,
the bound and constraints are not evaluated when the generic object is created,
but only when the value is explicitly accessed through the attributes `__bound__`
and `__constraints__`. To accomplish this, the bounds or constraints are
evaluated in a separate [annotation scope](executionmodel.md#annotation-scopes).

[`typing.TypeVarTuple`](../library/typing.md#typing.TypeVarTuple)s and [`typing.ParamSpec`](../library/typing.md#typing.ParamSpec)s cannot have bounds
or constraints.

All three flavors of type parameters can also have a *default value*, which is used
when the type parameter is not explicitly provided. This is added by appending
a single equals sign (`=`) followed by an expression. Like the bounds and
constraints of type variables, the default value is not evaluated when the
object is created, but only when the type parameter’s `__default__` attribute
is accessed. To this end, the default value is evaluated in a separate
[annotation scope](executionmodel.md#annotation-scopes). If no default value is specified
for a type parameter, the `__default__` attribute is set to the special
sentinel object [`typing.NoDefault`](../library/typing.md#typing.NoDefault).

The following example indicates the full set of allowed type parameter declarations:

```python3
def overly_generic[
   SimpleTypeVar,
   TypeVarWithDefault = int,
   TypeVarWithBound: int,
   TypeVarWithConstraints: (str, bytes),
   *SimpleTypeVarTuple = (int, float),
   **SimpleParamSpec = (str, bytearray),
](
   a: SimpleTypeVar,
   b: TypeVarWithDefault,
   c: TypeVarWithBound,
   d: Callable[SimpleParamSpec, TypeVarWithConstraints],
   *e: SimpleTypeVarTuple,
): ...
```

<a id="generic-functions"></a>

### Generic functions

Generic functions are declared as follows:

```python3
def func[T](arg: T): ...
```

This syntax is equivalent to:

```python3
annotation-def TYPE_PARAMS_OF_func():
    T = typing.TypeVar("T")
    def func(arg: T): ...
    func.__type_params__ = (T,)
    return func
func = TYPE_PARAMS_OF_func()
```

Here `annotation-def` indicates an [annotation scope](executionmodel.md#annotation-scopes),
which is not actually bound to any name at runtime. (One
other liberty is taken in the translation: the syntax does not go through
attribute access on the [`typing`](../library/typing.md#module-typing) module, but creates an instance of
[`typing.TypeVar`](../library/typing.md#typing.TypeVar) directly.)

The annotations of generic functions are evaluated within the annotation scope
used for declaring the type parameters, but the function’s defaults and
decorators are not.

The following example illustrates the scoping rules for these cases,
as well as for additional flavors of type parameters:

```python3
@decorator
def func[T: int, *Ts, **P](*args: *Ts, arg: Callable[P, T] = some_default):
    ...
```

Except for the [lazy evaluation](executionmodel.md#lazy-evaluation) of the
[`TypeVar`](../library/typing.md#typing.TypeVar) bound, this is equivalent to:

```python3
DEFAULT_OF_arg = some_default

annotation-def TYPE_PARAMS_OF_func():

    annotation-def BOUND_OF_T():
        return int
    # In reality, BOUND_OF_T() is evaluated only on demand.
    T = typing.TypeVar("T", bound=BOUND_OF_T())

    Ts = typing.TypeVarTuple("Ts")
    P = typing.ParamSpec("P")

    def func(*args: *Ts, arg: Callable[P, T] = DEFAULT_OF_arg):
        ...

    func.__type_params__ = (T, Ts, P)
    return func
func = decorator(TYPE_PARAMS_OF_func())
```

The capitalized names like `DEFAULT_OF_arg` are not actually
bound at runtime.

<a id="generic-classes"></a>

### Generic classes

Generic classes are declared as follows:

```python3
class Bag[T]: ...
```

This syntax is equivalent to:

```python3
annotation-def TYPE_PARAMS_OF_Bag():
    T = typing.TypeVar("T")
    class Bag(typing.Generic[T]):
        __type_params__ = (T,)
        ...
    return Bag
Bag = TYPE_PARAMS_OF_Bag()
```

Here again `annotation-def` (not a real keyword) indicates an
[annotation scope](executionmodel.md#annotation-scopes), and the name
`TYPE_PARAMS_OF_Bag` is not actually bound at runtime.

Generic classes implicitly inherit from [`typing.Generic`](../library/typing.md#typing.Generic).
The base classes and keyword arguments of generic classes are
evaluated within the type scope for the type parameters,
and decorators are evaluated outside that scope. This is illustrated
by this example:

```python3
@decorator
class Bag(Base[T], arg=T): ...
```

This is equivalent to:

```python3
annotation-def TYPE_PARAMS_OF_Bag():
    T = typing.TypeVar("T")
    class Bag(Base[T], typing.Generic[T], arg=T):
        __type_params__ = (T,)
        ...
    return Bag
Bag = decorator(TYPE_PARAMS_OF_Bag())
```

<a id="generic-type-aliases"></a>

### Generic type aliases

The [`type`](simple_stmts.md#type) statement can also be used to create a generic type alias:

```python3
type ListOrSet[T] = list[T] | set[T]
```

Except for the [lazy evaluation](executionmodel.md#lazy-evaluation) of the value,
this is equivalent to:

```python3
annotation-def TYPE_PARAMS_OF_ListOrSet():
    T = typing.TypeVar("T")

    annotation-def VALUE_OF_ListOrSet():
        return list[T] | set[T]
    # In reality, the value is lazily evaluated
    return typing.TypeAliasType("ListOrSet", VALUE_OF_ListOrSet(), type_params=(T,))
ListOrSet = TYPE_PARAMS_OF_ListOrSet()
```

Here, `annotation-def` (not a real keyword) indicates an
[annotation scope](executionmodel.md#annotation-scopes). The capitalized names
like `TYPE_PARAMS_OF_ListOrSet` are not actually bound at runtime.

<a id="annotations"></a>

## Annotations

#### Versionchanged
Changed in version 3.14: Annotations are now lazily evaluated by default.

Variables and function parameters may carry [annotations](../glossary.md#term-annotation),
created by adding a colon after the name, followed by an expression:

```python3
x: annotation = 1
def f(param: annotation): ...
```

Functions may also carry a return annotation following an arrow:

```python3
def f() -> annotation: ...
```

Annotations are conventionally used for [type hints](../glossary.md#term-type-hint), but this
is not enforced by the language, and in general annotations may contain arbitrary
expressions. The presence of annotations does not change the runtime semantics of
the code, except if some mechanism is used that introspects and uses the annotations
(such as [`dataclasses`](../library/dataclasses.md#module-dataclasses) or [`functools.singledispatch()`](../library/functools.md#functools.singledispatch)).

By default, annotations are lazily evaluated in an [annotation scope](executionmodel.md#annotation-scopes).
This means that they are not evaluated when the code containing the annotation is evaluated.
Instead, the interpreter saves information that can be used to evaluate the annotation later
if requested. The [`annotationlib`](../library/annotationlib.md#module-annotationlib) module provides tools for evaluating annotations.

If the [future statement](simple_stmts.md#future) `from __future__ import annotations` is present,
all annotations are instead stored as strings:

```python3
>>> from __future__ import annotations
>>> def f(param: annotation): ...
>>> f.__annotations__
{'param': 'annotation'}
```

This future statement will be deprecated and removed in a future version of Python,
but not before Python 3.13 reaches its end of life (see [**PEP 749**](https://peps.python.org/pep-0749/)).
When it is used, introspection tools like
[`annotationlib.get_annotations()`](../library/annotationlib.md#annotationlib.get_annotations) and [`typing.get_type_hints()`](../library/typing.md#typing.get_type_hints) are
less likely to be able to resolve annotations at runtime.

### Footnotes

* <a id='id22'>**[1]**</a> The exception is propagated to the invocation stack unless there is a [`finally`](#finally) clause which happens to raise another exception. That new exception causes the old one to be lost.
* <a id='id23'>**[2]**</a> In pattern matching, a sequence is defined as one of the following:  * a class that inherits from [`collections.abc.Sequence`](../library/collections.abc.md#collections.abc.Sequence) * a Python class that has been registered as [`collections.abc.Sequence`](../library/collections.abc.md#collections.abc.Sequence) * a builtin class that has its (CPython) [`Py_TPFLAGS_SEQUENCE`](../c-api/typeobj.md#c.Py_TPFLAGS_SEQUENCE) bit set * a class that inherits from any of the above  The following standard library classes are sequences:  * [`array.array`](../library/array.md#array.array) * [`collections.deque`](../library/collections.md#collections.deque) * [`list`](../library/stdtypes.md#list) * [`memoryview`](../library/stdtypes.md#memoryview) * [`range`](../library/stdtypes.md#range) * [`tuple`](../library/stdtypes.md#tuple)  #### NOTE Subject values of type `str`, `bytes`, and `bytearray` do not match sequence patterns.
* <a id='id24'>**[3]**</a> In pattern matching, a mapping is defined as one of the following:  * a class that inherits from [`collections.abc.Mapping`](../library/collections.abc.md#collections.abc.Mapping) * a Python class that has been registered as [`collections.abc.Mapping`](../library/collections.abc.md#collections.abc.Mapping) * a builtin class that has its (CPython) [`Py_TPFLAGS_MAPPING`](../c-api/typeobj.md#c.Py_TPFLAGS_MAPPING) bit set * a class that inherits from any of the above  The standard library classes [`dict`](../library/stdtypes.md#dict) and [`types.MappingProxyType`](../library/types.md#types.MappingProxyType) are mappings.
* <a id='id25'>**[4]**</a> A string literal appearing as the first statement in the function body is transformed into the function’s [`__doc__`](datamodel.md#function.__doc__) attribute and therefore the function’s [docstring](../glossary.md#term-docstring).
* <a id='id26'>**[5]**</a> A string literal appearing as the first statement in the class body is transformed into the namespace’s [`__doc__`](datamodel.md#type.__doc__) item and therefore the class’s [docstring](../glossary.md#term-docstring).
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
