# Pending removal in Python 3.15

* The import system:
  * Setting `__cached__` on a module while
    failing to set [`__spec__.cached`](../library/importlib.md#importlib.machinery.ModuleSpec.cached)
    is deprecated. In Python 3.15, `__cached__` will cease to be set or
    take into consideration by the import system or standard library. ([gh-97879](https://github.com/python/cpython/issues/97879))
  * Setting [`__package__`](../reference/datamodel.md#module.__package__) on a module while
    failing to set [`__spec__.parent`](../library/importlib.md#importlib.machinery.ModuleSpec.parent)
    is deprecated. In Python 3.15, `__package__` will cease to be set or
    take into consideration by the import system or standard library. ([gh-97879](https://github.com/python/cpython/issues/97879))
* [`ctypes`](../library/ctypes.md#module-ctypes):
  * The undocumented `ctypes.SetPointerType()` function
    has been deprecated since Python 3.13.
* [`http.server`](../library/http.server.md#module-http.server):
  * The obsolete and rarely used `CGIHTTPRequestHandler`
    has been deprecated since Python 3.13.
    No direct replacement exists.
    *Anything* is better than CGI to interface
    a web server with a request handler.
  * The `--cgi` flag to the **python -m http.server**
    command-line interface has been deprecated since Python 3.13.
* [`importlib`](../library/importlib.md#module-importlib):
  * `load_module()` method: use `exec_module()` instead.
* [`pathlib`](../library/pathlib.md#module-pathlib):
  * `.PurePath.is_reserved()`
    has been deprecated since Python 3.13.
    Use [`os.path.isreserved()`](../library/os.path.md#os.path.isreserved) to detect reserved paths on Windows.
* [`platform`](../library/platform.md#module-platform):
  * `platform.java_ver()` has been deprecated since Python 3.13.
    This function is only useful for Jython support, has a confusing API,
    and is largely untested.
* [`sysconfig`](../library/sysconfig.md#module-sysconfig):
  * The *check_home* argument of [`sysconfig.is_python_build()`](../library/sysconfig.md#sysconfig.is_python_build) has been
    deprecated since Python 3.12.
* [`threading`](../library/threading.md#module-threading):
  * [`RLock()`](../library/threading.md#threading.RLock) will take no arguments in Python 3.15.
    Passing any arguments has been deprecated since Python 3.14,
    as the Python version does not permit any arguments,
    but the C version allows any number of positional or keyword arguments,
    ignoring every argument.
* [`types`](../library/types.md#module-types):
  * [`types.CodeType`](../library/types.md#types.CodeType): Accessing [`co_lnotab`](../reference/datamodel.md#codeobject.co_lnotab) was
    deprecated in [**PEP 626**](https://peps.python.org/pep-0626/)
    since 3.10 and was planned to be removed in 3.12,
    but it only got a proper [`DeprecationWarning`](../library/exceptions.md#DeprecationWarning) in 3.12.
    May be removed in 3.15.
    (Contributed by Nikita Sobolev in [gh-101866](https://github.com/python/cpython/issues/101866).)
* [`typing`](../library/typing.md#module-typing):
  * The undocumented keyword argument syntax for creating
    [`NamedTuple`](../library/typing.md#typing.NamedTuple) classes
    (for example, `Point = NamedTuple("Point", x=int, y=int)`)
    has been deprecated since Python 3.13.
    Use the class-based syntax or the functional syntax instead.
  * When using the functional syntax of [`TypedDict`](../library/typing.md#typing.TypedDict)s, failing
    to pass a value to the *fields* parameter (`TD = TypedDict("TD")`) or
    passing `None` (`TD = TypedDict("TD", None)`) has been deprecated
    since Python 3.13.
    Use `class TD(TypedDict): pass` or `TD = TypedDict("TD", {})`
    to create a TypedDict with zero field.
  * The `typing.no_type_check_decorator()` decorator function
    has been deprecated since Python 3.13.
    After eight years in the [`typing`](../library/typing.md#module-typing) module,
    it has yet to be supported by any major type checker.
* `sre_compile`, `sre_constants` and `sre_parse` modules.
* [`wave`](../library/wave.md#module-wave):
  * The `getmark()`, `setmark()` and `getmarkers()` methods of
    the [`Wave_read`](../library/wave.md#wave.Wave_read) and [`Wave_write`](../library/wave.md#wave.Wave_write) classes
    have been deprecated since Python 3.13.
* [`zipimport`](../library/zipimport.md#module-zipimport):
  * `zipimport.zipimporter.load_module()` has been deprecated since
    Python 3.10. Use [`exec_module()`](../library/zipimport.md#zipimport.zipimporter.exec_module) instead.
    ([gh-125746](https://github.com/python/cpython/issues/125746).)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
