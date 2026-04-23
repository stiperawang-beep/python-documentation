# Pending removal in Python 3.14

* The `ma_version_tag` field in [`PyDictObject`](../c-api/dict.md#c.PyDictObject) for extension modules
  ([**PEP 699**](https://peps.python.org/pep-0699/); [gh-101193](https://github.com/python/cpython/issues/101193)).
* Creating [`immutable types`](../c-api/typeobj.md#c.Py_TPFLAGS_IMMUTABLETYPE) with mutable
  bases ([gh-95388](https://github.com/python/cpython/issues/95388)).

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
