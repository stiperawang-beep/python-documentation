# `asyncio` — Asynchronous I/O

---

asyncio is a library to write **concurrent** code using
the **async/await** syntax.

asyncio is used as a foundation for multiple Python asynchronous
frameworks that provide high-performance network and web-servers,
database connection libraries, distributed task queues, etc.

asyncio is often a perfect fit for IO-bound and high-level
**structured** network code.

#### SEE ALSO
[A conceptual overview of asyncio](../howto/a-conceptual-overview-of-asyncio.md#a-conceptual-overview-of-asyncio)
: Explanation of the fundamentals of asyncio.

asyncio provides a set of **high-level** APIs to:

* [run Python coroutines](asyncio-task.md#coroutine) concurrently and
  have full control over their execution;
* perform [network IO and IPC](asyncio-stream.md#asyncio-streams);
* control [subprocesses](asyncio-subprocess.md#asyncio-subprocess);
* distribute tasks via [queues](asyncio-queue.md#asyncio-queues);
* [synchronize](asyncio-sync.md#asyncio-sync) concurrent code;

Additionally, there are **low-level** APIs for
*library and framework developers* to:

* create and manage [event loops](asyncio-eventloop.md#asyncio-event-loop), which
  provide asynchronous APIs for [networking](asyncio-eventloop.md#loop-create-server),
  running [subprocesses](asyncio-eventloop.md#loop-subprocess-exec),
  handling [OS signals](asyncio-eventloop.md#loop-add-signal-handler), etc;
* implement efficient protocols using
  [transports](asyncio-protocol.md#asyncio-transports-protocols);
* [bridge](asyncio-future.md#asyncio-futures) callback-based libraries and code
  with async/await syntax.

<!-- include for modules that don't work on WASM -->

[Availability](intro.md#availability): not WASI.

This module does not work or is not available on WebAssembly. See
[WebAssembly platforms](intro.md#wasm-availability) for more information.

<a id="asyncio-cli"></a>

### asyncio REPL

You can experiment with an `asyncio` concurrent context in the [REPL](../glossary.md#term-REPL):

```pycon
$ python -m asyncio
asyncio REPL ...
Use "await" directly instead of "asyncio.run()".
Type "help", "copyright", "credits" or "license" for more information.
>>> import asyncio
>>> await asyncio.sleep(10, result='hello')
'hello'
```

This REPL provides limited compatibility with [`PYTHON_BASIC_REPL`](../using/cmdline.md#envvar-PYTHON_BASIC_REPL).
It is recommended that the default REPL is used
for full functionality and the latest features.

Raises an [auditing event](sys.md#auditing) `cpython.run_stdin` with no arguments.

#### Versionchanged
Changed in version 3.12.5: (also 3.11.10, 3.10.15, 3.9.20, and 3.8.20)
Emits audit events.

#### Versionchanged
Changed in version 3.13: Uses PyREPL if possible, in which case [`PYTHONSTARTUP`](../using/cmdline.md#envvar-PYTHONSTARTUP) is
also executed. Emits audit events.

<!-- We use the "rubric" directive here to avoid creating
the "Reference" subsection in the TOC. -->

### Reference

# High-level APIs

* [Runners](asyncio-runner.md)
* [Coroutines and tasks](asyncio-task.md)
* [Streams](asyncio-stream.md)
* [Synchronization Primitives](asyncio-sync.md)
* [Subprocesses](asyncio-subprocess.md)
* [Queues](asyncio-queue.md)
* [Exceptions](asyncio-exceptions.md)
* [Call Graph Introspection](asyncio-graph.md)

# Low-level APIs

* [Event loop](asyncio-eventloop.md)
* [Futures](asyncio-future.md)
* [Transports and Protocols](asyncio-protocol.md)
* [Policies](asyncio-policy.md)
* [Platform Support](asyncio-platforms.md)
* [Extending](asyncio-extending.md)

# Guides and Tutorials

* [High-level API Index](asyncio-api-index.md)
* [Low-level API Index](asyncio-llapi-index.md)
* [Developing with asyncio](asyncio-dev.md)

#### NOTE
The source code for asyncio can be found in [Lib/asyncio/](https://github.com/python/cpython/tree/main/Lib/asyncio/).

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
