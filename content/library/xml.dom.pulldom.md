# `xml.dom.pulldom` — Support for building partial DOM trees

**Source code:** [Lib/xml/dom/pulldom.py](https://github.com/python/cpython/tree/main/Lib/xml/dom/pulldom.py)

---

The `xml.dom.pulldom` module provides a “pull parser” which can also be
asked to produce DOM-accessible fragments of the document where necessary. The
basic concept involves pulling “events” from a stream of incoming XML and
processing them. In contrast to SAX which also employs an event-driven
processing model together with callbacks, the user of a pull parser is
responsible for explicitly pulling events from the stream, looping over those
events until either processing is finished or an error condition occurs.

#### NOTE
If you need to parse untrusted or unauthenticated data, see
[XML security](xml.md#xml-security).

#### Versionchanged
Changed in version 3.7.1: The SAX parser no longer processes general external entities by default to
increase security by default. To enable processing of external entities,
pass a custom parser instance in:

```python3
from xml.dom.pulldom import parse
from xml.sax import make_parser
from xml.sax.handler import feature_external_ges

parser = make_parser()
parser.setFeature(feature_external_ges, True)
parse(filename, parser=parser)
```

Example:

```python3
from xml.dom import pulldom

doc = pulldom.parse('sales_items.xml')
for event, node in doc:
    if event == pulldom.START_ELEMENT and node.tagName == 'item':
        if int(node.getAttribute('price')) > 50:
            doc.expandNode(node)
            print(node.toxml())
```

`event` is a constant and can be one of:

* `START_ELEMENT`
* `END_ELEMENT`
* `COMMENT`
* `START_DOCUMENT`
* `END_DOCUMENT`
* `CHARACTERS`
* `PROCESSING_INSTRUCTION`
* `IGNORABLE_WHITESPACE`

`node` is an object of type `xml.dom.minidom.Document`,
`xml.dom.minidom.Element` or `xml.dom.minidom.Text`.

Since the document is treated as a “flat” stream of events, the document “tree”
is implicitly traversed and the desired elements are found regardless of their
depth in the tree. In other words, one does not need to consider hierarchical
issues such as recursive searching of the document nodes, although if the
context of elements were important, one would either need to maintain some
context-related state (i.e. remembering where one is in the document at any
given point) or to make use of the [`DOMEventStream.expandNode()`](#xml.dom.pulldom.DOMEventStream.expandNode) method
and switch to DOM-related processing.

### *class* xml.dom.pulldom.PullDOM(documentFactory=None)

Subclass of [`xml.sax.handler.ContentHandler`](xml.sax.handler.md#xml.sax.handler.ContentHandler).

### *class* xml.dom.pulldom.SAX2DOM(documentFactory=None)

Subclass of [`xml.sax.handler.ContentHandler`](xml.sax.handler.md#xml.sax.handler.ContentHandler).

### xml.dom.pulldom.parse(stream_or_string, parser=None, bufsize=None)

Return a [`DOMEventStream`](#xml.dom.pulldom.DOMEventStream) from the given input. *stream_or_string* may be
either a file name, or a file-like object. *parser*, if given, must be an
[`XMLReader`](xml.sax.reader.md#xml.sax.xmlreader.XMLReader) object. This function will change the
document handler of the
parser and activate namespace support; other parser configuration (like
setting an entity resolver) must have been done in advance.

If you have XML in a string, you can use the [`parseString()`](#xml.dom.pulldom.parseString) function instead:

### xml.dom.pulldom.parseString(string, parser=None)

Return a [`DOMEventStream`](#xml.dom.pulldom.DOMEventStream) that represents the (Unicode) *string*.

### xml.dom.pulldom.default_bufsize

Default value for the *bufsize* parameter to [`parse()`](#xml.dom.pulldom.parse).

The value of this variable can be changed before calling [`parse()`](#xml.dom.pulldom.parse) and
the new value will take effect.

<a id="domeventstream-objects"></a>

## DOMEventStream Objects

### *class* xml.dom.pulldom.DOMEventStream(stream, parser, bufsize)

#### Versionchanged
Changed in version 3.11: Support for [`__getitem__()`](../reference/datamodel.md#object.__getitem__) method has been removed.

#### getEvent()

Return a tuple containing *event* and the current *node* as
`xml.dom.minidom.Document` if event equals `START_DOCUMENT`,
`xml.dom.minidom.Element` if event equals `START_ELEMENT` or
`END_ELEMENT` or `xml.dom.minidom.Text` if event equals
`CHARACTERS`.
The current node does not contain information about its children, unless
[`expandNode()`](#xml.dom.pulldom.DOMEventStream.expandNode) is called.

#### expandNode(node)

Expands all children of *node* into *node*. Example:

```python3
from xml.dom import pulldom

xml = '<html><title>Foo</title> <p>Some text <div>and more</div></p> </html>'
doc = pulldom.parseString(xml)
for event, node in doc:
    if event == pulldom.START_ELEMENT and node.tagName == 'p':
        # Following statement only prints '<p/>'
        print(node.toxml())
        doc.expandNode(node)
        # Following statement prints node with all its children '<p>Some text <div>and more</div></p>'
        print(node.toxml())
```

#### reset()

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
