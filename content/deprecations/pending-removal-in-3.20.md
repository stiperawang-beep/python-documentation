# Pending removal in Python 3.20

* Calling the `__new__()` method of [`struct.Struct`](../library/struct.md#struct.Struct) without the
  *format* argument is deprecated and will be removed in Python 3.20.  Calling
  [`__init__()`](../reference/datamodel.md#object.__init__) method on initialized [`Struct`](../library/struct.md#struct.Struct)
  objects is deprecated and will be removed in Python 3.20.

  (Contributed by Sergey B Kirpichev and Serhiy Storchaka in [gh-143715](https://github.com/python/cpython/issues/143715).)
* The `__version__`, `version` and `VERSION` attributes have been
  deprecated in these standard library modules and will be removed in
  Python 3.20. Use [`sys.version_info`](../library/sys.md#sys.version_info) instead.
  - [`argparse`](../library/argparse.md#module-argparse)
  - [`csv`](../library/csv.md#module-csv)
  - [`ctypes`](../library/ctypes.md#module-ctypes)
  - `ctypes.macholib`
  - [`decimal`](../library/decimal.md#module-decimal) (use [`decimal.SPEC_VERSION`](../library/decimal.md#decimal.SPEC_VERSION) instead)
  - [`http.server`](../library/http.server.md#module-http.server)
  - [`imaplib`](../library/imaplib.md#module-imaplib)
  - [`ipaddress`](../library/ipaddress.md#module-ipaddress)
  - [`json`](../library/json.md#module-json)
  - [`logging`](../library/logging.md#module-logging) (`__date__` also deprecated)
  - [`optparse`](../library/optparse.md#module-optparse)
  - [`pickle`](../library/pickle.md#module-pickle)
  - [`platform`](../library/platform.md#module-platform)
  - [`re`](../library/re.md#module-re)
  - [`socketserver`](../library/socketserver.md#module-socketserver)
  - [`tabnanny`](../library/tabnanny.md#module-tabnanny)
  - [`tarfile`](../library/tarfile.md#module-tarfile)
  - [`tkinter.font`](../library/tkinter.font.md#module-tkinter.font)
  - [`tkinter.ttk`](../library/tkinter.ttk.md#module-tkinter.ttk)
  - [`wsgiref.simple_server`](../library/wsgiref.md#module-wsgiref.simple_server)
  - [`xml.etree.ElementTree`](../library/xml.etree.elementtree.md#module-xml.etree.ElementTree)
  - `xml.sax.expatreader`
  - [`xml.sax.handler`](../library/xml.sax.handler.md#module-xml.sax.handler)
  - [`zlib`](../library/zlib.md#module-zlib)

  (Contributed by Hugo van Kemenade and Stan Ulbrych in [gh-76007](https://github.com/python/cpython/issues/76007).)

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
