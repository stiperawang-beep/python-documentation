# Pending removal in Python 3.20

* `_PyObject_CallMethodId()`, `_PyObject_GetAttrId()` and
  `_PyUnicode_FromId()` are deprecated since 3.15 and will be removed in
  3.20. Instead, use [`PyUnicode_InternFromString()`](../c-api/unicode.md#c.PyUnicode_InternFromString) and cache the result in
  the module state, then call [`PyObject_CallMethod()`](../c-api/call.md#c.PyObject_CallMethod) or
  [`PyObject_GetAttr()`](../c-api/object.md#c.PyObject_GetAttr).
  (Contributed by Victor Stinner in [gh-141049](https://github.com/python/cpython/issues/141049).)
* The `cval` field in [`PyComplexObject`](../c-api/complex.md#c.PyComplexObject) ([gh-128813](https://github.com/python/cpython/issues/128813)).
  Use [`PyComplex_AsCComplex()`](../c-api/complex.md#c.PyComplex_AsCComplex) and [`PyComplex_FromCComplex()`](../c-api/complex.md#c.PyComplex_FromCComplex)
  to convert a Python complex number to/from the C [`Py_complex`](../c-api/complex.md#c.Py_complex)
  representation.
* Macros `Py_MATH_PIl` and `Py_MATH_El`.

<!-- Apparently this how you hack together a formatted link:
(https://www.docutils.org/docs/ref/rst/directives.html#replacement-text) -->
