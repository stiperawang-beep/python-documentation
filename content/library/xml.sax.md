# `xml.sax` — Support for SAX2 parsers

**Source code:** [Lib/xml/sax/_\_init_\_.py](https://github.com/python/cpython/tree/main/Lib/xml/sax/__init__.py)

---

The `xml.sax` package provides a number of modules which implement the
Simple API for XML (SAX) interface for Python.  The package itself provides the
SAX exceptions and the convenience functions which will be most used by users of
the SAX API.

#### NOTE
If you need to parse untrusted or unauthenticated data, see
[XML security](xml.md#xml-security).

#### Versionchanged
Changed in version 3.7.1: The SAX parser no longer processes general external entities by default
to increase security. Before, the parser created network connections
to fetch remote files or loaded local files from the file
system for DTD and entities. The feature can be enabled again with method
[`setFeature()`](xml.sax.reader.md#xml.sax.xmlreader.XMLReader.setFeature) on the parser object
and argument [`feature_external_ges`](xml.sax.handler.md#xml.sax.handler.feature_external_ges).

The convenience functions are:

### xml.sax.make_parser(parser_list=[])

Create and return a SAX [`XMLReader`](xml.sax.reader.md#xml.sax.xmlreader.XMLReader) object.  The
first parser found will
be used.  If *parser_list* is provided, it must be an iterable of strings which
name modules that have a function named `create_parser()`.  Modules listed
in *parser_list* will be used before modules in the default list of parsers.

#### Versionchanged
Changed in version 3.8: The *parser_list* argument can be any iterable, not just a list.

### xml.sax.parse(filename_or_stream, handler, error_handler=handler.ErrorHandler())

Create a SAX parser and use it to parse a document.  The document, passed in as
*filename_or_stream*, can be a filename or a file object.  The *handler*
parameter needs to be a SAX [`ContentHandler`](xml.sax.handler.md#xml.sax.handler.ContentHandler) instance.  If
*error_handler* is given, it must be a SAX [`ErrorHandler`](xml.sax.handler.md#xml.sax.handler.ErrorHandler)
instance; if
omitted,  [`SAXParseException`](#xml.sax.SAXParseException) will be raised on all errors.  There is no
return value; all work must be done by the *handler* passed in.

### xml.sax.parseString(string, handler, error_handler=handler.ErrorHandler())

Similar to [`parse()`](#xml.sax.parse), but parses from a buffer *string* received as a
parameter.  *string* must be a [`str`](stdtypes.md#str) instance or a
[bytes-like object](../glossary.md#term-bytes-like-object).

#### Versionchanged
Changed in version 3.5: Added support of [`str`](stdtypes.md#str) instances.

A typical SAX application uses three kinds of objects: readers, handlers and
input sources.  “Reader” in this context is another term for parser, i.e. some
piece of code that reads the bytes or characters from the input source, and
produces a sequence of events. The events then get distributed to the handler
objects, i.e. the reader invokes a method on the handler.  A SAX application
must therefore obtain a reader object, create or open the input sources, create
the handlers, and connect these objects all together.  As the final step of
preparation, the reader is called to parse the input. During parsing, methods on
the handler objects are called based on structural and syntactic events from the
input data.

For these objects, only the interfaces are relevant; they are normally not
instantiated by the application itself.  Since Python does not have an explicit
notion of interface, they are formally introduced as classes, but applications
may use implementations which do not inherit from the provided classes.  The
[`InputSource`](xml.sax.reader.md#xml.sax.xmlreader.InputSource), [`Locator`](xml.sax.reader.md#xml.sax.xmlreader.Locator),
`Attributes`, `AttributesNS`,
and [`XMLReader`](xml.sax.reader.md#xml.sax.xmlreader.XMLReader) interfaces are defined in the
module [`xml.sax.xmlreader`](xml.sax.reader.md#module-xml.sax.xmlreader).  The handler interfaces are defined in
[`xml.sax.handler`](xml.sax.handler.md#module-xml.sax.handler).  For convenience,
[`InputSource`](xml.sax.reader.md#xml.sax.xmlreader.InputSource) (which is often
instantiated directly) and the handler classes are also available from
`xml.sax`.  These interfaces are described below.

In addition to these classes, `xml.sax` provides the following exception
classes.

### *exception* xml.sax.SAXException(msg, exception=None)

Encapsulate an XML error or warning.  This class can contain basic error or
warning information from either the XML parser or the application: it can be
subclassed to provide additional functionality or to add localization.  Note
that although the handlers defined in the
[`ErrorHandler`](xml.sax.handler.md#xml.sax.handler.ErrorHandler) interface
receive instances of this exception, it is not required to actually raise the
exception — it is also useful as a container for information.

When instantiated, *msg* should be a human-readable description of the error.
The optional *exception* parameter, if given, should be `None` or an exception
that was caught by the parsing code and is being passed along as information.

This is the base class for the other SAX exception classes.

### *exception* xml.sax.SAXParseException(msg, exception, locator)

Subclass of [`SAXException`](#xml.sax.SAXException) raised on parse errors. Instances of this
class are passed to the methods of the SAX
[`ErrorHandler`](xml.sax.handler.md#xml.sax.handler.ErrorHandler) interface to provide information
about the parse error.  This class supports the SAX
[`Locator`](xml.sax.reader.md#xml.sax.xmlreader.Locator) interface as well as the
[`SAXException`](#xml.sax.SAXException) interface.

### *exception* xml.sax.SAXNotRecognizedException(msg, exception=None)

Subclass of [`SAXException`](#xml.sax.SAXException) raised when a SAX
[`XMLReader`](xml.sax.reader.md#xml.sax.xmlreader.XMLReader) is
confronted with an unrecognized feature or property.  SAX applications and
extensions may use this class for similar purposes.

### *exception* xml.sax.SAXNotSupportedException(msg, exception=None)

Subclass of [`SAXException`](#xml.sax.SAXException) raised when a SAX
[`XMLReader`](xml.sax.reader.md#xml.sax.xmlreader.XMLReader) is asked to
enable a feature that is not supported, or to set a property to a value that the
implementation does not support.  SAX applications and extensions may use this
class for similar purposes.

#### SEE ALSO
[SAX: The Simple API for XML](http://www.saxproject.org/)
: This site is the focal point for the definition of the SAX API.  It provides a
  Java implementation and online documentation.  Links to implementations and
  historical information are also available.

Module [`xml.sax.handler`](xml.sax.handler.md#module-xml.sax.handler)
: Definitions of the interfaces for application-provided objects.

Module [`xml.sax.saxutils`](xml.sax.utils.md#module-xml.sax.saxutils)
: Convenience functions for use in SAX applications.

Module [`xml.sax.xmlreader`](xml.sax.reader.md#module-xml.sax.xmlreader)
: Definitions of the interfaces for parser-provided objects.

<a id="sax-exception-objects"></a>

## SAXException Objects

The [`SAXException`](#xml.sax.SAXException) exception class supports the following methods:

#### SAXException.getMessage()

Return a human-readable message describing the error condition.

#### SAXException.getException()

Return an encapsulated exception object, or `None`.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
