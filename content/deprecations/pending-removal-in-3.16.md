# Pending removal in Python 3.16

* The import system:
  * Setting [`__loader__`](../reference/datamodel.md#module.__loader__) on a module while
    failing to set [`__spec__.loader`](../library/importlib.md#importlib.machinery.ModuleSpec.loader)
    is deprecated. In Python 3.16, `__loader__` will cease to be set or
    taken into consideration by the import system or the standard library.
* [`array`](../library/array.md#module-array):
  * The `'u'` format code (`wchar_t`)
    has been deprecated in documentation since Python 3.3
    and at runtime since Python 3.13.
    Use the `'w'` format code ([`Py_UCS4`](../c-api/unicode.md#c.Py_UCS4))
    for Unicode characters instead.
* [`asyncio`](../library/asyncio.md#module-asyncio):
  * `asyncio.iscoroutinefunction()` is deprecated
    and will be removed in Python 3.16;
    use [`inspect.iscoroutinefunction()`](../library/inspect.md#inspect.iscoroutinefunction) instead.
    (Contributed by Jiahao Li and Kumar Aditya in [gh-122875](https://github.com/python/cpython/issues/122875).)
  * [`asyncio`](../library/asyncio.md#module-asyncio) policy system is deprecated and will be removed in Python 3.16.
    In particular, the following classes and functions are deprecated:
    * [`asyncio.AbstractEventLoopPolicy`](../library/asyncio-policy.md#asyncio.AbstractEventLoopPolicy)
    * [`asyncio.DefaultEventLoopPolicy`](../library/asyncio-policy.md#asyncio.DefaultEventLoopPolicy)
    * [`asyncio.WindowsSelectorEventLoopPolicy`](../library/asyncio-policy.md#asyncio.WindowsSelectorEventLoopPolicy)
    * [`asyncio.WindowsProactorEventLoopPolicy`](../library/asyncio-policy.md#asyncio.WindowsProactorEventLoopPolicy)
    * [`asyncio.get_event_loop_policy()`](../library/asyncio-policy.md#asyncio.get_event_loop_policy)
    * [`asyncio.set_event_loop_policy()`](../library/asyncio-policy.md#asyncio.set_event_loop_policy)

    Users should use [`asyncio.run()`](../library/asyncio-runner.md#asyncio.run) or [`asyncio.Runner`](../library/asyncio-runner.md#asyncio.Runner) with
    *loop_factory* to use the desired event loop implementation.

    For example, to use [`asyncio.SelectorEventLoop`](../library/asyncio-eventloop.md#asyncio.SelectorEventLoop) on Windows:
    ```python3
    import asyncio

    async def main():
        ...

    asyncio.run(main(), loop_factory=asyncio.SelectorEventLoop)
    ```

    (Contributed by Kumar Aditya in [gh-127949](https://github.com/python/cpython/issues/127949).)
* [`builtins`](../library/builtins.md#module-builtins):
  * Bitwise inversion on boolean types, `~True` or `~False`
    has been deprecated since Python 3.12,
    as it produces surprising and unintuitive results (`-2` and `-1`).
    Use `not x` instead for the logical negation of a Boolean.
    In the rare case that you need the bitwise inversion of
    the underlying integer, convert to `int` explicitly (`~int(x)`).
* [`functools`](../library/functools.md#module-functools):
  * Calling the Python implementation of [`functools.reduce()`](../library/functools.md#functools.reduce) with *function*
    or *sequence* as keyword arguments has been deprecated since Python 3.14.
* [`logging`](../library/logging.md#module-logging):
  * Support for custom logging handlers with the *strm* argument is deprecated
    and scheduled for removal in Python 3.16. Define handlers with the *stream*
    argument instead. (Contributed by Mariusz Felisiak in [gh-115032](https://github.com/python/cpython/issues/115032).)
* [`mimetypes`](../library/mimetypes.md#module-mimetypes):
  * Valid extensions start with a ‘.’ or are empty for
    [`mimetypes.MimeTypes.add_type()`](../library/mimetypes.md#mimetypes.MimeTypes.add_type).
    Undotted extensions are deprecated and will
    raise a [`ValueError`](../library/exceptions.md#ValueError) in Python 3.16.
    (Contributed by Hugo van Kemenade in [gh-75223](https://github.com/python/cpython/issues/75223).)
* [`shutil`](../library/shutil.md#module-shutil):
  * The `ExecError` exception
    has been deprecated since Python 3.14.
    It has not been used by any function in `shutil` since Python 3.4,
    and is now an alias of [`RuntimeError`](../library/exceptions.md#RuntimeError).
* [`symtable`](../library/symtable.md#module-symtable):
  * The [`Class.get_methods`](../library/symtable.md#symtable.Class.get_methods) method
    has been deprecated since Python 3.14.
* [`sys`](../library/sys.md#module-sys):
  * The [`_enablelegacywindowsfsencoding()`](../library/sys.md#sys._enablelegacywindowsfsencoding) function
    has been deprecated since Python 3.13.
    Use the [`PYTHONLEGACYWINDOWSFSENCODING`](../using/cmdline.md#envvar-PYTHONLEGACYWINDOWSFSENCODING) environment variable instead.
* [`sysconfig`](../library/sysconfig.md#module-sysconfig):
  * The `sysconfig.expand_makefile_vars()` function
    has been deprecated since Python 3.14.
    Use the `vars` argument of [`sysconfig.get_paths()`](../library/sysconfig.md#sysconfig.get_paths) instead.
* [`tarfile`](../library/tarfile.md#module-tarfile):
  * The undocumented and unused `TarFile.tarfile` attribute
    has been deprecated since Python 3.13.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
