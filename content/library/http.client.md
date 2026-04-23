# `http.client` — HTTP protocol client

**Source code:** [Lib/http/client.py](https://github.com/python/cpython/tree/main/Lib/http/client.py)

<a id="index-0"></a>

<a id="index-1"></a>

---

This module defines classes that implement the client side of the HTTP and
HTTPS protocols.  It is normally not used directly — the module
[`urllib.request`](urllib.request.md#module-urllib.request) uses it to handle URLs that use HTTP and HTTPS.

#### SEE ALSO
The [Requests package](https://requests.readthedocs.io/en/latest/)
is recommended for a higher-level HTTP client interface.

#### NOTE
HTTPS support is only available if Python was compiled with SSL support
(through the [`ssl`](ssl.md#module-ssl) module).

<!-- include for modules that don't work on WASM -->

[Availability](intro.md#availability): not WASI.

This module does not work or is not available on WebAssembly. See
[WebAssembly platforms](intro.md#wasm-availability) for more information.

The module provides the following classes:

### *class* http.client.HTTPConnection(host, port=None, source_address=None, blocksize=8192, max_response_headers=None)

An [`HTTPConnection`](#http.client.HTTPConnection) instance represents one transaction with an HTTP
server.  It should be instantiated by passing it a host and optional port
number.  If no port number is passed, the port is extracted from the host
string if it has the form `host:port`, else the default HTTP port (80) is
used.  If the optional *timeout* parameter is given, blocking
operations (like connection attempts) will timeout after that many seconds
(if it is not given, the global default timeout setting is used).
The optional *source_address* parameter may be a tuple of a (host, port)
to use as the source address the HTTP connection is made from.
The optional *blocksize* parameter sets the buffer size in bytes for
sending a file-like message body. The optional *max_response_headers*
parameter sets the maximum number of allowed response headers to help
prevent denial-of-service attacks, otherwise the default value (100) is used.

For example, the following calls all create instances that connect to the server
at the same host and port:

```python3
>>> h1 = http.client.HTTPConnection('www.python.org')
>>> h2 = http.client.HTTPConnection('www.python.org:80')
>>> h3 = http.client.HTTPConnection('www.python.org', 80)
>>> h4 = http.client.HTTPConnection('www.python.org', 80, timeout=10)
```

#### Versionchanged
Changed in version 3.2: *source_address* was added.

#### Versionchanged
Changed in version 3.4: The  *strict* parameter was removed. HTTP 0.9-style “Simple Responses” are
no longer supported.

#### Versionchanged
Changed in version 3.7: *blocksize* parameter was added.

#### Versionchanged
Changed in version 3.15: *max_response_headers* parameter was added.

### *class* http.client.HTTPSConnection(host, port=None, \*, source_address=None, context=None, blocksize=8192, max_response_headers=None)

A subclass of [`HTTPConnection`](#http.client.HTTPConnection) that uses SSL for communication with
secure servers.  Default port is `443`.  If *context* is specified, it
must be a [`ssl.SSLContext`](ssl.md#ssl.SSLContext) instance describing the various SSL
options.

Please read [Security considerations](ssl.md#ssl-security) for more information on best practices.

#### Versionchanged
Changed in version 3.2: *source_address*, *context* and *check_hostname* were added.

#### Versionchanged
Changed in version 3.2: This class now supports HTTPS virtual hosts if possible (that is,
if [`ssl.HAS_SNI`](ssl.md#ssl.HAS_SNI) is true).

#### Versionchanged
Changed in version 3.4: The *strict* parameter was removed. HTTP 0.9-style “Simple Responses” are
no longer supported.

#### Versionchanged
Changed in version 3.4.3: This class now performs all the necessary certificate and hostname checks
by default. To revert to the previous, unverified, behavior
`ssl._create_unverified_context()` can be passed to the *context*
parameter.

#### Versionchanged
Changed in version 3.8: This class now enables TLS 1.3
[`ssl.SSLContext.post_handshake_auth`](ssl.md#ssl.SSLContext.post_handshake_auth) for the default *context* or
when *cert_file* is passed with a custom *context*.

#### Versionchanged
Changed in version 3.10: This class now sends an ALPN extension with protocol indicator
`http/1.1` when no *context* is given. Custom *context* should set
ALPN protocols with [`set_alpn_protocols()`](ssl.md#ssl.SSLContext.set_alpn_protocols).

#### Versionchanged
Changed in version 3.12: The deprecated *key_file*, *cert_file* and *check_hostname* parameters
have been removed.

#### Versionchanged
Changed in version 3.15: *max_response_headers* parameter was added.

### *class* http.client.HTTPResponse(sock, debuglevel=0, method=None, url=None)

Class whose instances are returned upon successful connection.  Not
instantiated directly by user.

#### Versionchanged
Changed in version 3.4: The *strict* parameter was removed. HTTP 0.9 style “Simple Responses” are
no longer supported.

This module provides the following function:

### http.client.parse_headers(fp)

Parse the headers from a file pointer *fp* representing a HTTP
request/response. The file has to be a [`BufferedIOBase`](io.md#io.BufferedIOBase) reader
(i.e. not text) and must provide a valid [**RFC 5322**](https://datatracker.ietf.org/doc/html/rfc5322.html) style header.

This function returns an instance of [`http.client.HTTPMessage`](#http.client.HTTPMessage)
that holds the header fields, but no payload
(the same as [`HTTPResponse.msg`](#http.client.HTTPResponse.msg)
and [`http.server.BaseHTTPRequestHandler.headers`](http.server.md#http.server.BaseHTTPRequestHandler.headers)).
After returning, the file pointer *fp* is ready to read the HTTP body.

#### NOTE
[`parse_headers()`](#http.client.parse_headers) does not parse the start-line of a HTTP message;
it only parses the `Name: value` lines. The file has to be ready to
read these field lines, so the first line should already be consumed
before calling the function.

The following exceptions are raised as appropriate:

### *exception* http.client.HTTPException

The base class of the other exceptions in this module.  It is a subclass of
[`Exception`](exceptions.md#Exception).

### *exception* http.client.NotConnected

A subclass of [`HTTPException`](#http.client.HTTPException).

### *exception* http.client.InvalidURL

A subclass of [`HTTPException`](#http.client.HTTPException), raised if a port is given and is either
non-numeric or empty.

### *exception* http.client.UnknownProtocol

A subclass of [`HTTPException`](#http.client.HTTPException).

### *exception* http.client.UnknownTransferEncoding

A subclass of [`HTTPException`](#http.client.HTTPException).

### *exception* http.client.UnimplementedFileMode

A subclass of [`HTTPException`](#http.client.HTTPException).

### *exception* http.client.IncompleteRead

A subclass of [`HTTPException`](#http.client.HTTPException).

### *exception* http.client.ImproperConnectionState

A subclass of [`HTTPException`](#http.client.HTTPException).

### *exception* http.client.CannotSendRequest

A subclass of [`ImproperConnectionState`](#http.client.ImproperConnectionState).

### *exception* http.client.CannotSendHeader

A subclass of [`ImproperConnectionState`](#http.client.ImproperConnectionState).

### *exception* http.client.ResponseNotReady

A subclass of [`ImproperConnectionState`](#http.client.ImproperConnectionState).

### *exception* http.client.BadStatusLine

A subclass of [`HTTPException`](#http.client.HTTPException).  Raised if a server responds with a HTTP
status code that we don’t understand.

### *exception* http.client.LineTooLong

A subclass of [`HTTPException`](#http.client.HTTPException).  Raised if an excessively long line
is received in the HTTP protocol from the server.

### *exception* http.client.RemoteDisconnected

A subclass of [`ConnectionResetError`](exceptions.md#ConnectionResetError) and [`BadStatusLine`](#http.client.BadStatusLine).  Raised
by [`HTTPConnection.getresponse()`](#http.client.HTTPConnection.getresponse) when the attempt to read the response
results in no data read from the connection, indicating that the remote end
has closed the connection.

#### Versionadded
Added in version 3.5: Previously, [`BadStatusLine`](#http.client.BadStatusLine)`('')` was raised.

The constants defined in this module are:

### http.client.HTTP_PORT

The default port for the HTTP protocol (always `80`).

### http.client.HTTPS_PORT

The default port for the HTTPS protocol (always `443`).

### http.client.responses

This dictionary maps the HTTP 1.1 status codes to the W3C names.

Example: `http.client.responses[http.client.NOT_FOUND]` is `'Not Found'`.

See [HTTP status codes](http.md#http-status-codes) for a list of HTTP status codes that are
available in this module as constants.

<a id="httpconnection-objects"></a>

## HTTPConnection Objects

[`HTTPConnection`](#http.client.HTTPConnection) instances have the following methods:

#### HTTPConnection.request(method, url, body=None, headers={}, , encode_chunked=False)

This will send a request to the server using the HTTP request
method *method* and the request URI *url*. The provided *url* must be
an absolute path to conform with [**RFC 2616 §5.1.2**](https://datatracker.ietf.org/doc/html/rfc2616.html#section-5.1.2)
(unless connecting to an HTTP proxy server or using the `OPTIONS` or
`CONNECT` methods).

If *body* is specified, the specified data is sent after the headers are
finished.  It may be a [`str`](stdtypes.md#str), a [bytes-like object](../glossary.md#term-bytes-like-object), an
open [file object](../glossary.md#term-file-object), or an iterable of [`bytes`](stdtypes.md#bytes).  If *body*
is a string, it is encoded as ISO-8859-1, the default for HTTP.  If it
is a bytes-like object, the bytes are sent as is.  If it is a [file
object](../glossary.md#term-file-object), the contents of the file is sent; this file object should
support at least the `read()` method.  If the file object is an
instance of [`io.TextIOBase`](io.md#io.TextIOBase), the data returned by the `read()`
method will be encoded as ISO-8859-1, otherwise the data returned by
`read()` is sent as is.  If *body* is an iterable, the elements of the
iterable are sent as is until the iterable is exhausted.

The *headers* argument should be a mapping of extra HTTP headers to send
with the request. A [**Host header**](https://datatracker.ietf.org/doc/html/rfc2616.html#section-14.23)
must be provided to conform with [**RFC 2616 §5.1.2**](https://datatracker.ietf.org/doc/html/rfc2616.html#section-5.1.2)
(unless connecting to an HTTP proxy server or using the `OPTIONS` or
`CONNECT` methods).

If *headers* contains neither Content-Length nor Transfer-Encoding,
but there is a request body, one of those
header fields will be added automatically.  If
*body* is `None`, the Content-Length header is set to `0` for
methods that expect a body (`PUT`, `POST`, and `PATCH`).  If
*body* is a string or a bytes-like object that is not also a
[file](../glossary.md#term-file-object), the Content-Length header is
set to its length.  Any other type of *body* (files
and iterables in general) will be chunk-encoded, and the
Transfer-Encoding header will automatically be set instead of
Content-Length.

The *encode_chunked* argument is only relevant if Transfer-Encoding is
specified in *headers*.  If *encode_chunked* is `False`, the
HTTPConnection object assumes that all encoding is handled by the
calling code.  If it is `True`, the body will be chunk-encoded.

For example, to perform a `GET` request to `https://docs.python.org/3/`:

```python3
>>> import http.client
>>> host = "docs.python.org"
>>> conn = http.client.HTTPSConnection(host)
>>> conn.request("GET", "/3/", headers={"Host": host})
>>> response = conn.getresponse()
>>> print(response.status, response.reason)
200 OK
```

#### NOTE
Chunked transfer encoding has been added to the HTTP protocol
version 1.1.  Unless the HTTP server is known to handle HTTP 1.1,
the caller must either specify the Content-Length, or must pass a
[`str`](stdtypes.md#str) or bytes-like object that is not also a file as the
body representation.

#### NOTE
Note that you must have read the whole response or call [`close()`](#http.client.HTTPConnection.close)
if [`getresponse()`](#http.client.HTTPConnection.getresponse) raised an non-[`ConnectionError`](exceptions.md#ConnectionError) exception
before you can send a new request to the server.

#### Versionchanged
Changed in version 3.2: *body* can now be an iterable.

#### Versionchanged
Changed in version 3.6: If neither Content-Length nor Transfer-Encoding are set in
*headers*, file and iterable *body* objects are now chunk-encoded.
The *encode_chunked* argument was added.
No attempt is made to determine the Content-Length for file
objects.

#### HTTPConnection.getresponse()

Should be called after a request is sent to get the response from the server.
Returns an [`HTTPResponse`](#http.client.HTTPResponse) instance.

#### Versionchanged
Changed in version 3.5: If a [`ConnectionError`](exceptions.md#ConnectionError) or subclass is raised, the
[`HTTPConnection`](#http.client.HTTPConnection) object will be ready to reconnect when
a new request is sent.

Note that this does not apply to [`OSError`](exceptions.md#OSError)s raised by the underlying
socket. Instead the caller is responsible to call [`close()`](#http.client.HTTPConnection.close) on the
existing connection.

#### HTTPConnection.set_debuglevel(level)

Set the debugging level.  The default debug level is `0`, meaning no
debugging output is printed.  Any value greater than `0` will cause all
currently defined debug output to be printed to stdout.  The `debuglevel`
is passed to any new [`HTTPResponse`](#http.client.HTTPResponse) objects that are created.

#### Versionadded
Added in version 3.1.

#### HTTPConnection.set_tunnel(host, port=None, headers=None)

Set the host and the port for HTTP Connect Tunnelling. This allows running
the connection through a proxy server.

The *host* and *port* arguments specify the endpoint of the tunneled connection
(i.e. the address included in the CONNECT request, *not* the address of the
proxy server).

The *headers* argument should be a mapping of extra HTTP headers to send with
the CONNECT request.

As HTTP/1.1 is used for HTTP CONNECT tunnelling request, [as per the RFC](https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.6), a HTTP `Host:`
header must be provided, matching the authority-form of the request target
provided as the destination for the CONNECT request. If a HTTP `Host:`
header is not provided via the headers argument, one is generated and
transmitted automatically.

For example, to tunnel through a HTTPS proxy server running locally on port
8080, we would pass the address of the proxy to the [`HTTPSConnection`](#http.client.HTTPSConnection)
constructor, and the address of the host that we eventually want to reach to
the [`set_tunnel()`](#http.client.HTTPConnection.set_tunnel) method:

```python3
>>> import http.client
>>> conn = http.client.HTTPSConnection("localhost", 8080)
>>> conn.set_tunnel("www.python.org")
>>> conn.request("HEAD","/index.html")
```

#### Versionadded
Added in version 3.2.

#### Versionchanged
Changed in version 3.12: HTTP CONNECT tunnelling requests use protocol HTTP/1.1, upgraded from
protocol HTTP/1.0. `Host:` HTTP headers are mandatory for HTTP/1.1, so
one will be automatically generated and transmitted if not provided in
the headers argument.

#### HTTPConnection.get_proxy_response_headers()

Returns a dictionary with the headers of the response received from
the proxy server to the CONNECT request.

If the CONNECT request was not sent, the method returns `None`.

#### Versionadded
Added in version 3.12.

#### HTTPConnection.connect()

Connect to the server specified when the object was created.  By default,
this is called automatically when making a request if the client does not
already have a connection.

Raises an [auditing event](sys.md#auditing) `http.client.connect` with arguments `self`, `host`, `port`.

#### HTTPConnection.close()

Close the connection to the server.

#### HTTPConnection.blocksize

Buffer size in bytes for sending a file-like message body.

#### Versionadded
Added in version 3.7.

#### HTTPConnection.max_response_headers

The maximum number of allowed response headers to help prevent denial-of-service
attacks. By default, the maximum number of allowed headers is set to 100.

#### Versionadded
Added in version 3.15.

As an alternative to using the [`request()`](#http.client.HTTPConnection.request) method described above, you can
also send your request step by step, by using the four functions below.

#### HTTPConnection.putrequest(method, url, skip_host=False, skip_accept_encoding=False)

This should be the first call after the connection to the server has been
made. It sends a line to the server consisting of the *method* string,
the *url* string, and the HTTP version (`HTTP/1.1`).  To disable automatic
sending of `Host:` or `Accept-Encoding:` headers (for example to accept
additional content encodings), specify *skip_host* or *skip_accept_encoding*
with non-False values.

#### HTTPConnection.putheader(header, argument)

Send an [**RFC 822**](https://datatracker.ietf.org/doc/html/rfc822.html)-style header to the server.  It sends a line to the server
consisting of the header, a colon and a space, and the first argument.  If more
arguments are given, continuation lines are sent, each consisting of a tab and
an argument.

#### HTTPConnection.endheaders(message_body=None, , encode_chunked=False)

Send a blank line to the server, signalling the end of the headers. The
optional *message_body* argument can be used to pass a message body
associated with the request.

If *encode_chunked* is `True`, the result of each iteration of
*message_body* will be chunk-encoded as specified in [**RFC 7230**](https://datatracker.ietf.org/doc/html/rfc7230.html),
Section 3.3.1.  How the data is encoded is dependent on the type of
*message_body*.  If *message_body* implements the [buffer interface](../c-api/buffer.md#bufferobjects) the encoding will result in a single chunk.
If *message_body* is a [`collections.abc.Iterable`](collections.abc.md#collections.abc.Iterable), each iteration
of *message_body* will result in a chunk.  If *message_body* is a
[file object](../glossary.md#term-file-object), each call to `.read()` will result in a chunk.
The method automatically signals the end of the chunk-encoded data
immediately after *message_body*.

#### NOTE
Due to the chunked encoding specification, empty chunks
yielded by an iterator body will be ignored by the chunk-encoder.
This is to avoid premature termination of the read of the request by
the target server due to malformed encoding.

#### Versionchanged
Changed in version 3.6: Added chunked encoding support and the *encode_chunked* parameter.

#### HTTPConnection.send(data)

Send data to the server.  This should be used directly only after the
[`endheaders()`](#http.client.HTTPConnection.endheaders) method has been called and before [`getresponse()`](#http.client.HTTPConnection.getresponse) is
called.

Raises an [auditing event](sys.md#auditing) `http.client.send` with arguments `self`, `data`.

<a id="httpresponse-objects"></a>

## HTTPResponse Objects

An [`HTTPResponse`](#http.client.HTTPResponse) instance wraps the HTTP response from the
server.  It provides access to the request headers and the entity
body.  The response is an iterable object and can be used in a with
statement.

#### Versionchanged
Changed in version 3.5: The [`io.BufferedIOBase`](io.md#io.BufferedIOBase) interface is now implemented and
all of its reader operations are supported.

#### HTTPResponse.read()

Reads and returns the response body, or up to the next *amt* bytes.

#### HTTPResponse.readinto(b)

Reads up to the next len(b) bytes of the response body into the buffer *b*.
Returns the number of bytes read.

#### Versionadded
Added in version 3.3.

#### HTTPResponse.getheader(name, default=None)

Return the value of the header *name*, or *default* if there is no header
matching *name*.  If there is more than one  header with the name *name*,
return all of the values joined by ‘, ‘.  If *default* is any iterable other
than a single string, its elements are similarly returned joined by commas.

#### HTTPResponse.getheaders()

Return a list of (header, value) tuples.

#### HTTPResponse.fileno()

Return the `fileno` of the underlying socket.

#### HTTPResponse.msg

A [`http.client.HTTPMessage`](#http.client.HTTPMessage) instance containing the response
headers.  [`http.client.HTTPMessage`](#http.client.HTTPMessage) is a subclass of
[`email.message.Message`](email.compat32-message.md#email.message.Message).

#### HTTPResponse.version

HTTP protocol version used by server.  10 for HTTP/1.0, 11 for HTTP/1.1.

#### HTTPResponse.url

URL of the resource retrieved, commonly used to determine if a redirect was followed.

#### HTTPResponse.headers

Headers of the response in the form of an [`email.message.EmailMessage`](email.message.md#email.message.EmailMessage) instance.

#### HTTPResponse.status

Status code returned by server.

#### HTTPResponse.reason

Reason phrase returned by server.

#### HTTPResponse.debuglevel

A debugging hook.  If [`debuglevel`](#http.client.HTTPResponse.debuglevel) is greater than zero, messages
will be printed to stdout as the response is read and parsed.

#### HTTPResponse.closed

Is `True` if the stream is closed.

#### HTTPResponse.geturl()

#### Deprecated
Deprecated since version 3.9: Deprecated in favor of [`url`](#http.client.HTTPResponse.url).

#### HTTPResponse.info()

#### Deprecated
Deprecated since version 3.9: Deprecated in favor of [`headers`](#http.client.HTTPResponse.headers).

#### HTTPResponse.getcode()

#### Deprecated
Deprecated since version 3.9: Deprecated in favor of [`status`](#http.client.HTTPResponse.status).

## Examples

Here is an example session that uses the `GET` method:

```python3
>>> import http.client
>>> conn = http.client.HTTPSConnection("www.python.org")
>>> conn.request("GET", "/")
>>> r1 = conn.getresponse()
>>> print(r1.status, r1.reason)
200 OK
>>> data1 = r1.read()  # This will return entire content.
>>> # The following example demonstrates reading data in chunks.
>>> conn.request("GET", "/")
>>> r1 = conn.getresponse()
>>> while chunk := r1.read(200):
...     print(repr(chunk))
b'<!doctype html>\n<!--[if"...
...
>>> # Example of an invalid request
>>> conn = http.client.HTTPSConnection("docs.python.org")
>>> conn.request("GET", "/parrot.spam")
>>> r2 = conn.getresponse()
>>> print(r2.status, r2.reason)
404 Not Found
>>> data2 = r2.read()
>>> conn.close()
```

Here is an example session that uses the `HEAD` method.  Note that the
`HEAD` method never returns any data.

```python3
>>> import http.client
>>> conn = http.client.HTTPSConnection("www.python.org")
>>> conn.request("HEAD", "/")
>>> res = conn.getresponse()
>>> print(res.status, res.reason)
200 OK
>>> data = res.read()
>>> print(len(data))
0
>>> data == b''
True
```

Here is an example session that uses the `POST` method:

```python3
>>> import http.client, urllib.parse
>>> params = urllib.parse.urlencode({'@number': 12524, '@type': 'issue', '@action': 'show'})
>>> headers = {"Content-type": "application/x-www-form-urlencoded",
...            "Accept": "text/plain"}
>>> conn = http.client.HTTPConnection("bugs.python.org")
>>> conn.request("POST", "", params, headers)
>>> response = conn.getresponse()
>>> print(response.status, response.reason)
302 Found
>>> data = response.read()
>>> data
b'Redirecting to <a href="https://bugs.python.org/issue12524">https://bugs.python.org/issue12524</a>'
>>> conn.close()
```

Client side HTTP `PUT` requests are very similar to `POST` requests. The
difference lies only on the server side where HTTP servers will allow resources to
be created via `PUT` requests. It should be noted that custom HTTP methods
are also handled in [`urllib.request.Request`](urllib.request.md#urllib.request.Request) by setting the appropriate
method attribute. Here is an example session that uses the `PUT` method:

```python3
>>> # This creates an HTTP request
>>> # with the content of BODY as the enclosed representation
>>> # for the resource http://localhost:8080/file
...
>>> import http.client
>>> BODY = "***filecontents***"
>>> conn = http.client.HTTPConnection("localhost", 8080)
>>> conn.request("PUT", "/file", BODY)
>>> response = conn.getresponse()
>>> print(response.status, response.reason)
200, OK
```

<a id="httpmessage-objects"></a>

## HTTPMessage Objects

### *class* http.client.HTTPMessage(email.message.Message)

An [`http.client.HTTPMessage`](#http.client.HTTPMessage) instance holds the headers from an HTTP
response.  It is implemented using the [`email.message.Message`](email.compat32-message.md#email.message.Message) class.

<!-- XXX Define the methods that clients can depend upon between versions. -->
<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
