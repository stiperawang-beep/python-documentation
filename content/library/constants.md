<a id="built-in-consts"></a>

# Built-in Constants

A small number of constants live in the built-in namespace.  They are:

### False

The false value of the [`bool`](functions.md#bool) type. Assignments to `False`
are illegal and raise a [`SyntaxError`](exceptions.md#SyntaxError).

### True

The true value of the [`bool`](functions.md#bool) type. Assignments to `True`
are illegal and raise a [`SyntaxError`](exceptions.md#SyntaxError).

### None

An object frequently used to represent the absence of a value, as when
default arguments are not passed to a function. Assignments to `None`
are illegal and raise a [`SyntaxError`](exceptions.md#SyntaxError).
`None` is the sole instance of the [`NoneType`](types.md#types.NoneType) type.

### NotImplemented

A special value which should be returned by the binary special methods
(e.g. [`__eq__()`](../reference/datamodel.md#object.__eq__), [`__lt__()`](../reference/datamodel.md#object.__lt__), [`__add__()`](../reference/datamodel.md#object.__add__), [`__rsub__()`](../reference/datamodel.md#object.__rsub__),
etc.) to indicate that the operation is not implemented with respect to
the other type; may be returned by the in-place binary special methods
(e.g. [`__imul__()`](../reference/datamodel.md#object.__imul__), [`__iand__()`](../reference/datamodel.md#object.__iand__), etc.) for the same purpose.
It should not be evaluated in a boolean context.
`NotImplemented` is the sole instance of the [`types.NotImplementedType`](types.md#types.NotImplementedType) type.

#### NOTE
When a binary (or in-place) method returns `NotImplemented` the
interpreter will try the reflected operation on the other type (or some
other fallback, depending on the operator).  If all attempts return
`NotImplemented`, the interpreter will raise an appropriate exception.
Incorrectly returning `NotImplemented` will result in a misleading
error message or the `NotImplemented` value being returned to Python code.

See [Implementing the arithmetic operations](numbers.md#implementing-the-arithmetic-operations) for examples.

#### Versionchanged
Changed in version 3.9: Evaluating `NotImplemented` in a boolean context was deprecated.

#### Versionchanged
Changed in version 3.14: Evaluating `NotImplemented` in a boolean context now raises a [`TypeError`](exceptions.md#TypeError).
It previously evaluated to [`True`](#True) and emitted a [`DeprecationWarning`](exceptions.md#DeprecationWarning)
since Python 3.9.

<a id="index-0"></a>

### Ellipsis

The same as the ellipsis literal “`...`”, an object frequently used to
indicate that something is omitted. Assignment to `Ellipsis` is possible, but
assignment to  `...` raises a [`SyntaxError`](exceptions.md#SyntaxError).
`Ellipsis` is the sole instance of the [`types.EllipsisType`](types.md#types.EllipsisType) type.

### \_\_debug_\_

This constant is true if Python was not started with an [`-O`](../using/cmdline.md#cmdoption-O) option.
See also the [`assert`](../reference/simple_stmts.md#assert) statement.

#### NOTE
The names [`None`](#None), [`False`](#False), [`True`](#True) and [`__debug__`](#debug__)
cannot be reassigned (assignments to them, even as an attribute name, raise
[`SyntaxError`](exceptions.md#SyntaxError)), so they can be considered “true” constants.

<a id="site-consts"></a>

## Constants added by the [`site`](site.md#module-site) module

The [`site`](site.md#module-site) module (which is imported automatically during startup, except
if the [`-S`](../using/cmdline.md#cmdoption-S) command-line option is given) adds several constants to the
built-in namespace.  They are useful for the interactive interpreter shell and
should not be used in programs.

### quit(code=None)

### exit(code=None)

Objects that when printed, print a message like “Use quit() or Ctrl-D
(i.e. EOF) to exit”, and when accessed directly in the interactive
interpreter or called as functions, raise [`SystemExit`](exceptions.md#SystemExit) with the
specified exit code.

### help

Object that when printed, prints the message “Type help() for interactive
help, or help(object) for help about object.”, and when accessed directly
in the interactive interpreter, invokes the built-in help system
(see [`help()`](functions.md#help)).

### copyright

### credits

Objects that when printed or called, print the text of copyright or
credits, respectively.

### license

Object that when printed, prints the message “Type license() to see the
full license text”, and when called, displays the full license text in a
pager-like fashion (one screen at a time).

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
