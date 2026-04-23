# `xml.sax.handler` — Base classes for SAX handlers

**Source code:** [Lib/xml/sax/handler.py](https://github.com/python/cpython/tree/main/Lib/xml/sax/handler.py)

---

The SAX API defines five kinds of handlers: content handlers, DTD handlers,
error handlers, entity resolvers and lexical handlers. Applications normally
only need to implement those interfaces whose events they are interested in;
they can implement the interfaces in a single object or in multiple objects.
Handler implementations should inherit from the base classes provided in the
module `xml.sax.handler`, so that all methods get default implementations.

### *class* xml.sax.handler.ContentHandler

This is the main callback interface in SAX, and the one most important to
applications. The order of events in this interface mirrors the order of the
information in the document.

### *class* xml.sax.handler.DTDHandler

Handle DTD events.

This interface specifies only those DTD events required for basic parsing
(unparsed entities and attributes).

### *class* xml.sax.handler.EntityResolver

Basic interface for resolving entities. If you create an object implementing
this interface, then register the object with your Parser, the parser will call
the method in your object to resolve all external entities.

### *class* xml.sax.handler.ErrorHandler

Interface used by the parser to present error and warning messages to the
application.  The methods of this object control whether errors are immediately
converted to exceptions or are handled in some other way.

### *class* xml.sax.handler.LexicalHandler

Interface used by the parser to represent low frequency events which may not
be of interest to many applications.

In addition to these classes, `xml.sax.handler` provides symbolic constants
for the feature and property names.

### xml.sax.handler.feature_namespaces

value: `"http://xml.org/sax/features/namespaces"`
<br/>
true: Perform Namespace processing.
<br/>
false: Optionally do not perform Namespace processing (implies
namespace-prefixes; default).
<br/>
access: (parsing) read-only; (not parsing) read/write
<br/>

### xml.sax.handler.feature_namespace_prefixes

value: `"http://xml.org/sax/features/namespace-prefixes"`
<br/>
true: Report the original prefixed names and attributes used for Namespace
declarations.
<br/>
false: Do not report attributes used for Namespace declarations, and
optionally do not report original prefixed names (default).
<br/>
access: (parsing) read-only; (not parsing) read/write
<br/>

### xml.sax.handler.feature_string_interning

value: `"http://xml.org/sax/features/string-interning"`
<br/>
true: All element names, prefixes, attribute names, Namespace URIs, and
local names are interned using the built-in intern function.
<br/>
false: Names are not necessarily interned, although they may be (default).
<br/>
access: (parsing) read-only; (not parsing) read/write
<br/>

### xml.sax.handler.feature_validation

value: `"http://xml.org/sax/features/validation"`
<br/>
true: Report all validation errors (implies external-general-entities and
external-parameter-entities).
<br/>
false: Do not report validation errors.
<br/>
access: (parsing) read-only; (not parsing) read/write
<br/>

### xml.sax.handler.feature_external_ges

#### WARNING
Enabling opens a vulnerability to
[external entity attacks](https://en.wikipedia.org/wiki/XML_external_entity_attack)
if the parser is used with user-provided XML content.
Please reflect on your [threat model](https://en.wikipedia.org/wiki/Threat_model)
before enabling this feature.

value: `"http://xml.org/sax/features/external-general-entities"`
<br/>
true: Include all external general (text) entities.
<br/>
false: Do not include external general entities.
<br/>
access: (parsing) read-only; (not parsing) read/write
<br/>

### xml.sax.handler.feature_external_pes

value: `"http://xml.org/sax/features/external-parameter-entities"`
<br/>
true: Include all external parameter entities, including the external DTD
subset.
<br/>
false: Do not include any external parameter entities, even the external
DTD subset.
<br/>
access: (parsing) read-only; (not parsing) read/write
<br/>

### xml.sax.handler.all_features

List of all features.

### xml.sax.handler.property_lexical_handler

value: `"http://xml.org/sax/properties/lexical-handler"`
<br/>
data type: xml.sax.handler.LexicalHandler (not supported in Python 2)
<br/>
description: An optional extension handler for lexical events like
comments.
<br/>
access: read/write
<br/>

### xml.sax.handler.property_declaration_handler

value: `"http://xml.org/sax/properties/declaration-handler"`
<br/>
data type: xml.sax.sax2lib.DeclHandler (not supported in Python 2)
<br/>
description: An optional extension handler for DTD-related events other
than notations and unparsed entities.
<br/>
access: read/write
<br/>

### xml.sax.handler.property_dom_node

value: `"http://xml.org/sax/properties/dom-node"`
<br/>
data type: org.w3c.dom.Node (not supported in Python 2)
<br/>
description: When parsing, the current DOM node being visited if this is
a DOM iterator; when not parsing, the root DOM node for iteration.
<br/>
access: (parsing) read-only; (not parsing) read/write
<br/>

### xml.sax.handler.property_xml_string

value: `"http://xml.org/sax/properties/xml-string"`
<br/>
data type: Bytes
<br/>
description: The literal string of characters that was the source for the
current event.
<br/>
access: read-only
<br/>

### xml.sax.handler.all_properties

List of all known property names.

<a id="content-handler-objects"></a>

## ContentHandler Objects

Users are expected to subclass [`ContentHandler`](#xml.sax.handler.ContentHandler) to support their
application.  The following methods are called by the parser on the appropriate
events in the input document:

#### ContentHandler.setDocumentLocator(locator)

Called by the parser to give the application a locator for locating the origin
of document events.

SAX parsers are strongly encouraged (though not absolutely required) to supply a
locator: if it does so, it must supply the locator to the application by
invoking this method before invoking any of the other methods in the
DocumentHandler interface.

The locator allows the application to determine the end position of any
document-related event, even if the parser is not reporting an error. Typically,
the application will use this information for reporting its own errors (such as
character content that does not match an application’s business rules). The
information returned by the locator is probably not sufficient for use with a
search engine.

Note that the locator will return correct information only during the invocation
of the events in this interface. The application should not attempt to use it at
any other time.

#### ContentHandler.startDocument()

Receive notification of the beginning of a document.

The SAX parser will invoke this method only once, before any other methods in
this interface or in DTDHandler (except for [`setDocumentLocator()`](#xml.sax.handler.ContentHandler.setDocumentLocator)).

#### ContentHandler.endDocument()

Receive notification of the end of a document.

The SAX parser will invoke this method only once, and it will be the last method
invoked during the parse. The parser shall not invoke this method until it has
either abandoned parsing (because of an unrecoverable error) or reached the end
of input.

#### ContentHandler.startPrefixMapping(prefix, uri)

Begin the scope of a prefix-URI Namespace mapping.

The information from this event is not necessary for normal Namespace
processing: the SAX XML reader will automatically replace prefixes for element
and attribute names when the `feature_namespaces` feature is enabled (the
default).

There are cases, however, when applications need to use prefixes in character
data or in attribute values, where they cannot safely be expanded automatically;
the [`startPrefixMapping()`](#xml.sax.handler.ContentHandler.startPrefixMapping) and [`endPrefixMapping()`](#xml.sax.handler.ContentHandler.endPrefixMapping) events supply the
information to the application to expand prefixes in those contexts itself, if
necessary.

<!-- XXX This is not really the default, is it? MvL -->

Note that [`startPrefixMapping()`](#xml.sax.handler.ContentHandler.startPrefixMapping) and [`endPrefixMapping()`](#xml.sax.handler.ContentHandler.endPrefixMapping) events are not
guaranteed to be properly nested relative to each-other: all
[`startPrefixMapping()`](#xml.sax.handler.ContentHandler.startPrefixMapping) events will occur before the corresponding
[`startElement()`](#xml.sax.handler.ContentHandler.startElement) event, and all [`endPrefixMapping()`](#xml.sax.handler.ContentHandler.endPrefixMapping) events will occur
after the corresponding [`endElement()`](#xml.sax.handler.ContentHandler.endElement) event, but their order is not
guaranteed.

#### ContentHandler.endPrefixMapping(prefix)

End the scope of a prefix-URI mapping.

See [`startPrefixMapping()`](#xml.sax.handler.ContentHandler.startPrefixMapping) for details. This event will always occur after
the corresponding [`endElement()`](#xml.sax.handler.ContentHandler.endElement) event, but the order of
[`endPrefixMapping()`](#xml.sax.handler.ContentHandler.endPrefixMapping) events is not otherwise guaranteed.

#### ContentHandler.startElement(name, attrs)

Signals the start of an element in non-namespace mode.

The *name* parameter contains the raw XML 1.0 name of the element type as a
string and the *attrs* parameter holds an object of the
[Attributes](xml.sax.reader.md#attributes-objects) interface containing the attributes of
the element.  The object passed as *attrs* may be re-used by the parser; holding
on to a reference to it is not a reliable way to keep a copy of the attributes.
To keep a copy of the attributes, use the [`copy()`](copy.md#module-copy) method of the *attrs*
object.

#### ContentHandler.endElement(name)

Signals the end of an element in non-namespace mode.

The *name* parameter contains the name of the element type, just as with the
[`startElement()`](#xml.sax.handler.ContentHandler.startElement) event.

#### ContentHandler.startElementNS(name, qname, attrs)

Signals the start of an element in namespace mode.

The *name* parameter contains the name of the element type as a `(uri,
localname)` tuple, the *qname* parameter contains the raw XML 1.0 name used in
the source document, and the *attrs* parameter holds an instance of the
[AttributesNS](xml.sax.reader.md#attributes-ns-objects) interface
containing the attributes of the element.  If no namespace is associated with
the element, the *uri* component of *name* will be `None`.  The object passed
as *attrs* may be re-used by the parser; holding on to a reference to it is not
a reliable way to keep a copy of the attributes.  To keep a copy of the
attributes, use the [`copy()`](copy.md#module-copy) method of the *attrs* object.

Parsers may set the *qname* parameter to `None`, unless the
`feature_namespace_prefixes` feature is activated.

#### ContentHandler.endElementNS(name, qname)

Signals the end of an element in namespace mode.

The *name* parameter contains the name of the element type, just as with the
[`startElementNS()`](#xml.sax.handler.ContentHandler.startElementNS) method, likewise the *qname* parameter.

#### ContentHandler.characters(content)

Receive notification of character data.

The Parser will call this method to report each chunk of character data. SAX
parsers may return all contiguous character data in a single chunk, or they may
split it into several chunks; however, all of the characters in any single event
must come from the same external entity so that the Locator provides useful
information.

*content* may be a string or bytes instance; the `expat` reader module
always produces strings.

#### NOTE
The earlier SAX 1 interface provided by the Python XML Special Interest Group
used a more Java-like interface for this method.  Since most parsers used from
Python did not take advantage of the older interface, the simpler signature was
chosen to replace it.  To convert old code to the new interface, use *content*
instead of slicing content with the old *offset* and *length* parameters.

#### ContentHandler.ignorableWhitespace(whitespace)

Receive notification of ignorable whitespace in element content.

Validating Parsers must use this method to report each chunk of ignorable
whitespace (see the W3C XML 1.0 recommendation, section 2.10): non-validating
parsers may also use this method if they are capable of parsing and using
content models.

SAX parsers may return all contiguous whitespace in a single chunk, or they may
split it into several chunks; however, all of the characters in any single event
must come from the same external entity, so that the Locator provides useful
information.

#### ContentHandler.processingInstruction(target, data)

Receive notification of a processing instruction.

The Parser will invoke this method once for each processing instruction found:
note that processing instructions may occur before or after the main document
element.

A SAX parser should never report an XML declaration (XML 1.0, section 2.8) or a
text declaration (XML 1.0, section 4.3.1) using this method.

#### ContentHandler.skippedEntity(name)

Receive notification of a skipped entity.

The Parser will invoke this method once for each entity skipped. Non-validating
processors may skip entities if they have not seen the declarations (because,
for example, the entity was declared in an external DTD subset). All processors
may skip external entities, depending on the values of the
`feature_external_ges` and the `feature_external_pes` properties.

<a id="dtd-handler-objects"></a>

## DTDHandler Objects

[`DTDHandler`](#xml.sax.handler.DTDHandler) instances provide the following methods:

#### DTDHandler.notationDecl(name, publicId, systemId)

Handle a notation declaration event.

#### DTDHandler.unparsedEntityDecl(name, publicId, systemId, ndata)

Handle an unparsed entity declaration event.

<a id="entity-resolver-objects"></a>

## EntityResolver Objects

#### EntityResolver.resolveEntity(publicId, systemId)

Resolve the system identifier of an entity and return either the system
identifier to read from as a string, or an InputSource to read from. The default
implementation returns *systemId*.

<a id="sax-error-handler"></a>

## ErrorHandler Objects

Objects with this interface are used to receive error and warning information
from the [`XMLReader`](xml.sax.reader.md#xml.sax.xmlreader.XMLReader).  If you create an object that
implements this interface, then register the object with your
[`XMLReader`](xml.sax.reader.md#xml.sax.xmlreader.XMLReader), the parser
will call the methods in your object to report all warnings and errors. There
are three levels of errors available: warnings, (possibly) recoverable errors,
and unrecoverable errors.  All methods take a [`SAXParseException`](xml.sax.md#xml.sax.SAXParseException) as the
only parameter.  Errors and warnings may be converted to an exception by raising
the passed-in exception object.

#### ErrorHandler.error(exception)

Called when the parser encounters a recoverable error.  If this method does not
raise an exception, parsing may continue, but further document information
should not be expected by the application.  Allowing the parser to continue may
allow additional errors to be discovered in the input document.

#### ErrorHandler.fatalError(exception)

Called when the parser encounters an error it cannot recover from; parsing is
expected to terminate when this method returns.

#### ErrorHandler.warning(exception)

Called when the parser presents minor warning information to the application.
Parsing is expected to continue when this method returns, and document
information will continue to be passed to the application. Raising an exception
in this method will cause parsing to end.

<a id="lexical-handler-objects"></a>

## LexicalHandler Objects

Optional SAX2 handler for lexical events.

This handler is used to obtain lexical information about an XML
document. Lexical information includes information describing the
document encoding used and XML comments embedded in the document, as
well as section boundaries for the DTD and for any CDATA sections.
The lexical handlers are used in the same manner as content handlers.

Set the LexicalHandler of an XMLReader by using the setProperty method
with the property identifier
`'http://xml.org/sax/properties/lexical-handler'`.

#### LexicalHandler.comment(content)

Reports a comment anywhere in the document (including the DTD and
outside the document element).

#### LexicalHandler.startDTD(name, public_id, system_id)

Reports the start of the DTD declarations if the document has an
associated DTD.

#### LexicalHandler.endDTD()

Reports the end of DTD declaration.

#### LexicalHandler.startCDATA()

Reports the start of a CDATA marked section.

The contents of the CDATA marked section will be reported through
the characters handler.

#### LexicalHandler.endCDATA()

Reports the end of a CDATA marked section.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
