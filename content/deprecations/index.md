# Deprecations

## Pending removal in Python 3.15

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

## Pending removal in Python 3.16

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

## Pending removal in Python 3.17

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

## Pending removal in Python 3.18

* No longer accept a boolean value when a file descriptor is expected.
  (Contributed by Serhiy Storchaka in [gh-82626](https://github.com/python/cpython/issues/82626).)
* [`decimal`](../library/decimal.md#module-decimal):
  * The non-standard and undocumented [`Decimal`](../library/decimal.md#decimal.Decimal) format
    specifier `'N'`, which is only supported in the `decimal` module’s
    C implementation, has been deprecated since Python 3.13.
    (Contributed by Serhiy Storchaka in [gh-89902](https://github.com/python/cpython/issues/89902).)

## Pending removal in Python 3.19

* [`ctypes`](../library/ctypes.md#module-ctypes):
  * Implicitly switching to the MSVC-compatible struct layout by setting
    [`_pack_`](../library/ctypes.md#ctypes.Structure._pack_) but not [`_layout_`](../library/ctypes.md#ctypes.Structure._layout_)
    on non-Windows platforms.
* [`hashlib`](../library/hashlib.md#module-hashlib):
  - In hash function constructors such as [`new()`](../library/hashlib.md#hashlib.new) or the
    direct hash-named constructors such as [`md5()`](../library/hashlib.md#hashlib.md5) and
    [`sha256()`](../library/hashlib.md#hashlib.sha256), their optional initial data parameter could
    also be passed a keyword argument named `data=` or `string=` in
    various `hashlib` implementations.

    Support for the `string` keyword argument name is now deprecated
    and slated for removal in Python 3.19.

    Before Python 3.13, the `string` keyword parameter was not correctly
    supported depending on the backend implementation of hash functions.
    Prefer passing the initial data as a positional argument for maximum
    backwards compatibility.

## Pending removal in Python 3.20

* Calling the `__new__()` method of [`struct.Struct`](../library/struct.md#struct.Struct) without the
  *format* argument is deprecated and will be removed in Python 3.20.  Calling
  [`__init__()`](../reference/datamodel.md#object.__init__) method on initialized [`Struct`](../library/struct.md#struct.Struct)
  objects is deprecated and will be removed in Python 3.20.

  (Contributed by Sergey B Kirpichev and Serhiy Storchaka in [gh-143715](https://github.com/python/cpython/issues/143715).)
* The `__version__`, `version` and `VERSION` attributes have been
  deprecated in these standard library modules and will be removed in
  Python 3.20. Use [`sys.version_info`](../library/sys.md#sys.version_info) instead.
  - [`argparse`](../library/argparse.md#module-argparse)
  - [`csv`](../library/csv.md#module-csv)
  - [`ctypes`](../library/ctypes.md#module-ctypes)
  - `ctypes.macholib`
  - [`decimal`](../library/decimal.md#module-decimal) (use [`decimal.SPEC_VERSION`](../library/decimal.md#decimal.SPEC_VERSION) instead)
  - [`http.server`](../library/http.server.md#module-http.server)
  - [`imaplib`](../library/imaplib.md#module-imaplib)
  - [`ipaddress`](../library/ipaddress.md#module-ipaddress)
  - [`json`](../library/json.md#module-json)
  - [`logging`](../library/logging.md#module-logging) (`__date__` also deprecated)
  - [`optparse`](../library/optparse.md#module-optparse)
  - [`pickle`](../library/pickle.md#module-pickle)
  - [`platform`](../library/platform.md#module-platform)
  - [`re`](../library/re.md#module-re)
  - [`socketserver`](../library/socketserver.md#module-socketserver)
  - [`tabnanny`](../library/tabnanny.md#module-tabnanny)
  - [`tarfile`](../library/tarfile.md#module-tarfile)
  - [`tkinter.font`](../library/tkinter.font.md#module-tkinter.font)
  - [`tkinter.ttk`](../library/tkinter.ttk.md#module-tkinter.ttk)
  - [`wsgiref.simple_server`](../library/wsgiref.md#module-wsgiref.simple_server)
  - [`xml.etree.ElementTree`](../library/xml.etree.elementtree.md#module-xml.etree.ElementTree)
  - `xml.sax.expatreader`
  - [`xml.sax.handler`](../library/xml.sax.handler.md#module-xml.sax.handler)
  - [`zlib`](../library/zlib.md#module-zlib)

  (Contributed by Hugo van Kemenade and Stan Ulbrych in [gh-76007](https://github.com/python/cpython/issues/76007).)

## Pending removal in future versions

The following APIs will be removed in the future,
although there is currently no date scheduled for their removal.

* [`argparse`](../library/argparse.md#module-argparse):
  * Nesting argument groups and nesting mutually exclusive
    groups are deprecated.
  * Passing the undocumented keyword argument *prefix_chars* to
    [`add_argument_group()`](../library/argparse.md#argparse.ArgumentParser.add_argument_group) is now
    deprecated.
  * The [`argparse.FileType`](../library/argparse.md#argparse.FileType) type converter is deprecated.
* [`builtins`](../library/builtins.md#module-builtins):
  * Generators: `throw(type, exc, tb)` and `athrow(type, exc, tb)`
    signature is deprecated: use `throw(exc)` and `athrow(exc)` instead,
    the single argument signature.
  * Currently Python accepts numeric literals immediately followed by keywords,
    for example `0in x`, `1or x`, `0if 1else 2`.  It allows confusing and
    ambiguous expressions like `[0x1for x in y]` (which can be interpreted as
    `[0x1 for x in y]` or `[0x1f or x in y]`).  A syntax warning is raised
    if the numeric literal is immediately followed by one of keywords
    [`and`](../reference/expressions.md#and), [`else`](../reference/compound_stmts.md#else), [`for`](../reference/compound_stmts.md#for), [`if`](../reference/compound_stmts.md#if),
    [`in`](../reference/expressions.md#in), [`is`](../reference/expressions.md#is) and [`or`](../reference/expressions.md#or).  In a future release it
    will be changed to a syntax error. ([gh-87999](https://github.com/python/cpython/issues/87999))
  * Support for `__index__()` and `__int__()` method returning non-int type:
    these methods will be required to return an instance of a strict subclass of
    [`int`](../library/functions.md#int).
  * Support for `__float__()` method returning a strict subclass of
    [`float`](../library/functions.md#float): these methods will be required to return an instance of
    [`float`](../library/functions.md#float).
  * Support for `__complex__()` method returning a strict subclass of
    [`complex`](../library/functions.md#complex): these methods will be required to return an instance of
    [`complex`](../library/functions.md#complex).
  * Passing a complex number as the *real* or *imag* argument in the
    [`complex()`](../library/functions.md#complex) constructor is now deprecated; it should only be passed
    as a single positional argument.
    (Contributed by Serhiy Storchaka in [gh-109218](https://github.com/python/cpython/issues/109218).)
* [`calendar`](../library/calendar.md#module-calendar): `calendar.January` and `calendar.February` constants are
  deprecated and replaced by [`calendar.JANUARY`](../library/calendar.md#calendar.JANUARY) and
  [`calendar.FEBRUARY`](../library/calendar.md#calendar.FEBRUARY).
  (Contributed by Prince Roshan in [gh-103636](https://github.com/python/cpython/issues/103636).)
* [`codecs`](../library/codecs.md#module-codecs): use [`open()`](../library/functions.md#open) instead of [`codecs.open()`](../library/codecs.md#codecs.open). ([gh-133038](https://github.com/python/cpython/issues/133038))
* [`codeobject.co_lnotab`](../reference/datamodel.md#codeobject.co_lnotab): use the [`codeobject.co_lines()`](../reference/datamodel.md#codeobject.co_lines) method
  instead.
* [`datetime`](../library/datetime.md#module-datetime):
  * [`utcnow()`](../library/datetime.md#datetime.datetime.utcnow):
    use `datetime.datetime.now(tz=datetime.UTC)`.
  * [`utcfromtimestamp()`](../library/datetime.md#datetime.datetime.utcfromtimestamp):
    use `datetime.datetime.fromtimestamp(timestamp, tz=datetime.UTC)`.
* [`gettext`](../library/gettext.md#module-gettext): Plural value must be an integer.
* [`importlib`](../library/importlib.md#module-importlib):
  * [`cache_from_source()`](../library/importlib.md#importlib.util.cache_from_source) *debug_override* parameter is
    deprecated: use the *optimization* parameter instead.
* [`importlib.metadata`](../library/importlib.metadata.md#module-importlib.metadata):
  * `EntryPoints` tuple interface.
  * Implicit `None` on return values.
* [`logging`](../library/logging.md#module-logging): the `warn()` method has been deprecated
  since Python 3.3, use [`warning()`](../library/logging.md#logging.warning) instead.
* [`mailbox`](../library/mailbox.md#module-mailbox): Use of StringIO input and text mode is deprecated, use
  BytesIO and binary mode instead.
* [`os`](../library/os.md#module-os): Calling [`os.register_at_fork()`](../library/os.md#os.register_at_fork) in a multi-threaded process.
* [`os.path`](../library/os.path.md#module-os.path): [`os.path.commonprefix()`](../library/os.path.md#os.path.commonprefix) is deprecated, use
  [`os.path.commonpath()`](../library/os.path.md#os.path.commonpath) for path prefixes. The [`os.path.commonprefix()`](../library/os.path.md#os.path.commonprefix)
  function is being deprecated due to having a misleading name and module.
  The function is not safe to use for path prefixes despite being included in a
  module about path manipulation, meaning it is easy to accidentally
  introduce path traversal vulnerabilities into Python programs by using this
  function.
* `pydoc.ErrorDuringImport`: A tuple value for *exc_info* parameter is
  deprecated, use an exception instance.
* [`re`](../library/re.md#module-re): More strict rules are now applied for numerical group references
  and group names in regular expressions.  Only sequence of ASCII digits is now
  accepted as a numerical reference.  The group name in bytes patterns and
  replacement strings can now only contain ASCII letters and digits and
  underscore.
  (Contributed by Serhiy Storchaka in [gh-91760](https://github.com/python/cpython/issues/91760).)
* [`shutil`](../library/shutil.md#module-shutil): [`rmtree()`](../library/shutil.md#shutil.rmtree)’s *onerror* parameter is deprecated in
  Python 3.12; use the *onexc* parameter instead.
* [`ssl`](../library/ssl.md#module-ssl) options and protocols:
  * [`ssl.SSLContext`](../library/ssl.md#ssl.SSLContext) without protocol argument is deprecated.
  * [`ssl.SSLContext`](../library/ssl.md#ssl.SSLContext): [`set_npn_protocols()`](../library/ssl.md#ssl.SSLContext.set_npn_protocols) and
    `selected_npn_protocol()` are deprecated: use ALPN
    instead.
  * `ssl.OP_NO_SSL*` options
  * `ssl.OP_NO_TLS*` options
  * `ssl.PROTOCOL_SSLv3`
  * `ssl.PROTOCOL_TLS`
  * `ssl.PROTOCOL_TLSv1`
  * `ssl.PROTOCOL_TLSv1_1`
  * `ssl.PROTOCOL_TLSv1_2`
  * `ssl.TLSVersion.SSLv3`
  * `ssl.TLSVersion.TLSv1`
  * `ssl.TLSVersion.TLSv1_1`
* [`threading`](../library/threading.md#module-threading) methods:
  * `threading.Condition.notifyAll()`: use [`notify_all()`](../library/threading.md#threading.Condition.notify_all).
  * `threading.Event.isSet()`: use [`is_set()`](../library/threading.md#threading.Event.is_set).
  * `threading.Thread.isDaemon()`, [`threading.Thread.setDaemon()`](../library/threading.md#threading.Thread.setDaemon):
    use [`threading.Thread.daemon`](../library/threading.md#threading.Thread.daemon) attribute.
  * `threading.Thread.getName()`, [`threading.Thread.setName()`](../library/threading.md#threading.Thread.setName):
    use [`threading.Thread.name`](../library/threading.md#threading.Thread.name) attribute.
  * `threading.currentThread()`: use [`threading.current_thread()`](../library/threading.md#threading.current_thread).
  * `threading.activeCount()`: use [`threading.active_count()`](../library/threading.md#threading.active_count).
* [`typing.Text`](../library/typing.md#typing.Text) ([gh-92332](https://github.com/python/cpython/issues/92332)).
* The internal class `typing._UnionGenericAlias` is no longer used to implement
  [`typing.Union`](../library/typing.md#typing.Union). To preserve compatibility with users using this private
  class, a compatibility shim will be provided until at least Python 3.17. (Contributed by
  Jelle Zijlstra in [gh-105499](https://github.com/python/cpython/issues/105499).)
* [`unittest.IsolatedAsyncioTestCase`](../library/unittest.md#unittest.IsolatedAsyncioTestCase): it is deprecated to return a value
  that is not `None` from a test case.
* [`urllib.parse`](../library/urllib.parse.md#module-urllib.parse) deprecated functions: [`urlparse()`](../library/urllib.parse.md#urllib.parse.urlparse) instead
  * `splitattr()`
  * `splithost()`
  * `splitnport()`
  * `splitpasswd()`
  * `splitport()`
  * `splitquery()`
  * `splittag()`
  * `splittype()`
  * `splituser()`
  * `splitvalue()`
  * `to_bytes()`
* [`wsgiref`](../library/wsgiref.md#module-wsgiref): `SimpleHandler.stdout.write()` should not do partial
  writes.
* [`xml.etree.ElementTree`](../library/xml.etree.elementtree.md#module-xml.etree.ElementTree): Testing the truth value of an
  [`Element`](../library/xml.etree.elementtree.md#xml.etree.ElementTree.Element) is deprecated. In a future release it
  will always return `True`. Prefer explicit `len(elem)` or
  `elem is not None` tests instead.
* [`sys._clear_type_cache()`](../library/sys.md#sys._clear_type_cache) is deprecated:
  use [`sys._clear_internal_caches()`](../library/sys.md#sys._clear_internal_caches) instead.

## Soft deprecations

There are no plans to remove [soft deprecated](../glossary.md#term-soft-deprecated) APIs.

* [`re.match()`](../library/re.md#re.match) and [`re.Pattern.match()`](../library/re.md#re.Pattern.match) are now
  [soft deprecated](../glossary.md#term-soft-deprecated) in favor of the new [`re.prefixmatch()`](../library/re.md#re.prefixmatch) and
  [`re.Pattern.prefixmatch()`](../library/re.md#re.Pattern.prefixmatch) APIs, which have been added as alternate,
  more explicit names. These are intended to be used to alleviate confusion
  around what *match* means by following the Zen of Python’s  *“Explicit is
  better than implicit”* mantra. Most other language regular expression
  libraries use an API named *match* to mean what Python has always called
  *search*.

  We **do not** plan to remove the older `match()` name, as it has been
  used in code for over 30 years. Code supporting older versions of Python
  should continue to use `match()`, while new code should prefer
  `prefixmatch()`. See [prefixmatch() vs. match()](../library/re.md#prefixmatch-vs-match).

  (Contributed by Gregory P. Smith in [gh-86519](https://github.com/python/cpython/issues/86519) and
  Hugo van Kemenade in [gh-148100](https://github.com/python/cpython/issues/148100).)

## C API deprecations

### Pending removal in Python 3.15

* The `PyImport_ImportModuleNoBlock()`:
  Use [`PyImport_ImportModule()`](../c-api/import.md#c.PyImport_ImportModule) instead.
* `PyWeakref_GetObject()` and `PyWeakref_GET_OBJECT()`:
  Use [`PyWeakref_GetRef()`](../c-api/weakref.md#c.PyWeakref_GetRef) instead. The [pythoncapi-compat project](https://github.com/python/pythoncapi-compat/) can be used to get
  [`PyWeakref_GetRef()`](../c-api/weakref.md#c.PyWeakref_GetRef) on Python 3.12 and older.
* `PyUnicode_AsDecodedObject()`:
  Use [`PyCodec_Decode()`](../c-api/codec.md#c.PyCodec_Decode) instead.
* `PyUnicode_AsDecodedUnicode()`:
  Use [`PyCodec_Decode()`](../c-api/codec.md#c.PyCodec_Decode) instead; Note that some codecs (for example, “base64”)
  may return a type other than [`str`](../library/stdtypes.md#str), such as [`bytes`](../library/stdtypes.md#bytes).
* `PyUnicode_AsEncodedObject()`:
  Use [`PyCodec_Encode()`](../c-api/codec.md#c.PyCodec_Encode) instead.
* `PyUnicode_AsEncodedUnicode()`:
  Use [`PyCodec_Encode()`](../c-api/codec.md#c.PyCodec_Encode) instead; Note that some codecs (for example, “base64”)
  may return a type other than [`bytes`](../library/stdtypes.md#bytes), such as [`str`](../library/stdtypes.md#str).
* Python initialization functions, deprecated in Python 3.13:
  * `Py_GetPath()`:
    Use [`PyConfig_Get("module_search_paths")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.path`](../library/sys.md#sys.path)) instead.
  * `Py_GetPrefix()`:
    Use [`PyConfig_Get("base_prefix")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.base_prefix`](../library/sys.md#sys.base_prefix)) instead. Use [`PyConfig_Get("prefix")`](../c-api/init_config.md#c.PyConfig_Get) ([`sys.prefix`](../library/sys.md#sys.prefix)) if [virtual environments](../library/venv.md#venv-def) need to be handled.
  * `Py_GetExecPrefix()`:
    Use [`PyConfig_Get("base_exec_prefix")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.base_exec_prefix`](../library/sys.md#sys.base_exec_prefix)) instead. Use
    [`PyConfig_Get("exec_prefix")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.exec_prefix`](../library/sys.md#sys.exec_prefix)) if [virtual environments](../library/venv.md#venv-def) need to
    be handled.
  * `Py_GetProgramFullPath()`:
    Use [`PyConfig_Get("executable")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.executable`](../library/sys.md#sys.executable)) instead.
  * `Py_GetProgramName()`:
    Use [`PyConfig_Get("executable")`](../c-api/init_config.md#c.PyConfig_Get)
    ([`sys.executable`](../library/sys.md#sys.executable)) instead.
  * `Py_GetPythonHome()`:
    Use [`PyConfig_Get("home")`](../c-api/init_config.md#c.PyConfig_Get) or the
    [`PYTHONHOME`](../using/cmdline.md#envvar-PYTHONHOME) environment variable instead.

  The [pythoncapi-compat project](https://github.com/python/pythoncapi-compat/) can be used to get
  [`PyConfig_Get()`](../c-api/init_config.md#c.PyConfig_Get) on Python 3.13 and older.
* Functions to configure Python’s initialization, deprecated in Python 3.11:
  * `PySys_SetArgvEx()`:
    Set [`PyConfig.argv`](../c-api/init_config.md#c.PyConfig.argv) instead.
  * `PySys_SetArgv()`:
    Set [`PyConfig.argv`](../c-api/init_config.md#c.PyConfig.argv) instead.
  * `Py_SetProgramName()`:
    Set [`PyConfig.program_name`](../c-api/init_config.md#c.PyConfig.program_name) instead.
  * `Py_SetPythonHome()`:
    Set [`PyConfig.home`](../c-api/init_config.md#c.PyConfig.home) instead.
  * `PySys_ResetWarnOptions()`:
    Clear [`sys.warnoptions`](../library/sys.md#sys.warnoptions) and `warnings.filters` instead.

  The [`Py_InitializeFromConfig()`](../c-api/interp-lifecycle.md#c.Py_InitializeFromConfig) API should be used with
  [`PyConfig`](../c-api/init_config.md#c.PyConfig) instead.
* Global configuration variables:
  * [`Py_DebugFlag`](../c-api/interp-lifecycle.md#c.Py_DebugFlag):
    Use [`PyConfig.parser_debug`](../c-api/init_config.md#c.PyConfig.parser_debug) or
    [`PyConfig_Get("parser_debug")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_VerboseFlag`](../c-api/interp-lifecycle.md#c.Py_VerboseFlag):
    Use [`PyConfig.verbose`](../c-api/init_config.md#c.PyConfig.verbose) or
    [`PyConfig_Get("verbose")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_QuietFlag`](../c-api/interp-lifecycle.md#c.Py_QuietFlag):
    Use [`PyConfig.quiet`](../c-api/init_config.md#c.PyConfig.quiet) or
    [`PyConfig_Get("quiet")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_InteractiveFlag`](../c-api/interp-lifecycle.md#c.Py_InteractiveFlag):
    Use [`PyConfig.interactive`](../c-api/init_config.md#c.PyConfig.interactive) or
    [`PyConfig_Get("interactive")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_InspectFlag`](../c-api/interp-lifecycle.md#c.Py_InspectFlag):
    Use [`PyConfig.inspect`](../c-api/init_config.md#c.PyConfig.inspect) or
    [`PyConfig_Get("inspect")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_OptimizeFlag`](../c-api/interp-lifecycle.md#c.Py_OptimizeFlag):
    Use [`PyConfig.optimization_level`](../c-api/init_config.md#c.PyConfig.optimization_level) or
    [`PyConfig_Get("optimization_level")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_NoSiteFlag`](../c-api/interp-lifecycle.md#c.Py_NoSiteFlag):
    Use [`PyConfig.site_import`](../c-api/init_config.md#c.PyConfig.site_import) or
    [`PyConfig_Get("site_import")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_BytesWarningFlag`](../c-api/interp-lifecycle.md#c.Py_BytesWarningFlag):
    Use [`PyConfig.bytes_warning`](../c-api/init_config.md#c.PyConfig.bytes_warning) or
    [`PyConfig_Get("bytes_warning")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_FrozenFlag`](../c-api/interp-lifecycle.md#c.Py_FrozenFlag):
    Use [`PyConfig.pathconfig_warnings`](../c-api/init_config.md#c.PyConfig.pathconfig_warnings) or
    [`PyConfig_Get("pathconfig_warnings")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_IgnoreEnvironmentFlag`](../c-api/interp-lifecycle.md#c.Py_IgnoreEnvironmentFlag):
    Use [`PyConfig.use_environment`](../c-api/init_config.md#c.PyConfig.use_environment) or
    [`PyConfig_Get("use_environment")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_DontWriteBytecodeFlag`](../c-api/interp-lifecycle.md#c.Py_DontWriteBytecodeFlag):
    Use [`PyConfig.write_bytecode`](../c-api/init_config.md#c.PyConfig.write_bytecode) or
    [`PyConfig_Get("write_bytecode")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_NoUserSiteDirectory`](../c-api/interp-lifecycle.md#c.Py_NoUserSiteDirectory):
    Use [`PyConfig.user_site_directory`](../c-api/init_config.md#c.PyConfig.user_site_directory) or
    [`PyConfig_Get("user_site_directory")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_UnbufferedStdioFlag`](../c-api/interp-lifecycle.md#c.Py_UnbufferedStdioFlag):
    Use [`PyConfig.buffered_stdio`](../c-api/init_config.md#c.PyConfig.buffered_stdio) or
    [`PyConfig_Get("buffered_stdio")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_HashRandomizationFlag`](../c-api/interp-lifecycle.md#c.Py_HashRandomizationFlag):
    Use [`PyConfig.use_hash_seed`](../c-api/init_config.md#c.PyConfig.use_hash_seed)
    and [`PyConfig.hash_seed`](../c-api/init_config.md#c.PyConfig.hash_seed) or
    [`PyConfig_Get("hash_seed")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_IsolatedFlag`](../c-api/interp-lifecycle.md#c.Py_IsolatedFlag):
    Use [`PyConfig.isolated`](../c-api/init_config.md#c.PyConfig.isolated) or
    [`PyConfig_Get("isolated")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_LegacyWindowsFSEncodingFlag`](../c-api/interp-lifecycle.md#c.Py_LegacyWindowsFSEncodingFlag):
    Use [`PyPreConfig.legacy_windows_fs_encoding`](../c-api/init_config.md#c.PyPreConfig.legacy_windows_fs_encoding) or
    [`PyConfig_Get("legacy_windows_fs_encoding")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * [`Py_LegacyWindowsStdioFlag`](../c-api/interp-lifecycle.md#c.Py_LegacyWindowsStdioFlag):
    Use [`PyConfig.legacy_windows_stdio`](../c-api/init_config.md#c.PyConfig.legacy_windows_stdio) or
    [`PyConfig_Get("legacy_windows_stdio")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * `Py_FileSystemDefaultEncoding`, `Py_HasFileSystemDefaultEncoding`:
    Use [`PyConfig.filesystem_encoding`](../c-api/init_config.md#c.PyConfig.filesystem_encoding) or
    [`PyConfig_Get("filesystem_encoding")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * `Py_FileSystemDefaultEncodeErrors`:
    Use [`PyConfig.filesystem_errors`](../c-api/init_config.md#c.PyConfig.filesystem_errors) or
    [`PyConfig_Get("filesystem_errors")`](../c-api/init_config.md#c.PyConfig_Get) instead.
  * `Py_UTF8Mode`:
    Use [`PyPreConfig.utf8_mode`](../c-api/init_config.md#c.PyPreConfig.utf8_mode) or
    [`PyConfig_Get("utf8_mode")`](../c-api/init_config.md#c.PyConfig_Get) instead.
    (see [`Py_PreInitialize()`](../c-api/init_config.md#c.Py_PreInitialize))

  The [`Py_InitializeFromConfig()`](../c-api/interp-lifecycle.md#c.Py_InitializeFromConfig) API should be used with
  [`PyConfig`](../c-api/init_config.md#c.PyConfig) to set these options. Or [`PyConfig_Get()`](../c-api/init_config.md#c.PyConfig_Get) can be
  used to get these options at runtime.

### Pending removal in Python 3.16

* The bundled copy of `libmpdec`.

### Pending removal in Python 3.18

* The following private functions are deprecated
  and planned for removal in Python 3.18:
  * `_PyBytes_Join()`: use [`PyBytes_Join()`](../c-api/bytes.md#c.PyBytes_Join).
  * `_PyDict_GetItemStringWithError()`: use [`PyDict_GetItemStringRef()`](../c-api/dict.md#c.PyDict_GetItemStringRef).
  * `_PyDict_Pop()`: use [`PyDict_Pop()`](../c-api/dict.md#c.PyDict_Pop).
  * `_PyLong_Sign()`: use [`PyLong_GetSign()`](../c-api/long.md#c.PyLong_GetSign).
  * `_PyLong_FromDigits()` and `_PyLong_New()`:
    use [`PyLongWriter_Create()`](../c-api/long.md#c.PyLongWriter_Create).
  * `_PyThreadState_UncheckedGet()`: use [`PyThreadState_GetUnchecked()`](../c-api/threads.md#c.PyThreadState_GetUnchecked).
  * `_PyUnicode_AsString()`: use [`PyUnicode_AsUTF8()`](../c-api/unicode.md#c.PyUnicode_AsUTF8).
  * `_PyUnicodeWriter_Init()`:
    replace `_PyUnicodeWriter_Init(&writer)` with
    [`writer = PyUnicodeWriter_Create(0)`](../c-api/unicode.md#c.PyUnicodeWriter_Create).
  * `_PyUnicodeWriter_Finish()`:
    replace `_PyUnicodeWriter_Finish(&writer)` with
    [`PyUnicodeWriter_Finish(writer)`](../c-api/unicode.md#c.PyUnicodeWriter_Finish).
  * `_PyUnicodeWriter_Dealloc()`:
    replace `_PyUnicodeWriter_Dealloc(&writer)` with
    [`PyUnicodeWriter_Discard(writer)`](../c-api/unicode.md#c.PyUnicodeWriter_Discard).
  * `_PyUnicodeWriter_WriteChar()`:
    replace `_PyUnicodeWriter_WriteChar(&writer, ch)` with
    [`PyUnicodeWriter_WriteChar(writer, ch)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteChar).
  * `_PyUnicodeWriter_WriteStr()`:
    replace `_PyUnicodeWriter_WriteStr(&writer, str)` with
    [`PyUnicodeWriter_WriteStr(writer, str)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteStr).
  * `_PyUnicodeWriter_WriteSubstring()`:
    replace `_PyUnicodeWriter_WriteSubstring(&writer, str, start, end)` with
    [`PyUnicodeWriter_WriteSubstring(writer, str, start, end)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteSubstring).
  * `_PyUnicodeWriter_WriteASCIIString()`:
    replace `_PyUnicodeWriter_WriteASCIIString(&writer, str)` with
    [`PyUnicodeWriter_WriteASCII(writer, str)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteASCII).
  * `_PyUnicodeWriter_WriteLatin1String()`:
    replace `_PyUnicodeWriter_WriteLatin1String(&writer, str)` with
    [`PyUnicodeWriter_WriteUTF8(writer, str)`](../c-api/unicode.md#c.PyUnicodeWriter_WriteUTF8).
  * `_PyUnicodeWriter_Prepare()`: (no replacement).
  * `_PyUnicodeWriter_PrepareKind()`: (no replacement).
  * `_Py_HashPointer()`: use [`Py_HashPointer()`](../c-api/hash.md#c.Py_HashPointer).
  * `_Py_fopen_obj()`: use [`Py_fopen()`](../c-api/sys.md#c.Py_fopen).

  The [pythoncapi-compat project](https://github.com/python/pythoncapi-compat/) can be used to get
  these new public functions on Python 3.13 and older.
  (Contributed by Victor Stinner in [gh-128863](https://github.com/python/cpython/issues/128863).)

### Pending removal in Python 3.19

* [**PEP 456**](https://peps.python.org/pep-0456/) embedders support for the string hashing scheme definition.

### Pending removal in Python 3.20

* `_PyObject_CallMethodId()`, `_PyObject_GetAttrId()` and
  `_PyUnicode_FromId()` are deprecated since 3.15 and will be removed in
  3.20. Instead, use [`PyUnicode_InternFromString()`](../c-api/unicode.md#c.PyUnicode_InternFromString) and cache the result in
  the module state, then call [`PyObject_CallMethod()`](../c-api/call.md#c.PyObject_CallMethod) or
  [`PyObject_GetAttr()`](../c-api/object.md#c.PyObject_GetAttr).
  (Contributed by Victor Stinner in [gh-141049](https://github.com/python/cpython/issues/141049).)
* The `cval` field in [`PyComplexObject`](../c-api/complex.md#c.PyComplexObject) ([gh-128813](https://github.com/python/cpython/issues/128813)).
  Use [`PyComplex_AsCComplex()`](../c-api/complex.md#c.PyComplex_AsCComplex) and [`PyComplex_FromCComplex()`](../c-api/complex.md#c.PyComplex_FromCComplex)
  to convert a Python complex number to/from the C [`Py_complex`](../c-api/complex.md#c.Py_complex)
  representation.
* Macros `Py_MATH_PIl` and `Py_MATH_El`.

### Pending removal in future versions

The following APIs are deprecated and will be removed,
although there is currently no date scheduled for their removal.

* [`Py_TPFLAGS_HAVE_FINALIZE`](../c-api/typeobj.md#c.Py_TPFLAGS_HAVE_FINALIZE):
  Unneeded since Python 3.8.
* [`PyErr_Fetch()`](../c-api/exceptions.md#c.PyErr_Fetch):
  Use [`PyErr_GetRaisedException()`](../c-api/exceptions.md#c.PyErr_GetRaisedException) instead.
* [`PyErr_NormalizeException()`](../c-api/exceptions.md#c.PyErr_NormalizeException):
  Use [`PyErr_GetRaisedException()`](../c-api/exceptions.md#c.PyErr_GetRaisedException) instead.
* [`PyErr_Restore()`](../c-api/exceptions.md#c.PyErr_Restore):
  Use [`PyErr_SetRaisedException()`](../c-api/exceptions.md#c.PyErr_SetRaisedException) instead.
* [`PyModule_GetFilename()`](../c-api/module.md#c.PyModule_GetFilename):
  Use [`PyModule_GetFilenameObject()`](../c-api/module.md#c.PyModule_GetFilenameObject) instead.
* [`PyOS_AfterFork()`](../c-api/sys.md#c.PyOS_AfterFork):
  Use [`PyOS_AfterFork_Child()`](../c-api/sys.md#c.PyOS_AfterFork_Child) instead.
* [`PySlice_GetIndicesEx()`](../c-api/slice.md#c.PySlice_GetIndicesEx):
  Use [`PySlice_Unpack()`](../c-api/slice.md#c.PySlice_Unpack) and [`PySlice_AdjustIndices()`](../c-api/slice.md#c.PySlice_AdjustIndices) instead.
* [`PyUnicode_READY()`](../c-api/unicode.md#c.PyUnicode_READY):
  Unneeded since Python 3.12
* `PyErr_Display()`:
  Use [`PyErr_DisplayException()`](../c-api/exceptions.md#c.PyErr_DisplayException) instead.
* `_PyErr_ChainExceptions()`:
  Use `_PyErr_ChainExceptions1()` instead.
* `PyBytesObject.ob_shash` member:
  call [`PyObject_Hash()`](../c-api/object.md#c.PyObject_Hash) instead.
* Thread Local Storage (TLS) API:
  * [`PyThread_create_key()`](../c-api/tls.md#c.PyThread_create_key):
    Use [`PyThread_tss_alloc()`](../c-api/tls.md#c.PyThread_tss_alloc) instead.
  * [`PyThread_delete_key()`](../c-api/tls.md#c.PyThread_delete_key):
    Use [`PyThread_tss_free()`](../c-api/tls.md#c.PyThread_tss_free) instead.
  * [`PyThread_set_key_value()`](../c-api/tls.md#c.PyThread_set_key_value):
    Use [`PyThread_tss_set()`](../c-api/tls.md#c.PyThread_tss_set) instead.
  * [`PyThread_get_key_value()`](../c-api/tls.md#c.PyThread_get_key_value):
    Use [`PyThread_tss_get()`](../c-api/tls.md#c.PyThread_tss_get) instead.
  * [`PyThread_delete_key_value()`](../c-api/tls.md#c.PyThread_delete_key_value):
    Use [`PyThread_tss_delete()`](../c-api/tls.md#c.PyThread_tss_delete) instead.
  * [`PyThread_ReInitTLS()`](../c-api/tls.md#c.PyThread_ReInitTLS):
    Unneeded since Python 3.7.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
