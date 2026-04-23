# Pending removal in Python 3.17

* [`datetime`](../library/datetime.md#module-datetime):
  * [`strptime()`](../library/datetime.md#datetime.datetime.strptime) calls using a format string containing
    `%e` (day of month) without a year.
    This has been deprecated since Python 3.15.
    (Contributed by Stan Ulbrych in [gh-70647](https://github.com/python/cpython/issues/70647).)
* [`collections.abc`](../library/collections.abc.md#module-collections.abc):
  - [`collections.abc.ByteString`](../library/collections.abc.md#collections.abc.ByteString) is scheduled for removal in Python 3.17.

    Use `isinstance(obj, collections.abc.Buffer)` to test if `obj`
    implements the [buffer protocol](../c-api/buffer.md#bufferobjects) at runtime. For use
    in type annotations, either use [`Buffer`](../library/collections.abc.md#collections.abc.Buffer) or a union
    that explicitly specifies the types your code supports (e.g.,
    `bytes | bytearray | memoryview`).

    `ByteString` was originally intended to be an abstract class that
    would serve as a supertype of both [`bytes`](../library/stdtypes.md#bytes) and [`bytearray`](../library/stdtypes.md#bytearray).
    However, since the ABC never had any methods, knowing that an object was an
    instance of `ByteString` never actually told you anything useful
    about the object. Other common buffer types such as [`memoryview`](../library/stdtypes.md#memoryview)
    were also never understood as subtypes of `ByteString` (either at
    runtime or by static type checkers).

    See [**PEP 688**](https://peps.python.org/pep-0688/#current-options) for more details.
    (Contributed by Shantanu Jain in [gh-91896](https://github.com/python/cpython/issues/91896).)
* [`encodings`](../library/codecs.md#module-encodings):
  - Passing non-ascii *encoding* names to [`encodings.normalize_encoding()`](../library/codecs.md#encodings.normalize_encoding)
    is deprecated and scheduled for removal in Python 3.17.
    (Contributed by Stan Ulbrych in [gh-136702](https://github.com/python/cpython/issues/136702).)
* [`typing`](../library/typing.md#module-typing):
  - Before Python 3.14, old-style unions were implemented using the private class
    `typing._UnionGenericAlias`. This class is no longer needed for the implementation,
    but it has been retained for backward compatibility, with removal scheduled for Python
    3.17. Users should use documented introspection helpers like [`typing.get_origin()`](../library/typing.md#typing.get_origin)
    and [`typing.get_args()`](../library/typing.md#typing.get_args) instead of relying on private implementation details.
  - [`typing.ByteString`](../library/typing.md#typing.ByteString), deprecated since Python 3.9, is scheduled for removal in
    Python 3.17.

    Use `isinstance(obj, collections.abc.Buffer)` to test if `obj`
    implements the [buffer protocol](../c-api/buffer.md#bufferobjects) at runtime. For use
    in type annotations, either use [`Buffer`](../library/collections.abc.md#collections.abc.Buffer) or a union
    that explicitly specifies the types your code supports (e.g.,
    `bytes | bytearray | memoryview`).

    `ByteString` was originally intended to be an abstract class that
    would serve as a supertype of both [`bytes`](../library/stdtypes.md#bytes) and [`bytearray`](../library/stdtypes.md#bytearray).
    However, since the ABC never had any methods, knowing that an object was an
    instance of `ByteString` never actually told you anything useful
    about the object. Other common buffer types such as [`memoryview`](../library/stdtypes.md#memoryview)
    were also never understood as subtypes of `ByteString` (either at
    runtime or by static type checkers).

    See [**PEP 688**](https://peps.python.org/pep-0688/#current-options) for more details.
    (Contributed by Shantanu Jain in [gh-91896](https://github.com/python/cpython/issues/91896).)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
