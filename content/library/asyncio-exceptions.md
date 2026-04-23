<a id="asyncio-exceptions"></a>

# Exceptions

**Source code:** [Lib/asyncio/exceptions.py](https://github.com/python/cpython/tree/main/Lib/asyncio/exceptions.py)

---

### *exception* asyncio.TimeoutError

A deprecated alias of [`TimeoutError`](exceptions.md#TimeoutError),
raised when the operation has exceeded the given deadline.

#### Versionchanged
Changed in version 3.11: This class was made an alias of [`TimeoutError`](exceptions.md#TimeoutError).

### *exception* asyncio.CancelledError

The operation has been cancelled.

This exception can be caught to perform custom operations
when asyncio Tasks are cancelled.  In almost all situations the
exception must be re-raised.

#### Versionchanged
Changed in version 3.8: [`CancelledError`](#asyncio.CancelledError) is now a subclass of [`BaseException`](exceptions.md#BaseException) rather than [`Exception`](exceptions.md#Exception).

### *exception* asyncio.InvalidStateError

Invalid internal state of [`Task`](asyncio-task.md#asyncio.Task) or [`Future`](asyncio-future.md#asyncio.Future).

Can be raised in situations like setting a result value for a
*Future* object that already has a result value set.

### *exception* asyncio.SendfileNotAvailableError

The “sendfile” syscall is not available for the given
socket or file type.

A subclass of [`RuntimeError`](exceptions.md#RuntimeError).

### *exception* asyncio.IncompleteReadError

The requested read operation did not complete fully.

Raised by the [asyncio stream APIs](asyncio-stream.md#asyncio-streams).

This exception is a subclass of [`EOFError`](exceptions.md#EOFError).

#### expected

The total number ([`int`](functions.md#int)) of expected bytes.

#### partial

A string of [`bytes`](stdtypes.md#bytes) read before the end of stream was reached.

### *exception* asyncio.LimitOverrunError

Reached the buffer size limit while looking for a separator.

Raised by the [asyncio stream APIs](asyncio-stream.md#asyncio-streams).

#### consumed

The total number of to be consumed bytes.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
