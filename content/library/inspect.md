# `inspect` — Inspect live objects

<!-- import inspect
from inspect import * -->

<a id="module-inspect"></a>

**Source code:** [Lib/inspect.py](https://github.com/python/cpython/tree/main/Lib/inspect.py)

---

The `inspect` module provides several useful functions to help get
information about live objects such as modules, classes, methods, functions,
tracebacks, frame objects, and code objects.  For example, it can help you
examine the contents of a class, retrieve the source code of a method, extract
and format the argument list for a function, or get all the information you need
to display a detailed traceback.

There are four main kinds of services provided by this module: type checking,
getting source code, inspecting classes and functions, and examining the
interpreter stack.

<a id="inspect-types"></a>

## Types and members

The [`getmembers()`](#inspect.getmembers) function retrieves the members of an object such as a
class or module. The functions whose names begin with “is” are mainly
provided as convenient choices for the second argument to [`getmembers()`](#inspect.getmembers).
They also help you determine when you can expect to find the following special
attributes (see [Import-related attributes on module objects](../reference/datamodel.md#import-mod-attrs) for module attributes):

<!-- this function name is too big to fit in the ascii-art table below -->

| Type            | Attribute          | Description                                                                                                                                       |
|-----------------|--------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| class           | \_\_doc_\_         | documentation string                                                                                                                              |
|                 | \_\_name_\_        | name with which this<br/>class was defined                                                                                                        |
|                 | \_\_qualname_\_    | qualified name                                                                                                                                    |
|                 | \_\_module_\_      | name of module in which<br/>this class was defined                                                                                                |
|                 | \_\_type_params_\_ | A tuple containing the<br/>[type parameters](../reference/compound_stmts.md#type-params) of<br/>a generic class                                   |
| method          | \_\_doc_\_         | documentation string                                                                                                                              |
|                 | \_\_name_\_        | name with which this<br/>method was defined                                                                                                       |
|                 | \_\_qualname_\_    | qualified name                                                                                                                                    |
|                 | \_\_func_\_        | function object<br/>containing implementation<br/>of method                                                                                       |
|                 | \_\_self_\_        | instance to which this<br/>method is bound, or<br/>`None`                                                                                         |
|                 | \_\_module_\_      | name of module in which<br/>this method was defined                                                                                               |
| function        | \_\_doc_\_         | documentation string                                                                                                                              |
|                 | \_\_name_\_        | name with which this<br/>function was defined                                                                                                     |
|                 | \_\_qualname_\_    | qualified name                                                                                                                                    |
|                 | \_\_code_\_        | code object containing<br/>compiled function<br/>[bytecode](../glossary.md#term-bytecode)                                                         |
|                 | \_\_defaults_\_    | tuple of any default<br/>values for positional or<br/>keyword parameters                                                                          |
|                 | \_\_kwdefaults_\_  | mapping of any default<br/>values for keyword-only<br/>parameters                                                                                 |
|                 | \_\_globals_\_     | global namespace in which<br/>this function was defined                                                                                           |
|                 | \_\_builtins_\_    | builtins namespace                                                                                                                                |
|                 | \_\_annotations_\_ | mapping of parameters<br/>names to annotations;<br/>`"return"` key is<br/>reserved for return<br/>annotations.                                    |
|                 | \_\_type_params_\_ | A tuple containing the<br/>[type parameters](../reference/compound_stmts.md#type-params) of<br/>a generic function                                |
|                 | \_\_module_\_      | name of module in which<br/>this function was defined                                                                                             |
| traceback       | tb_frame           | frame object at this<br/>level                                                                                                                    |
|                 | tb_lasti           | index of last attempted<br/>instruction in bytecode                                                                                               |
|                 | tb_lineno          | current line number in<br/>Python source code                                                                                                     |
|                 | tb_next            | next inner traceback<br/>object (called by this<br/>level)                                                                                        |
| frame           | f_back             | next outer frame object<br/>(this frame’s caller)                                                                                                 |
|                 | f_builtins         | builtins namespace seen<br/>by this frame                                                                                                         |
|                 | f_code             | code object being<br/>executed in this frame                                                                                                      |
|                 | f_globals          | global namespace seen by<br/>this frame                                                                                                           |
|                 | f_lasti            | index of last attempted<br/>instruction in bytecode                                                                                               |
|                 | f_lineno           | current line number in<br/>Python source code                                                                                                     |
|                 | f_locals           | local namespace seen by<br/>this frame                                                                                                            |
|                 | f_generator        | returns the generator or<br/>coroutine object that<br/>owns this frame, or<br/>`None` if the frame is<br/>of a regular function                   |
|                 | f_trace            | tracing function for this<br/>frame, or `None`                                                                                                    |
|                 | f_trace_lines      | indicate whether a<br/>tracing event is<br/>triggered for each source<br/>source line                                                             |
|                 | f_trace_opcodes    | indicate whether<br/>per-opcode events are<br/>requested                                                                                          |
|                 | clear()            | used to clear all<br/>references to local<br/>variables                                                                                           |
| code            | co_argcount        | number of arguments (not<br/>including keyword only<br/>arguments, \* or \*\*<br/>args)                                                           |
|                 | co_code            | string of raw compiled<br/>bytecode                                                                                                               |
|                 | co_cellvars        | tuple of names of cell<br/>variables (referenced by<br/>containing scopes)                                                                        |
|                 | co_consts          | tuple of constants used<br/>in the bytecode                                                                                                       |
|                 | co_filename        | name of file in which<br/>this code object was<br/>created                                                                                        |
|                 | co_firstlineno     | number of first line in<br/>Python source code                                                                                                    |
|                 | co_flags           | bitmap of `CO_*` flags,<br/>read more [here](#inspect-module-co-flags)                                                                            |
|                 | co_lnotab          | encoded mapping of line<br/>numbers to bytecode<br/>indices                                                                                       |
|                 | co_freevars        | tuple of names of free<br/>variables (referenced via<br/>a function’s closure)                                                                    |
|                 | co_posonlyargcount | number of positional only<br/>arguments                                                                                                           |
|                 | co_kwonlyargcount  | number of keyword only<br/>arguments (not including<br/>\*\* arg)                                                                                 |
|                 | co_name            | name with which this code<br/>object was defined                                                                                                  |
|                 | co_qualname        | fully qualified name with<br/>which this code object<br/>was defined                                                                              |
|                 | co_names           | tuple of names other<br/>than arguments and<br/>function locals                                                                                   |
|                 | co_nlocals         | number of local variables                                                                                                                         |
|                 | co_stacksize       | virtual machine stack<br/>space required                                                                                                          |
|                 | co_varnames        | tuple of names of<br/>arguments and local<br/>variables                                                                                           |
|                 | co_lines()         | returns an iterator that<br/>yields successive<br/>bytecode ranges                                                                                |
|                 | co_positions()     | returns an iterator of<br/>source code positions for<br/>each bytecode instruction                                                                |
|                 | replace()          | returns a copy of the<br/>code object with new<br/>values                                                                                         |
| generator       | \_\_name_\_        | name                                                                                                                                              |
|                 | \_\_qualname_\_    | qualified name                                                                                                                                    |
|                 | gi_frame           | frame                                                                                                                                             |
|                 | gi_running         | is the generator running?                                                                                                                         |
|                 | gi_suspended       | is the generator<br/>suspended?                                                                                                                   |
|                 | gi_code            | code                                                                                                                                              |
|                 | gi_yieldfrom       | object being iterated by<br/>`yield from`, or<br/>`None`                                                                                          |
|                 | gi_state           | state of the generator,<br/>one of `GEN_CREATED`,<br/>`GEN_RUNNING`,<br/>`GEN_SUSPENDED`, or<br/>`GEN_CLOSED`                                     |
| async generator | \_\_name_\_        | name                                                                                                                                              |
|                 | \_\_qualname_\_    | qualified name                                                                                                                                    |
|                 | ag_await           | object being awaited on,<br/>or `None`                                                                                                            |
|                 | ag_frame           | frame                                                                                                                                             |
|                 | ag_running         | is the generator running?                                                                                                                         |
|                 | ag_suspended       | is the generator<br/>suspended?                                                                                                                   |
|                 | ag_code            | code                                                                                                                                              |
|                 | ag_state           | state of the async<br/>generator, one of<br/>`AGEN_CREATED`,<br/>`AGEN_RUNNING`,<br/>`AGEN_SUSPENDED`, or<br/>`AGEN_CLOSED`                       |
| coroutine       | \_\_name_\_        | name                                                                                                                                              |
|                 | \_\_qualname_\_    | qualified name                                                                                                                                    |
|                 | cr_await           | object being awaited on,<br/>or `None`                                                                                                            |
|                 | cr_frame           | frame                                                                                                                                             |
|                 | cr_running         | is the coroutine running?                                                                                                                         |
|                 | cr_suspended       | is the coroutine<br/>suspended?                                                                                                                   |
|                 | cr_code            | code                                                                                                                                              |
|                 | cr_origin          | where coroutine was<br/>created, or `None`. See<br/>[`sys.set_coroutine_origin_tracking_depth()`](sys.md#sys.set_coroutine_origin_tracking_depth) |
|                 | cr_state           | state of the coroutine,<br/>one of `CORO_CREATED`,<br/>`CORO_RUNNING`,<br/>`CORO_SUSPENDED`, or<br/>`CORO_CLOSED`                                 |
| builtin         | \_\_doc_\_         | documentation string                                                                                                                              |
|                 | \_\_name_\_        | original name of this<br/>function or method                                                                                                      |
|                 | \_\_qualname_\_    | qualified name                                                                                                                                    |
|                 | \_\_self_\_        | instance to which a<br/>method is bound, or<br/>`None`                                                                                            |

#### Versionchanged
Changed in version 3.5: Add `__qualname__` and `gi_yieldfrom` attributes to generators.

The `__name__` attribute of generators is now set from the function
name, instead of the code name, and it can now be modified.

#### Versionchanged
Changed in version 3.7: Add `cr_origin` attribute to coroutines.

#### Versionchanged
Changed in version 3.10: Add `__builtins__` attribute to functions.

#### Versionchanged
Changed in version 3.11: Add `gi_suspended` attribute to generators.

#### Versionchanged
Changed in version 3.11: Add `cr_suspended` attribute to coroutines.

#### Versionchanged
Changed in version 3.12: Add `ag_suspended` attribute to async generators.

#### Versionchanged
Changed in version 3.14: Add `f_generator` attribute to frames.

#### Versionchanged
Changed in version 3.15: Add `gi_state` attribute to generators, `cr_state` attribute to
coroutines, and `ag_state` attribute to async generators.

### inspect.getmembers(object)

Return all the members of an object in a list of `(name, value)`
pairs sorted by name. If the optional *predicate* argument—which will be
called with the `value` object of each member—is supplied, only members
for which the predicate returns a true value are included.

#### NOTE
[`getmembers()`](#inspect.getmembers) will only return class attributes defined in the
metaclass when the argument is a class and those attributes have been
listed in the metaclass’ custom [`__dir__()`](../reference/datamodel.md#object.__dir__).

### inspect.getmembers_static(object)

Return all the members of an object in a list of `(name, value)`
pairs sorted by name without triggering dynamic lookup via the descriptor
protocol, \_\_getattr_\_ or \_\_getattribute_\_. Optionally, only return members
that satisfy a given predicate.

#### NOTE
[`getmembers_static()`](#inspect.getmembers_static) may not be able to retrieve all members
that getmembers can fetch (like dynamically created attributes)
and may find members that getmembers can’t (like descriptors
that raise AttributeError). It can also return descriptor objects
instead of instance members in some cases.

#### Versionadded
Added in version 3.11.

### inspect.getmodulename(path)

Return the name of the module named by the file *path*, without including the
names of enclosing packages. The file extension is checked against all of
the entries in [`importlib.machinery.all_suffixes()`](importlib.md#importlib.machinery.all_suffixes). If it matches,
the final path component is returned with the extension removed.
Otherwise, `None` is returned.

Note that this function *only* returns a meaningful name for actual
Python modules - paths that potentially refer to Python packages will
still return `None`.

#### Versionchanged
Changed in version 3.3: The function is based directly on [`importlib`](importlib.md#module-importlib).

### inspect.ismodule(object)

Return `True` if the object is a module.

### inspect.isclass(object)

Return `True` if the object is a class, whether built-in or created in Python
code.

### inspect.ismethod(object)

Return `True` if the object is a bound method written in Python.

### inspect.ispackage(object)

Return `True` if the object is a [package](../glossary.md#term-package).

#### Versionadded
Added in version 3.14.

### inspect.isfunction(object)

Return `True` if the object is a Python function, which includes functions
created by a [lambda](../glossary.md#term-lambda) expression.

### inspect.isgeneratorfunction(object)

Return `True` if the object is a Python generator function.

#### Versionchanged
Changed in version 3.8: Functions wrapped in [`functools.partial()`](functools.md#functools.partial) now return `True` if the
wrapped function is a Python generator function.

#### Versionchanged
Changed in version 3.13: Functions wrapped in [`functools.partialmethod()`](functools.md#functools.partialmethod) now return `True`
if the wrapped function is a Python generator function.

### inspect.isgenerator(object)

Return `True` if the object is a generator.

### inspect.iscoroutinefunction(object)

Return `True` if the object is a [coroutine function](../glossary.md#term-coroutine-function) (a function
defined with an [`async def`](../reference/compound_stmts.md#async-def) syntax), a [`functools.partial()`](functools.md#functools.partial)
wrapping a [coroutine function](../glossary.md#term-coroutine-function), or a sync function marked with
[`markcoroutinefunction()`](#inspect.markcoroutinefunction).

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.8: Functions wrapped in [`functools.partial()`](functools.md#functools.partial) now return `True` if the
wrapped function is a [coroutine function](../glossary.md#term-coroutine-function).

#### Versionchanged
Changed in version 3.12: Sync functions marked with [`markcoroutinefunction()`](#inspect.markcoroutinefunction) now return
`True`.

#### Versionchanged
Changed in version 3.13: Functions wrapped in [`functools.partialmethod()`](functools.md#functools.partialmethod) now return `True`
if the wrapped function is a [coroutine function](../glossary.md#term-coroutine-function).

### inspect.markcoroutinefunction(func)

Decorator to mark a callable as a [coroutine function](../glossary.md#term-coroutine-function) if it would not
otherwise be detected by [`iscoroutinefunction()`](#inspect.iscoroutinefunction).

This may be of use for sync functions that return a [coroutine](../glossary.md#term-coroutine), if
the function is passed to an API that requires [`iscoroutinefunction()`](#inspect.iscoroutinefunction).

When possible, using an [`async def`](../reference/compound_stmts.md#async-def) function is preferred. Also
acceptable is calling the function and testing the return with
[`iscoroutine()`](#inspect.iscoroutine).

#### Versionadded
Added in version 3.12.

### inspect.iscoroutine(object)

Return `True` if the object is a [coroutine](../glossary.md#term-coroutine) created by an
[`async def`](../reference/compound_stmts.md#async-def) function.

#### Versionadded
Added in version 3.5.

### inspect.isawaitable(object)

Return `True` if the object can be used in [`await`](../reference/expressions.md#await) expression.

Can also be used to distinguish generator-based coroutines from regular
generators:

```python
import types

def gen():
    yield
@types.coroutine
def gen_coro():
    yield

assert not isawaitable(gen())
assert isawaitable(gen_coro())
```

#### Versionadded
Added in version 3.5.

### inspect.isasyncgenfunction(object)

Return `True` if the object is an [asynchronous generator](../glossary.md#term-asynchronous-generator) function,
for example:

```pycon
>>> async def agen():
...     yield 1
...
>>> inspect.isasyncgenfunction(agen)
True
```

#### Versionadded
Added in version 3.6.

#### Versionchanged
Changed in version 3.8: Functions wrapped in [`functools.partial()`](functools.md#functools.partial) now return `True` if the
wrapped function is an [asynchronous generator](../glossary.md#term-asynchronous-generator) function.

#### Versionchanged
Changed in version 3.13: Functions wrapped in [`functools.partialmethod()`](functools.md#functools.partialmethod) now return `True`
if the wrapped function is a [asynchronous generator](../glossary.md#term-asynchronous-generator) function.

### inspect.isasyncgen(object)

Return `True` if the object is an [asynchronous generator iterator](../glossary.md#term-asynchronous-generator-iterator)
created by an [asynchronous generator](../glossary.md#term-asynchronous-generator) function.

#### Versionadded
Added in version 3.6.

### inspect.istraceback(object)

Return `True` if the object is a traceback.

### inspect.isframe(object)

Return `True` if the object is a frame.

### inspect.iscode(object)

Return `True` if the object is a code.

### inspect.isbuiltin(object)

Return `True` if the object is a built-in function or a bound built-in method.

### inspect.ismethodwrapper(object)

Return `True` if the type of object is a [`MethodWrapperType`](types.md#types.MethodWrapperType).

These are instances of [`MethodWrapperType`](types.md#types.MethodWrapperType), such as [`__str__()`](../reference/datamodel.md#object.__str__),
[`__eq__()`](../reference/datamodel.md#object.__eq__) and [`__repr__()`](../reference/datamodel.md#object.__repr__).

#### Versionadded
Added in version 3.11.

### inspect.isroutine(object)

Return `True` if the object is a user-defined or built-in function or method.

### inspect.isabstract(object)

Return `True` if the object is an abstract base class.

### inspect.ismethoddescriptor(object)

Return `True` if the object is a method descriptor, but not if
[`ismethod()`](#inspect.ismethod), [`isclass()`](#inspect.isclass), [`isfunction()`](#inspect.isfunction) or [`isbuiltin()`](#inspect.isbuiltin)
are true.

This, for example, is true of `int.__add__`.  An object passing this test
has a [`__get__()`](../reference/datamodel.md#object.__get__) method, but not a [`__set__()`](../reference/datamodel.md#object.__set__)
method or a [`__delete__()`](../reference/datamodel.md#object.__delete__) method.  Beyond that, the set of
attributes varies.  A [`__name__`](stdtypes.md#definition.__name__) attribute is usually
sensible, and [`__doc__`](stdtypes.md#definition.__doc__) often is.

Methods implemented via descriptors that also pass one of the other tests
return `False` from the [`ismethoddescriptor()`](#inspect.ismethoddescriptor) test, simply because the
other tests promise more – you can, e.g., count on having the
[`__func__`](../reference/datamodel.md#method.__func__) attribute (etc) when an object passes
[`ismethod()`](#inspect.ismethod).

#### Versionchanged
Changed in version 3.13: This function no longer incorrectly reports objects with [`__get__()`](../reference/datamodel.md#object.__get__)
and [`__delete__()`](../reference/datamodel.md#object.__delete__), but not [`__set__()`](../reference/datamodel.md#object.__set__), as being method
descriptors (such objects are data descriptors, not method descriptors).

### inspect.isdatadescriptor(object)

Return `True` if the object is a data descriptor.

Data descriptors have a [`__set__`](../reference/datamodel.md#object.__set__) or a [`__delete__`](../reference/datamodel.md#object.__delete__) method.
Examples are properties (defined in Python), getsets, and members.  The
latter two are defined in C and there are more specific tests available for
those types, which is robust across Python implementations.  Typically, data
descriptors will also have [`__name__`](stdtypes.md#definition.__name__) and `__doc__` attributes
(properties, getsets, and members have both of these attributes), but this is
not guaranteed.

### inspect.isgetsetdescriptor(object)

Return `True` if the object is a getset descriptor.

**CPython implementation detail:** getsets are attributes defined in extension modules via
[`PyGetSetDef`](../c-api/structures.md#c.PyGetSetDef) structures.  For Python implementations without such
types, this method will always return `False`.

### inspect.ismemberdescriptor(object)

Return `True` if the object is a member descriptor.

**CPython implementation detail:** Member descriptors are attributes defined in extension modules via
[`PyMemberDef`](../c-api/structures.md#c.PyMemberDef) structures.  For Python implementations without such
types, this method will always return `False`.

<a id="inspect-source"></a>

## Retrieving source code

### inspect.getdoc(object, , inherit_class_doc=True, fallback_to_class_doc=True)

Get the documentation string for an object, cleaned up with [`cleandoc()`](#inspect.cleandoc).
If the documentation string for an object is not provided:

* if the object is a class and *inherit_class_doc* is true (by default),
  retrieve the documentation string from the inheritance hierarchy;
* if the object is a method, a property or a descriptor, retrieve
  the documentation string from the inheritance hierarchy;
* otherwise, if *fallback_to_class_doc* is true (by default), retrieve
  the documentation string from the class of the object.

Return `None` if the documentation string is invalid or missing.

#### Versionchanged
Changed in version 3.5: Documentation strings are now inherited if not overridden.

#### Versionchanged
Changed in version 3.15: Added parameters *inherit_class_doc* and *fallback_to_class_doc*.

Documentation strings on [`cached_property`](functools.md#functools.cached_property)
objects are now inherited if not overridden.

### inspect.getcomments(object)

Return in a single string any lines of comments immediately preceding the
object’s source code (for a class, function, or method), or at the top of the
Python source file (if the object is a module).  If the object’s source code
is unavailable, return `None`.  This could happen if the object has been
defined in C or the interactive shell.

### inspect.getfile(object)

Return the name of the (text or binary) file in which an object was defined.
This will fail with a [`TypeError`](exceptions.md#TypeError) if the object is a built-in module,
class, or function.

### inspect.getmodule(object)

Try to guess which module an object was defined in. Return `None`
if the module cannot be determined.

### inspect.getsourcefile(object)

Return the name of the Python source file in which an object was defined
or `None` if no way can be identified to get the source.  This
will fail with a [`TypeError`](exceptions.md#TypeError) if the object is a built-in module, class, or
function.

### inspect.getsourcelines(object)

Return a list of source lines and starting line number for an object. The
argument may be a module, class, method, function, traceback, frame, or code
object.  The source code is returned as a list of the lines corresponding to the
object and the line number indicates where in the original source file the first
line of code was found.  An [`OSError`](exceptions.md#OSError) is raised if the source code cannot
be retrieved.
A [`TypeError`](exceptions.md#TypeError) is raised if the object is a built-in module, class, or
function.

#### Versionchanged
Changed in version 3.3: [`OSError`](exceptions.md#OSError) is raised instead of [`IOError`](exceptions.md#IOError), now an alias of the
former.

### inspect.getsource(object)

Return the text of the source code for an object. The argument may be a module,
class, method, function, traceback, frame, or code object.  The source code is
returned as a single string.  An [`OSError`](exceptions.md#OSError) is raised if the source code
cannot be retrieved.
A [`TypeError`](exceptions.md#TypeError) is raised if the object is a built-in module, class, or
function.

#### Versionchanged
Changed in version 3.3: [`OSError`](exceptions.md#OSError) is raised instead of [`IOError`](exceptions.md#IOError), now an alias of the
former.

### inspect.cleandoc(doc)

Clean up indentation from docstrings that are indented to line up with blocks
of code.

All leading whitespace is removed from the first line.  Any leading whitespace
that can be uniformly removed from the second line onwards is removed.  Empty
lines at the beginning and end are subsequently removed.  Also, all tabs are
expanded to spaces.

<a id="inspect-signature-object"></a>

## Introspecting callables with the Signature object

#### Versionadded
Added in version 3.3.

The [`Signature`](#inspect.Signature) object represents the call signature of a callable object
and its return annotation. To retrieve a `Signature` object,
use the `signature()`
function.

### inspect.signature(callable, , follow_wrapped=True, globals=None, locals=None, eval_str=False, annotation_format=Format.VALUE)

Return a [`Signature`](#inspect.Signature) object for the given *callable*:

```pycon
>>> from inspect import signature
>>> def foo(a, *, b:int, **kwargs):
...     pass

>>> sig = signature(foo)

>>> str(sig)
'(a, *, b: int, **kwargs)'

>>> str(sig.parameters['b'])
'b: int'

>>> sig.parameters['b'].annotation
<class 'int'>
```

Accepts a wide range of Python callables, from plain functions and classes to
[`functools.partial()`](functools.md#functools.partial) objects.

If some of the annotations are strings (e.g., because
`from __future__ import annotations` was used), [`signature()`](#inspect.signature) will
attempt to automatically un-stringize the annotations using
[`annotationlib.get_annotations()`](annotationlib.md#annotationlib.get_annotations).  The
*globals*, *locals*, and *eval_str* parameters are passed
into `annotationlib.get_annotations()` when resolving the
annotations; see the documentation for `annotationlib.get_annotations()`
for instructions on how to use these parameters. A member of the
[`annotationlib.Format`](annotationlib.md#annotationlib.Format) enum can be passed to the
*annotation_format* parameter to control the format of the returned
annotations. For example, use
`annotation_format=annotationlib.Format.STRING` to return annotations in string
format.

Raises [`ValueError`](exceptions.md#ValueError) if no signature can be provided, and
[`TypeError`](exceptions.md#TypeError) if that type of object is not supported.  Also,
if the annotations are stringized, and *eval_str* is not false,
the `eval()` call(s) to un-stringize the annotations in [`annotationlib.get_annotations()`](annotationlib.md#annotationlib.get_annotations)
could potentially raise any kind of exception.

A slash (/) in the signature of a function denotes that the parameters prior
to it are positional-only. For more info, see
[the FAQ entry on positional-only parameters](../faq/programming.md#faq-positional-only-arguments).

#### Versionchanged
Changed in version 3.5: The *follow_wrapped* parameter was added.
Pass `False` to get a signature of
*callable* specifically (`callable.__wrapped__` will not be used to
unwrap decorated callables.)

#### Versionchanged
Changed in version 3.10: The *globals*, *locals*, and *eval_str* parameters were added.

#### Versionchanged
Changed in version 3.14: The *annotation_format* parameter was added.

#### NOTE
Some callables may not be introspectable in certain implementations of
Python.  For example, in CPython, some built-in functions defined in
C provide no metadata about their arguments.

**CPython implementation detail:** If the passed object has a `__signature__` attribute,
we may use it to create the signature.
The exact semantics are an implementation detail and are subject to
unannounced changes. Consult the source code for current semantics.

### *class* inspect.Signature(parameters=None, , return_annotation=Signature.empty)

A `Signature` object represents the call signature of a function
and its return
annotation.  For each parameter accepted by the function it stores a
[`Parameter`](#inspect.Parameter) object in its [`parameters`](#inspect.Signature.parameters) collection.

The optional *parameters* argument is a sequence of [`Parameter`](#inspect.Parameter)
objects, which is validated to check that there are no parameters with
duplicate names, and that the parameters are in the right order, i.e.
positional-only first, then positional-or-keyword, and that parameters with
defaults follow parameters without defaults.

The optional *return_annotation* argument can be an arbitrary Python object.
It represents the “return” annotation of the callable.

`Signature` objects are *immutable*.  Use [`Signature.replace()`](#inspect.Signature.replace) or
[`copy.replace()`](copy.md#copy.replace) to make a modified copy.

#### Versionchanged
Changed in version 3.5: `Signature` objects are now picklable and [hashable](../glossary.md#term-hashable).

#### empty

A special class-level marker to specify absence of a return annotation.

#### parameters

An ordered mapping of parameters’ names to the corresponding
[`Parameter`](#inspect.Parameter) objects.  Parameters appear in strict definition
order, including keyword-only parameters.

#### Versionchanged
Changed in version 3.7: Python only explicitly guaranteed that it preserved the declaration
order of keyword-only parameters as of version 3.7, although in practice
this order had always been preserved in Python 3.

#### return_annotation

The “return” annotation for the callable.  If the callable has no “return”
annotation, this attribute is set to [`Signature.empty`](#inspect.Signature.empty).

#### bind(\*args, \*\*kwargs)

Create a mapping from positional and keyword arguments to parameters.
Returns [`BoundArguments`](#inspect.BoundArguments) if `*args` and `**kwargs` match the
signature, or raises a [`TypeError`](exceptions.md#TypeError).

#### bind_partial(\*args, \*\*kwargs)

Works the same way as [`Signature.bind()`](#inspect.Signature.bind), but allows the omission of
some required arguments (mimics [`functools.partial()`](functools.md#functools.partial) behavior.)
Returns [`BoundArguments`](#inspect.BoundArguments), or raises a [`TypeError`](exceptions.md#TypeError) if the
passed arguments do not match the signature.

#### replace(\*[, parameters][, return_annotation])

Create a new [`Signature`](#inspect.Signature) instance based on the instance
[`replace()`](#inspect.Signature.replace) was invoked on.
It is possible to pass different *parameters* and/or
*return_annotation* to override the corresponding properties of the base
signature.  To remove `return_annotation` from the copied
`Signature`, pass in
[`Signature.empty`](#inspect.Signature.empty).

```pycon
>>> def test(a, b):
...     pass
...
>>> sig = signature(test)
>>> new_sig = sig.replace(return_annotation="new return anno")
>>> str(new_sig)
"(a, b) -> 'new return anno'"
```

[`Signature`](#inspect.Signature) objects are also supported by the generic function
[`copy.replace()`](copy.md#copy.replace).

#### format(, max_width=None, quote_annotation_strings=True)

Create a string representation of the [`Signature`](#inspect.Signature) object.

If *max_width* is passed, the method will attempt to fit
the signature into lines of at most *max_width* characters.
If the signature is longer than *max_width*,
all parameters will be on separate lines.

If *quote_annotation_strings* is False, [annotations](../glossary.md#term-annotation)
in the signature are displayed without opening and closing quotation
marks if they are strings. This is useful if the signature was created with the
[`STRING`](annotationlib.md#annotationlib.Format.STRING) format or if
`from __future__ import annotations` was used.

#### Versionadded
Added in version 3.13.

#### Versionchanged
Changed in version 3.14: The *unquote_annotations* parameter was added.

#### *classmethod* from_callable(obj, , follow_wrapped=True, globals=None, locals=None, eval_str=False)

Return a [`Signature`](#inspect.Signature) (or its subclass) object for a given callable
*obj*.

This method simplifies subclassing of [`Signature`](#inspect.Signature):

```python
class MySignature(Signature):
    pass
sig = MySignature.from_callable(sum)
assert isinstance(sig, MySignature)
```

Its behavior is otherwise identical to that of [`signature()`](#inspect.signature).

#### Versionadded
Added in version 3.5.

#### Versionchanged
Changed in version 3.10: The *globals*, *locals*, and *eval_str* parameters were added.

### *class* inspect.Parameter(name, kind, , default=Parameter.empty, annotation=Parameter.empty)

`Parameter` objects are *immutable*.
Instead of modifying a `Parameter` object,
you can use [`Parameter.replace()`](#inspect.Parameter.replace) or [`copy.replace()`](copy.md#copy.replace) to create a modified copy.

#### Versionchanged
Changed in version 3.5: Parameter objects are now picklable and [hashable](../glossary.md#term-hashable).

#### empty

A special class-level marker to specify absence of default values and
annotations.

#### name

The name of the parameter as a string.  The name must be a valid
Python identifier.

**CPython implementation detail:** CPython generates implicit parameter names of the form `.0` on the
code objects used to implement comprehensions and generator
expressions.

#### Versionchanged
Changed in version 3.6: These parameter names are now exposed by this module as names like
`implicit0`.

#### default

The default value for the parameter.  If the parameter has no default
value, this attribute is set to [`Parameter.empty`](#inspect.Parameter.empty).

#### annotation

The annotation for the parameter.  If the parameter has no annotation,
this attribute is set to [`Parameter.empty`](#inspect.Parameter.empty).

#### kind

Describes how argument values are bound to the parameter.  The possible
values are accessible via [`Parameter`](#inspect.Parameter) (like `Parameter.KEYWORD_ONLY`),
and support comparison and ordering, in the following order:

| Name                    | Meaning                                                                                                                                                                         |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| *POSITIONAL_ONLY*       | Value must be supplied as a positional<br/>argument. Positional only parameters are<br/>those which appear before a `/` entry (if<br/>present) in a Python function definition. |
| *POSITIONAL_OR_KEYWORD* | Value may be supplied as either a keyword or<br/>positional argument (this is the standard<br/>binding behaviour for functions implemented<br/>in Python.)                      |
| *VAR_POSITIONAL*        | A tuple of positional arguments that aren’t<br/>bound to any other parameter. This<br/>corresponds to a `*args` parameter in a<br/>Python function definition.                  |
| *KEYWORD_ONLY*          | Value must be supplied as a keyword argument.<br/>Keyword only parameters are those which<br/>appear after a `*` or `*args` entry in a<br/>Python function definition.          |
| *VAR_KEYWORD*           | A dict of keyword arguments that aren’t bound<br/>to any other parameter. This corresponds to a<br/>`**kwargs` parameter in a Python function<br/>definition.                   |

Example: print all keyword-only arguments without default values:

```pycon
>>> def foo(a, b, *, c, d=10):
...     pass

>>> sig = signature(foo)
>>> for param in sig.parameters.values():
...     if (param.kind == param.KEYWORD_ONLY and
...                        param.default is param.empty):
...         print('Parameter:', param)
Parameter: c
```

#### kind.description

Describes an enum value of [`Parameter.kind`](#inspect.Parameter.kind).

#### Versionadded
Added in version 3.8.

Example: print all descriptions of arguments:

```pycon
>>> def foo(a, b, *, c, d=10):
...     pass

>>> sig = signature(foo)
>>> for param in sig.parameters.values():
...     print(param.kind.description)
positional or keyword
positional or keyword
keyword-only
keyword-only
```

#### replace(\*[, name][, kind][, default][, annotation])

Create a new [`Parameter`](#inspect.Parameter) instance based on the instance replaced was invoked
on.  To override a `Parameter` attribute, pass the corresponding
argument.  To remove a default value or/and an annotation from a
`Parameter`, pass [`Parameter.empty`](#inspect.Parameter.empty).

```pycon
>>> from inspect import Parameter
>>> param = Parameter('foo', Parameter.KEYWORD_ONLY, default=42)
>>> str(param)
'foo=42'

>>> str(param.replace()) # Will create a shallow copy of 'param'
'foo=42'

>>> str(param.replace(default=Parameter.empty, annotation='spam'))
"foo: 'spam'"
```

[`Parameter`](#inspect.Parameter) objects are also supported by the generic function
[`copy.replace()`](copy.md#copy.replace).

#### Versionchanged
Changed in version 3.4: In Python 3.3 [`Parameter`](#inspect.Parameter) objects were allowed to have `name` set
to `None` if their `kind` was set to `POSITIONAL_ONLY`.
This is no longer permitted.

### *class* inspect.BoundArguments

Result of a [`Signature.bind()`](#inspect.Signature.bind) or [`Signature.bind_partial()`](#inspect.Signature.bind_partial) call.
Holds the mapping of arguments to the function’s parameters.

#### arguments

A mutable mapping of parameters’ names to arguments’ values.
Contains only explicitly bound arguments.  Changes in [`arguments`](#inspect.BoundArguments.arguments)
will reflect in [`args`](#inspect.BoundArguments.args) and [`kwargs`](#inspect.BoundArguments.kwargs).

Should be used in conjunction with [`Signature.parameters`](#inspect.Signature.parameters) for any
argument processing purposes.

#### NOTE
Arguments for which [`Signature.bind()`](#inspect.Signature.bind) or
[`Signature.bind_partial()`](#inspect.Signature.bind_partial) relied on a default value are skipped.
However, if needed, use [`BoundArguments.apply_defaults()`](#inspect.BoundArguments.apply_defaults) to add
them.

#### Versionchanged
Changed in version 3.9: [`arguments`](#inspect.BoundArguments.arguments) is now of type [`dict`](stdtypes.md#dict). Formerly, it was of
type [`collections.OrderedDict`](collections.md#collections.OrderedDict).

#### args

A tuple of positional arguments values.  Dynamically computed from the
[`arguments`](#inspect.BoundArguments.arguments) attribute.

#### kwargs

A dict of keyword arguments values.  Dynamically computed from the
[`arguments`](#inspect.BoundArguments.arguments) attribute.  Arguments that can be passed positionally
are included in [`args`](#inspect.BoundArguments.args) instead.

#### signature

A reference to the parent [`Signature`](#inspect.Signature) object.

#### apply_defaults()

Set default values for missing arguments.

For variable-positional arguments (`*args`) the default is an
empty tuple.

For variable-keyword arguments (`**kwargs`) the default is an
empty dict.

```pycon
>>> def foo(a, b='ham', *args): pass
>>> ba = inspect.signature(foo).bind('spam')
>>> ba.apply_defaults()
>>> ba.arguments
{'a': 'spam', 'b': 'ham', 'args': ()}
```

#### Versionadded
Added in version 3.5.

The [`args`](#inspect.BoundArguments.args) and [`kwargs`](#inspect.BoundArguments.kwargs) properties can be used to invoke
functions:

```python
def test(a, *, b):
    ...

sig = signature(test)
ba = sig.bind(10, b=20)
test(*ba.args, **ba.kwargs)
```

#### SEE ALSO
[**PEP 362**](https://peps.python.org/pep-0362/) - Function Signature Object.
: The detailed specification, implementation details and examples.

<a id="inspect-classes-functions"></a>

## Classes and functions

### inspect.getclasstree(classes, unique=False)

Arrange the given list of classes into a hierarchy of nested lists. Where a
nested list appears, it contains classes derived from the class whose entry
immediately precedes the list.  Each entry is a 2-tuple containing a class and a
tuple of its base classes.  If the *unique* argument is true, exactly one entry
appears in the returned structure for each class in the given list.  Otherwise,
classes using multiple inheritance and their descendants will appear multiple
times.

### inspect.getfullargspec(func)

Get the names and default values of a Python function’s parameters.  A
[named tuple](../glossary.md#term-named-tuple) is returned:

`FullArgSpec(args, varargs, varkw, defaults, kwonlyargs, kwonlydefaults,
annotations)`

*args* is a list of the positional parameter names.
*varargs* is the name of the `*` parameter or `None` if arbitrary
positional arguments are not accepted.
*varkw* is the name of the `**` parameter or `None` if arbitrary
keyword arguments are not accepted.
*defaults* is an *n*-tuple of default argument values corresponding to the
last *n* positional parameters, or `None` if there are no such defaults
defined.
*kwonlyargs* is a list of keyword-only parameter names in declaration order.
*kwonlydefaults* is a dictionary mapping parameter names from *kwonlyargs*
to the default values used if no argument is supplied.
*annotations* is a dictionary mapping parameter names to annotations.
The special key `"return"` is used to report the function return value
annotation (if any).

Note that [`signature()`](#inspect.signature) and
[Signature Object](#inspect-signature-object) provide the recommended
API for callable introspection, and support additional behaviours (like
positional-only arguments) that are sometimes encountered in extension module
APIs. This function is retained primarily for use in code that needs to
maintain compatibility with the Python 2 `inspect` module API.

#### Versionchanged
Changed in version 3.4: This function is now based on [`signature()`](#inspect.signature), but still ignores
`__wrapped__` attributes and includes the already bound first
parameter in the signature output for bound methods.

#### Versionchanged
Changed in version 3.6: This method was previously documented as deprecated in favour of
[`signature()`](#inspect.signature) in Python 3.5, but that decision has been reversed
in order to restore a clearly supported standard interface for
single-source Python 2/3 code migrating away from the legacy
`getargspec()` API.

#### Versionchanged
Changed in version 3.7: Python only explicitly guaranteed that it preserved the declaration
order of keyword-only parameters as of version 3.7, although in practice
this order had always been preserved in Python 3.

### inspect.getargvalues(frame)

Get information about arguments passed into a particular frame.  A
[named tuple](../glossary.md#term-named-tuple) `ArgInfo(args, varargs, keywords, locals)` is
returned. *args* is a list of the argument names.  *varargs* and *keywords*
are the names of the `*` and `**` arguments or `None`.  *locals* is the
locals dictionary of the given frame.

#### NOTE
This function was inadvertently marked as deprecated in Python 3.5.

### inspect.formatargvalues(args)

Format a pretty argument spec from the four values returned by
[`getargvalues()`](#inspect.getargvalues).  The format\* arguments are the corresponding optional
formatting functions that are called to turn names and values into strings.

#### NOTE
This function was inadvertently marked as deprecated in Python 3.5.

### inspect.getmro(cls)

Return a tuple of class cls’s base classes, including cls, in method resolution
order.  No class appears more than once in this tuple. Note that the method
resolution order depends on cls’s type.  Unless a very peculiar user-defined
metatype is in use, cls will be the first element of the tuple.

### inspect.getcallargs(func, , \*args, \*\*kwds)

Bind the *args* and *kwds* to the argument names of the Python function or
method *func*, as if it was called with them. For bound methods, bind also the
first argument (typically named `self`) to the associated instance. A dict
is returned, mapping the argument names (including the names of the `*` and
`**` arguments, if any) to their values from *args* and *kwds*. In case of
invoking *func* incorrectly, i.e. whenever `func(*args, **kwds)` would raise
an exception because of incompatible signature, an exception of the same type
and the same or similar message is raised. For example:

```pycon
>>> from inspect import getcallargs
>>> def f(a, b=1, *pos, **named):
...     pass
...
>>> getcallargs(f, 1, 2, 3) == {'a': 1, 'named': {}, 'b': 2, 'pos': (3,)}
True
>>> getcallargs(f, a=2, x=4) == {'a': 2, 'named': {'x': 4}, 'b': 1, 'pos': ()}
True
>>> getcallargs(f)
Traceback (most recent call last):
...
TypeError: f() missing 1 required positional argument: 'a'
```

#### Versionadded
Added in version 3.2.

#### Deprecated
Deprecated since version 3.5: Use [`Signature.bind()`](#inspect.Signature.bind) and [`Signature.bind_partial()`](#inspect.Signature.bind_partial) instead.

### inspect.getclosurevars(func)

Get the mapping of external name references in a Python function or
method *func* to their current values. A
[named tuple](../glossary.md#term-named-tuple) `ClosureVars(nonlocals, globals, builtins, unbound)`
is returned. *nonlocals* maps referenced names to lexical closure
variables, *globals* to the function’s module globals and *builtins* to
the builtins visible from the function body. *unbound* is the set of names
referenced in the function that could not be resolved at all given the
current module globals and builtins.

[`TypeError`](exceptions.md#TypeError) is raised if *func* is not a Python function or method.

#### Versionadded
Added in version 3.3.

### inspect.unwrap(func, , stop=None)

Get the object wrapped by *func*. It follows the chain of `__wrapped__`
attributes returning the last object in the chain.

*stop* is an optional callback accepting an object in the wrapper chain
as its sole argument that allows the unwrapping to be terminated early if
the callback returns a true value. If the callback never returns a true
value, the last object in the chain is returned as usual. For example,
[`signature()`](#inspect.signature) uses this to stop unwrapping if any object in the
chain has a `__signature__` attribute defined.

[`ValueError`](exceptions.md#ValueError) is raised if a cycle is encountered.

#### Versionadded
Added in version 3.4.

### inspect.get_annotations(obj, , globals=None, locals=None, eval_str=False, format=annotationlib.Format.VALUE)

Compute the annotations dict for an object.

This is an alias for [`annotationlib.get_annotations()`](annotationlib.md#annotationlib.get_annotations); see the documentation
of that function for more information.

#### Versionadded
Added in version 3.10.

#### Versionchanged
Changed in version 3.14: This function is now an alias for [`annotationlib.get_annotations()`](annotationlib.md#annotationlib.get_annotations).
Calling it as `inspect.get_annotations` will continue to work.

<a id="inspect-stack"></a>

## The interpreter stack

Some of the following functions return
[`FrameInfo`](#inspect.FrameInfo) objects. For backwards compatibility these objects allow
tuple-like operations on all attributes except `positions`. This behavior
is considered deprecated and may be removed in the future.

### *class* inspect.FrameInfo

#### frame

The [frame object](../reference/datamodel.md#frame-objects) that the record corresponds to.

#### filename

The file name associated with the code being executed by the frame this record
corresponds to.

#### lineno

The line number of the current line associated with the code being
executed by the frame this record corresponds to.

#### function

The function name that is being executed by the frame this record corresponds to.

#### code_context

A list of lines of context from the source code that’s being executed by the frame
this record corresponds to.

#### index

The index of the current line being executed in the [`code_context`](#inspect.FrameInfo.code_context) list.

#### positions

A [`dis.Positions`](dis.md#dis.Positions) object containing the start line number, end line
number, start column offset, and end column offset associated with the
instruction being executed by the frame this record corresponds to.

#### Versionchanged
Changed in version 3.5: Return a [named tuple](../glossary.md#term-named-tuple) instead of a [`tuple`](stdtypes.md#tuple).

#### Versionchanged
Changed in version 3.11: `FrameInfo` is now a class instance
(that is backwards compatible with the previous [named tuple](../glossary.md#term-named-tuple)).

### *class* inspect.Traceback

#### filename

The file name associated with the code being executed by the frame this traceback
corresponds to.

#### lineno

The line number of the current line associated with the code being
executed by the frame this traceback corresponds to.

#### function

The function name that is being executed by the frame this traceback corresponds to.

#### code_context

A list of lines of context from the source code that’s being executed by the frame
this traceback corresponds to.

#### index

The index of the current line being executed in the [`code_context`](#inspect.Traceback.code_context) list.

#### positions

A [`dis.Positions`](dis.md#dis.Positions) object containing the start line number, end
line number, start column offset, and end column offset associated with
the instruction being executed by the frame this traceback corresponds
to.

#### Versionchanged
Changed in version 3.11: `Traceback` is now a class instance
(that is backwards compatible with the previous [named tuple](../glossary.md#term-named-tuple)).

#### NOTE
Keeping references to frame objects, as found in the first element of the frame
records these functions return, can cause your program to create reference
cycles.  Once a reference cycle has been created, the lifespan of all objects
which can be accessed from the objects which form the cycle can become much
longer even if Python’s optional cycle detector is enabled.  If such cycles must
be created, it is important to ensure they are explicitly broken to avoid the
delayed destruction of objects and increased memory consumption which occurs.

Though the cycle detector will catch these, destruction of the frames (and local
variables) can be made deterministic by removing the cycle in a
[`finally`](../reference/compound_stmts.md#finally) clause.  This is also important if the cycle detector was
disabled when Python was compiled or using [`gc.disable()`](gc.md#gc.disable).  For example:

```python3
def handle_stackframe_without_leak():
    frame = inspect.currentframe()
    try:
        # do something with the frame
    finally:
        del frame
```

If you want to keep the frame around (for example to print a traceback
later), you can also break reference cycles by using the
[`frame.clear()`](../reference/datamodel.md#frame.clear) method.

The optional *context* argument supported by most of these functions specifies
the number of lines of context to return, which are centered around the current
line.

### inspect.getframeinfo(frame, context=1)

Get information about a frame or traceback object.  A [`Traceback`](#inspect.Traceback) object
is returned.

#### Versionchanged
Changed in version 3.11: A [`Traceback`](#inspect.Traceback) object is returned instead of a named tuple.

### inspect.getouterframes(frame, context=1)

Get a list of [`FrameInfo`](#inspect.FrameInfo) objects for a frame and all outer frames.
These frames represent the calls that lead to the creation of *frame*. The
first entry in the returned list represents *frame*; the last entry
represents the outermost call on *frame*’s stack.

#### Versionchanged
Changed in version 3.5: A list of [named tuples](../glossary.md#term-named-tuple)
`FrameInfo(frame, filename, lineno, function, code_context, index)`
is returned.

#### Versionchanged
Changed in version 3.11: A list of [`FrameInfo`](#inspect.FrameInfo) objects is returned.

### inspect.getinnerframes(traceback, context=1)

Get a list of [`FrameInfo`](#inspect.FrameInfo) objects for a traceback’s frame and all
inner frames.  These frames represent calls made as a consequence of *frame*.
The first entry in the list represents *traceback*; the last entry represents
where the exception was raised.

#### Versionchanged
Changed in version 3.5: A list of [named tuples](../glossary.md#term-named-tuple)
`FrameInfo(frame, filename, lineno, function, code_context, index)`
is returned.

#### Versionchanged
Changed in version 3.11: A list of [`FrameInfo`](#inspect.FrameInfo) objects is returned.

### inspect.currentframe()

Return the frame object for the caller’s stack frame.

**CPython implementation detail:** This function relies on Python stack frame support in the interpreter,
which isn’t guaranteed to exist in all implementations of Python.  If
running in an implementation without Python stack frame support this
function returns `None`.

### inspect.stack(context=1)

Return a list of [`FrameInfo`](#inspect.FrameInfo) objects for the caller’s stack.  The
first entry in the returned list represents the caller; the last entry
represents the outermost call on the stack.

#### Versionchanged
Changed in version 3.5: A list of [named tuples](../glossary.md#term-named-tuple)
`FrameInfo(frame, filename, lineno, function, code_context, index)`
is returned.

#### Versionchanged
Changed in version 3.11: A list of [`FrameInfo`](#inspect.FrameInfo) objects is returned.

### inspect.trace(context=1)

Return a list of [`FrameInfo`](#inspect.FrameInfo) objects for the stack between the current
frame and the frame in which an exception currently being handled was raised
in.  The first entry in the list represents the caller; the last entry
represents where the exception was raised.

#### Versionchanged
Changed in version 3.5: A list of [named tuples](../glossary.md#term-named-tuple)
`FrameInfo(frame, filename, lineno, function, code_context, index)`
is returned.

#### Versionchanged
Changed in version 3.11: A list of [`FrameInfo`](#inspect.FrameInfo) objects is returned.

## Fetching attributes statically

Both [`getattr()`](functions.md#getattr) and [`hasattr()`](functions.md#hasattr) can trigger code execution when
fetching or checking for the existence of attributes. Descriptors, like
properties, will be invoked and [`__getattr__()`](../reference/datamodel.md#object.__getattr__) and
[`__getattribute__()`](../reference/datamodel.md#object.__getattribute__)
may be called.

For cases where you want passive introspection, like documentation tools, this
can be inconvenient. [`getattr_static()`](#inspect.getattr_static) has the same signature as [`getattr()`](functions.md#getattr)
but avoids executing code when it fetches attributes.

### inspect.getattr_static(obj, attr, default=None)

Retrieve attributes without triggering dynamic lookup via the
descriptor protocol, [`__getattr__()`](../reference/datamodel.md#object.__getattr__)
or [`__getattribute__()`](../reference/datamodel.md#object.__getattribute__).

Note: this function may not be able to retrieve all attributes
that getattr can fetch (like dynamically created attributes)
and may find attributes that getattr can’t (like descriptors
that raise AttributeError). It can also return descriptors objects
instead of instance members.

If the instance [`__dict__`](../reference/datamodel.md#object.__dict__) is shadowed by another member (for
example a property) then this function will be unable to find instance
members.

#### Versionadded
Added in version 3.2.

[`getattr_static()`](#inspect.getattr_static) does not resolve descriptors, for example slot descriptors or
getset descriptors on objects implemented in C. The descriptor object
is returned instead of the underlying attribute.

You can handle these with code like the following. Note that
for arbitrary getset descriptors invoking these may trigger
code execution:

```python3
# example code for resolving the builtin descriptor types
class _foo:
    __slots__ = ['foo']

slot_descriptor = type(_foo.foo)
getset_descriptor = type(type(open(__file__)).name)
wrapper_descriptor = type(str.__dict__['__add__'])
descriptor_types = (slot_descriptor, getset_descriptor, wrapper_descriptor)

result = getattr_static(some_object, 'foo')
if type(result) in descriptor_types:
    try:
        result = result.__get__()
    except AttributeError:
        # descriptors can raise AttributeError to
        # indicate there is no underlying value
        # in which case the descriptor itself will
        # have to do
        pass
```

## Current State of Generators, Coroutines, and Asynchronous Generators

When implementing coroutine schedulers and for other advanced uses of
generators, it is useful to determine whether a generator is currently
executing, is waiting to start or resume or execution, or has already
terminated. [`getgeneratorstate()`](#inspect.getgeneratorstate) allows the current state of a
generator to be determined easily.

### inspect.getgeneratorstate(generator)

Get current state of a generator-iterator.

Possible states are:

* GEN_CREATED: Waiting to start execution.
* GEN_RUNNING: Currently being executed by the interpreter.
* GEN_SUSPENDED: Currently suspended at a yield expression.
* GEN_CLOSED: Execution has completed.

#### Versionadded
Added in version 3.2.

### inspect.getcoroutinestate(coroutine)

Get current state of a coroutine object.  The function is intended to be
used with coroutine objects created by [`async def`](../reference/compound_stmts.md#async-def) functions, but
will accept any coroutine-like object that has `cr_running` and
`cr_frame` attributes.

Possible states are:

* CORO_CREATED: Waiting to start execution.
* CORO_RUNNING: Currently being executed by the interpreter.
* CORO_SUSPENDED: Currently suspended at an await expression.
* CORO_CLOSED: Execution has completed.

#### Versionadded
Added in version 3.5.

### inspect.getasyncgenstate(agen)

Get current state of an asynchronous generator object.  The function is
intended to be used with asynchronous iterator objects created by
[`async def`](../reference/compound_stmts.md#async-def) functions which use the [`yield`](../reference/simple_stmts.md#yield) statement,
but will accept any asynchronous generator-like object that has
`ag_running` and `ag_frame` attributes.

Possible states are:

* AGEN_CREATED: Waiting to start execution.
* AGEN_RUNNING: Currently being executed by the interpreter.
* AGEN_SUSPENDED: Currently suspended at a yield expression.
* AGEN_CLOSED: Execution has completed.

#### Versionadded
Added in version 3.12.

The current internal state of the generator can also be queried. This is
mostly useful for testing purposes, to ensure that internal state is being
updated as expected:

### inspect.getgeneratorlocals(generator)

Get the mapping of live local variables in *generator* to their current
values.  A dictionary is returned that maps from variable names to values.
This is the equivalent of calling [`locals()`](functions.md#locals) in the body of the
generator, and all the same caveats apply.

If *generator* is a [generator](../glossary.md#term-generator) with no currently associated frame,
then an empty dictionary is returned.  [`TypeError`](exceptions.md#TypeError) is raised if
*generator* is not a Python generator object.

**CPython implementation detail:** This function relies on the generator exposing a Python stack frame
for introspection, which isn’t guaranteed to be the case in all
implementations of Python. In such cases, this function will always
return an empty dictionary.

#### Versionadded
Added in version 3.3.

### inspect.getcoroutinelocals(coroutine)

This function is analogous to [`getgeneratorlocals()`](#inspect.getgeneratorlocals), but
works for coroutine objects created by [`async def`](../reference/compound_stmts.md#async-def) functions.

#### Versionadded
Added in version 3.5.

### inspect.getasyncgenlocals(agen)

This function is analogous to [`getgeneratorlocals()`](#inspect.getgeneratorlocals), but
works for asynchronous generator objects created by [`async def`](../reference/compound_stmts.md#async-def)
functions which use the [`yield`](../reference/simple_stmts.md#yield) statement.

#### Versionadded
Added in version 3.12.

<a id="inspect-module-co-flags"></a>

## Code Objects Bit Flags

Python code objects have a [`co_flags`](../reference/datamodel.md#codeobject.co_flags) attribute,
which is a bitmap of the following flags:

### inspect.CO_OPTIMIZED

The code object is optimized, using fast locals.

### inspect.CO_NEWLOCALS

If set, a new dict will be created for the frame’s [`f_locals`](../reference/datamodel.md#frame.f_locals)
when the code object is executed.

### inspect.CO_VARARGS

The code object has a variable positional parameter (`*args`-like).

### inspect.CO_VARKEYWORDS

The code object has a variable keyword parameter (`**kwargs`-like).

### inspect.CO_NESTED

The flag is set when the code object is a nested function.

### inspect.CO_GENERATOR

The flag is set when the code object is a generator function, i.e.
a generator object is returned when the code object is executed.

### inspect.CO_COROUTINE

The flag is set when the code object is a coroutine function.
When the code object is executed it returns a coroutine object.
See [**PEP 492**](https://peps.python.org/pep-0492/) for more details.

#### Versionadded
Added in version 3.5.

### inspect.CO_ITERABLE_COROUTINE

The flag is used to transform generators into generator-based
coroutines.  Generator objects with this flag can be used in
`await` expression, and can `yield from` coroutine objects.
See [**PEP 492**](https://peps.python.org/pep-0492/) for more details.

#### Versionadded
Added in version 3.5.

### inspect.CO_ASYNC_GENERATOR

The flag is set when the code object is an asynchronous generator
function.  When the code object is executed it returns an
asynchronous generator object.  See [**PEP 525**](https://peps.python.org/pep-0525/) for more details.

#### Versionadded
Added in version 3.6.

### inspect.CO_HAS_DOCSTRING

The flag is set when there is a docstring for the code object in
the source code. If set, it will be the first item in
[`co_consts`](../reference/datamodel.md#codeobject.co_consts).

#### Versionadded
Added in version 3.14.

### inspect.CO_METHOD

The flag is set when the code object is a function defined in class
scope.

#### Versionadded
Added in version 3.14.

#### NOTE
The flags are specific to CPython, and may not be defined in other
Python implementations.  Furthermore, the flags are an implementation
detail, and can be removed or deprecated in future Python releases.
It’s recommended to use public APIs from the `inspect` module
for any introspection needs.

## Buffer flags

### *class* inspect.BufferFlags

This is an [`enum.IntFlag`](enum.md#enum.IntFlag) that represents the flags that
can be passed to the [`__buffer__()`](../reference/datamodel.md#object.__buffer__) method of objects
implementing the [buffer protocol](../c-api/buffer.md#bufferobjects).

The meaning of the flags is explained at [Buffer request types](../c-api/buffer.md#buffer-request-types).

#### SIMPLE

#### WRITABLE

#### FORMAT

#### ND

#### STRIDES

#### C_CONTIGUOUS

#### F_CONTIGUOUS

#### ANY_CONTIGUOUS

#### INDIRECT

#### CONTIG

#### CONTIG_RO

#### STRIDED

#### STRIDED_RO

#### RECORDS

#### RECORDS_RO

#### FULL

#### FULL_RO

#### READ

#### WRITE

#### Versionadded
Added in version 3.12.

<a id="inspect-module-cli"></a>

## Command-line interface

The `inspect` module also provides a basic introspection capability
from the command line.

By default, accepts the name of a module and prints the source of that
module. A class or function within the module can be printed instead by
appended a colon and the qualified name of the target object.

### --details

Print information about the specified object rather than the source code

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
