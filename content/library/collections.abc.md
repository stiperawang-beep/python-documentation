# `collections.abc` — Abstract Base Classes for Containers

#### Versionadded
Added in version 3.3: Formerly, this module was part of the [`collections`](collections.md#module-collections) module.

**Source code:** [Lib/_collections_abc.py](https://github.com/python/cpython/tree/main/Lib/_collections_abc.py)

<!-- from collections.abc import *
import itertools
__name__ = '<doctest>' -->

---

This module provides [abstract base classes](../glossary.md#term-abstract-base-class) that
can be used to test whether a class provides a particular interface; for
example, whether it is [hashable](../glossary.md#term-hashable) or whether it is a [mapping](../glossary.md#term-mapping).

An [`issubclass()`](functions.md#issubclass) or [`isinstance()`](functions.md#isinstance) test for an interface works in one
of three ways.

1. A newly written class can inherit directly from one of the
   abstract base classes.  The class must supply the required abstract
   methods.  The remaining mixin methods come from inheritance and can be
   overridden if desired.  Other methods may be added as needed:
   ```python
   class C(Sequence):                      # Direct inheritance
       def __init__(self): ...             # Extra method not required by the ABC
       def __getitem__(self, index):  ...  # Required abstract method
       def __len__(self):  ...             # Required abstract method
       def count(self, value): ...         # Optionally override a mixin method
   ```

   ```pycon
   >>> issubclass(C, Sequence)
   True
   >>> isinstance(C(), Sequence)
   True
   ```
2. Existing classes and built-in classes can be registered as “virtual
   subclasses” of the ABCs.  Those classes should define the full API
   including all of the abstract methods and all of the mixin methods.
   This lets users rely on [`issubclass()`](functions.md#issubclass) or [`isinstance()`](functions.md#isinstance) tests
   to determine whether the full interface is supported.  The exception to
   this rule is for methods that are automatically inferred from the rest
   of the API:
   ```python
   class D:                                 # No inheritance
       def __init__(self): ...              # Extra method not required by the ABC
       def __getitem__(self, index):  ...   # Abstract method
       def __len__(self):  ...              # Abstract method
       def count(self, value): ...          # Mixin method
       def index(self, value): ...          # Mixin method

   Sequence.register(D)                     # Register instead of inherit
   ```

   ```pycon
   >>> issubclass(D, Sequence)
   True
   >>> isinstance(D(), Sequence)
   True
   ```

   In this example, class `D` does not need to define
   `__contains__`, `__iter__`, and `__reversed__` because the
   [in-operator](../reference/expressions.md#comparisons), the [iteration](../glossary.md#term-iterable)
   logic, and the [`reversed()`](functions.md#reversed) function automatically fall back to
   using `__getitem__` and `__len__`.
3. Some simple interfaces are directly recognizable by the presence of
   the required methods (unless those methods have been set to [`None`](constants.md#None)):
   ```python
   class E:
       def __iter__(self): ...
       def __next__(self): ...
   ```

   ```pycon
   >>> issubclass(E, Iterable)
   True
   >>> isinstance(E(), Iterable)
   True
   ```

   Complex interfaces do not support this last technique because an
   interface is more than just the presence of method names.  Interfaces
   specify semantics and relationships between methods that cannot be
   inferred solely from the presence of specific method names.  For
   example, knowing that a class supplies `__getitem__`, `__len__`, and
   `__iter__` is insufficient for distinguishing a [`Sequence`](#collections.abc.Sequence) from
   a [`Mapping`](#collections.abc.Mapping).

#### Versionadded
Added in version 3.9: These abstract classes now support `[]`. See [Generic Alias Type](stdtypes.md#types-genericalias)
and [**PEP 585**](https://peps.python.org/pep-0585/).

<a id="collections-abstract-base-classes"></a>

## Collections Abstract Base Classes

The collections module offers the following [ABCs](../glossary.md#term-abstract-base-class):

| ABC                                                                                 | Inherits from                                                                                                                 | Abstract Methods                                                                   | Mixin Methods                                                                                                                                              |
|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`Container`](#collections.abc.Container) <sup>[1](#id18)</sup>                     |                                                                                                                               | `__contains__`                                                                     |                                                                                                                                                            |
| [`Hashable`](#collections.abc.Hashable) <sup>[1](#id18)</sup>                       |                                                                                                                               | `__hash__`                                                                         |                                                                                                                                                            |
| [`Iterable`](#collections.abc.Iterable) <sup>[1](#id18)</sup> <sup>[2](#id19)</sup> |                                                                                                                               | `__iter__`                                                                         |                                                                                                                                                            |
| [`Iterator`](#collections.abc.Iterator) <sup>[1](#id18)</sup>                       | [`Iterable`](#collections.abc.Iterable)                                                                                       | `__next__`                                                                         | `__iter__`                                                                                                                                                 |
| [`Reversible`](#collections.abc.Reversible) <sup>[1](#id18)</sup>                   | [`Iterable`](#collections.abc.Iterable)                                                                                       | `__reversed__`                                                                     |                                                                                                                                                            |
| [`Generator`](#collections.abc.Generator)  <sup>[1](#id18)</sup>                    | [`Iterator`](#collections.abc.Iterator)                                                                                       | `send`, `throw`                                                                    | `close`, `__iter__`, `__next__`                                                                                                                            |
| [`Sized`](#collections.abc.Sized)  <sup>[1](#id18)</sup>                            |                                                                                                                               | `__len__`                                                                          |                                                                                                                                                            |
| [`Callable`](#collections.abc.Callable)  <sup>[1](#id18)</sup>                      |                                                                                                                               | `__call__`                                                                         |                                                                                                                                                            |
| [`Collection`](#collections.abc.Collection)  <sup>[1](#id18)</sup>                  | [`Sized`](#collections.abc.Sized),<br/>[`Iterable`](#collections.abc.Iterable),<br/>[`Container`](#collections.abc.Container) | `__contains__`,<br/>`__iter__`,<br/>`__len__`                                      |                                                                                                                                                            |
| [`Sequence`](#collections.abc.Sequence)                                             | [`Reversible`](#collections.abc.Reversible),<br/>[`Collection`](#collections.abc.Collection)                                  | `__getitem__`,<br/>`__len__`                                                       | `__contains__`, `__iter__`, `__reversed__`,<br/>`index`, and `count`                                                                                       |
| [`MutableSequence`](#collections.abc.MutableSequence)                               | [`Sequence`](#collections.abc.Sequence)                                                                                       | `__getitem__`,<br/>`__setitem__`,<br/>`__delitem__`,<br/>`__len__`,<br/>`insert`   | Inherited [`Sequence`](#collections.abc.Sequence) methods and<br/>`append`, `clear`, `reverse`, `extend`,<br/>`pop`, `remove`, and `__iadd__`              |
| [`ByteString`](#collections.abc.ByteString)                                         | [`Sequence`](#collections.abc.Sequence)                                                                                       | `__getitem__`,<br/>`__len__`                                                       | Inherited [`Sequence`](#collections.abc.Sequence) methods                                                                                                  |
| [`Set`](#collections.abc.Set)                                                       | [`Collection`](#collections.abc.Collection)                                                                                   | `__contains__`,<br/>`__iter__`,<br/>`__len__`                                      | `__le__`, `__lt__`, `__eq__`, `__ne__`,<br/>`__gt__`, `__ge__`, `__and__`, `__or__`,<br/>`__sub__`, `__rsub__`, `__xor__`, `__rxor__`<br/>and `isdisjoint` |
| [`MutableSet`](#collections.abc.MutableSet)                                         | [`Set`](#collections.abc.Set)                                                                                                 | `__contains__`,<br/>`__iter__`,<br/>`__len__`,<br/>`add`,<br/>`discard`            | Inherited [`Set`](#collections.abc.Set) methods and<br/>`clear`, `pop`, `remove`, `__ior__`,<br/>`__iand__`, `__ixor__`, and `__isub__`                    |
| [`Mapping`](#collections.abc.Mapping)                                               | [`Collection`](#collections.abc.Collection)                                                                                   | `__getitem__`,<br/>`__iter__`,<br/>`__len__`                                       | `__contains__`, `keys`, `items`, `values`,<br/>`get`, `__eq__`, and `__ne__`                                                                               |
| [`MutableMapping`](#collections.abc.MutableMapping)                                 | [`Mapping`](#collections.abc.Mapping)                                                                                         | `__getitem__`,<br/>`__setitem__`,<br/>`__delitem__`,<br/>`__iter__`,<br/>`__len__` | Inherited [`Mapping`](#collections.abc.Mapping) methods and<br/>`pop`, `popitem`, `clear`, `update`,<br/>and `setdefault`                                  |
| [`MappingView`](#collections.abc.MappingView)                                       | [`Sized`](#collections.abc.Sized)                                                                                             |                                                                                    | `__init__`, `__len__` and `__repr__`                                                                                                                       |
| [`ItemsView`](#collections.abc.ItemsView)                                           | [`MappingView`](#collections.abc.MappingView),<br/>[`Set`](#collections.abc.Set)                                              |                                                                                    | `__contains__`,<br/>`__iter__`                                                                                                                             |
| [`KeysView`](#collections.abc.KeysView)                                             | [`MappingView`](#collections.abc.MappingView),<br/>[`Set`](#collections.abc.Set)                                              |                                                                                    | `__contains__`,<br/>`__iter__`                                                                                                                             |
| [`ValuesView`](#collections.abc.ValuesView)                                         | [`MappingView`](#collections.abc.MappingView),<br/>[`Collection`](#collections.abc.Collection)                                |                                                                                    | `__contains__`, `__iter__`                                                                                                                                 |
| [`Awaitable`](#collections.abc.Awaitable) <sup>[1](#id18)</sup>                     |                                                                                                                               | `__await__`                                                                        |                                                                                                                                                            |
| [`Coroutine`](#collections.abc.Coroutine) <sup>[1](#id18)</sup>                     | [`Awaitable`](#collections.abc.Awaitable)                                                                                     | `send`, `throw`                                                                    | `close`                                                                                                                                                    |
| [`AsyncIterable`](#collections.abc.AsyncIterable) <sup>[1](#id18)</sup>             |                                                                                                                               | `__aiter__`                                                                        |                                                                                                                                                            |
| [`AsyncIterator`](#collections.abc.AsyncIterator) <sup>[1](#id18)</sup>             | [`AsyncIterable`](#collections.abc.AsyncIterable)                                                                             | `__anext__`                                                                        | `__aiter__`                                                                                                                                                |
| [`AsyncGenerator`](#collections.abc.AsyncGenerator) <sup>[1](#id18)</sup>           | [`AsyncIterator`](#collections.abc.AsyncIterator)                                                                             | `asend`, `athrow`                                                                  | `aclose`, `__aiter__`, `__anext__`                                                                                                                         |
| [`Buffer`](#collections.abc.Buffer) <sup>[1](#id18)</sup>                           |                                                                                                                               | `__buffer__`                                                                       |                                                                                                                                                            |

### Footnotes

* <a id='id18'>**[1]**</a> These ABCs override [`__subclasshook__()`](abc.md#abc.ABCMeta.__subclasshook__) to support testing an interface by verifying the required methods are present and have not been set to [`None`](constants.md#None).  This only works for simple interfaces.  More complex interfaces require registration or direct subclassing.
* <a id='id19'>**[2]**</a> Checking `isinstance(obj, Iterable)` detects classes that are registered as [`Iterable`](#collections.abc.Iterable) or that have an [`__iter__()`](stdtypes.md#container.__iter__) method, but it does not detect classes that iterate with the [`__getitem__()`](../reference/datamodel.md#object.__getitem__) method.  The only reliable way to determine whether an object is [iterable](../glossary.md#term-iterable) is to call `iter(obj)`.

## Collections Abstract Base Classes – Detailed Descriptions

### *class* collections.abc.Container

ABC for classes that provide the [`__contains__()`](../reference/datamodel.md#object.__contains__) method.

### *class* collections.abc.Hashable

ABC for classes that provide the [`__hash__()`](../reference/datamodel.md#object.__hash__) method.

### *class* collections.abc.Sized

ABC for classes that provide the [`__len__()`](../reference/datamodel.md#object.__len__) method.

### *class* collections.abc.Callable

ABC for classes that provide the [`__call__()`](../reference/datamodel.md#object.__call__) method.

See [Annotating callable objects](typing.md#annotating-callables) for details on how to use
`Callable` in type annotations.

### *class* collections.abc.Iterable

ABC for classes that provide the [`__iter__()`](stdtypes.md#container.__iter__) method.

Checking `isinstance(obj, Iterable)` detects classes that are registered
as [`Iterable`](#collections.abc.Iterable) or that have an [`__iter__()`](stdtypes.md#container.__iter__) method,
but it does
not detect classes that iterate with the [`__getitem__()`](../reference/datamodel.md#object.__getitem__) method.
The only reliable way to determine whether an object is [iterable](../glossary.md#term-iterable)
is to call `iter(obj)`.

### *class* collections.abc.Collection

ABC for sized iterable container classes.

#### Versionadded
Added in version 3.6.

### *class* collections.abc.Iterator

ABC for classes that provide the [`__iter__()`](stdtypes.md#iterator.__iter__) and
[`__next__()`](stdtypes.md#iterator.__next__) methods.  See also the definition of
[iterator](../glossary.md#term-iterator).

### *class* collections.abc.Reversible

ABC for iterable classes that also provide the [`__reversed__()`](../reference/datamodel.md#object.__reversed__)
method.

#### Versionadded
Added in version 3.6.

### *class* collections.abc.Generator

ABC for [generator](../glossary.md#term-generator) classes that implement the protocol defined in
[**PEP 342**](https://peps.python.org/pep-0342/) that extends [iterators](../glossary.md#term-iterator) with the
[`send()`](../reference/expressions.md#generator.send),
[`throw()`](../reference/expressions.md#generator.throw) and [`close()`](../reference/expressions.md#generator.close) methods.

See [Annotating generators and coroutines](typing.md#annotating-generators-and-coroutines)
for details on using `Generator` in type annotations.

#### Versionadded
Added in version 3.5.

### *class* collections.abc.Sequence

### *class* collections.abc.MutableSequence

### *class* collections.abc.ByteString

ABCs for read-only and mutable [sequences](../glossary.md#term-sequence).

Implementation note: Some of the mixin methods, such as
[`__iter__()`](stdtypes.md#container.__iter__), [`__reversed__()`](../reference/datamodel.md#object.__reversed__),
and [`index()`](stdtypes.md#sequence.index) make repeated calls to the underlying
[`__getitem__()`](../reference/datamodel.md#object.__getitem__) method.
Consequently, if [`__getitem__()`](../reference/datamodel.md#object.__getitem__) is implemented with constant
access speed, the mixin methods will have linear performance;
however, if the underlying method is linear (as it would be with a
linked list), the mixins will have quadratic performance and will
likely need to be overridden.

#### index(value, start=0, stop=None)

Return first index of *value*.

Raises [`ValueError`](exceptions.md#ValueError) if the value is not present.

Supporting the *start* and *stop* arguments is optional, but recommended.

#### Versionchanged
Changed in version 3.5: The [`index()`](stdtypes.md#sequence.index) method gained support for
the *stop* and *start* arguments.

#### Deprecated-removed
Deprecated since version 3.12, will be removed in version 3.17: The [`ByteString`](#collections.abc.ByteString) ABC has been deprecated.

Use `isinstance(obj, collections.abc.Buffer)` to test if `obj`
implements the [buffer protocol](../c-api/buffer.md#bufferobjects) at runtime. For use
in type annotations, either use [`Buffer`](#collections.abc.Buffer) or a union that
explicitly specifies the types your code supports (e.g.,
`bytes | bytearray | memoryview`).

`ByteString` was originally intended to be an abstract class that
would serve as a supertype of both [`bytes`](stdtypes.md#bytes) and [`bytearray`](stdtypes.md#bytearray).
However, since the ABC never had any methods, knowing that an object was
an instance of `ByteString` never actually told you anything
useful about the object. Other common buffer types such as
[`memoryview`](stdtypes.md#memoryview) were also never understood as subtypes of
`ByteString` (either at runtime or by static type checkers).

See [**PEP 688**](https://peps.python.org/pep-0688/#current-options) for more details.

### *class* collections.abc.Set

### *class* collections.abc.MutableSet

ABCs for read-only and mutable [sets](stdtypes.md#types-set).

### *class* collections.abc.Mapping

### *class* collections.abc.MutableMapping

ABCs for read-only and mutable [mappings](../glossary.md#term-mapping).

### *class* collections.abc.MappingView

### *class* collections.abc.ItemsView

### *class* collections.abc.KeysView

### *class* collections.abc.ValuesView

ABCs for mapping, items, keys, and values [views](../glossary.md#term-dictionary-view).

### *class* collections.abc.Awaitable

ABC for [awaitable](../glossary.md#term-awaitable) objects, which can be used in [`await`](../reference/expressions.md#await)
expressions.  Custom implementations must provide the
[`__await__()`](../reference/datamodel.md#object.__await__) method.

[Coroutine](../glossary.md#term-coroutine) objects and instances of the
[`Coroutine`](#collections.abc.Coroutine) ABC are all instances of this ABC.

#### NOTE
In CPython, generator-based coroutines ([generators](../glossary.md#term-generator)
decorated with [`@types.coroutine`](types.md#types.coroutine)) are
*awaitables*, even though they do not have an [`__await__()`](../reference/datamodel.md#object.__await__) method.
Using `isinstance(gencoro, Awaitable)` for them will return `False`.
Use [`inspect.isawaitable()`](inspect.md#inspect.isawaitable) to detect them.

#### Versionadded
Added in version 3.5.

### *class* collections.abc.Coroutine

ABC for [coroutine](../glossary.md#term-coroutine) compatible classes.  These implement the
following methods, defined in [Coroutine Objects](../reference/datamodel.md#coroutine-objects):
[`send()`](../reference/datamodel.md#coroutine.send), [`throw()`](../reference/datamodel.md#coroutine.throw), and
[`close()`](../reference/datamodel.md#coroutine.close).  Custom implementations must also implement
[`__await__()`](../reference/datamodel.md#object.__await__).  All [`Coroutine`](#collections.abc.Coroutine) instances are also
instances of [`Awaitable`](#collections.abc.Awaitable).

#### NOTE
In CPython, generator-based coroutines ([generators](../glossary.md#term-generator)
decorated with [`@types.coroutine`](types.md#types.coroutine)) are
*awaitables*, even though they do not have an [`__await__()`](../reference/datamodel.md#object.__await__) method.
Using `isinstance(gencoro, Coroutine)` for them will return `False`.
Use [`inspect.isawaitable()`](inspect.md#inspect.isawaitable) to detect them.

See [Annotating generators and coroutines](typing.md#annotating-generators-and-coroutines)
for details on using `Coroutine` in type annotations.
The variance and order of type parameters correspond to those of
[`Generator`](#collections.abc.Generator).

#### Versionadded
Added in version 3.5.

### *class* collections.abc.AsyncIterable

ABC for classes that provide an `__aiter__` method.  See also the
definition of [asynchronous iterable](../glossary.md#term-asynchronous-iterable).

#### Versionadded
Added in version 3.5.

### *class* collections.abc.AsyncIterator

ABC for classes that provide `__aiter__` and `__anext__`
methods.  See also the definition of [asynchronous iterator](../glossary.md#term-asynchronous-iterator).

#### Versionadded
Added in version 3.5.

### *class* collections.abc.AsyncGenerator

ABC for [asynchronous generator](../glossary.md#term-asynchronous-generator) classes that implement the protocol
defined in [**PEP 525**](https://peps.python.org/pep-0525/) and [**PEP 492**](https://peps.python.org/pep-0492/).

See [Annotating generators and coroutines](typing.md#annotating-generators-and-coroutines)
for details on using `AsyncGenerator` in type annotations.

#### Versionadded
Added in version 3.6.

### *class* collections.abc.Buffer

ABC for classes that provide the [`__buffer__()`](../reference/datamodel.md#object.__buffer__) method,
implementing the [buffer protocol](../c-api/buffer.md#bufferobjects). See [**PEP 688**](https://peps.python.org/pep-0688/).

#### Versionadded
Added in version 3.12.

## Examples and Recipes

ABCs allow us to ask classes or instances if they provide
particular functionality, for example:

```python3
size = None
if isinstance(myvar, collections.abc.Sized):
    size = len(myvar)
```

Several of the ABCs are also useful as mixins that make it easier to develop
classes supporting container APIs.  For example, to write a class supporting
the full [`Set`](#collections.abc.Set) API, it is only necessary to supply the three underlying
abstract methods: [`__contains__()`](../reference/datamodel.md#object.__contains__), [`__iter__()`](stdtypes.md#container.__iter__), and
[`__len__()`](../reference/datamodel.md#object.__len__). The ABC supplies the remaining methods such as
`__and__()` and [`isdisjoint()`](stdtypes.md#frozenset.isdisjoint):

```python3
class ListBasedSet(collections.abc.Set):
    ''' Alternate set implementation favoring space over speed
        and not requiring the set elements to be hashable. '''
    def __init__(self, iterable):
        self.elements = lst = []
        for value in iterable:
            if value not in lst:
                lst.append(value)

    def __iter__(self):
        return iter(self.elements)

    def __contains__(self, value):
        return value in self.elements

    def __len__(self):
        return len(self.elements)

s1 = ListBasedSet('abcdef')
s2 = ListBasedSet('defghi')
overlap = s1 & s2            # The __and__() method is supported automatically
```

Notes on using [`Set`](#collections.abc.Set) and [`MutableSet`](#collections.abc.MutableSet) as a mixin:

1. Since some set operations create new sets, the default mixin methods need
   a way to create new instances from an [iterable](../glossary.md#term-iterable). The class constructor is
   assumed to have a signature in the form `ClassName(iterable)`.
   That assumption is factored-out to an internal [`classmethod`](functions.md#classmethod) called
   `_from_iterable()` which calls `cls(iterable)` to produce a new set.
   If the [`Set`](#collections.abc.Set) mixin is being used in a class with a different
   constructor signature, you will need to override `_from_iterable()`
   with a classmethod or regular method that can construct new instances from
   an iterable argument.
2. To override the comparisons (presumably for speed, as the
   semantics are fixed), redefine [`__le__()`](../reference/datamodel.md#object.__le__) and
   [`__ge__()`](../reference/datamodel.md#object.__ge__),
   then the other operations will automatically follow suit.
3. The [`Set`](#collections.abc.Set) mixin provides a `_hash()` method to compute a hash value
   for the set; however, [`__hash__()`](../reference/datamodel.md#object.__hash__) is not defined because not all sets
   are [hashable](../glossary.md#term-hashable) or immutable.  To add set hashability using mixins,
   inherit from both [`Set()`](#collections.abc.Set) and [`Hashable()`](#collections.abc.Hashable), then define
   `__hash__ = Set._hash`.

#### SEE ALSO
* [OrderedSet recipe](https://code.activestate.com/recipes/576694/) for an
  example built on [`MutableSet`](#collections.abc.MutableSet).
* For more about ABCs, see the [`abc`](abc.md#module-abc) module and [**PEP 3119**](https://peps.python.org/pep-3119/).

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
