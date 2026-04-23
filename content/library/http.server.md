# `http.server` — HTTP servers

**Source code:** [Lib/http/server.py](https://github.com/python/cpython/tree/main/Lib/http/server.py)

<a id="index-0"></a>

---

This module defines classes for implementing HTTP servers.

#### WARNING
`http.server` is not recommended for production. It only implements
[basic security checks](#http-server-security).

<!-- include for modules that don't work on WASM -->

[Availability](intro.md#availability): not WASI.

This module does not work or is not available on WebAssembly. See
[WebAssembly platforms](intro.md#wasm-availability) for more information.

One class, [`HTTPServer`](#http.server.HTTPServer), is a [`socketserver.TCPServer`](socketserver.md#socketserver.TCPServer) subclass.
It creates and listens at the HTTP socket, dispatching the requests to a
handler.  Code to create and run the server looks like this:

```python3
def run(server_class=HTTPServer, handler_class=BaseHTTPRequestHandler):
    server_address = ('', 8000)
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()
```

### *class* http.server.HTTPServer(server_address, RequestHandlerClass)

This class builds on the [`TCPServer`](socketserver.md#socketserver.TCPServer) class by storing
the server address as instance variables named `server_name` and
`server_port`. The server is accessible by the handler, typically
through the handler’s `server` instance variable.

### *class* http.server.ThreadingHTTPServer(server_address, RequestHandlerClass)

This class is identical to HTTPServer but uses threads to handle
requests by using the [`ThreadingMixIn`](socketserver.md#socketserver.ThreadingMixIn). This
is useful to handle web browsers pre-opening sockets, on which
[`HTTPServer`](#http.server.HTTPServer) would wait indefinitely.

#### Versionadded
Added in version 3.7.

### *class* http.server.HTTPSServer(server_address, RequestHandlerClass, bind_and_activate=True, , certfile, keyfile=None, password=None, alpn_protocols=None)

Subclass of [`HTTPServer`](#http.server.HTTPServer) with a wrapped socket using the [`ssl`](ssl.md#module-ssl) module.
If the [`ssl`](ssl.md#module-ssl) module is not available, instantiating a `HTTPSServer`
object fails with a [`RuntimeError`](exceptions.md#RuntimeError).

The *certfile* argument is the path to the SSL certificate chain file,
and the *keyfile* is the path to file containing the private key.

A *password* can be specified for files protected and wrapped with PKCS#8,
but beware that this could possibly expose hardcoded passwords in clear.

#### SEE ALSO
See [`ssl.SSLContext.load_cert_chain()`](ssl.md#ssl.SSLContext.load_cert_chain) for additional
information on the accepted values for *certfile*, *keyfile*
and *password*.

When specified, the *alpn_protocols* argument must be a sequence of strings
specifying the “Application-Layer Protocol Negotiation” (ALPN) protocols
supported by the server. ALPN allows the server and the client to negotiate
the application protocol during the TLS handshake.

By default, it is set to `["http/1.1"]`, meaning the server supports HTTP/1.1.

#### Versionadded
Added in version 3.14.

### *class* http.server.ThreadingHTTPSServer(server_address, RequestHandlerClass, bind_and_activate=True, , certfile, keyfile=None, password=None, alpn_protocols=None)

This class is identical to [`HTTPSServer`](#http.server.HTTPSServer) but uses threads to handle
requests by inheriting from [`ThreadingMixIn`](socketserver.md#socketserver.ThreadingMixIn). This is
analogous to [`ThreadingHTTPServer`](#http.server.ThreadingHTTPServer) only using [`HTTPSServer`](#http.server.HTTPSServer).

#### Versionadded
Added in version 3.14.

The [`HTTPServer`](#http.server.HTTPServer), [`ThreadingHTTPServer`](#http.server.ThreadingHTTPServer), [`HTTPSServer`](#http.server.HTTPSServer) and
[`ThreadingHTTPSServer`](#http.server.ThreadingHTTPSServer) must be given a *RequestHandlerClass* on
instantiation, of which this module provides three different variants:

### *class* http.server.BaseHTTPRequestHandler(request, client_address, server)

This class is used to handle the HTTP requests that arrive at the server.  By
itself, it cannot respond to any actual HTTP requests; it must be subclassed
to handle each request method (for example, `'GET'` or `'POST'`).
[`BaseHTTPRequestHandler`](#http.server.BaseHTTPRequestHandler) provides a number of class and instance
variables, and methods for use by subclasses.

The handler will parse the request and the headers, then call a method
specific to the request type. The method name is constructed from the
request. For example, for the request method `SPAM`, the `do_SPAM()`
method will be called with no arguments. All of the relevant information is
stored in instance variables of the handler.  Subclasses should not need to
override or extend the `__init__()` method.

[`BaseHTTPRequestHandler`](#http.server.BaseHTTPRequestHandler) has the following instance variables:

#### client_address

Contains a tuple of the form `(host, port)` referring to the client’s
address.

#### server

Contains the server instance.

#### close_connection

Boolean that should be set before [`handle_one_request()`](#http.server.BaseHTTPRequestHandler.handle_one_request) returns,
indicating if another request may be expected, or if the connection should
be shut down.

#### requestline

Contains the string representation of the HTTP request line. The
terminating CRLF is stripped. This attribute should be set by
[`handle_one_request()`](#http.server.BaseHTTPRequestHandler.handle_one_request). If no valid request line was processed, it
should be set to the empty string.

#### command

Contains the command (request type). For example, `'GET'`.

#### path

Contains the request path. If query component of the URL is present,
then `path` includes the query. Using the terminology of [**RFC 3986**](https://datatracker.ietf.org/doc/html/rfc3986.html),
`path` here includes `hier-part` and the `query`.

#### request_version

Contains the version string from the request. For example, `'HTTP/1.0'`.

#### headers

Holds an instance of the class specified by the [`MessageClass`](#http.server.BaseHTTPRequestHandler.MessageClass) class
variable. This instance parses and manages the headers in the HTTP
request. The [`parse_headers()`](http.client.md#http.client.parse_headers) function from
[`http.client`](http.client.md#module-http.client) is used to parse the headers and it requires that the
HTTP request provide a valid [**RFC 5322**](https://datatracker.ietf.org/doc/html/rfc5322.html) style header.

#### rfile

An [`io.BufferedIOBase`](io.md#io.BufferedIOBase) input stream, ready to read from
the start of the optional input data.

#### wfile

Contains the output stream for writing a response back to the
client. Proper adherence to the HTTP protocol must be used when writing to
this stream in order to achieve successful interoperation with HTTP
clients.

#### Versionchanged
Changed in version 3.6: This is an [`io.BufferedIOBase`](io.md#io.BufferedIOBase) stream.

[`BaseHTTPRequestHandler`](#http.server.BaseHTTPRequestHandler) has the following attributes:

#### server_version

Specifies the server software version.  You may want to override this. The
format is multiple whitespace-separated strings, where each string is of
the form name[/version]. For example, `'BaseHTTP/0.2'`.

#### sys_version

Contains the Python system version, in a form usable by the
[`version_string`](#http.server.BaseHTTPRequestHandler.version_string) method and the [`server_version`](#http.server.BaseHTTPRequestHandler.server_version) class
variable. For example, `'Python/1.4'`.

#### error_message_format

Specifies a format string that should be used by [`send_error()`](#http.server.BaseHTTPRequestHandler.send_error) method
for building an error response to the client. The string is filled by
default with variables from [`responses`](#http.server.BaseHTTPRequestHandler.responses) based on the status code
that passed to [`send_error()`](#http.server.BaseHTTPRequestHandler.send_error).

#### error_content_type

Specifies the Content-Type HTTP header of error responses sent to the
client.  The default value is `'text/html'`.

#### protocol_version

Specifies the HTTP version to which the server is conformant. It is sent
in responses to let the client know the server’s communication
capabilities for future requests. If set to
`'HTTP/1.1'`, the server will permit HTTP persistent connections;
however, your server *must* then include an accurate `Content-Length`
header (using [`send_header()`](#http.server.BaseHTTPRequestHandler.send_header)) in all of its responses to clients.
For backwards compatibility, the setting defaults to `'HTTP/1.0'`.

#### MessageClass

Specifies an [`email.message.Message`](email.compat32-message.md#email.message.Message)-like class to parse HTTP
headers.  Typically, this is not overridden, and it defaults to
[`http.client.HTTPMessage`](http.client.md#http.client.HTTPMessage).

#### responses

This attribute contains a mapping of error code integers to two-element tuples
containing a short and long message. For example, `{code: (shortmessage,
longmessage)}`. The *shortmessage* is usually used as the *message* key in an
error response, and *longmessage* as the *explain* key.  It is used by
[`send_response_only()`](#http.server.BaseHTTPRequestHandler.send_response_only) and [`send_error()`](#http.server.BaseHTTPRequestHandler.send_error) methods.

A [`BaseHTTPRequestHandler`](#http.server.BaseHTTPRequestHandler) instance has the following methods:

#### handle()

Calls [`handle_one_request()`](#http.server.BaseHTTPRequestHandler.handle_one_request) once (or, if persistent connections are
enabled, multiple times) to handle incoming HTTP requests. You should
never need to override it; instead, implement appropriate `do_*()`
methods.

#### handle_one_request()

This method will parse and dispatch the request to the appropriate
`do_*()` method.  You should never need to override it.

#### handle_expect_100()

When an HTTP/1.1 conformant server receives an `Expect: 100-continue`
request header it responds back with a `100 Continue` followed by `200
OK` headers.
This method can be overridden to raise an error if the server does not
want the client to continue.  For example, the server can choose to send `417
Expectation Failed` as a response header and `return False`.

#### Versionadded
Added in version 3.2.

#### send_error(code, message=None, explain=None)

Sends and logs a complete error reply to the client. The numeric *code*
specifies the HTTP error code, with *message* as an optional, short, human
readable description of the error.  The *explain* argument can be used to
provide more detailed information about the error; it will be formatted
using the [`error_message_format`](#http.server.BaseHTTPRequestHandler.error_message_format) attribute and emitted, after
a complete set of headers, as the response body.  The [`responses`](#http.server.BaseHTTPRequestHandler.responses)
attribute holds the default values for *message* and *explain* that
will be used if no value is provided; for unknown codes the default value
for both is the string `???`. The body will be empty if the method is
HEAD or the response code is one of the following: `1*xx*`,
`204 No Content`, `205 Reset Content`, `304 Not Modified`.

#### Versionchanged
Changed in version 3.4: The error response includes a Content-Length header.
Added the *explain* argument.

#### send_response(code, message=None)

Adds a response header to the headers buffer and logs the accepted
request. The HTTP response line is written to the internal buffer,
followed by *Server* and *Date* headers. The values for these two headers
are picked up from the [`version_string()`](#http.server.BaseHTTPRequestHandler.version_string) and
[`date_time_string()`](#http.server.BaseHTTPRequestHandler.date_time_string) methods, respectively. If the server does not
intend to send any other headers using the [`send_header()`](#http.server.BaseHTTPRequestHandler.send_header) method,
then [`send_response()`](#http.server.BaseHTTPRequestHandler.send_response) should be followed by an [`end_headers()`](#http.server.BaseHTTPRequestHandler.end_headers)
call.

#### Versionchanged
Changed in version 3.3: Headers are stored to an internal buffer and [`end_headers()`](#http.server.BaseHTTPRequestHandler.end_headers)
needs to be called explicitly.

#### send_header(keyword, value)

Adds the HTTP header to an internal buffer which will be written to the
output stream when either [`end_headers()`](#http.server.BaseHTTPRequestHandler.end_headers) or [`flush_headers()`](#http.server.BaseHTTPRequestHandler.flush_headers) is
invoked. *keyword* should specify the header keyword, with *value*
specifying its value. Note that, after the send_header calls are done,
[`end_headers()`](#http.server.BaseHTTPRequestHandler.end_headers) MUST BE called in order to complete the operation.

This method does not reject input containing CRLF sequences.

#### Versionchanged
Changed in version 3.2: Headers are stored in an internal buffer.

#### send_response_only(code, message=None)

Sends the response header only, used for the purposes when `100
Continue` response is sent by the server to the client. The headers not
buffered and sent directly the output stream.If the *message* is not
specified, the HTTP message corresponding the response *code*  is sent.

This method does not reject *message* containing CRLF sequences.

#### Versionadded
Added in version 3.2.

#### end_headers()

Adds a blank line
(indicating the end of the HTTP headers in the response)
to the headers buffer and calls [`flush_headers()`](#http.server.BaseHTTPRequestHandler.flush_headers).

#### Versionchanged
Changed in version 3.2: The buffered headers are written to the output stream.

#### flush_headers()

Finally send the headers to the output stream and flush the internal
headers buffer.

#### Versionadded
Added in version 3.3.

#### log_request(code='-', size='-')

Logs an accepted (successful) request. *code* should specify the numeric
HTTP code associated with the response. If a size of the response is
available, then it should be passed as the *size* parameter.

#### log_error(...)

Logs an error when a request cannot be fulfilled. By default, it passes
the message to [`log_message()`](#http.server.BaseHTTPRequestHandler.log_message), so it takes the same arguments
(*format* and additional values).

#### log_message(format, ...)

Logs an arbitrary message to `sys.stderr`. This is typically overridden
to create custom error logging mechanisms. The *format* argument is a
standard printf-style format string, where the additional arguments to
[`log_message()`](#http.server.BaseHTTPRequestHandler.log_message) are applied as inputs to the formatting. The client
ip address and current date and time are prefixed to every message logged.

#### version_string()

Returns the server software’s version string. This is a combination of the
[`server_version`](#http.server.BaseHTTPRequestHandler.server_version) and [`sys_version`](#http.server.BaseHTTPRequestHandler.sys_version) attributes.

#### date_time_string(timestamp=None)

Returns the date and time given by *timestamp* (which must be `None` or in
the format returned by [`time.time()`](time.md#time.time)), formatted for a message
header. If *timestamp* is omitted, it uses the current date and time.

The result looks like `'Sun, 06 Nov 1994 08:49:37 GMT'`.

#### log_date_time_string()

Returns the current date and time, formatted for logging.

#### address_string()

Returns the client address.

#### Versionchanged
Changed in version 3.3: Previously, a name lookup was performed. To avoid name resolution
delays, it now always returns the IP address.

### *class* http.server.SimpleHTTPRequestHandler(request, client_address, server, directory=None)

This class serves files from the directory *directory* and below,
or the current directory if *directory* is not provided, directly
mapping the directory structure to HTTP requests.

#### Versionchanged
Changed in version 3.7: Added the *directory* parameter.

#### Versionchanged
Changed in version 3.9: The *directory* parameter accepts a [path-like object](../glossary.md#term-path-like-object).

A lot of the work, such as parsing the request, is done by the base class
[`BaseHTTPRequestHandler`](#http.server.BaseHTTPRequestHandler).  This class implements the [`do_GET()`](#http.server.SimpleHTTPRequestHandler.do_GET)
and [`do_HEAD()`](#http.server.SimpleHTTPRequestHandler.do_HEAD) functions.

The following are defined as class-level attributes of
[`SimpleHTTPRequestHandler`](#http.server.SimpleHTTPRequestHandler):

#### server_version

This will be `"SimpleHTTP/" + __version__`, where `__version__` is
defined at the module level.

#### extensions_map

A dictionary mapping suffixes into MIME types, contains custom overrides
for the default system mappings. The mapping is used case-insensitively,
and so should contain only lower-cased keys.

#### Versionchanged
Changed in version 3.9: This dictionary is no longer filled with the default system mappings,
but only contains overrides.

The [`SimpleHTTPRequestHandler`](#http.server.SimpleHTTPRequestHandler) class defines the following methods:

#### do_HEAD()

This method serves the `'HEAD'` request type: it sends the headers it
would send for the equivalent `GET` request. See the [`do_GET()`](#http.server.SimpleHTTPRequestHandler.do_GET)
method for a more complete explanation of the possible headers.

#### do_GET()

The request is mapped to a local file by interpreting the request as a
path relative to the current working directory.

If the request was mapped to a directory, the directory is checked for a
file named `index.html` or `index.htm` (in that order). If found, the
file’s contents are returned; otherwise a directory listing is generated
by calling the `list_directory()` method. This method uses
[`os.listdir()`](os.md#os.listdir) to scan the directory, and returns a `404` error
response if the [`listdir()`](os.md#os.listdir) fails.

If the request was mapped to a file, it is opened. Any [`OSError`](exceptions.md#OSError)
exception in opening the requested file is mapped to a `404`,
`'File not found'` error. If there was an `'If-Modified-Since'`
header in the request, and the file was not modified after this time,
a `304`, `'Not Modified'` response is sent. Otherwise, the content
type is guessed by calling the `guess_type()` method, which in turn
uses the *extensions_map* variable, and the file contents are returned.

A `'Content-type:'` header with the guessed content type is output,
followed by a `'Content-Length:'` header with the file’s size and a
`'Last-Modified:'` header with the file’s modification time.

Then follows a blank line signifying the end of the headers, and then the
contents of the file are output.

For example usage, see the implementation of the `test` function
in [Lib/http/server.py](https://github.com/python/cpython/tree/main/Lib/http/server.py).

#### Versionchanged
Changed in version 3.7: Support of the `'If-Modified-Since'` header.

The [`SimpleHTTPRequestHandler`](#http.server.SimpleHTTPRequestHandler) class can be used in the following
manner in order to create a very basic webserver serving files relative to
the current directory:

```python3
import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()
```

[`SimpleHTTPRequestHandler`](#http.server.SimpleHTTPRequestHandler) can also be subclassed to enhance behavior,
such as using different index file names by overriding the class attribute
`index_pages`.

<a id="http-server-cli"></a>

## Command-line interface

`http.server` can also be invoked directly using the [`-m`](../using/cmdline.md#cmdoption-m)
switch of the interpreter.  The following example illustrates how to serve
files relative to the current directory:

```bash
python -m http.server [OPTIONS] [port]
```

The following options are accepted:

### port

The server listens to port 8000 by default. The default can be overridden
by passing the desired port number as an argument:

```bash
python -m http.server 9000
```

### -b, --bind <address>

Specifies a specific address to which it should bind. Both IPv4 and IPv6
addresses are supported. By default, the server binds itself to all
interfaces. For example, the following command causes the server to bind
to localhost only:

```bash
python -m http.server --bind 127.0.0.1
```

#### Versionadded
Added in version 3.4.

#### Versionchanged
Changed in version 3.8: Support IPv6 in the `--bind` option.

### -d, --directory <dir>

Specifies a directory to which it should serve the files. By default,
the server uses the current directory. For example, the following command
uses a specific directory:

```bash
python -m http.server --directory /tmp/
```

#### Versionadded
Added in version 3.7.

### -p, --protocol <version>

Specifies the HTTP version to which the server is conformant. By default,
the server is conformant to HTTP/1.0. For example, the following command
runs an HTTP/1.1 conformant server:

```bash
python -m http.server --protocol HTTP/1.1
```

#### Versionadded
Added in version 3.11.

### --tls-cert

Specifies a TLS certificate chain for HTTPS connections:

```bash
python -m http.server --tls-cert fullchain.pem
```

#### Versionadded
Added in version 3.14.

### --tls-key

Specifies a private key file for HTTPS connections.

This option requires `--tls-cert` to be specified.

#### Versionadded
Added in version 3.14.

### --tls-password-file

Specifies the password file for password-protected private keys:

```bash
python -m http.server \
       --tls-cert cert.pem \
       --tls-key key.pem \
       --tls-password-file password.txt
```

This option requires `--tls-cert` to be specified.

#### Versionadded
Added in version 3.14.

<a id="http-server-security"></a>

## Security considerations

<a id="index-3"></a>

[`SimpleHTTPRequestHandler`](#http.server.SimpleHTTPRequestHandler) will follow symbolic links when handling
requests, this makes it possible for files outside of the specified directory
to be served.

Methods [`BaseHTTPRequestHandler.send_header()`](#http.server.BaseHTTPRequestHandler.send_header) and
[`BaseHTTPRequestHandler.send_response_only()`](#http.server.BaseHTTPRequestHandler.send_response_only) assume sanitized input
and do not perform input validation such as checking for the presence of CRLF
sequences. Untrusted input may result in HTTP Header injection attacks.

Earlier versions of Python did not scrub control characters from the
log messages emitted to stderr from `python -m http.server` or the
default [`BaseHTTPRequestHandler`](#http.server.BaseHTTPRequestHandler) `.log_message`
implementation. This could allow remote clients connecting to your
server to send nefarious control codes to your terminal.

#### Versionchanged
Changed in version 3.12: Control characters are scrubbed in stderr logs.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
