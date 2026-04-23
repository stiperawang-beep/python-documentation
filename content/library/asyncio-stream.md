<a id="asyncio-streams"></a>

# Streams

**Source code:** [Lib/asyncio/streams.py](https://github.com/python/cpython/tree/main/Lib/asyncio/streams.py)

---

Streams are high-level async/await-ready primitives to work with
network connections.  Streams allow sending and receiving data without
using callbacks or low-level protocols and transports.

<a id="asyncio-example-stream"></a>

Here is an example of a TCP echo client written using asyncio
streams:

```python3
import asyncio

async def tcp_echo_client(message):
    reader, writer = await asyncio.open_connection(
        '127.0.0.1', 8888)

    print(f'Send: {message!r}')
    writer.write(message.encode())
    await writer.drain()

    data = await reader.read(100)
    print(f'Received: {data.decode()!r}')

    print('Close the connection')
    writer.close()
    await writer.wait_closed()

asyncio.run(tcp_echo_client('Hello World!'))
```

See also the [Examples]() section below.

### Stream Functions

The following top-level asyncio functions can be used to create
and work with streams:

### *async* asyncio.open_connection(host=None, port=None, , limit=None, ssl=None, family=0, proto=0, flags=0, sock=None, local_addr=None, server_hostname=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None, happy_eyeballs_delay=None, interleave=None)

Establish a network connection and return a pair of
`(reader, writer)` objects.

The returned *reader* and *writer* objects are instances of
[`StreamReader`](#asyncio.StreamReader) and [`StreamWriter`](#asyncio.StreamWriter) classes.

*limit* determines the buffer size limit used by the
returned [`StreamReader`](#asyncio.StreamReader) instance.  By default the *limit*
is set to 64 KiB.

The rest of the arguments are passed directly to
[`loop.create_connection()`](asyncio-eventloop.md#asyncio.loop.create_connection).

#### NOTE
The *sock* argument transfers ownership of the socket to the
[`StreamWriter`](#asyncio.StreamWriter) created. To close the socket, call its
[`close()`](#asyncio.StreamWriter.close) method.

#### Versionchanged
Changed in version 3.7: Added the *ssl_handshake_timeout* parameter.

#### Versionchanged
Changed in version 3.8: Added the *happy_eyeballs_delay* and *interleave* parameters.

#### Versionchanged
Changed in version 3.10: Removed the *loop* parameter.

#### Versionchanged
Changed in version 3.11: Added the *ssl_shutdown_timeout* parameter.

### *async* asyncio.start_server(client_connected_cb, host=None, port=None, , limit=None, family=socket.AF_UNSPEC, flags=socket.AI_PASSIVE, sock=None, backlog=100, ssl=None, reuse_address=None, reuse_port=None, keep_alive=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None, start_serving=True)

Start a socket server.

The *client_connected_cb* callback is called whenever a new client
connection is established.  It receives a `(reader, writer)` pair
as two arguments, instances of the [`StreamReader`](#asyncio.StreamReader) and
[`StreamWriter`](#asyncio.StreamWriter) classes.

*client_connected_cb* can be a plain callable or a
[coroutine function](asyncio-task.md#coroutine); if it is a coroutine function,
it will be automatically scheduled as a [`Task`](asyncio-task.md#asyncio.Task).

*limit* determines the buffer size limit used by the
returned [`StreamReader`](#asyncio.StreamReader) instance.  By default the *limit*
is set to 64 KiB.

The rest of the arguments are passed directly to
[`loop.create_server()`](asyncio-eventloop.md#asyncio.loop.create_server).

#### NOTE
The *sock* argument transfers ownership of the socket to the
server created. To close the socket, call the server’s
[`close()`](asyncio-eventloop.md#asyncio.Server.close) method.

#### Versionchanged
Changed in version 3.7: Added the *ssl_handshake_timeout* and *start_serving* parameters.

#### Versionchanged
Changed in version 3.10: Removed the *loop* parameter.

#### Versionchanged
Changed in version 3.11: Added the *ssl_shutdown_timeout* parameter.

#### Versionchanged
Changed in version 3.13: Added the *keep_alive* parameter.

### Unix Sockets

### *async* asyncio.open_unix_connection(path=None, , limit=None, ssl=None, sock=None, server_hostname=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None)

Establish a Unix socket connection and return a pair of
`(reader, writer)`.

Similar to [`open_connection()`](#asyncio.open_connection) but operates on Unix sockets.

See also the documentation of [`loop.create_unix_connection()`](asyncio-eventloop.md#asyncio.loop.create_unix_connection).

#### NOTE
The *sock* argument transfers ownership of the socket to the
[`StreamWriter`](#asyncio.StreamWriter) created. To close the socket, call its
[`close()`](#asyncio.StreamWriter.close) method.

[Availability](intro.md#availability): Unix.

#### Versionchanged
Changed in version 3.7: Added the *ssl_handshake_timeout* parameter.
The *path* parameter can now be a [path-like object](../glossary.md#term-path-like-object)

#### Versionchanged
Changed in version 3.10: Removed the *loop* parameter.

#### Versionchanged
Changed in version 3.11: Added the *ssl_shutdown_timeout* parameter.

### *async* asyncio.start_unix_server(client_connected_cb, path=None, , limit=None, sock=None, backlog=100, ssl=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None, start_serving=True, cleanup_socket=True)

Start a Unix socket server.

Similar to [`start_server()`](#asyncio.start_server) but works with Unix sockets.

If *cleanup_socket* is true then the Unix socket will automatically
be removed from the filesystem when the server is closed, unless the
socket has been replaced after the server has been created.

See also the documentation of [`loop.create_unix_server()`](asyncio-eventloop.md#asyncio.loop.create_unix_server).

#### NOTE
The *sock* argument transfers ownership of the socket to the
server created. To close the socket, call the server’s
[`close()`](asyncio-eventloop.md#asyncio.Server.close) method.

[Availability](intro.md#availability): Unix.

#### Versionchanged
Changed in version 3.7: Added the *ssl_handshake_timeout* and *start_serving* parameters.
The *path* parameter can now be a [path-like object](../glossary.md#term-path-like-object).

#### Versionchanged
Changed in version 3.10: Removed the *loop* parameter.

#### Versionchanged
Changed in version 3.11: Added the *ssl_shutdown_timeout* parameter.

#### Versionchanged
Changed in version 3.13: Added the *cleanup_socket* parameter.

## StreamReader

### *class* asyncio.StreamReader

Represents a reader object that provides APIs to read data
from the IO stream. As an [asynchronous iterable](../glossary.md#term-asynchronous-iterable), the
object supports the [`async for`](../reference/compound_stmts.md#async-for) statement.

It is not recommended to instantiate *StreamReader* objects
directly; use [`open_connection()`](#asyncio.open_connection) and [`start_server()`](#asyncio.start_server)
instead.

#### feed_eof()

Acknowledge the EOF.

#### *async* read(n=-1)

Read up to *n* bytes from the stream.

If *n* is not provided or set to `-1`,
read until EOF, then return all read [`bytes`](stdtypes.md#bytes).
If EOF was received and the internal buffer is empty,
return an empty `bytes` object.

If *n* is `0`, return an empty `bytes` object immediately.

If *n* is positive, return at most *n* available `bytes`
as soon as at least 1 byte is available in the internal buffer.
If EOF is received before any byte is read, return an empty
`bytes` object.

#### *async* readline()

Read one line, where “line” is a sequence of bytes
ending with `\n`.

If EOF is received and `\n` was not found, the method
returns partially read data.

If EOF is received and the internal buffer is empty,
return an empty `bytes` object.

#### *async* readexactly(n)

Read exactly *n* bytes.

Raise an [`IncompleteReadError`](asyncio-exceptions.md#asyncio.IncompleteReadError) if EOF is reached before *n*
can be read.  Use the [`IncompleteReadError.partial`](asyncio-exceptions.md#asyncio.IncompleteReadError.partial)
attribute to get the partially read data.

#### *async* readuntil(separator=b'\\n')

Read data from the stream until *separator* is found.

On success, the data and separator will be removed from the
internal buffer (consumed). Returned data will include the
separator at the end.

If the amount of data read exceeds the configured stream limit, a
[`LimitOverrunError`](asyncio-exceptions.md#asyncio.LimitOverrunError) exception is raised, and the data
is left in the internal buffer and can be read again.

If EOF is reached before the complete separator is found,
an [`IncompleteReadError`](asyncio-exceptions.md#asyncio.IncompleteReadError) exception is raised, and the internal
buffer is reset.  The [`IncompleteReadError.partial`](asyncio-exceptions.md#asyncio.IncompleteReadError.partial) attribute
may contain a portion of the separator.

The *separator* may also be a tuple of separators. In this
case the return value will be the shortest possible that has any
separator as the suffix. For the purposes of [`LimitOverrunError`](asyncio-exceptions.md#asyncio.LimitOverrunError),
the shortest possible separator is considered to be the one that
matched.

#### Versionadded
Added in version 3.5.2.

#### Versionchanged
Changed in version 3.13: The *separator* parameter may now be a [`tuple`](stdtypes.md#tuple) of
separators.

#### at_eof()

Return `True` if the buffer is empty and [`feed_eof()`](#asyncio.StreamReader.feed_eof)
was called.

## StreamWriter

### *class* asyncio.StreamWriter

Represents a writer object that provides APIs to write data
to the IO stream.

It is not recommended to instantiate *StreamWriter* objects
directly; use [`open_connection()`](#asyncio.open_connection) and [`start_server()`](#asyncio.start_server)
instead.

#### write(data)

The method attempts to write the *data* to the underlying socket immediately.
If that fails, the data is queued in an internal write buffer until it can be
sent.

The *data* buffer should be a bytes, bytearray, or C-contiguous one-dimensional
memoryview object.

The method should be used along with the `drain()` method:

```python3
stream.write(data)
await stream.drain()
```

#### writelines(data)

The method writes a list (or any iterable) of bytes to the underlying socket
immediately.
If that fails, the data is queued in an internal write buffer until it can be
sent.

The method should be used along with the `drain()` method:

```python3
stream.writelines(lines)
await stream.drain()
```

#### close()

The method closes the stream and the underlying socket.

The method should be used, though not mandatory,
along with the `wait_closed()` method:

```python3
stream.close()
await stream.wait_closed()
```

#### can_write_eof()

Return `True` if the underlying transport supports
the [`write_eof()`](#asyncio.StreamWriter.write_eof) method, `False` otherwise.

#### write_eof()

Close the write end of the stream after the buffered write
data is flushed.

#### transport

Return the underlying asyncio transport.

#### get_extra_info(name, default=None)

Access optional transport information; see
[`BaseTransport.get_extra_info()`](asyncio-protocol.md#asyncio.BaseTransport.get_extra_info) for details.

#### *async* drain()

Wait until it is appropriate to resume writing to the stream.
Example:

```python3
writer.write(data)
await writer.drain()
```

This is a flow control method that interacts with the underlying
IO write buffer.  When the size of the buffer reaches
the high watermark, *drain()* blocks until the size of the
buffer is drained down to the low watermark and writing can
be resumed.  When there is nothing to wait for, the [`drain()`](#asyncio.StreamWriter.drain)
returns immediately.

#### *async* start_tls(sslcontext, , server_hostname=None, ssl_handshake_timeout=None, ssl_shutdown_timeout=None)

Upgrade an existing stream-based connection to TLS.

Parameters:

* *sslcontext*: a configured instance of [`SSLContext`](ssl.md#ssl.SSLContext).
* *server_hostname*: sets or overrides the host name that the target
  server’s certificate will be matched against.
* *ssl_handshake_timeout* is the time in seconds to wait for the TLS
  handshake to complete before aborting the connection.  `60.0` seconds
  if `None` (default).
* *ssl_shutdown_timeout* is the time in seconds to wait for the SSL shutdown
  to complete before aborting the connection. `30.0` seconds if `None`
  (default).

#### Versionadded
Added in version 3.11.

#### Versionchanged
Changed in version 3.12: Added the *ssl_shutdown_timeout* parameter.

#### is_closing()

Return `True` if the stream is closed or in the process of
being closed.

#### Versionadded
Added in version 3.7.

#### *async* wait_closed()

Wait until the stream is closed.

Should be called after [`close()`](#asyncio.StreamWriter.close) to wait until the underlying
connection is closed, ensuring that all data has been flushed
before e.g. exiting the program.

#### Versionadded
Added in version 3.7.

## Examples

<a id="asyncio-tcp-echo-client-streams"></a>

### TCP echo client using streams

TCP echo client using the [`asyncio.open_connection()`](#asyncio.open_connection) function:

```python3
import asyncio

async def tcp_echo_client(message):
    reader, writer = await asyncio.open_connection(
        '127.0.0.1', 8888)

    print(f'Send: {message!r}')
    writer.write(message.encode())
    await writer.drain()

    data = await reader.read(100)
    print(f'Received: {data.decode()!r}')

    print('Close the connection')
    writer.close()
    await writer.wait_closed()

asyncio.run(tcp_echo_client('Hello World!'))
```

#### SEE ALSO
The [TCP echo client protocol](asyncio-protocol.md#asyncio-example-tcp-echo-client-protocol)
example uses the low-level [`loop.create_connection()`](asyncio-eventloop.md#asyncio.loop.create_connection) method.

<a id="asyncio-tcp-echo-server-streams"></a>

### TCP echo server using streams

TCP echo server using the [`asyncio.start_server()`](#asyncio.start_server) function:

```python3
import asyncio

async def handle_echo(reader, writer):
    data = await reader.read(100)
    message = data.decode()
    addr = writer.get_extra_info('peername')

    print(f"Received {message!r} from {addr!r}")

    print(f"Send: {message!r}")
    writer.write(data)
    await writer.drain()

    print("Close the connection")
    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(
        handle_echo, '127.0.0.1', 8888)

    addrs = ', '.join(str(sock.getsockname()) for sock in server.sockets)
    print(f'Serving on {addrs}')

    async with server:
        await server.serve_forever()

asyncio.run(main())
```

#### SEE ALSO
The [TCP echo server protocol](asyncio-protocol.md#asyncio-example-tcp-echo-server-protocol)
example uses the [`loop.create_server()`](asyncio-eventloop.md#asyncio.loop.create_server) method.

### Get HTTP headers

Simple example querying HTTP headers of the URL passed on the command line:

```python3
import asyncio
import urllib.parse
import sys

async def print_http_headers(url):
    url = urllib.parse.urlsplit(url)
    if url.scheme == 'https':
        reader, writer = await asyncio.open_connection(
            url.hostname, 443, ssl=True)
    else:
        reader, writer = await asyncio.open_connection(
            url.hostname, 80)

    query = (
        f"HEAD {url.path or '/'} HTTP/1.0\r\n"
        f"Host: {url.hostname}\r\n"
        f"\r\n"
    )

    writer.write(query.encode('latin-1'))
    while True:
        line = await reader.readline()
        if not line:
            break

        line = line.decode('latin1').rstrip()
        if line:
            print(f'HTTP header> {line}')

    # Ignore the body, close the socket
    writer.close()
    await writer.wait_closed()

url = sys.argv[1]
asyncio.run(print_http_headers(url))
```

Usage:

```python3
python example.py http://example.com/path/page.html
```

or with HTTPS:

```python3
python example.py https://example.com/path/page.html
```

<a id="asyncio-example-create-connection-streams"></a>

### Register an open socket to wait for data using streams

Coroutine waiting until a socket receives data using the
[`open_connection()`](#asyncio.open_connection) function:

```python3
import asyncio
import socket

async def wait_for_data():
    # Get a reference to the current event loop because
    # we want to access low-level APIs.
    loop = asyncio.get_running_loop()

    # Create a pair of connected sockets.
    rsock, wsock = socket.socketpair()

    # Register the open socket to wait for data.
    reader, writer = await asyncio.open_connection(sock=rsock)

    # Simulate the reception of data from the network
    loop.call_soon(wsock.send, 'abc'.encode())

    # Wait for data
    data = await reader.read(100)

    # Got data, we are done: close the socket
    print("Received:", data.decode())
    writer.close()
    await writer.wait_closed()

    # Close the second socket
    wsock.close()

asyncio.run(wait_for_data())
```

#### SEE ALSO
The [register an open socket to wait for data using a protocol](asyncio-protocol.md#asyncio-example-create-connection) example uses a low-level protocol and
the [`loop.create_connection()`](asyncio-eventloop.md#asyncio.loop.create_connection) method.

The [watch a file descriptor for read events](asyncio-eventloop.md#asyncio-example-watch-fd) example uses the low-level
[`loop.add_reader()`](asyncio-eventloop.md#asyncio.loop.add_reader) method to watch a file descriptor.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
