<a id="asyncio-platform-support"></a>

# Platform Support

The [`asyncio`](asyncio.md#module-asyncio) module is designed to be portable,
but some platforms have subtle differences and limitations
due to the platforms’ underlying architecture and capabilities.

## All Platforms

* [`loop.add_reader()`](asyncio-eventloop.md#asyncio.loop.add_reader) and [`loop.add_writer()`](asyncio-eventloop.md#asyncio.loop.add_writer)
  cannot be used to monitor file I/O.

## Windows

**Source code:** [Lib/asyncio/proactor_events.py](https://github.com/python/cpython/tree/main/Lib/asyncio/proactor_events.py),
[Lib/asyncio/windows_events.py](https://github.com/python/cpython/tree/main/Lib/asyncio/windows_events.py),
[Lib/asyncio/windows_utils.py](https://github.com/python/cpython/tree/main/Lib/asyncio/windows_utils.py)

---

#### Versionchanged
Changed in version 3.8: On Windows, [`ProactorEventLoop`](asyncio-eventloop.md#asyncio.ProactorEventLoop) is now the default event loop.

All event loops on Windows do not support the following methods:

* [`loop.create_unix_connection()`](asyncio-eventloop.md#asyncio.loop.create_unix_connection) and
  [`loop.create_unix_server()`](asyncio-eventloop.md#asyncio.loop.create_unix_server) are not supported.
  The [`socket.AF_UNIX`](socket.md#socket.AF_UNIX) socket family is specific to Unix.
* [`loop.add_signal_handler()`](asyncio-eventloop.md#asyncio.loop.add_signal_handler) and
  [`loop.remove_signal_handler()`](asyncio-eventloop.md#asyncio.loop.remove_signal_handler) are not supported.

[`SelectorEventLoop`](asyncio-eventloop.md#asyncio.SelectorEventLoop) has the following limitations:

* [`SelectSelector`](selectors.md#selectors.SelectSelector) is used to wait on socket events:
  it supports sockets and is limited to 512 sockets.
* [`loop.add_reader()`](asyncio-eventloop.md#asyncio.loop.add_reader) and [`loop.add_writer()`](asyncio-eventloop.md#asyncio.loop.add_writer) only accept
  socket handles (e.g. pipe file descriptors are not supported).
* Pipes are not supported, so the [`loop.connect_read_pipe()`](asyncio-eventloop.md#asyncio.loop.connect_read_pipe)
  and [`loop.connect_write_pipe()`](asyncio-eventloop.md#asyncio.loop.connect_write_pipe) methods are not implemented.
* [Subprocesses](asyncio-subprocess.md#asyncio-subprocess) are not supported, i.e.
  [`loop.subprocess_exec()`](asyncio-eventloop.md#asyncio.loop.subprocess_exec) and [`loop.subprocess_shell()`](asyncio-eventloop.md#asyncio.loop.subprocess_shell)
  methods are not implemented.

[`ProactorEventLoop`](asyncio-eventloop.md#asyncio.ProactorEventLoop) has the following limitations:

* The [`loop.add_reader()`](asyncio-eventloop.md#asyncio.loop.add_reader) and [`loop.add_writer()`](asyncio-eventloop.md#asyncio.loop.add_writer)
  methods are not supported.

The resolution of the monotonic clock on Windows is usually around 15.6
milliseconds.  The best resolution is 0.5 milliseconds. The resolution depends on the
hardware (availability of [HPET](https://en.wikipedia.org/wiki/High_Precision_Event_Timer)) and on the
Windows configuration.

<a id="asyncio-windows-subprocess"></a>

### Subprocess Support on Windows

On Windows, the default event loop [`ProactorEventLoop`](asyncio-eventloop.md#asyncio.ProactorEventLoop) supports
subprocesses, whereas [`SelectorEventLoop`](asyncio-eventloop.md#asyncio.SelectorEventLoop) does not.

## macOS

Modern macOS versions are fully supported.

### macOS <= 10.8

On macOS 10.6, 10.7 and 10.8, the default event loop
uses [`selectors.KqueueSelector`](selectors.md#selectors.KqueueSelector), which does not support
character devices on these versions.  The [`SelectorEventLoop`](asyncio-eventloop.md#asyncio.SelectorEventLoop)
can be manually configured to use [`SelectSelector`](selectors.md#selectors.SelectSelector)
or [`PollSelector`](selectors.md#selectors.PollSelector) to support character devices on
these older versions of macOS.  Example:

```python3
import asyncio
import selectors

selector = selectors.SelectSelector()
loop = asyncio.SelectorEventLoop(selector)
asyncio.set_event_loop(loop)
```

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
