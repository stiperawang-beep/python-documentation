# Pending removal in Python 3.14

* [`argparse`](../library/argparse.md#module-argparse): The *type*, *choices*, and *metavar* parameters
  of `argparse.BooleanOptionalAction` are deprecated
  and will be removed in 3.14.
  (Contributed by Nikita Sobolev in [gh-92248](https://github.com/python/cpython/issues/92248).)
* [`ast`](../library/ast.md#module-ast): The following features have been deprecated in documentation
  since Python 3.8, now cause a [`DeprecationWarning`](../library/exceptions.md#DeprecationWarning) to be emitted at
  runtime when they are accessed or used, and will be removed in Python 3.14:
  * `ast.Num`
  * `ast.Str`
  * `ast.Bytes`
  * `ast.NameConstant`
  * `ast.Ellipsis`

  Use [`ast.Constant`](../library/ast.md#ast.Constant) instead.
  (Contributed by Serhiy Storchaka in [gh-90953](https://github.com/python/cpython/issues/90953).)
* [`asyncio`](../library/asyncio.md#module-asyncio):
  * The child watcher classes `asyncio.MultiLoopChildWatcher`,
    `asyncio.FastChildWatcher`, `asyncio.AbstractChildWatcher`
    and `asyncio.SafeChildWatcher` are deprecated and
    will be removed in Python 3.14.
    (Contributed by Kumar Aditya in [gh-94597](https://github.com/python/cpython/issues/94597).)
  * `asyncio.set_child_watcher()`, `asyncio.get_child_watcher()`,
    `asyncio.AbstractEventLoopPolicy.set_child_watcher()` and
    `asyncio.AbstractEventLoopPolicy.get_child_watcher()` are deprecated
    and will be removed in Python 3.14.
    (Contributed by Kumar Aditya in [gh-94597](https://github.com/python/cpython/issues/94597).)
  * The [`get_event_loop()`](../library/asyncio-eventloop.md#asyncio.get_event_loop) method of the
    default event loop policy now emits a [`DeprecationWarning`](../library/exceptions.md#DeprecationWarning) if there
    is no current event loop set and it decides to create one.
    (Contributed by Serhiy Storchaka and Guido van Rossum in [gh-100160](https://github.com/python/cpython/issues/100160).)
* [`email`](../library/email.md#module-email): Deprecated the *isdst* parameter in [`email.utils.localtime()`](../library/email.utils.md#email.utils.localtime).
  (Contributed by Alan Williams in [gh-72346](https://github.com/python/cpython/issues/72346).)
* [`importlib.abc`](../library/importlib.md#module-importlib.abc) deprecated classes:
  * `importlib.abc.ResourceReader`
  * `importlib.abc.Traversable`
  * `importlib.abc.TraversableResources`

  Use [`importlib.resources.abc`](../library/importlib.resources.abc.md#module-importlib.resources.abc) classes instead:
  * [`importlib.resources.abc.Traversable`](../library/importlib.resources.abc.md#importlib.resources.abc.Traversable)
  * [`importlib.resources.abc.TraversableResources`](../library/importlib.resources.abc.md#importlib.resources.abc.TraversableResources)

  (Contributed by Jason R. Coombs and Hugo van Kemenade in [gh-93963](https://github.com/python/cpython/issues/93963).)
* [`itertools`](../library/itertools.md#module-itertools) had undocumented, inefficient, historically buggy,
  and inconsistent support for copy, deepcopy, and pickle operations.
  This will be removed in 3.14 for a significant reduction in code
  volume and maintenance burden.
  (Contributed by Raymond Hettinger in [gh-101588](https://github.com/python/cpython/issues/101588).)
* [`multiprocessing`](../library/multiprocessing.md#module-multiprocessing): The default start method will change to a safer one on
  Linux, BSDs, and other non-macOS POSIX platforms where `'fork'` is currently
  the default ([gh-84559](https://github.com/python/cpython/issues/84559)). Adding a runtime warning about this was deemed too
  disruptive as the majority of code is not expected to care. Use the
  [`get_context()`](../library/multiprocessing.md#multiprocessing.get_context) or
  [`set_start_method()`](../library/multiprocessing.md#multiprocessing.set_start_method) APIs to explicitly specify when
  your code *requires* `'fork'`.  See [Contexts and start methods](../library/multiprocessing.md#multiprocessing-start-methods).
* [`pathlib`](../library/pathlib.md#module-pathlib): [`is_relative_to()`](../library/pathlib.md#pathlib.PurePath.is_relative_to) and
  [`relative_to()`](../library/pathlib.md#pathlib.PurePath.relative_to): passing additional arguments is
  deprecated.
* [`pkgutil`](../library/pkgutil.md#module-pkgutil): `pkgutil.find_loader()` and `pkgutil.get_loader()`
  now raise [`DeprecationWarning`](../library/exceptions.md#DeprecationWarning);
  use [`importlib.util.find_spec()`](../library/importlib.md#importlib.util.find_spec) instead.
  (Contributed by Nikita Sobolev in [gh-97850](https://github.com/python/cpython/issues/97850).)
* [`pty`](../library/pty.md#module-pty):
  * `master_open()`: use [`pty.openpty()`](../library/pty.md#pty.openpty).
  * `slave_open()`: use [`pty.openpty()`](../library/pty.md#pty.openpty).
* [`sqlite3`](../library/sqlite3.md#module-sqlite3):
  * `version` and `version_info`.
  * [`execute()`](../library/sqlite3.md#sqlite3.Cursor.execute) and [`executemany()`](../library/sqlite3.md#sqlite3.Cursor.executemany)
    if [named placeholders](../library/sqlite3.md#sqlite3-placeholders) are used and
    *parameters* is a sequence instead of a [`dict`](../library/stdtypes.md#dict).
* [`urllib`](../library/urllib.md#module-urllib):
  `urllib.parse.Quoter` is deprecated: it was not intended to be a
  public API.
  (Contributed by Gregory P. Smith in [gh-88168](https://github.com/python/cpython/issues/88168).)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
