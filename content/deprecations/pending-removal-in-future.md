# Pending removal in future versions

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

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
